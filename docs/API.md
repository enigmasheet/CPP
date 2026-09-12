# API Reference

> Status: Current
> Source of truth: Source code (`src/app/api/`)

## Authentication

All admin endpoints require the `admin-token` HttpOnly cookie.
Public endpoints have no auth requirement.

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST `/api/admin/auth` | 5 req | 60s per IP |
| POST `/api/sessions/[code]/join` | 10 req | 60s per IP |
| POST `/api/sessions/[code]/submit` | 10 req | 60s per IP |

---

## Endpoints

### Authentication

#### POST `/api/admin/auth`

Authenticate as admin and set the `admin-token` cookie.

- **Auth:** None
- **Rate Limit:** 5 req / 60s per IP
- **Request Body:**
  ```json
  { "password": "string (required)" }
  ```
- **Response (200):**
  ```json
  { "success": true }
  ```
- **Errors:**
  - `401` — Invalid password
  - `429` — Too many login attempts
  - `500` — Admin password not configured
- **Important:** Uses timing-safe comparison. The cookie is set as HttpOnly, Secure (in production), SameSite=Lax.

#### GET `/api/admin/verify`

Check whether the current request is authenticated as admin.

- **Auth:** None (checks for cookie, returns status without rejecting)
- **Response (200):**
  ```json
  { "authenticated": true }
  ```
  or
  ```json
  { "authenticated": false }
  ```

#### POST `/api/admin/logout`

Clear the admin token cookie.

- **Auth:** None
- **Response (200):**
  ```json
  { "success": true }
  ```
- **Important:** Sets the cookie with `maxAge: 0` to clear it.

---

### Subjects

#### GET `/api/subjects`

List all subjects.

- **Auth:** None
- **Response (200):** Array of subject objects (raw MongoDB documents).

---

### MCQs

#### GET `/api/mcq`

List MCQs with optional filters.

- **Auth:** None
- **Query Params:**
  | Param | Type | Description |
  |-------|------|-------------|
  | `topic` | string | Filter by topic |
  | `difficulty` | string | `easy`, `medium`, or `hard` |
  | `subject` | string | Filter by subject ID |
  | `limit` | number | Max results (default: 50, max: defined by `MAX_MCQ_QUERY_LIMIT`) |
- **Response (200):** Array of MCQ documents.

#### POST `/api/mcq`

Create a single MCQ.

- **Auth:** Admin
- **Request Body:**
  ```json
  {
    "subject": "string (required)",
    "topic": "string (required)",
    "question": "string (required)",
    "codeSnippet": "string (optional)",
    "options": [
      { "text": "string (required)", "isCorrect": "boolean (required)" }
    ],
    "explanation": "string (required)",
    "difficulty": "easy | medium | hard",
    "tags": ["string"] (optional)
  }
  ```
  - `options` must have at least 2 items.
- **Response (201):** Created MCQ document.
- **Errors:** `400` — Validation failed.

#### GET `/api/mcq/[id]`

Get a single MCQ by ID.

- **Auth:** None
- **Response (200):** MCQ document.
- **Errors:** `404` — MCQ not found.

#### PATCH `/api/mcq/[id]`

Update an MCQ. All fields optional.

- **Auth:** Admin
- **Request Body:** Same as POST but all fields optional.
- **Response (200):** Updated MCQ document.
- **Errors:** `400` — Validation failed, `404` — MCQ not found.

#### DELETE `/api/mcq/[id]`

Delete an MCQ by ID.

- **Auth:** Admin
- **Response (200):** `{ "success": true }`
- **Errors:** `404` — MCQ not found.

#### POST `/api/mcq/batch`

Fetch multiple MCQs by their IDs.

- **Auth:** None
- **Request Body:**
  ```json
  { "ids": ["string", "string"] }
  ```
  - `ids` must be a non-empty array.
- **Response (200):** Array of MCQ documents matching the provided IDs.
- **Errors:** `400` — `ids` array is required.

#### POST `/api/mcq/import`

Bulk import MCQs. Each item is individually validated; if any fail, the entire batch is rejected.

