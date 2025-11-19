/**
 * Task Tree Builder Service
 *
 * 任務樹構建器服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：A.3 階層屬性
 *
 * 職責：
 * - 從扁平任務列表構建樹狀結構
 * - 計算並更新任務的路徑、層級、後代數量等屬性
 * - 處理任務的移動與重組操作
 * - 驗證樹結構的完整性與一致性
 *
 * @see @ETMS_DESIGN_SPEC.md A.3 階層屬性
 */

import { Injectable, inject } from '@angular/core';
import type { TaskIdentityComplete, TaskTreeNode } from '@models';
import { TaskIdentityService } from '@tasks/features/task-identity/services/domain/task-identity.service';
import { TaskIdentityRepository } from '@tasks/shared/repository/task-identity.repository';

/**
 * 樹構建選項
 */
export interface TreeBuildOptions {
  /** 是否包含已歸檔的任務 */
  includeArchived?: boolean;
  /** 是否只包含根節點 */
  rootOnly?: boolean;
  /** 排序欄位 */
  sortBy?: 'code' | 'sortOrder' | 'name';
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class TaskTreeBuilderService {
  private readonly identityService = inject(TaskIdentityService);
  private readonly identityRepository = inject(TaskIdentityRepository);

  /**
   * 從數據庫載入任務並構建樹形結構
   *
   * @param blueprintId 藍圖 ID
   * @param options 構建選項
   * @returns 任務樹（根節點陣列）
   */
  async buildTree(blueprintId: string, options: TreeBuildOptions = {}): Promise<TaskTreeNode[]> {
    if (!blueprintId) {
      throw new Error('Blueprint ID is required');
    }

    const { includeArchived = false, rootOnly = false, sortBy = 'sortOrder', sortOrder = 'asc' } = options;

    // 從數據庫載入所有任務
    const allTasks = await this.loadTasks(blueprintId, includeArchived);

    if (allTasks.length === 0) {
      return [];
    }

    // 構建任務映射表（以 ID 為鍵）
    const taskMap = new Map<string, TaskTreeNode>();

    // 初始化所有節點
    for (const task of allTasks) {
      taskMap.set(task.id, {
        ...task,
        children: []
      });
    }

    // 構建樹形結構
    const rootNodes: TaskTreeNode[] = [];

    for (const task of allTasks) {
      const node = taskMap.get(task.id)!;

      if (task.parentId) {
        // 有父節點，加入父節點的子節點陣列
        const parent = taskMap.get(task.parentId);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(node);
        } else {
          // 父節點不存在（可能是資料不一致），作為根節點處理
          console.warn(`Task ${task.id} has parent ${task.parentId} but parent not found. Treating as root.`);
          rootNodes.push(node);
        }
      } else {
        // 根節點
        rootNodes.push(node);
      }
    }

    // 排序子節點
    const sortChildren = (node: TaskTreeNode) => {
      if (node.children && node.children.length > 0) {
        node.children.sort((a, b) => this.compareTasks(a, b, sortBy, sortOrder));
        node.children.forEach(sortChildren);
      }
    };

    // 排序根節點
    rootNodes.sort((a, b) => this.compareTasks(a, b, sortBy, sortOrder));

    // 遞迴排序所有子節點
    rootNodes.forEach(sortChildren);

    // 如果只需要根節點，返回根節點陣列（但不包含子節點）
    if (rootOnly) {
      return rootNodes.map(node => ({
        ...node,
        children: undefined
      }));
    }

    return rootNodes;
  }

  /**
   * 從數據庫載入任務列表
   *
   * @param blueprintId 藍圖 ID
   * @param includeArchived 是否包含已歸檔的任務
   * @returns 任務列表
   */
  private async loadTasks(blueprintId: string, includeArchived: boolean): Promise<TaskIdentityComplete[]> {
    const records = await this.identityRepository.listByBlueprint(blueprintId, {
      includeArchived
    });

    if (records.length === 0) {
      return [];
    }

    return records.map(task => this.identityService.convertFromDb(task));
  }

