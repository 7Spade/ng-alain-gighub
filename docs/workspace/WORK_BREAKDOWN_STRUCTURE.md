# Workspace 系统工作分解结构 (WBS)

> **文档版本**: v1.0  
> **创建日期**: 2025-11-21  
> **文档类型**: 项目管理工具  
> **目的**: 可视化工作分解结构，便于任务分配和进度跟踪

---

## 📊 总览仪表板

### 项目统计

```
总工作包: 7个阶段
总工作项: 191项
  ├─ 页面重新设计: 86个
  ├─ 额外工作项: 47个  
  ├─ 五层架构增强: 48个模块
  └─ Facades增强: 10个

总工时估算: 20-43周
建议团队规模: 7-9人
目标测试覆盖率: >80%
```

### 优先级分布

| 优先级 | 工作项 | 占比 | 工时 |
|--------|--------|------|------|
| P0 高优先级 | 68项 | 35.6% | 12-15周 |
| P1 中优先级 | 75项 | 39.3% | 8-12周 |
| P2 低优先级 | 48项 | 25.1% | 4-6周 |

---

## 🗂️ 工作分解结构

### Level 1: 项目目标
```
Workspace Context Manager 系统生产就绪
```

### Level 2: 七大阶段（Work Packages）

```
1.0 Phase 1: 基础设施强化 (2周)
2.0 Phase 2: 数据访问层完善 (1.5周)
3.0 Phase 3: 业务逻辑层增强 (2周)
4.0 Phase 4: 门面层重构 (4-6周)
5.0 Phase 5: 页面重新设计 (6-8周)
6.0 Phase 6: 功能模块补充 (2周)
7.0 Phase 7: 质量保障与文档 (2-3周)
```

---

## 📋 详细工作分解

### 1.0 Phase 1: 基础设施强化

#### 1.1 测试基础设施
```
1.1.1 Workspace Context核心服务测试 [P0, 3天, 测试工程师]
  └─ 覆盖率目标: >80%
  
1.1.2 已整合页面测试补充 [P0, 2天, 测试工程师]
  ├─ task-board.component.spec.ts
  ├─ task-todo.component.spec.ts
  ├─ task-assignments.component.spec.ts
  └─ org.component.spec.ts
  
1.1.3 测试工具与辅助函数 [P1, 2天, 测试工程师]
  ├─ Mock工厂
  ├─ 测试数据生成器
  └─ 测试工具类
```

#### 1.2 Types层增强
```
1.2.1 补充10个枚举定义 [P1, 2天, 前端开发]
  ├─ Quality Types: InspectionStatus, InspectionType
  ├─ Document Types: DocumentUploadSource
  ├─ Bot Types: BotType
  └─ 其他枚举
  
1.2.2 统一3处重复定义 [P1, 1天, 前端开发]
  ├─ IssueStatus (Service层 vs Types层)
  ├─ TaskStatus (Service层 vs Types层)
  └─ DocumentStatus (Service层 vs Types层)
```

#### 1.3 安全性加固
```
1.3.1 RLS策略完整性审查 [P0, 3天, 后端工程师]
  ├─ 审查51张表的RLS策略
  ├─ 识别安全漏洞
  └─ 生成审查报告
  
1.3.2 上下文权限验证 [P0, 2天, 后端工程师]
  ├─ 前端权限验证
  ├─ 后端RLS策略
  └─ 双重验证机制
```

**Phase 1 交付物**:
- ✅ 测试覆盖率 >80%
- ✅ Types层完整
- ✅ RLS审查报告

---

### 2.0 Phase 2: 数据访问层完善

#### 2.1 Repositories层增强
```
2.1.1 P0 Repositories搜索方法 [P0, 3天, 前端开发×2]
  ├─ TaskRepository.search()
  ├─ IssueRepository.search()
  ├─ DocumentRepository.search()
  └─ DocumentRepository.findByBlueprintId()
  
2.1.2 P1 Repositories搜索方法 [P0, 2天, 前端开发]
  ├─ QualityCheckRepository.search()
  ├─ InspectionRepository.search()
  └─ CommentRepository.search()
  
2.1.3 P2 Repositories方法补充 [P1, 2天, 前端开发]
  ├─ BotRepository.findByType()
  └─ OrganizationCollaborationRepository.findByStatus()
  
2.1.4 Repository单元测试 [P0, 3天, 测试工程师]
```

