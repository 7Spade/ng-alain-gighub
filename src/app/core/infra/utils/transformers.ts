/**
 * 数据转换工具
 * 
 * 提供 snake_case ↔ camelCase 转换功能
 * 用于数据库字段名（snake_case）与 TypeScript 属性名（camelCase）之间的映射
 */

/**
 * 将 snake_case 转换为 camelCase
 */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 将 camelCase 转换为 snake_case
 */
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * 递归转换对象的键名从 snake_case 到 camelCase
 */
function convertKeysToCamelCase<T>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item)) as T;
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const converted: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = toCamelCase(key);
        converted[camelKey] = convertKeysToCamelCase(obj[key]);
      }
    }
    return converted as T;
  }

  return obj;
}

/**
 * 递归转换对象的键名从 camelCase 到 snake_case
 */
function convertKeysToSnakeCase<T extends Record<string, any>>(obj: T): Record<string, any> {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToSnakeCase(item));
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const converted: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeKey = toSnakeCase(key);
        converted[snakeKey] = convertKeysToSnakeCase(obj[key]);
      }
    }
    return converted;
  }

  return obj;
}

/**
 * 将数据库数据（snake_case）转换为应用数据（camelCase）
 * 
 * @param data 数据库数据
 * @returns 转换后的数据
 * 
 * @example
 * ```typescript
 * const dbData = { user_id: '123', created_at: '2025-01-01' };
 * const appData = toCamelCase(dbData);
 * // { userId: '123', createdAt: '2025-01-01' }
 * ```
 */
export function toCamelCaseData<T>(data: any): T {
  return convertKeysToCamelCase<T>(data);
}

/**
 * 将应用数据（camelCase）转换为数据库数据（snake_case）
 * 
 * @param data 应用数据
 * @returns 转换后的数据
 * 
 * @example
 * ```typescript
 * const appData = { userId: '123', createdAt: '2025-01-01' };
 * const dbData = toSnakeCaseData(appData);
 * // { user_id: '123', created_at: '2025-01-01' }
 * ```
 */
export function toSnakeCaseData<T extends Record<string, any>>(data: T): Record<string, any> {
  return convertKeysToSnakeCase(data);
}

