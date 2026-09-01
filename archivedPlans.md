# C++ Content Management System - Complete Project Plan

## Overview
A Next.js 16-based CMS for C++ teaching at bachelor's level with interactive MCQ quizzes, code resources, 6 educational games, gamification system (XP, levels, streaks, achievements), guest scoring with leaderboard, code playground, and password-protected admin panel with bulk import.

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | **16.3.4** (App Router, React 19) |
| UI | Tailwind CSS v4 + shadcn/ui | Latest |
| Database | MongoDB + Mongoose | **9.9.4** |
| Validation | Zod | Latest |
| Code Highlighting | Shiki / Prism.js | Latest |
| Animations | Framer Motion | Latest |
| Code Editor | Monaco Editor | 0.54+ |
| Icons | Lucide React | Latest |

---

## Features

### Guest Mode & Scoring
- UUID-based anonymous sessions (localStorage)
- Server-side score tracking in MongoDB
- Global leaderboard (top 50, filterable by topic/difficulty)
- "My Scores" page showing past quiz attempts

### MCQ Quiz System
- Topic-wise quizzes (Basics, OOP, STL, Pointers, Memory, etc.)
- Code snippets embedded in questions
- Immediate feedback with explanations
- Score calculation and time tracking
- Difficulty levels: Easy, Medium, Hard

### Resource Library
- Code examples with syntax highlighting
- Diagrams/images for concepts
- Filter by topic and difficulty
- Search functionality

### 6 Educational Games
1. **Output Predictor** - Guess C++ code output (+20 XP)
2. **Bug Hunter** - Find and fix code bugs (+30 XP)
3. **Code Golf** - Write shortest solution (+50 XP)
4. **Speed Code** - Complete code under time pressure (+25 XP)
5. **Memory Match** - Match concepts with descriptions (+15 XP)
6. **Syntax Scramble** - Unscramble jumbled code (+20 XP)

### Gamification System
- **XP Points** - Earn for every action
- **Levels** - Progressive unlock system (Novice Coder to Code Legend)
- **Daily Streaks** - Consecutive daily login with multipliers
- **Streak Freeze** - Protect streak (purchasable with coins)
- **20+ Achievements** - Unlock badges across categories
- **Leaderboards** - Global/weekly/topic-wise rankings
- **Daily Challenges** - 5 rotating challenges with bonus rewards
- **Certificates** - Downloadable for topic mastery

### Code Playground
- Monaco Editor with C++ syntax highlighting
- Code execution via Piston/Judge0 API
- Save/share code snippets

### Admin Dashboard (Password Protected)
- MCQ CRUD (Create, Read, Update, Delete)
- Resource CRUD
- Bulk CSV/JSON import with preview
- Simple password auth (env variable, HttpOnly cookie)
- 24-hour session expiry

---

## Database Schema

### Subject
```typescript
{
  name: String,
  slug: String (unique),
  description: String,
  icon: String,
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
  imageUrl: String,
  difficulty: "beginner" | "intermediate" | "advanced",
  createdAt: Date
}
```

### GuestSession
```typescript
{
  sessionId: String (UUID, unique),
  createdAt: Date,
  lastActive: Date
}
```