- **Auth:** Admin
- **Request Body:**
  ```json
  {
    "mcqs": [
      {
        "subject": "string (required)",
        "topic": "string (required)",
        "question": "string (required)",
        "codeSnippet": "string (optional)",
        "options": [
          { "text": "string (required)", "isCorrect": "boolean (required)" }
        ],
        "explanation": "string (required)",
        "difficulty": "easy | medium | hard",
        "tags": ["string"] (optional)
      }
    ]
  }
  ```
- **Response (201):** `{ "imported": number }`
- **Errors:** `400` — No MCQs provided or validation failed (with per-item error details).

---

### Resources

#### GET `/api/resources`

List resources with optional filters.

- **Auth:** Admin
- **Query Params:**
  | Param | Type | Description |
  |-------|------|-------------|
  | `topic` | string | Filter by topic |
  | `type` | string | `code`, `diagram`, or `document` |
  | `difficulty` | string | `beginner`, `intermediate`, or `advanced` |
- **Response (200):** Array of resource documents.

#### POST `/api/resources`

Create a single resource.

- **Auth:** Admin
- **Request Body:**
  ```json
  {
    "subject": "string (required)",
    "topic": "string (required)",
    "title": "string (required)",
    "type": "code | diagram | document",
    "content": "string (required)",
    "language": "string (optional)",
    "difficulty": "beginner | intermediate | advanced"
  }
  ```
- **Response (201):** Created resource document.
- **Errors:** `400` — Validation failed.

#### POST `/api/resources/import`

Bulk import resources. Each item is individually validated; if any fail, the entire batch is rejected.

- **Auth:** Admin
- **Request Body:**
  ```json
  {
    "resources": [
      {
        "subject": "string (required)",
        "topic": "string (required)",
        "title": "string (required)",
        "type": "code | diagram | document",
        "content": "string (required)",
        "language": "string (optional)",
        "difficulty": "beginner | intermediate | advanced"
      }
    ]
  }
  ```
- **Response (201):** `{ "imported": number }`
- **Errors:** `400` — No resources provided or validation failed (with per-item error details).

---

### Sessions

#### GET `/api/sessions`

List all sessions with submission stats.

- **Auth:** Admin
- **Response (200):** Array of session objects, each augmented with:
  - `submissions` (number) — count of results
  - `avgScore` (number | null) — average score across submissions

#### POST `/api/sessions`

Create a new session with a unique 6-character code. Also auto-creates an audit log entry with status `"planned"`.

- **Auth:** Admin
- **Request Body:**
  ```json
  {
    "title": "string (required)",
    "type": "quiz | game | mixed",
    "items": [
      {
        "contentType": "mcq | game",
        "contentId": "string (required)",
        "gameType": "string (optional, required if contentType is 'game')"
      }
    ],
    "section": "string (optional)",
    "subject": "string (optional, subject slug, defaults to 'cpp')",
    "maxAttempts": "number (optional)",
    "timeLimit": "number (optional, in seconds)"
  }
  ```
  - `items` must have at least 1 entry.
- **Response (201):** Created session document (includes generated `code`).
- **Errors:** `400` — Title, type, and at least one item are required.
- **Important:** The session code is generated randomly and guaranteed unique. An audit log entry is auto-created with `status: "planned"` and the session's topics extracted from linked MCQs.

#### GET `/api/sessions/[code]`

Get a session by its code.

- **Auth:** None (but if not admin and session is inactive, returns 403)
- **Response (200):** Session document.
- **Errors:**
  - `403` — Session is no longer active (non-admin only)
  - `404` — Session not found

#### PATCH `/api/sessions/[code]`

Update a session (e.g., toggle `isActive`).

- **Auth:** Admin
- **Request Body:**
  ```json
  {
    "title": "string (optional)",
    "isActive": "boolean (optional)",
    "maxAttempts": "number (optional)"
  }
  ```
- **Response (200):** Updated session document.
- **Errors:** `400` — Validation failed, `404` — Session not found.

#### DELETE `/api/sessions/[code]`

Delete a session by code.

- **Auth:** Admin
- **Response (200):** `{ "success": true }`
- **Important:** Does not cascade-delete results.

#### POST `/api/sessions/[code]/join`

Join a session as a student. Returns session items and a generated student code.

