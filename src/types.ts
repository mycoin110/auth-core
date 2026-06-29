export type UserStatus = "pending" | "active" | "disabled";
export type UserRole = "user" | "admin";

export interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  status: UserStatus;
  role: UserRole;
  display_name: string | null;
  created_at: number;
  last_login_at: number | null;
}

export interface SessionRow {
  token: string;
  user_id: number;
  created_at: number;
  expires_at: number;
}

export interface UserModuleRow {
  user_id: number;
  module_key: string;
  created_at: number;
}
