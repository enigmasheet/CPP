<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Description

**TeachMate** is a teacher assistant tool — not a student LMS. The primary user is the teacher (you). It replaces PowerPoint presentations with interactive notes, quizzes, and games during class. Students may or may not use the web app outside of class; their main interaction is joining quiz sessions when the teacher launches them.

**Teacher workflow:**
1. Prepare notes and teaching plans using the Teacher Notes and Teaching Plan tabs
2. Create quiz/game sessions from MCQs and game components, linked to a class section
3. Display a QR code in class — students scan and join from their phones
4. Students participate in real-time quizzes and games, making class interactive
5. Review session results, audit logs, and class progress after class

**Student workflow:**
- Students join sessions via a 6-character code, participate in quizzes, and see their score. No persistent student accounts or cross-device progress tracking. localStorage is used for transient state only (resume mid-quiz, show local topic completion).

# Intentional Architecture Decisions

The following are **intentional design choices** — do NOT "fix" them:

- **Admin cookie uses base64-encoded password** (`src/lib/auth.ts`): This is a known simplification. The admin password is stored as base64 in an HttpOnly cookie. A proper JWT/session-based auth system is planned for a future iteration. Do not replace with JWT or add encryption — the current approach is accepted for this project's scope.

- **Quiz start endpoint returns `correctAnswer`** (`src/app/api/quiz/start/route.ts`): The correct answer index and explanation are intentionally sent to the client. The quiz is designed as a learning tool, not a secure exam system. Students can see answers via DevTools — this is by design. Do not remove `correctAnswer` or `explanation` from the response.

- **No persistent student accounts**: Students are identified by ephemeral random codes per session. There is no Student model, no login, and no cross-device sync. This is intentional — the tool is teacher-centric, not a student platform.

- **localStorage for student state**: Topic completion and quiz results are stored in localStorage only. This is acceptable because the tool is teacher-centric and students are not expected to track progress across devices.

# No Magic Numbers or Strings

**NEVER** use hardcoded numeric literals or string literals in application logic. Always extract them to named constants in `src/lib/constants.ts` first.

## Rule
- Magic number: any `number` literal (e.g., `5000`, `100`, `0.7`, `6`) used in logic, conditions, or configuration
- Magic string: any `string` literal (e.g., `"active"`, `"medium"`, `"admin-token"`, `/api/...`) used in logic, conditions, or configuration
- Exception: `0`, `1`, `true`, `false`, `null`, `undefined` are allowed as trivial values
- Exception: JSX string children, CSS class names, and comments are excluded
- Exception: `console.log`, `console.error`, and error message strings are allowed

## Process
1. Before writing any new number or string literal, check `src/lib/constants.ts`
2. If it doesn't exist, add it with a descriptive UPPER_SNAKE_CASE name
3. Import and use the constant in your component/route
4. Never inline magic values — even if the constant seems obvious

## Examples
```ts
// BAD
const interval = setInterval(fn, 5000);
if (score >= 70) { ... }

// GOOD
import { RESULTS_AUTO_REFRESH_INTERVAL_MS, LEADERBOARD_HIGH_THRESHOLD } from "@/lib/constants";
const interval = setInterval(fn, RESULTS_AUTO_REFRESH_INTERVAL_MS);
if (score >= LEADERBOARD_HIGH_THRESHOLD) { ... }
```

# Package Manager

Always use `pnpm` for package management. Never use `npm` or `yarn`.

# Upcoming Updates (Multi-Subject UI/UX Plan)

The following are planned improvements as more subjects are added:

### Subject Selection & Navigation
- **Home page**: Show all subjects as cards with progress indicators, not just the first one
- **Subject landing page**: Add a "Subjects" breadcrumb/dropdown so students can switch between subjects without going back to home
- **Navbar**: Already handles multi-subject mode (dropdown when >1 subject) — no changes needed

### Content Seeding
- **Seed script** (`pnpm seed:oop`): Adds placeholder OOP subject with 12 MCQs and 6 resources
- Future subjects should follow the same pattern: add to `src/config/subjects.ts` config + run a seed script

### Learn Pages
- **Subject-specific progress**: Currently progress is keyed by subject slug in localStorage — already works across subjects
- **Cross-subject progress view**: "My Progress" page will show per-subject tabs or sections when multiple subjects have data

### Sessions & Quizzes
- **Subject filter on sessions**: Sessions list will show which subject they belong to
- **MCQ import**: When creating sessions, MCQs should be filterable by subject

### Classes
- **Multi-subject classes**: A class can be linked to a subject, so "CS101 - OOP" tracks OOP topics and "CS101 - C++" tracks C++ topics

# Documentation Maintenance

**Documentation is part of the codebase.** Every code change must be evaluated for documentation impact.

## Documentation Files

| File | Purpose |
|------|---------|
| `docs/PROJECT_CONTEXT.md` | Product purpose, users, workflows |
| `docs/ARCHITECTURE.md` | System design, rendering strategy, state management |
| `docs/DATABASE.md` | Models, relationships, indexes (single source of truth for DB) |
| `docs/API.md` | All API endpoints with auth, request/response |
| `docs/AUTH.md` | Authentication mechanism and protected routes |
| `docs/FEATURES.md` | Feature inventory with code locations |
| `docs/DEVELOPMENT.md` | Setup, commands, conventions |
| `docs/DEPLOYMENT.md` | Build, deploy, environment config |
| `docs/DECISIONS.md` | Architectural decisions and rationale |
| `docs/TODO.md` | Known issues and planned features |
| `docs/CHANGELOG.md` | Historical changes |
| `docs/generated/` | Auto-generated route, model, env var inventories |

## Before Finishing Any Task

Determine whether the change affects:
- Architecture, Database, API, Authentication, Features, Routes
- Rendering, Deployment, Environment variables, Business rules
- Architectural decisions, Known limitations, TODO items

If it does, update the appropriate documentation in the same change.

## Documentation Impact Check

```md
## Documentation Impact

- [ ] Project context
- [ ] Architecture
- [ ] Database
- [ ] API
- [ ] Authentication
- [ ] Features
- [ ] Development
- [ ] Deployment
- [ ] Decisions
- [ ] TODO
```

## Rules

1. Never intentionally leave known stale documentation behind
2. Source code is the ultimate source of truth — if docs conflict with code, update docs
3. Prefer a smaller number of high-quality documents over dozens of repetitive files
4. Do not over-document obvious implementation details
5. Include actual file paths and code references where useful
