# Changelog

> Status: Current
> Source of truth: AUDIT.md and git history

## Phase 1-3: Security, UI/UX, Learn Navigation
- ReDoS escape in search
- Zod validation on all API inputs
- Score bounds enforcement
- Timing-safe password comparison
- crypto.randomBytes for session codes
- try/catch on external fetch calls
- MCQ green bug fix
- Explanation timing
- Session persistence
- Mobile code blocks
- Teacher login redirect
- OutputPredictor game
- Fullscreen QR code
- CreateSessionDialog/EditSessionDialog responsive
- ConfirmDialog component
- ARIA labels

## Phase 4: Student UX
- Student session participation flow
- Timer and auto-submit
- Results review with explanations
- Leaderboard display
- localStorage progress persistence
- beforeunload warning

## Phase 5: Classes CRUD
- Class management (create/edit/delete)
- Class entries (log teaching activities)
- Integration with sessions

## Phase 6: Multi-Subject Support
- OOP subject configuration
- Dynamic subject pages
- generateStaticParams for static routes
- Subject dropdown in navbar
- Multi-subject progress aggregation
- Search with dynamic subject slug resolution

## Phase 7: Audit Improvements
- sessionCode index on AuditLog model
- Multi-subject topics in audit form
- Delete confirmation dialog
- Session code links in audit cards
- Highest/lowest score fields
- Status filtering
- Pagination (10/page)

## Phase 8: Documentation System
- Teaching tip flag system
- stripTeachingTips utility
- Comprehensive documentation generation
