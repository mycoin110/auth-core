/**
 * 管理员权限检查中间件。
 * 依赖上游 gate 中间件已将 user 挂到 context。
 */
export const requireAdmin = async (c, next) => {
    const user = c.get("user");
    if (!user)
        return c.json({ error: "未登录" }, 401);
    if (user.role !== "admin")
        return c.json({ error: "需要管理员权限" }, 403);
    return next();
};
//# sourceMappingURL=require-admin.js.map