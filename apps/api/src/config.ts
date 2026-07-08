import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  host: process.env.HOST || '0.0.0.0',
  jwtSecret: process.env.JWT_SECRET || 'astral-lens-dev-secret',
  databasePath: process.env.DATABASE_PATH || path.resolve(__dirname, '../data/astral-lens.db'),
  dataDir: path.resolve(__dirname, '../data'),
  ephePath: process.env.EPHE_PATH || path.resolve(__dirname, '../ephe'),
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  dailyHoroscopeTime: process.env.DAILY_HOROSCOPE_TIME || '08:00',
};