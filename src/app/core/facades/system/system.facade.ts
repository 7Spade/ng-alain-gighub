import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import {
  SettingInsert,
  SettingUpdate,
  FeatureFlagInsert,
  FeatureFlagUpdate,
  Setting,
  FeatureFlag,
  BlueprintActivityService
} from '@shared';
import { FeatureFlagService } from '@shared/services/system/feature-flag.service';
import { SettingService } from '@shared/services/system/setting.service';

import { ErrorStateService } from '../services/error-state.service';

/**
 * A/B Test Result
 */
export interface ABTestResult {
  flagId: string;
  flagKey: string;
  variant: string;
  participants: number;
  conversions: number;
  conversionRate: number;
}

/**
 * System Facade
 *
 * Enterprise-grade facade for System management.
 * Orchestrates SettingService and FeatureFlagService to provide a unified
 * interface for all system operations.
 *
 * Design Principles:
 * - Signal-based state management (Angular 20)
 * - Facade pattern: Component → Facade → Service → Repository → Supabase
 * - Non-invasive error handling via ErrorStateService
 * - Automatic audit logging via BlueprintActivityService (if applicable)
 * - System settings and feature flag management
 *
 * Key Features:
 * - System settings management (global, project, user)
 * - Feature flag management
 * - Gradual rollout (gray release)
 * - A/B testing management
 * - Statistics and analytics
 * - Computed state for filtered views
 *
 * @example
 * ```typescript
 * const facade = inject(SystemFacade);
 *
 * // Load settings
 * await facade.loadSettings();
 *
 * // Access reactive state
 * effect(() => {
 *   console.log('Settings:', facade.settings());
 *   console.log('Enabled features:', facade.enabledFeatures());
 * });
 *
 * // Get setting value
 * const value = facade.getSetting('theme', 'light');
 *
 * // Enable feature for users
 * await facade.enableFeatureForUsers('new-ui', ['user-1', 'user-2']);
 * ```
 *
 * @see docs/27-完整架構流程圖.mermaid.md
 */
@Injectable({
  providedIn: 'root'
})
export class SystemFacade implements OnDestroy {
  // Inject dependencies
  private readonly settingService = inject(SettingService);
  private readonly featureFlagService = inject(FeatureFlagService);
  private readonly activityService = inject(BlueprintActivityService);
  private readonly errorStateService = inject(ErrorStateService);

