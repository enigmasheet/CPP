> This document is generated from repository source/configuration.
> Do not edit manually.
> Run the documentation generation command instead.

# Environment Variables

| Variable | Required | Used In | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | Yes | `src/lib/db.ts`, `seed/seed.ts`, `scripts/seed-oop.ts` | MongoDB connection string |
| `ADMIN_PASSWORD` | Yes | `src/lib/auth.ts`, `src/app/api/admin/auth/route.ts` | Admin authentication password |
| `NODE_ENV` | No | `src/lib/auth.ts`, `src/app/api/admin/logout/route.ts` | Node.js environment mode (controls secure cookie flag) |
| `NEXT_PUBLIC_APP_URL` | No | `.env.local`, `DEVELOPMENT.md` | Application URL (e.g., `http://localhost:3000`) |
| `CODE_EXECUTION_API_URL` | No | `.env.local`, `DEVELOPMENT.md` | External code execution API URL |
