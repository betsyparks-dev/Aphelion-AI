import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config.js';
import { runMigrations } from './db/schema.js';
import { initEphemeris } from './services/ephemeris.js';
import { registerAuthRoutes } from './routes/auth.js';
import { registerChartRoutes } from './routes/chart.js';
import { registerHoroscopeRoutes } from './routes/horoscope.js';
import { registerCompatibilityRoutes } from './routes/compatibility.js';
import { registerTransitRoutes } from './routes/transits.js';
import { registerSubscriptionRoutes } from './routes/subscriptions.js';
import cron from 'node-cron';
import fs from 'fs';

// Ensure data directory exists
if (!fs.existsSync(config.dataDir)) {
  fs.mkdirSync(config.dataDir, { recursive: true });
}

const app = Fastify({ logger: true });

// Register CORS
await app.register(cors, {
  origin: ['http://localhost:3000', 'http://localhost:8081', 'https://cc3c02f136c99eb138152d7c47768828.ctonew.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Health check
app.get('/api/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

// Register routes
registerAuthRoutes(app);
registerChartRoutes(app);
registerHoroscopeRoutes(app);
registerCompatibilityRoutes(app);
registerTransitRoutes(app);
registerSubscriptionRoutes(app);

// Initialize
try {
  initEphemeris();
  console.log('Swiss Ephemeris initialized.');
} catch (err) {
  console.warn('Swiss Ephemeris init skipped (will use fallback):', err);
}

try {
  runMigrations();
  console.log('Database migrations applied.');
} catch (err) {
  console.error('Migration failed:', err);
  process.exit(1);
}

// Schedule daily horoscope delivery
const [hour, minute] = config.dailyHoroscopeTime.split(':').map(Number);
cron.schedule(`${minute} ${hour} * * *`, () => {
  console.log('Daily horoscope generation scheduled job triggered.');
  // In production, this would iterate users and send push notifications
});

// Start server
try {
  await app.listen({ port: config.port, host: config.host });
  console.log(`Astral Lens API running on http://${config.host}:${config.port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down...');
  await app.close();
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;