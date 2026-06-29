/**
 * 创建权限检查中间件。
 * 只有被分配了对应模块的用户才能访问该模块下的页面。
 * admin 角色跳过检查。
 * 需挂载在 gate 中间件之后。
 * 仅在 config 配置了 modules 且 enablePermission 为 true 时生效。
 */
export function createPermissionGate(config, db) {
    // 未启用权限系统 → 放行
    if (!config.enablePermission || !config.modules || config.modules.length === 0) {
        return async (_c, next) => next();
    }
    const ALL_PATH_PREFIXES = config.modules.map((m) => m.pathPrefix);
    return async (c, next) => {
        const path = c.req.path;
        // 只检查模块路径
        const matched = ALL_PATH_PREFIXES.some((p) => path.startsWith(p));
        if (!matched)
            return next();
        const user = c.get("user");
        if (!user)
            return next();
        if (user.role === "admin")
            return next();
        // 检查用户是否被分配了至少一个模块
        const userModules = db
            .prepare("SELECT module_key FROM user_modules WHERE user_id = ?")
            .all(user.id);
        if (userModules.length === 0) {
            return c.html(accessDeniedHtml(), 403);
        }
        const userKeys = new Set(userModules.map((r) => r.module_key));
        const ok = config.modules.some((m) => userKeys.has(m.key) && path.startsWith(m.pathPrefix));
        if (!ok) {
            return c.html(accessDeniedHtml(), 403);
        }
        return next();
    };
}
function accessDeniedHtml() {
    return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>无权限</title><style>
body{font-family:-apple-system,"PingFang SC",sans-serif;background:#e8f4f8;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1rem}
.modal{background:#fff;border-radius:16px;padding:40px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.1);max-width:380px;width:100%}
.modal-icon{font-size:48px;margin-bottom:12px}
h1{font-size:22px;color:#333;margin:0 0 8px}
p{color:#888;font-size:14px;margin:0 0 20px}
.btn{display:inline-block;padding:10px 30px;background:#4a90d9;color:#fff;border-radius:8px;text-decoration:none;font-size:14px}
.btn:hover{background:#2563eb}
</style></head><body>
<div class="modal"><div class="modal-icon">🔒</div><h1>无访问权限</h1><p>请联系管理员开通对应模块的访问权限</p><a class="btn" href="/">返回首页</a></div>
</body></html>`;
}
//# sourceMappingURL=require-permission.js.map