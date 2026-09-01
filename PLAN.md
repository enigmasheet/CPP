# C++ Master - Interactive Learning Platform

## Overview
A session-based interactive C++ learning platform for bachelor students. Teachers create sessions with selected MCQs and games, generate QR codes or shareable links, and students join via 6-character codes. Designed to increase teaching efficiency and provide maintainable exercise delivery.

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | **16.3.4** (App Router, React 19) |
| UI | Tailwind CSS v4 + shadcn/ui (Base UI) | Latest |
| Database | MongoDB + Mongoose | **9.9.4** |
| Code Highlighting | Shiki | Latest |
| Code Editor | Monaco Editor | 0.54+ |
| CSV Parsing | PapaParse | Latest |
| QR Code | qrcode | Latest |
| Icons | Lucide React | Latest |
| Notifications | Sonner | Latest |

---

## Core Concept: Session-Based Learning

### Teacher Flow
1. Login at `/admin` with admin password
2. Click "New Session"
3. Enter session title (e.g. "Week 3 - OOP Quiz")
4. Select specific MCQs from the database (filter by topic)
5. Optionally select games to include
6. Submit - gets a 6-character join code (e.g. `X7K2M9`)
7. Show QR code on projector or share link
8. Toggle session active/closed as needed
9. View student results in real-time

### Student Flow
1. Get QR code or link from teacher
2. Go to `/join` or scan QR
3. Enter 6-character code
4. Enter name (optional)
5. Complete the assigned exercises
6. See final score at end

---

## Features

### MCQ Quiz System
- 50+ questions across 10 C++ topics
- Code snippets with syntax highlighting
- Immediate feedback with explanations
- Score calculation and time tracking
- Difficulty levels: Easy, Medium, Hard

### Session Management
- Teacher creates sessions with selected content
- 6-character alphanumeric join codes (excludes confusing chars: 0, O, 1, I)
- QR code generation for easy sharing
- Toggle sessions active/closed
- Per-session student results with statistics

### Resource Library
- Code examples with Shiki syntax highlighting
- Markdown rendering with ReactMarkdown
- Filter by topic and difficulty

### Admin Dashboard
- Password-protected (env variable + HttpOnly cookie)
- Session creation with MCQ/game picker
- Session management (view, toggle, delete)
- Real-time results dashboard with stats
- Bulk CSV/JSON import for MCQs and resources

---

## Database Schema

### Subject
```typescript
{
  name: String,
  slug: String (unique),
  description: String,
  topics: [{ name: String, slug: String }],
  createdAt: Date
}
```

### MCQ
```typescript
{
  subject: ObjectId (ref: Subject),
  topic: String,
  question: String,
  codeSnippet: String (optional),
  options: [{ text: String, isCorrect: Boolean }],
  explanation: String,
  difficulty: "easy" | "medium" | "hard",
  tags: [String],
  createdAt: Date
}
```

### Resource
```typescript
{
  subject: ObjectId (ref: Subject),
  topic: String,
  title: String,
  type: "code" | "diagram" | "document",
  content: String (Markdown),
  language: String,
  difficulty: "beginner" | "intermediate" | "advanced",
  createdAt: Date
}
```

### Session
```typescript
{
  code: String (unique, 6-char uppercase),
  title: String,
  type: "quiz" | "game" | "mixed",
  items: [{
    contentType: "mcq" | "game",
    contentId: ObjectId | String,
    gameType: String (optional)
  }],
  isActive: Boolean,
  createdBy: String,
  maxAttempts: Number (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### SessionResult
```typescript
{
  sessionId: ObjectId (ref: Session),
  studentCode: String (anonymous identifier),
  name: String (optional),
  answers: [{
    contentId: String,
    contentType: "mcq" | "game",
    selected: Number (for MCQ),
    isCorrect: Boolean (for MCQ),
    score: Number (for games)
  }],
  totalScore: Number,
  totalPossible: Number,
  percentage: Number,
  completedAt: Date
}
```

### QuizAttempt
```typescript
{
  sessionId: String,
  subject: String,
  topic: String,
  questions: [{
    questionId: ObjectId,
    selected: Number,
    isCorrect: Boolean
  }],
  score: Number,
  totalQuestions: Number,
  timeTaken: Number,
  completedAt: Date
}
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                        # Landing page
│   ├── layout.tsx                      # Root layout with Sonner
│   ├── globals.css                     # Tailwind + shadcn theme
│   ├── loading.tsx                     # Global loading state
│   ├── error.tsx                       # Global error boundary
│   ├── not-found.tsx                   # 404 page
│   ├── join/
│   │   └── page.tsx                    # Student code entry
│   ├── s/
│   │   └── [code]/
│   │       └── page.tsx                # Student session view
│   ├── admin/
│   │   ├── page.tsx                    # Teacher login + dashboard
│   │   └── sessions/
│   │       └── [code]/
│   │           └── page.tsx            # Session detail + QR + results
│   ├── subjects/
│   │   └── cpp/
│   │       ├── page.tsx                # C++ subject overview
│   │       └── mcq/
│   │           ├── page.tsx            # MCQ topic selection
│   │           └── [topic]/
│   │               └── page.tsx        # Quiz player
│   └── api/
│       ├── admin/
│       │   ├── auth/route.ts           # Admin login
│       │   └── verify/route.ts         # Verify admin session
│       ├── sessions/
│       │   ├── route.ts                # GET/POST sessions
│       │   └── [code]/
│       │       ├── route.ts            # GET/PATCH/DELETE session
│       │       ├── join/route.ts       # Student joins session
│       │       ├── submit/route.ts     # Student submits answers
│       │       └── results/route.ts    # Teacher views results
│       ├── mcq/
│       │   ├── route.ts                # GET/POST MCQs
│       │   └── import/route.ts         # Bulk import MCQs
│       ├── resources/
│       │   ├── route.ts                # GET/POST resources
│       │   └── import/route.ts         # Bulk import resources
│       ├── quiz/
│       │   ├── start/route.ts          # Start quiz
│       │   └── submit/route.ts         # Submit quiz answers
│       └── subjects/route.ts           # List subjects
├── components/
│   ├── ui/                             # shadcn components (14)
│   ├── layout/
│   │   ├── AppShell.tsx                # Navbar + Footer wrapper
│   │   ├── Navbar.tsx                  # Responsive nav with mobile sheet
│   │   ├── Footer.tsx                  # Site footer
│   │   └── PageHeader.tsx              # Reusable page header
│   ├── shared/
│   │   ├── QRCode.tsx                  # QR code generator
│   │   └── LoadingSpinner.tsx          # Loading spinner
│   ├── content/
│   │   ├── CodeBlock.tsx               # Shiki syntax highlighting
│   │   └── MarkdownRenderer.tsx        # ReactMarkdown renderer
│   └── admin/
│       └── CSVUploader.tsx             # CSV drag-and-drop uploader
├── lib/
│   ├── db.ts                           # MongoDB connection singleton
│   ├── auth.ts                         # Admin auth (cookie-based)
│   ├── session-code.ts                 # 6-char code generator
│   ├── shiki.ts                        # Code highlighting
│   └── utils.ts                        # cn() + shuffleArray()
├── models/
│   ├── Subject.ts                      # Subject schema
│   ├── MCQ.ts                          # MCQ schema
│   ├── Resource.ts                     # Resource schema
│   ├── Session.ts                      # Session schema
│   ├── SessionResult.ts                # Session result schema
│   └── QuizAttempt.ts                  # Quiz attempt schema
└── seed/
    ├── subjects.json                   # Subject data
    ├── mcqs.json                       # 43 MCQs across 10 topics
    ├── seed.ts                         # Database seeding script
    └── games/                          # Game data (JSON)
        ├── output-predictor.json
        ├── bug-hunter.json
        ├── code-golf.json
        ├── speed-code.json
        ├── memory-match.json
        └── syntax-scramble.json
