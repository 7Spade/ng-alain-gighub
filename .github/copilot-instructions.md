# GitHub Copilot Instructions for ng-alain-github

> **Purpose**: This file provides GitHub Copilot coding agent with essential context about this repository's architecture, coding standards, and development practices.

## 📋 Project Overview

**Project**: ng-alain-github - Enterprise Angular admin panel framework  
**Tech Stack**: Angular 20.3.x + NG-ZORRO 20.3.x + NG-ALAIN 20.0.x + Supabase  
**Architecture**: Git-like branching model with 51-table database structure  
**Package Manager**: Yarn (required)  
**Authentication**: ✅ Supabase Auth + @delon/auth integrated (implemented)

## 🏗️ Architecture Overview

### Authentication System (✅ Implemented)

The system uses **Supabase Auth** as the underlying authentication service, integrated with **@delon/auth** for frontend authentication:

- **Supabase Auth**: Backend authentication (signIn, signUp, signOut, Session management)
- **SupabaseSessionAdapter**: Converts Supabase Session to @delon/auth Token format
- **@delon/auth**: Frontend auth framework (TokenService, route guards, HTTP interceptors)
- **AuthService**: Business layer service integrating Supabase Auth with AccountRepository
- **AuthStateService**: Authentication state management using Angular Signals

**Implementation locations**:
- `src/app/shared/services/auth/` - AuthService, AuthStateService, types
- `src/app/core/supabase/supabase-session-adapter.service.ts` - Session adapter
- `src/app/core/repositories/account.repository.ts` - Account data access

**Authentication flow**:
1. User logs in via Supabase Auth (signInWithPassword)
2. SupabaseSessionAdapter converts Session to Token format
3. Syncs to TokenService for @delon system (route guards, interceptors)
4. Loads user Account data from `accounts` table
5. Updates AuthStateService with user state

**Reference**: `docs/13-帳戶層流程圖.mermaid.md`, `docs/14-業務流程圖.mermaid.md`

### Git-like Branching Model

This system implements a Git-like branching model for collaborative project management:

- **Main Branch (blueprints)**: Owner has full control over task structure
- **Organization Branches (blueprint_branches)**: Collaborating organizations can only fill in assignment fields
- **Pull Requests**: Submit execution data → Owner review → Merge updates
- **Permission Separation**: Owners modify task structure; collaborators fill assignment fields only

**Key Documents**:
- Full architecture: `docs/27-完整架構流程圖.mermaid.md`
- Architecture review: `docs/28-架構審查報告.md`
- Account layer flows: `docs/13-帳戶層流程圖.mermaid.md`

### Database Structure (51 Tables, 11 Modules)

1. **🔐 Account & Identity** (4 tables): accounts, teams, team_members, organization_schedules
2. **🤝 Organization Collaboration** (3 tables): organization_collaborations, collaboration_invitations, collaboration_members
3. **🔒 Permissions** (5 tables): roles, user_roles, permissions, role_permissions, branch_permissions
4. **🎯 Blueprint/Project** (5 tables): blueprints, blueprint_configs, blueprint_branches, branch_forks, pull_requests
5. **📋 Task Execution** (9 tables): tasks, task_assignments, task_lists, task_staging, daily_reports, report_photos, weather_cache, task_dependencies, task_templates
6. **✅ Quality Assurance** (4 tables): quality_checks, qc_photos, inspections, inspection_photos
7. **⚠️ Issue Tracking** (4 tables): issues, issue_assignments, issue_photos, issue_sync_logs
8. **💬 Collaboration** (6 tables): comments, notifications, notification_rules, notification_subscriptions, personal_todos, todo_status_tracking
9. **📊 Data Analysis** (6 tables): documents, document_versions, document_thumbnails, progress_tracking, activity_logs, analytics_cache
10. **🤖 Bot System** (3 tables): bots, bot_tasks, bot_execution_logs
11. **⚙️ System Management** (2 tables): settings, feature_flags

**Full schema**: `docs/30-0-完整SQL表結構定義.md`

### Core Design Principles

- **Staging Mechanism**: 48-hour rollback window (`task_staging` table)
- **Todo Center**: Five status categories (pending/staging/qc/acceptance/issue-tracking)
- **Issue Sync**: Real-time sync to main branch (`issue_sync_logs` table)
- **Activity Logs**: Centralized recording in main branch (`activity_logs` table)
- **Document Management**: Version control, thumbnails, soft delete (30 days)
- **Data Sync**: Construction logs and QC records auto-sync to main branch

## 💻 Development Standards

### TypeScript & Angular Best Practices

#### Always Use

