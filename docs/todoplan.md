# Refactoring & Scalability Plan

> Status: Proposed
> Scope: Layered architecture, decoupling, standalone-API readiness,
>        zero-warning quality gates, Speed Code removal, MCQ variations
> Target runtime (future standalone API): **Fastify**
> Migration strategy: **Create seams first**, extract to monorepo later

## 1. Guiding Principles

1. **Incremental (Strangler Fig)** — never a big-bang rewrite. Each phase ships green.
2. **Preserve intentional decisions** — base64 admin cookie, `correctAnswer` in quiz responses, no student accounts, localStorage student state are all accepted (see `docs/DECISIONS.md`). Do not "fix" them.
3. **One source of truth per concern** — request/response contracts, content registry, constants, models.
4. **Framework-agnostic domain** — business rules must not import Next.js or Mongoose.
5. **Green gates always** — `lint`, `typecheck`, `build`, `test` must pass after every phase.

## 2. Current-State Findings

| # | Finding | Evidence |
|---|---------|----------|
| F1 | 13 lint warnings, all `no-console` | `scripts/check-docs.ts` (5), `scripts/seed-oop.ts` (8) |
| F2 | Business logic lives in route handlers | `src/app/api/quiz/start/route.ts`, `src/app/api/quiz/submit/route.ts`, `src/app/api/sessions/route.ts` |
| F3 | N+1 query loop in quiz submit | `src/app/api/quiz/submit/route.ts:17-28` |
| F4 | 31 raw `fetch()` calls bypass the typed client | `src/components/**`, `src/app/**` |
| F5 | Hardcoded `limit=500` | `src/components/admin/MCQManagement.tsx:78` |
| F6 | Admin MCQ create never sends `subject` → 400 (broken) | `src/components/admin/MCQManagement.tsx:164-183` vs `createMCQSchema` (`src/lib/validations.ts:10-19`) |
| F7 | In-memory rate-limit store never evicts expired entries (memory leak) | `src/lib/rate-limit.ts:8-30` |
| F8 | Rate limiter is not multi-instance safe | `src/lib/rate-limit.ts` |
| F9 | `withDB` / auth couple framework to domain | `src/lib/db.ts:40-56`, `src/lib/auth.ts` |
| F10 | No tests, no CI, no formatter | `package.json` |
| F11 | Speed Code duplicates the MCQ shape (`options` + `correctAnswer` + `timeLimit`) | `src/components/games/SpeedCode.tsx` |
| F12 | No MCQ variant/variation capability | `src/models/MCQ.ts` |
| F13 | Several routes bypass Zod validation | `src/app/api/sessions/route.ts`, `src/app/api/quiz/*`, `src/app/api/mcq/batch/route.ts` |

## 3. Workstreams

### WS-1 — Zero-warning quality gate (P0)

- Add `scripts/lib/logger.ts` using `process.stdout.write` / `process.stderr.write` (no `console`).
- Migrate `seed/seed.ts`, `scripts/seed-oop.ts`, `scripts/check-docs.ts` to the logger; remove the inline `/* eslint-disable no-console */` in `seed.ts`.
- `package.json` scripts:
  - `"typecheck": "tsc --noEmit"`
  - `"lint": "eslint --max-warnings 0"`
- Add `"packageManager"` and `"engines"` fields.
- **Acceptance:** `pnpm lint` → 0 problems; `pnpm typecheck` → clean.

### WS-2 — Layered server architecture & decoupling (P0/P1)

Introduce framework-neutral layers; route handlers become thin adapters.

```
src/server/
  domain/        # pure logic: grading, scoring, variations (no DB, no HTTP)
  services/      # use-cases orchestrating repositories + domain
  repositories/  # interfaces + Mongoose implementations
  auth/          # AuthProvider interface + NextCookieAuthProvider adapter
  http/          # DTOs, error mapping, handler factory
src/app/api/     # parse -> service -> serialize (thin adapters)
```

