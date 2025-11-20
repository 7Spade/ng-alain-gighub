# Cursor Rule Files Documentation

This directory contains the Cursor IDE rule files for the project. These rules are automatically applied to Cursor's AI features (Agent, Inline Edit, etc.).

## 📁 Rule File Structure

### Core Development Standards

- **typescript.mdc** - TypeScript type safety and best practices
  - Type safety principles
  - Type matching validation
  - Model definitions aligned with database

- **angular.mdc** - Angular 20 best practices and modern syntax
  - Standalone Components
  - Signals state management
  - Modern control flow
  - Typed Forms
  - Performance optimization

- **modern-angular.mdc** - Angular 20 modern features and migration guide
  - Signal Inputs and Outputs
  - Signal Queries
  - Standalone migration
  - Template best practices
  - Diagnostics and error handling

- **shared-imports.mdc** - Shared module usage priority standards
  - SHARED_IMPORTS usage principles
  - Exception handling

### Architecture and Design Standards

- **architecture.mdc** - Layered architecture and dependencies
  - Dependency direction standards
  - Git-like branching model
  - 51-table database architecture
  - Core design principles

- **git-model.mdc** - Git-like branching model and version control
  - Branch model standards
  - Version control standards
  - Branch permissions

### Code Quality Standards

- **code-quality.mdc** - Code quality and best practices
  - No duplicate code/reinventing the wheel
  - No ad-hoc fixes
  - Naming convention consistency
  - Documentation requirements

- **linting.mdc** - ESLint code checking standards
  - ESLint configuration and usage
  - Code checking rules
  - Git Hooks integration

- **formatting.mdc** - Prettier code formatting standards
  - Prettier configuration
  - Formatting rules
  - Editor integration

- **styling.mdc** - Stylelint and Less styling standards
  - Stylelint configuration
  - Less usage standards
  - Style organization

- **error-handling.mdc** - Error handling and state management
  - Error handling principles
  - Error categorization
  - Error handling services

- **api-design.mdc** - API design and Repository pattern
  - Repository pattern
  - API functionality requirements
  - Permission validation

- **security.mdc** - Security standards and best practices
  - Database security
  - Sensitive data handling
  - Permission validation

- **testing.mdc** - Testing standards and coverage requirements
  - Coverage requirements
  - Karma + Jasmine configuration
  - Angular Testing Utilities
  - Testing best practices

- **accessibility.mdc** - Accessibility standards (WCAG 2.1 AA)
  - ARIA labels
  - Keyboard navigation
  - Visual design

### Tool Usage Standards

- **mcp-tools.mdc** - MCP tool usage standards
  - Context7
  - Sequential Thinking
  - Software Planning Tool
  - Memory
  - Supabase MCP

### Development Tool Standards

- **git-workflow.mdc** - Git workflow and commit standards
  - Conventional Commits
  - Husky Git Hooks
  - lint-staged configuration
  - Branch strategy

- **build-deploy.mdc** - Build and deployment standards
  - Build commands and configuration
  - Performance analysis
  - Pre-deployment checks

- **dependency-management.mdc** - Yarn dependency management standards
  - Yarn usage standards
  - Version management
  - Security checks

- **theming.mdc** - ng-alain theme customization standards
  - Theme tool usage
  - Color system
  - Theme variables

- **performance.mdc** - Performance monitoring and optimization standards
  - Bundle size monitoring
  - Performance metrics
  - Optimization strategies

### Module-Specific Standards

- **shared-specific.mdc** - Shared module specific standards
  - SHARED_IMPORTS priority usage
  - Reusable component design
  - Utility functions and shared services

- **routes-specific.mdc** - Routes module specific standards
  - Route configuration
  - API design standards
  - Business logic organization

- **layout-specific.mdc** - Layout module specific standards
  - Responsive design
  - Layout state management
  - Navigation structure

- **core-specific.mdc** - Core module specific standards
  - HTTP interceptors
  - Internationalization services
  - Route guards

## 📝 Rule Types

According to Cursor documentation, rules are categorized as:

- **Always** (`alwaysApply: true`) - Always included in model context
- **Auto Attached** (`globs` specified) - Automatically attached when files match glob patterns
- **Agent Requested** (`alwaysApply: false` with `description`) - AI decides whether to include
- **Manual** - Only explicitly included when using `@ruleName`

## 🔧 Usage

### Using in Cursor IDE

1. **Auto Apply**: Rules marked with `alwaysApply: true` are automatically applied
2. **Manual Reference**: Use `@ruleName` in conversations to reference specific rules
3. **File Matching**: When editing files matching `globs` patterns, related rules are automatically attached

### Viewing Rules

- In Cursor IDE, rules are automatically displayed in the AI conversation context
- All rule files can be viewed in the `.cursor/rules/` directory

## 📚 Related Documentation

- [Cursor Rules Documentation](https://docs.cursor.com/context/rules)
- [AGENTS.md](../../AGENTS.md) - High-level architecture decisions
- [Development Guidelines](../docs/00-開發作業指引.md) - Complete development standards

## 🔄 Updating Rules

When updating rules:

1. Edit the corresponding `.mdc` file
2. Update references in `AGENTS.md` (if needed)
3. Rules will automatically take effect in the next AI conversation

- --

**Last Updated**: 2025-01-15
**Maintained By**: Development Team

