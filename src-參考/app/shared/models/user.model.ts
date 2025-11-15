/**
 * User Profile 模型
 *
 * 對應 public.users 表，擴展 auth.users 的資料
 */
export interface User {
  id: string; // UUID，對應 auth.users.id
  email: string;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  timezone?: string | null;
  locale?: string | null;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

/**
 * 創建用戶資料的輸入參數
 */
export interface CreateUserInput {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  timezone?: string;
  locale?: string;
}

/**
 * 更新用戶資料的輸入參數
 */
export interface UpdateUserInput {
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  timezone?: string;
  locale?: string;
}
