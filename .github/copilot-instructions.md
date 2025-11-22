# Repository-specific Instructions (GitHub Copilot / Copilot Agents)

> **Canonical Entry Point**: This file is the authoritative source for repository-specific Copilot instructions.
> 
> **Version**: 3.1 (2025-01-22)

---

## 📋 Summary

- This file is the **canonical repository-specific instructions** that GitHub Copilot will read
- Keep **essential rules** here; link to detailed sections in `./copilot-instructions/` for longer guidelines
- For **Agent Mode** (complex tasks), refer to `./agents/` directory

---

## 🎯 Core Rules (Essential & Authoritative)

### Code Quality
- **TypeScript**: Use strict types, avoid `any`. If `any` is used, document why and propose alternatives
- **Linting**: Run `yarn lint` and `yarn lint:style` before committing. All code must pass ESLint and Stylelint
- **Type Checking**: Run `yarn type-check` to ensure no TypeScript errors
- **Building**: Run `yarn build` to verify production build succeeds

### Angular Standards
- **Version**: Angular 20 + NG-ZORRO 20 + ng-alain 20 + Supabase
- **Architecture**: Follow five-layer architecture: Types → Repositories → Models → Services → Facades → Routes/Components
- **Components**: Use Standalone Components with `inject()` for dependency injection
- **Change Detection**: Use `OnPush` strategy for all components
- **State Management**: Use Angular Signals for state management
- **Imports**: Use `SHARED_IMPORTS` from `@shared` for common dependencies

### Testing Requirements
- **Coverage**: Minimum 80% test coverage for Services layer
- **Unit Tests**: All Services, Facades, and Repositories must have unit tests
- **E2E Tests**: Critical user flows must have E2E tests
- **Before PR**: Run `yarn test` to ensure all tests pass

### Security
- **No Secrets**: Never add secrets, API keys, or credentials to the repository
- **Environment Variables**: Use `.env` files (gitignored) for sensitive configuration
- **RLS Policies**: All database operations must respect Row Level Security (RLS) policies
- **Authentication**: Use Supabase Auth with `@delon/auth` integration

### Development Workflow
- **Large Changes**: Open an Issue/RFC first, propose incremental PRs with migration steps
- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/) specification
- **PR Process**: Use PR templates from `./pull_request_template/` based on change type
- **CI Checks**: Ensure all CI checks pass (lint, type-check, tests, build)

---

## 📚 Index to Detailed Guidance

### VSCode Copilot Instructions (Global)
Located in `./copilot-instructions/` directory:
- [Development Standards](./copilot-instructions/README.md)
- Code generation guidelines
- Code review guidelines
- Testing guidelines
- Commit message conventions
- PR description templates

### GitHub Copilot Agent Mode (Complex Tasks)
Located in `./agents/` directory:
- [Agent Configuration Overview](./agents/README.md)
- [Quick Start Guide](./agents/QUICK-START.md)
- [Agent Index](./agents/INDEX.md)
- Core configuration modules (`./agents/core/`)
- Detailed guides (`./agents/guides/`)
- Domain experts (`./agents/domain/`)

### Project Memory Repository
Located in `./copilot/` directory:
- [memory.jsonl](./copilot/memory.jsonl) - 149 entities + 170 relations
- [Usage Guide](./copilot/README.md)
- [Memory Summary](./copilot/MEMORY_SUMMARY.md)

---

## 🔄 Pull Request Process

### PR Templates
- **Location**: `./PULL_REQUEST_TEMPLATE.md` (default) or `./pull_request_template/` (specific types)
- **Template Types**: `feature.md`, `bugfix.md`, `security.md`, `documentation.md`, `refactor.md`
- **Selection Guide**: See `./pull_request_template/README.md`

### PR Requirements
- Reference this file and follow core rules above
- Include: purpose, changes summary, test steps, rollback plan, risk level
- Link related issues or RFCs
- Ensure all CI checks pass
- Get at least one approval before merging

---

## 🤖 How Copilot Agents Should Use This File

### General Guidelines
- Treat **Core Rules** as authoritative constraints
- When generating code or PR text, include:
  - Clear purpose and motivation
  - Summary of changes
  - Testing steps
  - Rollback plan (if applicable)
  - Risk level assessment

### Decision Making
- If uncertain, list options and ask for confirmation before making breaking changes
- Reference appropriate PR template based on change type
- For architectural decisions, consult `./copilot/memory.jsonl` for existing patterns

### Complex Tasks (Agent Mode)
- **Mandatory**: Check `./agents/QUICK-START.md` first
- **Planning**: Use Sequential Thinking and Software Planning MCP tools
- **Memory**: Always query `./copilot/memory.jsonl` before starting tasks
- **Architecture**: Review system architecture mindmap in `docs/architecture/`
- **Compliance**: Follow enterprise-standard checklists in `./agents/guides/`

---

## 📂 Directory Structure

```
.github/
├── copilot-instructions.md       # ← This file (entry point)
├── copilot-instructions/         # Detailed VSCode Copilot guidelines
├── agents/                       # Agent Mode configurations
├── copilot/                      # Project memory repository
├── actions/                      # Custom GitHub Actions
├── workflows/                    # CI/CD pipelines
├── pull_request_template/        # Multiple PR templates
├── ISSUE_TEMPLATE/               # Issue templates
├── README.md                     # Full structure guide
└── ... other configs
```

**Full Structure Guide**: [.github/README.md](./README.md)

---

## 🔗 Quick Reference

### Documentation
- **Main Docs**: `../docs/README.md`
- **Architecture**: `../docs/architecture/01-system-architecture-mindmap.mermaid.md`
- **Quick Start**: `../docs/25-快速開始指南.md`
- **Best Practices**: `../docs/42-開發最佳實踐指南.md`

### Key Resources
- **SHARED_IMPORTS Guide**: `../docs/37-SHARED_IMPORTS-使用指南.md`
- **SQL Schema**: `../docs/22-完整SQL表結構定義.md`
- **Architecture Review**: `../docs/21-架構審查報告.md`

### External Links
- [Angular Docs](https://angular.dev/)
- [NG-ZORRO Docs](https://ng.ant.design/)
- [ng-alain Docs](https://ng-alain.com/)
- [Supabase Docs](https://supabase.com/docs)

---

## ⚠️ Important Notes

### For VSCode Copilot Chat
- This file is automatically loaded by VSCode GitHub Copilot
- Use for daily development tasks and code generation
- Complements detailed guidelines in `./copilot-instructions/`

### For GitHub Copilot Agent Mode
- Use `./agents/` configurations for complex tasks
- Always start with Sequential Thinking and Software Planning tools
- Query project memory (`./copilot/memory.jsonl`) before making decisions
- Follow enterprise-standard development sequence

### For Contributors
- Read [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines
- Follow [DEFINITION_OF_DONE.md](../DEFINITION_OF_DONE.md) checklist
- Review [SECURITY.md](./SECURITY.md) for security practices

---

**Last Updated**: 2025-01-22  
**Maintained by**: Development Team  
**Questions?** Open an issue or discussion
