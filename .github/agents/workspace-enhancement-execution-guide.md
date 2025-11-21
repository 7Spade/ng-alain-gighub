# 🚀 Workspace Enhancement Task Execution Guide

> **Purpose**: Comprehensive workflow instructions for executing `docs/workspace` enhancement tasks with enterprise-grade quality standards
>
> **Version**: v1.0.0  
> **Last Updated**: 2025-01-21  
> **Target Audience**: GitHub Copilot Agents, Developers working on workspace enhancements

---

## ⚠️ MANDATORY PREREQUISITES (Must Execute Before Starting)

### 🧠 Step 1: Activate Sequential Thinking (@S7)

**REQUIRED**: Every docs/workspace task MUST start with Sequential Thinking tool active.

```
✓ Call Sequential Thinking tool (@S7)
✓ Keep it active throughout the entire task
✓ Use it for:
  - Breaking down complex problems
  - Planning implementation strategy
  - Analyzing dependencies
  - Making architectural decisions
  - Validating each phase completion
```

**Why Sequential Thinking?**
- Maintains reasoning trail for complex multi-layer tasks
- Enables course correction during implementation
- Documents decision-making process
- Supports iterative refinement
- Validates assumptions at each step

**Usage Pattern**:
```
1. Initial Analysis: Use @S7 to understand task scope and requirements
2. Planning Phase: Use @S7 to break down into milestones
3. Design Phase: Use @S7 for architectural decisions
4. Implementation: Use @S7 to validate each layer completion
5. Verification: Use @S7 to confirm enterprise standards met
```

---

### 📋 Step 2: Activate Software Planning Tool (@SPT)

**REQUIRED**: Immediately after Sequential Thinking, activate Software Planning Tool.

```
✓ Call Software Planning Tool (@SPT)
✓ Create structured task breakdown
✓ Maintain active plan throughout execution
✓ Use it for:
  - Creating phased milestones
  - Tracking completion status
  - Managing dependencies
  - Organizing deliverables
  - Validating against success criteria
```

**Planning Structure**:
```
Phase 1: Analysis & Planning (Duration: X hours)
  - Milestone 1.1: Requirement analysis
  - Milestone 1.2: Architecture review
  - Milestone 1.3: Dependency mapping

Phase 2: Types Layer (Duration: X hours)
  - Milestone 2.1: Enum definitions
  - Milestone 2.2: Type exports
  - Milestone 2.3: Validation & testing

[Continue for each layer...]
```

---

### 🗄️ Step 3: Query Memory & Context (Mandatory)

**REQUIRED**: Before any code changes, query project knowledge.

#### 3.1 Memory.jsonl Query
```bash
# Query relevant entities
grep -i "Five Layer Development Order" .github/copilot/memory.jsonl
grep -i "Repository Pattern" .github/copilot/memory.jsonl
grep -i "Workspace Context" .github/copilot/memory.jsonl

# Or use jq for structured query
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Types Layer"))'
```

**Key Memory Entities to Query**:
- `Five Layer Development Order` - Development sequence
- `Repository Pattern` - Data access patterns
- `Security Best Practices` - Security requirements
- `Testing Strategy` - Test coverage requirements
- `Documentation Structure` - Doc organization

#### 3.2 System Architecture Review
**Location**: `docs/architecture/01-system-architecture-mindmap.mermaid.md`

```
✓ Understand module relationships
✓ Identify dependencies
✓ Confirm architectural constraints
✓ Locate integration points
```

#### 3.3 Workspace Enhancement Plan
**Location**: `docs/workspace/five-layer-architecture-enhancement-plan.md`

```
✓ Review overall enhancement strategy
✓ Confirm current phase priorities
✓ Check dependencies between phases
✓ Understand success criteria
```

---

## 🏗️ LAYERED EXECUTION ORDER (Strict Enforcement)

### Execution Sequence

```
Phase 1: Types Layer
   ↓ (Validation Gate)
Phase 2: Repositories Layer
   ↓ (Validation Gate)
Phase 3: Models Layer
   ↓ (Validation Gate)
Phase 4: Services Layer
   ↓ (Validation Gate)
Phase 5: Facades Layer
   ↓ (Validation Gate)
Phase 6: Routes/Components Layer
   ↓ (Validation Gate)
Phase 7: Testing & Documentation
   ↓ (Final Validation)
Complete
```

