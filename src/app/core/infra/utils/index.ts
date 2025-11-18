/**
 * 工具函数模块导出
 */
export * from './transformers';

/**
 * UUID 验证工具
 */

/**
 * UUID v4 格式正则表达式
 * 格式：xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * 其中 y 是 8、9、a 或 b 之一
 */
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * 验证字符串是否为有效的 UUID v4 格式
 *
 * @param value 要验证的字符串
 * @returns 如果是有效的 UUID，返回 true；否则返回 false
 *
 * @example
 * ```typescript
 * isValidUUID('550e8400-e29b-41d4-a716-446655440000'); // true
 * isValidUUID('users'); // false
 * isValidUUID('invalid-uuid'); // false
 * ```
 */
export function isValidUUID(value: string | null | undefined): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }
  return UUID_V4_REGEX.test(value);
}
