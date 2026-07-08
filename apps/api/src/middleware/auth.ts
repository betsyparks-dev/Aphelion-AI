import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export interface JwtPayload {
  userId: string;
  email: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

/**
 * Verify JWT token from Authorization header
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '30d' });
}

/**
 * Fastify middleware: require authenticated user
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    reply.status(401).send({ error: 'Authentication required. Provide a Bearer token.' });
    return;
  }
  
  const token = authHeader.slice(7);
  
  try {
    const payload = verifyToken(token);
    request.user = payload;
  } catch (err) {
    reply.status(401).send({ error: 'Invalid or expired token.' });
    return;
  }
}