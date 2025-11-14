import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';
import { AccountType, AccountStatus } from '../types/account.types';

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
        type,
      },
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
        status,
      },
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
        authUserId, // 会自动转换为 auth_user_id
      },
    }).pipe(
      map(accounts => accounts.length > 0 ? accounts[0] : null)
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
        email,
      },
    }).pipe(
      map(accounts => accounts.length > 0 ? accounts[0] : null)
    );
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
}

