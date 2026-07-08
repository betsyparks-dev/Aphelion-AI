import { FastifyInstance } from 'fastify';
import { getDb } from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';
import { analyzeDailyTransits, generateHoroscopeText } from '../services/transits.js';
import { v4 as uuidv4 } from 'uuid';

export function registerHoroscopeRoutes(app: FastifyInstance): void {
  app.get('/api/horoscope/daily', { preHandler: [authenticate] }, async (request, reply) => {
    const db = getDb();
    const userId = request.user!.userId;
    const today = new Date().toISOString().split('T')[0];

    const existing = db.prepare("SELECT id, content, sign_type FROM horoscope_history WHERE user_id = ? AND date = ? AND type = 'daily'").get(userId, today) as any;
    if (existing) return reply.send({ horoscope: { id: existing.id, content: existing.content, date: today, type: 'daily', signType: existing.sign_type } });

    const chart = db.prepare('SELECT chart_data, name FROM charts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(userId) as any;
    if (!chart) return reply.status(400).send({ error: 'No birth chart found. Calculate your chart first.' });

    const chartData = JSON.parse(chart.chart_data);
    const transitEvents = analyzeDailyTransits(chartData.planets);
    const content = generateHoroscopeText(chart.name || 'Your chart', transitEvents, 'full_chart');

    const id = uuidv4();
    db.prepare('INSERT INTO horoscope_history (id, user_id, date, type, sign_type, content, aspects) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, userId, today, 'daily', 'full_chart', content, JSON.stringify(transitEvents));

    return reply.send({ horoscope: { id, content, date: today, type: 'daily', signType: 'full_chart', transits: transitEvents } });
  });

  app.get('/api/horoscope/weekly', { preHandler: [authenticate] }, async (request, reply) => {
    const db = getDb();
    const userId = request.user!.userId;
    const chart = db.prepare('SELECT chart_data, name FROM charts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(userId) as any;
    if (!chart) return reply.status(400).send({ error: 'No birth chart found.' });

    const chartData = JSON.parse(chart.chart_data);
    const transitEvents = analyzeDailyTransits(chartData.planets);
    const content = generateHoroscopeText(chart.name || 'Your chart', transitEvents, 'weekly');

    const id = uuidv4();
    const today = new Date().toISOString().split('T')[0];
    db.prepare('INSERT INTO horoscope_history (id, user_id, date, type, sign_type, content, aspects) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, userId, today, 'weekly', 'full_chart', content, JSON.stringify(transitEvents));

    return reply.send({ horoscope: { id, content, date: today, type: 'weekly', signType: 'full_chart', transits: transitEvents } });
  });

  app.get('/api/horoscope/history', { preHandler: [authenticate] }, async (request, reply) => {
    const db = getDb();
    const { limit = '30' } = request.query as { limit?: string };
    const horoscopes = db.prepare('SELECT id, date, type, sign_type, content FROM horoscope_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?').all(request.user!.userId, parseInt(limit, 10));
    return reply.send({ horoscopes });
  });
}