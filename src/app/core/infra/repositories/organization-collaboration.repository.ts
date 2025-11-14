import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';
import { CollaborationType, CollaborationStatus } from '../types/collaboration.types';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type OrganizationCollaborationRow = Database['public']['Tables']['organization_collaborations']['Row'];
type OrganizationCollaborationInsert = Database['public']['Tables']['organization_collaborations']['Insert'];
type OrganizationCollaborationUpdate = Database['public']['Tables']['organization_collaborations']['Update'];

/**
 * OrganizationCollaboration 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type OrganizationCollaboration = OrganizationCollaborationRow;
export type { OrganizationCollaborationInsert, OrganizationCollaborationUpdate };

/**
 * OrganizationCollaboration Repository
 * 
 * 提供组织协作关系相关的数据访问方法
 * 
 * @example
 * ```typescript
 * const collabRepo = inject(OrganizationCollaborationRepository);
 * collabRepo.findByBlueprintId('blueprint-id').subscribe(collabs => {
 *   console.log('Collaborations:', collabs);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class OrganizationCollaborationRepository extends BaseRepository<
  OrganizationCollaboration,
  OrganizationCollaborationInsert,
  OrganizationCollaborationUpdate
> {
  protected tableName = 'organization_collaborations';

  /**
   * 根据蓝图 ID 查询协作关系列表
   * 
   * @param blueprintId 蓝图 ID
   * @param options 查询选项
   * @returns Observable<OrganizationCollaboration[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<OrganizationCollaboration[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId, // 会自动转换为 blueprint_id
      },
    });
  }

  /**
   * 根据拥有者组织 ID 查询协作关系列表
   * 
   * @param ownerOrgId 拥有者组织 ID
   * @param options 查询选项
   * @returns Observable<OrganizationCollaboration[]>
   */
  findByOwnerOrgId(ownerOrgId: string, options?: QueryOptions): Observable<OrganizationCollaboration[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        ownerOrgId, // 会自动转换为 owner_org_id
      },
    });
  }

  /**
   * 根据协作组织 ID 查询协作关系列表
   * 
   * @param collaboratorOrgId 协作组织 ID
   * @param options 查询选项
   * @returns Observable<OrganizationCollaboration[]>
   */
  findByCollaboratorOrgId(
    collaboratorOrgId: string,
    options?: QueryOptions
  ): Observable<OrganizationCollaboration[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        collaboratorOrgId, // 会自动转换为 collaborator_org_id
      },
    });
  }

  /**
   * 根据协作类型查询协作关系列表
   * 
   * @param collaborationType 协作类型
   * @param options 查询选项
   * @returns Observable<OrganizationCollaboration[]>
   */
  findByCollaborationType(
    collaborationType: CollaborationType,
    options?: QueryOptions
  ): Observable<OrganizationCollaboration[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        collaborationType, // 会自动转换为 collaboration_type
      },
    });
  }

  /**
   * 根据状态查询协作关系列表
   * 
   * @param status 协作状态
   * @param options 查询选项
   * @returns Observable<OrganizationCollaboration[]>
   */
  findByStatus(status: CollaborationStatus, options?: QueryOptions): Observable<OrganizationCollaboration[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status,
      },
    });
  }
}

