import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
const BCRYPT_ROUNDS = 10;
// ---------- 密码 ----------
export async function hashPassword(plain) {
    return bcrypt.hash(plain, BCRYPT_ROUNDS);
}
export async function verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}
export function createSession(config, db, userId) {
    const token = randomBytes(32).toString("hex");
    const now = Date.now();
    const expiresAt = now + config.sessionTtlMs;
    db.prepare(`INSERT INTO sessions (token, user_id, created_at, expires_at)
     VALUES (?, ?, ?, ?)`).run(token, userId, now, expiresAt);
    return { token, expiresAt };
}
export function findSession(config, db, token) {
    const session = db
        .prepare("SELECT * FROM sessions WHERE token = ?")
        .get(token);
    if (!session)
        return null;
    if (session.expires_at < Date.now()) {
        revokeSession(db, token);
        return null;
    }
    const user = db
        .prepare("SELECT * FROM users WHERE id = ?")
        .get(session.user_id);
    if (!user)
        return null;
    return { user, session };
}
export function slideSession(config, db, token) {
    const expiresAt = Date.now() + config.sessionTtlMs;
    db.prepare("UPDATE sessions SET expires_at = ? WHERE token = ?").run(expiresAt, token);
}
export function revokeSession(db, token) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}
export function revokeAllSessionsForUser(db, userId) {
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
}
// ---------- Email 校验 ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(email) {
    return typeof email === "string" && email.length <= 254 && EMAIL_RE.test(email);
}
export function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
// ---------- 登录失败限速（内存版）----------
const FAIL_WINDOW_MS = 15 * 60 * 1000;
const FAIL_THRESHOLD = 5;
const failedAttempts = new Map();
export function isLockedOut(key) {
    const rec = failedAttempts.get(key);
    if (!rec)
        return false;
    if (Date.now() - rec.firstAt > FAIL_WINDOW_MS) {
        failedAttempts.delete(key);
        return false;
    }
    return rec.count >= FAIL_THRESHOLD;
}
export function recordFailure(key) {
    const now = Date.now();
    const rec = failedAttempts.get(key);
    if (!rec || now - rec.firstAt > FAIL_WINDOW_MS) {
        failedAttempts.set(key, { count: 1, firstAt: now });
    }
    else {
        rec.count += 1;
    }
}
export function resetFailures(key) {
    failedAttempts.delete(key);
}
//# sourceMappingURL=auth.js.map