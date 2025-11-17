# Development Methodology Instructions

## Purpose
This file provides detailed instructions for using Sequential Thinking and Software Planning Tool as core methodologies for development in the ng-alain-gighub project.

## Overview

The ng-alain-gighub project uses a systematic 6-phase development workflow that combines multiple tools for optimal results:

1. **Analysis Phase** - Sequential Thinking
2. **Planning Phase** - Software Planning Tool  
3. **Research Phase** - Context7
4. **Verification Phase** - Supabase MCP
5. **Implementation Phase** - Code development
6. **Review Phase** - Architecture alignment check

## Sequential Thinking Workflow

### When to Use

Sequential Thinking is **MANDATORY** for:
- Tasks with complexity > 5/10
- Architectural decisions
- Multi-module refactoring
- Complex debugging and root cause analysis
- Feature design and planning
- Risk assessment

### How to Use

**Step 1: Start the thinking process**
```
Invoke Sequential Thinking tool with the problem statement
```

**Step 2: Break down systematically (8-12 thoughts)**
- Thought 1: Understand the problem and requirements
- Thought 2: Analyze existing codebase and dependencies
- Thought 3: Consider architectural implications
- Thought 4: Evaluate alternative approaches
- Thought 5: Assess risks and constraints
- Thought 6: Verify alignment with system architecture
- Thought 7: Design implementation strategy
- Thought 8: Define testing and verification approach
- Continue as needed...

**Step 3: Generate and verify hypotheses**
- Formulate solution hypotheses
- Test assumptions
- Iterate until confident

**Step 4: Document decisions**
- Record key decisions and rationale
- Note trade-offs considered
- Document risks and mitigations

### Example: Implementing a New Feature

```markdown
Problem: Add photo upload to daily reports

Thought 1: Understand requirements
- Users need to attach multiple photos to daily reports
- Photos should support the Git-like branching model
- Must integrate with existing report_photos table

Thought 2: Analyze Storage structure
- Need a Supabase Storage bucket 'report-photos'
- Folder structure: branch_id/report_id/photo_id.jpg
- Support PNG, JPG, HEIC formats up to 10MB

Thought 3: Design RLS policies
- Upload: Users with can_write on branch
- View: Users with can_read on branch
- Delete: Report owner or branch admin

Thought 4: Plan UI components
- Use NG-ZORRO Upload component
- Show preview thumbnails
- Progress indicators
- Error handling

Thought 5: Consider data flow
- Upload to Storage → Get URL → Save to report_photos table
- Support staging mechanism (48-hour rollback)
- Real-time updates via Supabase Realtime

Thought 6: Align with Git-like model
- Photos belong to specific branch
- Can be merged to main branch via PR
- Branch permissions control access

Thought 7: Define testing strategy
- Unit tests: Upload service, component logic
- Integration tests: Storage + database operations
- E2E tests: Full upload workflow

Thought 8: Assess risks
- File size limits (mitigate with validation)
- Storage costs (implement compression)
- Network failures (implement retry logic)
```

## Software Planning Tool Workflow

### When to Use

Software Planning Tool is **MANDATORY** for:
- All feature development
- Task breakdown and tracking
- Complexity assessment
- Progress monitoring
- Dependency management

### How to Use

**Step 1: Start planning session**
```typescript
software_planning_tool.start_planning({
  goal: "Implement photo upload feature for daily reports"
})
```

**Step 2: Add todos with complexity scores**

Use this complexity scale:
- **1-2**: Simple changes (config, styling, minor fixes)
- **3-4**: Standard features (CRUD operations, simple components)
- **5-6**: Moderate complexity (integration, multi-component features)
- **7-8**: High complexity (architecture changes, complex integrations)
- **9-10**: Very high complexity (major refactoring, critical systems)

```typescript
software_planning_tool.add_todo({
  title: "Create Storage bucket and RLS policies",
  description: `
    - Create 'report-photos' bucket in Supabase Storage
    - Configure RLS for upload, view, delete operations
    - Test policies with different user roles
    - Document bucket structure
  `,
  complexity: 7,
  codeExample: `
    CREATE POLICY "Upload with branch permission"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'report-photos' AND
      auth.uid() IN (
        SELECT account_id FROM branch_permissions
        WHERE branch_id = (storage.foldername(name))[1]
        AND can_write = true
      )
    );
  `
})
```

**Step 3: Track progress**
```typescript
software_planning_tool.update_todo_status({
  todoId: "1234567890",
  isComplete: true
})
```