- Move `gradeAnswers` / time-bonus into `src/server/domain/grading.ts` (pure, unit-testable).
- Define repository interfaces (`MCQRepository`, `SessionRepository`, `AuditLogRepository`, …) with Mongoose implementations under `src/server/repositories/mongoose/`.
- Introduce a handler factory that maps domain errors → HTTP status, replacing ad-hoc `try/catch` + `NextResponse` inside logic.
- `src/lib/auth.ts` becomes a Next adapter over an `AuthProvider` interface.
- Fix F3 by batching MCQ lookups in the grading service.
- **Acceptance:** no `src/server/domain/**` file imports Next.js or Mongoose; no `page.tsx`/component imports Mongoose.

### WS-3 — Typed API client & shared contracts (P1)

- `src/contracts/` = shared Zod schemas + inferred request/response types (request side re-exports `src/lib/validations.ts`; response side is new).
- `src/lib/api/endpoints.ts`: typed functions (`mcqs.list()`, `sessions.create()`, `sessions.submit()`, …) built on `src/lib/api.ts`.
- Query-key factory `src/lib/query-keys.ts` to replace inline arrays.
- Replace all 31 raw `fetch()` calls; fix F5 (`limit=500` → `ADMIN_MCQ_FETCH_LIMIT`).
- **Acceptance:** zero raw `fetch` outside `src/lib/api.ts`.

### WS-4 — Standalone-API readiness (P1/P2)

- Auth: `AuthProvider` abstraction — cookie adapter now, bearer-token adapter for the future API (env `ADMIN_API_TOKEN`). Base64 cookie behavior unchanged.
- Rate limit: `RateLimitStore` interface, in-memory default with TTL eviction (fixes F7), Redis adapter later (fixes F8).
- Central base URL: `API_BASE_URL` / `NEXT_PUBLIC_API_BASE_URL`.
- Add `GET /api/health`.
- Document the extraction path: `apps/web`, `apps/api`, `packages/{core,db,contracts,content}`.
- **Acceptance:** services runnable and testable outside Next.js; the plan lists Fastify as the mount target.

### WS-5 — Remove Speed Code (P1)

Speed Code is a timed MCQ variant; remove the redundant game and fold timing into quizzes.

Remove:
- `src/components/games/SpeedCode.tsx`
- `src/content/cpp/games/speed-code.json`
- `speed-code` from `GAME_TYPES` (`src/lib/constants.ts:107-111`)
- `speed-code` from `GAME_CONTENT` (`src/content/games.ts`)
- import + render branch in `src/app/s/[code]/page.tsx`
- constants `DEFAULT_SPEED_CODE_TIME_LIMIT`, `SPEED_CODE_GREEN_THRESHOLD`, `SPEED_CODE_YELLOW_THRESHOLD`

Then:
- Handle legacy sessions that reference `speed-code` gracefully (skip / show unavailable).
- Add `timedMode` + per-question `timeLimit` to the MCQ quiz flow (migrates the Speed Code use case).
- Update `docs/FEATURES.md`, `docs/ARCHITECTURE.md` (component inventory), `docs/TODO.md`.

### WS-6 — MCQ Variations (P1/P2)

Model (`src/models/MCQ.ts`) additions:
- `variationGroupId?: ObjectId`, `variantOf?: ObjectId`, `isBase?: boolean`,
  `variationStrategy?: "manual" | "option-shuffle" | "numeric-substitution" | "template"`
- index `{ variationGroupId: 1 }`

Domain (`src/server/domain/variations/`):
- `VariationStrategy` interface `{ generate(base, opts): DraftMCQ[] }`
- `OptionShuffleStrategy` (seeded deterministic PRNG)
- `NumericSubstitutionStrategy` (detect numbers, regenerate, recompute answer)
- `TemplateStrategy` (optional `template` metadata with placeholders + generator expression)
- AI-assisted strategy is documented as a future extension behind the same interface — **not implemented now**.

