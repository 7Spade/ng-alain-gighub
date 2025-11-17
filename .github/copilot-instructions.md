# GitHub Copilot Instructions for ng-alain-github

> **Purpose**: This file provides GitHub Copilot coding agent with essential context about this repository's architecture, coding standards, and development practices.

## 🤖 AI Assistant Role

**For comprehensive AI assistant guidelines, see**: [`docs/50-AI助手角色配置.md`](../docs/50-AI助手角色配置.md)

This document provides detailed role definitions, behavior guidelines, and response formats for AI assistants working on this project. Key requirements include:

- **First Priority**: Always review `docs/10-系統架構思維導圖.mermaid.md` before making any architectural decisions
- **Enterprise Standards**: Follow strict TypeScript, Angular, and code structure standards
- **4-Step Response Format**: Conclusion → Implementation → Risk/Testing → Manual Review Flag
- **Security**: Never expose `.env`, tokens, or sensitive information

## 📋 Project Overview

**Project**: ng-alain-github - Enterprise Angular admin panel framework  
**Tech Stack**: Angular 20.3.x + NG-ZORRO 20.3.x + NG-ALAIN 20.1.x + Supabase  
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

## 🧠 Development Methodology (MANDATORY)

**For detailed methodology, see**: [`docs/DISCUSSION-Sequential-Thinking-Planning-Tool-方法論.md`](../docs/DISCUSSION-Sequential-Thinking-Planning-Tool-方法論.md)

This project uses **Sequential Thinking** and **Software Planning Tool** as core methodologies for all development work. These tools ensure systematic analysis, proper task breakdown, and effective prioritization.

### When to Use Sequential Thinking

**ALWAYS use Sequential Thinking for:**
- Complex tasks (complexity > 5/10)
- Architectural decisions and design choices
- Multi-module changes and refactoring
- Root cause analysis and debugging complex issues
- Feature planning and implementation strategy
- Risk assessment and mitigation planning

**How to use:**
1. Break down the problem into 8-12 thought steps
2. Analyze each aspect systematically
3. Consider alternatives and trade-offs
4. Document key decisions and rationale
5. Generate hypotheses and verify them
6. Iterate until a satisfactory solution is reached

### When to Use Software Planning Tool

**ALWAYS use Software Planning Tool for:**
- All feature development work
- Task tracking and progress monitoring
- Complexity assessment (0-10 scale)
- Dependency management
- Implementation planning with subtasks

**How to use:**
1. Start planning session with the goal
2. Add todos with titles, descriptions, and complexity scores
3. Update todo status as work progresses
4. Save the plan when complete
5. Reference the plan throughout implementation

### Tool Integration Strategy

Use these tools in combination for best results:

#### 6-Phase Iterative Workflow

```
1. Analysis (Sequential Thinking)
   ↓
2. Planning (Software Planning Tool)
   ↓
3. Research (Context7)
   ↓
4. Verification (Supabase MCP)
   ↓
5. Implementation (Code)
   ↓
6. Review (Architecture alignment check)
```

#### Context7 Usage

**Use Context7 before implementation to:**
- Query Angular 20 documentation and best practices
- Look up NG-ZORRO component APIs
- Research Supabase patterns and RLS policies
- Verify TypeScript patterns and Signal usage

**Example queries:**
```bash
# Angular 20 Signals
"angular 20 signal computed effect"
"angular 20 signal inputs outputs"

# NG-ZORRO Components
"ng-zorro-antd 20 upload component"
"ng-zorro-antd 20 table component"

# Supabase
"supabase storage RLS policies"
"supabase realtime subscriptions"
```

#### Supabase MCP Usage

**Use Supabase MCP for:**
- Schema validation (`list_tables`, `execute_sql`)
- RLS policy verification
- Migration management (`list_migrations`, `apply_migration`)
- Complex query testing
- Database structure inspection

**Example operations:**
```typescript
// Check table structure
supabase.execute_sql(`
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_name = 'tasks'
`)

// Verify RLS policies
supabase.execute_sql(`
  SELECT * FROM pg_policies 
  WHERE tablename = 'tasks'
`)
```

### Model Switching Strategy

For tasks with varying complexity levels:

**Use OpenAI GPT-5.1-Codex when:**
- Complexity score is 8-10/10
- Architectural refactoring across multiple modules
- Complex algorithm implementation
- Critical security-sensitive code
- Performance optimization challenges

**Use OpenAI GPT-5-Codex when:**
- Complexity score is 5-7/10
- Standard feature implementation
- Component development
- Service layer implementation
- Test writing

**Use default model when:**
- Complexity score is 1-4/10
- Documentation updates
- Simple bug fixes
- UI styling adjustments

### Practical Example: Photo Upload Feature

**Step 1: Sequential Thinking Analysis**
```
Thought 1: Understand requirements
Thought 2: Analyze Storage structure
Thought 3: Design RLS policies
Thought 4: Plan UI components
Thought 5: Consider data flow
Thought 6: Align with Git-like model
Thought 7: Define testing strategy
Thought 8: Assess risks and rollback plan
```

**Step 2: Software Planning Tool**
```
Todo 1: Storage Bucket design (complexity: 6)
Todo 2: RLS policy configuration (complexity: 7)
Todo 3: PhotoUploadComponent (complexity: 6)
Todo 4: Integration with forms (complexity: 5)
Todo 5: Unit tests (complexity: 4)
Todo 6: E2E tests (complexity: 3)
```

**Step 3: Context7 Research**
```bash
context7 query "supabase storage upload multiple files"
context7 query "ng-zorro-antd upload component custom request"
context7 query "angular 20 signal form control"
```

**Step 4: Supabase MCP Verification**
```typescript
// Check report_photos table structure
supabase.execute_sql("SELECT * FROM information_schema.columns WHERE table_name = 'report_photos'")

// Test RLS policy
supabase.execute_sql("SET LOCAL ROLE authenticated; SELECT * FROM storage.objects WHERE bucket_id = 'report-photos'")
```

**Step 5: Implementation**
- Write code based on research and verification
- Follow Angular 20 and NG-ZORRO best practices
- Use Signals for state management

**Step 6: Architecture Review**
```
✅ Git-like branching model support
✅ RLS policies complete
✅ Signal-based reactive
✅ OnPush change detection
✅ TypeScript strict mode
✅ Unit test coverage 80%+
```

## 📚 Additional Resources

- **Methodology Details**: [`docs/DISCUSSION-Sequential-Thinking-Planning-Tool-方法論.md`](../docs/DISCUSSION-Sequential-Thinking-Planning-Tool-方法論.md)
- **Quick Start Guide**: [`.github/instructions/methodology.instructions.md`](.github/instructions/methodology.instructions.md)
- **Development Guidelines**: [`docs/00-開發作業指引.md`](../docs/00-開發作業指引.md)