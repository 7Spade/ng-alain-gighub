/**
 * 轉化成RMB元字符串
 *
 * @param digits 當數字類型時，允許指定小數點後數字的個數，默認2位小數
 */
export function yuan(value: number | string, digits = 2): string {
  if (typeof value === 'number') {
    value = value.toFixed(digits);
  }
  return `&yen ${value}`;
}
