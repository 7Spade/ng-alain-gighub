/**
 * Task Location Service
 *
 * 任務空間維度管理服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：D. 空間維度
 *
 * 職責：
 * - 管理任務的物理位置（工地、建築物、樓層、區域、房間、設備）
 * - 處理空間關聯（鄰近任務、空間重疊、進出路徑）
 * - 管理 BIM 關聯資訊與座標系統
 * - 處理空間衝突檢測與優化配置
 *
 * @see @ETMS_DESIGN_SPEC.md D. 空間維度
 */

import { Injectable, inject } from '@angular/core';
import type { TaskLocation, PhysicalLocation, SpatialRelationships } from '@models';
import { ensureFullPath, mergePhysicalLocation, mergeSpatialRelationships } from '@tasks/shared/domain/location.domain';
import type { TaskLocationData } from '@tasks/shared/repository/task-location.repository';
import { TaskLocationRepository } from '@tasks/shared/repository/task-location.repository';

@Injectable({
  providedIn: 'root'
})
export class TaskLocationService {
  private readonly repository = inject(TaskLocationRepository);

  /**
   * 更新任務的物理位置
   *
   * @param taskId 任務 ID
   * @param location 物理位置數據
   * @returns 更新後的物理位置
   */
  async updatePhysicalLocation(taskId: string, location: Partial<PhysicalLocation>): Promise<PhysicalLocation> {
    const locationData = ((await this.repository.getLocationData(taskId)) ?? {}) as TaskLocationData;
    const mergedLocation = mergePhysicalLocation(locationData.physical, location);
    const normalizedLocation = ensureFullPath(mergedLocation);

    await this.repository.saveLocationData(taskId, {
      ...locationData,
      physical: normalizedLocation
    });

    return normalizedLocation;
  }

  /**
   * 更新任務的空間關聯
   *
   * @param taskId 任務 ID
   * @param spatialRelations 空間關聯數據
   * @returns 更新後的空間關聯
   */
  async updateSpatialRelationships(taskId: string, spatialRelations: Partial<SpatialRelationships>): Promise<SpatialRelationships> {
    const locationData = ((await this.repository.getLocationData(taskId)) ?? {}) as TaskLocationData;
    const mergedRelationships = mergeSpatialRelationships(locationData.relationships, spatialRelations);

    await this.repository.saveLocationData(taskId, {
      ...locationData,
      relationships: mergedRelationships
    });

    return mergedRelationships;
  }

  /**
   * 取得任務的完整空間資訊
   *
   * @param taskId 任務 ID
   * @returns 完整的空間資訊
   */
  async getTaskLocation(taskId: string): Promise<TaskLocation | null> {
    const locationData = await this.repository.getLocationData(taskId);

    if (!locationData) {
      return null;
    }

    return {
      physical: locationData.physical,
      relationships: locationData.relationships
    };
  }
}