- **Strict TypeScript**: Enable all strict compilation options
- **Angular Signals**: For state management (Angular 20 feature)
- **Standalone Components**: Modern Angular 20 architecture
- **OnPush Change Detection**: `ChangeDetectionStrategy.OnPush` for all components
- **Typed Forms**: Use Angular's typed form APIs
- **Signal Inputs/Outputs**: Use new Angular 20 signal-based APIs
- **Signal Queries**: `viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()`

#### Never Use

- `any` type (use `unknown` or specific types)
- Deep path aliases (only import from root exports)
- Deprecated Angular features (ngModules for new components, old control flow)
- `with` statements or legacy octal literals

### SHARED_IMPORTS Pattern (Critical)

**Always import from SHARED_IMPORTS first**:
```typescript
import { SHARED_IMPORTS } from '@shared';
```

Only use direct imports when:
1. Component not in SHARED_IMPORTS
2. Need specific configuration
3. Explicitly documented exception

**Reference**: `docs/45-SHARED_IMPORTS-使用指南.md`

### Module Structure

```
src/app/
├── core/          # Core services, guards, interceptors (singleton)
├── layout/        # Layout components (header, sidebar, footer)
├── routes/        # Feature modules (blueprint, dashboard, etc.)
└── shared/        # Shared components, directives, pipes, utilities
```

**Dependency Rules**:
- `routes/` → can import from `shared/`, `core/`, `layout/`
- `layout/` → can import from `shared/`, `core/`
- `shared/` → ONLY import from `shared/` (no circular dependencies)
- `core/` → can import from `shared/` (singleton services)

### Code Quality Requirements

1. **No Duplication**: Use existing utilities and components
2. **No Ad-hoc Fixes**: Implement proper solutions following architecture
3. **Consistent Naming**: Follow established patterns in codebase
4. **Documentation**: Update relevant docs when making changes
5. **Type Safety**: All parameters must have explicit types
6. **Import Cleanup**: Remove unused imports before commit

### Database Operations

**Always use Supabase client** - never direct SQL:
```typescript
// ✅ Correct
const { data, error } = await supabase
  .from('blueprints')
  .select('*')
  .eq('owner_id', userId);

// ❌ Wrong - never use raw SQL
```

### Testing Requirements

- **Framework**: Karma + Jasmine
- **Coverage**: Minimum 80% for new code
- **Test Types**: Unit tests for services/utilities, integration tests for components
- **Run Tests**: `yarn test` (watch mode), `yarn test-coverage` (CI)

**Reference**: `docs/38-測試指南.md`

## 🛠️ Development Workflow

### Before Coding

1. **Read Guidelines**: Check `docs/00-開發作業指引.md`
2. **Understand Architecture**: Review relevant architecture diagrams in `docs/`
3. **Check Types**: Verify model definitions match database schema
4. **Plan First**: Break down tasks before implementation

### During Development

1. **Follow Patterns**: Use existing patterns and utilities
2. **Type Check**: Run `yarn type-check` frequently
3. **Lint Code**: Run `yarn lint` before commit
4. **Test Coverage**: Write tests alongside code

### Commit Standards

**Conventional Commits** (enforced by Husky):
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

**Pre-commit hooks** automatically run:
- ESLint (TypeScript)
- Stylelint (Less styles)
- Prettier formatting
- Type checking

### Build & Deploy

```bash
# Development
yarn start          # Start dev server

# Build
yarn build          # Production build

# Testing
yarn test           # Unit tests (watch)
yarn test-coverage  # Coverage report
yarn e2e            # E2E tests

# Linting
yarn lint           # Lint all
yarn lint:ts        # TypeScript only
yarn lint:style     # Styles only
```

## 📚 Documentation Structure

### Essential Documents (Always Check First)

1. **[Development Guidelines](docs/00-開發作業指引.md)** ⭐⭐⭐⭐⭐
   - Development standards, workflow, best practices
   
2. **[Project Structure](docs/01-專案結構說明.md)** ⭐⭐⭐⭐
   - Directory structure and organization
   
3. **[Quick Start Guide](docs/32-快速開始指南.md)** ⭐⭐⭐⭐
   - Environment setup and startup

4. **[Architecture Flow](docs/27-完整架構流程圖.mermaid.md)** ⭐⭐⭐⭐⭐
   - Complete architecture flowchart (Git-like branching model)
   
5. **[Architecture Review](docs/28-架構審查報告.md)** ⭐⭐⭐⭐⭐
   - Production-ready architecture review

6. **[Database Schema](docs/30-0-完整SQL表結構定義.md)** ⭐⭐⭐⭐⭐
   - Complete SQL table structure (51 tables)

