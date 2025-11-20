# GitHub Copilot Memory Summary

> **Last Updated**: 2025-11-20  
> **Version**: v4.0.1 (整合版本)  
> **Total Entities**: 149  
> **Total Relations**: 170  
> **Total Lines**: 319  
> **Status**: ✅ 已整合 - 現只有一個 memory.jsonl 檔案

## 📊 Overview

This document provides a summary of the organized `memory.jsonl` file, which contains the knowledge base for GitHub Copilot to assist with the ng-alain-gighub project development.

## 🗂️ Entity Categories (33 categories)

| Category | Count | Description |
|----------|-------|-------------|
| **Standard** | 48 | Development standards and coding conventions |
| **Feature** | 14 | Project features and functionality |
| **Principle** | 13 | Core development principles (SOLID, DRY, KISS, etc.) |
| **Documentation** | 9 | Documentation structure and files |
| **UI Pattern** | 7 | User interface design patterns |
| **Development Practice** | 6 | Layer-specific development practices |
| **Security** | 6 | Security best practices and standards |
| **Architecture** | 5 | System architecture patterns |
| **DevOps** | 5 | DevOps practices and CI/CD |
| **Pattern** | 4 | Design patterns (Repository, Facade, etc.) |
| **Workspace** | 3 | Workspace context system |
| **Performance** | 3 | Performance optimization techniques |
| **Checklist** | 2 | Development checklists |
| **Constraint** | 2 | Development constraints and limitations |
| **Tool Configuration** | 2 | IDE and tool configurations |
| **Process** | 2 | Team collaboration processes |
| **Project** | 2 | Project metadata |
| Other categories | 19 | Various specialized categories |

## 🔗 Relation Types (40 types)

Top 10 relation types by frequency:

1. **uses** (26): Technology and library usage relationships
2. **implements** (21): Implementation relationships
3. **enforces** (14): Enforcement of standards and rules
4. **partOf** (12): Hierarchical relationships
5. **integrates_with** (9): Integration relationships
6. **requires** (9): Dependency relationships
7. **improves** (8): Quality improvement relationships
8. **defines** (7): Definition relationships
9. **documents** (7): Documentation relationships
10. **supports** (7): Support relationships

## 📝 New Content Added from Development Guide

The following entities were added from `docs/archive/開發順序.md`:

### Workflow Entities

1. **Five Layer Development Order** (Workflow)
   - Standard development order: Types → Repositories → Models → Services → Facades → Routes/Components → Tests
   - 7 development steps with priorities and dependencies

### Development Practice Entities

2. **Types Layer Development** (Development Practice)
   - Location: `src/app/core/infra/types/`
   - Priority: P0 (must be completed first)
   - Responsibility: Generate database.types.ts from Supabase

3. **Repositories Layer Development** (Development Practice)
   - Location: `src/app/core/infra/repositories/`
   - Priority: P0 (depends on Types layer)
   - Responsibility: Encapsulate database access, handle snake_case ↔ camelCase conversion

4. **Models Layer Development** (Development Practice)
   - Location: `src/app/shared/models/`
   - Priority: P0 (can be developed in parallel with Repositories)
   - Responsibility: Define business models (camelCase)

5. **Services Layer Development** (Development Practice)
   - Location: `src/app/shared/services/`
   - Priority: P0 (depends on Repositories + Models)
   - Responsibility: Business logic processing, state management with Signals

6. **Facades Layer Development** (Development Practice)
   - Location: `src/app/core/facades/`
   - Priority: P0 (depends on Services)
   - Responsibility: Unified external interface, coordinate multiple Services

7. **Routes Components Layer Development** (Development Practice)
   - Location: `src/app/routes/`
   - Priority: P0 (depends on Facades)
   - Responsibility: UI components, user interaction handling, routing configuration

### Checklist Entities

8. **Development Pre-Check** (Checklist)
   - Requirement analysis, database design, architecture planning, development preparation

9. **Development Post-Check** (Checklist)
   - Code quality check, functional verification, enterprise standards final check, documentation update

### Principle Entities

10. **Four Core Development Principles** (Principle)
    - Common Practices: Follow industry standards
    - Enterprise Standards: Clear code structure, well-defined responsibilities
    - Logical Consistency: Clear data flow, semantic naming
    - Common Sense: Truly usable functions, user experience first

11. **Development Validation Sequence** (Standard)
    - Complete validation sequence: lint → lint:style → type-check → build → test
    - Pre-commit hook and CI/CD enforcement

## 🔄 Relations Added

11 new relations were added to connect the development workflow entities:

- Five Layer Development Order → Five Layer Architecture (implements)
- Types/Repositories/Models/Services/Facades/Routes Layer Development → Five Layer Development Order (partOf)
- Development Pre-Check/Post-Check → Four Core Development Principles (validates)
- Development Validation Sequence → Validation Sequence (implements)
- Four Core Development Principles → Enterprise Development Principles (defines)

## 📚 Key References

- **Development Guide**: `docs/archive/開發順序.md`
- **Agent Instructions**: `AGENTS.md`, `.github/agents/copilot-instructions.md`
- **Architecture Documentation**: `docs/20-完整架構流程圖.mermaid.md`, `docs/21-架構審查報告.md`
- **Database Schema**: `docs/22-完整SQL表結構定義.md`

## 🔍 How to Use This Memory

GitHub Copilot uses this memory to:

1. **Understand project context**: Architecture, tech stack, conventions
2. **Follow development standards**: Coding style, naming conventions, best practices
3. **Respect development workflow**: Five-layer architecture, development order
4. **Apply quality checks**: Four core principles, validation sequence
5. **Generate appropriate code**: Consistent with project standards and patterns

## 🛠️ Maintenance

To maintain this memory:

1. **Add new entities**: When introducing new patterns, standards, or features
2. **Update observations**: When standards or practices change
3. **Add relations**: To show connections between entities
4. **Organize regularly**: Keep entities grouped by category
5. **Validate JSON**: Ensure all lines are valid JSON format

## 📊 Statistics

```
Total lines: 319
├── Entities: 149 (46.7%)
└── Relations: 170 (53.3%)

Entity categories: 33
Relation types: 40

Largest category: Standard (48 entities)
Most common relation: uses (26 occurrences)
```

## ✅ Validation

All JSON lines have been validated and are syntactically correct. The memory file is ready for use by GitHub Copilot.
