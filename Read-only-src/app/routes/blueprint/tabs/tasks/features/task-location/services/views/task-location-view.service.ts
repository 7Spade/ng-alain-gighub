/**
 * Task Location View Service
 *
 * 任務空間視角服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：D. 空間維度
 *
 * 職責：
 * - 提供空間位置視角的數據組織
 * - 處理階層式位置（工地>建築>樓層>區域）的導航
 * - 管理空間衝突檢測與視覺化
 * - 提供 BIM 元素關聯與 3D 視圖數據
 *
 * @see @ETMS_DESIGN_SPEC.md D. 空間維度
 */

import { Injectable, inject } from '@angular/core';
import type { Task } from '@models';
import { TaskRepository } from '@tasks/features/task-detail/services/repository/task.repository';
import { TaskLocationService } from '@tasks/features/task-location/services/domain/task-location.service';

/**
 * 空間視角數據
 */
export interface LocationViewData {
  /** 任務列表 */
  tasks: Task[];

  /** 篩選條件 */
  filters: {
    /** 工地 */
    site?: string;
    /** 建築物 */
    building?: string;
    /** 樓層 */
    floor?: string;
    /** 區域 */
    zone?: string;
    /** 房間 */
    room?: string;
    /** 是否有衝突 */
    hasConflict?: boolean;
  };

  /** 統計資訊 */
  statistics: {
    /** 總任務數 */
    totalTasks: number;
    /** 按工地分組 */
    bySite: Record<string, number>;
    /** 按建築分組 */
    byBuilding: Record<string, number>;
    /** 按樓層分組 */
    byFloor: Record<string, number>;
    /** 衝突任務數 */
    conflictTasks: number;
  };
}

/**
 * 空間視覺化數據
 */
export interface LocationVisualizationData {
  /** 位置節點 */
  nodes: Array<{
    id: string;
    code: string;
    name: string;
    location: {
      site: string;
      building: string;
      floor: string;
      zone: string;
      room: string;
      fullPath: string;
    };
    coordinates?: {
      x: number;
      y: number;
      z?: number;
    };
    hasConflict: boolean;
    x: number;
    y: number;
  }>;

  /** 空間關聯邊 */
  edges: Array<{
    from: string;
    to: string;
    type: 'adjacent' | 'overlapping' | 'access-path';
    distance?: number;
    overlapPercentage?: number;
  }>;

  /** 佈局資訊 */
  layout: {
    width: number;
    height: number;
    coordinateSystem: 'cartesian' | 'hierarchical';
  };
}

@Injectable({
  providedIn: 'root'
})
export class TaskLocationViewService {
  private readonly taskRepository = inject(TaskRepository);
  private readonly locationService = inject(TaskLocationService);