**⚠️ CRITICAL RULES**:
1. **Never skip layers**: Each layer must be completed before moving to next
2. **Validation gates are mandatory**: Cannot proceed without passing validation
3. **Bottom-up only**: Dependencies flow from bottom to top
4. **No parallel execution across layers**: Complete one layer fully before next
5. **Report progress after each layer**: Use report_progress tool

---

## 📊 PHASE-BY-PHASE REPORTING (Mandatory)

### Reporting Frequency

**REQUIRED**: Report progress after EVERY phase completion using `report_progress` tool.

### Reporting Template

```markdown
## Phase [N]: [Layer Name] - Completion Report

### Completed Milestones
- [x] Milestone 1: [Description]
- [x] Milestone 2: [Description]
- [x] Milestone 3: [Description]

### Deliverables
- ✅ [File/Feature 1]: [Status/Notes]
- ✅ [File/Feature 2]: [Status/Notes]
- ✅ [File/Feature 3]: [Status/Notes]

### Metrics
- Files Changed: [N]
- Lines Added: [N]
- Lines Removed: [N]
- Test Coverage: [N%]
- Build Status: ✅ Passing
- Lint Status: ✅ Clean

### Validation Gate Status
- [x] Enterprise Standards: PASSED
- [x] Sequential Thinking Review: PASSED
- [x] Quality Checks: PASSED
- [x] Documentation: UPDATED

### Next Steps
- [ ] Phase [N+1]: [Layer Name]
- [ ] Estimated Duration: [X hours]
- [ ] Key Risks: [If any]

### Notes
[Any important decisions, blockers, or deviations from plan]
```

---

## 🛠️ SUPABASE MCP TOOL USAGE PATTERNS

### Essential MCP Tools for Workspace Enhancement

#### 1. Database Schema Queries

```typescript
// @supabase-list_tables - Verify table structure
// Use at: Types Layer, Repositories Layer

// @supabase-execute_sql - Test queries
// Use at: Repositories Layer, Services Layer validation

// @supabase-get_advisors - Check security/performance
// Use at: After each layer completion
```

#### 2. Memory Management

```typescript
// @memory-search_nodes - Query project knowledge
// Use at: Start of each phase

// @memory-create_entities - Store new patterns
// Use at: When discovering new architectural patterns

// @memory-read_graph - Review full knowledge graph
// Use at: Planning phase
```

---

## 🎯 FOCUS: docs/workspace DELIVERABLES

### Current Workspace Enhancement Status

**Total Documents**: 31  
**Enhancement Plan**: `five-layer-architecture-enhancement-plan.md`  
**Estimated Duration**: 38-55 days

### Priority Deliverables

#### P0 (High Priority - 20-31 days)
1. **Repositories Layer** (5-7 days)
   - 10 Repositories need search methods
   - Reference: `repositories-layer-enhancement-checklist.md`

2. **Services Layer** (8-10 days)
   - 50+ methods to add
   - 20+ Signals to implement
   - Reference: `services-layer-enhancement-checklist.md`

3. **Facades Layer** (20-31 days)
   - 8 Facades to split
   - 25+ sub-facades to create
   - Reference: `facades-layer-enhancement-checklist.md`

#### P1 (Medium Priority - 5-7 days)
1. **Types Layer** (2-3 days)
   - 10 enums to add
   - 3 duplicates to consolidate
   - Reference: `types-layer-enhancement-checklist.md`

2. **Models Layer** (3-4 days)
   - 8 modules need enum re-exports
   - 4 interfaces to move from Services
   - Reference: `models-layer-enhancement-checklist.md`

### Milestone Tracking

```markdown
- [ ] Phase 1: Types Layer Enhancement (2-3 days)
- [ ] Phase 2: Repositories Layer Enhancement (5-7 days)
- [ ] Phase 3: Models Layer Enhancement (3-4 days)
- [ ] Phase 4: Services Layer Enhancement (8-10 days)
- [ ] Phase 5: Facades Layer Enhancement (20-31 days)
- [ ] Phase 6: Components Integration (5-10 days)
- [ ] Phase 7: Testing & Documentation (3-5 days)
```

---

## ✅ SUCCESS CRITERIA

