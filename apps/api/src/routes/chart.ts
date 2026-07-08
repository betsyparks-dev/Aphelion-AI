import { FastifyInstance } from 'fastify';
import { getDb } from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';
import { calculateBirthChart } from '../services/ephemeris.js';
import { v4 as uuidv4 } from 'uuid';

export function registerChartRoutes(app: FastifyInstance): void {
  // POST /api/chart/calculate
  app.post('/api/chart/calculate', { preHandler: [authenticate] }, async (request, reply) => {
    const { birthDate, birthTime, latitude, longitude, locationName, timezoneOffset, name } = request.body as {
      birthDate?: string;
      birthTime?: string;
      latitude?: number;
      longitude?: number;
      locationName?: string;
      timezoneOffset?: number;
      name?: string;
    };

    if (!birthDate || !birthTime || latitude === undefined || longitude === undefined || timezoneOffset === undefined) {
      return reply.status(400).send({
        error: 'birthDate, birthTime, latitude, longitude, and timezoneOffset are required.',
      });
    }

    try {
      const chartData = calculateBirthChart(birthDate, birthTime, latitude, longitude, timezoneOffset);
      const chartJson = JSON.stringify(chartData);

      const db = getDb();
      const id = uuidv4();

      db.prepare(`
        INSERT INTO charts (id, user_id, name, birth_date, birth_time, latitude, longitude, location_name, timezone_offset, chart_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, request.user!.userId, name || 'My Birth Chart', birthDate, birthTime, latitude, longitude, locationName || null, timezoneOffset, chartJson);

      return reply.status(201).send({
        chart: {
          id,
          name: name || 'My Birth Chart',
          birthDate,
          birthTime,
          latitude,
          longitude,
          locationName: locationName || null,
          timezoneOffset,
          data: chartData,
        },
      });
    } catch (err) {
      console.error('Chart calculation failed:', err);
      return reply.status(500).send({ error: 'Failed to calculate birth chart. Check your input values.' });
    }
  });

  // GET /api/charts
  app.get('/api/charts', { preHandler: [authenticate] }, async (request, reply) => {
    const db = getDb();
    const charts = db.prepare(
      'SELECT id, name, birth_date, birth_time, location_name, created_at FROM charts WHERE user_id = ? ORDER BY created_at DESC'
    ).all(request.user!.userId);

    return reply.send({ charts });
  });

  // GET /api/chart/:id
  app.get('/api/chart/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const db = getDb();

    const chart = db.prepare(
      'SELECT * FROM charts WHERE id = ? AND user_id = ?'
    ).get(id, request.user!.userId) as any;

    if (!chart) {
      return reply.status(404).send({ error: 'Chart not found.' });
    }

    return reply.send({
      chart: {
        ...chart,
        chart_data: JSON.parse(chart.chart_data || '{}'),
      },
    });
  });
}