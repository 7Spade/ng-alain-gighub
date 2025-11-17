/**
 * Task Template Service
 *
 * Provides task template management including CRUD operations and template instantiation.
 * Follows enterprise standards with Signal-based state management.
 *
 * @module shared/services/task-template
 */

import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { TaskTemplateRepository, TaskTemplate, TaskTemplateInsert, TaskTemplateUpdate } from '../../../core/infra/repositories/task-template.repository';
import { BlueprintRepository } from '../../../core/infra/repositories/blueprint.repository';
import { TaskRepository, Task, TaskInsert } from '../../../core/infra/repositories/task.repository';
import { BlueprintActivityService } from '../blueprint/blueprint-activity.service';
import { TaskType } from '../../../core/infra/types/task.types';

/**
 * Template task structure in JSONB
 */
export interface TemplateTask {
  /** Internal template ID */
  template_id: string;
  /** Task name */
  name: string;
  /** Task description */
  description?: string;
  /** Task type */
  task_type: TaskType;
  /** Parent template ID (reference to another TemplateTask) */
  parent_template_id?: string | null;
  /** Display order */
  order_index: number;
  /** Estimated hours */
  estimated_hours?: number;
  /** Contractor fields */
  contractor_fields?: Record<string, any>;
}

/**
 * Task structure container in template
 */
export interface TaskStructure {
  /** Array of template tasks */
  tasks: TemplateTask[];
}

/**
 * Task Template Service
 *
 * Manages task templates with CRUD operations and instantiation logic.
 */
@Injectable({
  providedIn: 'root'
})
export class TaskTemplateService {
  private repository = inject(TaskTemplateRepository);
  private blueprintRepository = inject(BlueprintRepository);
  private taskRepository = inject(TaskRepository);
  private activityService = inject(BlueprintActivityService);

