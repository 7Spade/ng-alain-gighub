import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Database } from '../../types/common';
import { InvitationStatus } from '../../types/org';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type CollaborationInvitationRow = Database['public']['Tables']['collaboration_invitations']['Row'];
type CollaborationInvitationInsert = Database['public']['Tables']['collaboration_invitations']['Insert'];
type CollaborationInvitationUpdate = Database['public']['Tables']['collaboration_invitations']['Update'];

/**
 * CollaborationInvitation 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type CollaborationInvitation = CollaborationInvitationRow;
export type { CollaborationInvitationInsert, CollaborationInvitationUpdate };

/**
 * CollaborationInvitation Repository
 *
 * 提供协作邀请相关的数据访问方法
 *
 * @example
 * ```typescript
 * const invRepo = inject(CollaborationInvitationRepository);
 * invRepo.findByToOrgId('org-id').subscribe(invitations => {
 *   console.log('Invitations:', invitations);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class CollaborationInvitationRepository extends BaseRepository<
  CollaborationInvitation,
  CollaborationInvitationInsert,
  CollaborationInvitationUpdate
> {
  protected tableName = 'collaboration_invitations';

  /**
   * 根据蓝图 ID 查询邀请列表
   *
   * @param blueprintId 蓝图 ID
   * @param options 查询选项
   * @returns Observable<CollaborationInvitation[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<CollaborationInvitation[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId // 会自动转换为 blueprint_id
      }
    });
  }

  /**
   * 根据发送组织 ID 查询邀请列表
   *
   * @param fromOrgId 发送组织 ID
   * @param options 查询选项
   * @returns Observable<CollaborationInvitation[]>
   */
  findByFromOrgId(fromOrgId: string, options?: QueryOptions): Observable<CollaborationInvitation[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        fromOrgId // 会自动转换为 from_org_id
      }
    });
  }

  /**
   * 根据接收组织 ID 查询邀请列表
   *
   * @param toOrgId 接收组织 ID
   * @param options 查询选项
   * @returns Observable<CollaborationInvitation[]>
   */
  findByToOrgId(toOrgId: string, options?: QueryOptions): Observable<CollaborationInvitation[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        toOrgId // 会自动转换为 to_org_id
      }
    });
  }

  /**
   * 根据状态查询邀请列表
   *
   * @param status 邀请状态
   * @param options 查询选项
   * @returns Observable<CollaborationInvitation[]>
   */
  findByStatus(status: InvitationStatus, options?: QueryOptions): Observable<CollaborationInvitation[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status
      }
    });
  }

  /**
   * 查询过期的邀请列表
   *
   * @param options 查询选项
   * @returns Observable<CollaborationInvitation[]>
   */
  findExpired(options?: QueryOptions): Observable<CollaborationInvitation[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        expiresAt: { $lt: new Date().toISOString() } // 过期时间小于当前时间
      }
    });
  }

  /**
   * 查询待处理的邀请列表
   *
   * @param options 查询选项
   * @returns Observable<CollaborationInvitation[]>
   */
  findPending(options?: QueryOptions): Observable<CollaborationInvitation[]> {
    return this.findByStatus(InvitationStatus.PENDING, options);
  }
}