### QuizAttempt
```typescript
{
  sessionId: String (ref: GuestSession),
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

### UserProgress
```typescript
{
  sessionId: String (unique),
  totalXP: Number,
  level: Number,
  streak: Number,
  lastActive: Date,
  achievements: [String],
  completedTopics: [String],
  coins: Number
}
```

### GameSession
```typescript
{
  sessionId: String,
  gameType: "output-predictor" | "bug-hunter" | "code-golf" | "speed-code" | "memory-match" | "syntax-scramble",
  score: Number,
  xpEarned: Number,
  timeTaken: Number,
  difficulty: String,
  completedAt: Date
}
```

### Achievement
```typescript
{
  sessionId: String,
  achievementId: String,
  unlockedAt: Date
}
```

### DailyChallenge
```typescript
{
  date: Date (unique),
  challenges: [{
    id: String,
    type: String,
    description: String,
    target: Number,
    xpReward: Number,
    coinReward: Number,
    completed: Boolean
  }]
}
```

---

## Project Structure

```
cpp-cms/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css
│   ├── subjects/
│   │   ├── page.tsx                # All subjects
│   │   └── [subject]/
│   │       ├── page.tsx            # Subject overview
│   │       ├── mcq/
│   │       │   ├── page.tsx        # Topic selection
│   │       │   └── [topic]/
│   │       │       └── page.tsx    # Quiz player
│   │       └── resources/
│   │           └── page.tsx        # Resource browser
│   ├── games/
│   │   ├── page.tsx                # Games hub
│   │   ├── output-predictor/
│   │   │   └── page.tsx
│   │   ├── bug-hunter/
│   │   │   └── page.tsx
│   │   ├── code-golf/
│   │   │   └── page.tsx
│   │   ├── speed-code/
│   │   │   └── page.tsx
│   │   ├── memory-match/
│   │   │   └── page.tsx
│   │   └── syntax-scramble/
│   │       └── page.tsx
│   ├── playground/
│   │   └── page.tsx                # Code playground
│   ├── leaderboard/
│   │   └── page.tsx
│   ├── my-scores/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx                # XP, achievements, stats
│   ├── admin/
│   │   ├── page.tsx                # Login page
│   │   ├── layout.tsx              # Auth guard
│   │   ├── mcq/
│   │   │   ├── page.tsx            # MCQ list
│   │   │   ├── new/page.tsx        # Add MCQ
│   │   │   ├── [id]/edit/page.tsx  # Edit MCQ
│   │   │   └── import/page.tsx     # Bulk import
│   │   └── resources/
│   │       ├── page.tsx            # Resource list
│   │       ├── new/page.tsx
│   │       └── import/page.tsx
│   └── api/
│       ├── subjects/route.ts
│       ├── mcq/
│       │   ├── route.ts
│       │   └── import/route.ts
│       ├── resources/
│       │   ├── route.ts
│       │   └── import/route.ts
│       ├── quiz/
│       │   ├── start/route.ts
│       │   └── submit/route.ts
│       ├── games/
│       │   ├── output-predictor/route.ts
│       │   ├── bug-hunter/route.ts
│       │   └── submit/route.ts
│       ├── playground/run/route.ts
│       ├── leaderboard/route.ts
│       ├── my-scores/route.ts
│       ├── progress/route.ts
│       ├── achievements/route.ts
│       └── admin/
│           ├── auth/route.ts
│           └── verify/route.ts
├── components/
│   ├── ui/                         # shadcn components
│   ├── mcq/
│   │   ├── QuizCard.tsx
│   │   ├── QuizPlayer.tsx
│   │   ├── QuestionDisplay.tsx
│   │   ├── OptionSelector.tsx
│   │   └── ResultDisplay.tsx
│   ├── games/
│   │   ├── GameCard.tsx
│   │   ├── OutputPredictor.tsx
│   │   ├── BugHunter.tsx
│   │   ├── CodeGolf.tsx
│   │   ├── SpeedCode.tsx
│   │   ├── MemoryMatch.tsx
│   │   └── SyntaxScramble.tsx
│   ├── gamification/
│   │   ├── XPBar.tsx
│   │   ├── LevelBadge.tsx
│   │   ├── StreakCounter.tsx
│   │   ├── AchievementBadge.tsx
│   │   ├── CoinsDisplay.tsx
│   │   └── DailyChallenges.tsx
│   ├── resources/
│   │   ├── ResourceCard.tsx
│   │   ├── CodeBlock.tsx
│   │   └── DiagramViewer.tsx
│   ├── playground/
│   │   └── CodeEditor.tsx
│   ├── admin/
│   │   ├── MCQForm.tsx
│   │   ├── ResourceForm.tsx
│   │   ├── ImportUploader.tsx
│   │   └── ImportPreview.tsx
│   ├── LeaderboardTable.tsx
│   ├── ScoreHistory.tsx
│   ├── SubjectCard.tsx
│   └── TopicGrid.tsx
├── lib/
│   ├── db.ts                       # MongoDB connection
│   ├── auth.ts                     # Admin auth helpers
│   ├── session.ts                  # Guest session helpers
│   ├── xp.ts                       # XP calculations
│   ├── achievements.ts             # Achievement logic
│   ├── games/
│   │   ├── output-predictor.ts
│   │   ├── bug-hunter.ts
│   │   ├── code-golf.ts
│   │   ├── speed-code.ts
│   │   ├── memory-match.ts
│   │   └── syntax-scramble.ts
│   └── utils.ts
├── models/
│   ├── Subject.ts
│   ├── MCQ.ts
│   ├── Resource.ts
│   ├── GuestSession.ts
│   ├── QuizAttempt.ts
│   ├── UserProgress.ts
│   ├── GameSession.ts
│   ├── Achievement.ts
│   └── DailyChallenge.ts
├── types/
│   └── index.ts
├── seed/
│   ├── subjects.json
│   ├── mcqs.json
│   ├── resources.json
│   ├── games/
│   │   ├── output-predictor.json
│   │   ├── bug-hunter.json
│   │   ├── code-golf.json
│   │   ├── speed-code.json
│   │   ├── memory-match.json
│   │   └── syntax-scramble.json
│   └── achievements.json
└── .env.local
```

---

## Games Details

### 1. Output Predictor
- Show C++ code snippet
- 4 multiple choice outputs
- Time limit: 30 seconds
- XP: +20 correct, +50 speed bonus (<10s)

### 2. Bug Hunter
- Show code with 1-3 bugs
- Click on buggy lines
- Explain the fix
- XP: +30 per bug found

### 3. Code Golf
- Given a problem statement
- Write shortest working solution
- Compete on character count
- XP: +50 for optimal solution

### 4. Speed Code
- Fill in missing code parts
- 60-second countdown
- Progressive difficulty
- XP: +25 per completion

### 5. Memory Match
- 4x4 grid of cards
- Match concepts with descriptions
- Timer-based scoring
- XP: +15 per match pair

### 6. Syntax Scramble
- Jumbled lines of code
- Drag to correct order
- Time-limited
- XP: +20 per puzzle

---

## Gamification System

### XP Earning
| Action | XP |
|--------|-----|
| Correct MCQ answer | +20 |
| Perfect quiz score | +300 bonus |
| Daily login | +10 |
| 7-day streak | +50 bonus |
| Complete resource | +50 |
| Run code in playground | +10 |
| Daily challenge | +100 |
| Game completion | +15-50 |

### Level System
| Level | XP Required | Title |
|-------|-------------|-------|
| 1 | 0 | Novice Coder |
| 5 | 500 | Code Apprentice |
| 10 | 1,500 | Syntax Warrior |
| 15 | 3,000 | Debug Master |
| 20 | 5,000 | C++ Wizard |
| 25 | 8,000 | Code Legend |

### Achievements (20+)
- **First Steps**: Hello World, First Quiz, First Perfect Score
- **Consistency**: 7-Day Streak, 30-Day Streak, Early Bird
- **Mastery**: Topic Master, Quiz Champion
- **Speed**: Speed Demon, Lightning Fast
- **Special**: Night Owl, Weekend Warrior

---

## CSV Import Formats

### MCQ CSV
```csv
question,options,correct,explanation,topic,difficulty,codeSnippet
"What does sizeof(int) return?","4|2|8|Depends",0,"On most 32/64-bit systems",Basics,Easy,""
```

### Resource CSV
```csv
title,content,topic,type,language,difficulty
"Hello World Example","#include <iostream>\nint main() { ... }",Basics,code,C++,Beginner
```

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subjects` | List all subjects |
| GET | `/api/subjects/[slug]` | Get subject with topics |
| GET | `/api/mcq?topic=&difficulty=` | Get MCQs |
| POST | `/api/mcq` | Create MCQ (admin) |
| PUT | `/api/mcq/[id]` | Update MCQ (admin) |
| DELETE | `/api/mcq/[id]` | Delete MCQ (admin) |
| POST | `/api/mcq/import` | Bulk import MCQs |
| GET | `/api/resources` | Get resources |
| POST | `/api/resources` | Create resource (admin) |
| POST | `/api/resources/import` | Bulk import resources |
| POST | `/api/quiz/start` | Start quiz session |
| POST | `/api/quiz/submit` | Submit quiz answers |
| POST | `/api/games/submit` | Submit game score |
| POST | `/api/playground/run` | Execute code |
| GET | `/api/leaderboard` | Get leaderboard |
| GET | `/api/my-scores/[sessionId]` | Get session scores |
| GET | `/api/progress/[sessionId]` | Get user progress |
| GET | `/api/achievements/[sessionId]` | Get achievements |
| POST | `/api/admin/auth` | Admin login |
| GET | `/api/admin/verify` | Verify admin session |

