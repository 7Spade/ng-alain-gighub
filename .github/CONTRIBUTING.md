# Contributing to ng-alain-gighub

Thank you for your interest in contributing to ng-alain-gighub! This document provides guidelines and instructions for contributing to this project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Testing](#testing)
- [Documentation](#documentation)

---

## 🤝 Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please be respectful and constructive in all interactions.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- Yarn 4.x
- Git

### Setup Development Environment
```bash
# Clone the repository
git clone https://github.com/7Spade/ng-alain-gighub.git
cd ng-alain-gighub

# Install dependencies
yarn install

# Copy environment file
cp .env.example .env

# Start development server
yarn start
```

### Project Structure
- `src/app/` - Application source code
- `docs/` - Documentation
- `.github/` - GitHub configurations and templates
- For detailed structure, see `docs/README.md`

---

## 💻 Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Changes
- Follow the [five-layer architecture](docs/archive/開發順序.md)
- Write clean, maintainable code
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes
```bash
# Run linting
yarn lint
yarn lint:style

# Run type checking
yarn type-check

# Run tests
yarn test

# Build the project
yarn build
```

### 4. Commit Your Changes
Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:
```bash
git commit -m "feat: add user dashboard component"
git commit -m "fix: resolve navigation bug"
git commit -m "docs: update API documentation"
```

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```
Then create a Pull Request on GitHub using the appropriate template.

---

## 📏 Coding Standards

### TypeScript
- Use strict TypeScript types
- Avoid `any` type (document exceptions)
- Follow Angular style guide

### Angular
- Angular 20 + NG-ZORRO 20 + ng-alain 20
- Use Standalone Components
- Use `inject()` for dependency injection
- Use `OnPush` change detection strategy
- Use Angular Signals for state management
- Import from `SHARED_IMPORTS` for common dependencies

### Code Quality
- Run `yarn lint` and `yarn lint:style` before committing
- Ensure `yarn type-check` passes
- Maintain test coverage ≥80% for Services
- Follow project patterns in `.github/copilot/memory.jsonl`

### File Organization
Follow the five-layer architecture:
1. Types (database types, interfaces)
2. Repositories (data access)
3. Models (business models)
4. Services (business logic)
5. Facades (state management)
6. Routes/Components (UI)

---

## 📝 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples
```bash
feat(dashboard): add user statistics widget
fix(auth): resolve token refresh issue
docs(api): update authentication endpoint documentation
refactor(services): extract common logic to base service
test(dashboard): add unit tests for statistics component
```

---

## 🔍 Pull Requests

### Before Creating a PR
- [ ] Code follows project standards
- [ ] All tests pass
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Self-review completed

### PR Templates
Use appropriate template from `.github/pull_request_template/`:
- `feature.md` - New features
- `bugfix.md` - Bug fixes
- `documentation.md` - Documentation updates
- `default.md` - General changes

### PR Title
Follow Conventional Commits format:
```
feat: add user dashboard
fix: resolve navigation bug
docs: update contribution guide
```

### PR Description
Include:
- Clear description of changes
- Motivation/context
- Testing performed
- Screenshots (for UI changes)
- Breaking changes (if any)
- Related issues

### Review Process
- At least one approval required
- All CI checks must pass
- Address reviewer feedback
- Keep PR focused and small when possible

---

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage
```

### Test Requirements
- Services: ≥80% coverage
- New features: Unit tests required
- Bug fixes: Regression tests required
- Critical paths: E2E tests required

### Test Structure
```typescript
describe('FeatureService', () => {
  let service: FeatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle feature logic correctly', () => {
    // Test implementation
  });
});
```

---

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for public APIs
- Document complex logic
- Keep README files up-to-date

### Project Documentation
Located in `docs/` directory:
- Architecture documentation
- API documentation
- Development guides
- Best practices

### Documentation Standards
- Use clear, concise language
- Provide code examples
- Keep documentation current
- Update relevant docs with code changes

---

## 🔒 Security

### Reporting Security Issues
Please report security vulnerabilities to the maintainers privately. Do not open public issues for security concerns.

### Security Best Practices
- Never commit secrets or API keys
- Use environment variables for sensitive data
- Follow RLS (Row Level Security) policies
- Validate all user inputs
- Use Supabase Auth for authentication

---

## 📞 Getting Help

### Resources
- [Documentation](docs/README.md)
- [Architecture Guide](docs/architecture/)
- [Development Best Practices](docs/42-開發最佳實踐指南.md)
- [Quick Start Guide](docs/25-快速開始指南.md)

### Questions?
- Open a GitHub Discussion
- Check existing issues
- Review documentation
- Contact maintainers

---

## 🙏 Thank You!

Your contributions make this project better. We appreciate your time and effort!

---

**Last Updated**: 2025-01-22  
**Maintainers**: Development Team
