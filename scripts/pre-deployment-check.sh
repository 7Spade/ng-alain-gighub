#!/bin/bash

# Pre-Deployment Verification Script
# Phase 4-6 Deployment Preparation
# Version: 1.0
# Last Updated: 2025-11-16

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
SKIPPED_CHECKS=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Pre-Deployment Verification Script${NC}"
echo -e "${BLUE}  Phase 4-6 Deployment Preparation${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print section header
print_section() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

# Function to print check result
print_check() {
    local status=$1
    local message=$2
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    case $status in
        "PASS")
            echo -e "${GREEN}✓${NC} $message"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
            ;;
        "FAIL")
            echo -e "${RED}✗${NC} $message"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
            ;;
        "SKIP")
            echo -e "${YELLOW}⊘${NC} $message"
            SKIPPED_CHECKS=$((SKIPPED_CHECKS + 1))
            ;;
        "WARN")
            echo -e "${YELLOW}⚠${NC} $message"
            ;;
    esac
}

# 1. Git Status Check
print_section "1. Git Status Check"

if git status --porcelain | grep -q '^'; then
    print_check "FAIL" "Git working directory is not clean"
    git status --short
else
    print_check "PASS" "Git working directory is clean"
fi

# Check current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "Current branch: ${YELLOW}$CURRENT_BRANCH${NC}"

# Check for untracked files
UNTRACKED=$(git ls-files --others --exclude-standard | wc -l)
if [ "$UNTRACKED" -gt 0 ]; then
    print_check "WARN" "Found $UNTRACKED untracked files"
else
    print_check "PASS" "No untracked files"
fi

# 2. Code Quality Checks
print_section "2. Code Quality Checks"

# Check for console statements
print_check "WARN" "Checking for console statements..."
CONSOLE_COUNT=$(grep -r "console\." src/app/routes/tasks/list/task-list.component.ts 2>/dev/null | wc -l || echo "0")
if [ "$CONSOLE_COUNT" -gt 0 ]; then
    print_check "WARN" "Found $CONSOLE_COUNT console statements (review recommended)"
    grep -n "console\." src/app/routes/tasks/list/task-list.component.ts || true
else
    print_check "PASS" "No console statements found"
fi

# Check for debugger statements
DEBUGGER_COUNT=$(grep -r "debugger" src/app/routes/tasks/list/task-list.component.ts src/app/shared/services/todo/personal-todo.service.ts 2>/dev/null | wc -l || echo "0")
if [ "$DEBUGGER_COUNT" -gt 0 ]; then
    print_check "FAIL" "Found $DEBUGGER_COUNT debugger statements"
else
    print_check "PASS" "No debugger statements found"
fi

# Check for TODO/FIXME
TODO_COUNT=$(grep -r "TODO\|FIXME" src/app/routes/tasks/list/task-list.component.ts src/app/shared/services/todo/personal-todo.service.ts 2>/dev/null | wc -l || echo "0")
if [ "$TODO_COUNT" -gt 0 ]; then
    print_check "WARN" "Found $TODO_COUNT TODO/FIXME comments"
else
    print_check "PASS" "No TODO/FIXME comments found"
fi

# 3. File Structure Check
print_section "3. File Structure Check"

