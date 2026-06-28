import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import type { AuthCoreConfig } from "./config.js";

/**
 * 初始化数据库，创建 users / sessions 表。
 * 每个应用有自己的 SQLite 实例。
 */
export function createDb(config: AuthCoreConfig): Database.Database {
  mkdirSync(config.dataDir, { recursive: true });
  const dbPath = resolve(config.dataDir, config.dbFileName ?? "app.sqlite");

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

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

  console.log(`📦 SQLite: ${dbPath}`);
  return db;
}
