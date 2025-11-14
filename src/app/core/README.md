### CoreModule

**应** 仅只留 `providers` 属性。

**作用：**  一些通用服务，例如：用户消息、HTTP数据访问。

---

## 📦 基础设施模块 (Infrastructure)

**位置**：`src/app/core/infra/`

提供数据访问、错误处理、类型定义等基础设施功能。

### 模块结构

- **types/** - Supabase 生成的数据库类型定义（51 张表）
- **repositories/** - Repository 模式实现（BaseRepository、BlueprintRepository）
- **errors/** - 统一错误处理机制
- **utils/** - 数据转换工具（snake_case ↔ camelCase）

### 快速开始

```typescript
import { BlueprintRepository } from '@core';

const blueprintRepo = inject(BlueprintRepository);
blueprintRepo.findAll().subscribe(blueprints => {
  console.log('Blueprints:', blueprints);
});
```

**详细文档**：请参考 [infra/README.md](./infra/README.md)