#### 2.2 Models层增强
```
2.2.1 8个模块枚举重新导出 [P1, 2天, 前端开发]
  ├─ Issue Models
  ├─ Bot Models
  ├─ Communication Models
  ├─ Collaboration Models
  ├─ System Models
  ├─ Explore Models
  ├─ Analytics Models
  └─ Account Models
  
2.2.2 4个扩展接口移动 [P1, 1天, 前端开发]
  ├─ IssueDetail (从Service移到Models)
  ├─ TaskDetail (从Service移到Models)
  ├─ InspectionDetail (从Service移到Models)
  └─ QualityCheckDetail (从Service移到Models)
  
2.2.3 3处重复定义删除 [P1, 1天, 前端开发]
```

**Phase 2 交付物**:
- ✅ 10个Repository搜索方法
- ✅ 8个模块枚举导出
- ✅ Repository测试覆盖率 >80%

---

### 3.0 Phase 3: 业务逻辑层增强

#### 3.1 核心Services增强
```
3.1.1 Task Service [P0, 2天, 前端开发]
  ├─ loadTasks()
  ├─ searchTasks(query, options)
  ├─ loadTasksByStatus(status)
  ├─ loadTasksByAssignee(assigneeId)
  ├─ selectTask(task)
  └─ reset()
  
3.1.2 Issue Service [P0, 2天, 前端开发]
  ├─ loadIssues()
  ├─ searchIssues(query, options)
  ├─ loadIssuesByStatus(status)
  ├─ loadIssuesByBlueprintId(blueprintId)
  ├─ selectIssue(issue)
  ├─ assignIssue(issueId, assigneeId)
  └─ reset()
  
3.1.3 Quality Check Service [P0, 2天, 前端开发]
  ├─ 8个CRUD方法
  ├─ 6个Signals状态管理
  └─ reset()
  
3.1.4 Inspection Service [P0, 2天, 前端开发]
  ├─ 6个CRUD方法
  ├─ Signals状态管理
  └─ reset()
```

#### 3.2 次要Services增强
```
3.2.1 Document Service [P1, 2天, 前端开发]
3.2.2 Account Service [P1, 1天, 前端开发]
3.2.3 Comment Service [P1, 1天, 前端开发]
3.2.4 Bot Service [P1, 1天, 前端开发]
3.2.5 Collaboration Service [P1, 1天, 前端开发]
```

#### 3.3 测试与验证
```
3.3.1 Service单元测试 [P0, 3天, 测试工程师]
  └─ 覆盖率目标: >80%
```

**Phase 3 交付物**:
- ✅ 50+个方法补充
- ✅ 20+个Signals添加
- ✅ Service测试覆盖率 >80%

---

### 4.0 Phase 4: 门面层重构

#### 4.1 核心Facades拆分 (Week 7-9)
```
4.1.1 Task Facade [P0, 5天, 前端架构师]
  ├─ task-crud.facade.ts (CRUD操作)
  ├─ task-assignment.facade.ts (任务分配)
  ├─ task-list.facade.ts (列表管理)
  ├─ task-template.facade.ts (模板管理)
  ├─ task-dependency.facade.ts (依赖关系)
  └─ task.facade.ts (主协调器)
  
4.1.2 Issue Facade [P0, 5天, 前端架构师]
  ├─ issue-crud.facade.ts
  ├─ issue-assignment.facade.ts
  ├─ issue-handle.facade.ts
  ├─ issue-sync.facade.ts
  └─ issue.facade.ts
  
4.1.3 Quality Facade [P0, 7天, 前端开发×2]
  ├─ quality-check-crud.facade.ts
  ├─ quality-inspection-crud.facade.ts
  ├─ quality-photo.facade.ts
  ├─ quality-submit.facade.ts
  └─ quality.facade.ts
```

#### 4.2 次要Facades增强 (Week 10-12)
```
4.2.1 Document Facade [P0, 4天, 前端开发]
  ├─ document-crud.facade.ts
  ├─ document-version.facade.ts
  └─ document-permission.facade.ts
  
4.2.2 Account Facade [P1, 3天, 前端开发]
4.2.3 Collaboration Facade [P1, 3天, 前端开发]
4.2.4 Communication Facade [P1, 3天, 前端开发]
4.2.5 Bot Facade [P2, 2天, 前端开发]
4.2.6 Analytics Facade [P2, 2天, 前端开发]
4.2.7 System Facade [P2, 2天, 前端开发]
```

#### 4.3 测试与验证
```
4.3.1 Facade单元测试 [P0, 5天, 测试工程师]
  └─ 覆盖率目标: >80%
```

**Phase 4 交付物**:
- ✅ 10个Facade拆分完成
- ✅ 25+个子Facade建立
- ✅ Facade测试覆盖率 >80%

---

### 5.0 Phase 5: 页面重新设计

