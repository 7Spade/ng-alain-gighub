import { SearchType } from '@core';
import { Account, Blueprint } from '@shared';

/**
 * 搜索选项
 */
export interface SearchOptions {
  /** 搜索关键词 */
  query: string;
  /** 搜索类型 */
  type: SearchType;
  /** 页码（从 1 开始） */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 排序字段 */
  orderBy?: 'name' | 'createdAt';
  /** 排序方向 */
  orderDirection?: 'asc' | 'desc';
}

/**
 * 搜索结果
 */
export interface SearchResult {
  /** 用户结果 */
  users: Account[];
  /** 组织结果 */
  organizations: Account[];
  /** 蓝图结果 */
  blueprints: Blueprint[];
  /** 总数统计 */
  total: {
    /** 用户总数 */
    users: number;
    /** 组织总数 */
    organizations: number;
    /** 蓝图总数 */
    blueprints: number;
    /** 全部总数 */
    all: number;
  };
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}

/**
 * 账户扩展类型（用于处理头像 URL）
 * Repository 返回的数据已经转换为 camelCase，但类型定义可能包含 snake_case
 * 使用交叉类型而不是扩展接口，避免类型冲突
 */
export type AccountWithAvatar = Account & {
  /** 头像 URL（camelCase，转换后的格式） */
  avatarUrl?: string | null;
};

/**
 * 蓝图扩展类型（用于处理描述字段）
 * Repository 返回的数据已经转换为 camelCase，但类型定义可能包含 snake_case
 * 使用交叉类型而不是扩展接口，避免类型冲突
 */
export type BlueprintWithDescription = Blueprint & {
  /** 项目代码（camelCase，转换后的格式） */
  projectCode?: string | null;
};
