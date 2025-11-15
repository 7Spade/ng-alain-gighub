import { TaskStatus } from '@models';

import {
  calculatePercentageFromSnapshot,
  clampPercentage,
  createSnapshotRecord,
  defaultProgressSnapshot,
  deriveStatusFromSnapshot,
  normalizeQuantitySnapshot
} from '../progress.domain';

describe('Progress Domain', () => {
  it('normalizes quantity input with bounds', () => {
    const snapshot = normalizeQuantitySnapshot({
      unit: 'pcs',
      planned: -10,
      installed: 15,
      used: 20
    });

    expect(snapshot.unit).toBe('pcs');
    expect(snapshot.planned).toBe(1);
    expect(snapshot.installed).toBe(1);
    expect(snapshot.used).toBe(1);
  });

  it('calculates percentage with clamping', () => {
    const snapshot = defaultProgressSnapshot();
    snapshot.planned = 50;
    snapshot.installed = 75;

    expect(calculatePercentageFromSnapshot(snapshot)).toBe(100);
    expect(clampPercentage(-5)).toBe(0);
    expect(clampPercentage(105)).toBe(100);
  });

  it('derives status from snapshot and creates snapshot record', () => {
    const snapshot = defaultProgressSnapshot();
    snapshot.planned = 10;
    snapshot.installed = 10;

    expect(deriveStatusFromSnapshot(snapshot)).toBe(TaskStatus.COMPLETED);

    const timestamp = new Date();
    const record = createSnapshotRecord(snapshot, timestamp);
    expect(record.planned).toBe(10);
    expect(record.installed).toBe(10);
    expect(record.lastUpdatedAt).toBeDefined();
  });
});
