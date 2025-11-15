/**
 * Task Tree Model
 *
 * 任務樹狀結構模型
 * 對應 @ETMS_DESIGN_SPEC.md 文件：A.3 階層屬性
 *
 * 統一定義任務樹節點接口，用於樹狀結構展示和操作
 *
 * 類型定義遵循 ng-zorro-antd tree-view 組件的官方模式：
 * - TaskTreeNode: 嵌套節點類型 (T)，包含 children 屬性
 * - TaskFlatNode: 扁平節點類型 (F)，包含 level 和 expandable 屬性
 *
 * @see @ETMS_DESIGN_SPEC.md A.3 階層屬性
 * @see https://ng.ant.design/components/tree-view/zh
 */

import type { TaskIdentityComplete } from '../identity/task-identity.model';

/**
 * 任務樹節點（嵌套節點類型）
 *
 * 擴展 TaskIdentityComplete，添加子節點和展開狀態
 * 符合 ng-zorro-antd tree-view 組件的嵌套節點類型要求
 *
 * @template T = TaskTreeNode 嵌套節點類型
 */
export interface TaskTreeNode extends TaskIdentityComplete {
  /** 子任務節點陣列（符合官方 tree-view 組件的 children 屬性要求） */
  children?: TaskTreeNode[];

  /** 是否展開（用於 UI 狀態管理，可選） */
  isExpanded?: boolean;

  /** 節點是否禁用（符合官方 tree-view 組件的 disabled 屬性要求） */
  disabled?: boolean;
}

/**
 * 任務扁平節點（扁平節點類型）
 *
 * 符合 ng-zorro-antd tree-view 組件的扁平節點類型要求：
 * - expandable: 節點是否可展開（必需）
 * - level: 節點層級（必需）
 * - name: 節點名稱（符合官方模式）
 * - key: 節點唯一標識（官方使用 key，我們使用 id）
 * - disabled: 節點是否禁用（可選）
 *
 * 同時包含業務屬性：
 * - id: 任務 ID（業務唯一標識）
 * - code: 任務編碼（如 "10.1.2"）
 *
 * @template F = TaskFlatNode 扁平節點類型
 */
export interface TaskFlatNode {
  /** 節點是否可展開（符合官方 tree-view 組件的 expandable 屬性要求） */
  expandable: boolean;

  /** 節點層級（符合官方 tree-view 組件的 level 屬性要求） */
  level: number;

  /** 節點名稱（符合官方 tree-view 組件的 name 屬性要求） */
  name: string;

  /** 節點唯一標識（官方使用 key，我們使用 id 作為 key） */
  key: string;

  /** 節點是否禁用（符合官方 tree-view 組件的 disabled 屬性要求） */
  disabled?: boolean;

  /** 任務 ID（業務唯一標識，等同於 key） */
  id: string;

  /** 任務編碼（如 "10.1.2"） */
  code: string;
}
