<!-- 
Feature PR Template
Use this template for new feature development
URL: ?template=feature.md
-->

## 🎯 Feature Description

<!-- Provide a clear and concise description of the new feature -->

### Motivation
<!-- Why is this feature needed? What problem does it solve? -->

### User Story
<!-- As a [user type], I want [goal] so that [benefit] -->

---

## 🔧 Implementation Details

### Architecture Changes
<!-- Describe any architectural changes or patterns used -->
- Follows five-layer architecture: Types → Repositories → Models → Services → Facades → Components
- [ ] Types layer updated
- [ ] Repositories layer implemented
- [ ] Models layer defined
- [ ] Services layer implemented
- [ ] Facades layer implemented
- [ ] Components layer implemented

### Key Components
<!-- List main components/services/modules added or modified -->
- 
- 
- 

### Database Changes
<!-- List any database schema changes -->
- [ ] No database changes
- [ ] New tables added (list below)
- [ ] Existing tables modified (list below)
- [ ] RLS policies updated
- [ ] Migrations created

### Dependencies Added
<!-- List any new dependencies -->
- [ ] No new dependencies
- [ ] New dependencies (list below):
  - 
  - 

---

## 🎨 UI/UX Changes

<!-- If this feature includes UI changes, provide screenshots/videos -->

### Before
<!-- Screenshot or description of previous state -->

### After
<!-- Screenshot or description of new state -->

### Responsive Design
- [ ] Tested on desktop (1920x1080)
- [ ] Tested on tablet (768x1024)
- [ ] Tested on mobile (375x667)

---

## 🧪 Testing Performed

### Unit Tests
- [ ] New unit tests added (≥80% coverage for Services)
- [ ] All existing tests pass
- [ ] Test command: `yarn test`

### E2E Tests
- [ ] E2E tests added for critical paths
- [ ] All E2E tests pass
- [ ] Test command: `yarn e2e`

### Manual Testing
- [ ] Feature tested in development environment
- [ ] Tested with different user roles
- [ ] Tested edge cases
- [ ] Tested error scenarios

### Test Scenarios
<!-- Describe main test scenarios -->
1. 
2. 
3. 

---

## ⚡ Performance Impact

<!-- Describe any performance considerations -->
- [ ] No performance impact
- [ ] Performance measured and acceptable
- [ ] Performance optimizations applied

### Metrics
<!-- If applicable, provide before/after performance metrics -->
- Initial load time: 
- Bundle size impact: 
- Memory usage: 

---

## 🔒 Security Considerations

- [ ] No security vulnerabilities checked (gh-advisory-database)
- [ ] RLS policies verified
- [ ] Authentication/authorization properly implemented
- [ ] Input validation added
- [ ] No sensitive data exposed

---

## 📚 Documentation Updates

- [ ] Code comments added where necessary
- [ ] README updated (if applicable)
- [ ] Architecture documentation updated
- [ ] API documentation updated (if applicable)
- [ ] User-facing documentation updated (if applicable)

### Documentation Links
<!-- Links to updated documentation -->
- 
- 

---

## 🔄 Breaking Changes

- [ ] No breaking changes
- [ ] Breaking changes (describe below and provide migration guide)

### Migration Guide
<!-- If breaking changes exist, provide clear migration steps -->

---

## ✅ Checklist

### Code Quality
- [ ] Code follows project standards (TypeScript, Angular, NG-ZORRO)
- [ ] `yarn lint` passes
- [ ] `yarn lint:style` passes
- [ ] `yarn type-check` passes
- [ ] `yarn build` succeeds
- [ ] No console errors or warnings

### Testing
- [ ] Unit tests pass (`yarn test`)
- [ ] E2E tests pass (if applicable)
- [ ] Manual testing completed
- [ ] Tested in different browsers (Chrome, Firefox, Safari)

### Documentation
- [ ] Code is self-documenting
- [ ] Comments added for complex logic
- [ ] Documentation updated

### Review
- [ ] Self-review completed
- [ ] Copilot instructions followed (.github/copilot-instructions.md)
- [ ] Enterprise standards met
- [ ] No TODO or FIXME comments left

### Deployment
- [ ] Environment variables documented (if new ones added)
- [ ] Rollback plan documented (if needed)
- [ ] Database migrations tested (if applicable)

---

## 🔗 Related Issues

<!-- Link related issues using GitHub keywords -->
Closes #
Related to #

---

## 📝 Additional Notes

<!-- Any additional context, decisions, or notes for reviewers -->

---

## 🤝 Reviewers

<!-- Tag specific reviewers if needed -->
@reviewer1 @reviewer2

**Review Focus**:
- Architecture and design patterns
- Code quality and maintainability
- Test coverage and effectiveness
- Documentation completeness

---

<!-- 
For reviewers: Please check .github/copilot-instructions.md for project standards
-->
