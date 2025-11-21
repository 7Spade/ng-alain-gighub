import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from '../base.repository';
import { Database } from '../../types/common';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type CollaborationMemberRow = Database['public']['Tables']['collaboration_members']['Row'];
type CollaborationMemberInsert = Database['public']['Tables']['collaboration_members']['Insert'];
type CollaborationMemberUpdate = Database['public']['Tables']['collaboration_members']['Update'];

/**
 * CollaborationMember 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type CollaborationMember = CollaborationMemberRow;
export type { CollaborationMemberInsert, CollaborationMemberUpdate };

/**
 * CollaborationMember Repository
 *
 * 提供协作成员相关的数据访问方法
 *
 * @example
 * ```typescript
 * const memberRepo = inject(CollaborationMemberRepository);
 * memberRepo.findByCollaborationId('collab-id').subscribe(members => {
 *   console.log('Members:', members);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class CollaborationMemberRepository extends BaseRepository<
  CollaborationMember,
  CollaborationMemberInsert,
  CollaborationMemberUpdate
> {
  protected tableName = 'collaboration_members';

  /**
   * 根据协作关系 ID 查询成员列表
   *
   * @param collaborationId 协作关系 ID
   * @param options 查询选项
   * @returns Observable<CollaborationMember[]>
   */
  findByCollaborationId(collaborationId: string, options?: QueryOptions): Observable<CollaborationMember[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        collaborationId // 会自动转换为 collaboration_id
      }
    });
  }

  /**
   * 根据账户 ID 查询成员列表
   *
   * @param accountId 账户 ID
   * @param options 查询选项
   * @returns Observable<CollaborationMember[]>
   */
  findByAccountId(accountId: string, options?: QueryOptions): Observable<CollaborationMember[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        accountId // 会自动转换为 account_id
      }
    });
  }

  /**
   * 根据角色查询成员列表
   *
   * @param role 成员角色
   * @param options 查询选项
   * @returns Observable<CollaborationMember[]>
   */
  findByRole(role: string, options?: QueryOptions): Observable<CollaborationMember[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        role
      }
    });
  }
}
