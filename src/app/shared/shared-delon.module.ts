// ========== @delon/abc 組件模組 ==========
// 文本超出省略顯示 — https://ng-alain.com/components/ellipsis
import { AutoFocusModule } from '@delon/abc/auto-focus';
import { CellModule } from '@delon/abc/cell';
import { CountDownModule } from '@delon/abc/count-down';
import { DatePickerModule } from '@delon/abc/date-picker';
import { DownFileDirective } from '@delon/abc/down-file';
import { EllipsisComponent } from '@delon/abc/ellipsis';
// 頁面底部操作工具欄 — https://ng-alain.com/components/footer-toolbar
import { ErrorCollectModule } from '@delon/abc/error-collect';
import { ExceptionModule } from '@delon/abc/exception';
import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
// 內容區全屏/填充切換 — https://ng-alain.com/components/full-content
import { FullContentModule } from '@delon/abc/full-content';
// 頁面標題區（麵包屑、操作區） — https://ng-alain.com/components/page-header
import { GlobalFooterModule } from '@delon/abc/global-footer';
import { HotkeyModule } from '@delon/abc/hotkey';
import { LoadingModule } from '@delon/abc/loading';
import { MediaModule } from '@delon/abc/media';
import { NoticeIconModule } from '@delon/abc/notice-icon';
import { OnboardingModule } from '@delon/abc/onboarding';
import { PageHeaderModule } from '@delon/abc/page-header';
// SE：簡潔表單佈局（快速排版表單項） — https://ng-alain.com/components/se
import { PdfModule } from '@delon/abc/pdf';
import { QuickMenuModule } from '@delon/abc/quick-menu';
import { ReuseTabModule } from '@delon/abc/reuse-tab';
import { SEModule } from '@delon/abc/se';
// ST：Smart Table 智能表格 — https://ng-alain.com/components/st
import { SGModule } from '@delon/abc/sg';
import { STModule } from '@delon/abc/st';
// SV：簡單視圖，用於鍵值描述展示 — https://ng-alain.com/components/sv
import { SVModule } from '@delon/abc/sv';
// Tag 多選與展開/收起選擇器 — https://ng-alain.com/components/tag-select
import { TagSelectComponent } from '@delon/abc/tag-select';
// 自動聚焦指令 — https://ng-alain.com/components/auto-focus
// 日期選擇器 — https://ng-alain.com/components/date-picker
// 錯誤收集組件 — https://ng-alain.com/components/error-collect
// 快捷鍵指令 — https://ng-alain.com/components/hotkey
// 加載組件 — https://ng-alain.com/components/loading
// 媒體組件 — https://ng-alain.com/components/media
// 簡單網格組件 — https://ng-alain.com/components/sg
// Excel 導出指令 — https://ng-alain.com/components/xlsx
import { XlsxModule } from '@delon/abc/xlsx';
// PDF 查看器組件 — https://ng-alain.com/components/pdf
// ReuseTab 標籤頁（路由快取） — https://ng-alain.com/components/reuse-tab
// 引導式操作 — https://ng-alain.com/components/onboarding
// 快捷菜單 — https://ng-alain.com/components/quick-menu
// 倒計時 — https://ng-alain.com/components/count-down
// 全局頁腳 — https://ng-alain.com/components/global-footer
// 異常頁面 — https://ng-alain.com/components/exception
// 通知圖標 — https://ng-alain.com/components/notice-icon
// 下載文件指令 — https://ng-alain.com/components/down-file
// ACL 訪問控制指令（顯示/隱藏/條件） — https://ng-alain.com/acl
import { ACLDirective, ACLIfDirective } from '@delon/acl';
// 動態表單（基於 JSON Schema 的表單生成與驗證） — https://ng-alain.com/form
// ========== @delon/util 管道模組 ==========
// 金額/貨幣格式化管道 — https://ng-alain.com/util
// 圖表組件 — https://ng-alain.com/docs/chart
// 注意：@delon/chart 必須從子模組導入，而非從 @delon/chart 直接導入
// 柱狀圖 — https://ng-alain.com/chart/bar
import { G2BarModule } from '@delon/chart/bar';
// 圖表卡片 — https://ng-alain.com/chart/card
import { G2CardModule } from '@delon/chart/card';
// ECharts 圖表 — https://ng-alain.com/chart/chart-echarts
import { ChartEChartsModule } from '@delon/chart/chart-echarts';
// 儀表盤 — https://ng-alain.com/chart/gauge
import { G2GaugeModule } from '@delon/chart/gauge';
// 迷你面積圖 — https://ng-alain.com/chart/mini-area
import { G2MiniAreaModule } from '@delon/chart/mini-area';
// 迷你柱狀圖 — https://ng-alain.com/chart/mini-bar
import { G2MiniBarModule } from '@delon/chart/mini-bar';
// 迷你進度條 — https://ng-alain.com/chart/mini-progress
import { G2MiniProgressModule } from '@delon/chart/mini-progress';
// 數據文本 — https://ng-alain.com/chart/number-info
import { NumberInfoModule } from '@delon/chart/number-info';
// 餅圖 — https://ng-alain.com/chart/pie
import { G2PieModule } from '@delon/chart/pie';
// 雷達圖 — https://ng-alain.com/chart/radar
import { G2RadarModule } from '@delon/chart/radar';
// 單一柱狀圖 — https://ng-alain.com/chart/single-bar
import { G2SingleBarModule } from '@delon/chart/single-bar';
// 標籤雲 — https://ng-alain.com/chart/tag-cloud
import { G2TagCloudModule } from '@delon/chart/tag-cloud';
// 時間軸 — https://ng-alain.com/chart/timeline
import { G2TimelineModule } from '@delon/chart/timeline';
// 趨勢標記 — https://ng-alain.com/chart/trend
import { TrendModule } from '@delon/chart/trend';
// 水波圖 — https://ng-alain.com/chart/water-wave
import { G2WaterWaveModule } from '@delon/chart/water-wave';
import { DelonFormModule } from '@delon/form';
import { HTMLPipe, KeysPipe, URLPipe, YNPipe } from '@delon/theme';
import { LayoutDefaultModule } from '@delon/theme/layout-default';
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
// @delon/theme 管道 — https://ng-alain.com/theme
// @delon/util 管道 — https://ng-alain.com/util
import {
  CurrencyCNYPipe, // 金額格式化（模板使用: `{{ value | price }}`）
  CurrencyMegaPipe,
  CurrencyPricePipe, // 格式掩碼（模板使用: `{{ value | mask:'###-####' }}`）
  FilterPipe, // 數組過濾（模板使用: `{{ array | filter:matcher }}`）

  // 人民幣格式化（模板使用: `{{ value | cny }}`）
  FormatMaskPipe
} from '@delon/util';
// ========== @delon/theme 組件模組 ==========
// 默認佈局 — https://ng-alain.com/theme/layout-default
// 設置抽屜 — https://ng-alain.com/theme/setting-drawer
// 主題切換按鈕 — https://ng-alain.com/theme/theme-btn

