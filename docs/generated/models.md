> This document is generated from repository source/configuration.
> Do not edit manually.
> Run the documentation generation command instead.

# Model Inventory

Auto-generated from `src/models/` — 10 models total.

---

## AuditLog

**File:** `src/models/AuditLog.ts`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `date` | `Date` | Yes | — | — |
| `sessionCode` | `String` | No | — | — |
| `section` | `String` | No | — | — |
| `topicsCovered` | `[String]` | No | `[]` | — |
| `mcqsUsed` | `Number` | No | `0` | — |
| `studentCount` | `Number` | No | `0` | — |
| `averageScore` | `Number` | No | — | — |
| `highestScore` | `Number` | No | — | — |
| `lowestScore` | `Number` | No | — | — |
| `duration` | `Number` | No | — | — |
| `notes` | `String` | No | — | — |
| `status` | `String` | No | `"completed"` | Enum: `planned`, `completed`, `skipped` |
| `createdAt` | `Date` | — | — | Auto via `timestamps: true` |
| `updatedAt` | `Date` | — | — | Auto via `timestamps: true` |

**Indexes:**

- `{ date: -1 }`
- `{ section: 1 }`
- `{ status: 1 }`
- `{ sessionCode: 1 }`

**Relationships:** None

---

## Class

**File:** `src/models/Class.ts`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | `String` | Yes | — | `maxlength: 100` |
| `subject` | `String` | Yes | — | — |
| `description` | `String` | No | — | `maxlength: 500` |
| `semester` | `String` | No | — | `maxlength: 50` |
| `isActive` | `Boolean` | No | `true` | — |
| `createdAt` | `Date` | — | — | Auto via `timestamps: true` |
| `updatedAt` | `Date` | — | — | Auto via `timestamps: true` |

**Indexes:**

- `{ subject: 1 }`
- `{ isActive: 1 }`
- `{ name: 1 }`

**Relationships:** None

---

## ClassEntry

**File:** `src/models/ClassEntry.ts`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `classId` | `ObjectId` | Yes | — | Ref: `Class` |
| `date` | `Date` | Yes | — | — |
| `topics` | `[String]` | Yes | `[]` | — |
| `sessionCode` | `String` | No | — | — |
| `duration` | `Number` | No | — | — |
| `notes` | `String` | No | — | `maxlength: 500` |
| `createdAt` | `Date` | — | — | Auto via `timestamps: true` |
| `updatedAt` | `Date` | — | — | Auto via `timestamps: true` |

**Indexes:**

- `{ classId: 1 }`
- `{ classId: 1, date: -1 }`
- `{ sessionCode: 1 }`

**Relationships:**

- `classId` → `Class` (referenced)

---

## MCQ

**File:** `src/models/MCQ.ts`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `subject` | `ObjectId` | Yes | — | Ref: `Subject` |
| `topic` | `String` | Yes | — | — |
| `question` | `String` | Yes | — | — |
| `codeSnippet` | `String` | No | — | — |
| `options` | `[{ text: String, isCorrect: Boolean }]` | Yes | — | `text` required, `isCorrect` required |
| `explanation` | `String` | Yes | — | — |
| `difficulty` | `String` | No | `"medium"` | Enum: `easy`, `medium`, `hard` (from `DIFFICULTY_LEVELS`) |
| `tags` | `[String]` | No | — | — |
| `createdAt` | `Date` | No | `Date.now` | — |

**Indexes:**

- `{ subject: 1, topic: 1 }`
- `{ difficulty: 1 }`

**Relationships:**

- `subject` → `Subject` (referenced)

---

## QuizAttempt

**File:** `src/models/QuizAttempt.ts`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `sessionId` | `String` | Yes | — | — |
| `subject` | `String` | Yes | — | — |
| `topic` | `String` | Yes | — | — |
| `questions` | `[{ questionId: ObjectId, selected: Number, isCorrect: Boolean }]` | Yes | — | `questionId` refs `MCQ`, `selected` required, `isCorrect` required |
| `score` | `Number` | Yes | — | — |
| `totalQuestions` | `Number` | Yes | — | — |
| `timeTaken` | `Number` | Yes | — | — |
| `completedAt` | `Date` | No | `Date.now` | — |

**Indexes:**

- `{ sessionId: 1 }`
- `{ score: -1 }`

**Relationships:**

- `questions[].questionId` → `MCQ` (referenced)

---

## Resource

**File:** `src/models/Resource.ts`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `subject` | `ObjectId` | Yes | — | Ref: `Subject` |
| `topic` | `String` | Yes | — | — |
| `title` | `String` | Yes | — | — |
| `type` | `String` | Yes | — | Enum: `code`, `diagram`, `document` |
| `content` | `String` | Yes | — | — |
| `language` | `String` | No | — | — |
| `imageUrl` | `String` | No | — | — |
| `difficulty` | `String` | No | `"beginner"` | Enum: `beginner`, `intermediate`, `advanced` |
| `createdAt` | `Date` | No | `Date.now` | — |