  /**
   * 獲取空間視角數據
   *
   * @param blueprintId 藍圖 ID
   * @param filters 篩選條件
   * @returns 空間視角數據
   */
  async getViewData(
    blueprintId: string,
    filters?: {
      taskIds?: string[];
      site?: string;
      building?: string;
      floor?: string;
      zone?: string;
      room?: string;
      hasConflict?: boolean;
    }
  ): Promise<LocationViewData> {
    const repositoryFilters = filters?.taskIds?.length ? { taskIds: filters.taskIds } : undefined;

    // 獲取任務列表
    const tasks = await this.taskRepository.getTasksByBlueprint(blueprintId, repositoryFilters);

    // 並行獲取所有任務的位置資訊
    const tasksWithLocations = await Promise.all(
      tasks.map(async task => {
        const location = await this.locationService.getTaskLocation(task.id);
        return { ...task, location };
      })
    );

    // 過濾任務
    let filteredTasks = tasksWithLocations;

    if (filters?.site) {
      filteredTasks = filteredTasks.filter(task => {
        const site = task.location?.physical?.location?.site;
        return site === filters.site;
      });
    }

    if (filters?.building) {
      filteredTasks = filteredTasks.filter(task => {
        const building = task.location?.physical?.location?.building;
        return building === filters.building;
      });
    }

    if (filters?.floor) {
      filteredTasks = filteredTasks.filter(task => {
        const floor = task.location?.physical?.location?.floor;
        return floor === filters.floor;
      });
    }

    if (filters?.zone) {
      filteredTasks = filteredTasks.filter(task => {
        const zone = task.location?.physical?.location?.zone;
        return zone === filters.zone;
      });
    }

    if (filters?.room) {
      filteredTasks = filteredTasks.filter(task => {
        const room = task.location?.physical?.location?.room;
        return room === filters.room;
      });
    }

    if (filters?.hasConflict !== undefined) {
      filteredTasks = filteredTasks.filter(task => {
        const hasConflict = (task.location?.relationships?.spatialRelations?.spatialConflicts?.length || 0) > 0;
        return hasConflict === filters.hasConflict;
      });
    }

    // 計算統計資訊
    const bySite: Record<string, number> = {};
    const byBuilding: Record<string, number> = {};
    const byFloor: Record<string, number> = {};

    filteredTasks.forEach(task => {
      const loc = task.location?.physical?.location;
      if (loc) {
        if (loc.site) {
          bySite[loc.site] = (bySite[loc.site] || 0) + 1;
        }
        if (loc.building) {
          byBuilding[loc.building] = (byBuilding[loc.building] || 0) + 1;
        }
        if (loc.floor) {
          byFloor[loc.floor] = (byFloor[loc.floor] || 0) + 1;
        }
      }
    });

    const conflictTasks = filteredTasks.filter(task => {
      return (task.location?.relationships?.spatialRelations?.spatialConflicts?.length || 0) > 0;
    }).length;

    const statistics = {
      totalTasks: filteredTasks.length,
      bySite,
      byBuilding,
      byFloor,
      conflictTasks
    };

    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tasks: filteredTasks.map(({ location: _location, ...task }) => task),
      filters: filters || {},
      statistics
    };
  }

  /**
   * 生成空間視覺化數據
   *
   * @param blueprintId 藍圖 ID
   * @param options 選項
   * @returns 視覺化數據
   */
  async getVisualizationData(
    blueprintId: string,
    options?: {
      coordinateSystem?: 'cartesian' | 'hierarchical';
      showConflicts?: boolean;
    }
  ): Promise<LocationVisualizationData> {
    // 獲取任務列表
    const tasks = await this.taskRepository.getTasksByBlueprint(blueprintId);

    // 並行獲取所有任務的位置資訊
    const tasksWithLocations = await Promise.all(
      tasks.map(async task => {
        const location = await this.locationService.getTaskLocation(task.id);
        return { ...task, location };
      })
    );

    // 構建節點
    const nodes: LocationVisualizationData['nodes'] = [];
    const coordinateSystem = options?.coordinateSystem || 'hierarchical';

    if (coordinateSystem === 'cartesian') {
      // 使用笛卡爾座標系統
      tasksWithLocations.forEach((task, index) => {
        const loc = task.location?.physical?.location;
        const coords = task.location?.physical?.location?.coordinates;

        if (loc) {
          const hasConflict = (task.location?.relationships?.spatialRelations?.spatialConflicts?.length || 0) > 0;

          // 使用座標系統（如果有）
          const x = coords?.x || coords?.relativeX || (index % 10) * 100;
          const y = coords?.y || coords?.relativeY || Math.floor(index / 10) * 100;
          const z = coords?.z || coords?.relativeZ;

          nodes.push({
            id: task.id,
            code: task.code,
            name: task.name,
            location: {
              site: loc.site || '',
              building: loc.building || '',
              floor: loc.floor || '',
              zone: loc.zone || '',
              room: loc.room || '',
              fullPath: loc.fullPath || ''
            },
            coordinates: { x, y, z },
            hasConflict,
            x,
            y
          });
        }
      });
    } else {
      // 使用階層式佈局
      let currentY = 50;
      const rowSpacing = 80;
      const columnSpacing = 200;

      // 按工地分組
      const siteGroups = new Map<string, typeof tasksWithLocations>();

      tasksWithLocations.forEach(task => {
        const site = task.location?.physical?.location?.site || 'unknown';
        if (!siteGroups.has(site)) {
          siteGroups.set(site, []);
        }
        siteGroups.get(site)!.push(task);
      });

      let currentX = 100;

      siteGroups.forEach(siteTasks => {
        // 按建築分組
        const buildingGroups = new Map<string, typeof siteTasks>();

        siteTasks.forEach(task => {
          const building = task.location?.physical?.location?.building || 'unknown';
          if (!buildingGroups.has(building)) {
            buildingGroups.set(building, []);
          }
          buildingGroups.get(building)!.push(task);
        });

        buildingGroups.forEach(buildingTasks => {
          // 按樓層分組
          const floorGroups = new Map<string, typeof buildingTasks>();

          buildingTasks.forEach(task => {
            const floor = task.location?.physical?.location?.floor || 'unknown';
            if (!floorGroups.has(floor)) {
              floorGroups.set(floor, []);
            }
            floorGroups.get(floor)!.push(task);
          });

          floorGroups.forEach(floorTasks => {
            let localY = currentY;

            floorTasks.forEach(task => {
              const loc = task.location?.physical?.location;
              const coords = task.location?.physical?.location?.coordinates;

              if (loc) {
                const hasConflict = (task.location?.relationships?.spatialRelations?.spatialConflicts?.length || 0) > 0;

                nodes.push({
                  id: task.id,
                  code: task.code,
                  name: task.name,
                  location: {
                    site: loc.site || '',
                    building: loc.building || '',
                    floor: loc.floor || '',
                    zone: loc.zone || '',
                    room: loc.room || '',
                    fullPath: loc.fullPath || ''
                  },
                  coordinates: coords
                    ? {
                        x: coords.x || coords.relativeX || 0,
                        y: coords.y || coords.relativeY || 0,
                        z: coords.z || coords.relativeZ
                      }
                    : undefined,
                  hasConflict,
                  x: currentX,
                  y: localY
                });

                localY += rowSpacing;
              }
            });

            currentY = Math.max(currentY, localY);
          });

          currentX += columnSpacing;
          currentY = 50;
        });

        currentX += columnSpacing;
      });
    }

    // 構建邊（空間關聯）
    const edges: LocationVisualizationData['edges'] = [];

    tasksWithLocations.forEach(task => {
      const relationships = task.location?.relationships?.spatialRelations;

      if (relationships) {
        // 鄰近任務
        relationships.adjacentTasks?.forEach(adj => {
          edges.push({
            from: task.id,
            to: adj.taskId,
            type: 'adjacent',
            distance: adj.distance
          });
        });

        // 重疊任務
        relationships.overlappingTasks?.forEach(overlap => {
          edges.push({
            from: task.id,
            to: overlap.taskId,
            type: 'overlapping',
            overlapPercentage: overlap.overlapPercentage
          });
        });

        // 進出路徑
        relationships.accessPath?.forEach((taskId, index) => {
          if (index < relationships.accessPath!.length - 1) {
            edges.push({
              from: taskId,
              to: relationships.accessPath![index + 1],
              type: 'access-path'
            });
          }
        });
      }
    });

    // 計算佈局
    const maxX = Math.max(...nodes.map(n => n.x), 100) + 200;
    const maxY = Math.max(...nodes.map(n => n.y), 100) + 100;

    return {
      nodes,
      edges,
      layout: {
        width: maxX,
        height: maxY,
        coordinateSystem
      }
    };
  }
}
