import { Injectable } from '@angular/core';
import { PostgrestResponse } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { handleSupabaseResponse } from '../../errors/supabase-error.transformer';
import { Database } from '../../types/common';
import { toCamelCaseData } from '../../utils/transformers';
import { BaseRepository, QueryOptions } from '../base.repository';

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
   * 使用 Supabase 的關聯查詢功能，透過 task_id 關聯到 tasks 表
   *
   * @param blueprintId 藍圖 ID
   * @param options 查詢選項
   * @returns Observable<TaskStaging[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<TaskStaging[]> {
    // 使用 Supabase 的 inner join 語法
    // 透過 task_id 關聯 tasks 表，並篩選 blueprint_id
    let query = this.supabase
      .from(this.tableName as any)
      .select(options?.select || '*')
      .eq('tasks.blueprint_id', blueprintId) as any;

    // 應用額外的篩選條件
    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        query = query.eq(snakeKey, value);
      }
    }

    // 應用排序
    if (options?.orderBy) {
      const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      query = query.order(snakeOrderBy, { ascending: options.orderDirection !== 'desc' });
    }

    // 應用分頁
    if (options?.page && options?.pageSize) {
      const fromIndex = (options.page - 1) * options.pageSize;
      const toIndex = fromIndex + options.pageSize - 1;
      query = query.range(fromIndex, toIndex);
    }

    return from(Promise.resolve(query) as Promise<PostgrestResponse<any>>).pipe(
      map((response: PostgrestResponse<any>) => {
        const data = handleSupabaseResponse(response, `${this.constructor.name}.findByBlueprintId`);
        return Array.isArray(data) ? data.map(item => toCamelCaseData<TaskStaging>(item)) : [toCamelCaseData<TaskStaging>(data)];
      })
    );
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
    // 使用 BaseRepository 的 findByTimeComparison 方法
    // expires_at > NOW() 表示未過期，且 can_withdraw = true
    return this.findByTimeComparison('expiresAt', 'gt', new Date(), {
      ...options,
      filters: {
        ...options?.filters,
        canWithdraw: true // 会自动转换为 can_withdraw
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
    // 使用 BaseRepository 的 findByTimeComparison 方法
    // expires_at < NOW() 表示已過期
    return this.findByTimeComparison('expiresAt', 'lt', new Date(), options);
  }
}
