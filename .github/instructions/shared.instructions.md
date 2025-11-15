---
applyTo: "src/app/shared/**/*"
---

# Shared Module Instructions

## Purpose
The `shared` module contains reusable components, directives, pipes, and utilities used across the application.

## Key Rules

### SHARED_IMPORTS Pattern
- **Always export through SHARED_IMPORTS** in `src/app/shared/index.ts`
- Components, directives, pipes should be added to SHARED_IMPORTS array
- Never import directly from deep paths - only from `@shared`

### Dependencies
- **ONLY import from `shared/`** - no imports from `routes/`, `layout/`, or `core/`
- This prevents circular dependencies
- Shared module must be self-contained

### Component Design
- All components must be **standalone**
- Use **OnPush change detection**: `changeDetection: ChangeDetectionStrategy.OnPush`
- Use **Angular Signals** for state management
- Components should be **generic and reusable**

### Testing
- Every shared component/service MUST have unit tests
- Target 90%+ coverage for shared module (higher than app average)
- Shared utilities must be thoroughly tested

## File Structure
```
shared/
├── components/     # Reusable UI components
├── directives/     # Custom directives
├── pipes/         # Custom pipes
├── services/      # Shared services
├── utils/         # Utility functions
├── models/        # Shared interfaces/types
├── json-schema/   # JSON schemas
└── index.ts       # SHARED_IMPORTS export
```

## Examples

### Adding a New Component
```typescript
// shared/components/my-component/my-component.component.ts
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class MyComponent {
  // Use signal inputs/outputs
  data = input<string>();
  changed = output<string>();
}
```

### Updating SHARED_IMPORTS
```typescript
// shared/index.ts
export const SHARED_IMPORTS = [
  // ... existing imports
  MyComponent  // Add new component
];
```

## Reference
- Detailed guide: `docs/45-SHARED_IMPORTS-使用指南.md`
- Module-specific rules: `.cursor/rules/shared-specific.mdc`
