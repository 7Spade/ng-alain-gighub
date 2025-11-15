# 身份切换功能代码优化建议

基于 Angular 20 Signals 最佳实践，以下是代码优化建议：

## 📊 当前实现分析

### ✅ 做得好的地方：
1. ✅ 正确使用 `signal()` 和 `computed()`
2. ✅ 使用 `effect()` 处理副作用
3. ✅ 使用 `asReadonly()` 暴露只读信号
4. ✅ 符合 Angular 20 最佳实践

### 🔧 可以优化的地方：

---

## 1. 简化默认身份创建（减少重复代码）

**当前代码**（重复 3 次）：
```typescript
{
  type: 'personal',
  name: '个人'
}
```

**优化建议**：
```typescript
// 在类顶部定义常量
private readonly DEFAULT_PERSONAL_IDENTITY: IdentityInfo = {
  type: 'personal',
  name: '个人'
};

// 使用
this.currentIdentityState.set(this.DEFAULT_PERSONAL_IDENTITY);
this.availableIdentitiesState.set([this.DEFAULT_PERSONAL_IDENTITY]);
```

**代码减少**：约 10 行

---

## 2. 使用 Signal 初始值（简化构造函数）

**当前代码**：
```typescript
private readonly currentIdentityState = signal<IdentityInfo | null>(null);

constructor() {
  // 从 localStorage 恢复身份
  this.restoreIdentityFromStorage();
}

private restoreIdentityFromStorage(): void {
  try {
    const stored = localStorage.getItem('currentIdentity');
    if (stored) {
      const identity = JSON.parse(stored) as IdentityInfo;
      this.currentIdentityState.set(identity);
    } else {
      this.currentIdentityState.set({
        type: 'personal',
        name: '个人'
      });
    }
  } catch (error) {
    // ...
  }
}
```

**优化建议**：
```typescript
// 使用工厂函数初始化
private readonly currentIdentityState = signal<IdentityInfo>(
  this.restoreIdentityFromStorage()
);

private restoreIdentityFromStorage(): IdentityInfo {
  try {
    const stored = localStorage.getItem('currentIdentity');
    if (stored) {
      return JSON.parse(stored) as IdentityInfo;
    }
  } catch (error) {
    console.warn('Failed to restore identity from localStorage:', error);
  }
  return this.DEFAULT_PERSONAL_IDENTITY;
}
```

**优势**：
- 减少构造函数代码
- 类型更安全（不再需要 `null`）
- 代码更简洁

**代码减少**：约 15 行

---

## 3. 简化 computed 逻辑（合并相关计算）

**当前代码**：
```typescript
readonly currentIdentityName = computed(() => {
  const identity = this.currentIdentity();
  return identity?.name || '个人';
});

readonly currentIdentityAvatar = computed(() => {
  const identity = this.currentIdentity();
  return identity?.avatar;
});

readonly currentIdentityType = computed(() => {
  const identity = this.currentIdentity();
  return identity?.type || 'personal';
});
```

**优化建议**：
```typescript
// 如果这些经常一起使用，可以合并为一个对象
readonly currentIdentityInfo = computed(() => {
  const identity = this.currentIdentity();
  return {
    name: identity?.name || '个人',
    avatar: identity?.avatar,
    type: identity?.type || 'personal'
  };
});

// 或者保持分离但优化
readonly currentIdentityName = computed(() => this.currentIdentity().name || '个人');
readonly currentIdentityAvatar = computed(() => this.currentIdentity().avatar);
readonly currentIdentityType = computed(() => this.currentIdentity().type || 'personal');
```

**优势**：
- 减少重复的 `this.currentIdentity()` 调用
- 如果合并，可以减少 computed 数量

---

## 4. 使用 `signal.update()` 优化状态更新

