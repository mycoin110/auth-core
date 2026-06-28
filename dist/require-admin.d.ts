import type { MiddlewareHandler } from "hono";
/**
 * 管理员权限检查中间件。
 * 依赖上游 gate 中间件已将 user 挂到 context。
 */
export declare const requireAdmin: MiddlewareHandler;
//# sourceMappingURL=require-admin.d.ts.map