// ========== @delon/cache 緩存服務 ==========
// 緩存服務 — https://ng-alain.com/cache
// 注意：provideDelonCache 需要從 @delon/cache 直接導入，因為它不在類型定義中
export { CACHE, CacheService, httpCacheInterceptor } from '@delon/cache';
export type { CacheNotifyResult, CacheNotifyType, CacheOptions, ICache, ICacheStore } from '@delon/cache';

// ========== @delon/abc/st 智能表格類型 ==========
// ST 表格列配置類型 — https://ng-alain.com/components/st
export type {
  STChange,
  STChangeType,
  STClickRowClassNameType,
  STColumn,
  STColumnButton,
  STColumnSelection,
  STData,
  STExportOptions,
  STIcon,
  STMultiSort,
  STPage,
  STReq,
  STRes,
  STRowClassName,
  STSingleSort,
  STStatistical,
  STWidthMode
} from '@delon/abc/st';

// ========== @delon/theme 服務和類型 ==========
// 主題服務和類型 — https://ng-alain.com/theme
export { DatePipe as DelonDatePipe, I18nPipe, MenuService, SettingsService } from '@delon/theme';
export type { Menu, MenuIcon, MenuInner, SettingsNotify, User } from '@delon/theme';
export type { LayoutDefaultOptions } from '@delon/theme/layout-default';

