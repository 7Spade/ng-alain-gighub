/**
 * 实时功能相关类型定义（基础设施层）
 *
 * 这些类型被 Repository 层和 Facade 层使用，因此放在 core 层
 * 符合分层架构：core 不依赖 shared
 *
 * @module core/infra/types
 */

import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

/**
 * 订阅配置
 */
export interface SubscriptionConfig {
  /** Subscription ID (auto-generated if not provided) */
  id?: string;
  /** Table name to subscribe to */
  table?: string;
  /** Schema name (default: 'public') */
  schema?: string;
  /** Filter string (e.g., 'blueprint_id=eq.123') */
  filter?: string;
  /** Event types to listen for (default: all) */
  events?: Array<'INSERT' | 'UPDATE' | 'DELETE' | '*'>;
  /** Channel name for broadcast/presence */
  channelName?: string;
}

/**
 * 订阅信息
 */
export interface SubscriptionInfo {
  /** Subscription ID */
  id: string;
  /** Subscription type */
  type: 'table' | 'broadcast' | 'presence';
  /** Channel instance */
  channel: RealtimeChannel;
  /** Configuration used */
  config: SubscriptionConfig;
  /** Subscription status */
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  /** Created timestamp */
  createdAt: Date;
}

/**
 * 实时连接状态
 */
export enum RealtimeConnectionStatus {
  /** 未连接 */
  DISCONNECTED = 'disconnected',
  /** 连接中 */
  CONNECTING = 'connecting',
  /** 已连接 */
  CONNECTED = 'connected',
  /** 错误 */
  ERROR = 'error'
}

/**
 * 实时事件类型
 */
export enum RealtimeEventType {
  /** 插入 */
  INSERT = 'INSERT',
  /** 更新 */
  UPDATE = 'UPDATE',
  /** 删除 */
  DELETE = 'DELETE',
  /** 所有事件 */
  ALL = '*'
}

/**
 * 实时订阅回调函数类型
 */
export type RealtimeCallback<T extends Record<string, any> = any> = (payload: RealtimePostgresChangesPayload<T>) => void;

/**
 * 广播消息回调函数类型
 */
export type BroadcastCallback = (event: string, payload: any) => void;

/**
 * Presence 状态回调函数类型
 */
export type PresenceCallback = (state: any, metadata: any) => void;
