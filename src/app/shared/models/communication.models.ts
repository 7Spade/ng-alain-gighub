import { Database } from '@core';

/**
 * 协作沟通系统数据模型
 *
 * 对应数据库表：
 * - comments: 留言表
 * - notifications: 通知表
 * - notification_rules: 通知规则表
 * - notification_subscriptions: 通知订阅表
 * - personal_todos: 个人待办中心表
 * - todo_status_tracking: 待办状态追踪表
 *
 * @module shared/models/communication
 */

/**
 * Comment 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Comment = Database['public']['Tables']['comments']['Row'];
export type CommentInsert = Database['public']['Tables']['comments']['Insert'];
export type CommentUpdate = Database['public']['Tables']['comments']['Update'];

/**
 * Notification 实体类型（camelCase）
 */
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];

/**
 * NotificationRule 实体类型（camelCase）
 */
export type NotificationRule = Database['public']['Tables']['notification_rules']['Row'];
export type NotificationRuleInsert = Database['public']['Tables']['notification_rules']['Insert'];
export type NotificationRuleUpdate = Database['public']['Tables']['notification_rules']['Update'];

/**
 * NotificationSubscription 实体类型（camelCase）
 */
export type NotificationSubscription = Database['public']['Tables']['notification_subscriptions']['Row'];
export type NotificationSubscriptionInsert = Database['public']['Tables']['notification_subscriptions']['Insert'];
export type NotificationSubscriptionUpdate = Database['public']['Tables']['notification_subscriptions']['Update'];

/**
 * PersonalTodo 实体类型（camelCase）
 */
export type PersonalTodo = Database['public']['Tables']['personal_todos']['Row'];
export type PersonalTodoInsert = Database['public']['Tables']['personal_todos']['Insert'];
export type PersonalTodoUpdate = Database['public']['Tables']['personal_todos']['Update'];

/**
 * TodoStatusTracking 实体类型（camelCase）
 */
export type TodoStatusTracking = Database['public']['Tables']['todo_status_tracking']['Row'];
export type TodoStatusTrackingInsert = Database['public']['Tables']['todo_status_tracking']['Insert'];
export type TodoStatusTrackingUpdate = Database['public']['Tables']['todo_status_tracking']['Update'];
