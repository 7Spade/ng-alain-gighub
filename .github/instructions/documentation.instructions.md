---
applyTo: "docs/**/*.md"
---

# Documentation Instructions

## Documentation Standards

This project maintains comprehensive documentation in Traditional Chinese (繁體中文) with clear structure and hierarchy.

## Writing Style

### Language
- **Primary**: Traditional Chinese (繁體中文)
- **Code/Technical Terms**: English
- **Examples**: Both languages when helpful

### Tone
- **Clear and concise**: Avoid unnecessary complexity
- **Professional**: Maintain technical accuracy
- **Helpful**: Include examples and references
- **Updated**: Keep version info and dates current

## Document Structure

### Required Sections
1. **Title**: Clear, descriptive title
2. **Purpose/Overview**: Why this document exists
3. **Content**: Main information, well-organized
4. **Examples**: Code examples where relevant
5. **References**: Links to related documents
6. **Metadata**: Last updated date, version, maintainer

### Example Template
```markdown
# Document Title

> **目的**：Brief description of purpose

**最後更新**：YYYY-MM-DD
**版本**：v2.0
**維護者**：Development Team

---

## Overview

Main content here...

## Examples

\`\`\`typescript
// Code examples
\`\`\`

## References

- [Related Doc 1](./path-to-doc.md)
- [Related Doc 2](./path-to-doc.md)
```

## Updating Documentation

### When to Update
- **Architecture changes**: Update architecture diagrams and descriptions
- **New features**: Document new functionality
- **Breaking changes**: Clearly mark and explain
- **Best practices**: Add learnings and patterns

### What to Update
1. **Related docs**: Update all documents affected by changes
2. **Indexes**: Update `docs/README.md` if adding/removing docs
3. **Cross-references**: Update links in related documents
4. **Version info**: Update "Last Updated" dates
5. **Examples**: Keep code examples current

## Markdown Best Practices

### Headings
```markdown
# H1 - Main Title (one per document)
## H2 - Major Sections
### H3 - Subsections
#### H4 - Details (use sparingly)
```

### Code Blocks
```markdown
\`\`\`typescript
// Always specify language for syntax highlighting
const example = 'code';
\`\`\`
```

### Links
```markdown
# Prefer relative paths
[Documentation](./00-開發作業指引.md)

# Anchor links for same document
[Jump to Section](#section-name)
```

### Lists
```markdown
# Ordered lists for steps
1. First step
2. Second step
3. Third step

# Unordered lists for items
- Item one
- Item two
- Item three
```

### Emphasis
```markdown
**Bold** for strong emphasis
*Italic* for light emphasis
`Code` for inline code
> Quote for important notes
```

## Mermaid Diagrams

### When to Use
- Architecture overviews
- Process flows
- State diagrams
- Entity relationships

### Example
```markdown
\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
\`\`\`
```

## Document Types

### Architecture Docs (10-29)
- System design and structure
- Keep diagrams updated
- Include rationale for decisions

### Development Guides (30-50)
- Practical how-to content
- Include code examples
- Reference related docs

### Reference Docs (FYI)
- Historical context
- Design decisions
- Background information

## Quality Checklist

Before committing documentation:
- [ ] Clear, descriptive title
- [ ] Purpose/overview section
- [ ] Well-organized content
- [ ] Code examples tested
- [ ] Cross-references verified
- [ ] Metadata updated (date, version)
- [ ] Markdown properly formatted
- [ ] Links work correctly
- [ ] Diagrams render properly

## Common Issues to Avoid

1. **Outdated information**: Always update dates and versions
2. **Broken links**: Verify all internal links
3. **Missing context**: Explain why, not just what
4. **Inconsistent formatting**: Follow established patterns
5. **No examples**: Include practical examples
6. **Poor organization**: Use clear hierarchy

## Reference
- Documentation inventory: `docs/documentation-inventory.md`
- Project structure: `docs/01-專案結構說明.md`
- Index: `docs/README.md`
