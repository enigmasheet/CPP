# Features

> Status: Current
> Source of truth: Source code

## Session Management

Purpose: Create and manage quiz/game sessions for in-class use
Users: Teacher
Workflow: Create session → Display QR → Students join → View results
Implementation: `src/components/admin/SessionsList.tsx`, `CreateSessionDialog.tsx`, `EditSessionDialog.tsx`
Relevant routes: `/admin` (Sessions tab), `/admin/sessions/[code]`
Relevant models: Session, SessionResult
Business rules: 6-char codes, ambiguous chars excluded, one submission per student per session

## Classes & Teaching Entries

Purpose: Track class sections and log teaching activities
Users: Teacher
Workflow: Create class → Log entries with topics/duration/notes
Implementation: `src/components/admin/ClassesManager.tsx`
Relevant routes: `/admin` (Classes tab)
Relevant models: Class, ClassEntry
Business rules: Entries linked by classId, optional sessionCode reference

## MCQ Management

Purpose: Create, edit, import, and manage multiple choice questions
Users: Teacher
Workflow: Create/import MCQs → Organize by subject/topic → Use in sessions
Implementation: `src/components/admin/MCQManagement.tsx`, `CSVUploader.tsx`
Relevant routes: `/admin` (MCQs tab)
Relevant models: MCQ
Business rules: Requires subject ref, at least 2 options per question, at least one option marked as correct

## Audit Log

Purpose: Track planned, completed, and skipped teaching activities
Users: Teacher
Workflow: Create log entries → Filter by status → View summary stats
Implementation: `src/components/admin/AuditLog.tsx`
Relevant routes: `/admin` (Audit Log tab)
Relevant models: AuditLog
Business rules: Auto-updated on session submission, pagination (10/page)

## Teaching Plans

Purpose: Plan and track topic coverage with status and priority
Users: Teacher
Workflow: Create plans → Move through todo/in_progress/done → Track priority
Implementation: `src/components/admin/TeachingPlan.tsx`
Relevant routes: `/admin` (Teaching Plan tab)
Relevant models: TeachingPlan
Business rules: Status transitions: todo→in_progress→done

## Teacher Notes

Purpose: Browse curriculum notes organized by topic
Users: Teacher
Workflow: Select topic → Browse sections → Navigate prev/next
Implementation: `src/components/admin/TeacherNotes.tsx`
Relevant routes: Inline in admin dashboard
Data source: `src/data/teacher-notes.ts` (static)

## Hidden Knowledge

Purpose: Browse C++ knowledge base (bugs, tricky programs, teaching, reference)
Users: Teacher
Workflow: Filter by category → Browse entries
Implementation: `src/components/admin/CppKnowledge.tsx`
Relevant routes: Inline in admin dashboard
Data source: `src/data/cpp-knowledge.ts` (static)

## Learn Pages

Purpose: Student-facing topic notes with progress tracking
Users: Student, Teacher
Workflow: Select subject → Select topic → Read notes → Mark complete
Implementation: `src/components/learn/LearnTopicView.tsx`, `LearnTopicGrid.tsx`, `SubjectTopicList.tsx`
Relevant routes: `/subjects/[subject]`, `/subjects/[subject]/learn`, `/subjects/[subject]/learn/[topic]`
Business rules: Progress stored in localStorage, teaching tips stripped from student view

## Quiz System

Purpose: Standalone quiz practice for students
Users: Student (via teacher authorization)
Workflow: Select topic → Answer MCQs → See explanations → View score
Implementation: `src/app/subjects/[subject]/mcq/[topic]/page.tsx`
Relevant routes: `/subjects/[subject]/mcq`, `/subjects/[subject]/mcq/[topic]`
Relevant models: QuizAttempt
Business rules: Correct answers intentionally returned (learning tool), time bonus applied

## Games

Purpose: Interactive learning games (Output Predictor, Speed Code)
Users: Student (via session)
Workflow: Join session → Play game → See score
Implementation: `src/components/games/OutputPredictor.tsx`, `SpeedCode.tsx`
Relevant routes: `/s/[code]`
Data source: `src/data/games.ts`
Business rules: Three game types: output-predictor, bug-hunter, speed-code

## Student Progress

Purpose: Track learning progress across topics
Users: Student
Workflow: View progress dashboard → See per-topic completion → Review quiz history
Implementation: `src/app/my-progress/page.tsx`
Business rules: All data in localStorage, no server-side tracking

## Search

Purpose: Global search across notes, MCQs, and resources
Users: Teacher, Student
Workflow: Press Ctrl+K → Type query → View categorized results
Implementation: `src/components/shared/SearchDialog.tsx`
Relevant routes: `/api/search`
Business rules: Min 2 chars, max 5 results per category, debounced (300ms)

## Resources

Purpose: Browse learning resources (code examples, diagrams, documents)
Users: Teacher, Student
Workflow: Select subject → Filter by topic/type → View resource
Implementation: `src/app/subjects/[subject]/resources/page.tsx`
Relevant models: Resource
Business rules: Requires subject ref, three types: code/diagram/document

## QR Code Display

Purpose: Generate QR codes for session join URLs
Users: Teacher
Workflow: View session → Click QR to enlarge → Students scan
Implementation: `src/components/shared/QRCode.tsx`
Business rules: URL format: `/s/{code}`, clickable to enlarge in dialog
