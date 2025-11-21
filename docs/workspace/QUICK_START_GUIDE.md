# Workspace 系统快速开始指南

> **目标读者**: 新加入项目的开发者、项目经理  
> **阅读时间**: 10分钟  
> **最后更新**: 2025-11-21

---

## 🎯 5分钟快速理解

### 什么是Workspace Context Manager？

Workspace Context Manager 是 ng-alain-gighub 项目的核心功能，提供**多层级上下文切换**能力：

```
个人 (User) → 团队 (Team) → 组织 (Organization) → 项目 (Project)
```

**核心价值**:
- ✅ 用户可以在不同视角间无缝切换
- ✅ 数据完全隔离，互不干扰
- ✅ 权限精确控制
- ✅ 提供统一的上下文管理接口

### 当前状态

| 项目 | 数量 | 已完成 | 待处理 | 预估工时 |
|------|------|--------|--------|---------|
| 页面重新设计 | 86个 | 4个 | 82个 | 6-8周 |
| 额外工作项 | 47个 | 0个 | 47个 | 20-37周 |
| 五层架构增强 | 48个模块 | 0个 | 48个 | 5.5-8周 |
| Facades增强 | 10个 | 1个 | 9个 | 4-6周 |

**总工作量**: 20-43周（取决于团队规模和并行程度）

---

## 📚 必读文档（按优先级）

### 🔴 必读（开始工作前）

1. **[MASTER_IMPLEMENTATION_PLAN.md](./MASTER_IMPLEMENTATION_PLAN.md)** ⭐⭐⭐⭐⭐
   - 完整的实施主计划（20KB）
   - 七阶段详细规划
   - 资源需求、风险管理、质量保障

2. **[README.md](./README.md)** ⭐⭐⭐⭐⭐
   - Workspace系统文档总览
   - 文档组织结构
   - 快速导航

3. **[five-layer-architecture-enhancement-plan.md](./five-layer-architecture-enhancement-plan.md)** ⭐⭐⭐⭐⭐
   - 五层架构增强总计划
   - Types → Repositories → Models → Services → Facades 开发顺序
   - 依赖关系图

### 🟡 重要（第一周内阅读）

4. **[workspace-missing-work-items-analysis.md](./workspace-missing-work-items-analysis.md)** ⭐⭐⭐⭐⭐
   - 47个额外工作项详细分析
   - 7大类别：功能模块、基础设施、技术债务等

5. **[pages-requiring-redesign.md](./pages-requiring-redesign.md)** ⭐⭐⭐⭐
   - 86个页面清单
   - P0/P1/P2优先级划分
   - 快速查询版

6. **[facades-getting-started.md](./facades-getting-started.md)** ⭐⭐⭐⭐⭐
   - Facades增强5分钟开始
   - 代码模板和快速范例

### 🟢 参考（根据任务查阅）

7. **层级检查清单系列**
   - [types-layer-enhancement-checklist.md](./types-layer-enhancement-checklist.md)
   - [repositories-layer-enhancement-checklist.md](./repositories-layer-enhancement-checklist.md)
   - [models-layer-enhancement-checklist.md](./models-layer-enhancement-checklist.md)
   - [services-layer-enhancement-checklist.md](./services-layer-enhancement-checklist.md)
   - [facades-layer-enhancement-checklist.md](./facades-layer-enhancement-checklist.md)

8. **Workspace Context文档**
   - [workspace-context-overview.md](./workspace-context-overview.md) - 功能总览
   - [workspace-context-usage-guide.md](./workspace-context-usage-guide.md) - 使用指南
   - [workspace-context-migration-plan.md](./workspace-context-migration-plan.md) - 迁移计划

---

## 🚀 快速开始工作流

### 第一天：环境设置

```bash
# 1. 克隆仓库
git clone https://github.com/7Spade/ng-alain-gighub.git
cd ng-alain-gighub

# 2. 安装依赖
yarn install

# 3. 启动开发服务器
yarn start

# 4. 运行测试（确认环境正常）
yarn test

# 5. 构建项目（确认无错误）
yarn build
```