- **Auth:** None
- **Rate Limit:** 10 req / 60s per IP
- **Request Body:**
  ```json
  {
    "name": "string (optional, max 50 chars)"
  }
  ```
- **Response (200):**
  ```json
  {
    "studentCode": "string (6-char code)",
    "name": "string | undefined",
    "sessionTitle": "string",
    "sessionType": "quiz | game | mixed",
    "items": [
      {
        "contentType": "mcq | game",
        "contentId": "string",
        "gameType": "string | undefined"
      }
    ]
  }
  ```
- **Errors:**
  - `403` — Session is no longer active
  - `404` — Session not found
  - `429` — Too many join attempts
- **Important:** The `studentCode` is a 6-character random string from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (ambiguous characters excluded). Name is optional; students can join anonymously.

#### GET `/api/sessions/[code]/leaderboard`

Get the leaderboard for a session, ranked by percentage (descending), then completion timestamp (ascending).

- **Auth:** None
- **Response (200):** Array of leaderboard entries:
  ```json
  [
    {
      "rank": 1,
      "name": "string | null",
      "studentCode": "string",
      "percentage": "number",
      "totalScore": "number",
      "totalPossible": "number"
    }
  ]
  ```
- **Errors:** `404` — Session not found.

#### GET `/api/sessions/[code]/results`

Get full results and analytics for a session (admin only).

- **Auth:** Admin
- **Response (200):**
  ```json
  {
    "session": {
      "code": "string",
      "title": "string",
      "type": "string",
      "isActive": "boolean",
      "section": "string | null",
      "items": "array",
      "timeLimit": "number | null",
      "createdAt": "string"
    },
    "results": [
      {
        "studentCode": "string",
        "name": "string | null",
        "totalScore": "number",
        "totalPossible": "number",
        "percentage": "number",
        "timeTaken": "number | null",
        "completedAt": "string"
      }
    ],
    "stats": {
      "totalStudents": "number",
      "averagePercentage": "number",
      "highestPercentage": "number",
      "lowestPercentage": "number"
    },
    "questionAnalytics": {
      "contentId": {
        "totalAttempts": "number",
        "correctCount": "number"
      }
    }
  }
  ```
- **Errors:** `404` — Session not found.
- **Important:** `questionAnalytics` is a map keyed by `contentId` with per-question attempt/correct counts.

#### POST `/api/sessions/[code]/submit`

Submit answers for a session. One submission per student code per session.

- **Auth:** None
- **Rate Limit:** 10 req / 60s per IP
- **Request Body:**
  ```json
  {
    "studentCode": "string (required)",
    "name": "string (optional, max 50 chars)",
    "answers": [
      {
        "contentId": "string (required)",
        "contentType": "mcq | game",
        "selected": "number (optional, index for MCQ)",
        "score": "number (optional, 0-100 for games)",
        "totalQuestions": "number (optional, for games)"
      }
    ],
    "timeTaken": "number (optional, in seconds)"
  }
  ```
  - `answers` must have at least 1 entry.
- **Response (200):**
  ```json
  {
    "resultId": "string",
    "totalScore": "number",
    "totalPossible": "number",
    "percentage": "number"
  }
  ```
- **Errors:**
  - `400` — Validation failed
  - `403` — Session is no longer active
  - `404` — Session not found
  - `409` — Already submitted (duplicate student code)
  - `429` — Too many submit attempts
- **Important:**
  - Duplicate submissions for the same `studentCode` + session are rejected with `409`.
  - After grading, the session stats and audit log are automatically updated.

---

### Quiz

#### POST `/api/quiz/start`

Start a practice quiz (standalone, not tied to a session). Returns shuffled MCQs with correct answers included (by design — this is a learning tool, not a secure exam).

- **Auth:** None
- **Request Body:**
  ```json
  {
    "topic": "string (optional)",
    "difficulty": "string (optional)",
    "limit": "number (default: 10, max: 50)"
  }
  ```
- **Response (200):**
  ```json
  {
    "questions": [
      {
        "id": "string",
        "question": "string",
        "codeSnippet": "string | undefined",
        "options": ["string"],
        "difficulty": "string",
        "topic": "string",
        "correctAnswer": "number (index)",
        "explanation": "string"
      }
    ],
    "total": "number"
  }
  ```
