// Angular Common 管道與指令 — https://angular.dev/guide/pipes
import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  I18nPluralPipe,
  I18nSelectPipe,
  JsonPipe,
  KeyValuePipe,
  LowerCasePipe,
  NgClass,
  NgComponentOutlet,
  NgStyle,
  NgTemplateOutlet,
  PercentPipe,
  SlicePipe,
  TitleCasePipe,
  UpperCasePipe
} from '@angular/common';
// 表單模組（模板式 / 響應式） — https://angular.dev/guide/forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// 路由（RouterLink/RouterOutlet） — https://angular.dev/guide/routing
import { RouterOutlet, RouterLink } from '@angular/router';
// @delon/theme 管道（I18n/Date） — https://ng-alain.com/theme
// 注意：@delon/theme 的 DatePipe 在模板中使用 `_date` pipe，Angular Common 的 DatePipe 使用 `date` pipe
import { DatePipe as DelonDatePipe, I18nPipe } from '@delon/theme';

import { SHARED_DELON_MODULES } from './shared-delon.module';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';

export const SHARED_IMPORTS = [
  // ========== Angular 表單模組 ==========
  FormsModule, // 模板式表單 — https://angular.dev/guide/forms#template-driven-forms
  ReactiveFormsModule, // 響應式表單 — https://angular.dev/guide/forms#reactive-forms

  // ========== Angular 路由 ==========
  RouterLink, // 路由連結指令 — https://angular.dev/guide/routing#routerlink
  RouterOutlet, // 路由插座 — https://angular.dev/guide/routing#routeroutlet
  NgTemplateOutlet, // 動態嵌入模板 — https://angular.dev/api/common/NgTemplateOutlet
  NgComponentOutlet, // 動態組件嵌入 — https://angular.dev/api/common/NgComponentOutlet

  // ========== Angular Common 標準管道 ==========
  DatePipe, // 日期格式化（模板使用: `{{ value | date }}`） — https://angular.dev/api/common/DatePipe
  CurrencyPipe, // 貨幣格式化（模板使用: `{{ value | currency }}`） — https://angular.dev/api/common/CurrencyPipe
  DecimalPipe, // 數字格式化（模板使用: `{{ value | number }}`） — https://angular.dev/api/common/DecimalPipe
  PercentPipe, // 百分比格式化（模板使用: `{{ value | percent }}`） — https://angular.dev/api/common/PercentPipe
  LowerCasePipe, // 轉小寫（模板使用: `{{ value | lowercase }}`） — https://angular.dev/api/common/LowerCasePipe
  UpperCasePipe, // 轉大寫（模板使用: `{{ value | uppercase }}`） — https://angular.dev/api/common/UpperCasePipe
  TitleCasePipe, // 標題大小寫（模板使用: `{{ value | titlecase }}`） — https://angular.dev/api/common/TitleCasePipe
  SlicePipe, // 陣列/字串切片（模板使用: `{{ value | slice:start:end }}`） — https://angular.dev/api/common/SlicePipe
  KeyValuePipe, // 鍵值對遍歷（模板使用: `@for (item of obj | keyvalue)`） — https://angular.dev/api/common/KeyValuePipe
  JsonPipe, // 物件轉 JSON 字串（模板使用: `{{ value | json }}`） — https://angular.dev/api/common/JsonPipe
  AsyncPipe, // 觀察值/Promise 非同步解包（模板使用: `{{ value$ | async }}`） — https://angular.dev/api/common/AsyncPipe
  I18nPluralPipe, // 複數形式映射（模板使用: `{{ count | i18nPlural:mapping }}`） — https://angular.dev/api/common/I18nPluralPipe
  I18nSelectPipe, // 鍵值映射選擇（模板使用: `{{ value | i18nSelect:mapping }}`） — https://angular.dev/api/common/I18nSelectPipe
  NgClass, // 動態 CSS 類（模板使用: `[ngClass]="..."`） — https://angular.dev/api/common/NgClass
  NgStyle, // 動態內聯樣式（模板使用: `[ngStyle]="..."`） — https://angular.dev/api/common/NgStyle

  // ========== @delon/theme 管道 ==========
  I18nPipe, // 國際化翻譯管道（模板使用: `{{ key | i18n }}`） — https://ng-alain.com/theme
  DelonDatePipe, // @delon/theme 日期管道（模板使用: `{{ value | _date }}`） — https://ng-alain.com/theme

  // ========== @delon 組件/指令集合 ==========
  // https://ng-alain.com/components
  ...SHARED_DELON_MODULES,

  // ========== ng-zorro-antd 組件集合 ==========
  // https://ng.ant.design/components/overview/zh
  ...SHARED_ZORRO_MODULES
];