**当前代码**：
```typescript
async switchIdentity(type: IdentityType, id?: string): Promise<void> {
  const previous = this.currentIdentity();
  let newIdentity: IdentityInfo;
  
  if (type === 'personal') {
    newIdentity = { type: 'personal', name: '个人' };
  } else {
    const available = this.availableIdentities();
    const identity = available.find(i => i.type === type && i.id === id);
    if (!identity) {
      throw new Error(`Identity not found: ${type} ${id}`);
    }
    newIdentity = identity;
  }
  
  this.currentIdentityState.set(newIdentity);
  // ...
}
```

**优化建议**：
```typescript
async switchIdentity(type: IdentityType, id?: string): Promise<void> {
  const previous = this.currentIdentity();
  
  const newIdentity = type === 'personal'
    ? this.DEFAULT_PERSONAL_IDENTITY
    : this.availableIdentities().find(i => i.type === type && i.id === id) 
      ?? (() => { throw new Error(`Identity not found: ${type} ${id}`); })();
  
  this.currentIdentityState.set(newIdentity);
  console.log('Identity changed:', { previous, current: newIdentity });
}
```

**优势**：
- 减少中间变量
- 代码更简洁
- 使用三元运算符和空值合并

**代码减少**：约 5 行

---

## 5. 简化错误处理（使用统一的错误处理模式）

**当前代码**（多处重复）：
```typescript
try {
  // ...
} catch (error) {
  console.warn('Failed to ...', error);
  return [];
}
```

**优化建议**：
```typescript
// 创建统一的错误处理辅助方法
private handleError<T>(defaultValue: T, message: string) {
  return (error: unknown): T => {
    console.warn(message, error);
    return defaultValue;
  };
}

// 使用
private async loadUserOwnedOrganizations(authUserId: string): Promise<IdentityInfo[]> {
  try {
    const organizations = await firstValueFrom(
      this.accountRepository.findByAuthOrganizationId(authUserId)
    );
    return organizations
      .filter(org => org.type === AccountType.ORGANIZATION)
      .map(org => ({
        type: 'organization' as IdentityType,
        id: org.id,
        name: org.name,
        avatar: (org as any).avatar_url || undefined,
        email: org.email || undefined
      }));
  } catch (error) {
    return this.handleError([], 'Failed to load user organizations:')(error);
  }
}
```

**优势**：
- 统一错误处理逻辑
- 减少重复代码

---

## 6. 优化 loadAvailableIdentities 方法（减少嵌套）

**当前代码**：
```typescript
async loadAvailableIdentities(): Promise<void> {
  this.loadingState.set(true);
  this.errorState.set(null);

  try {
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.availableIdentitiesState.set([{ type: 'personal', name: '个人' }]);
      return;
    }

    const accountId = await this.getCurrentUserAccountId();
    if (!accountId) {
      this.availableIdentitiesState.set([{ type: 'personal', name: '个人' }]);
      return;
    }

    // ...
  } catch (error) {
    // ...
  } finally {
    this.loadingState.set(false);
  }
}
```

**优化建议**：
```typescript
async loadAvailableIdentities(): Promise<void> {
  this.loadingState.set(true);
  this.errorState.set(null);

  try {
    const userId = this.getCurrentUserId();
    const accountId = userId ? await this.getCurrentUserAccountId() : null;
    
    if (!userId || !accountId) {
      this.availableIdentitiesState.set([this.DEFAULT_PERSONAL_IDENTITY]);
      return;
    }

    const [organizations, teams] = await Promise.all([
      this.loadUserOwnedOrganizations(userId),
      this.loadUserTeams(accountId)
    ]);

    const identities: IdentityInfo[] = [
      this.DEFAULT_PERSONAL_IDENTITY,
      ...organizations,
      ...teams
    ];

    this.availableIdentitiesState.set(identities);

    // 验证当前身份是否仍然有效
    const current = this.currentIdentity();
    if (current && current.type !== 'personal') {
      const exists = identities.some(i => i.type === current.type && i.id === current.id);
      if (!exists) {
        await this.switchIdentity('personal');
      }
    }
  } catch (error) {
    this.errorState.set(error instanceof Error ? error.message : '加载身份列表失败');
    console.error('Failed to load available identities:', error);
  } finally {
    this.loadingState.set(false);
  }
}
```

