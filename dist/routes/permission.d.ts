import { Hono } from "hono";
import type { AuthCoreConfig } from "../config.js";
import type BetterSqlite3 from "better-sqlite3";
/**
 * 创建模块权限管理 API 路由。
 * 需挂载在 requireAdmin 之后。
 */
export declare function createPermissionRoutes(config: AuthCoreConfig, db: BetterSqlite3.Database): Hono<import("hono/types").BlankEnv, import("hono/types").BlankSchema, "/">;
//# sourceMappingURL=permission.d.ts.map