/**
 * @mycoin110/auth-core - 通用认证模块
 *
 * 包含：认证 API、登录/注册页面、管理页面、中间件
 * 每个项目一行代码即可接入完整认证系统。
 */

export { createAuthCore } from "./factory.js";
export type { AuthCoreConfig } from "./config.js";
export type { UserRow, SessionRow, UserStatus, UserRole } from "./types.js";

// 独立函数
export {
  hashPassword,
  verifyPassword,
  createSession,
  findSession,
  slideSession,
  revokeSession,
  revokeAllSessionsForUser,
  isLockedOut,
  recordFailure,
  resetFailures,
  isValidEmail,
  normalizeEmail,
} from "./auth.js";

// 中间件
export { createGate } from "./gate.js";
export { requireAdmin } from "./require-admin.js";

// 路由工厂
export { createAuthRoutes } from "./routes/auth.js";
export { createAdminUserRoutes } from "./routes/admin.js";
export { createPageRoutes } from "./routes/pages.js";
