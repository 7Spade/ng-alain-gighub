import { Injectable, inject } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import {
  BlueprintRepository,
  BlueprintConfigRepository,
  BlueprintInsert,
  BlueprintUpdate,
  BlueprintConfigInsert,
  BlueprintConfigUpdate
} from '@core';
import { Blueprint, BlueprintConfig, BlueprintStatus } from '@shared';

/**
 * Blueprint Service
 * 
 * 提供蓝图相关的业务逻辑和状态管理
 * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 * 
 * @example
 * ```typescript
 * const blueprintService = inject(BlueprintService);
 * 
 * // 订阅蓝图列表
 * effect(() => {
 *   console.log('Blueprints:', blueprintService.blueprints());
 * });
 * 
 * // 加载蓝图列表
 * await blueprintService.loadBlueprints();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintService {
  private blueprintRepository = inject(BlueprintRepository);
  private blueprintConfigRepository = inject(BlueprintConfigRepository);

  // 使用 Signals 管理状态
  private blueprintsState = signal<Blueprint[]>([]);
  private selectedBlueprintState = signal<Blueprint | null>(null);
  private configsState = signal<BlueprintConfig[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给组件
  readonly blueprints = this.blueprintsState.asReadonly();
  readonly selectedBlueprint = this.selectedBlueprintState.asReadonly();
  readonly configs = this.configsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly activeBlueprints = computed(() =>
    this.blueprints().filter(b => b.status === BlueprintStatus.ACTIVE)
  );

  readonly planningBlueprints = computed(() =>
    this.blueprints().filter(b => b.status === BlueprintStatus.PLANNING)
  );

  readonly completedBlueprints = computed(() =>
    this.blueprints().filter(b => b.status === BlueprintStatus.COMPLETED)
  );

  /**
   * 加载所有蓝图
   */
  async loadBlueprints(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const blueprints = await firstValueFrom(this.blueprintRepository.findAll());
      this.blueprintsState.set(blueprints);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载蓝图列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据 ID 加载蓝图
   */
  async loadBlueprintById(id: string): Promise<Blueprint | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const blueprint = await firstValueFrom(this.blueprintRepository.findById(id));
      if (blueprint) {
        this.selectedBlueprintState.set(blueprint);
        // 同时加载配置
        await this.loadConfigs(id);
      }
      return blueprint;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载蓝图失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据拥有者 ID 加载蓝图列表
   */
  async loadBlueprintsByOwnerId(ownerId: string): Promise<Blueprint[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const blueprints = await firstValueFrom(this.blueprintRepository.findByOwnerId(ownerId));
      this.blueprintsState.set(blueprints);
      return blueprints;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载蓝图列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据状态加载蓝图列表
   */
  async loadBlueprintsByStatus(status: BlueprintStatus): Promise<Blueprint[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const blueprints = await firstValueFrom(this.blueprintRepository.findByStatus(status));
      return blueprints;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载蓝图列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据项目代码加载蓝图
   */
  async loadBlueprintByProjectCode(projectCode: string): Promise<Blueprint | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const blueprint = await firstValueFrom(
        this.blueprintRepository.findByProjectCode(projectCode)
      );
      if (blueprint) {
        this.selectedBlueprintState.set(blueprint);
      }
      return blueprint;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载蓝图失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 创建蓝图
   */
  async createBlueprint(data: BlueprintInsert): Promise<Blueprint> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const blueprint = await firstValueFrom(this.blueprintRepository.create(data));
      // 更新本地状态
      this.blueprintsState.update(blueprints => [...blueprints, blueprint]);
      return blueprint;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '创建蓝图失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新蓝图
   */
  async updateBlueprint(id: string, data: BlueprintUpdate): Promise<Blueprint> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const blueprint = await firstValueFrom(this.blueprintRepository.update(id, data));
      // 更新本地状态
      this.blueprintsState.update(blueprints =>
        blueprints.map(b => (b.id === id ? blueprint : b))
      );
      // 如果更新的是当前选中的蓝图，也更新选中状态
      if (this.selectedBlueprint()?.id === id) {
        this.selectedBlueprintState.set(blueprint);
      }
      return blueprint;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新蓝图失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 删除蓝图
   */
  async deleteBlueprint(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.blueprintRepository.delete(id));
      // 更新本地状态
      this.blueprintsState.update(blueprints => blueprints.filter(b => b.id !== id));
      // 如果删除的是当前选中的蓝图，清空选中状态
      if (this.selectedBlueprint()?.id === id) {
        this.selectedBlueprintState.set(null);
        this.configsState.set([]);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '删除蓝图失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 选择蓝图
   */
  selectBlueprint(blueprint: Blueprint | null): void {
    this.selectedBlueprintState.set(blueprint);
    if (blueprint) {
      this.loadConfigs(blueprint.id);
    } else {
      this.configsState.set([]);
    }
  }

  /**
   * 加载蓝图配置
   */
  async loadConfigs(blueprintId: string): Promise<BlueprintConfig[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const configs = await firstValueFrom(
        this.blueprintConfigRepository.findByBlueprintId(blueprintId)
      );
      this.configsState.set(configs);
      return configs;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载配置失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 获取配置值
   */
  async getConfig(blueprintId: string, configKey: string): Promise<BlueprintConfig | null> {
    return await firstValueFrom(
      this.blueprintConfigRepository.findByConfigKey(blueprintId, configKey)
    );
  }

  /**
   * 设置配置
   */
  async setConfig(
    blueprintId: string,
    configKey: string,
    configValue: any,
    updatedBy?: string
  ): Promise<BlueprintConfig> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const config = await firstValueFrom(
        this.blueprintConfigRepository.upsertConfig(blueprintId, configKey, configValue, updatedBy)
      );
      // 更新本地状态
      this.configsState.update(configs => {
        // 注意：数据库字段是 config_key，但 BaseRepository 会转换为 configKey
        const existing = configs.find(c => (c as any).configKey === configKey || (c as any).config_key === configKey);
        if (existing) {
          return configs.map(c => (c.id === config.id ? config : c));
        }
        return [...configs, config];
      });
      return config;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '设置配置失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 重置状态
   */
  reset(): void {
    this.blueprintsState.set([]);
    this.selectedBlueprintState.set(null);
    this.configsState.set([]);
    this.errorState.set(null);
  }
}

