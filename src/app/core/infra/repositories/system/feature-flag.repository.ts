import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from '../base.repository';
import { Database } from '../../types/common';
import { toCamelCaseData } from '../../utils/transformers';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type FeatureFlagRow = Database['public']['Tables']['feature_flags']['Row'];
type FeatureFlagInsert = Database['public']['Tables']['feature_flags']['Insert'];
type FeatureFlagUpdate = Database['public']['Tables']['feature_flags']['Update'];

/**
 * FeatureFlag 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type FeatureFlag = FeatureFlagRow;
export type { FeatureFlagInsert, FeatureFlagUpdate };

/**
 * FeatureFlag Repository
 *
 * 提供功能开关相关的数据访问方法
 *
 * @example
 * ```typescript
 * const flagRepo = inject(FeatureFlagRepository);
 * flagRepo.findByKey('new-feature').subscribe(flag => {
 *   console.log('Feature flag:', flag);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class FeatureFlagRepository extends BaseRepository<FeatureFlag, FeatureFlagInsert, FeatureFlagUpdate> {
  protected tableName = 'feature_flags';

  /**
   * 根据键查询功能开关
   *
   * @param flagKey 功能开关键
   * @returns Observable<FeatureFlag | null>
   */
  findByKey(flagKey: string): Observable<FeatureFlag | null> {
    return this.findAll({
      filters: {
        flagKey // 会自动转换为 flag_key
      }
    }).pipe(map(flags => (flags.length > 0 ? flags[0] : null)));
  }

  /**
   * 查询启用的功能开关
   *
   * @param options 查询选项
   * @returns Observable<FeatureFlag[]>
   */
  findEnabledFlags(options?: QueryOptions): Observable<FeatureFlag[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        isEnabled: true // 会自动转换为 is_enabled
      }
    });
  }

  /**
   * 根据目标账户查询功能开关
   *
   * @param accountId 账户 ID
   * @returns Observable<FeatureFlag[]>
   */
  findByTargetAccount(accountId: string): Observable<FeatureFlag[]> {
    // 需要在 target_accounts JSON 字段中查找 accountId
    // 这需要特殊处理，可能需要使用 Supabase 的 JSON 查询功能
    // 暂时使用 findAll 然后过滤，或者标记为 TODO
    return this.findAll({
      filters: {
        isEnabled: true
      }
    }).pipe(
      map(flags =>
        flags.filter(flag => {
          // BaseRepository 会自动转换，但类型定义仍然是 snake_case
          // 使用 snake_case 属性名访问（BaseRepository 转换后可能仍然是 snake_case）
          const targetAccounts = (flag as any).target_accounts as string[] | null;
          return targetAccounts && targetAccounts.includes(accountId);
        })
      )
    );
  }

  /**
   * 根据目标组织查询功能开关
   *
   * @param organizationId 组织 ID
   * @returns Observable<FeatureFlag[]>
   */
  findByTargetOrganization(organizationId: string): Observable<FeatureFlag[]> {
    return this.findAll({
      filters: {
        isEnabled: true
      }
    }).pipe(
      map(flags =>
        flags.filter(flag => {
          // BaseRepository 会自动转换，但类型定义仍然是 snake_case
          // 使用 snake_case 属性名访问（BaseRepository 转换后可能仍然是 snake_case）
          const targetOrganizations = (flag as any).target_organizations as string[] | null;
          return targetOrganizations && targetOrganizations.includes(organizationId);
        })
      )
    );
  }

  /**
   * 查询当前有效的功能开关（在有效期内）
   *
   * @returns Observable<FeatureFlag[]>
   */
  findActiveFlags(): Observable<FeatureFlag[]> {
    // 有效的功能开关：enabled = true AND (starts_at IS NULL OR starts_at <= NOW()) AND (ends_at IS NULL OR ends_at >= NOW())
    // 需要使用 Supabase client 直接查询
    const now = new Date().toISOString();
    let query: any = this.supabase
      .from(this.tableName as any)
      .select('*')
      .eq('is_enabled', true)
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`);

    return from(Promise.resolve(query) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '查询有效功能开关失败');
        }
        return (response.data || []).map(item => toCamelCaseData<FeatureFlag>(item));
      })
    );
  }
}