  // Signal state - Facade-specific state
  private readonly operationInProgressState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);

  // Readonly signals exposed to components
  readonly operationInProgress = this.operationInProgressState.asReadonly();
  readonly lastOperation = this.lastOperationState.asReadonly();

  // Expose service signals through facade
  readonly settings = this.settingService.settings;
  readonly featureFlags = this.featureFlagService.flags;
  readonly loading = computed(() => this.settingService.loading() || this.featureFlagService.loading());
  readonly error = computed(() => this.settingService.error() || this.featureFlagService.error());

  // Computed signals from services
  readonly enabledFeatures = this.featureFlagService.enabledFlags;
  readonly disabledFeatures = this.featureFlagService.disabledFlags;

  // Computed: System settings
  readonly systemSettings = computed(() => {
    const settings = this.settings();
    const settingsMap = this.settingService.settingsMap();
    return {
      settings,
      settingsMap,
      totalSettings: settings.length
    };
  });

  // Computed: Active A/B tests
  readonly activeABTests = computed(() => {
    const flags = this.featureFlags() as any[];
    return flags.filter(f => f.is_enabled && f.target_type === 'ab_test');
  });

  // Computed: Feature usage statistics
  readonly featureUsageStats = computed(() => {
    const flags = this.featureFlags() as any[];
    const enabled = flags.filter(f => f.is_enabled).length;
    const disabled = flags.filter(f => !f.is_enabled).length;
    const abTests = flags.filter(f => f.target_type === 'ab_test').length;

    return {
      total: flags.length,
      enabled,
      disabled,
      abTests,
      enabledPercentage: flags.length > 0 ? (enabled / flags.length) * 100 : 0
    };
  });

  /**
   * Cleanup on destroy
   */
  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // ============================================================================
  // Setting Management
  // ============================================================================

  /**
   * Get setting value
   *
   * @param key Setting key
   * @param defaultValue Default value if not found
   * @returns Setting value
   */
  getSetting<T = any>(key: string, defaultValue?: T): T {
    return this.settingService.getValue<T>(key, defaultValue);
  }

  /**
   * Set setting value
   *
   * @param key Setting key
   * @param value Setting value
   * @returns Promise<Setting>
   */
  async setSetting(key: string, value: any): Promise<Setting> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('set_setting');

    try {
      return await this.settingService.updateByKey(key, value);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '设置系统配置失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'SystemFacade.setSetting'
      });
      console.error('[SystemFacade] Failed to set setting:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Update setting
   *
   * @param settingId Setting ID
   * @param updates Setting update data
   * @returns Promise<Setting>
   */
  async updateSetting(settingId: string, updates: SettingUpdate): Promise<Setting> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('update_setting');

    try {
      return await this.settingService.update(settingId, updates);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新系统配置失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'SystemFacade.updateSetting'
      });
      console.error('[SystemFacade] Failed to update setting:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load all settings
   *
   * @returns Promise<void>
   */
  async loadSettings(): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_settings');

    try {
      await this.settingService.loadAll();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载系统配置失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'SystemFacade.loadSettings'
      });
      console.error('[SystemFacade] Failed to load settings:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load settings by category
   *
   * @param scopeId Scope ID (global, project, user)
   * @returns Promise<void>
   */
  async loadSettingsByCategory(scopeId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_settings_by_category');

    try {
      await this.settingService.loadByScopeId(scopeId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载分类配置失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'SystemFacade.loadSettingsByCategory'
      });
      console.error('[SystemFacade] Failed to load settings by category:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Feature Flag Management
  // ============================================================================

  /**
   * Get feature flag
   *
   * @param flagKey Feature flag key
   * @returns Feature flag or null
   */
  getFeatureFlag(flagKey: string): FeatureFlag | null {
    const flagsMap = this.featureFlagService.flagsMap();
    return flagsMap.get(flagKey) || null;
  }

  /**
   * Set feature flag
   *
   * @param flagKey Feature flag key
   * @param enabled Enabled state
   * @returns Promise<FeatureFlag>
   */
  async setFeatureFlag(flagKey: string, enabled: boolean): Promise<FeatureFlag> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('set_feature_flag');

    try {
      const existingFlag = await this.featureFlagService.getByKey(flagKey);
      if (!existingFlag) {
        throw new Error(`功能开关 ${flagKey} 不存在`);
      }
      return await this.featureFlagService.update(existingFlag.id, { is_enabled: enabled } as any);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '设置功能开关失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'SystemFacade.setFeatureFlag'
      });
      console.error('[SystemFacade] Failed to set feature flag:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Enable feature
   *
   * @param flagKey Feature flag key
   * @returns Promise<FeatureFlag>
   */
  async enableFeature(flagKey: string): Promise<FeatureFlag> {
    return this.setFeatureFlag(flagKey, true);
  }

  /**
   * Disable feature
   *
   * @param flagKey Feature flag key
   * @returns Promise<FeatureFlag>
   */
  async disableFeature(flagKey: string): Promise<FeatureFlag> {
    return this.setFeatureFlag(flagKey, false);
  }

  /**
   * Enable feature for specific users
   *
   * @param flagKey Feature flag key
   * @param userIds User IDs
   * @returns Promise<FeatureFlag>
   */
  async enableFeatureForUsers(flagKey: string, userIds: string[]): Promise<FeatureFlag> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('enable_feature_for_users');

    try {
      const flag = this.getFeatureFlag(flagKey);
      if (!flag) {
        throw new Error(`Feature flag ${flagKey} not found`);
      }

      const flagAny = flag as any;
      const targetAccounts = flagAny.target_accounts || [];
      const updatedTargetAccounts = [...new Set([...targetAccounts, ...userIds])];

      return await this.featureFlagService.update(flag.id, {
        target_type: 'users',
        target_accounts: updatedTargetAccounts,
        is_enabled: true
      } as any);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '为用户启用功能失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'SystemFacade.enableFeatureForUsers'
      });
      console.error('[SystemFacade] Failed to enable feature for users:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Enable feature for specific organizations
   *
   * @param flagKey Feature flag key
   * @param organizationIds Organization IDs
   * @returns Promise<FeatureFlag>
   */
  async enableFeatureForOrganizations(flagKey: string, organizationIds: string[]): Promise<FeatureFlag> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('enable_feature_for_organizations');

    try {
      const flag = this.getFeatureFlag(flagKey);
      if (!flag) {
        throw new Error(`Feature flag ${flagKey} not found`);
      }

      const flagAny = flag as any;
      const targetAccounts = flagAny.target_accounts || [];
      const updatedTargetAccounts = [...new Set([...targetAccounts, ...organizationIds])];

      return await this.featureFlagService.update(flag.id, {
        target_type: 'organizations',
        target_accounts: updatedTargetAccounts,
        is_enabled: true
      } as any);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '为组织启用功能失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'SystemFacade.enableFeatureForOrganizations'
      });
      console.error('[SystemFacade] Failed to enable feature for organizations:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Create A/B test
   *
   * @param data Feature flag insert data with A/B test configuration
   * @returns Promise<FeatureFlag>
   */
  async createABTest(data: FeatureFlagInsert): Promise<FeatureFlag> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_ab_test');

    try {
      const abTestData = {
        ...data,
        target_type: 'ab_test',
        is_enabled: true
      } as any;

      return await this.featureFlagService.create(abTestData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建A/B测试失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'SystemFacade.createABTest'
      });
      console.error('[SystemFacade] Failed to create A/B test:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Update A/B test
   *
   * @param flagId Feature flag ID
   * @param updates Feature flag update data
   * @returns Promise<FeatureFlag>
   */
  async updateABTest(flagId: string, updates: FeatureFlagUpdate): Promise<FeatureFlag> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('update_ab_test');

    try {
      return await this.featureFlagService.update(flagId, updates);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新A/B测试失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'SystemFacade.updateABTest'
      });
      console.error('[SystemFacade] Failed to update A/B test:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Get A/B test results
   *
   * @param flagId Feature flag ID
   * @returns Promise<ABTestResult>
   */
  async getABTestResults(flagId: string): Promise<ABTestResult> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('get_ab_test_results');

    try {
      const flag = this.featureFlagService.flags().find((f: FeatureFlag) => f.id === flagId);
      if (!flag) {
        throw new Error(`A/B test ${flagId} not found`);
      }

      const flagAny = flag as any;
      // Note: This is a simplified implementation
      // In a real scenario, you would query analytics data to get actual results
      return {
        flagId: flag.id,
        flagKey: flagAny.flag_key,
        variant: flagAny.variant || 'control',
        participants: flagAny.target_accounts?.length || 0,
        conversions: 0, // Would come from analytics
        conversionRate: 0 // Would be calculated from analytics
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取A/B测试结果失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'SystemFacade.getABTestResults'
      });
      console.error('[SystemFacade] Failed to get A/B test results:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }
}
