使用 HttpInterceptor 管理 token。

API error 必須 model 化（HttpErrorModel）。

統一 API 呼叫格式（企業格式：Result<T>）。

禁止在任何地方捕捉 error 不處理。

Repository 負責串 API、error handling、轉換 model。

禁止直接在 UI 展示 API DTO。

禁止非必要的 retry / throttle（由 backend 決定）。