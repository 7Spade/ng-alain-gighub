# Pull Request Templates

> **Purpose**: Multiple PR templates for different change types  
> **Version**: 1.0 (2025-01-22)

---

## 📋 Overview

This directory contains specialized pull request templates for different types of changes. Using the appropriate template ensures consistent and comprehensive PR descriptions.

---

## 📂 Available Templates

| Template | Use For | URL Parameter |
|----------|---------|---------------|
| **default.md** | General changes | (default, no parameter needed) |
| **feature.md** | New features | `?template=feature.md` |
| **bugfix.md** | Bug fixes | `?template=bugfix.md` |
| **security.md** | Security patches | `?template=security.md` |
| **documentation.md** | Documentation updates | `?template=documentation.md` |
| **refactor.md** | Code refactoring | `?template=refactor.md` |

---

## 🎯 How to Use

### Method 1: URL Parameter (Recommended)
When creating a PR, add the template parameter to the URL:
```
https://github.com/7Spade/ng-alain-gighub/compare/main...your-branch?template=feature.md
```

### Method 2: GitHub UI
1. Create a new pull request
2. If multiple templates exist, GitHub will show a template picker
3. Select the appropriate template

### Method 3: Default Template
If no template is specified, GitHub uses `../PULL_REQUEST_TEMPLATE.md` as the default.

---

## 📝 Template Descriptions

### Feature Template
**File**: `feature.md`  
**Purpose**: New feature development

**Sections**:
- Feature description
- Implementation details
- UI/UX changes (with screenshots)
- Testing performed
- Breaking changes
- Migration guide (if needed)

### Bugfix Template
**File**: `bugfix.md`  
**Purpose**: Bug fixes and corrections

**Sections**:
- Bug description
- Root cause analysis
- Fix implementation
- Testing performed
- Regression prevention
- Related issues

### Security Template
**File**: `security.md`  
**Purpose**: Security patches and vulnerability fixes

**Sections**:
- Security issue description (private if needed)
- Vulnerability assessment
- Fix implementation
- Security testing performed
- Impact analysis
- Disclosure timeline

### Documentation Template
**File**: `documentation.md`  
**Purpose**: Documentation updates

**Sections**:
- Documentation changes
- Motivation
- Related features/changes
- Review checklist

### Refactor Template
**File**: `refactor.md`  
**Purpose**: Code refactoring without functional changes

**Sections**:
- Refactoring goals
- Changes made
- Testing performed
- Performance impact
- Breaking changes (should be none)

---

## ✍️ Template Guidelines

### All Templates Should Include
1. **Clear title**: Conventional Commits format (e.g., `feat: add user dashboard`)
2. **Description**: What and why
3. **Changes**: Specific changes made
4. **Testing**: How changes were tested
5. **Checklist**: Pre-merge requirements
6. **Related Issues**: Links to issues/discussions

### Template Structure
```markdown
## Description
Clear description of changes

## Changes Made
- Change 1
- Change 2

## Testing Performed
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project standards
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] CI checks pass

## Related Issues
Closes #123
```

---

## 🔗 Related Resources

- **Default PR Template**: [../PULL_REQUEST_TEMPLATE.md](../PULL_REQUEST_TEMPLATE.md)
- **Copilot Instructions**: [../copilot-instructions.md](../copilot-instructions.md)
- **Contributing Guide**: [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
- **Conventional Commits**: https://www.conventionalcommits.org/

---

## 🆕 Adding New Templates

### Process
1. Create new `.md` file in this directory
2. Use descriptive name (e.g., `performance.md`, `hotfix.md`)
3. Follow template structure guidelines
4. Add to table in this README
5. Test template with a sample PR

### Template Checklist
- [ ] Clear, descriptive filename
- [ ] All required sections included
- [ ] Consistent formatting
- [ ] Example filled out
- [ ] Added to README index
- [ ] Tested with sample PR

---

## 🔄 Maintenance

**Last Updated**: 2025-01-22  
**Review Frequency**: Quarterly or when process changes  
**Owners**: Development Team

---

## ❓ Questions?

For questions about:
- **Using templates**: See examples in existing PRs
- **Template content**: Check [../copilot-instructions.md](../copilot-instructions.md)
- **PR process**: Review [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
