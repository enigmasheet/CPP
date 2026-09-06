# Authentication & Authorization

> Status: Current
> Source of truth: Source code (`src/lib/auth.ts`)

## Mechanism

- Single-admin cookie-based system
- No user table, no JWT, no sessions collection
- Cookie name: `admin-token` (`ADMIN_TOKEN_COOKIE_NAME` constant)
- Value: base64-encoded `ADMIN_PASSWORD`
- HttpOnly: true
- Secure: true in production
- SameSite: lax
- MaxAge: 86400 seconds (24 hours, `ADMIN_SESSION_MAX_AGE_SECONDS`)

## Login Flow

1. User navigates to `/admin`
2. `useAdminAuth()` hook calls `GET /api/admin/verify`
3. If not authenticated, renders login form
4. User submits password
5. `POST /api/admin/auth` validates password via `crypto.timingSafeEqual`
6. Sets `admin-token` cookie with base64-encoded password (`setAdminCookie()`)
7. Client invalidates `["admin-auth"]` query cache

## Logout Flow

1. `POST /api/admin/logout`
2. Cookie overwritten with `maxAge: COOKIE_CLEAR_MAX_AGE` (0, immediate expiry)

## Protected Routes

### API Routes (requireAdmin())

- `GET/POST /api/audit` — Audit log list and create
- `GET/PATCH/DELETE /api/audit/[id]` — Single audit entry
- `GET/POST /api/classes` — Classes list and create
- `GET/PATCH/DELETE /api/classes/[id]` — Single class
- `GET/POST /api/classes/[id]/entries` — Class entries
- `GET/PATCH/DELETE /api/classes/[id]/entries/[entryId]` — Single entry
- `GET /api/mcq` — MCQ list (admin limit)
- `GET/PATCH/DELETE /api/mcq/[id]` — Single MCQ
- `POST /api/mcq/import` — MCQ CSV import
- `GET/POST /api/plans` — Teaching plans list and create
- `GET/PATCH/DELETE /api/plans/[id]` — Single plan
- `GET/POST /api/resources` — Resources list and create
- `POST /api/resources/import` — Resources CSV import
- `GET/POST /api/sessions` — Sessions list and create
- `GET/PATCH/DELETE /api/sessions/[code]` — Single session
- `GET /api/sessions/[code]/results` — Session results

### Page Routes

- `/admin` — client component, calls `useAdminAuth()` (which hits `/api/admin/verify`)
- `/subjects/[subject]/mcq` — server component, calls `verifyAdmin()` directly
- `/subjects/[subject]/mcq/[topic]` — client component, calls `/api/admin/verify` in `useEffect`

## Rate Limiting

- `POST /api/admin/auth`: 5 attempts (`ADMIN_LOGIN_MAX_ATTEMPTS`) per 60s (`ADMIN_LOGIN_RATE_WINDOW_MS`) per IP

## Security Notes

- Timing-safe comparison via `crypto.timingSafeEqual`
- No CSRF protection (single-admin system)
- Admin password stored as base64 (intentional simplification per project docs)
- If `ADMIN_PASSWORD` env var missing, `verifyAdmin()` always returns false
