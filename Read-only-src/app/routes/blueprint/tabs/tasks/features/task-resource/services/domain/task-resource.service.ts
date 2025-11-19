/**
 * Task Resource Service
 *
 * 任務資源維度管理服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：E. 資源維度
 *
 * 職責：
 * - 管理人力資源（計畫團隊、實際配置、工時統計）
 * - 管理物料資源（採購、交付、安裝、品質檢驗）
 * - 管理機具設備（排程、檢驗、操作人員、使用記錄）
 * - 處理資源衝突與優化配置
 *
 * @see @ETMS_DESIGN_SPEC.md E. 資源維度
 */

import { Injectable, inject } from '@angular/core';
import type { HumanResources, MaterialResources, EquipmentResources, TaskResource, MaterialItem, TaskQuantityPayload } from '@models';
import { TaskFacetRepository, TaskFacetRecord } from '@tasks/shared/repository/task-facet.repository';

interface ResourceFacetPayload {
  resources: {
    human?: Record<string, unknown>;
    material?: Record<string, unknown>;
    equipment?: Record<string, unknown>;
  };
}

const PRIMARY_MATERIAL_ID = 'primary-quantity';
const PRIMARY_MATERIAL_NAME = 'Primary Quantity';
const RESOURCE_FACET_TYPE = 'resource';

@Injectable({
  providedIn: 'root'
})
export class TaskResourceService {
  private readonly facetRepository = inject(TaskFacetRepository);

  /**
   * 更新任務的人力資源
   *
   * @param taskId 任務 ID
   * @param humanResources 人力資源數據
   * @returns 更新後的人力資源
   */
  async updateHumanResources(taskId: string, humanResources: Partial<HumanResources>): Promise<HumanResources> {
    const facet = await this.getOrCreateResourceFacet(taskId);
    const existingPayload = facet?.payload?.resources?.human ?? {};

    const updatedData = {
      ...existingPayload,
      manpower: {
        ...(existingPayload as any).manpower,
        ...humanResources.manpower,
        plannedTeam:
          humanResources.manpower?.plannedTeam?.map(m => this.serializePlannedTeamMember(m)) ||
          (existingPayload as any)?.manpower?.plannedTeam ||
          [],
        assignedPersonnel:
          humanResources.manpower?.assignedPersonnel?.map(p => this.serializeAssignedPersonnel(p)) ||
          (existingPayload as any)?.manpower?.assignedPersonnel ||
          []
      }
    };

    const mergedPayload: ResourceFacetPayload = {
      resources: {
        human: updatedData,
        material: facet?.payload?.resources?.material,
        equipment: facet?.payload?.resources?.equipment
      }
    };

    await this.facetRepository.upsertFacet<ResourceFacetPayload>({
      taskId,
      facetType: RESOURCE_FACET_TYPE,
      payload: mergedPayload
    });

    return this.convertHumanResourcesFromDb(updatedData);
  }

  /**
   * 更新任務的材料資源
   *
   * @param taskId 任務 ID
   * @param materialResources 材料資源數據
   * @returns 更新後的材料資源
   */
  async updateMaterialResources(taskId: string, materialResources: Partial<MaterialResources>): Promise<MaterialResources> {
    const facet = await this.getOrCreateResourceFacet(taskId);
    const existingPayload = facet?.payload?.resources?.material ?? {};

    const updatedData = {
      ...existingPayload,
      ...materialResources,
      materials: materialResources.materials?.map(m => this.serializeMaterialItem(m)) || (existingPayload as any)?.materials || []
    };

    const mergedPayload: ResourceFacetPayload = {
      resources: {
        human: facet?.payload?.resources?.human,
        material: updatedData,
        equipment: facet?.payload?.resources?.equipment
      }
    };

    await this.facetRepository.upsertFacet<ResourceFacetPayload>({
      taskId,
      facetType: RESOURCE_FACET_TYPE,
      payload: mergedPayload
    });

    return this.convertMaterialResourcesFromDb(updatedData);
  }

