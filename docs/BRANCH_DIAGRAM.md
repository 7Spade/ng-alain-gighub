# 分支與檔案關係圖 (Branch and File Relationship Diagram)

```mermaid
graph TB
    subgraph "Main Branch (d90fbba)"
        M1[".github/instructions/<br/>6 files"]
        M2[".github/copilot-instructions.md<br/>(5818 bytes, with auth docs)"]
        M3[".cursor/rules/<br/>28 files"]
        M4[".github/role-config.md"]
        M5[".github/agents/ng-alain-project-agent.md"]
        M6[".cursor/rules/development-principles.mdc"]
    end

    subgraph "G1 Branch (a054d54)"
        G1[".github/copilot-instructions.md<br/>(12275 bytes, older version)"]
        G2[".cursor/rules/<br/>27 files (older)"]
        G3[".cursor/mcp.json<br/>(Context7 API config)"]
    end

    subgraph "Current Branch<br/>(copilot/sync-with-main-analyze-conflicts)"
        C1["✅ Already synced with Main<br/>(commit: 2dcdf94)"]
        C2["📄 Analysis docs created"]
    end

    subgraph "Recommended Actions for G1"
        A1["✅ Add: 9 files from Main"]
        A2["🔄 Update: 34+ config files"]
        A3["⚠️ Preserve: .cursor/mcp.json"]
        A4["📋 Follow: MERGE_STRATEGY.md"]
    end

    M1 -->|New in Main| A1
    M2 -->|Replace| G1
    M3 -->|Update| G2
    M4 -->|Add| A1
    M5 -->|Add| A1
    M6 -->|Add| A1
    G3 -->|Keep| A3

    A1 --> A4
    A2 --> A4
    A3 --> A4

    C1 -.->|Reference| A4
    C2 -.->|Guide| A4

    style M1 fill:#90EE90
    style M2 fill:#90EE90
    style M3 fill:#87CEEB
    style M4 fill:#90EE90
    style M5 fill:#90EE90
    style M6 fill:#90EE90
    style G1 fill:#FFB6C1
    style G2 fill:#FFB6C1
    style G3 fill:#FFD700
    style C1 fill:#98FB98
    style C2 fill:#98FB98
    style A1 fill:#F0E68C
    style A2 fill:#F0E68C
    style A3 fill:#F0E68C
    style A4 fill:#DDA0DD

    classDef newFile fill:#90EE90,stroke:#333,stroke-width:2px
    classDef oldFile fill:#FFB6C1,stroke:#333,stroke-width:2px
    classDef preserveFile fill:#FFD700,stroke:#333,stroke-width:2px
    classDef currentFile fill:#98FB98,stroke:#333,stroke-width:2px
    classDef actionFile fill:#F0E68C,stroke:#333,stroke-width:2px
```

## 圖例說明 (Legend)

| 顏色 | 意義 |
|------|------|
| 🟢 綠色 | Main 分支新增或更新的檔案 |
| 🔵 藍色 | Main 分支更新的規則檔案 |
| 🔴 粉紅 | G1 分支的舊版本檔案 |
| 🟡 金色 | G1 獨有需要保留的檔案 |
| 🟣 紫色 | 建議執行的動作 |

## 檔案流向圖 (File Flow Diagram)

```mermaid
flowchart LR
    subgraph "檔案類型分類"
        T1["Type 1: Main 新增<br/>(9 files)"]
        T2["Type 2: G1 獨有<br/>(1 file)"]
        T3["Type 3: 共有需更新<br/>(34+ files)"]
    end

    subgraph "處理決策"
        D1["✅ 直接新增"]
        D2["⚠️ 保留原檔"]
        D3["🔄 更新為 Main 版本"]
    end

    subgraph "執行結果"
        R1["G1 Synchronized"]
        R2["All configs aligned"]
        R3["Development tools preserved"]
    end

    T1 --> D1
    T2 --> D2
    T3 --> D3

    D1 --> R1
    D2 --> R3
    D3 --> R2

    R1 --> F["✅ G1 分支完全同步"]
    R2 --> F
    R3 --> F

    style T1 fill:#90EE90
    style T2 fill:#FFD700
    style T3 fill:#87CEEB
    style D1 fill:#98FB98
    style D2 fill:#FFB6C1
    style D3 fill:#87CEEB
    style F fill:#98FB98,stroke:#333,stroke-width:4px
```

## 34+ 檔案分類統計 (File Classification Statistics)

```mermaid
pie title 檔案處理決策分布
    "Main 新增 (Add)" : 9
    "G1 保留 (Keep)" : 1
    "更新為 Main (Update)" : 34
```

## 優先級矩陣 (Priority Matrix)

```mermaid
quadrantChart
    title 檔案處理優先級矩陣
    x-axis 低影響 --> 高影響
    y-axis 低緊急 --> 高緊急
    quadrant-1 "立即處理"
    quadrant-2 "計畫處理"
    quadrant-3 "監控"
    quadrant-4 "快速執行"
    
    "認證文件": [0.85, 0.90]
    "指令系統": [0.75, 0.85]
    "MCP 配置": [0.80, 0.70]
    "Cursor 規則": [0.60, 0.65]
    "代理檔案": [0.50, 0.55]
    "範本檔案": [0.40, 0.45]
```

## 時間線圖 (Timeline)

```mermaid
gantt
    title G1 分支同步時間規劃
    dateFormat YYYY-MM-DD
    section 分析階段
    檔案清單分析      :done, a1, 2025-11-17, 1h
    衝突分析         :done, a2, after a1, 1h
    策略制定         :done, a3, after a2, 1h
    section 執行階段
    備份 G1 分支      :active, e1, 2025-11-18, 30m
    新增 Main 檔案    :e2, after e1, 30m
    更新配置檔案      :e3, after e2, 1h
    驗證測試         :e4, after e3, 30m
    section 完成階段
    提交變更         :e5, after e4, 15m
    文件更新         :e6, after e5, 30m
```

## 決策樹 (Decision Tree)

```mermaid
graph TD
    Start[檔案處理決策] --> Q1{檔案在哪個分支?}
    
    Q1 -->|僅 Main| A1[✅ 直接新增到 G1]
    Q1 -->|僅 G1| Q2{是否為工具配置?}
    Q1 -->|兩者都有| Q3{Main 版本更新?}
    
    Q2 -->|是 mcp.json| A2[⚠️ 保留 G1 版本]
    Q2 -->|其他| A3[❓ 評估必要性]
    
    Q3 -->|是| A4[🔄 更新為 Main]
    Q3 -->|否| A5[📊 逐一比較]
    
    A1 --> End[執行合併]
    A2 --> End
    A3 --> End
    A4 --> End
    A5 --> End
    
    style Start fill:#87CEEB
    style Q1 fill:#FFD700
    style Q2 fill:#FFD700
    style Q3 fill:#FFD700
    style A1 fill:#90EE90
    style A2 fill:#FFB6C1
    style A3 fill:#F0E68C
    style A4 fill:#87CEEB
    style A5 fill:#DDA0DD
    style End fill:#98FB98,stroke:#333,stroke-width:4px
```

---

**說明**:
- 此圖表檔案提供視覺化的分支關係和檔案處理決策
- 配合 `CONFLICT_ANALYSIS.md` 和 `MERGE_STRATEGY.md` 使用
- 適合用於團隊溝通和執行參考

**最後更新**: 2025-11-17
