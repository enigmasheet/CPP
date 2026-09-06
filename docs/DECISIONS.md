# Architectural Decisions

> Status: Current
> Source of truth: Repository implementation

## Decision: Admin Cookie Uses Base64-Encoded Password

### Context
Need a simple auth mechanism for a single-teacher tool.
### Decision
Store base64-encoded ADMIN_PASSWORD in an HttpOnly cookie.
### Reason
Simplicity. No JWT/session infrastructure needed for a single-user admin system.
### Consequences
- No token rotation or expiration management
- Cookie is not a security token — it's a password mirror
### Do Not Change Without Considering
- This is intentional — do NOT replace with JWT or encryption

## Decision: Quiz Start Endpoint Returns Correct Answer

### Context
Quiz endpoint returns correctAnswer index and explanation to the client.
### Decision
Include correctAnswer in quiz start response.
### Reason
This is a learning tool, not a secure exam system. Students can see answers via DevTools — this is by design.
### Consequences
- Students can cheat if they want to — acceptable for learning
### Do Not Change Without Considering
- Removing correctAnswer would break the learning flow

## Decision: No Persistent Student Accounts

### Context
Students interact with the system during class sessions.
### Decision
No Student model, no login, no cross-device sync. Students identified by ephemeral random codes per session.
### Reason
Teacher-centric tool. Students are not expected to track progress across devices.
### Consequences
- No cross-device progress
- No historical student data beyond localStorage
### Do Not Change Without Considering
- Adding student accounts would fundamentally change the architecture

## Decision: localStorage for Student State

### Context
Need to track student progress and quiz results.
### Decision
Store in localStorage only. No server-side student state.
### Reason
No student accounts means no server-side state ownership. localStorage is sufficient for transient in-class state.
### Consequences
- Data lost on browser clear
- No cross-device sync
### Do Not Change Without Considering
- Adding server-side student state requires student accounts first

## Decision: Multi-Subject via Static Config + Dynamic DB

### Context
Need to support multiple subjects (cpp, oop).
### Decision
Subject metadata in src/config/subjects.ts (static), MCQs/Resources in MongoDB (dynamic with subject ObjectId ref).
### Reason
Subject structure is stable (rarely changes), MCQs/Resources grow over time.
### Consequences
- Adding a new subject requires updating subjects.ts and running seed script
- Subject topics are hardcoded, not from DB
### Do Not Change Without Considering
- Moving subjects entirely to DB would break static generation

## Decision: Static Pages for Learn Content

### Context
Learn pages show teacher notes for topics.
### Decision
Use generateStaticParams for /subjects/[subject], /subjects/[subject]/learn, /subjects/[subject]/learn/[topic]. Notes are static from teacherNotes.ts.
### Reason
Note content changes rarely (between semesters). Static generation gives fast load times.
### Consequences
- Adding new notes requires rebuild
- OOP notes are placeholder (all 0 counts)
### Do Not Change Without Considering
- Switching to dynamic rendering would lose CDN caching benefits

## Decision: Base UI (Not Radix)

### Context
Need accessible UI primitives.
### Decision
Use @base-ui/react (v1.7.0) as the unstyled component library.
### Reason
Chosen during initial setup. shadcn/ui configured with Base UI primitives.
### Consequences
- Data attributes use data-open/data-closed, not data-state
- Must use Base UI patterns, not Radix patterns
### Do Not Change Without Considering
- Switching to Radix would require updating all data attribute references