// ========== @delon/auth 認證服務和類型 ==========
// 認證服務和類型 — https://ng-alain.com/auth
export {
  ALLOW_ANONYMOUS,
  authJWTCanActivate,
  authJWTCanActivateChild,
  authJWTCanMatch,
  authJWTInterceptor,
  authSimpleCanActivate,
  authSimpleCanActivateChild,
  authSimpleCanMatch,
  authSimpleInterceptor,
  DA_SERVICE_TOKEN,
  provideAuth,
  SocialService,
  TokenService,
  withCookie,
  withLocalStorage,
  withMemoryStorage,
  withSessionStorage
} from '@delon/auth';
export type { AuthReferrer, IStore, ITokenModel, ITokenService, JWT, JWTTokenModel, SimpleTokenModel, SocialOpenType } from '@delon/auth';

// ========== @delon/acl 訪問控制服務和類型 ==========
// ACL 服務和類型 — https://ng-alain.com/acl
export { aclCanActivate, aclCanActivateChild, aclCanMatch, ACLGuardService, ACLService } from '@delon/acl';
export type { ACLCanType, ACLGuardData, ACLGuardFunctionType, ACLGuardType, ACLType } from '@delon/acl';

// ========== @delon/util 工具類型 ==========
// 工具類型 — https://ng-alain.com/util
export type { AlainConfig } from '@delon/util/config';

// ========== @delon/abc/lodop 打印服務 ==========
// 打印服務 — https://ng-alain.com/components/lodop
export { LodopModule, LodopService } from '@delon/abc/lodop';
export type { CLodop, Lodop, LodopPrintResult, LodopResult, LodopStyleValue } from '@delon/abc/lodop';

// ========== @delon/abc/zip 壓縮服務 ==========
// 壓縮服務 — https://ng-alain.com/components/zip
export { ZipService } from '@delon/abc/zip';
export type { ZipSaveOptions, ZipWriteOptions } from '@delon/abc/zip';

// ========== @delon/abc/cell 和 @delon/abc/st Provider 函數 ==========
// Provider 函數 — 用於配置 Widget
export { provideCellWidgets } from '@delon/abc/cell';
export { provideSTWidgets } from '@delon/abc/st';

// ========== @delon/form 動態表單類型和函數 ==========
// 動態表單類型和函數 — https://ng-alain.com/form
export { ControlWidget, provideSFConfig, SFComponent } from '@delon/form';
export type {
  ControlUIWidget,
  ErrorData,
  ErrorSchema,
  SFCustomWidgetSchema,
  SFFormValueChange,
  SFGridSchema,
  SFGridSizeSchema,
  SFHorizontalLayoutSchema,
  SFLayout,
  SFMode,
  SFObjectWidgetRenderType,
  SFObjectWidgetSchema,
  SFOptionalHelp,
  SFPlacement,
  SFRenderButton,
  SFRenderSchema,
  SFSchema,
  SFSchemaDefinition,
  SFSchemaEnum,
  SFSchemaEnumType,
  SFSchemaI18n,
  SFSchemaType,
  SFTrigger,
  SFUISchema,
  SFUISchemaItem,
  SFUISchemaItemRun,
  SFUpdateValueAndValidity,
  SFValue,
  SFValueChange,
  SFVisibleIf,
  SFVisibleIfReturn,
  SFWidgetProvideConfig
} from '@delon/form';