  /**
   * 設定任務的主要數量資料（專用於進度計算）
   *
   * @param taskId 任務 ID
   * @param payload 數量設定
   * @returns 更新後的材料項目
   */
  async setQuantity(taskId: string, payload: TaskQuantityPayload): Promise<MaterialItem> {
    const facet = await this.getOrCreateResourceFacet(taskId);
    const existingMaterials: MaterialItem[] = (() => {
      const materialPayload = facet?.payload?.resources?.material;
      if (!materialPayload) {
        return [];
      }

      const converted = this.convertMaterialResourcesFromDb(materialPayload);
      return converted.materials || [];
    })();

    const fallback = existingMaterials[0];
    const normalized = this.normalizeQuantityMaterial(payload, fallback);
    const result = await this.updateMaterialResources(taskId, {
      materials: [normalized]
    });

    return result.materials[0]!;
  }

  /**
   * 更新任務的機具資源
   *
   * @param taskId 任務 ID
   * @param equipmentResources 機具資源數據
   * @returns 更新後的機具資源
   */
  async updateEquipmentResources(taskId: string, equipmentResources: Partial<EquipmentResources>): Promise<EquipmentResources> {
    const facet = await this.getOrCreateResourceFacet(taskId);
    const existingPayload = facet?.payload?.resources?.equipment ?? {};

    const updatedData = {
      ...existingPayload,
      ...equipmentResources,
      equipment: equipmentResources.equipment?.map(e => this.serializeEquipmentItem(e)) || (existingPayload as any)?.equipment || []
    };

    const mergedPayload: ResourceFacetPayload = {
      resources: {
        human: facet?.payload?.resources?.human,
        material: facet?.payload?.resources?.material,
        equipment: updatedData
      }
    };

    await this.facetRepository.upsertFacet<ResourceFacetPayload>({
      taskId,
      facetType: RESOURCE_FACET_TYPE,
      payload: mergedPayload
    });

    return this.convertEquipmentResourcesFromDb(updatedData);
  }

  /**
   * 獲取任務的完整資源資訊
   *
   * @param taskId 任務 ID
   * @returns 完整的資源資訊
   */
  async getTaskResource(taskId: string): Promise<TaskResource | null> {
    const facet = await this.facetRepository.getFacet<ResourceFacetPayload>(taskId, RESOURCE_FACET_TYPE);

    if (!facet || !facet.payload?.resources) {
      return null;
    }

    const human = facet.payload.resources.human ? this.convertHumanResourcesFromDb(facet.payload.resources.human) : undefined;
    const material = facet.payload.resources.material ? this.convertMaterialResourcesFromDb(facet.payload.resources.material) : undefined;
    const equipment = facet.payload.resources.equipment
      ? this.convertEquipmentResourcesFromDb(facet.payload.resources.equipment)
      : undefined;

    return {
      manpower: human,
      materials: material,
      equipment
    };
  }

  /**
   * 取得或建立 Facet 基礎結構
   */
  private async getOrCreateResourceFacet(taskId: string): Promise<TaskFacetRecord<ResourceFacetPayload>> {
    const facet = await this.facetRepository.getFacet<ResourceFacetPayload>(taskId, RESOURCE_FACET_TYPE);

    if (facet) {
      return facet;
    }

    const initialPayload: ResourceFacetPayload = {
      resources: {}
    };

    return this.facetRepository.upsertFacet<ResourceFacetPayload>({
      taskId,
      facetType: RESOURCE_FACET_TYPE,
      payload: initialPayload
    });
  }

  /**
   * 序列化計畫團隊成員
   */
  private serializePlannedTeamMember(member: any): any {
    return {
      ...member,
      startDate: member.startDate?.toISOString(),
      endDate: member.endDate?.toISOString()
    };
  }

  /**
   * 序列化實際分配人員
   */
  private serializeAssignedPersonnel(personnel: any): any {
    return {
      ...personnel,
      startDate: personnel.startDate?.toISOString(),
      endDate: personnel.endDate?.toISOString(),
      absences: (personnel.absences || []).map((a: any) => ({
        ...a,
        from: a.from?.toISOString(),
        to: a.to?.toISOString()
      }))
    };
  }