  // State signals
  templates = signal<TaskTemplate[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  selectedTemplate = signal<TaskTemplate | null>(null);

  // Computed signals
  organizationTemplates = computed(() =>
    this.templates().filter(t => t.organization_id !== null)
  );

  publicTemplates = computed(() =>
    this.templates().filter(t => t.is_public === true)
  );

  /**
   * Create a new task template
   *
   * @param template Template data to create
   * @returns Created template
   */
  async createTemplate(template: TaskTemplateInsert): Promise<TaskTemplate> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const created = await firstValueFrom(this.repository.create(template)) as TaskTemplate;
      this.templates.update(list => [...list, created]);

      // Log activity if blueprint context exists
      if (created.organization_id) {
        await this.activityService.logActivity({
          blueprintId: created.organization_id,
          action: 'template_created',
          entityType: 'task_template',
          entityId: created.id,
          metadata: { template_name: created.name }
        });
      }

      return created;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to create template');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Update an existing task template
   *
   * @param id Template ID
   * @param updates Updates to apply
   * @returns Updated template
   */
  async updateTemplate(id: string, updates: TaskTemplateUpdate): Promise<TaskTemplate> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const updated = await firstValueFrom(this.repository.update(id, updates)) as TaskTemplate;

      // Update local state
      this.templates.update(list =>
        list.map(t => (t.id === id ? updated : t))
      );

      if (this.selectedTemplate()?.id === id) {
        this.selectedTemplate.set(updated);
      }

      // Log activity
      if (updated.organization_id) {
        await this.activityService.logActivity({
          blueprintId: updated.organization_id,
          action: 'template_updated',
          entityType: 'task_template',
          entityId: updated.id,
          metadata: { template_name: updated.name }
        });
      }

      return updated;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to update template');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Delete a task template
   *
   * @param id Template ID to delete
   */
  async deleteTemplate(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const template = this.templates().find(t => t.id === id);

      await firstValueFrom(this.repository.delete(id));

      // Update local state
      this.templates.update(list => list.filter(t => t.id !== id));

      if (this.selectedTemplate()?.id === id) {
        this.selectedTemplate.set(null);
      }

      // Log activity
      if (template?.organization_id) {
        await this.activityService.logActivity({
          blueprintId: template.organization_id,
          action: 'template_deleted',
          entityType: 'task_template',
          entityId: id,
          metadata: { template_name: template.name }
        });
      }
    } catch (err: any) {
      this.error.set(err.message || 'Failed to delete template');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Get a single template by ID
   *
   * @param id Template ID
   * @returns Template
   */
  async getTemplate(id: string): Promise<TaskTemplate | null> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const template = await firstValueFrom(this.repository.findById(id));
      this.selectedTemplate.set(template);
      return template;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to get template');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Get all templates for current user
   *
   * @returns Array of templates
   */
  async getAllTemplates(): Promise<TaskTemplate[]> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const templates = await firstValueFrom(this.repository.findAll()) as TaskTemplate[];
      this.templates.set(templates);
      return templates;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to get templates');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Get templates for specific organization
   *
   * @param organizationId Organization ID
   * @returns Array of templates
   */
  async getOrganizationTemplates(organizationId: string): Promise<TaskTemplate[]> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const templates = await firstValueFrom(
        this.repository.findByOrganizationId(organizationId)
      ) as TaskTemplate[];
      return templates;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to get organization templates');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Get public templates
   *
   * @returns Array of public templates
   */
  async getPublicTemplates(): Promise<TaskTemplate[]> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const templates = await firstValueFrom(this.repository.findPublic()) as TaskTemplate[];
      return templates;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to get public templates');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Create tasks from template with full hierarchy support
   *
   * This method instantiates a template by creating all tasks defined in the template's
   * template_data, maintaining parent-child relationships and order.
   *
   * @param templateId Template ID to instantiate
   * @param blueprintId Blueprint to create tasks in
   * @param parentTaskId Optional parent task ID (if creating as subtree)
   * @returns Array of created tasks
   */
  async createTasksFromTemplate(
    templateId: string,
    blueprintId: string,
    parentTaskId?: string | null
  ): Promise<any[]> {
    this.loading.set(true);
    this.error.set(null);

    try {
      // 1. Fetch template
      const template = await firstValueFrom(this.repository.findById(templateId)) as TaskTemplate;

      if (!template.template_data) {
        throw new Error('Template has no task structure');
      }

      const structure = template.template_data as unknown as TaskStructure;

      if (!structure.tasks || structure.tasks.length === 0) {
        throw new Error('Template has no tasks defined');
      }

      // 2. Validate blueprint exists
      const blueprint = await firstValueFrom(this.blueprintRepository.findById(blueprintId)) as any;

      if (!blueprint) {
        throw new Error(`Blueprint ${blueprintId} not found`);
      }

      // 3. Create ID mapping (template_id -> real_task_id)
      const idMap = new Map<string, string>();

      // 4. Sort tasks using topological sort (parents before children)
      const sortedTasks = this.topologicalSort(structure.tasks);

      // 5. Create tasks iteratively
      const createdTasks: any[] = [];

      for (const templateTask of sortedTasks) {
        // Map parent ID from template to real ID
        const realParentId = templateTask.parent_template_id
          ? idMap.get(templateTask.parent_template_id) ?? null
          : parentTaskId ?? null;

        // Create task
        const taskData: any = {
          blueprint_id: blueprintId,
          title: templateTask.name,
          description: templateTask.description,
          task_type: templateTask.task_type,
          parent_task_id: realParentId,
          order_index: templateTask.order_index,
          estimated_hours: templateTask.estimated_hours,
          contractor_fields: templateTask.contractor_fields || null,
          status: 'pending' // Default status
        };

        const createdTask = await firstValueFrom(this.taskRepository.create(taskData)) as Task;

        // Store mapping
        idMap.set(templateTask.template_id, createdTask.id);
        createdTasks.push(createdTask);
      }

      // 6. Log activity
      await this.activityService.logActivity({
        blueprintId: blueprintId,
        action: 'template_instantiated',
        entityType: 'task_template',
        entityId: templateId,
        metadata: {
          template_name: template.name,
          task_count: createdTasks.length,
          parent_task_id: parentTaskId
        }
      });

      return createdTasks;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to create tasks from template');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Topological sort for template tasks
   *
   * Ensures parents are created before children by sorting tasks
   * based on their dependency relationships.
   *
   * @param tasks Array of template tasks
   * @returns Sorted array of tasks (parents first)
   */
  private topologicalSort(tasks: TemplateTask[]): TemplateTask[] {
    const sorted: TemplateTask[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    // Build adjacency map for quick lookup
    const taskMap = new Map<string, TemplateTask>();
    tasks.forEach(task => taskMap.set(task.template_id, task));

    // DFS visit function
    const visit = (taskId: string): void => {
      if (visited.has(taskId)) return;

      if (visiting.has(taskId)) {
        throw new Error(`Circular dependency detected in template involving task ${taskId}`);
      }

      const task = taskMap.get(taskId);
      if (!task) return;

      visiting.add(taskId);

      // Visit parent first (if exists)
      if (task.parent_template_id) {
        visit(task.parent_template_id);
      }

      visiting.delete(taskId);
      visited.add(taskId);
      sorted.push(task);
    };

    // Visit all tasks
    tasks.forEach(task => visit(task.template_id));

    return sorted;
  }
}