**Step 4: Save the plan**
```typescript
software_planning_tool.save_plan({
  plan: "Complete implementation plan with all todos..."
})
```

## Context7 Research Workflow

### When to Use

Use Context7 **BEFORE** implementing any feature to:
- Query official documentation
- Look up API references
- Research best practices
- Verify framework capabilities

### Query Patterns

**Angular 20 Queries**
```bash
# Signals
"angular 20 signal computed effect"
"angular 20 signal inputs outputs"
"angular 20 toSignal toObservable"

# Forms
"angular 20 typed reactive forms"
"angular 20 form validation signals"

# Components
"angular 20 standalone components"
"angular 20 viewChild contentChild"
```

**NG-ZORRO Queries**
```bash
# Upload component
"ng-zorro-antd 20 upload component API"
"ng-zorro-antd 20 upload custom request"
"ng-zorro-antd 20 upload file list"

# Table component
"ng-zorro-antd 20 table component"
"ng-zorro-antd 20 table virtual scroll"

# Form components
"ng-zorro-antd 20 form validation"
"ng-zorro-antd 20 modal service"
```

**Supabase Queries**
```bash
# Storage
"supabase storage upload typescript"
"supabase storage RLS policies"
"supabase storage multiple files"

# Database
"supabase postgresql RLS"
"supabase realtime subscriptions"

# Auth
"supabase auth JWT claims"
"supabase auth session management"
```

### Example Research Flow

```typescript
// Step 1: Research Upload component
context7.query("ng-zorro-antd 20 upload component custom request")

// Step 2: Research Storage API
context7.query("supabase storage upload multiple files typescript")

// Step 3: Research RLS patterns
context7.query("supabase storage RLS policies best practices")

// Step 4: Research Signals integration
context7.query("angular 20 signal form control integration")
```

## Supabase MCP Verification Workflow

### When to Use

Use Supabase MCP to:
- Verify table structures before coding
- Test RLS policies
- Validate migrations
- Check data relationships
- Test complex queries

### Common Operations

**List all tables**
```typescript
supabase_mcp.list_tables({
  schemas: ['public']
})
```

**Check table structure**
```typescript
supabase_mcp.execute_sql({
  query: `
    SELECT 
      column_name, 
      data_type, 
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_name = 'report_photos'
    ORDER BY ordinal_position
  `
})
```

**Verify RLS policies**
```typescript
supabase_mcp.execute_sql({
  query: `
    SELECT 
      schemaname,
      tablename,
      policyname,
      permissive,
      roles,
      cmd,
      qual,
      with_check
    FROM pg_policies
    WHERE tablename = 'report_photos'
  `
})
```

**Test RLS policy as user**
```typescript
supabase_mcp.execute_sql({
  query: `
    SET LOCAL ROLE authenticated;
    SET LOCAL request.jwt.claims TO '{"sub": "user-123", "role": "authenticated"}';
    
    SELECT * FROM report_photos 
    WHERE report_id = 'report-456'
  `
})
```

**Apply migration**
```typescript
supabase_mcp.apply_migration({
  name: "add_report_photos_bucket",
  query: `
    -- Create storage bucket
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('report-photos', 'report-photos', false);
    
    -- Add RLS policies
    CREATE POLICY "Upload photos with branch permission"
    ON storage.objects FOR INSERT
    WITH CHECK (...);
  `
})
```

## Model Switching Strategy

### Complexity-Based Model Selection

**GPT-5.1-Codex (Highest Quality)**
- Complexity: 8-10/10
- Use for: Architecture refactoring, complex algorithms, security-critical code
- Examples: Multi-module restructuring, performance optimization, RLS policy design

**GPT-5-Codex (High Quality)**
- Complexity: 5-7/10  
- Use for: Standard features, service layer, component development
- Examples: New UI components, API integration, business logic

**Default Model (Standard)**
- Complexity: 1-4/10
- Use for: Simple changes, docs, styling
- Examples: Documentation updates, CSS adjustments, config changes

### When to Switch Models

**Switch to GPT-5.1-Codex when:**
1. Initial approach with GPT-5-Codex produces suboptimal results
2. Task involves critical business logic or security
3. Architecture decisions require deep analysis
4. Performance optimization is critical
5. Complex refactoring across multiple modules

**Stay with GPT-5-Codex when:**
1. Standard feature implementation
2. Well-defined requirements
3. Existing patterns to follow
4. Component-level work

