# GitHub Copilot Instructions for ng-alain-github

> **Purpose**: This file provides GitHub Copilot coding agent with essential context about this repository's architecture, coding standards, and development practices.

## 📋 Project Overview

**Project**: ng-alain-github - Enterprise Angular admin panel framework  
**Tech Stack**: Angular 20.3.x + NG-ZORRO 20.2.x + NG-ALAIN 20.1.x + Supabase  
**Architecture**: Git-like branching model with 51-table database structure  
**Package Manager**: Yarn 4.9.2 (required)  
**Node.js**: v20.19.5 (required)  
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