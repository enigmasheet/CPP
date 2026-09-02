# TeachMate — Student-Facing UI/UX Audit

## Audit Date: September 2, 2026

---

## Critical Issues (Block Core Functionality)

### C1. Session Page Does Not Render MCQ Questions
- **File:** `src/app/s/[code]/page.tsx` (lines 261-274)
- **Impact:** Students see "This exercise type is coming soon" for ALL exercises, including MCQs
- **Root Cause:** The page receives `contentId` but never fetches the actual MCQ data from the database
- **Result:** The entire session-based quiz flow is non-functional for students

### C2. Session Page Cannot Collect Answers
- **File:** `src/app/s/[code]/page.tsx` (line 290-297)
- **Impact:** No option buttons are rendered, so `selected` is always `null`
- **Root Cause:** MCQ rendering was never implemented — only a placeholder exists
- **Result:** All submitted answers are `null`, grading shows 0% for everyone

---

## High Priority Issues (Major UX Gaps)

### H1. Correct Answer Leaked to Client
- **File:** `src/app/api/quiz/start/route.ts` (line 27)
- **Impact:** Students can cheat by inspecting network requests
- **Root Cause:** `correctAnswer` field is included in the API response
- **Note:** Quiz pages are being made admin-only, but this should still be fixed

### H2. Student Code Lost on Page Refresh
- **File:** `src/app/s/[code]/page.tsx` (line 53)
- **Impact:** Student refreshes page → forced to re-join → gets a NEW studentCode → duplicate submission attempt
- **Root Cause:** `studentCode` is only stored in React state, not persisted anywhere

### H3. No Question Review After Quiz/Session
- **Files:** `src/app/s/[code]/page.tsx` (lines 192-217), `src/app/subjects/[subject]/mcq/[topic]/page.tsx`
- **Impact:** Students only see a score, cannot review which questions they got wrong
- **Root Cause:** Results screen only shows aggregate score, no per-question breakdown

### H4. Dead-End Results Page
- **File:** `src/app/s/[code]/page.tsx` (line 209)
- **Impact:** "You can close this window now" — no navigation back to anything
- **Root Cause:** No links or buttons on the results screen

### H5. Quiz Results Never Persisted (Standalone Quiz)
- **File:** `src/app/subjects/[subject]/mcq/[topic]/page.tsx`
- **Impact:** `POST /api/quiz/submit` exists but is never called from the quiz page
- **Root Cause:** Quiz page was built without integrating the submit API
- **Note:** Standalone quizzes are being made admin-only

---

## Medium Priority Issues (Significant UX Gaps)

### M1. Join Page Is Redundant
- **File:** `src/app/join/page.tsx` (lines 29-31)
- **Impact:** Student enters code → redirected to `/s/[code]` → has to enter name again and click "Start"
- **Root Cause:** Join page validates code existence but doesn't actually join the session

### M2. No Error Handling in Join Flow
- **File:** `src/app/s/[code]/page.tsx` (lines 84-93)
- **Impact:** If join API fails, `studentCode` is set to `undefined` and `joined` becomes `true`
- **Root Cause:** No `.catch()` or error state handling on the fetch call

### M3. No Beforeunload Warning
- **File:** `src/app/s/[code]/page.tsx`
- **Impact:** Student can accidentally navigate away and lose all progress
- **Root Cause:** No `beforeunload` event listener

### M4. Public MCQ Routes Accessible to Students
- **Files:** `src/app/subjects/[subject]/mcq/page.tsx`, `src/app/subjects/[subject]/mcq/[topic]/page.tsx`
- **Impact:** Students can access quizzes directly without a teacher-created session
- **Root Cause:** No auth guard on these routes; navbar links to them

### M5. Session List Shows No Stats
- **File:** `src/components/admin/SessionsList.tsx`
- **Impact:** Teacher must click into each session to see student count, average score
- **Root Cause:** Stats not fetched or displayed in the list view

### M6. Audit Log Missing Features
- **File:** `src/components/admin/AuditLog.tsx`
- **Impact:** No date range filter, no session linking, topic slugs shown as-is
- **Root Cause:** Basic implementation without advanced filtering

### M7. Teaching Plan Skipped Items Hidden
- **File:** `src/components/admin/TeachingPlan.tsx` (lines 162-167)
- **Impact:** Skipped items are computed but never rendered
- **Root Cause:** Only `todo`, `in_progress`, `done` columns are mapped in the grid

---

## Low Priority Issues (Nice-to-Have)

### L1. Homepage Hardcoded to First Subject
- **File:** `src/app/page.tsx` (line 12)
- **Impact:** Does not scale if more subjects are added
- **Root Cause:** Uses `Object.keys(SUBJECTS)[0]` statically

### L2. Footer Has No Links
- **File:** `src/components/layout/Footer.tsx`
- **Impact:** No navigation from footer
- **Root Cause:** Only shows static text

### L3. QR Code Has No Error/Loading States
- **File:** `src/components/shared/QRCode.tsx`
- **Impact:** Silent failures, layout shift during loading
- **Root Cause:** No placeholder or error handling

### L4. "Try Again" Uses Full Page Reload
- **File:** `src/app/subjects/[subject]/mcq/[topic]/page.tsx` (line 112)
- **Impact:** Slow, shows loading spinner, gets different questions
- **Root Cause:** Uses `window.location.reload()` instead of state reset

### L5. No Loading State for Empty Quiz
- **File:** `src/app/subjects/[subject]/mcq/[topic]/page.tsx` (lines 89-95)
- **Impact:** Spinner shows forever if no questions exist
- **Root Cause:** No empty state handling

---

## Missing Features

### F1. Student Progress Tracking
- No data model for tracking topic completion or scores over time
- No student dashboard or history page

### F2. Student Past Attempts
- `QuizAttempt` model exists but is never used from the frontend
- No API endpoint to retrieve attempts by student code

### F3. Global Leaderboard
- Not implementing — leaderboard will be per-session only

### F4. MCQ Management UI
- No admin page to create/edit/delete individual MCQs
- `CSVUploader` component exists but is unused (dead code)

### F5. Game Implementations
- 6 games defined: Output Predictor, Bug Hunter, Code Golf, Speed Code, Memory Match, Syntax Scramble
- All marked `implemented: false` — no game pages, no game data, no game components
- Session page shows generic "coming soon" placeholder

### F6. Admin Logout
- No logout button or `/api/admin/logout` route
- Cookie has 24h max-age but no way to clear it

---

## Resolution Plan

| Phase | Issues Addressed | Status |
|-------|-----------------|--------|
| Phase 1: Remove Public MCQ Access | M4, L1, L2 | Pending |
| Phase 2: Fix Session MCQ Rendering | C1, C2, H2 | Pending |
| Phase 3: Persist Student Code | H2 | Pending |
| Phase 4: Leaderboard + Review | H3, H4 | Pending |
| Phase 5: UX Polish | M1, M2, M3, L3, L4, L5 | Pending |
