# 工作區上下文切換流程圖

## 📑 目錄

- [1. 上下文層級關係圖](#1-上下文層級關係圖)
- [2. 上下文切換完整流程](#2-上下文切換完整流程)
- [3. 數據加載流程](#3-數據加載流程)
- [4. 菜單更新流程](#4-菜單更新流程)
- [5. 上下文與數據關係圖](#5-上下文與數據關係圖)
- [6. 狀態持久化流程](#6-狀態持久化流程)
- [7. 錯誤處理流程](#7-錯誤處理流程)
- [8. 功能可用性對照](#8-功能可用性對照)
- [9. 上下文切換性能優化](#9-上下文切換性能優化)
- [10. 用戶旅程圖](#10-用戶旅程圖)
- [說明](#說明)
  - [圖表索引](#圖表索引)
  - [使用建議](#使用建議)
  - [相關資源](#相關資源)

---


> 📊 **目的**：視覺化展示工作區上下文切換的完整流程，包含數據加載、菜單更新和狀態管理

**最後更新**：2025-11-20
**相關文檔**：
- [工作區上下文使用與規劃指南](./工作區上下文使用與規劃指南.md) - 完整使用指南
- [工作區上下文系統架構審查](./工作區上下文系統架構審查.md) - 技術架構審查
- [工作區系統快速參考指南](./工作區系統-快速參考指南.md) - 開發者快速參考

- --

## 1. 上下文層級關係圖

```mermaid
graph TB
    subgraph "上下文層級"
        APP[應用上下文<br/>App Context]
        USER[個人上下文<br/>User Context]
        ORG[組織上下文<br/>Organization Context]
        TEAM[團隊上下文<br/>Team Context]
    end

    subgraph "數據文件"
        APPJSON[app-data.json<br/>默認菜單]
        USERJSON[user-data.json<br/>個人菜單]
        ORGJSON[organization-data.json<br/>組織菜單]
        TEAMJSON[team-data.json<br/>團隊菜單]
    end

    APP --> APPJSON
    USER --> USERJSON
    ORG --> ORGJSON
    TEAM --> TEAMJSON

    APP -.-> USER
    USER -.-> ORG
    ORG -.-> TEAM

    style APP fill:#e1f5ff
    style USER fill:#fff4e1
    style ORG fill:#e8f5e9
    style TEAM fill:#f3e5f5
```

## 2. 上下文切換完整流程

```mermaid
sequenceDiagram
    participant U as 用戶
    participant UI as UI Layer
    participant F as WorkspaceContextFacade
    participant S as WorkspaceContextService
    participant D as WorkspaceDataService
    participant M as WorkspaceMenuService
    participant P as WorkspacePersistenceService
    participant API as Backend API

    Note over U,API: 用戶點擊切換上下文

    U->>UI: 選擇組織上下文
    UI->>F: switchToOrganization(orgId)
    F->>S: switchToOrganization(orgId)

    Note over S: 檢查是否正在切換
    alt 正在切換中
        S-->>F: 返回（防止重複切換）
        F-->>UI: 無操作
    else 未在切換中
        S->>S: 設置 switching = true

        Note over S: 驗證組織是否存在
        S->>D: 檢查 allOrganizations()
        D-->>S: 返回組織列表

        alt 組織不存在
            S->>S: console.warn
            S->>S: 設置 switching = false
            S-->>F: 切換失敗
            F-->>UI: 顯示錯誤提示
        else 組織存在
            Note over S: 更新上下文狀態
            S->>S: contextType = 'organization'
            S->>S: contextId = orgId

            Note over S: 更新帳戶服務
            S->>AccountService: selectAccount(organization)

            Note over S: 持久化上下文
            S->>P: saveContext('organization', orgId)
            P->>LocalStorage: 保存上下文資訊

            Note over S: 加載菜單數據
            S->>M: loadMenuData('organization')
            M->>MenuService: setMenu(organization-data.json)

            Note over S: 加載藍圖列表
            S->>D: loadBlueprintsByContext('organization', orgId)
            D->>API: GET /blueprints?owner_id=orgId
            API-->>D: 返回藍圖列表
            D->>D: 更新 contextBlueprints

            D-->>S: 加載完成
            S->>S: 設置 switching = false
            S-->>F: 切換成功
            F-->>UI: 更新 UI

            Note over UI: 顯示組織菜單和數據
        end
    end
```

## 3. 數據加載流程

```mermaid
flowchart TD
    Start([用戶登入]) --> LoadAuth[加載認證資訊]
    LoadAuth --> LoadUserAccount[加載用戶帳戶]

    LoadUserAccount --> ParallelLoad{並行加載}

    ParallelLoad -->|線程1| LoadCreatedOrgs[加載我創建的組織]
    ParallelLoad -->|線程2| LoadJoinedOrgs[加載我加入的組織]
    ParallelLoad -->|線程3| LoadTeams[加載我的團隊]

    LoadCreatedOrgs --> MergeData[合併數據]
    LoadJoinedOrgs --> MergeData
    LoadTeams --> MergeData

    MergeData --> DeduplicateOrgs[組織去重]
    DeduplicateOrgs --> GroupTeamsByOrg[團隊按組織分組]

    GroupTeamsByOrg --> RestoreContext{恢復保存的上下文？}

    RestoreContext -->|有保存的上下文| LoadSavedContext[加載保存的上下文]
    RestoreContext -->|無保存的上下文| DefaultToUser[默認切換到用戶上下文]

    LoadSavedContext --> LoadContextBlueprints[加載上下文藍圖]
    DefaultToUser --> LoadContextBlueprints

    LoadContextBlueprints --> LoadContextMenu[加載上下文菜單]
    LoadContextMenu --> Complete([數據加載完成])

    style Start fill:#e1f5ff
    style Complete fill:#c8e6c9
    style ParallelLoad fill:#fff9c4
```

## 4. 菜單更新流程

```mermaid
stateDiagram-v2
    [*] --> App: 初始化

    App --> User: 切換到個人
    App --> Organization: 切換到組織
    App --> Team: 切換到團隊

    User --> Organization: 切換到組織
    User --> Team: 切換到團隊
    User --> App: 登出

    Organization --> User: 切換到個人
    Organization --> Team: 切換到團隊
    Organization --> App: 登出

    Team --> User: 切換到個人
    Team --> Organization: 切換到組織
    Team --> App: 登出

    state User {
        [*] --> LoadUserMenu
        LoadUserMenu --> ShowPersonalFeatures
        ShowPersonalFeatures --> [*]
    }

    state Organization {
        [*] --> LoadOrgMenu
        LoadOrgMenu --> ShowAllFeatures
        ShowAllFeatures --> [*]
    }

    state Team {
        [*] --> LoadTeamMenu
        LoadTeamMenu --> ShowTeamFeatures
        ShowTeamFeatures --> [*]
    }

    note right of User
        加載 user-data.json
        顯示個人功能
    end note

    note right of Organization
        加載 organization-data.json
        顯示完整功能
    end note

    note right of Team
        加載 team-data.json
        顯示團隊功能
    end note
```

## 5. 上下文與數據關係圖

```mermaid
graph LR
    subgraph "用戶層"
        U1[用戶 A]
        U2[用戶 B]
    end

    subgraph "組織層"
        O1[組織 1]
        O2[組織 2]
    end

    subgraph "團隊層"
        T1[團隊 1-1]
        T2[團隊 1-2]
        T3[團隊 2-1]
    end

    subgraph "藍圖層"
        B1[藍圖 A]
        B2[藍圖 B]
        B3[藍圖 C]
    end

    U1 -->|創建| O1
    U1 -->|加入| O2
    U2 -->|創建| O2

    O1 -->|包含| T1
    O1 -->|包含| T2
    O2 -->|包含| T3

    U1 -->|加入| T1
    U2 -->|加入| T1
    U2 -->|加入| T3

    U1 -->|創建| B1
    O1 -->|創建| B2
    O2 -->|創建| B3

    T1 -.->|使用| B2
    T2 -.->|使用| B2
    T3 -.->|使用| B3

    style U1 fill:#fff4e1
    style U2 fill:#fff4e1
    style O1 fill:#e8f5e9
    style O2 fill:#e8f5e9
    style T1 fill:#f3e5f5
    style T2 fill:#f3e5f5
    style T3 fill:#f3e5f5
    style B1 fill:#e1f5ff
    style B2 fill:#e1f5ff
    style B3 fill:#e1f5ff
```

## 6. 狀態持久化流程

```mermaid
flowchart LR
    subgraph "狀態管理"
        S1[WorkspaceContextService]
        S2[WorkspacePersistenceService]
    end

    subgraph "存儲層"
        LS[LocalStorage]
    end

    subgraph "恢復流程"
        R1[應用啟動]
        R2[讀取 LocalStorage]
        R3[驗證上下文]
        R4[恢復上下文]
    end

    S1 -->|切換上下文| S2
    S2 -->|保存| LS

    R1 --> R2
    R2 --> R3
    R3 -->|有效| R4
    R3 -->|無效| DefaultContext[使用默認上下文]
    R4 --> S1
    DefaultContext --> S1

    LS -.->|讀取| R2

    style S1 fill:#e1f5ff
    style LS fill:#fff9c4
    style R4 fill:#c8e6c9
```

## 7. 錯誤處理流程

```mermaid
flowchart TD
    SwitchContext[切換上下文] --> CheckSwitching{正在切換中？}

    CheckSwitching -->|是| ReturnEarly[提前返回<br/>防止重複切換]
    CheckSwitching -->|否| ValidateContext{驗證上下文}

    ValidateContext -->|用戶上下文| CheckUser{用戶帳戶存在？}
    ValidateContext -->|組織上下文| CheckOrg{組織存在？}
    ValidateContext -->|團隊上下文| CheckTeam{團隊存在？}

    CheckUser -->|否| WarnUser[console.warn<br/>顯示錯誤提示]
    CheckUser -->|是| DoSwitch[執行切換]

    CheckOrg -->|否| WarnOrg[console.warn<br/>顯示錯誤提示]
    CheckOrg -->|是| DoSwitch

    CheckTeam -->|否| WarnTeam[console.warn<br/>顯示錯誤提示]
    CheckTeam -->|是| DoSwitch

    DoSwitch --> LoadData{數據加載}

    LoadData -->|成功| UpdateUI[更新 UI<br/>switching = false]
    LoadData -->|失敗| HandleError[錯誤處理<br/>顯示錯誤訊息<br/>switching = false]

    WarnUser --> End([結束])
    WarnOrg --> End
    WarnTeam --> End
    ReturnEarly --> End
    UpdateUI --> End
    HandleError --> End

    style DoSwitch fill:#c8e6c9
    style HandleError fill:#ffcdd2
    style WarnUser fill:#ffecb3
    style WarnOrg fill:#ffecb3
    style WarnTeam fill:#ffecb3
```

## 8. 功能可用性對照

```mermaid
graph TB
    subgraph "功能分類"
        M[管理功能]
        E[執行功能]
        P[個人功能]
        A[分析功能]
    end

    subgraph "個人上下文"
        U1[帳戶系統]
        U2[我的任務]
        U3[我的藍圖]
        U4[我的文檔]
        U5[個人設置]
    end

    subgraph "組織上下文"
        O1[組織管理]
        O2[組織藍圖]
        O3[組織任務]
        O4[品質管理]
        O5[問題追蹤]
        O6[數據分析]
    end

    subgraph "團隊上下文"
        T1[團隊成員]
        T2[團隊任務]
        T3[團隊問題]
        T4[團隊溝通]
    end

    M --> O1
    M --> O2
    M --> O4
    M --> O5

    E --> O3
    E --> T2
    E --> T3

    P --> U1
    P --> U2
    P --> U3
    P --> U4
    P --> U5

    A --> O6

    style M fill:#ffcdd2
    style E fill:#c8e6c9
    style P fill:#fff9c4
    style A fill:#e1bee7
```

## 9. 上下文切換性能優化

```mermaid
flowchart TD
    Start([開始切換]) --> Cache{檢查緩存}

    Cache -->|有緩存| UseCache[使用緩存數據]
    Cache -->|無緩存| LoadFresh[載入新數據]

    UseCache --> UpdateUI1[立即更新 UI]
    LoadFresh --> ShowLoading[顯示 Loading]

    ShowLoading --> ParallelLoad{並行載入}

    ParallelLoad -->|線程1| LoadMenu[載入菜單]
    ParallelLoad -->|線程2| LoadData[載入數據]
    ParallelLoad -->|線程3| LoadBlueprints[載入藍圖]

    LoadMenu --> Merge[合併結果]
    LoadData --> Merge
    LoadBlueprints --> Merge

    Merge --> UpdateCache[更新緩存]
    UpdateCache --> UpdateUI2[更新 UI]

    UpdateUI1 --> CheckRefresh{需要刷新？}
    UpdateUI2 --> CheckRefresh

    CheckRefresh -->|是| RefreshInBackground[後台刷新]
    CheckRefresh -->|否| Complete([完成])

    RefreshInBackground --> Complete

    style UseCache fill:#c8e6c9
    style ParallelLoad fill:#fff9c4
    style Complete fill:#e1f5ff
```

## 10. 用戶旅程圖

```mermaid
journey
    title 用戶一天的上下文切換旅程
    section 早晨
      登入系統: 5: 用戶
      查看個人通知: 4: 用戶
      檢視今日任務: 5: 用戶
    section 上午
      切換到組織: 5: 用戶
      檢查組織進度: 4: 用戶
      審查PR: 3: 用戶
      創建新任務: 4: 用戶
    section 中午
      切換到團隊: 5: 用戶
      查看團隊任務: 5: 用戶
      更新任務進度: 4: 用戶
      上傳施工照片: 4: 用戶
    section 下午
      切換回組織: 5: 用戶
      處理問題: 3: 用戶
      查看數據分析: 4: 用戶
      匯出報表: 4: 用戶
    section 傍晚
      切換到個人: 5: 用戶
      查看所有通知: 5: 用戶
      整理待辦事項: 4: 用戶
      設定明日計劃: 5: 用戶
```

- --

## 說明

### 圖表索引

1. **上下文層級關係圖**：展示四種上下文類型及其對應的數據文件
2. **上下文切換完整流程**：詳細的時序圖，展示切換過程中各組件的交互
3. **數據加載流程**：展示用戶登入後的數據加載步驟
4. **菜單更新流程**：狀態圖展示不同上下文間的切換關係
5. **上下文與數據關係圖**：展示用戶、組織、團隊、藍圖的關係
6. **狀態持久化流程**：展示上下文狀態如何保存和恢復
7. **錯誤處理流程**：展示切換過程中的錯誤處理機制
8. **功能可用性對照**：展示不同功能在各上下文的分佈
9. **上下文切換性能優化**：展示緩存和並行載入的優化策略
10. **用戶旅程圖**：展示用戶一天內的上下文使用場景

### 使用建議

- 開發者應參考**上下文切換完整流程**理解實現細節
- 產品經理應參考**功能可用性對照**規劃功能放置
- UI/UX 設計師應參考**用戶旅程圖**優化用戶體驗
- 架構師應參考**性能優化流程**進行系統優化

### 相關資源

- [工作區上下文使用與規劃指南](./工作區上下文使用與規劃指南.md) - 完整的功能說明和最佳實踐
- [工作區上下文系統架構審查](./工作區上下文系統架構審查.md) - 技術架構詳細審查
- [工作區系統快速參考指南](./工作區系統-快速參考指南.md) - 開發者快速參考手冊

- --

**文檔維護者**：開發團隊
**最後更新**：2025-11-20
