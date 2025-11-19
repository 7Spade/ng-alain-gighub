/**
 * 上下文菜單配置
 *
 * 定義不同上下文類型的預設菜單結構
 * 實際菜單資料會從 assets/tmp/*.json 動態載入
 */

import { NzSafeAny } from 'ng-zorro-antd/core/types';

/**
 * 個人菜單配置
 * 載入自 assets/tmp/user-data.json
 */
export const PERSONAL_MENUS: NzSafeAny[] = [];

/**
 * 組織菜單配置
 * 載入自 assets/tmp/organization-data.json
 */
export const ORG_MENUS: NzSafeAny[] = [];

/**
 * 團隊菜單配置
 * 載入自 assets/tmp/team-data.json
 */
export const TEAM_MENUS: NzSafeAny[] = [];
