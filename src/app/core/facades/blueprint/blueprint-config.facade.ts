import { inject, Injectable, signal } from '@angular/core';
import { type BlueprintConfig } from '@core';
import { BlueprintService } from '@shared';

/**
 * Blueprint Config Facade
 *
 * 负责蓝图配置管理功能
 * 包括配置的加载、获取、设置等操作
 *
 * @module core/facades/blueprint
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintConfigFacade {
  private readonly blueprintService = inject(BlueprintService);

  // Signal state
  private readonly operationInProgressState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);

  // Expose service signals
  readonly configs = this.blueprintService.configs;
  readonly loading = this.blueprintService.loading;
  readonly error = this.blueprintService.error;

  // Facade-specific signals
  readonly operationInProgress = this.operationInProgressState.asReadonly();
  readonly lastOperation = this.lastOperationState.asReadonly();

  /**
   * Load configurations for a blueprint
   *
   * @param blueprintId Blueprint ID
   * @returns Promise<BlueprintConfig[]>
   */
  async loadConfigs(blueprintId: string): Promise<BlueprintConfig[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_configs');

    try {
      return await this.blueprintService.loadConfigs(blueprintId);
    } catch (error) {
      console.error('[BlueprintConfigFacade] Failed to load configs:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Get configuration value
   *
   * @param blueprintId Blueprint ID
   * @param configKey Configuration key
   * @returns Promise<BlueprintConfig | null>
   */
  async getConfig(blueprintId: string, configKey: string): Promise<BlueprintConfig | null> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('get_config');

    try {
      return await this.blueprintService.getConfig(blueprintId, configKey);
    } catch (error) {
      console.error('[BlueprintConfigFacade] Failed to get config:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Set configuration value
   *
   * @param blueprintId Blueprint ID
   * @param configKey Configuration key
   * @param configValue Configuration value
   * @param updatedBy User ID who updates the config (optional)
   * @returns Promise<BlueprintConfig>
   */
  async setConfig(blueprintId: string, configKey: string, configValue: any, updatedBy?: string): Promise<BlueprintConfig> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('set_config');

    try {
      return await this.blueprintService.setConfig(blueprintId, configKey, configValue, updatedBy);
    } catch (error) {
      console.error('[BlueprintConfigFacade] Failed to set config:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }
}
