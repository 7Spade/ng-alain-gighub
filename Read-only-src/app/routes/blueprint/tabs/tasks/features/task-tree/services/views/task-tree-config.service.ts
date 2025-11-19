/**
 * Task Tree Config Service
 *
 * 任務樹狀配置服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：A.3 階層屬性
 *
 * 職責：
 * - 統一管理所有 TreeView 相關配置
 * - 提供 transformer、treeControl、treeFlattener、dataSource 工廠方法
 * - 提供可配置的選項接口
 * - 確保配置的一致性和可重用性
 *
 * @see @ETMS_DESIGN_SPEC.md A.3 階層屬性
 * @see https://ng.ant.design/components/tree-view/zh
 */

import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import type { TaskTreeNode, TaskFlatNode } from '@models';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';

/**
 * 樹狀配置選項
 */
export interface TreeConfigOptions {
  /** 是否禁用節點（預設：false） */
  disabled?: boolean | ((node: TaskTreeNode) => boolean);
  /** 自定義節點轉換器（可選） */
  transformer?: (node: TaskTreeNode, level: number) => TaskFlatNode;
}

@Injectable({
  providedIn: 'root'
})
export class TaskTreeConfigService {
  /**
   * 預設節點轉換器
   * 將嵌套節點轉換為扁平節點
   *
   * @param node 嵌套節點
   * @param level 節點層級
   * @param options 配置選項
   * @returns 扁平節點
   */
  createTransformer(options: TreeConfigOptions = {}): (node: TaskTreeNode, level: number) => TaskFlatNode {
    const customTransformer = options.transformer;
    const disabled = options.disabled;

    return (node: TaskTreeNode, level: number): TaskFlatNode => {
      // 如果提供了自定義轉換器，使用自定義轉換器
      if (customTransformer) {
        return customTransformer(node, level);
      }

      // 計算 disabled 狀態
      let isDisabled = false;
      if (typeof disabled === 'function') {
        isDisabled = disabled(node);
      } else if (typeof disabled === 'boolean') {
        isDisabled = disabled;
      }

      // 預設轉換器
      return {
        expandable: !!(node.children && node.children.length > 0),
        level,
        name: node.name,
        key: node.id, // 官方使用 key 作為唯一標識，我們使用 id
        disabled: isDisabled,
        id: node.id,
        code: node.code
      };
    };
  }

  /**
   * 創建 TreeControl 實例
   *
   * @returns FlatTreeControl 實例
   */
  createTreeControl(): FlatTreeControl<TaskFlatNode> {
    return new FlatTreeControl<TaskFlatNode>(
      node => node.level,
      node => node.expandable
    );
  }

  /**
   * 創建 TreeFlattener 實例
   *
   * @param transformer 節點轉換器
   * @returns NzTreeFlattener 實例
   */
  createTreeFlattener(
    transformer: (node: TaskTreeNode, level: number) => TaskFlatNode
  ): NzTreeFlattener<TaskTreeNode, TaskFlatNode, TaskFlatNode> {
    return new NzTreeFlattener<TaskTreeNode, TaskFlatNode, TaskFlatNode>(
      transformer,
      node => node.level,
      node => node.expandable,
      node => node.children || []
    );
  }

  /**
   * 創建 DataSource 實例
   *
   * @param treeControl TreeControl 實例
   * @param treeFlattener TreeFlattener 實例
   * @returns NzTreeFlatDataSource 實例
   */
  createDataSource(
    treeControl: FlatTreeControl<TaskFlatNode>,
    treeFlattener: NzTreeFlattener<TaskTreeNode, TaskFlatNode, TaskFlatNode>
  ): NzTreeFlatDataSource<TaskTreeNode, TaskFlatNode, TaskFlatNode> {
    return new NzTreeFlatDataSource<TaskTreeNode, TaskFlatNode, TaskFlatNode>(treeControl, treeFlattener);
  }

  /**
   * 創建完整的樹狀配置（一次性創建所有配置）
   *
   * @param options 配置選項
   * @returns 完整的樹狀配置物件
   */
  createTreeConfig(options: TreeConfigOptions = {}): {
    treeControl: FlatTreeControl<TaskFlatNode>;
    treeFlattener: NzTreeFlattener<TaskTreeNode, TaskFlatNode, TaskFlatNode>;
    dataSource: NzTreeFlatDataSource<TaskTreeNode, TaskFlatNode, TaskFlatNode>;
    transformer: (node: TaskTreeNode, level: number) => TaskFlatNode;
    hasChild: (_: number, node: TaskFlatNode) => boolean;
  } {
    const transformer = this.createTransformer(options);
    const treeControl = this.createTreeControl();
    const treeFlattener = this.createTreeFlattener(transformer);
    const dataSource = this.createDataSource(treeControl, treeFlattener);

    // hasChild 判斷函數
    const hasChild = (_: number, node: TaskFlatNode) => node.expandable;

    return {
      treeControl,
      treeFlattener,
      dataSource,
      transformer,
      hasChild
    };
  }
}
