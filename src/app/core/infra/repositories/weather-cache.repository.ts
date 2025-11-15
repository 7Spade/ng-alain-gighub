import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';

/**
 * WeatherCache 实体类型（camelCase）
 */
type WeatherCacheRow = Database['public']['Tables']['weather_cache']['Row'];
type WeatherCacheInsert = Database['public']['Tables']['weather_cache']['Insert'];
type WeatherCacheUpdate = Database['public']['Tables']['weather_cache']['Update'];

export type WeatherCache = WeatherCacheRow;
export type { WeatherCacheInsert, WeatherCacheUpdate };

/**
 * WeatherCache Repository
 *
 * 提供天气缓存相关的数据访问方法
 */
@Injectable({
  providedIn: 'root'
})
export class WeatherCacheRepository extends BaseRepository<WeatherCache, WeatherCacheInsert, WeatherCacheUpdate> {
  protected tableName = 'weather_cache';

  /**
   * 根据位置查询天气缓存
   *
   * @param location 位置
   * @param options 查询选项
   * @returns Observable<WeatherCache[]>
   */
  findByLocation(location: string, options?: QueryOptions): Observable<WeatherCache[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        location
      },
      orderBy: 'forecast_date',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据位置和日期查询天气缓存
   *
   * @param location 位置
   * @param forecastDate 预报日期
   * @returns Observable<WeatherCache | null>
   */
  findByLocationAndDate(location: string, forecastDate: string): Observable<WeatherCache | null> {
    return this.findAll({
      filters: {
        location,
        forecastDate // 会自动转换为 forecast_date
      }
    }).pipe(map(caches => (caches.length > 0 ? caches[0] : null)));
  }

  /**
   * 查询有效的天气缓存（未过期）
   *
   * @param location 位置
   * @param options 查询选项
   * @returns Observable<WeatherCache[]>
   */
  findValid(location: string, options?: QueryOptions): Observable<WeatherCache[]> {
    // TODO: 实现过期检查
    // 需要使用数据库函数或 RPC 来比较 expires_at > NOW()
    return this.findByLocation(location, options);
  }
}

