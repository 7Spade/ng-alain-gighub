#!/bin/bash
# 開發環境快速檢查腳本
# Quick Check Script for Development Environment

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 圖標
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   ng-alain-gighub 開發環境快速檢查${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# 計數器
PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

# 檢查函數
check_command() {
    local command=$1
    local name=$2
    local required=$3

    echo -ne "${INFO} 檢查 ${name}..."

    if command -v $command &> /dev/null; then
        local version=$($command --version 2>&1 | head -1)
        echo -e " ${GREEN}${CHECK}${NC} ${version}"
        ((PASS_COUNT++))
        return 0
    else
        if [ "$required" = "true" ]; then
            echo -e " ${RED}${CROSS} 未安裝${NC}"
            ((FAIL_COUNT++))
            return 1
        else
            echo -e " ${YELLOW}${WARNING} 未安裝（可選）${NC}"
            ((WARN_COUNT++))
            return 0
        fi
    fi
}

# 1. 檢查必備工具
echo -e "${YELLOW}1️⃣ 檢查必備工具${NC}"
echo "─────────────────────────────────────────────────────────"

check_command "node" "Node.js" "true"
check_command "yarn" "Yarn" "true"
check_command "git" "Git" "true"

# 檢查 Node.js 版本
NODE_VERSION=$(node --version | sed 's/v//g' | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 20 ]; then
    echo -e "   ${GREEN}${CHECK} Node.js 版本符合要求 (>= 20)${NC}"
    ((PASS_COUNT++))
else
    echo -e "   ${RED}${CROSS} Node.js 版本過低 (需要 >= 20)${NC}"
    ((FAIL_COUNT++))
fi

echo ""

# 2. 檢查專案依賴
echo -e "${YELLOW}2️⃣ 檢查專案依賴${NC}"
echo "─────────────────────────────────────────────────────────"

if [ -d "node_modules" ]; then
    echo -e "${GREEN}${CHECK} node_modules 存在${NC}"
    ((PASS_COUNT++))
else
    echo -e "${RED}${CROSS} node_modules 不存在${NC}"
    echo -e "   ${INFO} 請執行: ${BLUE}yarn install${NC}"
    ((FAIL_COUNT++))
fi

if [ -f "yarn.lock" ]; then
    echo -e "${GREEN}${CHECK} yarn.lock 存在${NC}"
    ((PASS_COUNT++))
else
    echo -e "${YELLOW}${WARNING} yarn.lock 不存在${NC}"
    ((WARN_COUNT++))
fi

echo ""

# 3. 檢查環境設定
echo -e "${YELLOW}3️⃣ 檢查環境設定${NC}"
echo "─────────────────────────────────────────────────────────"

if [ -f "src/environments/environment.ts" ]; then
    echo -e "${GREEN}${CHECK} environment.ts 存在${NC}"
    ((PASS_COUNT++))

    # 檢查是否包含 Supabase 設定
    if grep -q "supabase" "src/environments/environment.ts"; then
        echo -e "${GREEN}${CHECK} Supabase 設定存在${NC}"
        ((PASS_COUNT++))
    else
        echo -e "${YELLOW}${WARNING} Supabase 設定可能未配置${NC}"
        ((WARN_COUNT++))
    fi
else
    echo -e "${RED}${CROSS} environment.ts 不存在${NC}"
    ((FAIL_COUNT++))
fi

if [ -f "angular.json" ]; then
    echo -e "${GREEN}${CHECK} angular.json 存在${NC}"
    ((PASS_COUNT++))
else
    echo -e "${RED}${CROSS} angular.json 不存在${NC}"
    ((FAIL_COUNT++))
fi

if [ -f "package.json" ]; then
    echo -e "${GREEN}${CHECK} package.json 存在${NC}"
    ((PASS_COUNT++))
else
    echo -e "${RED}${CROSS} package.json 不存在${NC}"
    ((FAIL_COUNT++))
fi

echo ""

# 4. 檢查 Git 狀態
echo -e "${YELLOW}4️⃣ 檢查 Git 狀態${NC}"
echo "─────────────────────────────────────────────────────────"

if [ -d ".git" ]; then
    echo -e "${GREEN}${CHECK} Git 倉庫已初始化${NC}"
    ((PASS_COUNT++))

    # 檢查當前分支
    CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
    echo -e "${INFO} 當前分支: ${BLUE}$CURRENT_BRANCH${NC}"

    # 檢查是否有未提交的變更
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}${WARNING} 有未提交的變更${NC}"
        ((WARN_COUNT++))
    else
        echo -e "${GREEN}${CHECK} 工作區乾淨${NC}"
        ((PASS_COUNT++))
    fi
else
    echo -e "${RED}${CROSS} 不是 Git 倉庫${NC}"
    ((FAIL_COUNT++))
fi

echo ""

# 5. 檢查開發工具
echo -e "${YELLOW}5️⃣ 檢查開發工具${NC}"
echo "─────────────────────────────────────────────────────────"

if [ -d ".husky" ]; then
    echo -e "${GREEN}${CHECK} Husky (Git hooks) 已安裝${NC}"
    ((PASS_COUNT++))
else
    echo -e "${YELLOW}${WARNING} Husky 未安裝${NC}"
    echo -e "   ${INFO} 請執行: ${BLUE}yarn prepare${NC}"
    ((WARN_COUNT++))
fi

if [ -d ".vscode" ]; then
    echo -e "${GREEN}${CHECK} VSCode 設定存在${NC}"
    ((PASS_COUNT++))
else
    echo -e "${YELLOW}${WARNING} VSCode 設定不存在${NC}"
    ((WARN_COUNT++))
fi

echo ""

# 6. 執行快速 Lint 檢查（可選）
echo -e "${YELLOW}6️⃣ 程式碼品質檢查（跳過以節省時間）${NC}"
echo "─────────────────────────────────────────────────────────"
echo -e "${INFO} 如需完整檢查，請執行: ${BLUE}yarn lint${NC}"
echo ""

# 總結
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   檢查結果總結${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}✅ 通過: $PASS_COUNT${NC}"
echo -e "${YELLOW}⚠️  警告: $WARN_COUNT${NC}"
echo -e "${RED}❌ 失敗: $FAIL_COUNT${NC}"
echo ""

# 建議
if [ $FAIL_COUNT -gt 0 ]; then
    echo -e "${RED}${CROSS} 發現 $FAIL_COUNT 個問題需要修復${NC}"
    echo ""
    echo -e "${BLUE}建議執行：${NC}"
    echo -e "  1. ${BLUE}yarn install${NC} - 安裝依賴"
    echo -e "  2. ${BLUE}yarn lint${NC} - 修復程式碼問題"
    echo -e "  3. 檢查環境設定檔案"
    echo ""
    exit 1
elif [ $WARN_COUNT -gt 0 ]; then
    echo -e "${YELLOW}${WARNING} 有 $WARN_COUNT 個警告，但不影響開發${NC}"
    echo ""
    exit 0
else
    echo -e "${GREEN}${CHECK} 所有檢查通過！環境準備就緒 🎉${NC}"
    echo ""
    echo -e "${BLUE}可以開始開發了：${NC}"
    echo -e "  • ${BLUE}yarn start${NC} - 啟動開發伺服器"
    echo -e "  • ${BLUE}yarn hmr${NC} - 啟動 HMR 模式"
    echo -e "  • ${BLUE}yarn test${NC} - 執行測試"
    echo ""
    exit 0
fi
