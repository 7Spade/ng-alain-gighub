import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { OrganizationMemberRole } from '../../types/account';
import { Database } from '../../types/common';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type OrganizationMemberRow = Database['public']['Tables']['organization_members']['Row'];
type OrganizationMemberInsert = Database['public']['Tables']['organization_members']['Insert'];
type OrganizationMemberUpdate = Database['public']['Tables']['organization_members']['Update'];

/**
 * OrganizationMember 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type OrganizationMember = OrganizationMemberRow;
export type { OrganizationMemberInsert, OrganizationMemberUpdate };

/**
 * OrganizationMember Repository
 *
 * 提供组织成员相关的数据访问方法
 *
 * @example
 * ```typescript
 * const orgMemberRepo = inject(OrganizationMemberRepository);
 * orgMemberRepo.findByOrganizationId('org-id').subscribe(members => {
 *   console.log('Organization members:', members);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class OrganizationMemberRepository extends BaseRepository<OrganizationMember, OrganizationMemberInsert, OrganizationMemberUpdate> {
  protected tableName = 'organization_members';

  /**
   * 根据组织 ID 查询组织成员列表
   *
   * @param organizationId 组织 ID
   * @param options 查询选项
   * @returns Observable<OrganizationMember[]>
   */
  findByOrganizationId(organizationId: string, options?: QueryOptions): Observable<OrganizationMember[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        organizationId // 会自动转换为 organization_id
      }
    });
  }

  /**
   * 根据账户 ID 查询组织成员关系
   *
   * @param accountId 账户 ID
   * @param options 查询选项
   * @returns Observable<OrganizationMember[]>
   */
  findByAccountId(accountId: string, options?: QueryOptions): Observable<OrganizationMember[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        accountId // 会自动转换为 account_id
      }
    });
  }

  /**
   * 根据角色查询组织成员
   *
   * @param role 成员角色
   * @param options 查询选项
   * @returns Observable<OrganizationMember[]>
   */
  findByRole(role: OrganizationMemberRole, options?: QueryOptions): Observable<OrganizationMember[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        role
      }
    });
  }

  /**
   * 查询组织中的拥有者（owner）
   *
   * @param organizationId 组织 ID
   * @returns Observable<OrganizationMember[]>
   */
  findOwnersByOrganizationId(organizationId: string): Observable<OrganizationMember[]> {
    return this.findAll({
      filters: {
        organizationId, // 会自动转换为 organization_id
        role: OrganizationMemberRole.OWNER
      }
    });
  }
}
