# Development

> Status: Current
> Source of truth: Configuration files

## Requirements

- Node.js 18+
- pnpm (package manager — never use npm or yarn)
- MongoDB instance (local or Atlas)

## Installation

1. Clone repository
2. pnpm install
3. Create .env.local with the required variables (see Environment Variables below)
4. Set MONGODB_URI and ADMIN_PASSWORD in .env.local
5. Run seed script: pnpm seed:oop
6. Start dev server: pnpm dev

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| MONGODB_URI | Yes | MongoDB connection string |
| ADMIN_PASSWORD | Yes | Teacher login password |
| NEXT_PUBLIC_APP_URL | No | Application URL (http://localhost:3000 for dev) — defined but not referenced in code |
| CODE_EXECUTION_API_URL | No | External code execution API URL — defined but not currently referenced in code |

## Commands

| Command | Purpose |
|---------|---------|
| pnpm dev | Start development server |
| pnpm build | Production build |
| pnpm start | Start production server |
| pnpm lint | Run ESLint |
| pnpm docs:check | Check documentation consistency |
| pnpm seed:oop | Seed OOP subject data |

## Project Structure

src/
├── app/              # Next.js App Router pages and API routes
│   ├── admin/        # Teacher dashboard
│   ├── api/          # API route handlers (44 endpoints)
│   ├── subjects/     # Subject pages (learn, mcq, resources)
│   ├── join/         # Student session join
│   ├── my-progress/  # Student progress tracking page
│   └── s/            # Student session view
├── components/       # React components
│   ├── admin/        # 10 admin dashboard components
│   ├── content/      # Markdown and code rendering
│   ├── games/        # OutputPredictor, BugHunter, SpeedCode
│   ├── layout/       # AppShell, Navbar, Footer, PageHeader
│   ├── learn/        # LearnTopicView
│   ├── providers/    # QueryProvider
│   ├── shared/       # ConfirmDialog, QRCode, SearchDialog, LoadingSpinner
│   ├── subjects/     # SubjectTopicList, LearnTopicGrid
│   └── ui/           # 14 shadcn/ui primitives
├── config/           # subjects.ts configuration
├── content/          # Content registry (subjects, notes, knowledge, games, MCQs)
├── hooks/            # useAdminAuth + 4 React Query hooks
├── lib/              # Utilities (auth, db, constants, validations, etc.)
├── models/           # 10 Mongoose models
└── services/         # session-service.ts

## Stack

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16.3.4 | App Router, API routes, SSR |
| React | 19.2.8 | UI framework |
| TypeScript | ^5 | Type system (strict mode) |
| Tailwind CSS | ^4 | Utility-first CSS (@tailwindcss/postcss) |
| Mongoose | 9.9.4 | MongoDB ODM |
| Zod | ^4.5.4 | API input validation |
| @tanstack/react-query | ^5.102.8 | Server state management |
| shadcn | ^4.19.1 | UI component library |
| ESLint | ^9.39.5 | Linting (flat config) |
| shiki | ^4.4.3 | Syntax highlighting |
| react-markdown | ^10.1.0 | Markdown rendering |
| qrcode | ^1.5.4 | QR code generation |
| next-themes | ^0.4.6 | Theme switching |
| sonner | ^2.0.8 | Toast notifications |

## TypeScript

Configured in `tsconfig.json`:

- **target**: ES2022
- **module**: esnext with bundler resolution
- **strict**: true
- **jsx**: react-jsx
- **incremental**: true
- **Path alias**: `@/*` maps to `./src/*`
- **includes**: `*.ts`, `*.tsx`, `*.mts`

## Code Conventions

- TypeScript strict mode
- No magic numbers/strings — use named constants from `src/lib/constants.ts`
  - ESLint ignores `-1`, `0`, `1`, `2` and array indexes
  - Magic number rules are relaxed in `*.config.*`, `*.test.*`, `*.spec.*` files
- Prefer existing components before creating new ones
- Server components by default — add `"use client"` only when needed
- Zod validation for all API inputs
- React Query for server state, localStorage for student state
- Type imports preferred: `import type { ... }` with inline fix style
- Prefix unused variables/args with `_`

## Validation

All API inputs are validated using Zod schemas defined in `src/lib/validations.ts`. Key schemas:
- `mcqSchema` — MCQ creation/update
- `resourceSchema` — Resource creation/update
- `sessionCreateSchema` — Session creation
- `quizStartSchema` — Quiz start parameters
- `sessionJoinSchema` — Student join
- `sessionSubmitSchema` — Student submission
- `createAuditSchema` — Audit log entry
- `createTeachingPlanSchema` — Teaching plan
- `createClassSchema` — Class creation
- `createClassEntrySchema` — Class entry

## Subject Configuration

Subjects are defined in `src/config/subjects.ts` (static config) with MCQs/Resources in MongoDB (dynamic). Helper functions:
- `getSubject(slug)` — Get subject config by slug
- `getTopics(subjectSlug)` — Get topics for a subject
- `getTopic(subjectSlug, topicSlug)` — Get a specific topic
- `getAllSubjectSlugs()` — Get all subject slugs
- `getTotalQuestions(subjectSlug)` — Sum MCQ counts
- `getNoteCounts(subjectSlug)` — Get note counts per topic

## Linting

ESLint 9.x flat config (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.

### Rules

| Rule | Level | Notes |
|------|-------|-------|
| `@typescript-eslint/no-magic-numbers` | warn | Ignores -1, 0, 1, 2, array indexes, class fields, enums, readonly props |
| `@typescript-eslint/consistent-type-imports` | warn | Prefer `type-imports` with inline fix style |
| `@typescript-eslint/no-explicit-any` | warn | |
| `@typescript-eslint/no-non-null-assertion` | warn | |
| `@typescript-eslint/no-unused-vars` | warn | Allows `_` prefixed args and vars |
| `react/self-closing-comp` | warn | |
| `no-console` | warn | Allows `warn` and `error` |
| `no-alert` | warn | |
| `no-debugger` | error | Hard error — never ship |
| `eqeqeq` | warn | Smart mode |
| `prefer-const` | warn | |
| `no-var` | error | |

### Ignores

`.next/`, `out/`, `build/`, `next-env.d.ts`

## CSS

Tailwind CSS v4 via `@tailwindcss/postcss` PostCSS plugin. Configured in `postcss.config.mjs`.

## Git Ignore

`.gitignore` covers: `node_modules/`, `.next/`, `out/`, `build/`, `.env*`, `.vercel`, `*.tsbuildinfo`, `next-env.d.ts`, debug logs, `.DS_Store`, `*.pem`.
