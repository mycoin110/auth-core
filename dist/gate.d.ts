import type { MiddlewareHandler } from "hono";
import type { AuthCoreConfig } from "./config.js";
/**
 * 登录验证中间件。
 * 检查 cookie 中的 session token，未登录跳转 /login。
 */
export declare function createGate(config: AuthCoreConfig, db: import("better-sqlite3").Database): MiddlewareHandler;
//# sourceMappingURL=gate.d.ts.map