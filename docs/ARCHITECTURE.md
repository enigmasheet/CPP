# Architecture

> Status: Current
> Source of truth: Repository implementation

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  (React 19 + TanStack Query + localStorage)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js 16.3.4 (App Router)               │
│  ┌─────────────────┐    ┌───────────────────────────────┐   │
│  │ Server Components│    │   API Routes (src/app/api/)   │   │
│  │ (SSG/SSR)       │    │   44 endpoints, 11 groups     │   │
│  └────────┬────────┘    └───────────────┬───────────────┘   │
│           │                              │                   │
│           ▼                              ▼                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Services Layer                          │    │
│  │  - auth.ts (timing-safe password comparison)        │    │
│  │  - db.ts (Mongoose connection caching)              │    │
│  │  - constants.ts (no magic numbers/strings)          │    │
│  └────────────────────────┬────────────────────────────┘    │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB (Atlas)                           │
│              Mongoose 9.9.4 ODM                              │
│              10 Models, global connection cache               │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.3.4 (App Router, Turbopack) |
| Language | TypeScript 5.x (strict mode, ES2022 target) |
| UI | React 19, Tailwind CSS 4, shadcn/ui (Base UI primitives) |
| State | React Query (TanStack Query) + localStorage |
| Database | MongoDB (Atlas) via Mongoose 9.9.4 |
| Auth | HttpOnly cookie (base64-encoded password) |
| Validation | Zod 4.x |
| Markdown | ReactMarkdown 10.x + remark-gfm |
| Code Highlighting | Shiki 4.x |
| Icons | Lucide React |
| Notifications | Sonner (toast) |
| Package Manager | pnpm |

## Frontend Architecture

### App Router Structure
- **Server Components**: Root layout, subject pages, topic pages (static generation)
- **Client Components**: Navbar, admin dashboards, quiz/game participation, search
- **Dynamic Routes**: `/admin`, `/s/[code]`, `/subjects/[subject]/mcq/[topic]`

### Component Inventory (40 components)
- **UI primitives** (14): button, card, badge, dialog, dropdown-menu, input, progress, select, sheet, skeleton, sonner, table, tabs, textarea
- **Layout** (4): AppShell, Footer, Navbar, PageHeader
- **Admin** (10): AuditLog, ClassesManager, CppKnowledge, CreateSessionDialog, CSVUploader, EditSessionDialog, MCQManagement, SessionsList, TeachingPlan, TeacherNotes
- **Learn** (1): LearnTopicView
- **Subject** (2): LearnTopicGrid, SubjectTopicList
- **Game** (3): OutputPredictor, SpeedCode, BugHunter
- **Shared** (4): ConfirmDialog, LoadingSpinner, QRCode, SearchDialog
- **Content** (2): CodeBlock, MarkdownRenderer
- **Providers** (1): QueryProvider

### State Management
- **Server state**: React Query (`staleTime: 30s` for admin data, `5min` for auth)
- **Student progress**: localStorage (`learn-progress-*`, `quiz_progress_*`)
- **Theme**: next-themes (default: dark, supports system preference)
- **Form state**: Local React state within components
- **Toast notifications**: Sonner (centralized in layout)

## Backend Architecture

### API Routes (`src/app/api/`)
- **44 endpoints** across **11 route groups**:
  - `admin/` (3): auth, logout, verify
  - `audit/` (2): list, detail
  - `classes/` (4): CRUD + entries
  - `games/` (1): game type handler
  - `mcq/` (4): CRUD, import, batch
  - `plans/` (2): CRUD
  - `quiz/` (2): start, submit
  - `resources/` (2): list, import
  - `search/` (1): global search
  - `sessions/` (6): CRUD, join, results, leaderboard, submit
  - `subjects/` (1): list

### Route Handler Pattern
- All DB-dependent routes use `withDB()` HOC for connection management
- Auth-protected routes call `requireAdmin()` which returns 401 if unauthorized
- Zod schemas validate all request bodies before processing
- Rate limiting on auth, join, and submit endpoints (in-memory store)

### Rate Limiting Configuration
| Endpoint | Max Attempts | Window |
|----------|-------------|--------|
| Admin login | 5 | 60s |
| Session join | 10 | 60s |
| Session submit | 10 | 60s |

## Data Access Layer

### Connection Management (`src/lib/db.ts`)
- **`connectDB()`**: Mongoose connection with global cache (prevents connection leaks in serverless)
- **`withDB(handler)`**: HOC that wraps route handlers with automatic DB connection and error handling
- **Pool size**: Configurable via `MONGODB_MAX_POOL_SIZE` (default: 10)

