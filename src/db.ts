import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import type { AuthCoreConfig } from "./config.js";
import type BetterSqlite3 from "better-sqlite3";

/**
 * 初始化数据库，创建 users / sessions / user_modules 表。
 * 如果调用方传入已有 db 实例则跳过建表。
 */
export function createDb(config: AuthCoreConfig, existingDb?: BetterSqlite3.Database): BetterSqlite3.Database {
  if (existingDb) return existingDb;

  mkdirSync(config.dataDir, { recursive: true });
  const dbPath = resolve(config.dataDir, config.dbFileName ?? "app.sqlite");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // 用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK(status IN ('pending','active','disabled')),
      role TEXT NOT NULL DEFAULT 'user'
        CHECK(role IN ('user','admin')),
      display_name TEXT,
      created_at INTEGER NOT NULL,
      last_login_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
  `);

  // 模块权限表（仅当 config 配置了 modules 时创建）
  if (config.modules && config.modules.length > 0) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_modules (
        user_id INTEGER NOT NULL,
        module_key TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        PRIMARY KEY (user_id, module_key),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
  }

  console.log(`📦 SQLite: ${dbPath}`);
  return db;
}