  /**
   * 比較兩個任務以進行排序
   *
   * @param a 任務 A
   * @param b 任務 B
   * @param sortBy 排序欄位
   * @param sortOrder 排序方向
   * @returns 比較結果
   */
  private compareTasks(a: TaskTreeNode, b: TaskTreeNode, sortBy: 'code' | 'sortOrder' | 'name', sortOrder: 'asc' | 'desc'): number {
    let comparison: number;

    switch (sortBy) {
      case 'code':
        comparison = this.compareByCode(a, b);
        break;
      case 'sortOrder':
        comparison = (a.sortOrder || 0) - (b.sortOrder || 0);
        if (comparison === 0) {
          comparison = this.compareByCode(a, b);
        }
        break;
      case 'name':
        comparison = (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
        if (comparison === 0) {
          comparison = this.compareByCode(a, b);
        }
        break;
      default:
        comparison = this.compareByCode(a, b);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  }

  private compareByCode(a: Pick<TaskTreeNode, 'code'>, b: Pick<TaskTreeNode, 'code'>): number {
    return (a.code || '').localeCompare(b.code || '', undefined, { numeric: true, sensitivity: 'base' });
  }

  /**
   * 扁平化樹形結構為列表
   *
   * @param tree 任務樹
   * @returns 扁平化的任務列表
   */
  flattenTree(tree: TaskTreeNode[]): TaskIdentityComplete[] {
    const result: TaskIdentityComplete[] = [];

    const flatten = (nodes: TaskTreeNode[]) => {
      for (const node of nodes) {
        // 移除 children 屬性，只保留任務本身
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { children, ...task } = node;
        result.push(task);

        if (node.children && node.children.length > 0) {
          flatten(node.children);
        }
      }
    };

    flatten(tree);
    return result;
  }

  /**
   * 查找節點（深度優先搜尋）
   *
   * @param tree 任務樹
   * @param predicate 搜尋條件
   * @returns 找到的節點或 null
   */
  findNode(tree: TaskTreeNode[], predicate: (node: TaskTreeNode) => boolean): TaskTreeNode | null {
    for (const node of tree) {
      if (predicate(node)) {
        return node;
      }

      if (node.children && node.children.length > 0) {
        const found = this.findNode(node.children, predicate);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  /**
   * 獲取節點的所有後代節點
   *
   * @param node 節點
   * @returns 後代節點陣列
   */
  getDescendants(node: TaskTreeNode): TaskTreeNode[] {
    const descendants: TaskTreeNode[] = [];

    const collectDescendants = (n: TaskTreeNode) => {
      if (n.children && n.children.length > 0) {
        for (const child of n.children) {
          descendants.push(child);
          collectDescendants(child);
        }
      }
    };

    collectDescendants(node);
    return descendants;
  }

  /**
   * 驗證樹結構完整性
   *
   * @param tree 任務樹
   * @returns 驗證結果
   */
  validateTree(tree: TaskTreeNode[]): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const visitedIds = new Set<string>();

    const validateNode = (node: TaskTreeNode, parentId: string | null = null) => {
      // 檢查 ID 是否重複
      if (visitedIds.has(node.id)) {
        errors.push(`Duplicate task ID: ${node.id}`);
      } else {
        visitedIds.add(node.id);
      }

      // 檢查父節點 ID 是否一致
      if (node.parentId !== parentId) {
        errors.push(`Task ${node.id} has inconsistent parentId: expected ${parentId}, got ${node.parentId}`);
      }

      // 檢查編碼格式
      if (!node.code || !/^\d+(\.\d+)*$/.test(node.code)) {
        warnings.push(`Task ${node.id} has invalid code format: ${node.code}`);
      }

      // 檢查層級是否正確
      const expectedLevel = parentId ? node.level || 1 : 1;
      if (node.level !== expectedLevel) {
        warnings.push(`Task ${node.id} has incorrect level: expected ${expectedLevel}, got ${node.level}`);
      }

      // 遞迴檢查子節點
      if (node.children && node.children.length > 0) {
        // 檢查 childrenCount 是否一致
        if (node.childrenCount !== node.children.length) {
          warnings.push(`Task ${node.id} childrenCount mismatch: expected ${node.children.length}, got ${node.childrenCount}`);
        }

        for (const child of node.children) {
          validateNode(child, node.id);
        }
      } else {
        // 葉節點應該標記為 isLeaf
        if (!node.isLeaf) {
          warnings.push(`Task ${node.id} should be marked as leaf node`);
        }
      }
    };

    for (const rootNode of tree) {
      validateNode(rootNode, null);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