API:
- `POST /api/mcq/[id]/variations` `{ count, strategy, seed? }` (preview/commit)
- `GET /api/mcq/variations?groupId=`
- reuse existing `PATCH` / `DELETE`

UI (`src/components/admin/MCQManagement.tsx`):
- "Create Variations" action + dialog (strategy, count, preview, save/discard)
- Variant badge + group size; group filter
- Fix F6: subject selector in the MCQ form so create/update succeeds

**Acceptance:** generate and persist variants end-to-end; the base question is unchanged.

### WS-7 — Testing, formatting, CI (P1)

- Vitest + `test` / `test:watch` / `coverage` scripts.
- First tests target pure logic: grading/time-bonus, variation generators, session-code, content-registry validation, rate limiter.
- Prettier + `.editorconfig`; `format` / `format:check`; deliver as a dedicated formatting-only commit.
- GitHub Actions `.github/workflows/ci.yml`: `lint --max-warnings 0` + `typecheck` + `test` + `build`.
- **Acceptance:** CI green on PR.

### WS-8 — Hardening (P2)

- Align all routes to Zod validation (fixes F13).
- Consistent error envelope `{ error, code?, details? }` via the http layer.
- Optional request-logging seam (no-op default).
- Follow-up strictness: `noUncheckedIndexedAccess`, `no-floating-promises`.

## 4. Phased Roadmap

| Phase | Workstreams | Outcome |
|-------|-------------|---------|
| 1 | WS-1 | Zero warnings, strict lint gate, CLI logger |
| 2 | WS-5, F6 fix | Speed Code removed, MCQ admin create fixed |
| 3 | WS-2 | Layered server, thin routes, decoupled domain |
| 4 | WS-3 | Typed API client, shared contracts |
| 5 | WS-6 | MCQ variations end-to-end |
| 6 | WS-4 | Auth/rate-limit abstractions, health, API-ready |
| 7 | WS-7, WS-8 | Tests, CI, formatting, validation hardening |

## 5. Definition of Done

- `pnpm lint --max-warnings 0`, `pnpm typecheck`, `pnpm build`, `pnpm test` all pass.
- All frontend network calls go through the typed client.
- No route handler imports Mongoose directly (goes through services/repositories).
- Speed Code fully removed; legacy sessions handled; timed practice preserved via `timedMode`.
- MCQ variations usable end-to-end; MCQ admin create/update works with subject.
- Docs updated; `pnpm docs:check` passes.

## 6. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Large diff / regressions | Phase-by-phase; run build after each phase |
| Auth refactor breaks login | Keep cookie adapter behavior identical; add tests first |
| Static generation impact | Content registry interface unchanged |
| Prettier churn | Dedicated formatting-only commit |
| Base UI `Select` typing (`v as string`) | Address in the WS-3 types pass |

## 7. Documentation Impact

- `docs/ARCHITECTURE.md`, `docs/API.md`, `docs/DATABASE.md`, `docs/FEATURES.md`,
  `docs/DEVELOPMENT.md`, `docs/DECISIONS.md`, `docs/TODO.md`,
  `docs/generated/*`, `docs/CHANGELOG.md`.

## 8. Decisions Locked

1. Standalone API: **create seams first**, extract to monorepo later.
2. Future runtime: **Fastify**.
3. MCQ variations: **deterministic + template** only (no AI provider now).
4. Timed practice: **add `timedMode`** to MCQ quizzes after removing Speed Code.
5. Quality tooling: **Vitest + Prettier + GitHub Actions CI** included.

## 9. Open Questions

- Priority order confirmation: should Phase 2 (Speed Code removal + MCQ admin fix) precede Phase 3 (layering)?
- Should `src/config/subjects.ts` (legacy re-export shim) be retired during WS-2?
- Coverage threshold for CI (suggested starting point: 60% on `src/server/domain`)?
