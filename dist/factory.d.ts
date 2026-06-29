import Database from "better-sqlite3";
import type { AuthCoreConfig } from "./config.js";
import { createGate } from "./gate.js";
import { requireAdmin } from "./require-admin.js";
import { createAuthRoutes } from "./routes/auth.js";
import { createAdminUserRoutes } from "./routes/admin.js";
export interface AuthCore {
    config: Required<AuthCoreConfig>;
    db: Database.Database;
    gate: ReturnType<typeof createGate>;
    requireAdmin: typeof requireAdmin;
    authRoutes: ReturnType<typeof createAuthRoutes>;
    adminUserRoutes: ReturnType<typeof createAdminUserRoutes>;
}
/**
 * 创建认证核心实例。
 * 调用方得到 gate 中间件、auth 路由、admin 路由等全部组件，
 * 直接挂载到自己的 Hono 应用上即可。
 * @param userConfig 配置
 * @param existingDb 外部数据库实例（若不传则自动创建）
 */
export declare function createAuthCore(userConfig: AuthCoreConfig, existingDb?: Database.Database): AuthCore;
//# sourceMappingURL=factory.d.ts.map