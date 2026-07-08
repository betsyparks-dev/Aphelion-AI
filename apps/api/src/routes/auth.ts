import { FastifyInstance } from 'fastify';
import { getDb } from '../db/connection.js';
import { generateToken, authenticate } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export function registerAuthRoutes(app: FastifyInstance): void {
  app.post('/api/auth/register', async (request, reply) => {
    const { email, password, displayName } = request.body as Record<string, string | undefined>;
    if (!email || !password) return reply.status(400).send({ error: 'Email and password required.' });
    if (password.length < 8) return reply.status(400).send({ error: 'Password must be at least 8 characters.' });

    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return reply.status(409).send({ error: 'Account already exists.' });

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);
    db.prepare('INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)').run(id, email, passwordHash, displayName || null);
    db.prepare('INSERT INTO preferences (user_id) VALUES (?)').run(id);

    const token = generateToken({ userId: id, email });
    return reply.status(201).send({ user: { id, email, displayName: displayName || null }, token });
  });

  app.post('/api/auth/login', async (request, reply) => {
    const { email, password } = request.body as Record<string, string | undefined>;
    if (!email || !password) return reply.status(400).send({ error: 'Email and password required.' });

    const db = getDb();
    const user = db.prepare('SELECT id, email, password_hash, display_name FROM users WHERE email = ?').get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return reply.status(401).send({ error: 'Invalid email or password.' });
    }

    const token = generateToken({ userId: user.id, email: user.email });
    return reply.send({ user: { id: user.id, email: user.email, displayName: user.display_name }, token });
  });

  app.get('/api/auth/me', { preHandler: [authenticate] }, async (request, reply) => {
    const db = getDb();
    const user = db.prepare('SELECT id, email, display_name, timezone, created_at FROM users WHERE id = ?').get(request.user!.userId) as any;
    if (!user) return reply.status(404).send({ error: 'User not found.' });

    const preferences = db.prepare('SELECT * FROM preferences WHERE user_id = ?').get(request.user!.userId);
    return reply.send({ user: { id: user.id, email: user.email, displayName: user.display_name, timezone: user.timezone, createdAt: user.created_at }, preferences });
  });
}