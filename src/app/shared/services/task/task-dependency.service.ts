import { Injectable, computed, inject, signal } from '@angular/core';
import { TaskDependencyInsert, TaskDependencyRepository, TaskDependencyType, TaskDependencyUpdate } from '@core';
import { TaskDependency } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * 依赖图节点
 */
export interface DependencyNode {
  taskId: string;
  dependencies: string[];
  dependents: string[];
}

/**
 * 依赖图
 */
export interface DependencyGraph {
  nodes: Map<string, DependencyNode>;
  edges: Array<{ from: string; to: string; type: TaskDependencyType; lagDays: number }>;
}

/**
 * 依赖树节点
 */
export interface DependencyTreeNode {
  taskId: string;
  dependency: TaskDependency;
  children: DependencyTreeNode[];
}

/**
 * TaskDependency Service
 *
 * 提供任务依赖关系相关的业务逻辑和状态管理
 * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 *
 * 支持功能：
 * - 任务依赖 CRUD 操作
 * - 循环依赖检测
 * - 依赖关系可视化
 * - 依赖解析和执行顺序计算
 *
 * @example
 * ```typescript
 * const dependencyService = inject(TaskDependencyService);
 *
 * // 加载任务依赖
 * await dependencyService.loadDependenciesByTask('task-id');
 *
 * // 检查循环依赖
 * const hasCycle = await dependencyService.checkCircularDependency('task-id', 'depends-on-task-id');
 *
 * // 获取依赖图
 * const graph = await dependencyService.getDependencyGraph('blueprint-id');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TaskDependencyService {
  private dependencyRepository = inject(TaskDependencyRepository);

  // 使用 Signals 管理状态
  private dependenciesState = signal<TaskDependency[]>([]);
  private dependencyGraphState = signal<DependencyGraph | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给组件
  readonly dependencies = this.dependenciesState.asReadonly();
  readonly dependencyGraph = this.dependencyGraphState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly circularDependencies = computed(() => {
    const deps = this.dependencies();
    const graph = this.buildGraph(deps);
    return this.detectCycles(graph);
  });

  readonly unresolvedDependencies = computed(() => {
    const deps = this.dependencies();
    // 检查是否有依赖的任务不存在（需要结合任务列表检查）
    return deps.filter(dep => {
      // 这里需要结合任务列表来检查，暂时返回空数组
      // 实际实现中需要注入 TaskService 来检查任务是否存在
      return false;
    });
  });

  /**
   * 加载所有依赖关系
   */
  async loadAllDependencies(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.dependencyRepository.findAll());
      this.dependenciesState.set(data);
      this.dependencyGraphState.set(this.buildGraph(data));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载依赖关系失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 加载任务的依赖（该任务依赖的其他任务）
   *
   * @param taskId 任务 ID
   */
  async loadDependencies(taskId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.dependencyRepository.findByTaskId(taskId));
      this.dependenciesState.set(data);
      this.dependencyGraphState.set(this.buildGraph(data));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载任务依赖失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 加载任务的依赖项（依赖该任务的其他任务）
   *
   * @param taskId 任务 ID
   */
  async loadDependents(taskId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.dependencyRepository.findByDependsOnTaskId(taskId));
      this.dependenciesState.set(data);
      this.dependencyGraphState.set(this.buildGraph(data));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载任务依赖项失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据任务 ID 加载所有相关依赖关系（包括依赖和依赖项）
   *
   * @param taskId 任务 ID
   */
  async loadDependenciesByTask(taskId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const [dependencies, dependents] = await Promise.all([
        firstValueFrom(this.dependencyRepository.findByTaskId(taskId)),
        firstValueFrom(this.dependencyRepository.findByDependsOnTaskId(taskId))
      ]);

      const allDeps = [...dependencies, ...dependents];
      this.dependenciesState.set(allDeps);
      this.dependencyGraphState.set(this.buildGraph(allDeps));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载任务依赖关系失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 创建依赖关系
   *
   * @param dependency 依赖关系数据
   * @returns 创建的依赖关系
   */
  async createDependency(dependency: TaskDependencyInsert): Promise<TaskDependency> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 检查循环依赖
      const hasCycle = await this.checkCircularDependency(dependency.task_id, dependency.depends_on_task_id);
      if (hasCycle) {
        throw new Error('创建依赖关系会导致循环依赖');
      }

      const created = await firstValueFrom(this.dependencyRepository.create(dependency));
      this.dependenciesState.update(deps => [...deps, created]);
      this.dependencyGraphState.set(this.buildGraph([...this.dependencies(), created]));
      return created;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '创建依赖关系失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新依赖关系
   *
   * @param dependencyId 依赖关系 ID
   * @param updates 更新数据
   * @returns 更新后的依赖关系
   */
  async updateDependency(dependencyId: string, updates: TaskDependencyUpdate): Promise<TaskDependency> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 如果更新了任务 ID 或依赖任务 ID，需要检查循环依赖
      if (updates.task_id || updates.depends_on_task_id) {
        const currentDep = this.dependencies().find(d => d.id === dependencyId);
        if (currentDep) {
          const taskId = updates.task_id || (currentDep as any).task_id;
          const dependsOnTaskId = updates.depends_on_task_id || (currentDep as any).depends_on_task_id;
          const hasCycle = await this.checkCircularDependency(taskId, dependsOnTaskId);
          if (hasCycle) {
            throw new Error('更新依赖关系会导致循环依赖');
          }
        }
      }

      const updated = await firstValueFrom(this.dependencyRepository.update(dependencyId, updates));
      this.dependenciesState.update(deps => deps.map(d => (d.id === dependencyId ? updated : d)));
      this.dependencyGraphState.set(this.buildGraph(this.dependencies()));
      return updated;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新依赖关系失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 删除依赖关系
   *
   * @param dependencyId 依赖关系 ID
   */
  async deleteDependency(dependencyId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.dependencyRepository.delete(dependencyId));
      this.dependenciesState.update(deps => deps.filter(d => d.id !== dependencyId));
      this.dependencyGraphState.set(this.buildGraph(this.dependencies()));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '删除依赖关系失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 检查循环依赖
   *
   * @param taskId 任务 ID
   * @param dependsOnTaskId 依赖的任务 ID
   * @returns 是否存在循环依赖
   */
  async checkCircularDependency(taskId: string, dependsOnTaskId: string): Promise<boolean> {
    // 检查自依赖
    if (taskId === dependsOnTaskId) {
      return true;
    }

    // 构建当前依赖图
    const currentDeps = this.dependencies();
    const graph = this.buildGraph(currentDeps);

    // 检查从 dependsOnTaskId 到 taskId 是否存在路径（DFS）
    const visited = new Set<string>();
    const hasPath = this.dfsCheckPath(graph, dependsOnTaskId, taskId, visited);

    return hasPath;
  }

  /**
   * 验证依赖关系
   *
   * @param dependency 依赖关系数据
   * @returns 验证结果
   */
  async validateDependency(dependency: TaskDependencyInsert): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    // 检查自依赖
    if (dependency.task_id === dependency.depends_on_task_id) {
      errors.push('任务不能依赖自己');
    }

    // 检查循环依赖
    const hasCycle = await this.checkCircularDependency(dependency.task_id, dependency.depends_on_task_id);
    if (hasCycle) {
      errors.push('创建此依赖关系会导致循环依赖');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 获取依赖图
   *
   * @param blueprintId 蓝图 ID（可选，用于过滤特定蓝图的任务依赖）
   * @returns 依赖图
   */
  async getDependencyGraph(blueprintId?: string): Promise<DependencyGraph> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 如果提供了蓝图 ID，需要加载该蓝图的所有任务依赖
      // 这里假设可以通过任务 ID 前缀或其他方式过滤
      // 实际实现中可能需要注入 TaskService 来获取蓝图的任务列表
      const deps = blueprintId ? this.dependencies() : await this.loadAllDependencies().then(() => this.dependencies());
      const graph = this.buildGraph(deps);
      this.dependencyGraphState.set(graph);
      return graph;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '获取依赖图失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 获取依赖树
   *
   * @param taskId 任务 ID
   * @returns 依赖树
   */
  async getDependencyTree(taskId: string): Promise<DependencyTreeNode | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await this.loadDependenciesByTask(taskId);
      const deps = this.dependencies();
      const rootDep = deps.find(d => (d as any).task_id === taskId);
      if (!rootDep) {
        return null;
      }

      const buildTree = (dep: TaskDependency): DependencyTreeNode => {
        const children = deps.filter(d => (d as any).task_id === (dep as any).depends_on_task_id).map(buildTree);

        return {
          taskId: (dep as any).task_id,
          dependency: dep,
          children
        };
      };

      return buildTree(rootDep);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '获取依赖树失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 解析依赖关系，获取执行顺序
   *
   * @param taskIds 任务 ID 列表
   * @returns 按执行顺序排列的任务 ID 列表
   */
  async resolveDependencies(taskIds: string[]): Promise<string[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 加载所有相关依赖
      const allDeps: TaskDependency[] = [];
      for (const taskId of taskIds) {
        const deps = await firstValueFrom(this.dependencyRepository.findByTaskId(taskId));
        allDeps.push(...deps);
      }

      const graph = this.buildGraph(allDeps);

      // 拓扑排序
      return this.topologicalSort(graph, taskIds);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '解析依赖关系失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 获取执行顺序
   *
   * @param taskIds 任务 ID 列表
   * @returns 按执行顺序排列的任务 ID 列表
   */
  async getExecutionOrder(taskIds: string[]): Promise<string[]> {
    return this.resolveDependencies(taskIds);
  }

  // ============================================================================
  // 私有辅助方法
  // ============================================================================

  /**
   * 构建依赖图
   */
  private buildGraph(dependencies: TaskDependency[]): DependencyGraph {
    const nodes = new Map<string, DependencyNode>();
    const edges: Array<{ from: string; to: string; type: TaskDependencyType; lagDays: number }> = [];

    for (const dep of dependencies) {
      const depAny = dep as any;
      const taskId = depAny.task_id;
      const dependsOnTaskId = depAny.depends_on_task_id;
      const dependencyType = depAny.dependency_type || 'finish_to_start';
      const lagDays = depAny.lag_days || 0;

      // 创建或更新节点
      if (!nodes.has(taskId)) {
        nodes.set(taskId, {
          taskId,
          dependencies: [],
          dependents: []
        });
      }
      if (!nodes.has(dependsOnTaskId)) {
        nodes.set(dependsOnTaskId, {
          taskId: dependsOnTaskId,
          dependencies: [],
          dependents: []
        });
      }

      // 添加边
      const taskNode = nodes.get(taskId)!;
      const dependsOnNode = nodes.get(dependsOnTaskId)!;

      taskNode.dependencies.push(dependsOnTaskId);
      dependsOnNode.dependents.push(taskId);

      edges.push({
        from: taskId,
        to: dependsOnTaskId,
        type: dependencyType,
        lagDays
      });
    }

    return { nodes, edges };
  }

  /**
   * 检测循环依赖（DFS）
   */
  private detectCycles(graph: DependencyGraph): TaskDependency[] {
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const cycles: TaskDependency[] = [];

    const dfs = (taskId: string): boolean => {
      if (recStack.has(taskId)) {
        return true; // 发现循环
      }
      if (visited.has(taskId)) {
        return false;
      }

      visited.add(taskId);
      recStack.add(taskId);

      const node = graph.nodes.get(taskId);
      if (node) {
        for (const depId of node.dependencies) {
          if (dfs(depId)) {
            return true;
          }
        }
      }

      recStack.delete(taskId);
      return false;
    };

    for (const taskId of graph.nodes.keys()) {
      if (!visited.has(taskId) && dfs(taskId)) {
        // 找到循环，但这里简化处理，实际应该返回具体的循环路径
        cycles.push(...this.dependencies().filter(d => (d as any).task_id === taskId));
      }
    }

    return cycles;
  }

  /**
   * DFS 检查路径
   */
  private dfsCheckPath(graph: DependencyGraph, start: string, target: string, visited: Set<string>): boolean {
    if (start === target) {
      return true;
    }

    visited.add(start);
    const node = graph.nodes.get(start);
    if (node) {
      for (const depId of node.dependencies) {
        if (!visited.has(depId) && this.dfsCheckPath(graph, depId, target, visited)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 拓扑排序
   */
  private topologicalSort(graph: DependencyGraph, taskIds: string[]): string[] {
    const inDegree = new Map<string, number>();
    const queue: string[] = [];
    const result: string[] = [];

    // 初始化入度
    for (const taskId of taskIds) {
      const node = graph.nodes.get(taskId);
      const degree = node ? node.dependencies.filter(d => taskIds.includes(d)).length : 0;
      inDegree.set(taskId, degree);
      if (degree === 0) {
        queue.push(taskId);
      }
    }

    // 拓扑排序
    while (queue.length > 0) {
      const taskId = queue.shift()!;
      result.push(taskId);

      const node = graph.nodes.get(taskId);
      if (node) {
        for (const dependentId of node.dependents) {
          if (taskIds.includes(dependentId)) {
            const degree = (inDegree.get(dependentId) || 0) - 1;
            inDegree.set(dependentId, degree);
            if (degree === 0) {
              queue.push(dependentId);
            }
          }
        }
      }
    }

    // 如果结果数量不等于任务数量，说明存在循环
    if (result.length !== taskIds.length) {
      throw new Error('存在循环依赖，无法确定执行顺序');
    }

    return result;
  }
}
