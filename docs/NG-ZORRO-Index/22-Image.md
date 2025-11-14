# Image - 圖片

> **組件分類**：數據展示類組件 (Data Display)  
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzImageModule` |
| **官方文檔** | [Image](https://ng.ant.design/components/image/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzImageModule } from 'ng-zorro-antd/image';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzImageModule],
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

請參考 [官方文檔](https://ng.ant.design/components/image/en) 查看詳細用法和示例。

## 相關資源

- [官方文檔](https://ng.ant.design/components/image/en)
- [返回索引](../46-ng-zorro-antd-組件清單與CLI指令.md)

