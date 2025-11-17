import { Database } from '@core';

/**
 * 机器人系统数据模型
 *
 * 对应数据库表：
 * - bots: 机器人定义表
 * - bot_tasks: 机器人任务表
 * - bot_execution_logs: 机器人执行日志表
 *
 * @module shared/models/bot
 */

/**
 * Bot 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Bot = Database['public']['Tables']['bots']['Row'];
export type BotInsert = Database['public']['Tables']['bots']['Insert'];
export type BotUpdate = Database['public']['Tables']['bots']['Update'];

/**
 * BotTask 实体类型（camelCase）
 */
export type BotTask = Database['public']['Tables']['bot_tasks']['Row'];
export type BotTaskInsert = Database['public']['Tables']['bot_tasks']['Insert'];
export type BotTaskUpdate = Database['public']['Tables']['bot_tasks']['Update'];

/**
 * BotExecutionLog 实体类型（camelCase）
 */
export type BotExecutionLog = Database['public']['Tables']['bot_execution_logs']['Row'];
export type BotExecutionLogInsert = Database['public']['Tables']['bot_execution_logs']['Insert'];
export type BotExecutionLogUpdate = Database['public']['Tables']['bot_execution_logs']['Update'];