  /**
   * 序列化材料項目
   */
  private serializeMaterialItem(item: any): any {
    const plannedQuantity = Number.isFinite(item.plannedQuantity) ? Number(item.plannedQuantity) : 0;
    const installedQuantity = Number.isFinite(item.installedQuantity) ? Number(item.installedQuantity) : 0;
    const usedQuantity = Number.isFinite(item.usedQuantity) ? Number(item.usedQuantity) : installedQuantity;
    const remainingQuantity =
      Number.isFinite(item.remainingQuantity) && item.remainingQuantity !== null
        ? Number(item.remainingQuantity)
        : Math.max(0, plannedQuantity - installedQuantity);

    return {
      ...item,
      orderedDate: item.orderedDate instanceof Date ? item.orderedDate.toISOString() : (item.orderedDate ?? null),
      deliveredDate: item.deliveredDate instanceof Date ? item.deliveredDate.toISOString() : (item.deliveredDate ?? null),
      installedDate: item.installedDate instanceof Date ? item.installedDate.toISOString() : (item.installedDate ?? null),
      expectedDelivery: item.expectedDelivery instanceof Date ? item.expectedDelivery.toISOString() : (item.expectedDelivery ?? null),
      actualDelivery: item.actualDelivery instanceof Date ? item.actualDelivery.toISOString() : (item.actualDelivery ?? null),
      plannedQuantity,
      orderedQuantity: Number.isFinite(item.orderedQuantity) ? Number(item.orderedQuantity) : 0,
      deliveredQuantity: Number.isFinite(item.deliveredQuantity) ? Number(item.deliveredQuantity) : 0,
      installedQuantity,
      usedQuantity,
      wastedQuantity: Number.isFinite(item.wastedQuantity) ? Number(item.wastedQuantity) : 0,
      remainingQuantity,
      unitPrice: Number.isFinite(item.unitPrice) ? Number(item.unitPrice) : (item.unitPrice ?? 0),
      totalCost: Number.isFinite(item.totalCost) ? Number(item.totalCost) : (item.totalCost ?? 0),
      actualCost: Number.isFinite(item.actualCost) ? Number(item.actualCost) : (item.actualCost ?? 0),
      leadTime: Number.isFinite(item.leadTime) ? Number(item.leadTime) : 0
    };
  }

  /**
   * 序列化機具項目
   */
  private serializeEquipmentItem(item: any): any {
    return {
      ...item,
      scheduledStartDate: item.scheduledStartDate?.toISOString(),
      scheduledEndDate: item.scheduledEndDate?.toISOString(),
      actualStartDate: item.actualStartDate?.toISOString(),
      actualEndDate: item.actualEndDate?.toISOString(),
      lastInspectionDate: item.lastInspectionDate?.toISOString(),
      usageLog: (item.usageLog || []).map((log: any) => ({
        ...log,
        date: log.date?.toISOString()
      }))
    };
  }

  /**
   * 從數據庫格式轉換為 HumanResources
   */
  private convertHumanResourcesFromDb(data: any): HumanResources {
    const manpower = data.manpower || {};
    const totalManHours = manpower.totalManHours || 0;
    const completedManHours = manpower.completedManHours || 0;
    const remainingManHours = totalManHours - completedManHours;
    const efficiency = totalManHours > 0 ? completedManHours / totalManHours : 0;

    return {
      manpower: {
        plannedTeam: (manpower.plannedTeam || []).map((m: any) => ({
          ...m,
          startDate: m.startDate ? new Date(m.startDate) : undefined,
          endDate: m.endDate ? new Date(m.endDate) : undefined
        })),
        assignedPersonnel: (manpower.assignedPersonnel || []).map((p: any) => ({
          ...p,
          startDate: p.startDate ? new Date(p.startDate) : undefined,
          endDate: p.endDate ? new Date(p.endDate) : undefined,
          absences: (p.absences || []).map((a: any) => ({
            ...a,
            from: a.from ? new Date(a.from) : undefined,
            to: a.to ? new Date(a.to) : undefined
          }))
        })),
        totalManHours,
        completedManHours,
        remainingManHours,
        efficiency,
        peakManpower: manpower.peakManpower,
        peakManpowerDate: manpower.peakManpowerDate ? new Date(manpower.peakManpowerDate) : undefined,
        averageManpower: manpower.averageManpower
      }
    };
  }

