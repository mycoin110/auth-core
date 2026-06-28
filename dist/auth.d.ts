import type { AuthCoreConfig } from "./config.js";
import type { SessionRow, UserRow } from "./types.js";
export declare function hashPassword(plain: string): Promise<string>;
export declare function verifyPassword(plain: string, hash: string): Promise<boolean>;
export interface SessionWithUser {
    user: UserRow;
    session: SessionRow;
}
export declare function createSession(config: AuthCoreConfig, db: import("better-sqlite3").Database, userId: number): {
    token: string;
    expiresAt: number;
};
export declare function findSession(config: AuthCoreConfig, db: import("better-sqlite3").Database, token: string): SessionWithUser | null;
export declare function slideSession(config: AuthCoreConfig, db: import("better-sqlite3").Database, token: string): void;
export declare function revokeSession(db: import("better-sqlite3").Database, token: string): void;
export declare function revokeAllSessionsForUser(db: import("better-sqlite3").Database, userId: number): void;
export declare function isValidEmail(email: string): boolean;
export declare function normalizeEmail(email: string): string;
export declare function isLockedOut(key: string): boolean;
export declare function recordFailure(key: string): void;
export declare function resetFailures(key: string): void;
//# sourceMappingURL=auth.d.ts.map