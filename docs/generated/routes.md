> This document is generated from repository source/configuration.
> Do not edit manually.
> Run the documentation generation command instead.

---

### Page Routes

| Route | File | Type |
|-------|------|------|
| `/` | `src/app/page.tsx` | Server |
| `/admin` | `src/app/admin/page.tsx` | Client |
| `/admin/sessions/[code]` | `src/app/admin/sessions/[code]/page.tsx` | Client |
| `/join` | `src/app/join/page.tsx` | Client |
| `/my-progress` | `src/app/my-progress/page.tsx` | Client |
| `/s/[code]` | `src/app/s/[code]/page.tsx` | Client |
| `/subjects/[subject]` | `src/app/subjects/[subject]/page.tsx` | Server |
| `/subjects/[subject]/learn` | `src/app/subjects/[subject]/learn/page.tsx` | Server |
| `/subjects/[subject]/learn/[topic]` | `src/app/subjects/[subject]/learn/[topic]/page.tsx` | Server |
| `/subjects/[subject]/mcq` | `src/app/subjects/[subject]/mcq/page.tsx` | Server |
| `/subjects/[subject]/mcq/[topic]` | `src/app/subjects/[subject]/mcq/[topic]/page.tsx` | Client |
| `/subjects/[subject]/resources` | `src/app/subjects/[subject]/resources/page.tsx` | Client |

### API Routes

| Method | Path | File | Auth |
|--------|------|------|------|
| GET | `/api/admin/verify` | `src/app/api/admin/verify/route.ts` | Cookie |
| POST | `/api/admin/auth` | `src/app/api/admin/auth/route.ts` | None |
| POST | `/api/admin/logout` | `src/app/api/admin/logout/route.ts` | None |
| GET | `/api/audit` | `src/app/api/audit/route.ts` | Admin |
| POST | `/api/audit` | `src/app/api/audit/route.ts` | Admin |
| PATCH | `/api/audit/[id]` | `src/app/api/audit/[id]/route.ts` | Admin |
| DELETE | `/api/audit/[id]` | `src/app/api/audit/[id]/route.ts` | Admin |
| GET | `/api/classes` | `src/app/api/classes/route.ts` | Admin |
| POST | `/api/classes` | `src/app/api/classes/route.ts` | Admin |
| GET | `/api/classes/[id]` | `src/app/api/classes/[id]/route.ts` | Admin |
| PATCH | `/api/classes/[id]` | `src/app/api/classes/[id]/route.ts` | Admin |
| DELETE | `/api/classes/[id]` | `src/app/api/classes/[id]/route.ts` | Admin |
| GET | `/api/classes/[id]/entries` | `src/app/api/classes/[id]/entries/route.ts` | Admin |
| POST | `/api/classes/[id]/entries` | `src/app/api/classes/[id]/entries/route.ts` | Admin |
| PATCH | `/api/classes/[id]/entries/[entryId]` | `src/app/api/classes/[id]/entries/[entryId]/route.ts` | Admin |
| DELETE | `/api/classes/[id]/entries/[entryId]` | `src/app/api/classes/[id]/entries/[entryId]/route.ts` | Admin |
| GET | `/api/games/[gameType]` | `src/app/api/games/[gameType]/route.ts` | None |
| GET | `/api/mcq` | `src/app/api/mcq/route.ts` | None |
| POST | `/api/mcq` | `src/app/api/mcq/route.ts` | Admin |
| GET | `/api/mcq/[id]` | `src/app/api/mcq/[id]/route.ts` | None |
| PATCH | `/api/mcq/[id]` | `src/app/api/mcq/[id]/route.ts` | Admin |
| DELETE | `/api/mcq/[id]` | `src/app/api/mcq/[id]/route.ts` | Admin |
| POST | `/api/mcq/batch` | `src/app/api/mcq/batch/route.ts` | None |
| POST | `/api/mcq/import` | `src/app/api/mcq/import/route.ts` | Admin |
| GET | `/api/plans` | `src/app/api/plans/route.ts` | Admin |
| POST | `/api/plans` | `src/app/api/plans/route.ts` | Admin |
| PATCH | `/api/plans/[id]` | `src/app/api/plans/[id]/route.ts` | Admin |
| DELETE | `/api/plans/[id]` | `src/app/api/plans/[id]/route.ts` | Admin |
| POST | `/api/quiz/start` | `src/app/api/quiz/start/route.ts` | None |
| POST | `/api/quiz/submit` | `src/app/api/quiz/submit/route.ts` | None |
| GET | `/api/resources` | `src/app/api/resources/route.ts` | Admin |
| POST | `/api/resources` | `src/app/api/resources/route.ts` | Admin |
| POST | `/api/resources/import` | `src/app/api/resources/import/route.ts` | Admin |
| GET | `/api/search` | `src/app/api/search/route.ts` | None |
| GET | `/api/sessions` | `src/app/api/sessions/route.ts` | Admin |
| POST | `/api/sessions` | `src/app/api/sessions/route.ts` | Admin |
| GET | `/api/sessions/[code]` | `src/app/api/sessions/[code]/route.ts` | Conditional |
| PATCH | `/api/sessions/[code]` | `src/app/api/sessions/[code]/route.ts` | Admin |
| DELETE | `/api/sessions/[code]` | `src/app/api/sessions/[code]/route.ts` | Admin |
| POST | `/api/sessions/[code]/join` | `src/app/api/sessions/[code]/join/route.ts` | None |
| POST | `/api/sessions/[code]/submit` | `src/app/api/sessions/[code]/submit/route.ts` | None |
| GET | `/api/sessions/[code]/leaderboard` | `src/app/api/sessions/[code]/leaderboard/route.ts` | None |
| GET | `/api/sessions/[code]/results` | `src/app/api/sessions/[code]/results/route.ts` | Admin |
| GET | `/api/subjects` | `src/app/api/subjects/route.ts` | None |
