import type { User } from './user.model';

/**
 * Blueprint 藍圖模型
 * 用於工地專案進度追蹤管理
 */
export interface Blueprint {
  id: string; // UUID
  organization_id?: string | null; // UUID，可選（個人藍圖為 null，組織藍圖為組織 ID）
  team_id?: string | null; // UUID，可選的團隊關聯
  owner_id: string; // UUID，專案經理/負責人
  name: string;
  slug: string; // GitHub 風格: blueprint-slug
  description?: string | null;
  avatar_url?: string | null;
  site_location?: string | null; // 工地位置
  project_manager_id?: string | null; // UUID，專案經理
  current_stage?: string | null; // 當前階段
  progress_percentage: number; // 完成百分比 (0-100)
  is_private: boolean; // 是否私有
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'archived'; // 專案狀態
  start_date?: string | null; // ISO 8601 timestamp，專案開始日期
  end_date?: string | null; // ISO 8601 timestamp，預期完成日期
  tags?: string[]; // 標籤
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

/**
 * Blueprint Member 角色類型
 */
export type BlueprintMemberRole = 'owner' | 'manager' | 'member' | 'viewer';

/**
 * Blueprint Member 狀態類型
 */
export type BlueprintMemberStatus = 'active' | 'inactive';

/**
 * Blueprint Member 藍圖成員模型
 */
export interface BlueprintMember {
  id: string; // UUID
  blueprint_id: string; // UUID
  user_id: string; // UUID
  role: BlueprintMemberRole;
  joined_at: string; // ISO 8601 timestamp
  status: BlueprintMemberStatus;
}

/**
 * 擴展的藍圖成員模型（包含用戶資訊）
 */
export interface BlueprintMemberWithUser extends BlueprintMember {
  user: User;
}

/**
 * Blueprint Progress 進度追蹤記錄模型
 */
export interface BlueprintProgress {
  id: string; // UUID
  blueprint_id: string; // UUID
  stage: string; // 階段名稱
  progress_percentage: number; // 該階段完成百分比 (0-100)
  notes?: string | null; // 備註
  recorded_by: string; // UUID，記錄人
  recorded_at: string; // ISO 8601 timestamp
}

/**
 * Blueprint Milestone 里程碑模型
 */
export interface BlueprintMilestone {
  id: string; // UUID
  blueprint_id: string; // UUID
  name: string;
  description?: string | null;
  target_date?: string | null; // ISO 8601 timestamp，目標日期
  completed_date?: string | null; // ISO 8601 timestamp，完成日期
  progress_percentage: number; // 里程碑完成百分比 (0-100)
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  order_index: number; // 排序索引
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

/**
 * Blueprint Document 專案文件模型
 * 主表，存儲文件的當前狀態和元數據
 */
export interface BlueprintDocument {
  id: string; // UUID
  blueprint_id: string; // UUID
  name: string; // 文件名稱
  path: string; // 文件路徑（樹狀結構，如：/folder/subfolder/file.pdf）
  type: 'file' | 'directory'; // 文件類型
  mime_type?: string | null; // MIME 類型（僅文件類型）
  size?: number | null; // 文件大小（位元組，僅文件類型）
  storage_path?: string | null; // Supabase Storage 路徑（如果使用 Storage）
  current_version: number; // 當前版本號
  parent_id?: string | null; // UUID，父目錄 ID（用於構建樹狀結構）
  created_by: string; // UUID，創建者
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
  discipline?: string | null;
  phase?: string | null;
  package?: string | null;
  hierarchy_path?: string | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Blueprint Document Version 文件版本模型
 * 存儲文件的版本歷史，類似 Git 的版本管理
 */
export interface BlueprintDocumentVersion {
  id: string; // UUID
  document_id: string; // UUID，關聯到 blueprint_documents
  version: number; // 版本號（從 1 開始遞增）
  content?: string | null; // 文件內容（如果是文本文件）
  storage_path?: string | null; // Supabase Storage 路徑（如果使用 Storage）
  file_hash?: string | null; // 文件哈希值（用於版本比較）
  change_description?: string | null; // 變更說明（commit message）
  changed_by: string; // UUID，變更者
  created_at: string; // ISO 8601 timestamp
}

/**
 * 擴展的藍圖模型（包含擁有者資訊）
 */
export interface BlueprintWithOwner extends Blueprint {
  owner: User;
}

/**
 * 擴展的藍圖模型（包含專案經理資訊）
 */
export interface BlueprintWithManager extends Blueprint {
  project_manager?: User | null;
}

/**
 * 擴展的藍圖模型（包含成員列表）
 */
export interface BlueprintWithMembers extends Blueprint {
  members: BlueprintMemberWithUser[];
}

/**
 * 擴展的文件模型（包含版本資訊）
 */
export interface BlueprintDocumentWithVersions extends BlueprintDocument {
  versions: BlueprintDocumentVersion[];
  latest_version?: BlueprintDocumentVersion;
}

/**
 * 文件樹節點結構
 */
export interface BlueprintDocumentTreeNode {
  document: BlueprintDocument;
  children: BlueprintDocumentTreeNode[];
}

/**
 * 創建藍圖的輸入參數
 */
export interface CreateBlueprintInput {
  organization_id?: string | null; // 可選，個人藍圖為 null
  team_id?: string;
  owner_id: string;
  name: string;
  slug: string;
  description?: string;
  site_location?: string;
  project_manager_id?: string;
  current_stage?: string;
  is_private?: boolean;
  status?: 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';
  start_date?: string;
  end_date?: string;
  tags?: string[];
}

/**
 * 更新藍圖的輸入參數
 */
export interface UpdateBlueprintInput {
  name?: string;
  slug?: string;
  description?: string;
  avatar_url?: string;
  site_location?: string;
  project_manager_id?: string;
  current_stage?: string;
  progress_percentage?: number;
  is_private?: boolean;
  status?: 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';
  start_date?: string;
  end_date?: string;
  tags?: string[];
}

/**
 * 創建進度追蹤記錄的輸入參數
 */
export interface CreateProgressInput {
  blueprint_id: string;
  stage: string;
  progress_percentage: number;
  notes?: string;
  recorded_by: string;
}

/**
 * 創建里程碑的輸入參數
 */
export interface CreateMilestoneInput {
  blueprint_id: string;
  name: string;
  description?: string;
  target_date?: string;
  order_index: number;
}

/**
 * 更新里程碑的輸入參數
 */
export interface UpdateMilestoneInput {
  name?: string;
  description?: string;
  target_date?: string;
  progress_percentage?: number;
  status?: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  completed_date?: string;
  order_index?: number;
}

/**
 * 創建文件的輸入參數
 */
export interface CreateDocumentInput {
  blueprint_id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  mime_type?: string;
  size?: number;
  storage_path?: string;
  parent_id?: string;
  created_by: string;
  current_version?: number;
  discipline?: string | null;
  phase?: string | null;
  package?: string | null;
  hierarchy_path?: string | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * 上傳文件版本的輸入參數
 */
export interface UploadDocumentVersionInput {
  document_id: string;
  content?: string;
  storage_path?: string;
  file_hash?: string;
  change_description?: string;
  changed_by: string;
}

/**
 * Blueprint Daily Report 每日施工日誌模型
 */
export interface BlueprintDailyReport {
  id: string; // UUID
  blueprint_id: string; // UUID
  date: string; // ISO 8601 date (YYYY-MM-DD)
  weather?: string | null; // 天氣資訊
  content: string; // 施工內容（必填）
  progress_percentage?: number | null; // 施工進度百分比 (0-100)
  participants?: string[] | null; // 參與人員 ID 陣列
  photos?: string[] | null; // 施工照片 URL 陣列
  issues?: string | null; // 問題記錄
  notes?: string | null; // 備註
  created_by: string; // UUID，創建者
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

/**
 * 創建每日施工日誌的輸入參數
 */
export interface CreateDailyReportInput {
  blueprint_id: string;
  date: string; // ISO 8601 date (YYYY-MM-DD)
  weather?: string;
  content: string;
  progress_percentage?: number;
  participants?: string[];
  photos?: string[];
  issues?: string;
  notes?: string;
}

/**
 * 更新每日施工日誌的輸入參數
 */
export interface UpdateDailyReportInput {
  date?: string; // ISO 8601 date (YYYY-MM-DD)
  weather?: string | null;
  content?: string;
  progress_percentage?: number | null;
  participants?: string[] | null;
  photos?: string[] | null;
  issues?: string | null;
  notes?: string | null;
}

/**
 * Blueprint 活動類型
 */
export type BlueprintActivityType =
  | 'blueprint'
  | 'task'
  | 'milestone'
  | 'document'
  | 'member'
  | 'progress'
  | 'comment'
  | 'report'
  | 'issue'
  | 'discussion'
  | 'quality';

/**
 * 建立活動記錄的輸入參數
 */
export interface CreateBlueprintActivityInput {
  blueprintId: string;
  type: BlueprintActivityType;
  action: string;
  description: string;
  userId: string;
  relatedId?: string | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * 查詢活動記錄的篩選條件
 */
export interface BlueprintActivityQuery {
  types?: BlueprintActivityType[];
  userIds?: string[];
  search?: string;
  since?: string; // ISO 8601 timestamp
  until?: string; // ISO 8601 timestamp
  limit?: number;
}

/**
 * 活動統計資料
 */
export interface BlueprintActivityStatistics {
  total: number;
  byType: Partial<Record<BlueprintActivityType, number>>;
  byUser: Record<string, number>;
  byDate: Array<{ date: string; count: number }>;
}

/**
 * Blueprint Activity 活動記錄模型
 */
export interface BlueprintActivity {
  id: string; // UUID
  blueprint_id: string; // UUID
  type: BlueprintActivityType; // 活動類型
  action: string; // 操作動作
  description: string; // 描述
  user_id: string; // UUID，操作者
  user_name?: string; // 操作者名稱（用於顯示）
  user_avatar?: string | null; // 操作者頭像
  related_id?: string | null; // UUID，關聯的實體 ID（如 task_id, milestone_id 等）
  metadata?: Record<string, unknown> | null; // 額外元數據（JSONB）
  created_at: string; // ISO 8601 timestamp
}

/**
 * Blueprint Discussion 討論模型
 */
export interface BlueprintDiscussion {
  id: string; // UUID
  blueprint_id: string; // UUID
  title: string;
  content: string;
  author_id: string; // UUID
  author_name?: string; // 作者名稱（用於顯示）
  author_avatar?: string | null; // 作者頭像
  comment_count: number; // 評論數量
  is_pinned: boolean; // 是否置頂
  tags?: string[]; // 標籤
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

/**
 * Blueprint Issue 問題模型
 */
export interface BlueprintIssue {
  id: string; // UUID
  blueprint_id: string; // UUID
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string | null; // UUID，負責人
  reporter_id: string; // UUID，報告者
  labels?: string[]; // 標籤
  due_date?: string | null; // ISO 8601 timestamp，截止日期
  resolved_at?: string | null; // ISO 8601 timestamp，解決時間
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

/**
 * Blueprint Quality Check 品質檢查記錄模型
 */
export interface BlueprintQualityCheck {
  id: string; // UUID
  blueprint_id: string; // UUID
  title: string;
  description: string;
  category: 'safety' | 'structure' | 'material' | 'process' | 'documentation' | 'other';
  status: 'pending' | 'in-progress' | 'passed' | 'failed' | 'needs-improvement';
  score?: number | null; // 0-100，評分
  inspector_id: string; // UUID，檢查員
  checked_by?: string | null; // UUID，檢查人
  check_date?: string | null; // ISO 8601 timestamp，檢查日期
  next_check_date?: string | null; // ISO 8601 timestamp，下次檢查日期
  attachments?: string[]; // 附件 URL 陣列
  notes?: string | null; // 備註
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

/**
 * 擴展的品質檢查模型（包含人員資訊）
 */
export interface BlueprintQualityCheckWithUsers extends BlueprintQualityCheck {
  inspector?: User | null;
  checked_user?: User | null;
}

/**
 * 創建討論的輸入參數
 */
export interface CreateDiscussionInput {
  blueprint_id: string;
  title: string;
  content: string;
  tags?: string[];
}

/**
 * 更新討論的輸入參數
 */
export interface UpdateDiscussionInput {
  title?: string;
  content?: string;
  tags?: string[];
  is_pinned?: boolean;
}

/**
 * 創建問題的輸入參數
 */
export interface CreateIssueInput {
  blueprint_id: string;
  title: string;
  description: string;
  status?: 'open' | 'in-progress' | 'resolved' | 'closed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
  labels?: string[];
  due_date?: string;
  reporter_id?: string;
  resolved_at?: string | null;
}

/**
 * 更新問題的輸入參數
 */
export interface UpdateIssueInput {
  title?: string;
  description?: string;
  status?: 'open' | 'in-progress' | 'resolved' | 'closed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string | null;
  labels?: string[];
  due_date?: string | null;
  resolved_at?: string | null;
}

/**
 * 創建品質檢查記錄的輸入參數
 */
export interface CreateQualityCheckInput {
  blueprint_id: string;
  title: string;
  description: string;
  category: 'safety' | 'structure' | 'material' | 'process' | 'documentation' | 'other';
  status?: 'pending' | 'in-progress' | 'passed' | 'failed' | 'needs-improvement';
  score?: number;
  inspector_id: string;
  checked_by?: string;
  check_date?: string;
  next_check_date?: string;
  attachments?: string[];
  notes?: string;
}

/**
 * 更新品質檢查記錄的輸入參數
 */
export interface UpdateQualityCheckInput {
  title?: string;
  description?: string;
  category?: 'safety' | 'structure' | 'material' | 'process' | 'documentation' | 'other';
  status?: 'pending' | 'in-progress' | 'passed' | 'failed' | 'needs-improvement';
  score?: number | null;
  inspector_id?: string;
  checked_by?: string | null;
  check_date?: string | null;
  next_check_date?: string | null;
  attachments?: string[];
  notes?: string | null;
}
