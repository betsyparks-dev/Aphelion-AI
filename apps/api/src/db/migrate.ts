#!/usr/bin/env tsx
import { runMigrations } from './schema.js';

console.log('Running database migrations...');
runMigrations();
console.log('Migrations complete.');