```

---

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/admin/auth` | No | Admin login |
| GET | `/api/admin/verify` | No | Verify admin session |
| GET | `/api/sessions` | Admin | List all sessions |
| POST | `/api/sessions` | Admin | Create new session |
| GET | `/api/sessions/[code]` | Public* | Get session details |
| PATCH | `/api/sessions/[code]` | Admin | Update session |
| DELETE | `/api/sessions/[code]` | Admin | Delete session |
| POST | `/api/sessions/[code]/join` | Public | Student joins session |
| POST | `/api/sessions/[code]/submit` | Public | Student submits answers |
| GET | `/api/sessions/[code]/results` | Admin | View session results |
| GET | `/api/mcq` | Public | Get MCQs |
| POST | `/api/mcq` | Admin | Create MCQ |
| POST | `/api/mcq/import` | Admin | Bulk import MCQs |
| GET | `/api/resources` | Public | Get resources |
| POST | `/api/resources` | Admin | Create resource |
| POST | `/api/resources/import` | Admin | Bulk import resources |
| POST | `/api/quiz/start` | Public | Start quiz |
| POST | `/api/quiz/submit` | Public | Submit quiz answers |
| GET | `/api/subjects` | Public | List subjects |

*Public but checks isActive status for non-admins

---

## Pages

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Landing page with feature cards |
| `/join` | Static | Student code entry page |
| `/s/[code]` | Dynamic | Student session view |
| `/admin` | Static | Teacher login + dashboard |
| `/admin/sessions/[code]` | Dynamic | Session detail + QR + results |
| `/subjects/cpp` | Static | C++ subject overview |
| `/subjects/cpp/mcq` | Static | MCQ topic selection |
| `/subjects/cpp/mcq/[topic]` | Dynamic | Quiz player |

---

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/cpp-cms
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## C++ Topics Covered

| # | Topic | Questions |
|---|-------|-----------|
| 1 | Basics | 8 |
| 2 | Control Flow | 6 |
| 3 | Functions | 6 |
| 4 | OOP | 8 |
| 5 | Pointers | 6 |
| 6 | References | 4 |
| 7 | STL | 6 |
| 8 | Memory Management | 6 |
| 9 | Templates | 4 |
| 10 | Modern C++ | 6 |

---

## Deployment (Vercel)

### Prerequisites
- MongoDB Atlas cluster (or local MongoDB for development)
- Vercel account connected to GitHub

### Steps
1. Push code to GitHub repository
2. Import repository in Vercel dashboard
3. Set environment variables:
   - `MONGODB_URI` - MongoDB connection string
   - `ADMIN_PASSWORD` - Teacher login password
4. Deploy

### Notes
- Next.js 16 with Turbopack for fast builds
- All API routes are serverless functions
- Static pages are pre-rendered at build time
- Dynamic pages are server-rendered on demand

---

## Implementation Status

| Phase | Status |
|-------|--------|
| Phase 1: Setup + Models | Completed |
| Phase 2: MCQ System | Completed |
| Phase 3: Session System | Completed |
| Phase 4: Admin Dashboard | Completed |
| Phase 5: Student Flow | Completed |
| Phase 6: QR Code + Join | Completed |
| Phase 7: Results Dashboard | Completed |
| Phase 8: Polish + Deploy | In Progress |

---

**Status:** Ready for deployment
**Last Updated:** 2026-09-01
