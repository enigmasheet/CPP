# TODO

> Status: Current
> Source of truth: Repository implementation

## Current Work

(None actively in progress)

## Known Bugs

(None reported)

## Missing Features

### Gamification System
- XP, levels, streaks, achievements
- GameSession, Achievement, DailyChallenge models
- Planned: `src/components/gamification/`

### Code Playground
- In-browser code execution
- Planned: `src/app/playground/`, `src/app/api/playground/`

### My Scores Page
- Student score history page
- Planned: `src/app/my-scores/`

### Student Progress (Server-Side)
- Cross-device progress tracking
- Currently localStorage only — requires student accounts

### Games: Bug Hunter
- Data exists in `seed/games/bug-hunter.json` but no component implementation

## Technical Debt

- No test files exist (`*.test.*` or `*.spec.*`)
- No CI/CD configuration
- No `.env.example` file
- OOP subject has 0 notes (placeholder) — `src/config/subjects.ts:60-79`
- Empty component directories: `gamification`, `mcq`, `playground`, `resources`

## Future Improvements

### From AGENTS.md Upcoming Updates
- Subject-specific progress views
- Cross-subject progress view
- MCQ import by subject filter
- Multi-subject class linking
- Subject landing page breadcrumb navigation

### From archivedPlans.md
- 6 educational games (only 2 implemented: OutputPredictor, SpeedCode)
- Global leaderboard
- Daily challenges
- Achievement badges
- Teacher analytics dashboard
