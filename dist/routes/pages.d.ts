import { Hono } from "hono";
import type { AuthCoreConfig } from "../config.js";
/**
 * 创建内置登录/注册/管理页面路由。
 * 支持自定义主题色，提供完整的用户管理界面。
 */
export declare function createPageRoutes(config: AuthCoreConfig): Hono<import("hono/types").BlankEnv, import("hono/types").BlankSchema, "/">;
/**
 * 返回用户信息小部件的 HTML 片段。
 * 适合插入到页面 header 的右上角。
 */
export declare function userWidgetHtml(config: AuthCoreConfig): string;
/**
 * 返回用户信息小部件的 JavaScript 逻辑（内联用）。
 */
export declare function userWidgetScript(config: AuthCoreConfig): string;
//# sourceMappingURL=pages.d.ts.map