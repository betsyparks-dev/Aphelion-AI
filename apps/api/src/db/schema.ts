import Database from 'better-sqlite3';
import { getDb } from './connection.js';

const SCHEMA = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  timezone TEXT DEFAULT 'UTC',
  push_token TEXT
);

-- Birth charts (one per user)
CREATE TABLE IF NOT EXISTS charts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'My Birth Chart',
  birth_date TEXT NOT NULL,
  birth_time TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  location_name TEXT,
  timezone_offset INTEGER NOT NULL,
  chart_data TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_charts_user_id ON charts(user_id);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  plan TEXT NOT NULL CHECK(plan IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TEXT,
  current_period_end TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- One-time purchases
CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  product_type TEXT NOT NULL CHECK(product_type IN ('birth_chart_report', 'compatibility_report')),
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'completed' CHECK(status IN ('completed', 'refunded', 'failed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);

-- User preferences
CREATE TABLE IF NOT EXISTS preferences (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  daily_horoscope_enabled INTEGER NOT NULL DEFAULT 1,
  push_notifications_enabled INTEGER NOT NULL DEFAULT 1,
  preferred_sign_type TEXT DEFAULT 'sun' CHECK(preferred_sign_type IN ('sun', 'moon', 'rising')),
  theme TEXT DEFAULT 'dark',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Horoscope history
CREATE TABLE IF NOT EXISTS horoscope_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('daily', 'weekly')),
  sign_type TEXT NOT NULL CHECK(sign_type IN ('sun', 'moon', 'rising', 'full_chart')),
  content TEXT NOT NULL,
  aspects TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_horoscope_history_user_date ON horoscope_history(user_id, date);
CREATE INDEX IF NOT EXISTS idx_horoscope_history_user_type ON horoscope_history(user_id, type);

-- Transit calendar events
CREATE TABLE IF NOT EXISTS transit_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  planet TEXT NOT NULL,
  aspect_type TEXT NOT NULL,
  orb REAL,
  event_date TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'minor' CHECK(severity IN ('major', 'moderate', 'minor')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_transit_events_user_date ON transit_events(user_id, event_date);
`;

export function runMigrations(): void {
  const db = getDb();
  
  // Run schema in a transaction
  db.transaction(() => {
    // Split by semicolons and execute each statement
    const statements = SCHEMA
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const stmt of statements) {
      db.exec(stmt + ';');
    }
  })();

  // Track migration version
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const existing = db.prepare("SELECT id FROM _migrations WHERE name = '001_initial_schema'").get();
  if (!existing) {
    db.prepare("INSERT INTO _migrations (name) VALUES ('001_initial_schema')").run();
    console.log('Migration 001_initial_schema applied.');
  }
}

// Run directly
if (process.argv[1]?.includes('migrate')) {
  runMigrations();
  console.log('Migrations complete.');
  process.exit(0);
}