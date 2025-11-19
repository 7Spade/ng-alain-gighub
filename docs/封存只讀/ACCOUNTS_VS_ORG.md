# Accounts vs Org 职责边界说明

> **目的**：明确 `routes/accounts` 和 `routes/org` 的职责边界，避免功能重复和混淆

## 📋 职责划分

### `routes/accounts` - 账户管理视角（系统管理员视角）

**职责**：管理所有账户的 CRUD 操作

**路由结构**：
- `/accounts/list` - 所有账户列表
- `/accounts/organizations` - 组织列表
- `/accounts/teams` - 团队列表
- `/accounts/:id` - 账户详情（只读或简单操作）
- `/accounts/:id/edit` - 编辑账户

**功能范围**：
- ✅ 账户的创建、编辑、删除
- ✅ 账户列表查看（所有账户）
- ✅ 账户详情查看（基本信息）
- ✅ 成员信息**只读显示**（不提供完整管理功能）
- ❌ **不提供**成员管理的完整功能（添加、编辑、删除）

**设计原则**：
- 这是"系统管理员"视角，可以看到所有账户
- 成员管理功能应该跳转到 `routes/org` 路由

---

### `routes/org` - 组织上下文视角（组织成员视角）

**职责**：在组织上下文下的所有操作

**路由结构**：
- `/org/:id/members` - 组织成员管理（完整功能）
- `/org/teams/:id/members` - 团队成员管理（完整功能）

**功能范围**：
- ✅ 组织成员管理（添加、编辑、删除、角色管理）
- ✅ 团队成员管理（添加、编辑、删除、角色管理）
- ✅ 组织设置（未来扩展）
- ✅ 团队管理（未来扩展）

**设计原则**：
- 这是"组织成员"视角，在特定组织上下文下操作
- 需要先切换到组织上下文（通过菜单切换或路由参数）
- 提供完整的成员管理功能

---

## 🔄 交互流程

### 从账户详情跳转到组织管理

```
用户操作流程：
1. 访问 /accounts/organizations（组织列表）
2. 点击某个组织 → /accounts/:id（账户详情）
3. 在账户详情页看到成员信息（只读）
4. 点击"前往组织管理"按钮 → /org/:id/members（完整功能）
```

### 从菜单直接访问

```
用户操作流程：
1. 切换到组织上下文（通过菜单切换器）
2. 菜单中显示"Organization Members"
3. 点击菜单项 → /org/:id/members（完整功能）
```

---

## 📝 实施规范

### Accounts 下的成员管理组件

**`OrganizationRoleManageComponent`** 和 **`TeamRoleManageComponent`** 应该：
- ✅ 显示成员列表（只读）
- ✅ 提供"前往组织管理"按钮，跳转到 `/org/:id/members`
- ❌ 不提供添加、编辑、删除功能（或提供但跳转到 org 路由）

### Org 下的成员管理组件

**`OrgMembersComponent`** 和 **`OrgTeamMembersComponent`** 应该：
- ✅ 提供完整的成员管理功能
- ✅ 添加、编辑、删除、角色管理
- ✅ 使用对应的 Service（OrganizationMemberService、TeamMemberService）

---

## 🎯 设计理念

参考 **GitHub** 的设计：
- **Settings → Organizations** = `routes/accounts`（管理所有组织）
- **切换到组织上下文 → Members** = `routes/org`（在组织上下文下管理）

这样划分的好处：
1. **职责清晰**：accounts 管理账户，org 管理组织资源
2. **符合用户心智模型**：GitHub 也是这样的设计
3. **避免重复**：每个功能只有一个完整入口
4. **路由语义清晰**：`/accounts` 是账户管理，`/org` 是组织上下文

---

**最后更新**：2025-01-20  
**维护者**：开发团队

