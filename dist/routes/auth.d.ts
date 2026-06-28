import { Hono } from "hono";
import type { AuthCoreConfig } from "../config.js";
export declare function createAuthRoutes(config: AuthCoreConfig, db: import("better-sqlite3").Database): Hono<import("hono/types").BlankEnv, import("hono/types").BlankSchema, "/">;
//# sourceMappingURL=auth.d.ts.map