import type { PhysicalLocation, SpatialRelationships } from '@models';

export function createDefaultPhysicalLocation(): PhysicalLocation {
  return {
    location: {
      site: '',
      building: '',
      floor: '',
      zone: '',
      room: '',
      equipment: '',
      fullPath: ''
    }
  };
}

export function createDefaultSpatialRelationships(): SpatialRelationships {
  return {
    spatialRelations: {
      adjacentTasks: [],
      overlappingTasks: [],
      accessPath: [],
      requiredClearance: 0,
      constraints: [],
      spatialConflicts: []
    }
  };
}

export function mergePhysicalLocation(existing: PhysicalLocation | undefined, patch: Partial<PhysicalLocation>): PhysicalLocation {
  const base = existing ?? createDefaultPhysicalLocation();
  const patchLocation = (patch.location ?? {}) as Partial<PhysicalLocation['location']>;

  const mergedLocation = {
    ...base.location,
    ...patchLocation
  };

  const normalizedLocation: PhysicalLocation['location'] = {
    ...mergedLocation,
    site: mergedLocation.site ?? '',
    building: mergedLocation.building ?? '',
    floor: mergedLocation.floor ?? '',
    zone: mergedLocation.zone ?? '',
    room: mergedLocation.room ?? '',
    equipment: mergedLocation.equipment ?? '',
    fullPath: mergedLocation.fullPath ?? ''
  };

  if (patchLocation.coordinates !== undefined) {
    normalizedLocation.coordinates = patchLocation.coordinates;
  }

  if (patchLocation.bimElementId !== undefined) {
    normalizedLocation.bimElementId = patchLocation.bimElementId;
  }

  if (patchLocation.bimModel !== undefined) {
    normalizedLocation.bimModel = patchLocation.bimModel;
  }

  if (patchLocation.bimVersion !== undefined) {
    normalizedLocation.bimVersion = patchLocation.bimVersion;
  }

  if (patchLocation.area !== undefined) {
    normalizedLocation.area = patchLocation.area;
  }

  if (patchLocation.volume !== undefined) {
    normalizedLocation.volume = patchLocation.volume;
  }

  if (patchLocation.ceilingHeight !== undefined) {
    normalizedLocation.ceilingHeight = patchLocation.ceilingHeight;
  }

  return {
    location: normalizedLocation
  };
}

export function ensureFullPath(location: PhysicalLocation): PhysicalLocation {
  const loc = location.location;
  const pathParts = [loc.site, loc.building, loc.floor, loc.zone, loc.room, loc.equipment].filter(
    part => typeof part === 'string' && part.length > 0
  );
  const fullPath = pathParts.join(' > ');

  return {
    location: {
      ...loc,
      fullPath: fullPath || loc.fullPath || ''
    }
  };
}

export function mergeSpatialRelationships(
  existing: SpatialRelationships | undefined,
  patch: Partial<SpatialRelationships>
): SpatialRelationships {
  const base = existing ?? createDefaultSpatialRelationships();
  const patchRelations = patch.spatialRelations ?? {};
  const merged = {
    ...base.spatialRelations,
    ...patchRelations
  };

  return {
    spatialRelations: {
      adjacentTasks: merged.adjacentTasks ?? [],
      overlappingTasks: merged.overlappingTasks ?? [],
      accessPath: merged.accessPath ?? [],
      requiredClearance: merged.requiredClearance ?? 0,
      workArea: merged.workArea,
      constraints: merged.constraints ?? [],
      spatialConflicts: merged.spatialConflicts ?? []
    }
  };
}