export const SHARED_DELON_MODULES = [
  // ========== @delon/form 動態表單 ==========
  DelonFormModule, // 動態表單（基於 JSON Schema） — https://ng-alain.com/form

  // ========== @delon/abc 組件模組 ==========
  CellModule, // 單元格渲染 — https://ng-alain.com/components/cell/zh
  STModule, // 智能表格 — https://ng-alain.com/components/st
  SVModule, // 鍵值描述視圖 — https://ng-alain.com/components/sv
  SEModule, // 表單佈局 — https://ng-alain.com/components/se
  PageHeaderModule, // 頁面標題/操作 — https://ng-alain.com/components/page-header
  EllipsisComponent, // 文本省略 — https://ng-alain.com/components/ellipsis
  FooterToolbarModule, // 底部工具欄 — https://ng-alain.com/components/footer-toolbar
  FullContentModule, // 全屏內容 — https://ng-alain.com/components/full-content
  ReuseTabModule, // 標籤頁（路由快取） — https://ng-alain.com/components/reuse-tab
  TagSelectComponent, // 標籤選擇 — https://ng-alain.com/components/tag-select
  OnboardingModule, // 引導式操作 — https://ng-alain.com/components/onboarding
  QuickMenuModule, // 快捷菜單 — https://ng-alain.com/components/quick-menu
  CountDownModule, // 倒計時 — https://ng-alain.com/components/count-down
  GlobalFooterModule, // 全局頁腳 — https://ng-alain.com/components/global-footer
  ExceptionModule, // 異常頁面 — https://ng-alain.com/components/exception
  NoticeIconModule, // 通知圖標 — https://ng-alain.com/components/notice-icon
  DownFileDirective, // 下載文件指令 — https://ng-alain.com/components/down-file
  AutoFocusModule, // 自動聚焦指令 — https://ng-alain.com/components/auto-focus
  DatePickerModule, // 日期選擇器 — https://ng-alain.com/components/date-picker
  ErrorCollectModule, // 錯誤收集組件 — https://ng-alain.com/components/error-collect
  HotkeyModule, // 快捷鍵指令 — https://ng-alain.com/components/hotkey
  LoadingModule, // 加載組件 — https://ng-alain.com/components/loading
  MediaModule, // 媒體組件 — https://ng-alain.com/components/media
  SGModule, // 簡單網格組件 — https://ng-alain.com/components/sg
  XlsxModule, // Excel 導出指令 — https://ng-alain.com/components/xlsx
  PdfModule, // PDF 查看器組件 — https://ng-alain.com/components/pdf

  // ========== @delon/acl 訪問控制指令 ==========
  ACLDirective, // ACL 指令 — https://ng-alain.com/acl
  ACLIfDirective, // 條件 ACL 指令 — https://ng-alain.com/acl

  // ========== @delon/util 管道 ==========
  CurrencyPricePipe, // 金額格式化（模板使用: `{{ value | price }}`） — https://ng-alain.com/util
  CurrencyMegaPipe, // 大數字格式化（模板使用: `{{ value | mega }}`） — https://ng-alain.com/util
  CurrencyCNYPipe, // 人民幣格式化（模板使用: `{{ value | cny }}`） — https://ng-alain.com/util
  FormatMaskPipe, // 格式掩碼（模板使用: `{{ value | mask:'###-####' }}`） — https://ng-alain.com/util
  FilterPipe, // 數組過濾（模板使用: `{{ array | filter:matcher }}`） — https://ng-alain.com/util

  // ========== @delon/theme 組件模組 ==========
  LayoutDefaultModule, // 默認佈局 — https://ng-alain.com/theme/layout-default
  SettingDrawerModule, // 設置抽屜 — https://ng-alain.com/theme/setting-drawer
  ThemeBtnComponent, // 主題切換按鈕 — https://ng-alain.com/theme/theme-btn
  // ========== @delon/theme 管道 ==========
  HTMLPipe, // HTML 渲染管道（模板使用: `{{ value | html }}`） — https://ng-alain.com/theme
  URLPipe, // URL 管道（模板使用: `{{ value | url }}`） — https://ng-alain.com/theme
  YNPipe, // 是/否管道（模板使用: `{{ value | yn }}`） — https://ng-alain.com/theme
  KeysPipe, // 鍵值管道（模板使用: `{{ obj | keys }}`） — https://ng-alain.com/theme

  // ========== @delon/chart 圖表模組套件 ==========
  G2BarModule, // 柱狀圖 — https://ng-alain.com/chart/bar
  G2CardModule, // 圖表卡片 — https://ng-alain.com/chart/card
  ChartEChartsModule, // ECharts 圖表 — https://ng-alain.com/chart/chart-echarts
  G2GaugeModule, // 儀表盤 — https://ng-alain.com/chart/gauge
  G2MiniAreaModule, // 迷你面積圖 — https://ng-alain.com/chart/mini-area
  G2MiniBarModule, // 迷你柱狀圖 — https://ng-alain.com/chart/mini-bar
  G2MiniProgressModule, // 迷你進度條 — https://ng-alain.com/chart/mini-progress
  NumberInfoModule, // 數據文本 — https://ng-alain.com/chart/number-info
  G2PieModule, // 餅圖 — https://ng-alain.com/chart/pie
  G2RadarModule, // 雷達圖 — https://ng-alain.com/chart/radar
  G2SingleBarModule, // 單一柱狀圖 — https://ng-alain.com/chart/single-bar
  G2TagCloudModule, // 標籤雲 — https://ng-alain.com/chart/tag-cloud
  G2TimelineModule, // 時間軸 — https://ng-alain.com/chart/timeline
  TrendModule, // 趨勢標記 — https://ng-alain.com/chart/trend
  G2WaterWaveModule // 水波圖 — https://ng-alain.com/chart/water-wave
];
