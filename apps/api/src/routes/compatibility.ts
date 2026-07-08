import { FastifyInstance } from 'fastify';
import { getDb } from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';
import { calculateCompatibilityScore } from '../services/transits.js';

export function registerCompatibilityRoutes(app: FastifyInstance): void {
  app.post('/api/compatibility', { preHandler: [authenticate] }, async (request, reply) => {
    const { targetChartId } = request.body as { targetChartId?: string };
    if (!targetChartId) return reply.status(400).send({ error: 'targetChartId is required.' });

    const db = getDb();
    const myChart = db.prepare('SELECT chart_data, name FROM charts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(request.user!.userId) as any;
    if (!myChart) return reply.status(400).send({ error: 'No birth chart found for current user.' });

    const targetChart = db.prepare('SELECT chart_data, name FROM charts WHERE id = ?').get(targetChartId) as any;
    if (!targetChart) return reply.status(404).send({ error: 'Target chart not found.' });

    const myData = JSON.parse(myChart.chart_data);
    const targetData = JSON.parse(targetChart.chart_data);

    const result = calculateCompatibilityScore(myData.planets, targetData.planets);
    return reply.send({
      compatibility: { score: result.score, summary: result.summary, aspects: result.aspects },
      charts: { mine: myChart.name, target: targetChart.name },
    });
  });

  // Compatibility by sharing full chart data
  app.post('/api/compatibility/calculate', { preHandler: [authenticate] }, async (request, reply) => {
    const { chart1, chart2 } = request.body as { chart1?: any; chart2?: any };
    if (!chart1 || !chart2) return reply.status(400).send({ error: 'Both chart1 and chart2 data required.' });

    const result = calculateCompatibilityScore(chart1.planets || chart1, chart2.planets || chart2);
    return reply.send({ compatibility: result });
  });
}