- **Errors:** `500` — Failed to start quiz.
- **Important:** `correctAnswer` is the index of the correct option. This is intentional — the quiz is a learning tool.

#### POST `/api/quiz/submit`

Submit a practice quiz attempt and get the score.

- **Auth:** None
- **Request Body:**
  ```json
  {
    "sessionId": "string (required)",
    "subject": "string (optional, defaults to 'unknown')",
    "topic": "string (optional, defaults to 'general')",
    "answers": [
      {
        "questionId": "string (required)",
        "selected": "number (required, index of chosen option)"
      }
    ],
    "timeTaken": "number (optional, in seconds)"
  }
  ```
  - `answers` must have at least 1 entry.
- **Response (200):**
  ```json
  {
    "attemptId": "string",
    "score": "number",
    "totalQuestions": "number",
    "percentage": "number (0-100)",
    "timeTaken": "number | undefined"
  }
  ```
- **Errors:** `400` — Invalid request (missing sessionId or answers).
- **Important:** Percentage is calculated as `Math.round((score / totalQuestions) * 100)`.

---

### Audit Log

#### GET `/api/audit`

List all audit log entries, sorted by date descending.

- **Auth:** Admin
- **Response (200):** Array of audit log documents.

#### POST `/api/audit`

Create an audit log entry.

- **Auth:** Admin
- **Request Body:**
  ```json
  {
    "date": "string (ISO datetime, optional, defaults to now)",
    "sessionCode": "string (optional)",
    "section": "string (optional)",
    "topicsCovered": ["string"] (optional, max 10 items),
    "mcqsUsed": "number (optional, >= 0)",
    "studentCount": "number (optional, >= 0)",
    "averageScore": "number (optional, 0-100)",
    "highestScore": "number (optional, 0-100)",
    "lowestScore": "number (optional, 0-100)",
    "duration": "number (optional, positive, max minutes)",
    "notes": "string (optional)",
    "status": "planned | completed | skipped (optional, defaults to 'completed')"
  }
  ```
- **Response (201):** Created audit log document.
- **Errors:** `400` — Validation failed.

#### PATCH `/api/audit/[id]`

Update an audit log entry. All fields optional.

- **Auth:** Admin
- **Request Body:** Same as POST but all fields optional.
- **Response (200):** Updated audit log document.
- **Errors:** `400` — Validation failed, `404` — Log not found.

#### DELETE `/api/audit/[id]`

Delete an audit log entry.

- **Auth:** Admin
- **Response (200):** `{ "success": true }`
- **Errors:** `404` — Log not found.

---

### Teaching Plans

#### GET `/api/plans`

List all teaching plans, sorted by creation date descending.

- **Auth:** Admin
- **Response (200):** Array of teaching plan documents.

#### POST `/api/plans`

Create a teaching plan.

- **Auth:** Admin
- **Request Body:**
  ```json
  {
    "title": "string (required)",
    "description": "string (optional)",
    "targetDate": "string (ISO datetime, optional)",
    "topics": ["string"] (optional),
    "status": "todo | in_progress | done | skipped (optional, defaults to 'todo')",
    "priority": "low | medium | high (optional, defaults to 'medium')",
    "notes": "string (optional)"
  }
  ```
- **Response (201):** Created teaching plan document.
- **Errors:** `400` — Validation failed.

#### PATCH `/api/plans/[id]`

Update a teaching plan. All fields optional.

- **Auth:** Admin
- **Request Body:** Same as POST but all fields optional.
- **Response (200):** Updated teaching plan document.
- **Errors:** `400` — Validation failed, `404` — Plan not found.

#### DELETE `/api/plans/[id]`

Delete a teaching plan.

- **Auth:** Admin
- **Response (200):** `{ "success": true }`
- **Errors:** `404` — Plan not found.

---

### Classes

#### GET `/api/classes`

List all classes, sorted by creation date descending.

- **Auth:** Admin
- **Response (200):** Array of class documents.

#### POST `/api/classes`

Create a class.

- **Auth:** Admin
- **Request Body:**
  ```json
  {
    "name": "string (required)",
    "subject": "string (required)",
    "description": "string (optional)",
    "semester": "string (optional)"
  }
  ```
