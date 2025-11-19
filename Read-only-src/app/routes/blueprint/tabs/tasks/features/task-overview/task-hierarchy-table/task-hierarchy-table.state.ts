import { computed, signal } from '@angular/core';

export interface TaskHierarchyNode {
  id: string;
  children?: readonly TaskHierarchyNode[] | undefined;
}

export interface TaskHierarchyTableStateOptions<TNode extends TaskHierarchyNode> {
  /**
   * 預設展開的節點 id
   */
  initialExpanded?: readonly string[];
  /**
   * 預設勾選的節點 id
   */
  initialChecked?: readonly string[];
  /**
   * 自訂取得子節點的方法
   */
  getChildren?: (node: TNode) => readonly TNode[] | undefined;
}

const DEFAULT_CHILDREN_RESOLVER = <TNode extends TaskHierarchyNode>(node: TNode): readonly TNode[] =>
  (node.children ?? []) as readonly TNode[];

export class TaskHierarchyTableState<TNode extends TaskHierarchyNode> {
  private readonly getChildren: (node: TNode) => readonly TNode[] | undefined;

  private readonly expandedSetSignal = signal(new Set<string>());
  private readonly checkedSetSignal = signal(new Set<string>());

  readonly expandedIds = computed(() => this.expandedSetSignal());
  readonly checkedIds = computed(() => this.checkedSetSignal());
  readonly checkedSize = computed(() => this.checkedSetSignal().size);

  constructor(options?: TaskHierarchyTableStateOptions<TNode>) {
    this.getChildren = options?.getChildren ?? DEFAULT_CHILDREN_RESOLVER;
    if (options?.initialExpanded?.length) {
      this.expandedSetSignal.set(new Set(options.initialExpanded));
    }
    if (options?.initialChecked?.length) {
      this.checkedSetSignal.set(new Set(options.initialChecked));
    }
  }

  setChecked(id: string, checked: boolean): void {
    const next = new Set(this.checkedSetSignal());
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    this.checkedSetSignal.set(next);
  }

  setAllChecked(nodes: readonly TNode[], checked: boolean): void {
    if (!checked) {
      this.checkedSetSignal.set(new Set());
      return;
    }
    const allIds = this.collectIds(nodes);
    this.checkedSetSignal.set(new Set(allIds));
  }

  setExpanded(id: string, expanded: boolean): void {
    const next = new Set(this.expandedSetSignal());
    if (expanded) {
      next.add(id);
    } else {
      next.delete(id);
    }
    this.expandedSetSignal.set(next);
  }

  expandAll(nodes: readonly TNode[]): void {
    const allIds = this.collectIds(nodes);
    this.expandedSetSignal.set(new Set(allIds));
  }

  collapseAll(): void {
    this.expandedSetSignal.set(new Set());
  }

  isChecked(id: string): boolean {
    return this.checkedSetSignal().has(id);
  }

  isExpanded(id: string): boolean {
    return this.expandedSetSignal().has(id);
  }

  isAllChecked(nodes: readonly TNode[]): boolean {
    const allIds = this.collectIds(nodes);
    if (allIds.length === 0) {
      return false;
    }
    const checked = this.checkedSetSignal();
    return allIds.every(id => checked.has(id));
  }

  isIndeterminate(nodes: readonly TNode[]): boolean {
    const allIds = this.collectIds(nodes);
    if (allIds.length === 0) {
      return false;
    }
    const checked = this.checkedSetSignal();
    const checkedCount = allIds.filter(id => checked.has(id)).length;
    return checkedCount > 0 && checkedCount < allIds.length;
  }

  private collectIds(nodes: readonly TNode[]): string[] {
    const ids: string[] = [];
    const traverse = (items: readonly TNode[] | undefined): void => {
      if (!items?.length) {
        return;
      }
      for (const item of items) {
        ids.push(item.id);
        const children = this.getChildren(item);
        if (children?.length) {
          traverse(children);
        }
      }
    };
    traverse(nodes);
    return ids;
  }
}