### 第一周：熟悉架构

#### Day 1-2: 理解Workspace Context
1. 阅读 [README.md](./README.md)
2. 阅读 [workspace-context-overview.md](./workspace-context-overview.md)
3. 运行项目，体验上下文切换功能
4. 查看已整合的页面代码（task-board, task-todo, task-assignments, org）

#### Day 3-4: 理解五层架构
1. 阅读 [five-layer-architecture-enhancement-plan.md](./five-layer-architecture-enhancement-plan.md)
2. 查看参考实现：`src/app/core/facades/blueprint/`
3. 理解开发顺序：Types → Repositories → Models → Services → Facades

#### Day 5: 选择任务并开始
1. 查看 [MASTER_IMPLEMENTATION_PLAN.md](./MASTER_IMPLEMENTATION_PLAN.md) 的Phase 1任务
2. 与团队确认分配的任务
3. 创建工作分支
4. 开始第一个任务

---

## 📋 开发检查清单

### 开始开发前

- [ ] 已阅读必读文档
- [ ] 理解Workspace Context概念
- [ ] 理解五层架构开发顺序
- [ ] 查看参考实现（Blueprint）
- [ ] 环境设置完成
- [ ] 代码可以成功构建
- [ ] 测试可以成功运行

### 开发中

- [ ] 遵循五层架构开发顺序
- [ ] 参考Blueprint实现模式
- [ ] 使用TypeScript strict mode
- [ ] 添加JSDoc注释
- [ ] 编写单元测试（覆盖率 > 80%）
- [ ] 使用Signals进行状态管理
- [ ] 错误处理完善
- [ ] Lint检查通过

### 提交PR前

- [ ] 所有测试通过
- [ ] Lint检查通过
- [ ] 构建成功
- [ ] 代码审查自查
- [ ] 相关文档已更新
- [ ] Commit message符合规范
- [ ] PR描述清晰完整

---

## 🎯 按角色的工作指引

### 前端架构师

**主要职责**:
1. 整体架构设计和技术决策
2. Code Review和质量把关
3. 难点问题攻关
4. 团队技术培训

**第一周任务**:
- [ ] 审查 [MASTER_IMPLEMENTATION_PLAN.md](./MASTER_IMPLEMENTATION_PLAN.md)
- [ ] 确认技术栈和工具链
- [ ] 建立Code Review流程
- [ ] 进行Workspace Context培训
- [ ] 进行五层架构培训

**关键文档**:
- [MASTER_IMPLEMENTATION_PLAN.md](./MASTER_IMPLEMENTATION_PLAN.md)
- [five-layer-architecture-enhancement-plan.md](./five-layer-architecture-enhancement-plan.md)
- [facades-implementation-guide.md](./facades-implementation-guide.md)

---

### 前端开发工程师

**主要职责**:
1. 实现页面重新设计
2. 补充五层架构方法
3. 编写单元测试
4. 清理技术债务

**第一周任务**:
- [ ] 阅读快速开始指南（本文档）
- [ ] 理解Workspace Context概念
- [ ] 查看已整合页面代码
- [ ] 完成环境设置
- [ ] 选择并开始第一个任务

**关键文档**:
- [QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)（本文档）
- [pages-requiring-redesign.md](./pages-requiring-redesign.md)
- [workspace-context-migration-plan.md](./workspace-context-migration-plan.md)
- 对应层级的enhancement-checklist.md

**代码参考**:
```typescript
// 已整合页面示例
src/app/routes/tasks/task-board/task-board.component.ts
src/app/routes/tasks/task-todo/task-todo.component.ts
src/app/routes/tasks/task-assignments/task-assignments.component.ts

// 参考标准实现
src/app/core/facades/blueprint/
```

---

### 测试工程师

**主要职责**:
1. 建立测试基础设施
2. 编写单元测试和E2E测试
3. 测试覆盖率监控
4. 测试工具开发

**第一周任务**:
- [ ] 审查当前测试状态（37个测试 vs 226个组件）
- [ ] 建立测试工具库
- [ ] 为Workspace Context核心服务编写测试
- [ ] 为已整合页面补充测试