7. **[SHARED_IMPORTS Guide](docs/45-SHARED_IMPORTS-使用指南.md)** ⭐⭐⭐⭐⭐
   - Must-read for component development

8. **[Testing Guide](docs/38-測試指南.md)** ⭐⭐⭐⭐
   - Testing practices and requirements

### Reference Documentation

- **Error Handling**: `docs/37-錯誤處理指南.md`
- **API Documentation**: `docs/33-API-接口詳細文檔.md`
- **Development Workflow**: `docs/35-開發工作流程.md`
- **Glossary**: `docs/42-詞彙表.md`
- **Status Enums**: `docs/43-狀態枚舉值定義.md`

### Cursor Rules (Detailed Standards)

Comprehensive coding standards are in `.cursor/rules/`:

- **Core Standards**: `typescript.mdc`, `angular.mdc`, `modern-angular.mdc`
- **Architecture**: `architecture.mdc`, `git-model.mdc`
- **Code Quality**: `code-quality.mdc`, `linting.mdc`, `formatting.mdc`, `styling.mdc`
- **Security**: `security.mdc`, `error-handling.mdc`, `api-design.mdc`
- **Testing**: `testing.mdc`, `accessibility.mdc`
- **Tools**: `git-workflow.mdc`, `build-deploy.mdc`, `dependency-management.mdc`
- **Module-Specific**: `shared-specific.mdc`, `routes-specific.mdc`, `layout-specific.mdc`, `core-specific.mdc`

## 🔒 Security Guidelines

1. **No Secrets in Code**: Use environment variables
2. **RLS Policies**: All database operations respect Row Level Security
3. **Permission Checks**: Validate permissions before operations
4. **Sensitive Data**: Never log passwords, tokens, or PII
5. **Input Validation**: Validate all user inputs

**Reference**: `docs/21-安全與-RLS-權限矩陣.md`

## 🎯 Common Tasks

### Creating a New Component

```bash
# Use Angular CLI
ng g c routes/[feature]/[component-name] --standalone

# Ensure it uses:
# - Standalone: true
# - OnPush change detection
# - SHARED_IMPORTS
# - Signals for state
```

### Adding a Service

```bash
ng g s shared/services/[service-name]

# Use Signals for reactive state:
# - signal(), computed(), effect()
# - toSignal() for Observable conversion
```

### Implementing Repository Pattern

```typescript
// Service should extend base repository pattern
export class BlueprintService {
  private supabase = inject(SupabaseService);
  
  async getAll(filters: BlueprintFilters): Promise<Blueprint[]> {
    // Implement with proper error handling
  }
  
  async getById(id: string): Promise<Blueprint> {
    // Implement with proper error handling
  }
  
  // CRUD operations...
}
```

## 🚨 Common Pitfalls to Avoid

1. **Don't** import components directly - use SHARED_IMPORTS
2. **Don't** use `any` type - be explicit or use `unknown`
3. **Don't** bypass Supabase client - no raw SQL
4. **Don't** create deep module hierarchies - keep flat structure
5. **Don't** duplicate code - extract to shared utilities
6. **Don't** skip tests - maintain 80% coverage
7. **Don't** ignore linting errors - fix them before commit
8. **Don't** use deprecated Angular APIs - use Angular 20 features

## 📖 Quick Reference

### File Naming Conventions

- Components: `feature-name.component.ts`
- Services: `feature-name.service.ts`
- Models: `feature-name.model.ts`
- Guards: `feature-name.guard.ts`
- Interceptors: `feature-name.interceptor.ts`

### Import Order

1. Angular core imports
2. Third-party libraries
3. SHARED_IMPORTS
4. Local project imports
5. Relative imports

### Path Aliases

```typescript
// ✅ Correct
import { SHARED_IMPORTS } from '@shared';
import { AuthService } from '@core';
import { environment } from '@env';

// ❌ Wrong - don't use deep paths
import { ButtonComponent } from '@shared/components/button/button.component';
```

## 🔄 When Making Changes

1. **Check existing patterns** - follow established conventions
2. **Read relevant docs** - understand the context
3. **Update documentation** - keep docs in sync with code
4. **Run tests** - ensure nothing breaks
5. **Check types** - verify type safety
6. **Lint code** - fix all warnings
7. **Review changes** - self-review before committing

## 📞 Need Help?

- Check `docs/README.md` for complete documentation index
- Review `docs/36-常見問題-FAQ.md` for common questions
- Check `.cursor/rules/README.md` for detailed coding standards
- Review architecture diagrams in `docs/` for system understanding

---

**Last Updated**: 2025-01-15  
**Architecture Version**: v2.0 (Git-like branching model, 51 tables)  
**Maintained By**: Development Team

