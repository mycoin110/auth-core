import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type BetterSqlite3 from "better-sqlite3";
import type { AuthCoreConfig } from "./config.js";
import { createDb } from "./db.js";
import { createGate } from "./gate.js";
import { createPermissionGate } from "./require-permission.js";
import { requireAdmin } from "./require-admin.js";
import { createAuthRoutes } from "./routes/auth.js";
import { createAdminUserRoutes } from "./routes/admin.js";
import { createPermissionRoutes } from "./routes/permission.js";
import { createPageRoutes, userWidgetHtml, userWidgetScript } from "./routes/pages.js";

const DEFAULT_CONFIG: Partial<AuthCoreConfig> = {
  sessionCookieName: "session",
  sessionTtlMs: 30 * 24 * 60 * 60 * 1000,
  loginPath: "/login",
  registerPath: "/register",
  adminPath: "/admin",
  authPrefix: "/api/auth",
  dbFileName: "app.sqlite",
  appName: "App",
  primaryColor: "#3b82f6",
  enableBuiltinAdmin: true,
  enablePermission: false,
};

function resolveConfig(userConfig: AuthCoreConfig): Required<AuthCoreConfig> {
  return { ...DEFAULT_CONFIG, ...userConfig } as Required<AuthCoreConfig>;
}

export interface AuthCore {
  config: Required<AuthCoreConfig>;
  db: BetterSqlite3.Database;
  gate: ReturnType<typeof createGate>;
  requireAdmin: typeof requireAdmin;
  requirePermission: ReturnType<typeof createPermissionGate>;
  authRoutes: ReturnType<typeof createAuthRoutes>;
  adminUserRoutes: ReturnType<typeof createAdminUserRoutes>;
  adminPermissionRoutes: ReturnType<typeof createPermissionRoutes>;
  pageRoutes: ReturnType<typeof createPageRoutes>;
  userWidgetHtml: string;
  userWidgetScript: string;
}

/**
 * 创建认证核心实例。
 * 调用方得到 gate 中间件、auth 路由、admin 路由等全部组件。
 */
export function createAuthCore(
  userConfig: AuthCoreConfig,
  existingDb?: BetterSqlite3.Database,
): AuthCore {
  const config = resolveConfig(userConfig);
  const db = createDb(config, existingDb);

  const gate = createGate(config, db);
  const requirePermission = createPermissionGate(config, db);
  const authRoutes = createAuthRoutes(config, db);
  const adminUserRoutes = createAdminUserRoutes(config, db);
  const adminPermissionRoutes = createPermissionRoutes(config, db);
  const pageRoutes = createPageRoutes(config);

  // 创建 admin 初始账号
  seedAdminIfNeeded(config, db);

  console.log(`▶ ${config.appName} auth-core initialized`);
  console.log(`   cookie  : ${config.sessionCookieName}`);
  console.log(`   db      : ${resolve(config.dataDir, config.dbFileName as string)}`);

  return {
    config,
    db,
    gate,
    requireAdmin,
    requirePermission,
    authRoutes,
    adminUserRoutes,
    adminPermissionRoutes,
    pageRoutes,
    userWidgetHtml: userWidgetHtml(config),
    userWidgetScript: userWidgetScript(config),
  };
}

function seedAdminIfNeeded(config: AuthCoreConfig, db: BetterSqlite3.Database): void {
  const existing = db
    .prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
    .get() as { id: number } | undefined;
  if (existing) return;

  const password = config.adminPassword ?? randomBytes(8).toString("hex");
  const hash = bcrypt.hashSync(password, 10);
  const now = Date.now();

  db.prepare(
    `INSERT INTO users (email, password_hash, status, role, display_name, created_at)
     VALUES (?, ?, 'active', 'admin', ?, ?)`,
  ).run(config.adminEmail.toLowerCase(), hash, "系统管理员", now);

  const filepath = resolve(config.dataDir, ".admin-initial-password.txt");
  writeFileSync(
    filepath,
    `email: ${config.adminEmail}\npassword: ${password}\ncreated: ${new Date(now).toISOString()}\n`,
    { mode: 0o600 },
  );

  const banner = "━".repeat(60);
  console.log(banner);
  console.log("🔐 管理员初始账号已创建（仅首次启动显示）");
  console.log(`   email   : ${config.adminEmail}`);
  console.log(`   password: ${password}`);
  console.log(`   已写入  : ${filepath}`);
  console.log("   ⚠ 首次登录后请立即重置密码！");
  console.log(banner);
}