**优势**：
- 减少嵌套层级
- 合并早期返回条件
- 代码更清晰

**代码减少**：约 5 行

---

## 7. 简化 basic.component.ts 中的 effect

**当前代码**：
```typescript
ngOnInit(): void {
  // 加载应用数据
  firstValueFrom(this.httpClient.get('./assets/tmp/app-data.json')).then(data => {
    this.appData = data;
  });

  // 监听身份变化，更新菜单
  effect(() => {
    const identity = this.identityContextService.currentIdentity();
    if (identity && this.appData) {
      this.startupService.reloadMenuByIdentity(this.appData);
    }
  });
}
```

**优化建议**：
```typescript
ngOnInit(): void {
  // 使用 async/await 更清晰
  firstValueFrom(this.httpClient.get('./assets/tmp/app-data.json'))
    .then(data => {
      this.appData = data;
      // 立即加载一次菜单
      if (this.identityContextService.currentIdentity()) {
        this.startupService.reloadMenuByIdentity(data);
      }
    });

  // effect 可以简化条件
  effect(() => {
    if (this.appData) {
      this.startupService.reloadMenuByIdentity(this.appData);
    }
  });
}
```

**优势**：
- 减少 effect 中的条件检查
- 代码更简洁

---

## 📊 优化总结

### 代码减少估算：
- **优化 1**：减少 ~10 行（消除重复）
- **优化 2**：减少 ~15 行（简化初始化）
- **优化 3**：减少 ~5 行（简化 computed）
- **优化 4**：减少 ~5 行（简化 switchIdentity）
- **优化 5**：减少 ~10 行（统一错误处理）
- **优化 6**：减少 ~5 行（减少嵌套）
- **优化 7**：减少 ~3 行（简化 effect）

**总计**：约 **53 行代码减少**（从 ~320 行减少到 ~267 行，约 **16% 代码减少**）

### 性能提升：
- ✅ 减少重复的 `currentIdentity()` 调用
- ✅ 更高效的 computed 计算
- ✅ 更简洁的错误处理

### 可维护性提升：
- ✅ 代码更简洁易读
- ✅ 减少重复代码
- ✅ 统一的错误处理模式

---

## 🎯 推荐实施的优化

### 高优先级（立即实施）：
1. ✅ **优化 1**：消除重复的默认身份创建
2. ✅ **优化 2**：使用 Signal 初始值
3. ✅ **优化 6**：减少嵌套层级

### 中优先级（后续优化）：
4. ⚠️ **优化 4**：简化 switchIdentity
5. ⚠️ **优化 5**：统一错误处理

### 低优先级（可选）：
6. ⚠️ **优化 3**：合并 computed（取决于使用场景）
7. ⚠️ **优化 7**：简化 effect（影响较小）

---

## 💡 额外建议

### 考虑使用 `resource()` API（Angular 20 新特性）

如果未来需要更复杂的异步状态管理，可以考虑使用 `resource()` API：

```typescript
readonly availableIdentitiesResource = resource({
  loader: async () => {
    const userId = this.getCurrentUserId();
    const accountId = userId ? await this.getCurrentUserAccountId() : null;
    
    if (!userId || !accountId) {
      return [this.DEFAULT_PERSONAL_IDENTITY];
    }

    const [organizations, teams] = await Promise.all([
      this.loadUserOwnedOrganizations(userId),
      this.loadUserTeams(accountId)
    ]);

    return [this.DEFAULT_PERSONAL_IDENTITY, ...organizations, ...teams];
  }
});
```

**优势**：
- 自动处理加载状态
- 自动处理错误状态
- 自动缓存和重试

**注意**：这是可选的高级特性，当前实现已经足够好。

---

## ✅ 结论

当前实现已经**非常优秀**，符合 Angular 20 最佳实践。以上优化建议主要是：
- **代码简化**（减少约 16% 代码）
- **可维护性提升**
- **性能微优化**

**建议**：可以逐步实施这些优化，不需要一次性全部完成。

