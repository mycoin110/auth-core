import { Hono } from "hono";
import { randomBytes } from "node:crypto";
import { hashPassword, revokeAllSessionsForUser } from "../auth.js";
/**
 * 创建管理员用户管理路由。
 * 不含模块分配等业务功能，只做用户增删改查。
 */
export function createAdminUserRoutes(config, db) {
    const app = new Hono();
    // ---------- helpers ----------
    function parseId(raw) {
        const n = Number(raw);
        return Number.isInteger(n) && n > 0 ? n : null;
    }
    function getUser(id) {
        return db
            .prepare("SELECT * FROM users WHERE id = ?")
            .get(id);
    }
    function countActiveAdmins() {
        const r = db
            .prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin' AND status = 'active'")
            .get();
        return r?.n ?? 0;
    }
    // ---------- GET /users ----------
    app.get("/users", (c) => {
        const rows = db
            .prepare(`SELECT id, email, status, role, display_name, created_at, last_login_at
         FROM users
         ORDER BY
           CASE status
             WHEN 'pending'  THEN 0
             WHEN 'active'   THEN 1
             WHEN 'disabled' THEN 2
           END,
           created_at DESC`)
            .all();
        return c.json({
            users: rows.map((r) => ({
                id: r.id,
                email: r.email,
                status: r.status,
                role: r.role,
                displayName: r.display_name,
                createdAt: r.created_at,
                lastLoginAt: r.last_login_at,
            })),
        });
    });
    // ---------- POST /users/:id/approve ----------
    app.post("/users/:id/approve", (c) => {
        const id = parseId(c.req.param("id"));
        if (id === null)
            return c.json({ error: "id 不合法" }, 400);
        const r = db
            .prepare("UPDATE users SET status = 'active' WHERE id = ? AND status = 'pending'")
            .run(id);
        if (r.changes === 0) {
            return c.json({ error: "用户不存在或非 pending 状态" }, 404);
        }
        return c.json({ ok: true });
    });
    // ---------- POST /users/:id/disable ----------
    app.post("/users/:id/disable", (c) => {
        const id = parseId(c.req.param("id"));
        if (id === null)
            return c.json({ error: "id 不合法" }, 400);
        const me = c.get("user");
        if (id === me?.id)
            return c.json({ error: "不能禁用自己" }, 400);
        const target = getUser(id);
        if (!target)
            return c.json({ error: "用户不存在" }, 404);
        if (target.status === "disabled")
            return c.json({ error: "该用户已是禁用状态" }, 400);
        if (target.role === "admin" && target.status === "active" && countActiveAdmins() <= 1) {
            return c.json({ error: "不能禁用最后一个管理员" }, 400);
        }
        db.prepare("UPDATE users SET status = 'disabled' WHERE id = ?").run(id);
        revokeAllSessionsForUser(db, id);
        return c.json({ ok: true });
    });
    // ---------- POST /users/:id/enable ----------
    app.post("/users/:id/enable", (c) => {
        const id = parseId(c.req.param("id"));
        if (id === null)
            return c.json({ error: "id 不合法" }, 400);
        const r = db
            .prepare("UPDATE users SET status = 'active' WHERE id = ? AND status = 'disabled'")
            .run(id);
        if (r.changes === 0) {
            return c.json({ error: "用户不存在或非 disabled 状态（pending 请用 approve）" }, 404);
        }
        return c.json({ ok: true });
    });
    // ---------- DELETE /users/:id ----------
    app.delete("/users/:id", (c) => {
        const id = parseId(c.req.param("id"));
        if (id === null)
            return c.json({ error: "id 不合法" }, 400);
        const me = c.get("user");
        if (id === me?.id)
            return c.json({ error: "不能删除自己" }, 400);
        const target = getUser(id);
        if (!target)
            return c.json({ error: "用户不存在" }, 404);
        if (target.role === "admin") {
            const r = db
                .prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'")
                .get();
            if ((r?.n ?? 0) <= 1) {
                return c.json({ error: "不能删除最后一个管理员" }, 400);
            }
        }
        db.prepare("DELETE FROM users WHERE id = ?").run(id);
        return c.json({ ok: true });
    });
    // ---------- POST /users/:id/reset-password ----------
    app.post("/users/:id/reset-password", async (c) => {
        const id = parseId(c.req.param("id"));
        if (id === null)
            return c.json({ error: "id 不合法" }, 400);
        const target = getUser(id);
        if (!target)
            return c.json({ error: "用户不存在" }, 404);
        const tempPassword = randomBytes(8).toString("hex");
        const hash = await hashPassword(tempPassword);
        db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hash, id);
        revokeAllSessionsForUser(db, id);
        return c.json({
            ok: true,
            tempPassword,
            message: "请把临时密码立即转给用户，本接口不会再次显示明文",
        });
    });
    return app;
}
//# sourceMappingURL=admin.js.map