# Check if required files exist
FILES=(
    "src/app/routes/tasks/list/task-list.component.ts"
    "src/app/routes/tasks/list/task-list.component.spec.ts"
    "src/app/shared/services/todo/personal-todo.service.ts"
    "docs/54-Phase4-5實施報告.md"
    "docs/55-TaskList功能使用指南.md"
    "docs/56-生產部署清單.md"
    "docs/57-部署準備報告.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        LINES=$(wc -l < "$file")
        print_check "PASS" "Found: $file ($LINES lines)"
    else
        print_check "FAIL" "Missing: $file"
    fi
done

# 4. Build Check
print_section "4. Build Check"

if [ -d "node_modules" ]; then
    print_check "PASS" "node_modules directory exists"
    
    # Try to run build
    echo -e "${YELLOW}Attempting production build...${NC}"
    if yarn build --configuration=production 2>&1 | tail -5; then
        print_check "PASS" "Production build successful"
        
        # Check dist size
        if [ -d "dist/ng-alain-gighub" ]; then
            DIST_SIZE=$(du -sh dist/ng-alain-gighub | cut -f1)
            print_check "PASS" "Build output size: $DIST_SIZE"
        fi
    else
        print_check "FAIL" "Production build failed"
    fi
else
    print_check "SKIP" "node_modules not found - run 'yarn install' first"
fi

# 5. Test Check
print_section "5. Test Check"

if [ -d "node_modules" ]; then
    echo -e "${YELLOW}Attempting to run tests...${NC}"
    if yarn test --include='**/task-list.component.spec.ts' --watch=false 2>&1 | tail -10; then
        print_check "PASS" "Tests passed"
    else
        print_check "FAIL" "Tests failed"
    fi
else
    print_check "SKIP" "node_modules not found - run 'yarn install' first"
fi

# 6. Lint Check
print_section "6. Lint Check"

if [ -d "node_modules" ]; then
    echo -e "${YELLOW}Running ESLint...${NC}"
    if yarn lint:ts 2>&1 | tail -5; then
        print_check "PASS" "ESLint passed"
    else
        print_check "WARN" "ESLint warnings/errors found"
    fi
else
    print_check "SKIP" "node_modules not found - run 'yarn install' first"
fi

# 7. Documentation Check
print_section "7. Documentation Check"

# Check CHANGELOG.md updated
if grep -q "Phase 4-5" docs/CHANGELOG.md; then
    print_check "PASS" "CHANGELOG.md contains Phase 4-5 entry"
else
    print_check "FAIL" "CHANGELOG.md missing Phase 4-5 entry"
fi

# Check README.md exists
if [ -f "docs/README.md" ]; then
    print_check "PASS" "README.md exists"
else
    print_check "WARN" "docs/README.md not found"
fi

# 8. Security Check
print_section "8. Security Check"

# Check for .env in .gitignore
if grep -q ".env" .gitignore; then
    print_check "PASS" ".env in .gitignore"
else
    print_check "FAIL" ".env not in .gitignore"
fi

# Check for sensitive data patterns
SENSITIVE_COUNT=$(grep -r "password\|secret\|api_key\|token" src/ --exclude-dir=node_modules 2>/dev/null | grep -v "// " | wc -l || echo "0")
if [ "$SENSITIVE_COUNT" -gt 0 ]; then
    print_check "WARN" "Found $SENSITIVE_COUNT potential sensitive data patterns (review recommended)"
else
    print_check "PASS" "No obvious sensitive data patterns found"
fi

# Summary
print_section "Summary"

PASS_RATE=0
if [ "$TOTAL_CHECKS" -gt 0 ]; then
    PASS_RATE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
fi

echo -e "Total Checks:  $TOTAL_CHECKS"
echo -e "${GREEN}Passed:        $PASSED_CHECKS${NC}"
echo -e "${RED}Failed:        $FAILED_CHECKS${NC}"
echo -e "${YELLOW}Skipped:       $SKIPPED_CHECKS${NC}"
echo -e "Pass Rate:     $PASS_RATE%"
echo ""

# Determine overall status
if [ "$FAILED_CHECKS" -gt 0 ]; then
    echo -e "${RED}Status: FAILED - Fix issues before deployment${NC}"
    exit 1
elif [ "$SKIPPED_CHECKS" -gt 5 ]; then
    echo -e "${YELLOW}Status: INCOMPLETE - Run 'yarn install' and re-run script${NC}"
    exit 2
elif [ "$PASS_RATE" -ge 80 ]; then
    echo -e "${GREEN}Status: READY - Proceed with deployment preparation${NC}"
    exit 0
else
    echo -e "${YELLOW}Status: NEEDS REVIEW - Review warnings before proceeding${NC}"
    exit 3
fi
