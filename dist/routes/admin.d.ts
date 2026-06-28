import { Hono } from "hono";
import type { AuthCoreConfig } from "../config.js";
/**
 * 创建管理员用户管理路由。
 * 不含模块分配等业务功能，只做用户增删改查。
 */
export declare function createAdminUserRoutes(config: AuthCoreConfig, db: import("better-sqlite3").Database): Hono<import("hono/types").BlankEnv, import("hono/types").BlankSchema, "/">;
//# sourceMappingURL=admin.d.ts.map