### Completeness Metrics
- ✅ Types Layer: 100% enum definitions complete
- ✅ Repositories Layer: 100% search methods implemented
- ✅ Models Layer: 100% enum re-exports correct
- ✅ Services Layer: 100% CRUD + Signals complete
- ✅ Facades Layer: 100% coordinator pattern applied

### Quality Metrics
- ✅ Test Coverage: ≥80% (Services, Facades)
- ✅ TypeScript strict mode: 100% compliance
- ✅ Lint: 0 errors, 0 warnings
- ✅ Build: Successful production build
- ✅ Bundle size: <5% increase

### Process Metrics
- ✅ Sequential Thinking: Used throughout
- ✅ Software Planning Tool: Active and updated
- ✅ Phase reports: Submitted after each phase
- ✅ Validation gates: All passed
- ✅ Documentation: Updated and accurate

---

## 🚫 FORBIDDEN PRACTICES (Automatic Failure)

**ANY of these violations will require task restart**:

❌ **Skipping Sequential Thinking or Software Planning Tool**  
❌ **Bypassing validation gates**  
❌ **Skipping layers in execution order**  
❌ **Not using Supabase MCP tools for data operations**  
❌ **Missing phase-by-phase reports**  
❌ **Using native HTML components instead of NG-ZORRO**  
❌ **Not implementing OnPush strategy**  
❌ **Using 'any' type without justification**  
❌ **Bypassing @delon/auth for authentication**  
❌ **Committing secrets or sensitive data**  
❌ **Test coverage <80% for Services/Facades**

---

## 📚 REFERENCE DOCUMENTS

### Core Workspace Documents
- [Five Layer Architecture Enhancement Plan](../../docs/workspace/five-layer-architecture-enhancement-plan.md) ⭐⭐⭐⭐⭐
- [Types Layer Enhancement Checklist](../../docs/workspace/types-layer-enhancement-checklist.md)
- [Repositories Layer Enhancement Checklist](../../docs/workspace/repositories-layer-enhancement-checklist.md)
- [Models Layer Enhancement Checklist](../../docs/workspace/models-layer-enhancement-checklist.md)
- [Services Layer Enhancement Checklist](../../docs/workspace/services-layer-enhancement-checklist.md)
- [Facades Layer Enhancement Checklist](../../docs/workspace/facades-layer-enhancement-checklist.md)

### Agent Configuration
- [Agent Startup Checklist](./agent-startup-checklist.md) ⭐⭐⭐⭐⭐
- [Development Sequence Guide](./development-sequence-guide.md) ⭐⭐⭐⭐⭐
- [Enterprise Compliance Checklist](./enterprise-compliance-checklist.md) ⭐⭐⭐⭐⭐
- [Memory Usage Guide](./memory-usage-guide.md) ⭐⭐⭐⭐

### Knowledge Base
- [Project Memory](../copilot/memory.jsonl) - 149 entities + 170 relations
- [System Architecture Mindmap](../../docs/architecture/01-system-architecture-mindmap.mermaid.md)
- [Complete Architecture Flowchart](../../docs/architecture/20-complete-architecture-flowchart.mermaid.md)

---

## 📋 QUICK START CHECKLIST

```markdown
Before Starting Any Workspace Enhancement Task:

1. Tools Setup
   - [ ] Activate Sequential Thinking (@S7)
   - [ ] Activate Software Planning Tool (@SPT)
   - [ ] Query memory.jsonl for relevant entities
   - [ ] Review system architecture mindmap

2. Planning
   - [ ] Read enhancement plan for target layer
   - [ ] Identify dependencies
   - [ ] Create phased breakdown in SPT
   - [ ] Estimate duration for each phase

3. Execution (Per Layer)
   - [ ] Complete layer implementation
   - [ ] Pass validation gate
   - [ ] Report progress
   - [ ] Move to next layer

4. Quality Assurance
   - [ ] Run all checks (lint, type-check, build, test)
   - [ ] Verify enterprise standards
   - [ ] Update documentation
   - [ ] Final validation gate

5. Completion
   - [ ] Submit final report
   - [ ] Update workspace documentation
   - [ ] Close SPT tasks
   - [ ] Capture lessons learned
```

**Ready to start? Begin with Step 1: Activate Sequential Thinking! 🚀**