#### 5.1 P0 页面 (Week 13-14, 35个)
```
5.1.1 任务管理模块 [P0, 3天, 前端开发×2]
  ├─ task-list ✅ 已完成
  ├─ task-calendar ✅ 已完成
  ├─ task-board ✅ 已完成
  ├─ task-tree
  ├─ task-todo ✅ 已完成
  ├─ task-assignments ✅ 已完成
  ├─ task-detail
  ├─ task-form
  ├─ daily-reports
  ├─ task-photos
  ├─ task-weather
  └─ progress-tracking
  
5.1.2 蓝图管理模块 [P0, 3天, 前端开发×2]
  ├─ blueprint-list
  ├─ blueprint-form
  ├─ blueprint-detail
  ├─ blueprint-settings
  ├─ blueprint-main-branch
  ├─ branch-management
  ├─ branch-detail
  ├─ blueprint-fork
  ├─ pull-request-list
  ├─ pull-request-detail
  └─ pr-review
  
5.1.3 问题追踪模块 [P0, 2天, 前端开发]
  ├─ issue-list
  ├─ issue-form
  ├─ issue-detail
  ├─ issue-assignments
  ├─ issue-handle
  ├─ issue-photos
  ├─ issue-close
  └─ issue-sync-logs
  
5.1.4 文档管理模块 [P0, 2天, 前端开发]
  ├─ document-list
  ├─ document-upload
  ├─ document-preview
  └─ document-version
```

#### 5.2 P1 页面 (Week 15-16, 28个)
```
5.2.1 品质管理模块 [P1, 2天, 前端开发]
  ├─ quality-checks
  ├─ quality-check-detail
  ├─ quality-submit
  ├─ quality-inspections
  ├─ inspection-detail
  ├─ quality-photos
  └─ quality-results
  
5.2.2 沟通协作模块 [P1, 2天, 前端开发]
  ├─ discussion-list
  ├─ comment-list
  ├─ notification-center
  ├─ notification-settings
  ├─ mention-list
  ├─ activity-feed
  ├─ activity-detail
  ├─ activity-settings
  └─ activity-types
  
5.2.3 帐户与协作 [P1, 4天, 前端开发]
  ├─ 帐户管理 (6个)
  └─ 协作管理 (6个)
```

#### 5.3 P2 页面 (Week 17-21, 22个)
```
5.3.1 机器人管理 [P2, 2天, 前端开发]
5.3.2 系统管理 [P2, 1天, 前端开发]
5.3.3 分析报表 [P2, 5天, 前端开发×2]
```

**Phase 5 交付物**:
- ✅ 86个页面整合完成
- ✅ 页面测试覆盖率 >70%
- ✅ 上下文切换验证

---

### 6.0 Phase 6: 功能模块补充

#### 6.1 遗漏功能模块
```
6.1.1 Explore模块整合 [P0, 3天, 前端开发]
  ├─ 添加上下文过滤模式
  ├─ 搜索结果上下文标记
  └─ 快速切换功能
  
6.1.2 Dashboard模块整合 [P0, 3天, 前端开发]
  ├─ Workplace三种视角
  ├─ Analysis组织限制
  └─ Monitor系统管理员
```

#### 6.2 技术债务清理
```
6.2.1 Issues模块TODO清理 [P0, 3天, 前端开发]
  └─ 10+ 处TODO
  
6.2.2 Documents模块TODO清理 [P0, 5天, 前端开发×2]
  └─ 20+ 处TODO
  
6.2.3 Blueprints模块TODO清理 [P1, 3天, 前端开发]
  └─ 10+ 处TODO
```

#### 6.3 基础设施改进
```
6.3.1 URL结构优化 [P0, 3天, 前端架构师]
6.3.2 导航守卫增强 [P1, 2天, 前端开发]
```

**Phase 6 交付物**:
- ✅ Explore和Dashboard整合
- ✅ 50+ 处TODO清理
- ✅ URL结构优化

---

### 7.0 Phase 7: 质量保障与文档

#### 7.1 E2E测试
```
7.1.1 核心流程E2E测试 [P0, 5天, 测试工程师]
  ├─ 登录流程
  ├─ 上下文切换
  ├─ 任务创建与管理
  ├─ 问题创建与处理
  └─ PR创建与合并
  
7.1.2 上下文切换E2E测试 [P1, 3天, 测试工程师]
  ├─ 个人→团队→组织切换
  ├─ 数据过滤验证
  └─ 权限验证
  
7.1.3 权限系统E2E测试 [P1, 3天, 测试工程师]
  ├─ 不同角色测试
  └─ 不同上下文权限测试
```

#### 7.2 性能优化
```
7.2.1 Bundle大小分析与优化 [P1, 3天, 前端架构师]
7.2.2 虚拟滚动实施 [P1, 5天, 前端开发×2]
```

