import { getCookie } from "hono/cookie";
import { findSession, slideSession } from "./auth.js";
/**
 * 登录验证中间件。
 * 检查 cookie 中的 session token，未登录跳转 /login。
 */
export function createGate(config, db) {
    const STATIC_ASSET_PREFIXES = [
        "/_astro/",
        "/fonts/",
        "/img/",
        "/images/",
        "/assets/",
    ];
    const STATIC_FILE_PATHS = new Set([
        "/favicon.ico",
        "/favicon.svg",
        "/robots.txt",
    ]);
    const PUBLIC_PATHS = new Set([config.loginPath, config.registerPath]);
    const PUBLIC_API_PREFIXES = [
        `${config.authPrefix}/login`,
        `${config.authPrefix}/register`,
    ];
    function isPublicPath(path) {
        if (PUBLIC_PATHS.has(path))
            return true;
        if (STATIC_FILE_PATHS.has(path))
            return true;
        if (STATIC_ASSET_PREFIXES.some((p) => path.startsWith(p)))
            return true;
        if (PUBLIC_API_PREFIXES.some((p) => path === p || path.startsWith(p + "/")))
            return true;
        return false;
    }
    function reject(c) {
        if (c.req.path.startsWith("/api/")) {
            return c.json({ error: "未登录" }, 401);
        }
        const url = new URL(c.req.url);
        const next = url.pathname + url.search;
        const target = next === "/" || next.startsWith(config.loginPath)
            ? config.loginPath
            : `${config.loginPath}?next=${encodeURIComponent(next)}`;
        return c.redirect(target, 302);
    }
    return async (c, next) => {
        if (isPublicPath(c.req.path)) {
            return next();
        }
        const token = getCookie(c, config.sessionCookieName);
        if (!token)
            return reject(c);
        const found = findSession(config, db, token);
        if (!found)
            return reject(c);
        if (found.user.status !== "active")
            return reject(c);
        slideSession(config, db, token);
        c.set("user", found.user);
        return next();
    };
}
//# sourceMappingURL=gate.js.map