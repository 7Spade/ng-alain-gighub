export function resolveProgressHealth(
  percent: number,
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'archived',
  lastUpdatedAt: Date | null
): { status: 'success' | 'warning' | 'processing' | 'error'; label: string } {
  if (percent >= 100 || status === 'completed') {
    return { status: 'success', label: '已完成' };
  }

  if (status === 'on-hold') {
    return { status: 'warning', label: '專案暫停' };
  }

  if (status === 'archived') {
    return { status: 'warning', label: '已歸檔' };
  }

  if (percent <= 30) {
    return { status: 'warning', label: '進度偏低，需要留意' };
  }

  if (lastUpdatedAt) {
    const daysSinceUpdate = Math.floor((Date.now() - lastUpdatedAt.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceUpdate > 14) {
      return { status: 'warning', label: `已 ${daysSinceUpdate} 天未更新` };
    }
  }

  return { status: 'processing', label: '穩定推進中' };
}