  /**
   * 從數據庫格式轉換為 MaterialResources
   */
  private convertMaterialResourcesFromDb(data: any): MaterialResources {
    return {
      materials: (data.materials || []).map((m: any) => ({
        ...m,
        orderedDate: m.orderedDate ? new Date(m.orderedDate) : undefined,
        deliveredDate: m.deliveredDate ? new Date(m.deliveredDate) : undefined,
        installedDate: m.installedDate ? new Date(m.installedDate) : undefined,
        expectedDelivery: m.expectedDelivery ? new Date(m.expectedDelivery) : undefined,
        actualDelivery: m.actualDelivery ? new Date(m.actualDelivery) : undefined
      })),
      totalMaterialCost: data.totalMaterialCost,
      materialWasteRate: data.materialWasteRate,
      materialShortages: (data.materialShortages || []).map((shortage: any) => ({
        ...shortage,
        reportedAt: shortage.reportedAt ? new Date(shortage.reportedAt) : undefined,
        resolvedAt: shortage.resolvedAt ? new Date(shortage.resolvedAt) : undefined
      }))
    };
  }

  /**
   * 從數據庫格式轉換為 EquipmentResources
   */
  private convertEquipmentResourcesFromDb(data: any): EquipmentResources {
    return {
      equipment: (data.equipment || []).map((e: any) => ({
        ...e,
        scheduledStartDate: e.scheduledStartDate ? new Date(e.scheduledStartDate) : undefined,
        scheduledEndDate: e.scheduledEndDate ? new Date(e.scheduledEndDate) : undefined,
        actualStartDate: e.actualStartDate ? new Date(e.actualStartDate) : undefined,
        actualEndDate: e.actualEndDate ? new Date(e.actualEndDate) : undefined,
        lastInspectionDate: e.lastInspectionDate ? new Date(e.lastInspectionDate) : undefined,
        usageLog: (e.usageLog || []).map((log: any) => ({
          ...log,
          date: log.date ? new Date(log.date) : undefined
        }))
      }))
    };
  }

  /**
   * 正規化材料數量資料
   */
  private normalizeQuantityMaterial(payload: TaskQuantityPayload, fallback?: MaterialItem): MaterialItem {
    const plannedQuantity = Number.isFinite(payload.plannedQuantity) ? Number(payload.plannedQuantity) : (fallback?.plannedQuantity ?? 0);
    const installedQuantity = Number.isFinite(payload.installedQuantity)
      ? Number(payload.installedQuantity)
      : (fallback?.installedQuantity ?? 0);
    const usedQuantity = Number.isFinite(payload.usedQuantity) ? Number(payload.usedQuantity) : installedQuantity;
    const remainingQuantity = Math.max(0, plannedQuantity - installedQuantity);

    return {
      id: payload.materialId ?? fallback?.id ?? PRIMARY_MATERIAL_ID,
      name: payload.name ?? fallback?.name ?? PRIMARY_MATERIAL_NAME,
      unit: payload.unit ?? fallback?.unit ?? 'unit',
      plannedQuantity,
      installedQuantity,
      usedQuantity,
      remainingQuantity,
      orderedQuantity: fallback?.orderedQuantity ?? 0,
      deliveredQuantity: fallback?.deliveredQuantity ?? 0,
      wastedQuantity: fallback?.wastedQuantity ?? 0,
      unitPrice: fallback?.unitPrice ?? 0,
      totalCost: fallback?.totalCost ?? 0,
      actualCost: fallback?.actualCost ?? 0
    };
  }
}
