import type BetterSqlite3 from "better-sqlite3";
import type { AuthCoreConfig } from "./config.js";
import { createGate } from "./gate.js";
import { createPermissionGate } from "./require-permission.js";
import { requireAdmin } from "./require-admin.js";
import { createAuthRoutes } from "./routes/auth.js";
import { createAdminUserRoutes } from "./routes/admin.js";
import { createPermissionRoutes } from "./routes/permission.js";
import { createPageRoutes } from "./routes/pages.js";
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
export declare function createAuthCore(userConfig: AuthCoreConfig, existingDb?: BetterSqlite3.Database): AuthCore;
//# sourceMappingURL=factory.d.ts.map