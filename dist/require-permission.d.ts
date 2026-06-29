import type { MiddlewareHandler } from "hono";
import type { AuthCoreConfig } from "./config.js";
import type BetterSqlite3 from "better-sqlite3";
/**
 * 创建权限检查中间件。
 * 只有被分配了对应模块的用户才能访问该模块下的页面。
 * admin 角色跳过检查。
 * 需挂载在 gate 中间件之后。
 * 仅在 config 配置了 modules 且 enablePermission 为 true 时生效。
 */
export declare function createPermissionGate(config: AuthCoreConfig, db: BetterSqlite3.Database): MiddlewareHandler;
//# sourceMappingURL=require-permission.d.ts.map