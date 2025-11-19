Signals 為預設 state solution。

RxJS 僅用於 multi-stream event、websocket、long polling。

每個 feature 必須有自己的 facade。

禁止使用 BehaviorSubject 當全域狀態。

全域設定使用 AppState（signal 模式）。

禁止在 component 使用 shareReplay 或 publishReplay。

禁止在 component map/switchMap → 直接在 service。

API response → repository → model → service → facade → UI。