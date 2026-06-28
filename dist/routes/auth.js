import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createSession, findSession, hashPassword, isLockedOut, isValidEmail, normalizeEmail, recordFailure, resetFailures, revokeSession, verifyPassword, } from "../auth.js";
export function createAuthRoutes(config, db) {
    const app = new Hono();
    // ---------- POST /register ----------
    app.post("/register", async (c) => {
        let body;
        try {
            body = await c.req.json();
        }
        catch {
            return c.json({ error: "请求体不是合法 JSON" }, 400);
        }
        const { email, password, displayName } = (body ?? {});
        if (typeof email !== "string" || !isValidEmail(email)) {
            return c.json({ error: "邮箱格式不正确" }, 400);
        }
        if (typeof password !== "string" || password.length < 8) {
            return c.json({ error: "密码至少 8 位" }, 400);
        }
        if (password.length > 128) {
            return c.json({ error: "密码过长（最多 128 位）" }, 400);
        }
        const normalized = normalizeEmail(email);
        const existing = db
            .prepare("SELECT id FROM users WHERE email = ?")
            .get(normalized);
        if (existing) {
            return c.json({ error: "该邮箱已注册" }, 409);
        }
        const hash = await hashPassword(password);
        const now = Date.now();
        const cleanedDisplayName = typeof displayName === "string" && displayName.trim() ? displayName.trim() : null;
        db.prepare(`INSERT INTO users (email, password_hash, status, role, display_name, created_at)
       VALUES (?, ?, 'pending', 'user', ?, ?)`).run(normalized, hash, cleanedDisplayName, now);
        return c.json({
            ok: true,
            message: "注册成功，等待管理员审批后即可登录",
        });
    });
    // ---------- POST /login ----------
    app.post("/login", async (c) => {
        let body;
        try {
            body = await c.req.json();
        }
        catch {
            return c.json({ error: "请求体不是合法 JSON" }, 400);
        }
        const { email, password } = (body ?? {});
        if (typeof email !== "string" || typeof password !== "string") {
            return c.json({ error: "参数不完整" }, 400);
        }
        const normalized = normalizeEmail(email);
        if (isLockedOut(normalized)) {
            return c.json({ error: "失败次数过多，请 15 分钟后再试" }, 429);
        }
        const user = db
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(normalized);
        if (!user || !(await verifyPassword(password, user.password_hash))) {
            recordFailure(normalized);
            return c.json({ error: "邮箱或密码错误" }, 401);
        }
        if (user.status === "pending") {
            return c.json({ error: "账号正在等待管理员审批" }, 403);
        }
        if (user.status === "disabled") {
            return c.json({ error: "账号已被禁用，请联系管理员" }, 403);
        }
        resetFailures(normalized);
        const { token } = createSession(config, db, user.id);
        db.prepare("UPDATE users SET last_login_at = ? WHERE id = ?")
            .run(Date.now(), user.id);
        setCookie(c, config.sessionCookieName, token, {
            httpOnly: true,
            sameSite: "Lax",
            path: "/",
            maxAge: Math.floor(config.sessionTtlMs / 1000),
        });
        return c.json({
            ok: true,
            user: {
                email: user.email,
                displayName: user.display_name,
                role: user.role,
            },
        });
    });
    // ---------- POST /logout ----------
    app.post("/logout", (c) => {
        const token = getCookie(c, config.sessionCookieName);
        if (token)
            revokeSession(db, token);
        deleteCookie(c, config.sessionCookieName, { path: "/" });
        return c.json({ ok: true });
    });
    // ---------- GET /me ----------
    app.get("/me", (c) => {
        const token = getCookie(c, config.sessionCookieName);
        if (!token)
            return c.json({ error: "未登录" }, 401);
        const found = findSession(config, db, token);
        if (!found)
            return c.json({ error: "会话失效" }, 401);
        if (found.user.status !== "active") {
            return c.json({ error: "账号状态不可用" }, 403);
        }
        return c.json({
            user: {
                id: found.user.id,
                email: found.user.email,
                displayName: found.user.display_name,
                role: found.user.role,
                lastLoginAt: found.user.last_login_at,
            },
        });
    });
    return app;
}
//# sourceMappingURL=auth.js.map