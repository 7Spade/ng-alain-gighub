import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from '../base.repository';
import { SupabaseService } from '../../../supabase/supabase.service';
import { AccountStatus, AccountType } from '../../types/account';
import { Database } from '../../types/common';
import { toCamelCaseData } from '../../utils/transformers';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type AccountRow = Database['public']['Tables']['accounts']['Row'];
type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
type AccountUpdate = Database['public']['Tables']['accounts']['Update'];

/**
 * Account 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Account = AccountRow;
export type { AccountInsert, AccountUpdate };

/**
 * Account Repository
 *
 * 提供账户相关的数据访问方法
 *
 * @example
 * ```typescript
 * const accountRepo = inject(AccountRepository);
 * accountRepo.findByType(AccountType.USER).subscribe(accounts => {
 *   console.log('User accounts:', accounts);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AccountRepository extends BaseRepository<Account, AccountInsert, AccountUpdate> {
  protected tableName = 'accounts';
  private readonly supabaseService = inject(SupabaseService);

  /**
   * 根据账户类型查询账户
   *
   * @param type 账户类型
   * @param options 查询选项
   * @returns Observable<Account[]>
   */
  findByType(type: AccountType, options?: QueryOptions): Observable<Account[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        type
      }
    });
  }

  /**
   * 根据状态查询账户
   *
   * @param status 账户状态
   * @param options 查询选项
   * @returns Observable<Account[]>
   */
  findByStatus(status: AccountStatus, options?: QueryOptions): Observable<Account[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status
      }
    });
  }

  /**
   * 根据 auth_user_id 查询账户
   *
   * @param authUserId 认证用户 ID
   * @returns Observable<Account | null>
   */
  findByAuthUserId(authUserId: string): Observable<Account | null> {
    return this.findAll({
      filters: {
        authUserId // 会自动转换为 auth_user_id
      }
    }).pipe(map(accounts => (accounts.length > 0 ? accounts[0] : null)));
  }

  /**
   * 根据 auth_organization_id 查询账户（用于查询用户创建的组织账户）
   * 注意：一个用户可能创建多个组织账户，所以返回数组
   *
   * @param authOrganizationId 创建者用户 ID
   * @returns Observable<Account[]>
   */
  findByAuthOrganizationId(authOrganizationId: string): Observable<Account[]> {
    return this.findAll({
      filters: {
        authOrganizationId // 会自动转换为 auth_organization_id
      }
    });
  }

  /**
   * 根据多个 ID 批量查询账户
   *
   * @param ids 账户 ID 数组
   * @returns Observable<Account[]>
   */
  findByIds(ids: string[]): Observable<Account[]> {
    if (ids.length === 0) {
      return of([]);
    }
    // 使用 Supabase 的 in 查询
    return from(this.supabaseService.client.from(this.tableName).select('*').in('id', ids)).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '批量查询账户失败');
        }
        // 使用转换工具函数
        return (response.data || []).map(item => toCamelCaseData<Account>(item));
      })
    );
  }

  /**
   * 根据邮箱查询账户
   *
   * @param email 邮箱地址
   * @returns Observable<Account | null>
   */
  findByEmail(email: string): Observable<Account | null> {
    return this.findAll({
      filters: {
        email
      }
    }).pipe(map(accounts => (accounts.length > 0 ? accounts[0] : null)));
  }

  /**
   * 根据名称查询账户
   * 用于通过用户名/组织名查找账户（类似 GitHub 的 /:username 路由）
   *
   * @param name 账户名称
   * @returns Observable<Account | null>
   */
  findByName(name: string): Observable<Account | null> {
    return this.findAll({
      filters: {
        name
      }
    }).pipe(map(accounts => (accounts.length > 0 ? accounts[0] : null)));
  }

  /**
   * 查询活跃的账户（状态为 active）
   *
   * @param options 查询选项
   * @returns Observable<Account[]>
   */
  findActive(options?: QueryOptions): Observable<Account[]> {
    return this.findByStatus(AccountStatus.ACTIVE, options);
  }

  /**
   * 搜索账户（支持模糊查询）
   * 使用 SECURITY DEFINER 函数绕过 RLS 限制，允许搜索所有活跃的账户
   *
   * @param query 搜索关键词
   * @param type 账户类型（可选）
   * @param options 查询选项
   * @returns Observable<Account[]>
   */
  search(query: string, type?: AccountType, options?: QueryOptions): Observable<Account[]> {
    // 允许空查询，函数内部会处理（返回所有匹配类型的账户）
    const trimmedQuery = query?.trim() || '';
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 20;
    const orderBy = options?.orderBy || 'name';
    const orderDirection = options?.orderDirection || 'asc';

    // 使用 SECURITY DEFINER 函数搜索账户，绕过 RLS 限制
    return from(
      this.supabaseService.client.rpc('search_accounts_for_explore', {
        p_query: trimmedQuery,
        p_type: type || null,
        p_page: page,
        p_page_size: pageSize,
        p_order_by: orderBy === 'createdAt' ? 'created_at' : 'name',
        p_order_direction: orderDirection
      })
    ).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '搜索账户失败');
        }
        // 使用转换工具函数将 snake_case 转换为 camelCase
        return (response.data || []).map(item => toCamelCaseData<Account>(item));
      })
    );
  }

  /**
   * 创建 Organization 账户（使用 SECURITY DEFINER 函数绕过 RLS）
   *
   * @param name 组织名称
   * @param email 邮箱（可选）
   * @param status 账户状态（默认 'active'）
   * @returns Observable<Account>
   */
  createOrganizationAccount(name: string, email?: string | null, status: AccountStatus = AccountStatus.ACTIVE): Observable<Account> {
    // 调用 RPC 函数创建组织账户
    return from(
      this.supabaseService.client.rpc('create_organization_account', {
        p_name: name,
        p_email: email || null,
        p_status: status
      })
    ).pipe(
      map((response: { data: string | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '创建组织账户失败');
        }
        if (!response.data) {
          throw new Error('创建组织账户失败：未返回账户 ID');
        }
        return response.data;
      }),
      // 使用返回的账户 ID 查询完整的账户信息
      // RLS 策略已更新，允许用户查看自己创建的组织账户（auth_organization_id = auth.uid()）
      switchMap((accountId: string) =>
        this.findById(accountId).pipe(
          map((account: Account | null) => {
            if (!account) {
              throw new Error('创建组织账户失败：无法查询到创建的账户。请检查 RLS 策略是否允许查看自己创建的组织账户。');
            }
            return account;
          })
        )
      )
    );
  }

  /**
   * 创建 Bot 账户（使用 SECURITY DEFINER 函数绕过 RLS）
   *
   * @param name 机器人名称
   * @param email 邮箱（可选）
   * @param status 账户状态（默认 'active'）
   * @param organizationId 组织账户 ID（可选，NULL = 个人 Bot，有值 = 组织 Bot）
   * @returns Observable<Account>
   */
  createBotAccount(
    name: string,
    email?: string | null,
    status: AccountStatus = AccountStatus.ACTIVE,
    organizationId?: string | null
  ): Observable<Account> {
    // 调用 RPC 函数创建 Bot 账户
    return from(
      this.supabaseService.client.rpc('create_bot_account', {
        p_name: name,
        p_email: email || null,
        p_status: status,
        p_organization_id: organizationId || null
      })
    ).pipe(
      map((response: { data: string | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '创建机器人账户失败');
        }
        if (!response.data) {
          throw new Error('创建机器人账户失败：未返回账户 ID');
        }
        return response.data;
      }),
      // 使用返回的账户 ID 查询完整的账户信息
      // RLS 策略已更新，允许用户查看自己创建的 Bot 账户（auth_bot_id = auth.uid()）
      // 以及组织成员查看组织 Bot（auth_organization_id 对应的组织成员）
      switchMap((accountId: string) =>
        this.findById(accountId).pipe(
          map((account: Account | null) => {
            if (!account) {
              throw new Error('创建机器人账户失败：无法查询到创建的账户。请检查 RLS 策略是否允许查看。');
            }
            return account;
          })
        )
      )
    );
  }
}
