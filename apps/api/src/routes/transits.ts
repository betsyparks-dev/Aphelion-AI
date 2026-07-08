import { FastifyInstance } from 'fastify';
import { getDb } from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';
import { analyzeDailyTransits } from '../services/transits.js';

export function registerTransitRoutes(app: FastifyInstance): void {
  app.get('/api/transits/today', { preHandler: [authenticate] }, async (request, reply) => {
    const db = getDb();
    const chart = db.prepare('SELECT chart_data FROM charts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(request.user!.userId) as any;
    if (!chart) return reply.status(400).send({ error: 'No birth chart found.' });

    const chartData = JSON.parse(chart.chart_data);
    const transits = analyzeDailyTransits(chartData.planets);
    return reply.send({ transits, date: new Date().toISOString().split('T')[0] });
  });

  app.get('/api/transits/calendar', { preHandler: [authenticate] }, async (request, reply) => {
    const db = getDb();
    const { start, end } = request.query as { start?: string; end?: string };

    let query = 'SELECT * FROM transit_events WHERE user_id = ?';
    const params: any[] = [request.user!.userId];

    if (start) { query += ' AND event_date >= ?'; params.push(start); }
    if (end) { query += ' AND event_date <= ?'; params.push(end); }
    query += ' ORDER BY event_date ASC';

    const events = db.prepare(query).all(...params);
    return reply.send({ events });
  });
}