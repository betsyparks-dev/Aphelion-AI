/**
 * Server-only authentication utilities.
 * Use only inside createServerFn() handlers - never in client code.
 */
import { createServerFn } from "@tanstack/react-start";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { parse, serialize } from "cookie";
import { sql } from "~/db";

const JWT_SECRET = process.env.JWT_SECRET || "ideaforge-dev-secret-change-in-production";
const COOKIE_NAME = "ideaforge_session";

export type User = {
  id: string;
  email: string;
  name: string;
  subscription_tier: "free" | "starter" | "pro";
};

/** Hash a password for storage */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/** Verify a password against its hash */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Create a JWT for a user */
export function createToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, sub: user.subscription_tier },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
}

/** Verify and decode a JWT */
export function verifyToken(token: string): { id: string; email: string; name: string; subscription_tier: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return { id: decoded.id, email: decoded.email, name: decoded.name, subscription_tier: decoded.sub || "free" };
  } catch {
    return null;
  }
}

/** Create the session cookie string */
export function createSessionCookie(token: string): string {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/** Clear the session cookie */
export function clearSessionCookie(): string {
  return serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/** Extract user from request headers (cookies) */
export function getUserFromRequest(headers: Headers): User | null {
  const cookieHeader = headers.get("cookie");
  if (!cookieHeader) return null;
  const cookies = parse(cookieHeader);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  const payload = verifyToken(token);
  return payload as User | null;
}

// ---- Server Functions ----

export const signup = createServerFn({ method: "POST" })
  .validator((data: { email: string; name: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { email, name, password } = data;

    // Validate
    if (!email || !name || !password) {
      return { error: "All fields are required" };
    }
    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    try {
      const db = sql();
      // Check if user exists
      const existing = await db`SELECT id FROM users WHERE email = ${email}`;
      if (existing.length > 0) {
        return { error: "An account with this email already exists" };
      }

      const passwordHash = await hashPassword(password);
      const result = await db`
        INSERT INTO users (email, name, password_hash, subscription_tier)
        VALUES (${email}, ${name}, ${passwordHash}, 'free')
        RETURNING id, email, name, subscription_tier
      `;

      const user: User = {
        id: result[0].id,
        email: result[0].email,
        name: result[0].name,
        subscription_tier: result[0].subscription_tier,
      };

      const token = createToken(user);
      const cookie = createSessionCookie(token);

      return { user, cookie };
    } catch (err: any) {
      return { error: err.message || "Signup failed" };
    }
  });

export const login = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { email, password } = data;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    try {
      const db = sql();
      const result = await db`
        SELECT id, email, name, password_hash, subscription_tier
        FROM users WHERE email = ${email}
      `;

      if (result.length === 0) {
        return { error: "Invalid email or password" };
      }

      const row = result[0];
      const valid = await verifyPassword(password, row.password_hash);
      if (!valid) {
        return { error: "Invalid email or password" };
      }

      const user: User = {
        id: row.id,
        email: row.email,
        name: row.name,
        subscription_tier: row.subscription_tier,
      };

      const token = createToken(user);
      const cookie = createSessionCookie(token);

      return { user, cookie };
    } catch (err: any) {
      return { error: err.message || "Login failed" };
    }
  });

export const logout = createServerFn({ method: "POST" })
  .handler(async () => {
    return { cookie: clearSessionCookie() };
  });

export const getCurrentUser = createServerFn({ method: "GET" })
  .handler(async ({ request }) => {
    const user = getUserFromRequest(request.headers);
    return { user };
  });