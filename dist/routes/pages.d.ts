import { Hono } from "hono";
import type { AuthCoreConfig } from "../config.js";
/**
 * 内置登录/注册/管理页面路由。
 * 每个项目开箱即用，无需自己写 HTML。
 */
export declare function createPageRoutes(config: AuthCoreConfig): Hono<import("hono/types").BlankEnv, import("hono/types").BlankSchema, "/">;
//# sourceMappingURL=pages.d.ts.map