# Custom GitHub Actions

> **Purpose**: Reusable custom GitHub Actions for this repository  
> **Version**: 1.0 (2025-01-22)

---

## 📋 Overview

This directory contains custom GitHub Actions that can be used across workflows in this repository. These actions encapsulate common functionality and improve workflow maintainability.

---

## 📂 Directory Structure

```
actions/
├── README.md                # This file
└── (custom actions will be added here)
```

---

## 🎯 Available Actions

Currently, no custom actions are defined. As the project grows, custom actions will be added here for:

- **Setup actions**: Environment configuration, dependency caching
- **Build actions**: Custom build steps, artifact generation
- **Test actions**: Custom test runners, coverage reporting
- **Deployment actions**: Custom deployment workflows
- **Utility actions**: Code quality checks, notification helpers

---

## 📝 Creating a Custom Action

### Directory Structure for an Action
```
actions/
└── action-name/
    ├── action.yml       # Action definition
    ├── README.md        # Action documentation
    └── scripts/         # Action scripts (if needed)
```

### Using a Custom Action in Workflows
```yaml
# In .github/workflows/workflow-name.yml
jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Use custom action
        uses: ./.github/actions/action-name
        with:
          input-name: 'value'
```

---

## 🔗 Related Resources

- **Workflows**: [../workflows/](../workflows/) - GitHub Actions workflows
- [GitHub Actions Documentation](https://docs.github.com/actions)

---

**Last Updated**: 2025-01-22  
**Owners**: DevOps Team, Development Team
