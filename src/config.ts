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
}
