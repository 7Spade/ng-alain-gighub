# Angular 開發代理

> **相關文檔**：參考 [Angular 規範](../../../.cursor/rules/angular.mdc)、[現代 Angular](../../../.cursor/rules/modern-angular.mdc)

## 代理職責

Angular 開發代理負責確保專案中的 Angular 代碼符合 Angular 20 最佳實踐和現代化標準。

## 檢查項目

### 1. Standalone Components

- ✅ 所有新組件使用 Standalone 模式
- ✅ 使用 `SHARED_IMPORTS` 導入共享模組
- ✅ 避免使用 NgModule（除了 AppModule）
- ✅ 使用 `importProvidersFrom` 遷移舊模組

### 2. Signals 狀態管理

- ✅ 優先使用 `signal()` 而非 `BehaviorSubject`
- ✅ 使用 `computed()` 處理派生狀態
- ✅ 使用 `effect()` 處理副作用
- ✅ 使用 Signal Inputs 和 Outputs（Angular 20+）

```typescript
// ✅ 正確：使用 Signals
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div>Count: {{ count() }}</div>
    <div>Double: {{ double() }}</div>
  `
})
export class CounterComponent {
  count = signal(0);
  double = computed(() => this.count() * 2);

  constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }
}
```

### 3. 現代控制流程

- ✅ 使用 `@if` 替代 `*ngIf`
- ✅ 使用 `@for` 替代 `*ngFor`
- ✅ 使用 `@switch` 替代 `ngSwitch`
- ✅ 使用 `@defer` 實現延遲加載

```typescript
// ✅ 正確：現代控制流程
@Component({
  template: `
    @if (user()) {
      <div>Welcome, {{ user()!.name }}</div>
    } @else {
      <div>Please login</div>
    }

    @for (item of items(); track item.id) {
      <div>{{ item.name }}</div>
    }

    @defer (on viewport) {
      <heavy-component />
    } @placeholder {
      <div>Loading...</div>
    }
  `
})
```

### 4. Typed Forms

- ✅ 使用 `FormControl<T>` 定義表單類型
- ✅ 使用 `FormGroup<T>` 定義表單組類型
- ✅ 避免使用非類型化的表單
- ✅ 使用 `NonNullableFormBuilder` 避免空值問題

```typescript
// ✅ 正確：Typed Forms
interface UserForm {
  name: FormControl<string>;
  email: FormControl<string>;
  age: FormControl<number>;
}

@Component({
  selector: 'app-user-form',
  standalone: true
})
export class UserFormComponent {
  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group<UserForm>({
    name: this.fb.control(''),
    email: this.fb.control(''),
    age: this.fb.control(0)
  });
}
```

### 5. 性能優化

- ✅ 使用 `OnPush` 變更檢測策略
- ✅ 使用 `trackBy` 函數優化列表渲染
- ✅ 使用 `@defer` 延遲加載重型組件
- ✅ 避免在模板中使用函數調用

## 自動化檢查

### Pre-commit 檢查

```bash
# Angular 檢查
yarn lint

# 格式化檢查
yarn format:check
```

### Pull Request 檢查

在 Pull Request 中，代理會自動執行：

1. Angular 組件結構檢查
2. Signals 使用規範檢查
3. 現代控制流程驗證
4. 性能優化建議

## 常見問題

### 如何遷移舊組件到 Standalone？

```typescript
// ❌ 舊：NgModule
@NgModule({
  declarations: [OldComponent],
  imports: [CommonModule, FormsModule]
})
export class OldModule {}

// ✅ 新：Standalone
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-old',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `...`
})
export class OldComponent {}
```

### 如何使用 Signal Inputs？

```typescript
// ✅ Angular 20+ Signal Inputs
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  template: `
    <div>{{ name() }}</div>
    <button (click)="handleClick()">Click</button>
  `
})
export class UserComponent {
  // Signal Input
  name = input.required<string>();
  age = input<number>(0);

  // Signal Output
  userClick = output<void>();

  handleClick() {
    this.userClick.emit();
  }
}
```

## 參考資源

  - [Angular 官方文檔](https://angular.dev/)
  - [Angular Signals 指南](https://angular.dev/guide/signals)
  - [專案 Angular 規範](../../../.cursor/rules/angular.mdc)
  - [SHARED_IMPORTS 使用指南](../../../docs/45-SHARED_IMPORTS-使用指南.md)

---

**最後更新**：2025-11-15  
**代理版本**：v1.0