## Integration with Other Tools

### filesystem Tool

Use for:
- Reading existing code
- Searching for patterns
- Understanding project structure
- Verifying file locations

```typescript
// Read file contents
filesystem.read_text_file({
  path: "/home/runner/work/ng-alain-gighub/ng-alain-gighub/src/app/shared/services/auth/auth.service.ts"
})

// Search for usage
filesystem.search_files({
  path: "/home/runner/work/ng-alain-gighub/ng-alain-gighub/src",
  pattern: "SupabaseService"
})

// List directory
filesystem.list_directory({
  path: "/home/runner/work/ng-alain-gighub/ng-alain-gighub/src/app/shared"
})
```

### Everything Tool

Use for:
- Simple operations and testing
- Echo debugging
- Environment checks

```typescript
// Test echo
everything.echo({
  message: "Testing tool integration"
})

// Check environment
everything.printEnv()
```

## Complete Workflow Example

### Scenario: Add Weather Forecast Feature

**Phase 1: Analysis (Sequential Thinking)**
```
Sequential Thinking analysis (10 thoughts):
- Requirements understanding
- Existing code analysis
- API integration design
- Data caching strategy
- UI component structure
- State management approach
- Error handling design
- Testing strategy
- Performance considerations
- Rollout plan
```

**Phase 2: Planning (Software Planning Tool)**
```typescript
start_planning({ goal: "Implement weather forecast feature" })

add_todo({
  title: "Weather service integration",
  description: "Integrate with Taiwan CWA API...",
  complexity: 6
})

add_todo({
  title: "Caching mechanism", 
  description: "Implement weather_cache table...",
  complexity: 5
})

add_todo({
  title: "Weather component UI",
  description: "Create weather display component...",
  complexity: 4
})
```

**Phase 3: Research (Context7)**
```bash
context7 query "angular 20 http client interceptor"
context7 query "ng-zorro-antd 20 select component"
context7 query "supabase postgresql jsonb queries"
```

**Phase 4: Verification (Supabase MCP)**
```typescript
// Check weather_cache table
supabase_mcp.execute_sql({
  query: "SELECT * FROM information_schema.columns WHERE table_name = 'weather_cache'"
})

// Test cache query
supabase_mcp.execute_sql({
  query: "SELECT * FROM weather_cache WHERE city = 'Taipei' AND cached_at > NOW() - INTERVAL '1 hour'"
})
```

**Phase 5: Implementation**
```typescript
// Implement weather.service.ts
// Implement weather.component.ts
// Add to routes
// Write tests
```

**Phase 6: Review**
```
Architecture alignment check:
✅ Git-like model support
✅ RLS policies applied
✅ Signal-based state
✅ OnPush change detection
✅ TypeScript strict
✅ Tests pass
✅ Lint passes
```

## Best Practices

### Do's
- **Always** start with Sequential Thinking for complex tasks
- **Always** use Software Planning Tool for feature work
- **Always** research with Context7 before implementation
- **Always** verify database operations with Supabase MCP
- **Always** check architecture alignment before committing

### Don'ts
- **Don't** skip the planning phase
- **Don't** implement without researching best practices
- **Don't** modify database without verification
- **Don't** use outdated patterns (check Context7)
- **Don't** commit without architecture review

## Success Metrics

Track these metrics for methodology effectiveness:
- 100% of complex tasks (>5/10) use Sequential Thinking
- 100% of features tracked in Software Planning Tool
- 2-3 Context7 queries per technical decision
- 100% of database changes verified with Supabase MCP
- 100% architecture alignment before merge

## Reference Documentation

- **Main Methodology**: `docs/DISCUSSION-Sequential-Thinking-Planning-Tool-方法論.md`
- **Development Guide**: `docs/00-開發作業指引.md`
- **Quick Start**: `docs/QUICK-START-Sequential-Thinking-Planning.md`
- **Architecture**: `docs/01-系統架構思維導圖.mermaid.md`
- **Contributing**: `CONTRIBUTING.md`

## Questions?

If you're unsure about:
- **Which tool to use** → Check the decision tree in Quick Start guide
- **How to use a tool** → See examples in this document
- **Complexity scoring** → Refer to the complexity scale in Software Planning Tool section
- **Architecture alignment** → Review `docs/01-系統架構思維導圖.mermaid.md`

---

**Last Updated**: 2025-11-17  
**Version**: 1.0  
**Maintainer**: Development Team
