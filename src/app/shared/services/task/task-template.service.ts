import { Injectable, inject, signal, computed } from '@angular/core';
import { TaskTemplateRepository, TaskTemplateInsert, TaskTemplateUpdate } from '@core';
import { TaskTemplate, TaskInsert } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * TaskTemplate Service
 *
 * 提供任务模板相关的业务逻辑和状态管理
 * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 *
 * 支持功能：
 * - 任务模板 CRUD 操作
 * - 任务模板查询（按组织、公共模板）
 * - 任务模板套用（从模板创建任务）
 * - 任务模板使用统计
 *
 * @example
 * ```typescript
 * const templateService = inject(TaskTemplateService);
 *
 * // 加载所有模板
 * await templateService.loadTemplates();
 *
 * // 订阅模板状态
 * effect(() => {
 *   console.log('Templates:', templateService.templates());
 *   console.log('Public templates:', templateService.publicTemplates());
 * });
 *
 * // 从模板创建任务
 * const task = await templateService.createTaskFromTemplate('template-id', 'blueprint-id');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TaskTemplateService {
  private templateRepository = inject(TaskTemplateRepository);

  // 使用 Signals 管理状态
  private templatesState = signal<TaskTemplate[]>([]);
  private selectedTemplateState = signal<TaskTemplate | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给组件
  readonly templates = this.templatesState.asReadonly();
  readonly selectedTemplate = this.selectedTemplateState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly publicTemplates = computed(() => {
    const templates = this.templates() as any[];
    return templates.filter(t => t.is_public === true);
  });

  readonly organizationTemplates = computed(() => {
    const templates = this.templates() as any[];
    return templates.filter(t => t.is_public === false);
  });

  readonly popularTemplates = computed(() => {
    const templates = [...this.templates()] as any[];
    return templates.sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0)).slice(0, 10);
  });

  /**
   * 加载所有模板
   */
  async loadTemplates(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.templateRepository.findAll());
      this.templatesState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载模板列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据 ID 加载模板
   *
   * @param templateId 模板 ID
   */
  async loadTemplateById(templateId: string): Promise<TaskTemplate | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const template = await firstValueFrom(this.templateRepository.findById(templateId));
      if (template) {
        this.selectedTemplateState.set(template);
        // 更新模板列表中的模板
        this.templatesState.update(templates => {
          const index = templates.findIndex(t => t.id === templateId);
          if (index >= 0) {
            const updated = [...templates];
            updated[index] = template;
            return updated;
          }
          return [...templates, template];
        });
      }
      return template;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载模板失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 创建模板
   *
   * @param template 模板数据
   * @returns 创建的模板
   */
  async createTemplate(template: TaskTemplateInsert): Promise<TaskTemplate> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const created = await firstValueFrom(this.templateRepository.create(template));
      this.templatesState.update(templates => [...templates, created]);
      return created;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '创建模板失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新模板
   *
   * @param templateId 模板 ID
   * @param updates 更新数据
   * @returns 更新后的模板
   */
  async updateTemplate(templateId: string, updates: TaskTemplateUpdate): Promise<TaskTemplate> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updated = await firstValueFrom(this.templateRepository.update(templateId, updates));
      this.templatesState.update(templates => templates.map(t => (t.id === templateId ? updated : t)));
      if (this.selectedTemplateState()?.id === templateId) {
        this.selectedTemplateState.set(updated);
      }
      return updated;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新模板失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 删除模板
   *
   * @param templateId 模板 ID
   */
  async deleteTemplate(templateId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.templateRepository.delete(templateId));
      this.templatesState.update(templates => templates.filter(t => t.id !== templateId));
      if (this.selectedTemplateState()?.id === templateId) {
        this.selectedTemplateState.set(null);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '删除模板失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据组织 ID 查询模板
   *
   * @param organizationId 组织 ID
   */
  async findByOrganizationId(organizationId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.templateRepository.findByOrganizationId(organizationId));
      this.templatesState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '查询组织模板失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 查询公共模板
   */
  async findPublicTemplates(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.templateRepository.findPublic());
      this.templatesState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '查询公共模板失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 套用模板（返回任务数据，不创建任务）
   *
   * @param templateId 模板 ID
   * @returns 任务数据
   */
  async applyTemplate(templateId: string): Promise<TaskInsert> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const template = await this.loadTemplateById(templateId);
      if (!template) {
        throw new Error('模板不存在');
      }

      // 从模板数据中提取任务数据
      const templateData = template.template_data as any;
      if (!templateData || typeof templateData !== 'object') {
        throw new Error('模板数据格式错误');
      }

      // 返回任务数据（不包含 id、created_at 等字段）
      const taskData: TaskInsert = {
        ...templateData,
        // 确保不包含自动生成的字段
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      };

      return taskData;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '套用模板失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 从模板创建任务
   *
   * @param templateId 模板 ID
   * @param blueprintId 蓝图 ID
   * @param additionalData 额外的任务数据（会覆盖模板数据）
   * @returns 创建的任务（需要调用 TaskService.createTask）
   */
  async createTaskFromTemplate(templateId: string, blueprintId: string, additionalData?: Partial<TaskInsert>): Promise<TaskInsert> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const template = await this.loadTemplateById(templateId);
      if (!template) {
        throw new Error('模板不存在');
      }

      // 从模板数据中提取任务数据
      const templateData = template.template_data as any;
      if (!templateData || typeof templateData !== 'object') {
        throw new Error('模板数据格式错误');
      }

      // 合并模板数据和额外数据
      const taskData: TaskInsert = {
        ...templateData,
        blueprint_id: blueprintId,
        ...additionalData,
        // 确保不包含自动生成的字段
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      };

      // 增加使用计数
      await this.updateTemplate(templateId, {
        usage_count: (template.usage_count || 0) + 1
      });

      return taskData;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '从模板创建任务失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 获取模板使用统计
   *
   * @param templateId 模板 ID（可选，不提供则返回所有模板的统计）
   * @returns 使用统计
   */
  async getTemplateUsageStats(templateId?: string): Promise<{
    totalTemplates: number;
    publicTemplates: number;
    organizationTemplates: number;
    totalUsage: number;
    mostUsed?: TaskTemplate;
    templateStats?: {
      id: string;
      name: string;
      usageCount: number;
    };
  }> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const templates = this.templates().length > 0 ? this.templates() : await this.loadTemplates().then(() => this.templates());
      const templatesArray = templates as any[];

      const totalTemplates = templatesArray.length;
      const publicTemplates = templatesArray.filter(t => t.is_public === true).length;
      const organizationTemplates = templatesArray.filter(t => t.is_public === false).length;
      const totalUsage = templatesArray.reduce((sum, t) => sum + (t.usage_count || 0), 0);
      const mostUsed = templatesArray.sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))[0];

      const result: {
        totalTemplates: number;
        publicTemplates: number;
        organizationTemplates: number;
        totalUsage: number;
        mostUsed?: TaskTemplate;
        templateStats?: {
          id: string;
          name: string;
          usageCount: number;
        };
      } = {
        totalTemplates,
        publicTemplates,
        organizationTemplates,
        totalUsage,
        mostUsed
      };

      if (templateId) {
        const template = templatesArray.find(t => t.id === templateId);
        if (template) {
          result.templateStats = {
            id: template.id,
            name: template.name,
            usageCount: template.usage_count || 0
          };
        }
      }

      return result;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '获取模板使用统计失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }
}
