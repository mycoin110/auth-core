export interface ModuleDef {
    /** 模块唯一标识，如 "words" */
    key: string;
    /** 模块显示名称，如 "单词" */
    name: string;
    /** 从属版块名称，如 "英语学习" */
    section: string;
    /** 从属版块图标，如 "📚" */
    sectionIcon: string;
    /** URL 前缀，如 "/words/" */
    pathPrefix: string;
}
export interface AuthCoreConfig {
    /** Session cookie 名称（默认 "session"） */
    sessionCookieName: string;
    /** Session 有效期毫秒（默认 30 天） */
    sessionTtlMs: number;
    /** 管理员初始邮箱 */
    adminEmail: string;
    /** 管理员初始密码（留空则随机生成） */
    adminPassword?: string;
    /** SQLite 数据目录 */
    dataDir: string;
    /** SQLite 文件名（默认 "app.sqlite"） */
    dbFileName?: string;
    /** 登录页面路径（默认 "/login"） */
    loginPath?: string;
    /** 注册页面路径（默认 "/register"） */
    registerPath?: string;
    /** 管理后台路径（默认 "/admin"） */
    adminPath?: string;
    /** 应用图标（emoji，可选） */
    appIcon?: string;
    /** API 认证前缀（默认 "/api/auth"） */
    authPrefix?: string;
    /** 应用名称（日志用，默认 "App"） */
    appName?: string;
    /** 主题色（十六进制，默认 "#3b82f6" 蓝色） */
    primaryColor?: string;
    /** 模块定义列表（可选。传入后开启权限管理系统） */
    modules?: ModuleDef[];
    /** 是否使用内置的完整管理页面（默认 true） */
    enableBuiltinAdmin?: boolean;
    /** 是否启用权限检查中间件（默认 false） */
    enablePermission?: boolean;
}
//# sourceMappingURL=config.d.ts.map