**Indexes:**

- `{ subject: 1, topic: 1 }`
- `{ type: 1 }`

**Relationships:**

- `subject` → `Subject` (referenced)

---

## Session

**File:** `src/models/Session.ts`

**Sub-document: `ISessionItem`**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `contentType` | `String` | Yes | Enum: `mcq`, `game` (from `CONTENT_TYPES`) |
| `contentId` | `Mixed` | Yes | ObjectId or string |
| `gameType` | `String` | No | — |

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `code` | `String` | Yes | — | `unique`, `uppercase`, `minlength: 6`, `maxlength: 6` (from `SESSION_CODE_LENGTH`) |
| `title` | `String` | Yes | — | — |
| `type` | `String` | Yes | — | Enum: `quiz`, `game`, `mixed` (from `SESSION_TYPES`) |
| `items` | `[SessionItem]` | Yes | — | `min: 1` |
| `isActive` | `Boolean` | No | `true` | — |
| `createdBy` | `String` | No | `"teacher"` (from `DEFAULT_SESSION_CREATOR`) | — |
| `subject` | `String` | No | — | Subject slug; defaults to `"cpp"` at access time (from `DEFAULT_SUBJECT_SLUG`) |
| `section` | `String` | No | — | — |
| `maxAttempts` | `Number` | No | — | — |
| `timeLimit` | `Number` | No | — | — |
| `createdAt` | `Date` | — | — | Auto via `timestamps: true` |
| `updatedAt` | `Date` | — | — | Auto via `timestamps: true` |

**Indexes:**

- `{ isActive: 1 }`
- `{ createdAt: -1 }`

**Relationships:** None (content references are polymorphic via `contentType`/`contentId`)

---

## SessionResult

**File:** `src/models/SessionResult.ts`

**Sub-document: `ISessionResultItem`**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `contentId` | `String` | Yes | — |
| `contentType` | `String` | Yes | Enum: `mcq`, `game` |
| `selected` | `Number` | No | — |
| `isCorrect` | `Boolean` | No | — |
| `score` | `Number` | No | — |

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `sessionId` | `ObjectId` | Yes | — | Ref: `Session` |
| `studentCode` | `String` | Yes | — | — |
| `name` | `String` | No | — | — |
| `answers` | `[SessionResultItem]` | Yes | — | — |
| `totalScore` | `Number` | Yes | — | — |
| `totalPossible` | `Number` | Yes | — | — |
| `percentage` | `Number` | Yes | — | — |
| `timeTaken` | `Number` | No | — | — |
| `completedAt` | `Date` | No | `Date.now` | — |

**Indexes:**

- `{ sessionId: 1 }`
- `{ studentCode: 1 }`
- `{ sessionId: 1, studentCode: 1 }` (compound)

**Relationships:**

- `sessionId` → `Session` (referenced)

---

## Subject

**File:** `src/models/Subject.ts`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | `String` | Yes | — | — |
| `slug` | `String` | Yes | — | `unique` |
| `description` | `String` | Yes | — | — |
| `icon` | `String` | No | `"BookOpen"` | — |
| `topics` | `[{ name: String, slug: String }]` | Yes | — | Both `name` and `slug` required per entry |
| `createdAt` | `Date` | No | `Date.now` | — |

**Indexes:** None

**Relationships:** None

---

## TeachingPlan

**File:** `src/models/TeachingPlan.ts`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `title` | `String` | Yes | — | — |
| `description` | `String` | No | — | — |
| `targetDate` | `Date` | No | — | — |
| `topics` | `[String]` | No | `[]` | — |
| `status` | `String` | No | `"todo"` | Enum: `todo`, `in_progress`, `done`, `skipped` |
| `priority` | `String` | No | `"medium"` | Enum: `low`, `medium`, `high` |
| `notes` | `String` | No | — | — |
| `createdAt` | `Date` | — | — | Auto via `timestamps: true` |
| `updatedAt` | `Date` | — | — | Auto via `timestamps: true` |

**Indexes:**

- `{ status: 1 }`
- `{ targetDate: 1 }`
- `{ priority: 1 }`

**Relationships:** None

---

## Relationship Diagram (Textual)

```
Subject ──────< MCQ          (MCQ.subject → Subject)
Subject ──────< Resource      (Resource.subject → Subject)
Class   ──────< ClassEntry    (ClassEntry.classId → Class)
Session ──────< SessionResult (SessionResult.sessionId → Session)
MCQ     ──────< QuizAttempt   (QuizAttempt.questions[].questionId → MCQ)
```

**Polymorphic references (not FK):**
- `Session.items[].contentId` — references either `MCQ` or game config by `contentType`
- `SessionResult.answers[].contentId` — references content by `contentType`
- `AuditLog.sessionCode` — links to `Session.code` by value (not ObjectId ref)
- `ClassEntry.sessionCode` — links to `Session.code` by value (not ObjectId ref)
- `QuizAttempt.sessionId` — links to `Session.code` by string value (not ObjectId ref)
