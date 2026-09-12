# Database

> Status: Current
> Source of truth: Source code (src/models/)

## Technology

- MongoDB (Atlas) via Mongoose 9.9.4
- Connection: src/lib/db.ts — connectDB() with global caching
- Default URI: mongodb://localhost:27017/cpp-cms (fallback)
- Max pool size: 10

## Models

### Subject
Purpose: Top-level category grouping topics, MCQs, and resources.
Fields:
- name: String (required)
- slug: String (required, unique)
- description: String (required)
- icon: String (default: "BookOpen")
- topics: Array of { name: String (required), slug: String (required) }
- createdAt: Date (default: Date.now)
Indexes:
- slug: unique
Relationships:
- Parent of MCQ (via MCQ.subject → Subject._id)
- Parent of Resource (via Resource.subject → Subject._id)
Used by:
- Learn pages, MCQ and Resource seeding, subject selection UI

---

### MCQ
Purpose: Multiple-choice question linked to a subject and topic.
Fields:
- subject: ObjectId ref "Subject" (required)
- topic: String (required)
- question: String (required)
- codeSnippet: String (optional)
- options: Array of { text: String (required), isCorrect: Boolean (required) }
- explanation: String (required)
- difficulty: String enum ["easy", "medium", "hard"] (default: "medium")
- tags: Array of String
- createdAt: Date (default: Date.now)
Indexes:
- { subject: 1, topic: 1 } — compound index for topic-filtered queries
- { difficulty: 1 } — for difficulty-based filtering
Relationships:
- belongs to Subject (via subject ObjectId)
- referenced by Session (via SessionItem.contentId)
- referenced by QuizAttempt (via questions[].questionId)
- referenced by SessionResult (via answers[].contentId as string)
Used by:
- Quiz engine, MCQ admin CRUD, seed scripts

---

### Resource
Purpose: Teaching resource (code, diagram, or document) linked to a subject.
Fields:
- subject: ObjectId ref "Subject" (required)
- topic: String (required)
- title: String (required)
- type: String enum ["code", "diagram", "document"] (required)
- content: String (required)
- language: String (optional)
- imageUrl: String (optional)
- difficulty: String enum ["beginner", "intermediate", "advanced"] (default: "beginner")
- createdAt: Date (default: Date.now)
Indexes:
- { subject: 1, topic: 1 } — compound index for topic-filtered queries
- { type: 1 } — for type-based filtering
Relationships:
- belongs to Subject (via subject ObjectId)
Used by:
- Learn pages, resource admin CRUD, seed scripts

---

### Session
Purpose: A quiz/game session identified by a 6-character join code.
Fields:
- code: String (required, unique, uppercase, minlength: 6, maxlength: 6)
- title: String (required)
- type: String enum ["quiz", "game", "mixed"] (required)
- items: Array of SessionItem (required, min: 1), where each item has:
  - contentType: String enum ["mcq", "game"] (required)
  - contentId: Mixed (required)
  - gameType: String (optional)
- isActive: Boolean (default: true)
- createdBy: String (default: "teacher")
- subject: String (optional, default: "cpp" via DEFAULT_SUBJECT_SLUG)
- section: String (optional)
- maxAttempts: Number (optional)
- timeLimit: Number (optional)
- createdAt: Date (auto via timestamps)
- updatedAt: Date (auto via timestamps)
Indexes:
- { isActive: 1 } — for active session lookups
- { createdAt: -1 } — for chronological listing
Relationships:
- contains MCQs or games (via items[].contentId — Mixed type, can be ObjectId or string)
- parent of SessionResult (via SessionResult.sessionId → Session._id)
- referenced by AuditLog (via AuditLog.sessionCode — string, loose coupling)
- referenced by ClassEntry (via ClassEntry.sessionCode — string, loose coupling)
Used by:
- Session API routes, quiz start/display, results API, teacher dashboard

---

### SessionResult
Purpose: Stores one student's completed attempt at a session.
Fields:
- sessionId: ObjectId ref "Session" (required)
- studentCode: String (required)
- name: String (optional)
- answers: Array of SessionResultItem (required), where each item has:
  - contentId: String (required)
  - contentType: String enum ["mcq", "game"] (required)
  - selected: Number (optional)
  - isCorrect: Boolean (optional)
  - score: Number (optional)
- totalScore: Number (required)
- totalPossible: Number (required)
- percentage: Number (required)
- timeTaken: Number (optional)
- completedAt: Date (default: Date.now)
Indexes:
- { sessionId: 1 } — for session-based queries
- { studentCode: 1 } — for student-based queries
- { sessionId: 1, studentCode: 1 } — compound index for uniqueness check
Relationships:
- belongs to Session (via sessionId ObjectId)
Used by:
- Results API, leaderboard, student result display

---

### QuizAttempt
Purpose: Records a student's quiz attempt with per-question details.
Fields:
- sessionId: String (required)
- subject: String (required)
- topic: String (required)
- questions: Array of (required):
  - questionId: ObjectId ref "MCQ" (optional ref)
  - selected: Number (required)
  - isCorrect: Boolean (required)
