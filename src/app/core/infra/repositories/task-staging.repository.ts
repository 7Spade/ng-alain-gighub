import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/common';

/**
 * TaskStaging 实体类型（camelCase）
 */
type TaskStagingRow = Database['public']['Tables']['task_staging']['Row'];
type TaskStagingInsert = Database['public']['Tables']['task_staging']['Insert'];
type TaskStagingUpdate = Database['public']['Tables']['task_staging']['Update'];

export type TaskStaging = TaskStagingRow;
export type { TaskStagingInsert, TaskStagingUpdate };

/**
 * TaskStaging Repository
 *
 * 提供任务暂存区相关的数据访问方法
 */
@Injectable({
  providedIn: 'root'
})
export class TaskStagingRepository extends BaseRepository<TaskStaging, TaskStagingInsert, TaskStagingUpdate> {
  protected tableName = 'task_staging';

  /**
   * 根据任务 ID 查询暂存记录
   *
   * @param taskId 任务 ID
   * @param options 查询选项
   * @returns Observable<TaskStaging[]>
   */
  findByTaskId(taskId: string, options?: QueryOptions): Observable<TaskStaging[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        taskId // 会自动转换为 task_id
      }
    });
  }

  /**
   * 根據藍圖 ID 查詢暫存記錄（透過 JOIN tasks 表）
   *
   * 注意：此方法需要在 BaseRepository 支援 JOIN，或使用 RPC
   * 目前簡化為透過所有記錄過濾
   *
   * @param blueprintId 藍圖 ID
   * @param options 查詢選項
   * @returns Observable<TaskStaging[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<TaskStaging[]> {
    // TODO: 實現更高效的查詢（使用 JOIN 或 RPC）
    // 目前簡化為返回所有記錄，由 Service 層過濾
    // 或者在 Supabase 創建一個 View 或 Function 來處理
    return this.findAll(options);
  }

  /**
   * 根据提交者 ID 查询暂存记录
   *
   * @param submittedBy 提交者 ID
   * @param options 查询选项
   * @returns Observable<TaskStaging[]>
   */
  findBySubmittedBy(submittedBy: string, options?: QueryOptions): Observable<TaskStaging[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        submittedBy // 会自动转换为 submitted_by
      }
    });
  }

  /**
   * 查询可撤回的暂存记录（48小时内且 can_withdraw = true）
   *
   * @param options 查询选项
   * @returns Observable<TaskStaging[]>
   */
  findWithdrawable(options?: QueryOptions): Observable<TaskStaging[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        canWithdraw: true // 会自动转换为 can_withdraw
        // TODO: 添加 expires_at > NOW() 的条件
      }
    });
  }

  /**
   * 查询已过期的暂存记录（expires_at < NOW()）
   *
   * @param options 查询选项
   * @returns Observable<TaskStaging[]>
   */
  findExpired(options?: QueryOptions): Observable<TaskStaging[]> {
    // TODO: 实现过期查询
    // 需要使用数据库函数或 RPC 来比较时间
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters
        // expires_at 比较需要特殊处理
      }
    });
  }
}
