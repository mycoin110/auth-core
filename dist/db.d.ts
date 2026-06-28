import Database from "better-sqlite3";
import type { AuthCoreConfig } from "./config.js";
/**
 * 初始化数据库，创建 users / sessions 表。
 * 每个应用有自己的 SQLite 实例。
 */
export declare function createDb(config: AuthCoreConfig): Database.Database;
//# sourceMappingURL=db.d.ts.map