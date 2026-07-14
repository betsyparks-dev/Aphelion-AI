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
  ephePath: process.env.EPHE_PATH || path.resolve(__dirname, '../ephe'),
  dataDir: path.resolve(__dirname, '../data'),
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    priceIds: {
      premiumMonthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || '',
      premiumYearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || '',
      birthChartReport: process.env.STRIPE_BIRTH_CHART_REPORT_PRICE_ID || 'price_1TspT1DyIytljhWHJmTKrFqR',
      compatibilityReport: process.env.STRIPE_COMPATIBILITY_REPORT_PRICE_ID || 'price_1TspT2DyIytljhWH9DNycl28',
    },
  },
  dailyHoroscopeTime: process.env.DAILY_HOROSCOPE_TIME || '08:00',
};