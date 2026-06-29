import { Hono } from "hono";
/**
 * 创建模块权限管理 API 路由。
 * 需挂载在 requireAdmin 之后。
 */
export function createPermissionRoutes(config, db) {
    const app = new Hono();
    // ---------- helpers ----------
    function parseId(raw) {
        const n = Number(raw);
        return Number.isInteger(n) && n > 0 ? n : null;
    }
    function getUser(id) {
        return db.prepare("SELECT id FROM users WHERE id = ?").get(id);
    }
    function groupModulesBySection(modules) {
        const map = new Map();
        for (const m of modules) {
            if (!map.has(m.section)) {
                map.set(m.section, { name: m.section, icon: m.sectionIcon, modules: [] });
            }
            map.get(m.section).modules.push(m);
        }
        return [...map.values()];
    }
    // ---------- GET /modules ----------
    /** 返回所有可分配的模块（按版块分组） */
    app.get("/modules", (c) => {
        const sections = groupModulesBySection(config.modules ?? []);
        return c.json({ sections });
    });
    // ---------- GET /users/:id/modules ----------
    /** 返回某用户已分配的 module_key 列表 */
    app.get("/users/:id/modules", (c) => {
        const id = parseId(c.req.param("id"));
        if (id === null)
            return c.json({ error: "id 不合法" }, 400);
        if (!getUser(id))
            return c.json({ error: "用户不存在" }, 404);
        const rows = db
            .prepare("SELECT module_key FROM user_modules WHERE user_id = ? ORDER BY module_key")
            .all(id);
        return c.json({ moduleKeys: rows.map((r) => r.module_key) });
    });
    // ---------- PUT /users/:id/modules ----------
    /** 全量替换用户的模块分配 */
    app.put("/users/:id/modules", async (c) => {
        const id = parseId(c.req.param("id"));
        if (id === null)
            return c.json({ error: "id 不合法" }, 400);
        if (!getUser(id))
            return c.json({ error: "用户不存在" }, 404);
        let body;
        try {
            body = await c.req.json();
        }
        catch {
            return c.json({ error: "请求体不是合法 JSON" }, 400);
        }
        const { moduleKeys } = (body ?? {});
        if (!Array.isArray(moduleKeys)) {
            return c.json({ error: "moduleKeys 必须是数组" }, 400);
        }
        const moduleKeySet = new Set((config.modules ?? []).map((m) => m.key));
        const txn = db.transaction(() => {
            db.prepare("DELETE FROM user_modules WHERE user_id = ?").run(id);
            const insert = db.prepare("INSERT INTO user_modules (user_id, module_key, created_at) VALUES (?, ?, ?)");
            const now = Date.now();
            for (const key of moduleKeys) {
                if (typeof key === "string" && moduleKeySet.has(key)) {
                    insert.run(id, key, now);
                }
            }
        });
        txn();
        return c.json({ ok: true });
    });
    return app;
}
//# sourceMappingURL=permission.js.map