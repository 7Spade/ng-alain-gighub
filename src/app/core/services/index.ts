/**
 * Core 服務模組統一導出
 *
 * 提供核心層的業務服務：
 * - branch-context.service: 分支上下文服務
 * - workspace-context.service: 工作空間上下文服務（多組織、多團隊切換）
 * - error-state.service: 錯誤狀態管理服務（統一錯誤處理）
 *
 * @module core/services
 */

export * from './branch-context.service';
export * from './workspace-context.service';
// 只導出服務類，類型從 error-state.service 單獨導入以避免與 infra/errors 衝突
export { ErrorStateService } from './error-state.service';
export type {
  ErrorCategory,
  ErrorStateConfig,
  AppError as ErrorStateError,
  ErrorSeverity as ErrorStateSeverity
} from './error-state.service';
