import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from '../base.repository';
import { Database } from '../../types/common';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type SettingRow = Database['public']['Tables']['settings']['Row'];
type SettingInsert = Database['public']['Tables']['settings']['Insert'];
type SettingUpdate = Database['public']['Tables']['settings']['Update'];

/**
 * Setting 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Setting = SettingRow;
export type { SettingInsert, SettingUpdate };

/**
 * Setting Repository
 *
 * 提供系统设置相关的数据访问方法
 *
 * @example
 * ```typescript
 * const settingRepo = inject(SettingRepository);
 * settingRepo.findByKey('theme').subscribe(setting => {
 *   console.log('Setting:', setting);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SettingRepository extends BaseRepository<Setting, SettingInsert, SettingUpdate> {
  protected tableName = 'settings';

  /**
   * 根据键查询设置
   *
   * @param settingKey 设置键
   * @returns Observable<Setting | null>
   */
  findByKey(settingKey: string): Observable<Setting | null> {
    return this.findAll({
      filters: {
        settingKey // 会自动转换为 setting_key
      }
    }).pipe(map(settings => (settings.length > 0 ? settings[0] : null)));
  }

  /**
   * 根据类型查询设置
   *
   * @param settingType 设置类型
   * @param options 查询选项
   * @returns Observable<Setting[]>
   */
  findByType(settingType: string, options?: QueryOptions): Observable<Setting[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        settingType // 会自动转换为 setting_type
      }
    });
  }

  /**
   * 根据作用域 ID 查询设置
   *
   * @param scopeId 作用域 ID
   * @param options 查询选项
   * @returns Observable<Setting[]>
   */
  findByScopeId(scopeId: string, options?: QueryOptions): Observable<Setting[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        scopeId // 会自动转换为 scope_id
      }
    });
  }

  /**
   * 查询公开设置
   *
   * @param options 查询选项
   * @returns Observable<Setting[]>
   */
  findPublicSettings(options?: QueryOptions): Observable<Setting[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        isPublic: true // 会自动转换为 is_public
      }
    });
  }

  /**
   * 根据类型和作用域查询设置
   *
   * @param settingType 设置类型
   * @param scopeId 作用域 ID
   * @returns Observable<Setting[]>
   */
  findByTypeAndScope(settingType: string, scopeId: string): Observable<Setting[]> {
    return this.findAll({
      filters: {
        settingType,
        scopeId
      }
    });
  }
}
