import type { BlueprintDocument } from '@shared/models/blueprint.model';

let documentSequence = 0;

export function buildBlueprintDocument(overrides: Partial<BlueprintDocument> = {}): BlueprintDocument {
  documentSequence += 1;
  const type = overrides.type ?? 'file';
  const now = new Date().toISOString();

  return {
    id: overrides.id ?? `doc-${documentSequence}`,
    blueprint_id: overrides.blueprint_id ?? 'bp-test',
    name: overrides.name ?? `Document ${documentSequence}`,
    path: overrides.path ?? (type === 'directory' ? `/folder-${documentSequence}` : `/Document-${documentSequence}.pdf`),
    type,
    mime_type: overrides.mime_type ?? (type === 'file' ? 'application/pdf' : null),
    size: overrides.size ?? (type === 'file' ? 1024 : null),
    storage_path: overrides.storage_path ?? (type === 'file' ? `storage/doc-${documentSequence}` : null),
    current_version: overrides.current_version ?? (type === 'file' ? 1 : 0),
    parent_id: overrides.parent_id ?? null,
    created_by: overrides.created_by ?? 'user-test',
    created_at: overrides.created_at ?? now,
    updated_at: overrides.updated_at ?? now,
    discipline: overrides.discipline ?? null,
    phase: overrides.phase ?? null,
    package: overrides.package ?? null,
    hierarchy_path: overrides.hierarchy_path ?? null,
    metadata: overrides.metadata ?? null
  };
}