**关键文档**:
- [workspace-missing-work-items-analysis.md](./workspace-missing-work-items-analysis.md) - Section 2.1 测试覆盖率提升
- [MASTER_IMPLEMENTATION_PLAN.md](./MASTER_IMPLEMENTATION_PLAN.md) - Phase 1 & Phase 7

**测试目标**:
- 单元测试覆盖率: > 80%
- E2E测试覆盖核心流程: 100%
- 上下文切换测试: 所有场景

---

### 后端工程师

**主要职责**:
1. RLS策略审查和优化
2. 数据层优化
3. 安全性加固
4. 性能优化

**第一周任务**:
- [ ] 审查51张表的RLS策略
- [ ] 验证上下文权限逻辑
- [ ] 识别安全风险点
- [ ] 制定优化计划

**关键文档**:
- [workspace-missing-work-items-analysis.md](./workspace-missing-work-items-analysis.md) - Section 2.3 安全性加固
- [MASTER_IMPLEMENTATION_PLAN.md](./MASTER_IMPLEMENTATION_PLAN.md) - Phase 1

---

### 技术文档工程师

**主要职责**:
1. 编写和维护技术文档
2. 制作教程和视频
3. 建立知识库
4. 收集和整理FAQ

**第一周任务**:
- [ ] 熟悉所有workspace文档
- [ ] 识别文档缺口
- [ ] 制定文档计划
- [ ] 开始编写Workspace Context完整使用指南

**关键文档**:
- [workspace-missing-work-items-analysis.md](./workspace-missing-work-items-analysis.md) - Section 2.4 文档完善
- [MASTER_IMPLEMENTATION_PLAN.md](./MASTER_IMPLEMENTATION_PLAN.md) - Phase 7

---

## 🔧 常用命令速查

### 开发命令

```bash
# 启动开发服务器
yarn start

# 构建项目
yarn build

# 运行测试
yarn test

# 运行单个测试文件
yarn test --include='**/your-file.spec.ts'

# 测试覆盖率
yarn test:cov

# Lint检查
yarn lint

# 自动修复Lint问题
yarn lint:fix

# 格式化代码
yarn format
```

### Git工作流

```bash
# 创建工作分支
git checkout -b feature/your-feature-name

# 提交代码
git add .
git commit -m "feat(scope): your message"

# 推送到远程
git push origin feature/your-feature-name

# 更新主分支代码
git checkout main
git pull origin main
git checkout feature/your-feature-name
git rebase main
```

### 快速查找

```bash
# 查找所有TODO
grep -r "TODO" src/

# 查找使用ActivatedRoute的组件（需要迁移）
grep -r "ActivatedRoute" src/app/routes/

# 查找Facade文件
find src/app/core/facades -name "*.facade.ts"

# 统计测试文件数量
find src -name "*.spec.ts" | wc -l

# 统计组件文件数量
find src -name "*.component.ts" | wc -l
```

---

## 💡 常见问题解答

### Q1: 我应该从哪个任务开始？

**A**: 建议按以下优先级：
1. 如果你是测试工程师 → 开始Phase 1的测试基础设施建立
2. 如果你是前端开发 → 从Types层增强开始（最简单，2-3天）
3. 如果你是架构师 → 审查整体计划，进行技术预研

参考: [MASTER_IMPLEMENTATION_PLAN.md](./MASTER_IMPLEMENTATION_PLAN.md)

---

### Q2: 五层架构的开发顺序为什么这么重要？

**A**: 因为存在严格的依赖关系：
```
Types层（枚举定义）
  ↓ 被依赖
Repositories层（使用Types的枚举）
  ↓ 被依赖
Models层（使用Types和Repositories）
  ↓ 被依赖
Services层（使用Models和Repositories）
  ↓ 被依赖
Facades层（使用Services）
```

如果跳过下层直接开发上层，会导致频繁返工。

参考: [five-layer-architecture-enhancement-plan.md](./five-layer-architecture-enhancement-plan.md)

---

