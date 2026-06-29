/**
 * @mycoin110/auth-core - 通用认证模块
 *
 * 包含：认证 API、登录/注册页面、管理页面、中间件、模块权限管理
 * 每个项目一行代码即可接入完整认证系统。
 */
export { createAuthCore } from "./factory.js";
export type { AuthCoreConfig, ModuleDef } from "./config.js";
export type { UserRow, SessionRow, UserModuleRow, UserStatus, UserRole } from "./types.js";
export { hashPassword, verifyPassword, createSession, findSession, slideSession, revokeSession, revokeAllSessionsForUser, isLockedOut, recordFailure, resetFailures, isValidEmail, normalizeEmail, } from "./auth.js";
export { createGate } from "./gate.js";
export { requireAdmin } from "./require-admin.js";
export { createPermissionGate } from "./require-permission.js";
export { createAuthRoutes } from "./routes/auth.js";
export { createAdminUserRoutes } from "./routes/admin.js";
export { createPermissionRoutes } from "./routes/permission.js";
export { createPageRoutes, userWidgetHtml, userWidgetScript } from "./routes/pages.js";
//# sourceMappingURL=index.d.ts.map