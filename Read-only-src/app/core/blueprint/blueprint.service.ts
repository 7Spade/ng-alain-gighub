import { Injectable, inject } from '@angular/core';
import type {
  Blueprint,
  BlueprintWithOwner,
  BlueprintMember,
  BlueprintMemberWithUser,
  BlueprintProgress,
  BlueprintMilestone,
  BlueprintDocument,
  BlueprintDocumentVersion,
  BlueprintDailyReport,
  CreateBlueprintInput,
  UpdateBlueprintInput,
  CreateProgressInput,
  CreateMilestoneInput,
  UpdateMilestoneInput,
  CreateDocumentInput,
  UploadDocumentVersionInput,
  CreateDailyReportInput,
  UpdateDailyReportInput,
  BlueprintMemberRole,
  BlueprintAggregationFilters,
  BlueprintAggregationResult
} from '@shared';

import { ErrorStateService } from '../net/error';
import { SupabaseService } from '../supabase/supabase.service';
import { BlueprintActivityService } from './activity/blueprint-activity.service';
import { BlueprintAggregationService } from './aggregation/blueprint-aggregation.service';

/**
 * Blueprint Service
 *
 * 提供藍圖（工地專案進度追蹤管理）相關的 CRUD 操作
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintService {
  private readonly supabase = inject(SupabaseService);
  private readonly errorService = inject(ErrorStateService);
  private readonly aggregationService = inject(BlueprintAggregationService);
  private readonly activityService = inject(BlueprintActivityService);

  // TODO(ETMS_SPEC §0.9): 將藍圖列表/詳情/分析讀取流程抽離至 BlueprintRepository，統一處理聚合、快取與 KPI 回寫。

  /**
   * TODO(etms): 抽離藍圖聚合與 KPI 計算邏輯至 BlueprintRepository
   * - 依據 @ETMS_DESIGN_SPEC.md 0.4、0.8 需提供列表摘要、詳情聚合與分析匯出視圖
   * - 目前 BlueprintService 分散查詢多張表，缺少共用快取與批次重算入口
   */

  // ============================================
  // 藍圖 CRUD 操作
  // ============================================

  /**
   * 獲取組織的所有藍圖
   */
  async getOrganizationBlueprints(organizationId: string): Promise<{ data: Blueprint[]; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprints')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error };
      }

      return { data: (data || []) as Blueprint[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * 獲取用戶擁有的所有藍圖（個人藍圖）
   * 類似 GitHub，用戶可以擁有自己的藍圖（通過 owner_id）
   * 注意：只返回個人藍圖（organization_id IS NULL），不包括組織藍圖
   */
  async getUserBlueprints(userId: string): Promise<{ data: Blueprint[]; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprints')
        .select('*')
        .eq('owner_id', userId)
        .is('organization_id', null) // 只返回個人藍圖，排除組織藍圖
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error };
      }

      return { data: (data || []) as Blueprint[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * 獲取用戶的個人藍圖（僅個人藍圖，不包括組織藍圖）
   * 包括用戶擁有的個人藍圖和作為成員的個人藍圖
   * 注意：只返回 organization_id IS NULL 的藍圖
   */
  async getMyBlueprints(): Promise<{ data: Blueprint[]; error: Error | null }> {
    try {
      const {
        data: { user }
      } = await this.supabase.client.auth.getUser();

      if (!user) {
        return { data: [], error: new Error('User not authenticated') };
      }

      // 獲取用戶擁有的個人藍圖（organization_id IS NULL）
      const { data: ownedBlueprints, error: ownedError } = await this.getUserBlueprints(user.id);

      if (ownedError) {
        return { data: [], error: ownedError };
      }

      // 獲取用戶作為成員的藍圖（包括個人和組織藍圖）
      const { data: memberBlueprints, error: memberError } = await this.supabase.client
        .from('blueprint_members')
        .select(
          `
          blueprint_id,
          blueprints (*)
        `
        )
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (memberError) {
        return { data: ownedBlueprints, error: null };
      }

      // 合併並去重，只保留個人藍圖（organization_id IS NULL）
      // 注意：Supabase PostgREST 不支持在 join 查詢中直接過濾嵌套表的列，
      // 所以我們需要在 JavaScript 中進行過濾
      const memberBlueprintsList = (memberBlueprints || [])
        .map((item: any) => item.blueprints)
        .filter((bp: Blueprint) => bp && bp.organization_id === null && !ownedBlueprints.some(ob => ob.id === bp.id)) as Blueprint[];

      const allBlueprints = [...ownedBlueprints, ...memberBlueprintsList].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return { data: allBlueprints, error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * 根據 ID 獲取藍圖資料
   */
  async getBlueprintById(id: string): Promise<{ data: Blueprint | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client.from('blueprints').select('*').eq('id', id).single();

      if (error) {
        return { data: null, error };
      }

      return { data: data as Blueprint, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 根據 slug 獲取藍圖資料（包含擁有者資訊）
   * 支持組織藍圖和個人藍圖兩種模式
   *
   * @param organizationId 組織 ID（可選，如果是個人藍圖則傳 null）
   * @param slug 藍圖 slug
   * @param ownerId 擁有者 ID（可選，用於個人藍圖）
   */
  async getBlueprintBySlug(
    organizationId: string | null,
    slug: string,
    ownerId?: string
  ): Promise<{ data: BlueprintWithOwner | null; error: Error | null }> {
    try {
      let query = this.supabase.client.from('blueprints').select(
        `
        *,
        owner:users!blueprints_owner_id_fkey (*)
      `
      );

      // 根據是否有 organizationId 決定查詢方式
      if (organizationId) {
        // 組織藍圖：通過 organization_id 和 slug 查詢
        query = query.eq('organization_id', organizationId).eq('slug', slug);
      } else if (ownerId) {
        // 個人藍圖：通過 owner_id 和 slug 查詢
        query = query.eq('owner_id', ownerId).is('organization_id', null).eq('slug', slug);
      } else {
        // 如果都沒有，嘗試獲取當前用戶的個人藍圖
        const {
          data: { user }
        } = await this.supabase.client.auth.getUser();
        if (!user) {
          return { data: null, error: new Error('User not authenticated') };
        }
        query = query.eq('owner_id', user.id).is('organization_id', null).eq('slug', slug);
      }

      // 避免 PostgREST 單物件強制轉換錯誤：不使用 .single()
      // 按建立時間倒序取第一筆
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return { data: null, error };
      }

      const first = (data as any[])?.[0] || null;
      if (!first) {
        return { data: null, error: null };
      }

      return {
        data: {
          ...first,
          owner: first.owner
        } as BlueprintWithOwner,
        error: null
      };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 創建藍圖
   */
  async createBlueprint(input: CreateBlueprintInput): Promise<{ data: Blueprint | null; error: Error | null }> {
    try {
      const {
        data: { user }
      } = await this.supabase.client.auth.getUser();

      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const insertData: any = {
        organization_id: input.organization_id ?? null,
        team_id: input.team_id ?? null,
        owner_id: input.owner_id,
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        site_location: input.site_location ?? null,
        project_manager_id: input.project_manager_id ?? null,
        current_stage: input.current_stage ?? null,
        is_private: input.is_private ?? false,
        status: input.status ?? 'planning',
        start_date: input.start_date ?? null,
        end_date: input.end_date ?? null,
        tags: input.tags ?? [],
        progress_percentage: 0
      };

      const { data, error } = await this.supabase.client.from('blueprints').insert(insertData).select().single();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '創建藍圖失敗',
          details: error.message || '無法創建藍圖',
          source: 'BlueprintService.createBlueprint',
          retryable: true,
          metadata: { input }
        });
        return { data: null, error };
      }

      const createdBlueprint = data as Blueprint;

      // 自動添加擁有者為成員
      await this.addBlueprintMember(createdBlueprint.id, input.owner_id, 'owner');

      await this.activityService.createActivity({
        blueprintId: createdBlueprint.id,
        type: 'blueprint',
        action: '建立藍圖',
        description: `建立藍圖「${createdBlueprint.name}」`,
        userId: user.id,
        metadata: {
          slug: createdBlueprint.slug,
          organizationId: createdBlueprint.organization_id
        }
      });

      this.notifyAggregationChanged(createdBlueprint.id);

      return { data: createdBlueprint, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '創建藍圖失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'BlueprintService.createBlueprint',
        retryable: false,
        metadata: { input }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 更新藍圖資料
   */
  async updateBlueprint(id: string, input: UpdateBlueprintInput): Promise<{ data: Blueprint | null; error: Error | null }> {
    try {
      const updateData: any = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.avatar_url !== undefined) updateData.avatar_url = input.avatar_url;
      if (input.site_location !== undefined) updateData.site_location = input.site_location;
      if (input.project_manager_id !== undefined) updateData.project_manager_id = input.project_manager_id;
      if (input.current_stage !== undefined) updateData.current_stage = input.current_stage;
      if (input.progress_percentage !== undefined) updateData.progress_percentage = input.progress_percentage;
      if (input.is_private !== undefined) updateData.is_private = input.is_private;
      if (input.status !== undefined) updateData.status = input.status;
      if (input.start_date !== undefined) updateData.start_date = input.start_date;
      if (input.end_date !== undefined) updateData.end_date = input.end_date;
      if (input.tags !== undefined) updateData.tags = input.tags;

      const { data, error } = await this.supabase.client.from('blueprints').update(updateData).eq('id', id).select().single();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '更新藍圖失敗',
          details: error.message || '無法更新藍圖',
          source: 'BlueprintService.updateBlueprint',
          retryable: true,
          metadata: { id, input }
        });
        return { data: null, error };
      }

      this.notifyAggregationChanged(id);

      return { data: data as Blueprint, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '更新藍圖失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'BlueprintService.updateBlueprint',
        retryable: false,
        metadata: { id }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 刪除藍圖
   */
  async deleteBlueprint(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.client.from('blueprints').delete().eq('id', id);

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '刪除藍圖失敗',
          details: error.message || '無法刪除藍圖',
          source: 'BlueprintService.deleteBlueprint',
          retryable: false,
          metadata: { id }
        });
        return { error };
      }

      return { error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '刪除藍圖失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'BlueprintService.deleteBlueprint',
        retryable: false,
        metadata: { id }
      });
      return { error: error as Error };
    }
  }

  // ============================================
  // 成員管理
  // ============================================

  /**
   * 獲取藍圖的成員列表
   */
  async getBlueprintMembers(blueprintId: string): Promise<{ data: BlueprintMemberWithUser[]; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_members')
        .select(
          `
          *,
          user:users (*)
        `
        )
        .eq('blueprint_id', blueprintId)
        .eq('status', 'active');

      if (error) {
        return { data: [], error };
      }

      const members = (data || []).map((item: any) => ({
        ...item,
        user: item.user
      })) as BlueprintMemberWithUser[];

      return { data: members, error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * 添加成員到藍圖
   */
  async addBlueprintMember(
    blueprintId: string,
    userId: string,
    role: BlueprintMemberRole = 'member'
  ): Promise<{ data: BlueprintMember | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_members')
        .insert({
          blueprint_id: blueprintId,
          user_id: userId,
          role,
          status: 'active',
          joined_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      return { data: data as BlueprintMember, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 更新藍圖成員角色
   */
  async updateBlueprintMemberRole(
    memberId: string,
    role: BlueprintMemberRole
  ): Promise<{ data: BlueprintMember | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client.from('blueprint_members').update({ role }).eq('id', memberId).select().single();

      if (error) {
        return { data: null, error };
      }

      return { data: data as BlueprintMember, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 移除藍圖成員
   */
  async removeBlueprintMember(memberId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.client.from('blueprint_members').delete().eq('id', memberId);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  // ============================================
  // 進度追蹤
  // ============================================

  /**
   * 獲取藍圖的進度追蹤記錄
   */
  async getBlueprintProgress(blueprintId: string): Promise<{ data: BlueprintProgress[]; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_progress')
        .select('*')
        .eq('blueprint_id', blueprintId)
        .order('recorded_at', { ascending: false });

      if (error) {
        return { data: [], error };
      }

      return { data: (data || []) as BlueprintProgress[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * 創建進度追蹤記錄
   */
  async createProgress(input: CreateProgressInput): Promise<{ data: BlueprintProgress | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_progress')
        .insert({
          blueprint_id: input.blueprint_id,
          stage: input.stage,
          progress_percentage: input.progress_percentage,
          notes: input.notes,
          recorded_by: input.recorded_by
        })
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      // 更新藍圖的當前階段和進度百分比
      await this.updateBlueprint(input.blueprint_id, {
        current_stage: input.stage,
        progress_percentage: input.progress_percentage
      });

      this.notifyAggregationChanged(input.blueprint_id);

      return { data: data as BlueprintProgress, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  // ============================================
  // 里程碑管理
  // ============================================

  /**
   * 獲取藍圖的里程碑列表
   */
  async getBlueprintMilestones(blueprintId: string): Promise<{ data: BlueprintMilestone[]; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_milestones')
        .select('*')
        .eq('blueprint_id', blueprintId)
        .order('order_index', { ascending: true });

      if (error) {
        return { data: [], error };
      }

      return { data: (data || []) as BlueprintMilestone[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * 創建里程碑
   */
  async createMilestone(input: CreateMilestoneInput): Promise<{ data: BlueprintMilestone | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_milestones')
        .insert({
          blueprint_id: input.blueprint_id,
          name: input.name,
          description: input.description,
          target_date: input.target_date,
          order_index: input.order_index
        })
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      this.notifyAggregationChanged(input.blueprint_id);

      return { data: data as BlueprintMilestone, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 更新里程碑
   */
  async updateMilestone(id: string, input: UpdateMilestoneInput): Promise<{ data: BlueprintMilestone | null; error: Error | null }> {
    try {
      const updateData: any = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.target_date !== undefined) updateData.target_date = input.target_date;
      if (input.progress_percentage !== undefined) updateData.progress_percentage = input.progress_percentage;
      if (input.status !== undefined) updateData.status = input.status;
      if (input.completed_date !== undefined) updateData.completed_date = input.completed_date;
      if (input.order_index !== undefined) updateData.order_index = input.order_index;

      const { data, error } = await this.supabase.client.from('blueprint_milestones').update(updateData).eq('id', id).select().single();

      if (error) {
        return { data: null, error };
      }

      const updatedMilestone = data as BlueprintMilestone;
      if (updatedMilestone.blueprint_id) {
        this.notifyAggregationChanged(updatedMilestone.blueprint_id);
      }

      return { data: updatedMilestone, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 刪除里程碑
   */
  async deleteMilestone(id: string): Promise<{ error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_milestones')
        .delete()
        .eq('id', id)
        .select('blueprint_id')
        .maybeSingle();

      if (error) {
        return { error };
      }

      if (data?.blueprint_id) {
        this.notifyAggregationChanged(data.blueprint_id);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  // ============================================
  // 文件管理
  // ============================================

  // TODO(etms): 補齊文件樹組裝與版本歷程同步（@ETMS_DESIGN_SPEC.md 0.5），提供 BlueprintDocumentTreeNode 結構與快取層

  /**
   * 獲取藍圖的文件列表
   */
  async getBlueprintDocuments(blueprintId: string, parentId?: string): Promise<{ data: BlueprintDocument[]; error: Error | null }> {
    try {
      let query = this.supabase.client.from('blueprint_documents').select('*').eq('blueprint_id', blueprintId);

      if (parentId !== undefined) {
        query = parentId ? query.eq('parent_id', parentId) : query.is('parent_id', null);
      }

      const { data, error } = await query.order('path', { ascending: true }).order('name', { ascending: true });

      if (error) {
        return { data: [], error };
      }

      return { data: (data || []) as BlueprintDocument[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * 創建文件
   */
  async createDocument(input: CreateDocumentInput): Promise<{ data: BlueprintDocument | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_documents')
        .insert({
          blueprint_id: input.blueprint_id,
          name: input.name,
          path: input.path,
          type: input.type,
          mime_type: input.mime_type,
          size: input.size,
          storage_path: input.storage_path,
          parent_id: input.parent_id,
          created_by: input.created_by,
          current_version: input.current_version ?? 0,
          discipline: input.discipline ?? null,
          phase: input.phase ?? null,
          package: input.package ?? null,
          hierarchy_path: input.hierarchy_path ?? null,
          metadata: input.metadata ?? null
        })
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      return { data: data as BlueprintDocument, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 更新文件
   */
  async updateDocument(id: string, input: Partial<CreateDocumentInput>): Promise<{ data: BlueprintDocument | null; error: Error | null }> {
    try {
      const updateData: any = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.path !== undefined) updateData.path = input.path;
      if (input.mime_type !== undefined) updateData.mime_type = input.mime_type;
      if (input.size !== undefined) updateData.size = input.size;
      if (input.storage_path !== undefined) updateData.storage_path = input.storage_path;
      if (input.current_version !== undefined) updateData.current_version = input.current_version;
      if (input.parent_id !== undefined) updateData.parent_id = input.parent_id;
      if (input.discipline !== undefined) updateData.discipline = input.discipline ?? null;
      if (input.phase !== undefined) updateData.phase = input.phase ?? null;
      if (input.package !== undefined) updateData.package = input.package ?? null;
      if (input.hierarchy_path !== undefined) updateData.hierarchy_path = input.hierarchy_path ?? null;
      if (input.metadata !== undefined) updateData.metadata = input.metadata ?? null;

      const { data, error } = await this.supabase.client.from('blueprint_documents').update(updateData).eq('id', id).select().single();

      if (error) {
        return { data: null, error };
      }

      return { data: data as BlueprintDocument, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 刪除文件
   */
  async deleteDocument(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.client.from('blueprint_documents').delete().eq('id', id);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * 獲取文件的所有版本
   */
  async getDocumentVersions(documentId: string): Promise<{ data: BlueprintDocumentVersion[]; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('version', { ascending: false });

      if (error) {
        return { data: [], error };
      }

      return { data: (data || []) as BlueprintDocumentVersion[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * 上傳文件版本
   */
  async uploadDocumentVersion(input: UploadDocumentVersionInput): Promise<{ data: BlueprintDocumentVersion | null; error: Error | null }> {
    try {
      // 獲取當前文件
      const { data: document, error: docError } = await this.supabase.client
        .from('blueprint_documents')
        .select('*')
        .eq('id', input.document_id)
        .single();

      if (docError || !document) {
        return { data: null, error: docError || new Error('Document not found') };
      }

      // 創建新版本
      const newVersion = (document.current_version || 0) + 1;

      const { data, error } = await this.supabase.client
        .from('blueprint_document_versions')
        .insert({
          document_id: input.document_id,
          version: newVersion,
          content: input.content,
          storage_path: input.storage_path,
          file_hash: input.file_hash,
          change_description: input.change_description,
          changed_by: input.changed_by
        })
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      // 更新文件的當前版本號
      await this.supabase.client.from('blueprint_documents').update({ current_version: newVersion }).eq('id', input.document_id);

      return { data: data as BlueprintDocumentVersion, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 刪除文件版本
   */
  async deleteDocumentVersion(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.client.from('blueprint_document_versions').delete().eq('id', id);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  // ============================================
  // 每日施工日誌 CRUD 操作
  // ============================================

  /**
   * 獲取藍圖的所有每日施工日誌
   */
  async getBlueprintDailyReports(blueprintId: string): Promise<{ data: BlueprintDailyReport[]; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_daily_reports')
        .select('*')
        .eq('blueprint_id', blueprintId)
        .order('date', { ascending: false });

      if (error) {
        return { data: [], error };
      }

      return { data: (data || []) as BlueprintDailyReport[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * 根據 ID 獲取每日施工日誌
   */
  async getBlueprintDailyReportById(id: string): Promise<{ data: BlueprintDailyReport | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client.from('blueprint_daily_reports').select('*').eq('id', id).single();

      if (error) {
        return { data: null, error };
      }

      return { data: data as BlueprintDailyReport, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 創建每日施工日誌
   */
  async createDailyReport(input: CreateDailyReportInput): Promise<{ data: BlueprintDailyReport | null; error: Error | null }> {
    try {
      const {
        data: { user }
      } = await this.supabase.client.auth.getUser();

      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await this.supabase.client
        .from('blueprint_daily_reports')
        .insert({
          blueprint_id: input.blueprint_id,
          date: input.date,
          weather: input.weather || null,
          content: input.content,
          progress_percentage: input.progress_percentage || null,
          participants: input.participants || [],
          photos: input.photos || [],
          issues: input.issues || null,
          notes: input.notes || null,
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      this.notifyAggregationChanged(input.blueprint_id);

      return { data: data as BlueprintDailyReport, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 更新每日施工日誌
   */
  async updateDailyReport(id: string, input: UpdateDailyReportInput): Promise<{ data: BlueprintDailyReport | null; error: Error | null }> {
    try {
      const updateData: any = {};

      if (input.date !== undefined) {
        updateData.date = input.date;
      }
      if (input.weather !== undefined) {
        updateData.weather = input.weather;
      }
      if (input.content !== undefined) {
        updateData.content = input.content;
      }
      if (input.progress_percentage !== undefined) {
        updateData.progress_percentage = input.progress_percentage;
      }
      if (input.participants !== undefined) {
        updateData.participants = input.participants || [];
      }
      if (input.photos !== undefined) {
        updateData.photos = input.photos || [];
      }
      if (input.issues !== undefined) {
        updateData.issues = input.issues;
      }
      if (input.notes !== undefined) {
        updateData.notes = input.notes;
      }

      const { data, error } = await this.supabase.client.from('blueprint_daily_reports').update(updateData).eq('id', id).select().single();

      if (error) {
        return { data: null, error };
      }

      const updatedReport = data as BlueprintDailyReport;
      this.notifyAggregationChanged(updatedReport.blueprint_id);

      return { data: updatedReport, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 刪除每日施工日誌
   */
  async deleteDailyReport(id: string): Promise<{ error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_daily_reports')
        .delete()
        .eq('id', id)
        .select('blueprint_id')
        .maybeSingle();

      if (error) {
        return { error };
      }

      if (data?.blueprint_id) {
        this.notifyAggregationChanged(data.blueprint_id);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  // ============================================
  // 藍圖聚合
  // ============================================

  async getBlueprintAggregation(
    blueprintId: string,
    filters?: BlueprintAggregationFilters
  ): Promise<{ data: BlueprintAggregationResult | null; error: Error | null }> {
    try {
      const data = await this.aggregationService.getAggregationResult(blueprintId, filters);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async recalculateBlueprintAggregation(
    blueprintId: string,
    filters?: BlueprintAggregationFilters
  ): Promise<{ data: BlueprintAggregationResult | null; error: Error | null }> {
    try {
      const data = await this.aggregationService.recalculate(blueprintId, filters);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  private notifyAggregationChanged(blueprintId: string): void {
    this.aggregationService.notifyBlueprintChanged(blueprintId);
  }
}