#### 7.3 文档完善
```
7.3.1 开发者文档 [P1, 5天, 技术文档工程师]
  ├─ Workspace Context完整使用指南
  ├─ 页面迁移逐步手册
  └─ 故障排查指南
  
7.3.2 用户文档 [P2, 3天, 技术文档工程师]
  ├─ 用户使用指南
  └─ 视频教程
```

**Phase 7 交付物**:
- ✅ E2E测试套件完整
- ✅ 性能优化达标
- ✅ 文档完善
- ✅ 系统生产就绪

---

## 📊 工作量矩阵

### 按阶段分布

| 阶段 | 工作项 | 工时（周） | 人力需求 | 并行度 |
|------|--------|-----------|---------|--------|
| Phase 1 | 6项 | 2 | 3-4人 | 低 |
| Phase 2 | 7项 | 1.5 | 3-4人 | 中 |
| Phase 3 | 10项 | 2 | 3-4人 | 中 |
| Phase 4 | 11项 | 4-6 | 4-5人 | 中 |
| Phase 5 | 86项 | 6-8 | 5-6人 | 高 |
| Phase 6 | 7项 | 2 | 3-4人 | 中 |
| Phase 7 | 8项 | 2-3 | 3-4人 | 中 |

### 按角色分布

| 角色 | P1参与 | P2参与 | P3参与 | P4参与 | P5参与 | P6参与 | P7参与 |
|------|--------|--------|--------|--------|--------|--------|--------|
| 前端架构师 | ✅ | ✅ | ✅ | ✅✅ | ✅ | ✅ | ✅ |
| 前端开发×3 | ✅ | ✅✅ | ✅✅ | ✅✅✅ | ✅✅✅ | ✅✅ | ✅ |
| 测试工程师×2 | ✅✅ | ✅ | ✅ | ✅ | ✅ | - | ✅✅ |
| 后端工程师 | ✅✅ | - | - | - | - | - | - |
| 技术文档工程师 | - | - | - | - | - | - | ✅✅ |

---

## 🎯 里程碑与检查点

### 六大里程碑

```
M1: 基础设施就绪 (Week 2)
  ├─ 测试基础设施建立
  ├─ Types层完整
  └─ RLS审查完成

M2: 数据访问层完善 (Week 4)
  ├─ Repositories完整
  ├─ Models完整
  └─ 测试覆盖率达标

M3: 业务逻辑层完善 (Week 6)
  ├─ Services完整
  ├─ Signals实现
  └─ 测试覆盖率达标

M4: 门面层重构完成 (Week 12)
  ├─ 10个Facade拆分
  ├─ 25+子Facade建立
  └─ 测试覆盖率达标

M5: P0/P1页面整合完成 (Week 16)
  ├─ 63个页面整合
  └─ 上下文切换验证

M6: 项目完成，生产就绪 (Week 23)
  ├─ 所有工作完成
  ├─ E2E测试通过
  ├─ 文档完善
  └─ 性能达标
```

### 每周检查点

| 周次 | 检查点 | 预期完成 |
|------|--------|---------|
| Week 2 | M1检查点 | Types层 + 测试基础 + RLS审查 |
| Week 4 | M2检查点 | Repositories + Models |
| Week 6 | M3检查点 | Services层完整 |
| Week 12 | M4检查点 | Facades拆分完成 |
| Week 16 | M5检查点 | P0/P1页面完成 |
| Week 23 | M6检查点 | 项目完成 |

---

## 📈 进度跟踪建议

### 使用Jira/GitHub Projects

**Epic结构**:
```
Epic 1: Phase 1 - 基础设施强化
  └─ Story 1.1: 测试基础设施
    ├─ Task 1.1.1: Workspace Context测试
    ├─ Task 1.1.2: 已整合页面测试
    └─ Task 1.1.3: 测试工具开发
  └─ Story 1.2: Types层增强
    ├─ Task 1.2.1: 补充枚举定义
    └─ Task 1.2.2: 统一重复定义
  └─ Story 1.3: 安全性加固
    ├─ Task 1.3.1: RLS审查
    └─ Task 1.3.2: 权限验证
```

### 看板视图

```
To Do | In Progress | In Review | Done
------|-------------|-----------|------
 []   |     []      |    []     |  [✓]
```

### 燃尽图

建议使用Sprint燃尽图跟踪每2周Sprint的进度。

---

## 🔗 相关文档

- **[MASTER_IMPLEMENTATION_PLAN.md](./MASTER_IMPLEMENTATION_PLAN.md)** - 详细实施计划
- **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)** - 快速开始指南
- **[README.md](./README.md)** - 文档总览

---

**最后更新**: 2025-11-21  
**维护者**: 项目管理团队  
**更新频率**: 每周
