import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Database } from '../../types/common';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type BlueprintConfigRow = Database['public']['Tables']['blueprint_configs']['Row'];
type BlueprintConfigInsert = Database['public']['Tables']['blueprint_configs']['Insert'];
type BlueprintConfigUpdate = Database['public']['Tables']['blueprint_configs']['Update'];

/**
 * BlueprintConfig 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type BlueprintConfig = BlueprintConfigRow;
export type { BlueprintConfigInsert, BlueprintConfigUpdate };

/**
 * BlueprintConfig Repository
 *
 * 提供蓝图配置相关的数据访问方法
 *
 * @example
 * ```typescript
 * const configRepo = inject(BlueprintConfigRepository);
 * configRepo.findByBlueprintId('blueprint-id').subscribe(configs => {
 *   console.log('Configs:', configs);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintConfigRepository extends BaseRepository<BlueprintConfig, BlueprintConfigInsert, BlueprintConfigUpdate> {
  protected tableName = 'blueprint_configs';

  /**
   * 根据蓝图 ID 查询配置列表
   *
   * @param blueprintId 蓝图 ID
   * @param options 查询选项
   * @returns Observable<BlueprintConfig[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<BlueprintConfig[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId // 会自动转换为 blueprint_id
      }
    });
  }

  /**
   * 根据配置键查询配置
   *
   * @param blueprintId 蓝图 ID
   * @param configKey 配置键
   * @returns Observable<BlueprintConfig | null>
   */
  findByConfigKey(blueprintId: string, configKey: string): Observable<BlueprintConfig | null> {
    return this.findAll({
      filters: {
        blueprintId, // 会自动转换为 blueprint_id
        configKey // 会自动转换为 config_key
      }
    }).pipe(map(configs => (configs.length > 0 ? configs[0] : null)));
  }

  /**
   * 更新或创建配置（upsert）
   *
   * @param blueprintId 蓝图 ID
   * @param configKey 配置键
   * @param configValue 配置值
   * @param updatedBy 更新者 ID
   * @returns Observable<BlueprintConfig>
   */
  upsertConfig(blueprintId: string, configKey: string, configValue: any, updatedBy?: string): Observable<BlueprintConfig> {
    // 先查询是否存在
    return this.findByConfigKey(blueprintId, configKey).pipe(
      map(existing => {
        const data = {
          blueprintId,
          configKey,
          configValue,
          updatedBy
        } as any as BlueprintConfigInsert;

        if (existing) {
          // 如果存在，则更新
          return this.update(existing.id, data as any);
        } else {
          // 如果不存在，则创建
          return this.create(data);
        }
      }),
      // 展开 Observable<Observable<BlueprintConfig>> 为 Observable<BlueprintConfig>
      switchMap(obs => obs)
    );
  }
}
