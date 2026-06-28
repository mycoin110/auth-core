/**
 * @mycoin110/auth-core - 通用认证模块
 *
 * 使用方式：
 * ```typescript
 * import { createAuthCore } from "@mycoin110/auth-core";
 *
 * const auth = createAuthCore({
 *   sessionCookieName: "myapp_session",
 *   sessionTtlMs: 30 * 24 * 60 * 60 * 1000,
 *   adminEmail: "admin@example.com",
 *   dataDir: "./data",
 *   dbFileName: "app.sqlite",
 * });
 *
 * app.use("*", auth.gate);
 * app.route("/api/auth", auth.authRoutes);
 * app.route("/api/admin", auth.adminUserRoutes);
 * ```
 */

export { createAuthCore } from "./factory.js";
export type { AuthCoreConfig } from "./config.js";
export type { UserRow, SessionRow, UserStatus, UserRole } from "./types.js";
