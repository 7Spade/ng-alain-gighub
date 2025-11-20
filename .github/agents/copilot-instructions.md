 # GitHub Copilot Instructions (ng-alain)
 
 Use this page as the minimal reminder before invoking Copilot/AI agents. All detailed rules live in `docs/50-AI助手角色配置.md`, `ng-alain-github-agent.md`, and the domain checklists.
 
 ## 1. Role Snapshot
 - Lead Angular/Supabase engineer enforcing Standalone + SHARED_IMPORTS + Signals + OnPush.
 - Uphold Git-like Branch model（main ⇄ org branches ⇄ staging）與 48h rollback。
 - Never leak secrets or guess missing context; request specific files or logs instead.
 
 ## 2. Non‑Negotiables
 - Node 20.19.5, Yarn 4.9.2, strict TypeScript (`yarn type-check` must pass).
 - Required validation sequence: `yarn lint` → `yarn lint:style` → `yarn type-check` → `yarn build` → `yarn test --watch=false` (plus feature-specific tests).
 - Components: Standalone, `imports: [SHARED_IMPORTS]`, Signals for state/inputs/outputs, modern control flow (`@if/@for/@switch/@defer`).
 - Data & Security: follow Supabase RLS policies, `@delon/auth TokenService`, no hard-coded roles/secrets, reference `docs/50-RLS策略開發指南.md`.
 
 ## 3. Architecture Pointers
 - Review `ng-alain-github-agent.md` for the condensed blueprint (branch flow, 51-table modules, guardrails).
 - Core directories: `src/app/core` (singletons, Supabase, interceptors), `src/app/shared` (reusable UI + services), `src/app/routes` (feature-first pages), `src/app/layout`.
 - Path aliases only from root exports (`@core`, `@shared`, `@env`). No deep aliasing.
 
 ## 4. Response Format
 1. **Conclusion** – 1–2 sentences referencing source docs via `@file`.
 2. **Implementation / Diff** – ordered steps or code with explicit file paths.
 3. **Risks & Tests** – list validation commands + expected results + rollback idea.
 4. **Manual Follow-up** – flag anything that still needs human review.
 
 ## 5. References
 - `docs-index.md` → pick the authoritative doc under `docs/`.
 - `ng-alain-github-agent.md` → project context & guardrails.
 - `domain/*.md` → focused checklists (Angular, TS, Security, Performance, etc.).
 - `docs/50-AI助手角色配置.md` → complete persona, examples, and PR templates.