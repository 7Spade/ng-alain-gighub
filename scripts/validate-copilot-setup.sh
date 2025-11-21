#!/bin/bash

# GitHub Copilot Instructions Setup Validation Script
# 用途：驗證 Copilot 指引配置是否完整且符合最佳實踐

# Note: Don't use set -e as we want to collect all validation results

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   GitHub Copilot Instructions Setup Validation              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

# Function to check file exists
check_file() {
    local file=$1
    local description=$2
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $description"
        echo "         File: $file ($(wc -l < "$file" 2>/dev/null || echo "0") lines)"
        ((PASS_COUNT++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}: $description"
        echo "         Missing: $file"
        ((FAIL_COUNT++))
        return 1
    fi
}

# Function to check directory exists
check_dir() {
    local dir=$1
    local description=$2
    if [ -d "$dir" ]; then
        local count=$(find "$dir" -name "*.md" 2>/dev/null | wc -l)
        echo -e "${GREEN}✅ PASS${NC}: $description"
        echo "         Directory: $dir ($count markdown files)"
        ((PASS_COUNT++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}: $description"
        echo "         Missing: $dir"
        ((FAIL_COUNT++))
        return 1
    fi
}

# Function to check content
check_content() {
    local file=$1
    local pattern=$2
    local description=$3
    if [ -f "$file" ] && grep -qE "$pattern" "$file" 2>/dev/null; then
        echo -e "${GREEN}✅ PASS${NC}: $description"
        ((PASS_COUNT++))
        return 0
    else
        echo -e "${YELLOW}⚠️  WARN${NC}: $description"
        echo "         File: $file"
        ((WARN_COUNT++))
        return 1
    fi
}

echo "1️⃣  Checking GitHub Standard Location"
echo "────────────────────────────────────────────────────────────"
check_file ".github/copilot-instructions.md" "GitHub Copilot 主要指引檔案"
echo ""

echo "2️⃣  Checking VSCode Integration Files"
echo "────────────────────────────────────────────────────────────"
check_file ".copilot-instructions.md" "VSCode 主要指引檔案"
check_file ".copilot-commit-message-instructions.md" "Commit 訊息指引"
check_file ".copilot-pull-request-description-instructions.md" "PR 描述指引"
check_file ".copilot-review-instructions.md" "程式碼審查指引"
check_file ".copilot-test-instructions.md" "測試產生指引"
echo ""

echo "3️⃣  Checking VSCode Settings"
echo "────────────────────────────────────────────────────────────"
check_file ".vscode/settings.json" "VSCode 設定檔案"
if [ -f ".vscode/settings.json" ]; then
    check_content ".vscode/settings.json" "github.copilot" "包含 Copilot 設定"
    check_content ".vscode/settings.json" "copilot-instructions.md" "引用指引檔案"
fi
echo ""

echo "4️⃣  Checking Agent Mode Support"
echo "────────────────────────────────────────────────────────────"
check_dir ".github/agents" "Agent 模式目錄"
if [ -d ".github/agents" ]; then
    check_file ".github/agents/README.md" "Agent 模式說明文件"
    check_dir ".github/agents/domain" "領域專家 Agent 目錄"
fi
echo ""

echo "5️⃣  Checking Content Quality"
echo "────────────────────────────────────────────────────────────"
if [ -f ".github/copilot-instructions.md" ]; then
    check_content ".github/copilot-instructions.md" "專案願景|願景" "包含專案願景"
    check_content ".github/copilot-instructions.md" "技術棧" "包含技術棧"
    check_content ".github/copilot-instructions.md" "開發規範" "包含開發規範"
    check_content ".github/copilot-instructions.md" "測試" "包含測試要求"
    check_content ".github/copilot-instructions.md" "安全" "包含安全指引"
    check_content ".github/copilot-instructions.md" "認證|Auth" "包含認證說明"
    check_content ".github/copilot-instructions.md" "工作流程|workflow" "包含工作流程"
fi
echo ""

echo "6️⃣  Checking Documentation References"
echo "────────────────────────────────────────────────────────────"
if [ -f ".github/copilot-instructions.md" ]; then
    link_count=$(grep -o '\[.*\](' ".github/copilot-instructions.md" | wc -l)
    if [ "$link_count" -gt 10 ]; then
        echo -e "${GREEN}✅ PASS${NC}: 包含充足的文件引用連結 ($link_count 個)"
        ((PASS_COUNT++))
    else
        echo -e "${YELLOW}⚠️  WARN${NC}: 文件引用連結較少 ($link_count 個)"
        ((WARN_COUNT++))
    fi
    
    check_content ".github/copilot-instructions.md" "版本.*v[0-9]" "包含版本資訊"
    check_content ".github/copilot-instructions.md" "維護者" "包含維護者資訊"
fi
echo ""

echo "7️⃣  Checking Related Documentation"
echo "────────────────────────────────────────────────────────────"
check_file "AGENTS.md" "AI 助手檔案組織結構總覽"
check_dir "docs" "專案文檔目錄"
check_dir ".cursor/rules" "Cursor 規則目錄"
echo ""

echo "════════════════════════════════════════════════════════════"
echo "  Validation Summary"
echo "════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ Passed: $PASS_COUNT${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARN_COUNT${NC}"
echo -e "${RED}❌ Failed: $FAIL_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  🎉 所有檢查通過！Copilot 指引配置完整且符合最佳實踐。║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ 發現 $FAIL_COUNT 個問題，請修正後重新執行驗證。        ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
