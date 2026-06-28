import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createDb } from "./db.js";
import { createGate } from "./gate.js";
import { requireAdmin } from "./require-admin.js";
import { createAuthRoutes } from "./routes/auth.js";
import { createAdminUserRoutes } from "./routes/admin.js";
const DEFAULT_CONFIG = {
    sessionCookieName: "session",
    sessionTtlMs: 30 * 24 * 60 * 60 * 1000,
    loginPath: "/login",
    registerPath: "/register",
    authPrefix: "/api/auth",
    dbFileName: "app.sqlite",
    appName: "App",
};
function resolveConfig(userConfig) {
    return { ...DEFAULT_CONFIG, ...userConfig };
}
/**
 * 创建认证核心实例。
 * 调用方得到 gate 中间件、auth 路由、admin 路由等全部组件，
 * 直接挂载到自己的 Hono 应用上即可。
 */
export function createAuthCore(userConfig) {
    const config = resolveConfig(userConfig);
    const db = createDb(config);
    // 创建 gate 中间件
    const gate = createGate(config, db);
    // 创建路由
    const authRoutes = createAuthRoutes(config, db);
    const adminUserRoutes = createAdminUserRoutes(config, db);
    // 创建 admin 初始账号
    seedAdminIfNeeded(config, db);
    console.log(`▶ ${config.appName} auth-core initialized`);
    console.log(`   cookie  : ${config.sessionCookieName}`);
    console.log(`   db      : ${resolve(config.dataDir, config.dbFileName)}`);
    return {
        config,
        db,
        gate,
        requireAdmin,
        authRoutes,
        adminUserRoutes,
    };
}
function seedAdminIfNeeded(config, db) {
    const existing = db
        .prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
        .get();
    if (existing)
        return;
    const password = config.adminPassword ?? randomBytes(8).toString("hex");
    const hash = bcrypt.hashSync(password, 10);
    const now = Date.now();
    db.prepare(`INSERT INTO users (email, password_hash, status, role, display_name, created_at)
     VALUES (?, ?, 'active', 'admin', ?, ?)`).run(config.adminEmail.toLowerCase(), hash, "系统管理员", now);
    const filepath = resolve(config.dataDir, ".admin-initial-password.txt");
    writeFileSync(filepath, `email: ${config.adminEmail}\npassword: ${password}\ncreated: ${new Date(now).toISOString()}\n`, { mode: 0o600 });
    const banner = "━".repeat(60);
    console.log(banner);
    console.log("🔐 管理员初始账号已创建（仅首次启动显示）");
    console.log(`   email   : ${config.adminEmail}`);
    console.log(`   password: ${password}`);
    console.log(`   已写入  : ${filepath}`);
    console.log("   ⚠ 首次登录后请立即重置密码！");
    console.log(banner);
}
//# sourceMappingURL=factory.js.map