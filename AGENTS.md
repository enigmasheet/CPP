<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

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