### Q3: Blueprint Facade为什么是参考标准？

**A**: Blueprint Facade是唯一完成拆分和增强的Facade，具有：
- ✅ 清晰的子Facade拆分（6个子Facade）
- ✅ 主Facade协调器模式
- ✅ 完整的CRUD方法
- ✅ Signals状态管理
- ✅ 错误处理和活动日志
- ✅ 高测试覆盖率

位置: `src/app/core/facades/blueprint/`

参考: [facades-getting-started.md](./facades-getting-started.md)

---

### Q4: 如何知道我的任务是否完成？

**A**: 使用对应的检查清单：
- Types层: [types-layer-enhancement-checklist.md](./types-layer-enhancement-checklist.md)
- Repositories层: [repositories-layer-enhancement-checklist.md](./repositories-layer-enhancement-checklist.md)
- Models层: [models-layer-enhancement-checklist.md](./models-layer-enhancement-checklist.md)
- Services层: [services-layer-enhancement-checklist.md](./services-layer-enhancement-checklist.md)
- Facades层: [facades-layer-enhancement-checklist.md](./facades-layer-enhancement-checklist.md)

每个检查清单都包含详细的验收标准。

---

### Q5: 我遇到问题了，应该问谁？

**A**: 
1. **技术问题** → 咨询前端架构师
2. **任务分配问题** → 咨询项目经理
3. **测试问题** → 咨询测试工程师
4. **后端/RLS问题** → 咨询后端工程师
5. **文档问题** → 咨询技术文档工程师

也可以在项目Slack/Teams频道提问。

---

### Q6: 测试覆盖率为什么这么重要？

**A**: 因为：
1. 当前测试覆盖率极低（~16%）
2. 86个页面重新设计后需要验证功能正确性
3. Facades拆分后需要确保行为不变
4. 防止引入回归错误
5. 企业标准要求 > 80%

参考: [workspace-missing-work-items-analysis.md](./workspace-missing-work-items-analysis.md) - Section 2.1

---

## 📞 获取帮助

### 团队联系方式

| 角色 | 姓名 | Slack/Teams | Email |
|------|------|------------|-------|
| 前端架构师 | 待定 | @architect | architect@example.com |
| 项目经理 | 待定 | @pm | pm@example.com |
| 测试工程师 | 待定 | @tester | tester@example.com |

### 有用的资源

- **项目文档**: `docs/workspace/`
- **代码参考**: `src/app/core/facades/blueprint/`
- **GitHub Issues**: https://github.com/7Spade/ng-alain-gighub/issues
- **项目看板**: 待建立

---

## 📅 检查点和会议

### 每日站会 (Daily Standup)
- **时间**: 每天上午9:30
- **时长**: 15分钟
- **内容**: 
  - 昨天完成了什么
  - 今天计划做什么
  - 遇到什么阻碍

### 每周进度审查 (Weekly Review)
- **时间**: 每周五下午4:00
- **时长**: 1小时
- **内容**:
  - 本周完成的工作
  - 下周计划
  - 风险和问题
  - Demo演示

### 技术分享会 (Tech Sharing)
- **时间**: 每两周一次
- **时长**: 1小时
- **内容**:
  - 技术难点分享
  - 最佳实践
  - 学习心得

---

## ✅ 下一步行动

### 今天就开始！

1. [ ] 阅读本快速开始指南
2. [ ] 阅读 [README.md](./README.md)
3. [ ] 设置开发环境
4. [ ] 运行项目并体验Workspace Context
5. [ ] 查看已整合页面代码
6. [ ] 与团队确认分配的任务
7. [ ] 开始第一个任务！

**记住**: 
- 📚 文档在这里：`docs/workspace/`
- 💻 代码参考在这里：`src/app/core/facades/blueprint/`
- 🤝 遇到问题随时问团队
- 🎯 小步快跑，持续交付

---

**欢迎加入ng-alain-gighub项目！让我们一起打造企业级的资源中心系统！** 🚀

---

**最后更新**: 2025-11-21  
**维护者**: 项目团队  
**文档版本**: 1.0.0
