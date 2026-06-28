import type { MiddlewareHandler } from "hono";
import type { UserRow } from "./types.js";

/**
 * 管理员权限检查中间件。
 * 依赖上游 gate 中间件已将 user 挂到 context。
 */
export const requireAdmin: MiddlewareHandler = async (c, next) => {
  const user = c.get("user") as UserRow | undefined;
  if (!user) return c.json({ error: "未登录" }, 401);
  if (user.role !== "admin") return c.json({ error: "需要管理员权限" }, 403);
  return next();
};
