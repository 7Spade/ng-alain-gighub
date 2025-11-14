# Drawer - 抽屜

> **組件分類**：反饋類組件 (Feedback)  
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzDrawerModule` |
| **官方文檔** | [Drawer](https://ng.ant.design/components/drawer/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzDrawerModule],
  // ...
})
export class ExampleComponent {}
```

### 或使用 SHARED_IMPORTS

```typescript
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS], // 包含所有 ng-zorro-antd 組件
  // ...
})
export class ExampleComponent {}
```

## 基本用法

請參考 [官方文檔](https://ng.ant.design/components/drawer/en) 查看詳細用法和示例。

## 相關資源

- [官方文檔](https://ng.ant.design/components/drawer/en)
- [返回索引](../46-ng-zorro-antd-組件清單與CLI指令.md)

