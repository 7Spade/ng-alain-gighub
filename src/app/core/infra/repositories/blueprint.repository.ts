import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';
import { BlueprintStatus } from '../types/blueprint.types';

/**
 * Blueprint 实体类型（camelCase）
 * 从数据库类型中提取，后续会通过转换工具转换为 camelCase
 */
type BlueprintRow = Database['public']['Tables']['blueprints']['Row'];
type BlueprintInsert = Database['public']['Tables']['blueprints']['Insert'];
type BlueprintUpdate = Database['public']['Tables']['blueprints']['Update'];

/**
 * Blueprint 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Blueprint = BlueprintRow;
export type { BlueprintInsert, BlueprintUpdate };

/**
 * Blueprint Repository
 * 
 * 提供蓝图相关的数据访问方法
 * 
 * @example
 * ```typescript
 * const blueprintRepo = inject(BlueprintRepository);
 * blueprintRepo.findByOwnerId('user-id').subscribe(blueprints => {
 *   console.log('User blueprints:', blueprints);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintRepository extends BaseRepository<Blueprint, BlueprintInsert, BlueprintUpdate> {
  protected tableName = 'blueprints';

  /**
   * 根据拥有者 ID 查询蓝图
   * 
   * @param ownerId 拥有者 ID
   * @param options 查询选项
   * @returns Observable<Blueprint[]>
   */
  findByOwnerId(ownerId: string, options?: QueryOptions): Observable<Blueprint[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        ownerId, // 会自动转换为 owner_id
      },
    });
  }

  /**
   * 根据状态查询蓝图
   * 
   * @param status 蓝图状态
   * @param options 查询选项
   * @returns Observable<Blueprint[]>
   */
  findByStatus(status: BlueprintStatus, options?: QueryOptions): Observable<Blueprint[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status,
      },
    });
  }

  /**
   * 根据项目代码查询蓝图
   * 
   * @param projectCode 项目代码
   * @returns Observable<Blueprint | null>
   */
  findByProjectCode(projectCode: string): Observable<Blueprint | null> {
    return this.findAll({
      filters: {
        projectCode, // 会自动转换为 project_code
      },
    }).pipe(
      map(blueprints => blueprints.length > 0 ? blueprints[0] : null)
    );
  }

  /**
   * 查询活跃的蓝图（状态为 active）
   * 
   * @param options 查询选项
   * @returns Observable<Blueprint[]>
   */
  findActive(options?: QueryOptions): Observable<Blueprint[]> {
    return this.findByStatus(BlueprintStatus.ACTIVE, options);
  }
}