- score: Number (required)
- totalQuestions: Number (required)
- timeTaken: Number (required)
- completedAt: Date (default: Date.now)
Indexes:
- { sessionId: 1 } — for session-based lookups
- { score: -1 } — for leaderboard sorting
Relationships:
- references MCQ (via questions[].questionId — ObjectId ref, loose coupling since MCQ deletion doesn't cascade)
Used by:
- Quiz engine, leaderboard, score tracking

---

### AuditLog
Purpose: Records a teaching session event for audit/tracking purposes.
Fields:
- date: Date (required)
- sessionCode: String (optional)
- section: String (optional)
- topicsCovered: Array of String (default: [])
- mcqsUsed: Number (default: 0)
- studentCount: Number (default: 0)
- averageScore: Number (optional)
- highestScore: Number (optional)
- lowestScore: Number (optional)
- duration: Number (optional)
- notes: String (optional)
- status: String enum ["planned", "completed", "skipped"] (default: "completed")
- createdAt: Date (auto via timestamps)
- updatedAt: Date (auto via timestamps)
Indexes:
- { date: -1 } — for date-based queries
- { section: 1 } — for section-based filtering
- { status: 1 } — for status-based filtering
- { sessionCode: 1 } — for session code lookups
Relationships:
- references Session via sessionCode (string, loose coupling — no ObjectId ref)
Used by:
- Audit log API, teacher dashboard, reporting

---

### TeachingPlan
Purpose: Stores the teacher's planned curriculum items with status and priority.
Fields:
- title: String (required)
- description: String (optional)
- targetDate: Date (optional)
- topics: Array of String (default: [])
- status: String enum ["todo", "in_progress", "done", "skipped"] (default: "todo")
- priority: String enum ["low", "medium", "high"] (default: "medium")
- notes: String (optional)
- createdAt: Date (auto via timestamps)
- updatedAt: Date (auto via timestamps)
Indexes:
- { status: 1 } — for status-based filtering
- { targetDate: 1 } — for date-based sorting
- { priority: 1 } — for priority-based filtering
Relationships:
- None (standalone model)
Used by:
- Teaching plan CRUD API, teacher dashboard

---

### Class
Purpose: Represents a class section (e.g., "CS101 - Section A").
Fields:
- name: String (required, maxlength: 100)
- subject: String (required)
- description: String (optional, maxlength: 500)
- semester: String (optional, maxlength: 50)
- isActive: Boolean (default: true)
- createdAt: Date (auto via timestamps)
- updatedAt: Date (auto via timestamps)
Indexes:
- { subject: 1 } — for subject-based filtering
- { isActive: 1 } — for active class filtering
- { name: 1 } — for name-based lookups
Relationships:
- parent of ClassEntry (via ClassEntry.classId → Class._id)
Used by:
- Class management API, class entry form, teacher dashboard

---

### ClassEntry
Purpose: Records a single class session/lecture entry within a class.
Fields:
- classId: ObjectId ref "Class" (required)
- date: Date (required)
- topics: Array of String (required, default: [])
- sessionCode: String (optional)
- duration: Number (optional)
- notes: String (optional, maxlength: 500)
- createdAt: Date (auto via timestamps)
- updatedAt: Date (auto via timestamps)
Indexes:
- { classId: 1 } — for class-based queries
- { classId: 1, date: -1 } — compound index for chronological class entries
- { sessionCode: 1 } — for session code lookups
Relationships:
- belongs to Class (via classId ObjectId)
- references Session via sessionCode (string, loose coupling — no ObjectId ref)
Used by:
- Class entry API, class detail page, attendance tracking

---

## Relationship Map

```
Subject ──1:N──▶ MCQ          (Subject._id ← MCQ.subject)
Subject ──1:N──▶ Resource     (Subject._id ← Resource.subject)
Class   ──1:N──▶ ClassEntry   (Class._id   ← ClassEntry.classId)
Session ──1:N──▶ SessionResult (Session._id ← SessionResult.sessionId)

QuizAttempt ──N:M──▶ MCQ      (QuizAttempt.questions[].questionId → MCQ._id)
SessionResult ──N:M──▶ MCQ    (SessionResult.answers[].contentId → MCQ._id as string)

AuditLog  ── loosely coupled ──▶ Session  (AuditLog.sessionCode → Session.code)
ClassEntry ── loosely coupled ──▶ Session (ClassEntry.sessionCode → Session.code)
```

## Important Constraints

- **Session.code**: unique, uppercase, exactly 6 characters (SESSION_CODE_LENGTH = 6)
- **SessionResult**: one per (sessionId, studentCode) pair — enforced at application level via compound index, not a unique constraint
- **MCQ.options**: array of {text, isCorrect} — at least one isCorrect must be true (application-level validation)
- **Class.name**: maxlength 100
- **Class.description**: maxlength 500
- **Class.semester**: maxlength 50
- **ClassEntry.notes**: maxlength 500
- **Session.items**: minimum 1 item required (min: 1)
