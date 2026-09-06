# Deployment

> Status: Current
> Source of truth: Configuration files

## Platform

- Vercel (recommended)
- No CI/CD configured
- No Docker configuration
- Manual deployment via GitHub import

## Build

- Build command: `pnpm build`
- Output: `.next/` directory
- Turbopack enabled for dev, Webpack for production

## Environment Variables

Set in Vercel dashboard:
- `MONGODB_URI` — MongoDB Atlas connection string
- `ADMIN_PASSWORD` — Teacher login password
- `NEXT_PUBLIC_APP_URL` — Production URL

## Static Generation

Pages generated at build time:
- `/` — home page
- `/join` — student join page
- `/subjects/[subject]` — all subject slugs (cpp, oop)
- `/subjects/[subject]/learn` — all subject slugs
- `/subjects/[subject]/learn/[topic]` — all subject+topic combos
- `/subjects/[subject]/mcq` — topic selection per subject
- `/subjects/[subject]/mcq/[topic]` — quiz data per topic

Dynamic pages (not cached):
- `/admin` — auth-gated
- `/admin/sessions/[code]` — session-specific
- `/subjects/[subject]/resources` — DB resources
- `/s/[code]` — session participation
- `/my-progress` — localStorage only

## Database

- MongoDB Atlas (cloud) recommended
- Fallback: `mongodb://localhost:27017/cpp-cms`
- Connection pooling: max 10 connections (`MONGODB_MAX_POOL_SIZE`)
- No migrations needed (Mongoose schemaless)

## Security Headers

Configured in `next.config.ts`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-XSS-Protection: 1; mode=block`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