### Models (`src/models/`, 10 Mongoose models)
| Model | Purpose |
|-------|---------|
| `AuditLog` | Teaching audit records (planned/completed/skipped) |
| `Class` | Class sections with metadata |
| `ClassEntry` | Student entries within a class |
| `MCQ` | Multiple choice questions with topics |
| `QuizAttempt` | Individual quiz attempt records |
| `Resource` | External learning resources |
| `Session` | Quiz/game session definitions |
| `SessionResult` | Student results per session |
| `Subject` | Subject definitions (slug, name) |
| `TeachingPlan` | Teaching plans with priorities |

### Content Registry (`src/content/`)
Static, subject-scoped content is the single source of truth for notes, knowledge, and games. Content modules are data-only; `registry.ts` validates them with Zod at load time and exposes typed accessors.

```
src/content/
├── types.ts          # SubjectConfig, NoteSection, KnowledgeSection, GameQuestion, GameTypeMeta
├── schemas.ts        # Zod schemas (validated on load)
├── registry.ts       # Single import point: getNotes, getKnowledge, getGameQuestions, getAvailableGameTypes
├── games.ts          # Subject-keyed game content + validation
├── cpp/              # subject content
│   ├── subject.ts    # topics + noteCounts
│   ├── notes.ts
│   ├── knowledge.ts
│   ├── mcqs.json
│   ├── resources.json
│   └── games/        # output-predictor.json, bug-hunter.json, speed-code.json
└── oop/              # placeholder subject
```

- **Adding a subject**: add `src/content/{subject}/` content + one entry in `registry.ts` and `games.ts`.
- **Adding a game type**: add a `GAME_TYPES` entry in `constants.ts`, per-subject JSON under `src/content/{subject}/games/`, and a game component.
- **Subject resolution**: sessions carry a `subject` field; `/api/games/[gameType]?subject=` serves the correct content. Game access never hardcodes a subject.

## Rendering Strategy

| Route | Strategy | Reason |
|-------|----------|--------|
| `/` | Static (SSG) | Marketing landing, no DB required |
| `/subjects/[subject]` | Static (generateStaticParams) | Stable subject overview |
| `/subjects/[subject]/learn` | Static (generateStaticParams) | Static topic list |
| `/subjects/[subject]/learn/[topic]` | Static (generateStaticParams) | Static note content |
| `/subjects/[subject]/mcq` | Dynamic (server auth check) | Admin-only, auth-gated |
| `/subjects/[subject]/mcq/[topic]` | Dynamic (client auth check) | Quiz needs fresh data |
| `/subjects/[subject]/resources` | Dynamic (useParams) | DB resources, dynamic |
| `/admin` | Dynamic | Auth-gated dashboard |
| `/admin/sessions/[code]` | Dynamic | Session-specific data |
| `/join` | Client-rendered (statically pre-rendered at build) | Simple code entry form |
| `/s/[code]` | Dynamic | Session participation, real-time |
| `/my-progress` | Client-rendered (statically pre-rendered at build) | localStorage only, no server |

## State Management

| Scope | Mechanism | Details |
|-------|-----------|---------|
| Server state | React Query | `staleTime: 30s` (admin), `refetchOnWindowFocus: false`, `retry: 1` |
| Student progress | localStorage | `learn-progress-*` (topic completion) |
| Quiz state | localStorage | `quiz_progress_*` (mid-quiz resume) |
| Theme | next-themes | Class-based dark/light toggle, system preference support |
| Form state | React useState | Local to each form component |
| Auth state | React Query | `useAdminAuth()` hook with 5min cache |

## Security

### Authentication (`src/lib/auth.ts`)
- **HttpOnly cookie**: `admin-token` stores base64-encoded password
- **Timing-safe comparison**: `crypto.timingSafeEqual` prevents timing attacks
- **Secure flag**: Enabled in production (`NODE_ENV === "production"`)
- **SameSite**: `lax` for CSRF mitigation
- **Max age**: 24 hours (configurable via `ADMIN_SESSION_MAX_AGE_SECONDS`)

### Security Headers (`next.config.ts`)
- `X-Frame-Options: DENY` — Prevents clickjacking
- `X-Content-Type-Options: nosniff` — Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-XSS-Protection: 1; mode=block`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

(See DEPLOYMENT.md for full details.)

### Input Validation
- All API endpoints validate with Zod schemas
- Limits: session title (200), section (100), student name (100), search query min (2)
- No CSRF protection (single-admin system, SameSite cookie mitigates)

### Known Limitations (Intentional)
- Base64-encoded password in cookie (not JWT) — simplification for single-admin
- Quiz start returns `correctAnswer` — learning tool, not secure exam
- No persistent student accounts — teacher-centric design
- localStorage for student state — acceptable for ephemeral use
