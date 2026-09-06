# Project Context

> Status: Current
> Source of truth: Repository implementation

## Purpose

TeachMate is a teacher assistant tool that replaces PowerPoint presentations with interactive notes, quizzes, and games during class. The primary user is the teacher. Students interact by joining quiz sessions when the teacher launches them — no persistent student accounts exist.

## Users

| Role | Description |
|------|-------------|
| **Teacher** | Primary user. Prepares notes, creates sessions, displays QR codes, reviews results. Authenticated via admin password cookie. |
| **Student** | Ephemeral. Joins sessions via 6-character code, completes quizzes, sees score. No accounts, no login, localStorage only for transient state. |

## Core Workflows

**Teacher workflow:**
1. Prepare notes and teaching plans using Teacher Notes and Teaching Plan tabs
2. Create quiz/game sessions by selecting MCQs and game components, linked to a class section
3. Display a QR code in class — students scan and join from their phones
4. Students participate in real-time quizzes and games, making class interactive
5. Review session results, audit logs, and class progress after class

**Student workflow:**
- Join sessions via 6-character code, participate in quizzes, see score. No persistent accounts. localStorage for transient state only (resume mid-quiz, show local topic completion).

## Core Domain Concepts

- **Subject**: A course (cpp, oop) with topics. Configured in `src/config/subjects.ts`, stored in MongoDB.
- **Topic**: A sub-unit within a subject (e.g., "basics", "oop"). Slug, name, description, note count.
- **MCQ**: Multiple choice question with options (each marked correct/incorrect), optional code snippet, explanation, difficulty level (easy/medium/hard), and subject ObjectId ref.
- **Session**: A quiz/game session with a unique 6-char code students join. Contains selected MCQs and/or games. Can be toggled active/closed.
- **QuizAttempt**: Individual quiz submission with per-question results, score, and time taken.
- **SessionResult**: Per-student results for a session — answers, total score, percentage, completion time.
- **ClassEntry**: A teaching log entry for a class section.
- **AuditLog**: Planned/completed/skipped teaching activities.
- **TeachingPlan**: Planned topics with status and priority.
- **Resource**: Learning material (code, diagram, document) with Markdown content, topic, and difficulty. Requires subject ObjectId ref.

## Business Rules

- Teacher is the primary user; students are ephemeral (no accounts, no login)
- Session codes are 6 chars, uppercase alphanumeric; ambiguous characters (0, O, 1, I) are excluded
- Quiz correct answers are intentionally returned to the client — this is a learning tool, not a secure exam system
- Admin cookie uses base64-encoded password (intentional simplification; JWT planned for future)
- localStorage is used for student progress (not cross-device)
- Two subjects configured: **cpp** (C++ Programming) with 15 topics, and **oop** (Object Oriented Programming) with 8 placeholder topics
- OOP subject is seeded via `pnpm seed:oop` with 12 MCQs and 6 resources
- MCQs and Resources require a subject ObjectId reference
- Learn/notes are static content defined in `teacherNotes.ts`; MCQs are database-backed
- All magic numbers and strings must be extracted to named constants in `src/lib/constants.ts`
- Package manager: `pnpm` only (no npm or yarn)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, React 19) |
| UI | Tailwind CSS v4 + shadcn/ui |
| Database | MongoDB + Mongoose |
| Code Highlighting | Shiki |
| QR Code | qrcode |
| Notifications | Sonner |
| Deployment | Vercel (serverless) |
