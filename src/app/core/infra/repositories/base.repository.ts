import { Injectable, inject } from '@angular/core';
import { PostgrestMaybeSingleResponse, PostgrestResponse, PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { SupabaseService } from '../../supabase/supabase.service';
import { handleSupabaseResponse } from '../errors/supabase-error.transformer';
import { Database } from '../types/common';
import { toCamelCaseData, toSnakeCaseData } from '../utils/transformers';

/**
 * 查询选项
 */
export interface QueryOptions {
  /** 分页：页码（从 1 开始） */
  page?: number;
  /** 分页：每页数量 */
  pageSize?: number;
  /** 排序字段 */
  orderBy?: string;
  /** 排序方向 */
  orderDirection?: 'asc' | 'desc';
  /** 筛选条件 */
  filters?: Record<string, any>;
  /** 选择字段（默认 '*'） */
  select?: string;
}

/**
 * 分页结果
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 基础 Repository 类
 *
 * 提供通用的 CRUD 操作方法，封装 Supabase 客户端调用
 *
 * @template T 实体类型（camelCase）
 * @template TInsert 插入类型（camelCase）
 * @template TUpdate 更新类型（camelCase）
 *
 * @example
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class BlueprintRepository extends BaseRepository<Blueprint, BlueprintInsert, BlueprintUpdate> {
 *   protected tableName = 'blueprints';
 * }
 * ```
 */
@Injectable()
export abstract class BaseRepository<T, TInsert = Partial<T>, TUpdate = Partial<T>> {
  protected readonly supabase: SupabaseClient<Database> = inject(SupabaseService).client;

  /**
   * 表名（snake_case）
   * 子类必须实现
   */
  protected abstract tableName: string;

  /**
   * 获取所有记录
   *
   * @param options 查询选项
   * @returns Observable<T[]>
   */
  findAll(options?: QueryOptions): Observable<T[]> {
    // 使用类型断言，因为 tableName 是运行时值，但 Supabase 需要字面量类型
    let query = this.supabase.from(this.tableName as any).select(options?.select || '*') as any;

    // 应用筛选条件
    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        query = query.eq(snakeKey, value);
      }
    }

    // 应用排序
    if (options?.orderBy) {
      const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      query = query.order(snakeOrderBy, { ascending: options.orderDirection !== 'desc' });
    }

    // 应用分页
    if (options?.page && options?.pageSize) {
      const fromIndex = (options.page - 1) * options.pageSize;
      const toIndex = fromIndex + options.pageSize - 1;
      query = query.range(fromIndex, toIndex);
    }

    // Convert PromiseLike query builder to actual Promise for RxJS from()
    return from(Promise.resolve(query) as Promise<PostgrestResponse<any>>).pipe(
      map((response: PostgrestResponse<any>) => {
        const data = handleSupabaseResponse(response, `${this.constructor.name}.findAll`);
        return Array.isArray(data) ? data.map(item => toCamelCaseData<T>(item)) : [toCamelCaseData<T>(data)];
      })
    );
  }

  /**
   * 根据 ID 获取单条记录
   *
   * @param id 记录 ID
   * @returns Observable<T | null>
   */
  findById(id: string): Observable<T | null> {
    return from(
      this.supabase
        .from(this.tableName as any)
        .select('*')
        .eq('id', id)
        .maybeSingle() as unknown as Promise<PostgrestMaybeSingleResponse<any>>
    ).pipe(
      map((response: PostgrestMaybeSingleResponse<any>) => {
        if (response.error && response.error.code !== 'PGRST116') {
          throw handleSupabaseResponse(response, `${this.constructor.name}.findById`);
        }
        if (!response.data) {
          return null;
        }
        return toCamelCaseData<T>(response.data);
      })
    );
  }

  /**
   * 创建新记录
   *
   * @param data 插入数据（camelCase）
   * @returns Observable<T>
   */
  create(data: TInsert): Observable<T> {
    const snakeData = toSnakeCaseData(data as Record<string, any>);

    return from(
      this.supabase
        .from(this.tableName as any)
        .insert(snakeData as any)
        .select()
        .single() as unknown as Promise<PostgrestSingleResponse<any>>
    ).pipe(
      map((response: PostgrestSingleResponse<any>) => {
        const result = handleSupabaseResponse(response, `${this.constructor.name}.create`);
        return toCamelCaseData<T>(result);
      })
    );
  }

  /**
   * 更新记录
   *
   * @param id 记录 ID
   * @param data 更新数据（camelCase）
   * @returns Observable<T>
   */
  update(id: string, data: TUpdate): Observable<T> {
    const snakeData = toSnakeCaseData(data as Record<string, any>);

    return from(
      this.supabase
        .from(this.tableName as any)
        .update(snakeData as any)
        .eq('id', id)
        .select()
        .single() as unknown as Promise<PostgrestSingleResponse<any>>
    ).pipe(
      map((response: PostgrestSingleResponse<any>) => {
        const result = handleSupabaseResponse(response, `${this.constructor.name}.update`);
        return toCamelCaseData<T>(result);
      })
    );
  }

  /**
   * 删除记录
   *
   * @param id 记录 ID
   * @returns Observable<void>
   */
  delete(id: string): Observable<void> {
    return from(
      this.supabase
        .from(this.tableName as any)
        .delete()
        .eq('id', id) as unknown as Promise<PostgrestResponse<any>>
    ).pipe(
      map((response: PostgrestResponse<any>) => {
        if (response.error) {
          throw handleSupabaseResponse(response, `${this.constructor.name}.delete`);
        }
      })
    );
  }

  /**
   * 分页查询
   *
   * @param options 查询选项（必须包含 page 和 pageSize）
   * @returns Observable<PaginatedResult<T>>
   */
  findPaginated(options: QueryOptions & { page: number; pageSize: number }): Observable<PaginatedResult<T>> {
    // 先获取总数
    const countQuery = this.supabase.from(this.tableName as any).select('*', { count: 'exact', head: true }) as any;

    // 应用筛选条件
    let dataQuery = this.supabase.from(this.tableName as any).select(options.select || '*') as any;

    if (options.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        countQuery.eq(snakeKey, value);
        dataQuery = dataQuery.eq(snakeKey, value);
      }
    }

    // 应用排序
    if (options.orderBy) {
      const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      dataQuery = dataQuery.order(snakeOrderBy, { ascending: options.orderDirection !== 'desc' });
    }

    // 应用分页
    const fromIndex = (options.page - 1) * options.pageSize;
    const toIndex = fromIndex + options.pageSize - 1;
    dataQuery = dataQuery.range(fromIndex, toIndex);

    // 并行查询总数和数据
    return from(Promise.all([countQuery, dataQuery]) as Promise<[PostgrestResponse<any>, PostgrestResponse<any>]>).pipe(
      map(([countResponse, dataResponse]: [PostgrestResponse<any>, PostgrestResponse<any>]) => {
        const total = countResponse.count || 0;
        const data = handleSupabaseResponse(dataResponse, `${this.constructor.name}.findPaginated`);
        const items = Array.isArray(data) ? data.map(item => toCamelCaseData<T>(item)) : [toCamelCaseData<T>(data)];

        return {
          data: items,
          total,
          page: options.page,
          pageSize: options.pageSize,
          totalPages: Math.ceil(total / options.pageSize)
        };
      })
    );
  }

  /**
   * 根據時間欄位進行篩選的通用方法
   *
   * @param fieldName 時間欄位名稱（camelCase）
   * @param operator 比較運算子 ('gt' | 'gte' | 'lt' | 'lte')
   * @param value 比較值（ISO 字串或 Date 物件），預設為當前時間
   * @param options 查詢選項
   * @returns Observable<T[]>
   *
   * @example
   * ```typescript
   * // 查詢未過期的記錄 (expires_at > NOW())
   * this.findByTimeComparison('expiresAt', 'gt').subscribe(records => {...});
   *
   * // 查詢已過期的記錄 (expires_at < NOW())
   * this.findByTimeComparison('expiresAt', 'lt').subscribe(records => {...});
   * ```
   */
  protected findByTimeComparison(
    fieldName: string,
    operator: 'gt' | 'gte' | 'lt' | 'lte',
    value: string | Date = new Date(),
    options?: QueryOptions
  ): Observable<T[]> {
    const snakeFieldName = fieldName.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    const isoValue = value instanceof Date ? value.toISOString() : value;

    let query = this.supabase.from(this.tableName as any).select(options?.select || '*') as any;

    // 應用時間比較
    query = query[operator](snakeFieldName, isoValue);

    // 應用額外的篩選條件
    if (options?.filters) {
      for (const [key, val] of Object.entries(options.filters)) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        query = query.eq(snakeKey, val);
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
        const data = handleSupabaseResponse(response, `${this.constructor.name}.findByTimeComparison`);
        return Array.isArray(data) ? data.map(item => toCamelCaseData<T>(item)) : [toCamelCaseData<T>(data)];
      })
    );
  }
}
