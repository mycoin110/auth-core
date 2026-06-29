import type { AuthCoreConfig } from "./config.js";
import type BetterSqlite3 from "better-sqlite3";
/**
 * 初始化数据库，创建 users / sessions / user_modules 表。
 * 如果调用方传入已有 db 实例则跳过建表。
 */
export declare function createDb(config: AuthCoreConfig, existingDb?: BetterSqlite3.Database): BetterSqlite3.Database;
//# sourceMappingURL=db.d.ts.map