---

## Implementation Phases

### Phase 1: Setup (Steps 1-3)
1. Initialize Next.js 16 + TypeScript + Tailwind CSS v4
2. Configure MongoDB + Mongoose 9.9 connection
3. Create all database models + types

### Phase 2: Core Content (Steps 4-6)
4. Seed C++ MCQs (50+ questions across 10 topics)
5. Seed code resources (20+ examples)
6. Build subject and topic pages

### Phase 3: Quiz System (Steps 7-8)
7. Build MCQ quiz engine with scoring
8. Build leaderboard and My Scores

### Phase 4: Games (Steps 9-14)
9. Build Output Predictor game
10. Build Bug Hunter game
11. Build Code Golf game
12. Build Speed Code game
13. Build Memory Match game
14. Build Syntax Scramble game + Games Hub

### Phase 5: Gamification (Steps 15-18)
15. Implement XP and leveling system
16. Implement streaks with freeze
17. Implement achievements/badges
18. Build profile page with stats

### Phase 6: Code Playground (Steps 19-20)
19. Integrate Monaco Editor
20. Add code execution API

### Phase 7: Admin (Steps 21-23)
21. Build admin auth middleware
22. Build MCQ/resource CRUD
23. Build CSV/JSON bulk import

### Phase 8: Polish (Step 24)
24. UI animations, responsive design, error handling

---

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/cpp-cms
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
CODE_EXECUTION_API_URL=https://emkc.org/api/v2/piston
```

---

## Fun Facts

### C++
- C++ was originally "C with Classes" (1979)
- Name "C++" = increment operator joke
- sizeof(char) is always 1 by standard
- V8 engine (Chrome/Node) is written in C++

### Tech Stack
- Next.js 16 powers Netflix, TikTok, Twitch
- MongoDB stores BSON (Binary JSON)
- Mongoose 9.9 has TypeScript-first support
- shadcn/ui supports Base UI, Radix, or React Aria

---

**Status:** Ready for implementation
**Last Updated:** 2026-09-01
