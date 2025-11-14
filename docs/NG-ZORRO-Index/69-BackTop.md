# BackTop - 返回頂部

> **組件分類**：其他類組件 (Other)  
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzBackTopModule` |
| **官方文檔** | [BackTop](https://ng.ant.design/components/back-top/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzBackTopModule } from 'ng-zorro-antd/back-top';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzBackTopModule],
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

請參考 [官方文檔](https://ng.ant.design/components/back-top/en) 查看詳細用法和示例。

## 相關資源

- [官方文檔](https://ng.ant.design/components/back-top/en)
- [返回索引](../46-ng-zorro-antd-組件清單與CLI指令.md)

