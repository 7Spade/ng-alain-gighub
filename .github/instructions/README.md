# GitHub Copilot Instructions Directory

This directory contains module-specific and context-specific instructions for GitHub Copilot coding agent.

## 📁 Structure

### Main Instructions
- **[copilot-instructions.md](../agents/copilot-instructions.md)** - Primary instructions applied to all code

### Module-Specific Instructions
- **[shared.instructions.md](./shared.instructions.md)** - Applied to `src/app/shared/**/*`
  - SHARED_IMPORTS pattern
  - Component design guidelines
  - Reusable component standards

- **[routes.instructions.md](./routes.instructions.md)** - Applied to `src/app/routes/**/*`
  - Feature module structure
  - Git-like branching model context
  - API integration patterns

- **[core.instructions.md](./core.instructions.md)** - Applied to `src/app/core/**/*`
  - Singleton services
  - Interceptors and guards
  - Global application services

### Context-Specific Instructions
- **[testing.instructions.md](./testing.instructions.md)** - Applied to `**/*.spec.ts`
  - Testing framework (Karma + Jasmine)
  - Signal testing patterns
  - Coverage requirements

- **[documentation.instructions.md](./documentation.instructions.md)** - Applied to `docs/**/*.md`
  - Documentation standards
  - Writing style guide
  - Markdown best practices

## 🎯 How It Works

GitHub Copilot automatically applies relevant instructions based on the file you're editing:

1. **Global Instructions** (copilot-instructions.md) are always included
2. **Module-Specific Instructions** are added when editing files matching the `applyTo:` pattern
3. **Multiple Instructions** can apply simultaneously for comprehensive context

## 📝 YAML Frontmatter

Each instruction file uses YAML frontmatter to define its scope:

```yaml
---
applyTo: "src/app/shared/**/*"     # File pattern to match
excludeAgent: "code-review"         # Optional: exclude specific agents
---
```

## 🔄 When to Update

Update instructions when:
- Architecture or patterns change
- New best practices are established
- Module-specific rules need clarification
- Common mistakes need prevention

## 📚 References

- **Best Practices**: [GitHub Copilot Best Practices](https://docs.github.com/en/copilot/tutorials/coding-agent/get-the-best-results)
- **Custom Instructions**: [Copilot Custom Instructions](https://docs.github.com/en/copilot/tutorials/coding-agent/add-instructions)
- **Project Documentation**: [docs/README.md](../../docs/README.md)
- **Cursor Rules**: [.cursor/rules/](../../.cursor/rules/)

---

**Last Updated**: 2025-01-15  
**Maintained By**: Development Team
