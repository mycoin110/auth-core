import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import type { AuthCoreConfig } from "./config.js";
import type { SessionRow, UserRow } from "./types.js";

const BCRYPT_ROUNDS = 10;

// ---------- 密码 ----------
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ---------- Session ----------
export interface SessionWithUser {
  user: UserRow;
  session: SessionRow;
}

export function createSession(
  config: AuthCoreConfig,
  db: import("better-sqlite3").Database,
  userId: number,
): { token: string; expiresAt: number } {
  const token = randomBytes(32).toString("hex");
  const now = Date.now();
  const expiresAt = now + config.sessionTtlMs;
  db.prepare(
    `INSERT INTO sessions (token, user_id, created_at, expires_at)
     VALUES (?, ?, ?, ?)`,
  ).run(token, userId, now, expiresAt);
  return { token, expiresAt };
}

export function findSession(
  config: AuthCoreConfig,
  db: import("better-sqlite3").Database,
  token: string,
): SessionWithUser | null {
  const session = db
    .prepare<[string], SessionRow>("SELECT * FROM sessions WHERE token = ?")
    .get(token);
  if (!session) return null;
  if (session.expires_at < Date.now()) {
    revokeSession(db, token);
    return null;
  }
  const user = db
    .prepare<[number], UserRow>("SELECT * FROM users WHERE id = ?")
    .get(session.user_id);
  if (!user) return null;
  return { user, session };
}

export function slideSession(
  config: AuthCoreConfig,
  db: import("better-sqlite3").Database,
  token: string,
): void {
  const expiresAt = Date.now() + config.sessionTtlMs;
  db.prepare("UPDATE sessions SET expires_at = ? WHERE token = ?").run(expiresAt, token);
}

export function revokeSession(
  db: import("better-sqlite3").Database,
  token: string,
): void {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function revokeAllSessionsForUser(
  db: import("better-sqlite3").Database,
  userId: number,
): void {
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
}

// ---------- Email 校验 ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return typeof email === "string" && email.length <= 254 && EMAIL_RE.test(email);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// ---------- 登录失败限速（内存版）----------
const FAIL_WINDOW_MS = 15 * 60 * 1000;
const FAIL_THRESHOLD = 5;
const failedAttempts = new Map<string, { count: number; firstAt: number }>();

export function isLockedOut(key: string): boolean {
  const rec = failedAttempts.get(key);
  if (!rec) return false;
  if (Date.now() - rec.firstAt > FAIL_WINDOW_MS) {
    failedAttempts.delete(key);
    return false;
  }
  return rec.count >= FAIL_THRESHOLD;
}

export function recordFailure(key: string): void {
  const now = Date.now();
  const rec = failedAttempts.get(key);
  if (!rec || now - rec.firstAt > FAIL_WINDOW_MS) {
    failedAttempts.set(key, { count: 1, firstAt: now });
  } else {
    rec.count += 1;
  }
}

export function resetFailures(key: string): void {
  failedAttempts.delete(key);
}
