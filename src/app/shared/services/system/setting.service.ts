import { Injectable, inject, signal, computed } from '@angular/core';
import { SettingRepository } from '@core';
import { Setting, SettingInsert, SettingUpdate } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Setting Service
 *
 * 提供系統設定相關的業務邏輯和狀態管理
 * 使用 Signals 管理狀態，暴露 ReadonlySignal 給組件
 *
 * 支援三種層級的設定：
 * - global: 全域設定
 * - project: 專案設定
 * - user: 使用者偏好設定
 *
 * @example
 * ```typescript
 * const settingService = inject(SettingService);
 *
 * // 載入全域設定
 * await settingService.loadGlobalSettings();
 *
 * // 訂閱設定狀態
 * effect(() => {
 *   console.log('Settings:', settingService.settings());
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private settingRepository = inject(SettingRepository);

  // 使用 Signals 管理狀態
  private settingsState = signal<Setting[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly settings = this.settingsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals - 按層級分類
  readonly globalSettings = computed(() => this.settings().filter(s => s.scope === 'global'));

  readonly projectSettings = computed(() => this.settings().filter(s => s.scope === 'project'));

  readonly userSettings = computed(() => this.settings().filter(s => s.scope === 'user'));

  // Settings cache map for quick lookup
  readonly settingsMap = computed(() => {
    const map = new Map<string, Setting>();
    this.settings().forEach(setting => {
      map.set(setting.key, setting);
    });
    return map;
  });

  /**
   * 載入所有設定
   */
  async loadAll(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.settingRepository.findAll());
      this.settingsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入設定失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入全域設定
   */
  async loadGlobalSettings(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.settingRepository.findByScope('global'));
      this.settingsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入全域設定失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入專案設定
   */
  async loadProjectSettings(projectId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.settingRepository.findByProject(projectId));
      this.settingsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入專案設定失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入使用者偏好設定
   */
  async loadUserPreferences(userId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.settingRepository.findByUser(userId));
      this.settingsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入使用者設定失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根據 key 取得設定值
   */
  getValue<T = any>(key: string, defaultValue?: T): T {
    const setting = this.settingsMap().get(key);
    if (!setting) {
      return defaultValue as T;
    }
    return (setting.value as T) || (defaultValue as T);
  }

  /**
   * 根據 key 取得設定
   */
  async getByKey(key: string): Promise<Setting | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const setting = await firstValueFrom(this.settingRepository.findByKey(key));
      return setting;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入設定失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 創建新設定
   */
  async create(data: SettingInsert): Promise<Setting> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const setting = await firstValueFrom(this.settingRepository.create(data));

      // 更新本地狀態
      this.settingsState.update(current => [...current, setting]);

      return setting;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '創建設定失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新設定
   */
  async update(id: string, data: SettingUpdate): Promise<Setting> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updated = await firstValueFrom(this.settingRepository.update(id, data));

      // 更新本地狀態
      this.settingsState.update(current => current.map(s => (s.id === id ? updated : s)));

      return updated;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新設定失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根據 key 更新設定值
   */
  async updateByKey(key: string, value: any): Promise<Setting> {
    const setting = await this.getByKey(key);
    if (!setting) {
      throw new Error(`設定 ${key} 不存在`);
    }

    return this.update(setting.id, { value });
  }

  /**
   * 刪除設定
   */
  async delete(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.settingRepository.delete(id));

      // 更新本地狀態
      this.settingsState.update(current => current.filter(s => s.id !== id));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '刪除設定失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 批量更新設定
   */
  async updateBatch(updates: Array<{ key: string; value: any }>): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await Promise.all(updates.map(({ key, value }) => this.updateByKey(key, value)));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '批量更新設定失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 清空本地狀態
   */
  clear(): void {
    this.settingsState.set([]);
    this.errorState.set(null);
  }
}
