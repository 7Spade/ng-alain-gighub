import type { PhysicalLocation, SpatialRelationships } from '@models';

import {
  createDefaultPhysicalLocation,
  createDefaultSpatialRelationships,
  ensureFullPath,
  mergePhysicalLocation,
  mergeSpatialRelationships
} from '../location.domain';

describe('Location Domain', () => {
  it('creates default physical location', () => {
    const location = createDefaultPhysicalLocation();
    expect(location.location.site).toBe('');
    expect(location.location.fullPath).toBe('');
  });

  it('merges physical location updates and builds full path', () => {
    const existing: PhysicalLocation = {
      location: {
        site: 'Site A',
        building: 'B1',
        floor: '3F',
        zone: '',
        room: '',
        equipment: '',
        fullPath: ''
      }
    };

    const patch: Partial<PhysicalLocation> = {
      location: {
        ...existing.location,
        zone: 'North',
        room: '301'
      }
    };

    const merged = mergePhysicalLocation(existing, patch);
    const withPath = ensureFullPath(merged);

    expect(withPath.location.zone).toBe('North');
    expect(withPath.location.fullPath).toContain('Site A');
    expect(withPath.location.fullPath).toContain('North');
  });

  it('creates default spatial relationships and merges updates', () => {
    const base = createDefaultSpatialRelationships();
    expect(base.spatialRelations.adjacentTasks.length).toBe(0);

    const patch: Partial<SpatialRelationships> = {
      spatialRelations: {
        ...base.spatialRelations,
        adjacentTasks: [{ taskId: 't-1', distance: 5, direction: 'north' }],
        requiredClearance: 2
      }
    };

    const merged = mergeSpatialRelationships(base, patch);
    expect(merged.spatialRelations.adjacentTasks[0]?.taskId).toBe('t-1');
    expect(merged.spatialRelations.requiredClearance).toBe(2);
  });
});
