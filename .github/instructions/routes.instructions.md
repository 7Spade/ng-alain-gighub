---
applyTo: "src/app/routes/**/*"
---

# Routes Module Instructions

## Purpose
The `routes` module contains feature-specific components organized by business domain.

## Key Architecture

### Git-like Branching Model
This application implements a Git-like branching model for project management:
- **Blueprints** (main branch): Owner-controlled task structure
- **Blueprint Branches**: Organization-specific working branches
- **Pull Requests**: Submission and review workflow

When working in `routes/blueprint/`, understand this architecture thoroughly.

## Module Structure

Each feature module should follow this pattern:
```
routes/[feature]/
├── [feature].component.ts       # Main container
├── components/                   # Feature-specific components
├── services/                     # Feature-specific services (if not shared)
└── models/                       # Feature-specific types
```

## Dependencies
- **Can import from**: `@shared`, `@core`, `@layout`
- **Cannot import from**: other `routes/` modules
- Each route module should be independent

## Component Guidelines

### Always Use
- **Standalone components**: `standalone: true`
- **OnPush change detection**: `ChangeDetectionStrategy.OnPush`
- **SHARED_IMPORTS**: Import from `@shared` first
- **Signals**: For reactive state management
- **Typed Forms**: Use Angular's typed form APIs

### API Integration
- Use **Repository pattern** for data access
- Services should extend base repository pattern
- All database operations via **Supabase client**
- Implement proper error handling

### Example Service
```typescript
import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core';

@Injectable({ providedIn: 'root' })
export class BlueprintService {
  private supabase = inject(SupabaseService);
  
  async getAll(filters: BlueprintFilters): Promise<Blueprint[]> {
    const { data, error } = await this.supabase
      .from('blueprints')
      .select('*')
      .match(filters);
    
    if (error) throw error;
    return data;
  }
}
```

## State Management
- Use **Signals** for component state
- Use **Services with Signals** for shared state
- Avoid complex state management libraries unless necessary

## Testing
- Write unit tests for services and complex components
- Integration tests for user flows
- Minimum 80% coverage for new code

## Reference
- Module-specific rules: `.cursor/rules/routes-specific.mdc`
- API design patterns: `.cursor/rules/api-design.mdc`
- Development guidelines: `docs/00-開發作業指引.md`
