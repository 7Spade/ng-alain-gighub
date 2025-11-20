Component 不得直接呼叫 repository（僅透過 facade 或 service）。

Template 禁止使用任何商業邏輯。

使用 OnPush-like 策略（signals 自帶）。

禁止在 template 使用複雜運算（用 pipe 或 computed()）。

使用 trackBy 於 ngFor（強制）。

禁止使用 any[] 做資料列表。

樣式使用 Tailwind 或 BEM（需有 team 章程）。

禁止 inline style。

禁止複製貼上 UI pattern（要抽 shared component）。

表單使用 Reactive Form，不可用 Template-driven。

form control name 必須一致命名（kebab-case）。

所有表單需加 validation rule。

UI event 嚴禁塞業務邏輯（轉交 facade）。

所有 reusable component 需有 storybook（企業級強制）。