- **Response (201):** Created class document.
- **Errors:** `400` — Validation failed.

#### GET `/api/classes/[id]`

Get a class by ID.

- **Auth:** Admin
- **Response (200):** Class document.
- **Errors:** `400` — Missing id, `404` — Class not found.

#### PATCH `/api/classes/[id]`

Update a class. All fields optional.

- **Auth:** Admin
- **Request Body:** Same as POST but all fields optional.
- **Response (200):** Updated class document.
- **Errors:** `400` — Validation failed / Missing id, `404` — Class not found.

#### DELETE `/api/classes/[id]`

Delete a class and all its entries (cascade).

- **Auth:** Admin
- **Response (200):** `{ "success": true }`
- **Errors:** `400` — Missing id, `404` — Class not found.
- **Important:** Also deletes all `ClassEntry` documents with the matching `classId`.

#### GET `/api/classes/[id]/entries`

List all entries for a class, sorted by date descending.

- **Auth:** Admin
- **Response (200):** Array of class entry documents.
- **Errors:** `400` — Missing id, `404` — Class not found.

#### POST `/api/classes/[id]/entries`

Add an entry to a class.

- **Auth:** Admin
- **Request Body:**
  ```json
  {
    "date": "string (required)",
    "topics": ["string"] (required, at least 1),
    "sessionCode": "string (optional)",
    "duration": "number (optional, positive)",
    "notes": "string (optional)"
  }
  ```
- **Response (201):** Created class entry document (includes `classId` from URL param).
- **Errors:** `400` — Validation failed / Missing id, `404` — Class not found.

#### PATCH `/api/classes/[id]/entries/[entryId]`

Update a class entry. All fields optional.

- **Auth:** Admin
- **Request Body:** Same as POST but all fields optional.
- **Response (200):** Updated class entry document.
- **Errors:** `400` — Validation failed / Missing entryId, `404` — Entry not found.

#### DELETE `/api/classes/[id]/entries/[entryId]`

Delete a class entry.

- **Auth:** Admin
- **Response (200):** `{ "success": true }`
- **Errors:** `400` — Missing entryId, `404` — Entry not found.

---

### Search

#### GET `/api/search`

Full-text search across topics (teacher notes), MCQs, and resources.

- **Auth:** None
- **Query Params:**
  | Param | Type | Description |
  |-------|------|-------------|
  | `q` | string | Search query (minimum 2 characters) |
- **Response (200):**
  ```json
  {
    "topics": [
      {
        "id": "topic-{id}",
        "title": "string",
        "type": "topic",
        "url": "/subjects/cpp/learn/{topic}",
        "snippet": "string (max 100 chars)"
      }
    ],
    "questions": [
      {
        "id": "mcq-{mongoId}",
        "title": "string (max 80 chars)",
        "type": "question",
        "url": "/subjects/{subjectSlug}/mcq/{topic}",
        "snippet": "string (max 100 chars, options joined by ' | ')"
      }
    ],
    "resources": [
      {
        "id": "resource-{mongoId}",
        "title": "string",
        "type": "resource",
        "url": "/subjects/{subjectSlug}/resources",
        "snippet": "string (max 100 chars)"
      }
    ]
  }
  ```
- **Important:**
  - Returns empty arrays for all categories if query is less than 2 characters.
  - Regex special characters are escaped to prevent ReDoS.
  - Each category is capped at 5 results.
  - Topics are filtered to non-`teacherOnly` notes.
  - Subject slugs default to `"cpp"` if not populated.

---

### Games

#### GET `/api/games/[gameType]`

Fetch questions for a specific game type and subject from the content registry.

- **Auth:** None
- **Params:**
  | Param | Type | Description |
  |-------|------|-------------|
  | `gameType` | string | Game type key (must match a known game type) |
- **Query Params:**
  | Param | Type | Default | Description |
  |-------|------|---------|-------------|
  | `subject` | string | `"cpp"` | Subject slug to fetch game content for |
- **Response (200):** Array of game questions for the given type and subject.
- **Errors:**
  - `404` — Invalid game type or no content for the given subject
  - `500` — Failed to load game
