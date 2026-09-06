# Repository Documentation System — Generation, Synchronization & Maintenance

You are an expert software architect, senior developer, and technical documentation engineer.

Your task is to analyze the **entire repository** and create a comprehensive, accurate, maintainable documentation system that gives future AI coding agents enough context to quickly understand the project, plan changes correctly, and modify the code without breaking existing architecture, business rules, database relationships, APIs, or conventions.

The documentation must be based on the **actual repository implementation**, not assumptions.

---

# 1. PRIMARY OBJECTIVE

Create documentation that answers these questions for an AI coding agent:

1. What is this project?
2. Why does it exist?
3. Who uses it?
4. What are its major features?
5. How is the system architected?
6. How does data flow through the application?
7. What are the important database models and relationships?
8. What APIs exist?
9. How does authentication/authorization work?
10. Which pages/routes exist?
11. Which pages are static, dynamic, SSR, SSG, ISR, or client-rendered?
12. What conventions does the codebase follow?
13. What technologies and dependencies are used?
14. How is the application deployed?
15. What environment variables are required?
16. What important architectural decisions have already been made?
17. What must NOT be changed casually?
18. What known technical debt or limitations exist?
19. What is currently incomplete?
20. How should an AI agent safely make changes to this repository?

The resulting documentation must optimize for **fast repository understanding and safe code changes by AI agents**.

---

# 2. SOURCE OF TRUTH

The source code is the ultimate source of truth.

Never invent architecture, features, APIs, models, relationships, workflows, or business rules.

Inspect the actual repository before writing documentation.

Use evidence from:

- Source code
- Configuration files
- package.json
- tsconfig
- Next.js configuration
- ESLint configuration
- Tailwind configuration
- Database models
- Database utilities
- API routes
- Server actions
- Components
- Pages
- Layouts
- Middleware
- Authentication implementation
- Environment variable references
- Tests
- Scripts
- CI/CD configuration
- Docker configuration
- Deployment configuration
- Existing documentation
- Comments where relevant

Existing Markdown documentation must NOT automatically be treated as correct.

Compare existing documentation against implementation.

If documentation conflicts with source code:

1. Determine the current implementation.
2. Identify whether the documentation is stale.
3. Update the documentation to reflect the actual intended implementation.
4. Record important architectural discrepancies if necessary.

---

# 3. FIRST STEP — REPOSITORY DISCOVERY

Before generating documentation, perform a systematic repository analysis.

Inspect:

```text
/
├── package.json
├── README*
├── configuration files
├── app/
├── pages/
├── src/
├── components/
├── lib/
├── services/
├── models/
├── schemas/
├── hooks/
├── utils/
├── middleware*
├── public/
├── scripts/
├── tests/
├── docs/
└── deployment/CI files
```

Do not assume these directories exist.

Adapt the analysis to the actual repository.

Determine:

- Framework
- Language
- Runtime
- Package manager
- Database
- ORM/ODM
- Authentication
- Authorization
- API architecture
- Frontend architecture
- Backend architecture
- Rendering strategy
- Deployment platform
- Testing strategy
- Build process
- Code conventions
- Folder conventions

---

# 4. DO NOT MODIFY APPLICATION CODE DURING DOCUMENTATION GENERATION

During the initial documentation-generation task:

DO NOT:

- Refactor application code
- Rename files
- Change architecture
- Upgrade dependencies
- Change database schemas
- Change APIs
- Change configuration
- Fix unrelated bugs
- "Clean up" existing code

The initial task is documentation analysis and generation only.

The only code changes allowed are documentation tooling/infrastructure explicitly required for documentation generation or validation.

---

# 5. DOCUMENTATION STRUCTURE

Create the following documentation structure where appropriate.

```text
/
├── AGENTS.md
├── README.md
├── PROJECT_CONTEXT.md
├── DOCUMENTATION.md
├── ARCHITECTURE.md
├── DATABASE.md
├── API.md
├── AUTH.md
├── FEATURES.md
├── DEVELOPMENT.md
├── DEPLOYMENT.md
├── DECISIONS.md
├── TODO.md
├── CHANGELOG.md
│
├── docs/
│   ├── architecture/
│   │   ├── overview.md
│   │   ├── frontend.md
│   │   ├── backend.md
│   │   ├── rendering.md
│   │   └── data-flow.md
│   │
│   ├── database/
│   │   ├── schema.md
│   │   ├── relationships.md
│   │   └── indexes.md
│   │
│   ├── api/
│   │   └── overview.md
│   │
│   ├── features/
│   │   └── ...
│   │
│   ├── decisions/
│   │   └── ...
│   │
│   └── generated/
│       └── ...
│
└── scripts/
    ├── generate-docs.*
    └── check-docs.*
```

Do not create unnecessary files.

If a category is not relevant to the repository, omit it.

Prefer a smaller number of high-quality documents over dozens of repetitive files.

---

# 6. AGENTS.md

Create a comprehensive root-level `AGENTS.md`.

This is the primary instruction document for AI coding agents.

It must include:

## Project Overview

Brief description of the project.

## Technology Stack

Document actual technologies discovered in the repository.

## Architecture Rules

Explain:

- Server vs client architecture
- Frontend conventions
- Backend conventions
- Data access conventions
- API conventions
- State management
- Component conventions

## Coding Rules

Document existing conventions.

Examples:

- TypeScript usage
- Naming conventions
- Component conventions
- Error handling
- Validation
- Async patterns
- Imports
- File organization
- Reuse expectations

Do not invent rules that the repository does not follow.

## Database Rules

Agents must:

1. Inspect existing models before changing them.
2. Search all usages before renaming fields.
3. Search relationships before deleting fields.
4. Check indexes.
5. Check references/population logic.
6. Check API consumers.
7. Consider backward compatibility.
8. Avoid breaking existing data.

## API Rules

Before modifying an API:

1. Locate the implementation.
2. Search consumers.
3. Identify request/response structure.
4. Identify authentication requirements.
5. Identify validation.
6. Identify error behavior.
7. Update API documentation if behavior changes.

## Component Rules

Prefer existing components.

Do not introduce duplicate components when an existing abstraction can be reused.

Do not add `"use client"` unless client-side behavior actually requires it.

## Change Safety

Agents should prefer:

- Small changes
- Minimal scope
- Existing patterns
- Backward-compatible changes
- Reuse
- Explicit validation

Avoid unnecessary rewrites.

---

# 7. DOCUMENTATION MAINTENANCE RULE

Add a strict rule to `AGENTS.md`:

> Documentation is part of the codebase.

Every code change must be evaluated for documentation impact.

Before finishing any task, determine whether the change affects:

- Architecture
- Database
- API
- Authentication
- Authorization
- Features
- Routes
- Rendering
- Deployment
- Environment variables
- Development workflow
- Business rules
- Architectural decisions
- Known limitations
- TODO items

If it does, update the appropriate documentation in the same change.

Never intentionally leave known stale documentation behind.

---

# 8. DOCUMENTATION IMPACT CHECK

Every implementation plan should include:

```md
## Documentation Impact

- [ ] Project context
- [ ] Architecture
- [ ] Database
- [ ] API
- [ ] Authentication
- [ ] Features
- [ ] Development
- [ ] Deployment
- [ ] Decisions
- [ ] TODO
```

Only mark affected documents.

Do not modify documentation unnecessarily.

---

# 9. PROJECT_CONTEXT.md

Document the product/business context.

Include:

## Purpose

What problem does the project solve?

## Users

Identify actual user roles.

## Core Workflows

Explain major workflows.

Example:

```text
User
 ↓
Login
 ↓
Dashboard
 ↓
Course
 ↓
Lesson
 ↓
Quiz
 ↓
Submission
 ↓
Score
```

## Core Domain Concepts

Identify the project's important concepts.

## Business Rules

Document rules that are evident from the implementation.

Do not invent business requirements.

---

# 10. ARCHITECTURE.md

Document the actual architecture.

Include:

- High-level architecture
- Frontend architecture
- Backend architecture
- Data access layer
- API architecture
- Authentication
- Authorization
- State management
- External services
- Background jobs if present
- Caching
- Rendering
- Deployment architecture

Include ASCII diagrams where useful.

Example:

```text
Browser
   ↓
Next.js
   ↓
Server Components / API / Server Actions
   ↓
Services
   ↓
Database
```

Adapt the diagram to the actual project.

---

# 11. RENDERING DOCUMENTATION

For Next.js projects, specifically analyze:

- Static pages
- SSG
- SSR
- ISR
- Dynamic routes
- `generateStaticParams`
- `dynamic`
- `dynamicParams`
- `revalidate`
- Server Components
- Client Components
- Route handlers
- Server actions

Document why different areas use different rendering strategies.

Do not merely list `(SSG)` output from the build.

Explain the architectural implications.

Example:

```text
Stable educational content
        ↓
SSG / ISR
        ↓
CDN

User-specific content
        ↓
Dynamic rendering
        ↓
Database
```

---

# 12. DATABASE.md

Document the actual database.

Include:

- Database technology
- Connection mechanism
- Models/collections/tables
- Important fields
- Relationships
- References
- Embedded documents
- Indexes
- Unique constraints
- Validation
- Cascading behavior
- Important queries
- Data ownership

For each important model:

```md
## ModelName

Purpose:

Fields:

- field
- field
- field

Relationships:

- ModelName → OtherModel

Important constraints:

- ...

Used by:

- ...
```

Do not document every trivial implementation detail.

Focus on information required to safely modify the system.

---

# 13. RELATIONSHIP DOCUMENTATION

Pay particular attention to relationships.

Create a relationship map where useful.

Example:

```text
User
 │
 ├── QuizAttempt
 │       │
 │       └── Quiz
 │             │
 │             └── Lesson
 │                   │
 │                   └── Course
```

Identify relationships that could break if fields are renamed or removed.

Document foreign-key/reference-like relationships even if the database is MongoDB.

---

# 14. API.md

Document actual API endpoints.

For each endpoint include:

```md
## METHOD /api/example

Purpose:

Authentication:

Authorization:

Request:

Response:

Errors:

Used by:

Important behavior:
```

Do not invent endpoints.

Search the repository to identify consumers.

If an endpoint is internal-only, state that.

---

# 15. AUTH.md

Document actual authentication and authorization.

Include:

- Authentication mechanism
- Sessions/tokens
- Login
- Registration
- Logout
- Password handling
- Roles
- Permissions
- Middleware
- Protected routes
- Server-side checks
- Client-side behavior
- Security-sensitive flows

Do not expose secrets.

Never document actual secret values.

---

# 16. FEATURES.md

Document actual application features.

For each feature:

```md
## Feature Name

Purpose:

Users:

Workflow:

Implementation:

Relevant routes:

Relevant components:

Relevant models:

Business rules:

Known limitations:
```

Connect features to actual code locations.

---

# 17. DEVELOPMENT.md

Document how developers work with the repository.

Include:

- Requirements
- Installation
- Package manager
- Environment setup
- Environment variables by NAME only
- Development command
- Build command
- Test command
- Lint command
- Formatting command
- Database setup
- Seed commands
- Migration commands
- Useful scripts

Verify commands from package.json and configuration.

Do not invent commands.

---

# 18. DEPLOYMENT.md

Document actual deployment.

Include:

- Deployment platform
- Build command
- Start command
- Environment configuration
- Database connection requirements
- Build-time vs runtime environment variables
- Static generation behavior
- Serverless behavior if applicable
- Caching
- Domain configuration if documented
- CI/CD

Never include secret values.

---

# 19. DECISIONS.md

Document important architectural decisions.

Do not create fake ADRs.

Only document decisions that can be established from:

- Existing architecture
- Existing documentation
- Code structure
- Configuration
- Explicit comments
- Git history if available

Use:

```md
## Decision: <Title>

### Context

### Decision

### Reason

### Consequences

### Do Not Change Without Considering
```

Important decisions may include:

- Framework choice
- Database choice
- Server/client architecture
- Rendering strategy
- Authentication architecture
- API architecture
- State management
- Deployment architecture

---

# 20. TODO.md

Document only actual known unfinished work.

Separate:

```md
## Current Work

## Known Bugs

## Technical Debt

## Missing Features

## Future Improvements
```

Do not generate arbitrary TODOs simply because something could theoretically be improved.

---

# 21. CHANGELOG.md

Use this for historical changes.

Do not turn architecture documentation into a changelog.

Architecture documents should describe the current system.

CHANGELOG describes historical changes.

---

# 22. GENERATED DOCUMENTATION

Where practical, generate documentation directly from source.

Good candidates:

- Routes
- API endpoint inventory
- Database model inventory
- Environment variable names
- Scripts
- Package/dependency information
- Configuration summaries

Generated documentation should go under:

```text
docs/generated/
```

Clearly mark generated files:

```md
> This document is generated from repository source/configuration.
> Do not edit manually.
> Run the documentation generation command instead.
```

Do not manually maintain information that can reliably be derived from source code.

---

# 23. SINGLE SOURCE OF TRUTH

Avoid duplicating the same information across documents.

For example:

Do NOT fully describe database fields in:

```text
ARCHITECTURE.md
FEATURES.md
API.md
DATABASE.md
```

Instead:

```text
DATABASE.md
    ↓
Database source of truth

Other documents
    ↓
Reference database concepts where necessary
```

Documentation should explain relationships between concepts rather than copy the same content repeatedly.

---

# 24. DOCUMENTATION METADATA

For important manually maintained documents, include:

```md
> Status: Current
> Source of truth: Repository implementation
```

Do not rely solely on "Last updated" dates to determine freshness.

Dates are informational only.

Actual code consistency is more important.

---

# 25. STALE DOCUMENTATION DETECTION

Create documentation validation tooling where practical.

Create:

```text
scripts/check-docs.*
```

The checker should detect obvious inconsistencies such as:

- Documented routes that no longer exist
- Documented models that no longer exist
- Documented scripts missing from package.json
- Documented environment variables that are not referenced
- Missing documented models
- Missing documented routes
- Invalid documentation references
- Generated documentation differing from source
- Broken internal Markdown links

The checker does not need to understand every semantic detail.

Focus on reliable checks.

---

# 26. DOCUMENTATION GENERATION TOOL

If practical, create:

```text
scripts/generate-docs.*
```

It should generate deterministic output.

Running:

```bash
npm run docs:generate
```

should produce the same documentation from the same repository state.

Do not include timestamps or random information in generated files unless necessary.

---

# 27. PACKAGE SCRIPTS

If the project uses npm and it is appropriate, add scripts such as:

```json
{
  "scripts": {
    "docs:generate": "...",
    "docs:check": "..."
  }
}
```

Do not break existing scripts.

Do not replace existing tooling unnecessarily.

Use the project's existing language/tooling where possible.

For example:

- TypeScript project → TypeScript scripts where appropriate
- Existing Python tooling → Python
- Existing Node tooling → Node/TypeScript
- Existing package manager → use it

---

# 28. CI/CD DOCUMENTATION CHECK

If CI exists, recommend or implement a documentation validation step where appropriate:

```text
lint
 ↓
tests
 ↓
build
 ↓
docs:check
```

The documentation check should fail only for reliable, actionable inconsistencies.

Do not create a fragile documentation checker that produces false positives on normal development.

---

# 29. DOCUMENTATION MAINTENANCE WORKFLOW

Define this workflow in `DOCUMENTATION.md`:

```text
Developer/Agent starts task
        ↓
Read AGENTS.md
        ↓
Read relevant documentation
        ↓
Inspect source code
        ↓
Create implementation plan
        ↓
Identify documentation impact
        ↓
Modify code
        ↓
Run tests/build/lint
        ↓
Update affected documentation
        ↓
Regenerate generated documentation
        ↓
Run docs:check
        ↓
Review documentation against source
        ↓
Complete task
```

---

# 30. IMPORTANT RULE — SOURCE CODE WINS

If an agent discovers:

```text
Documentation ≠ Source Code
```

the agent must NOT blindly follow the documentation.

Instead:

```text
1. Inspect source.
2. Determine actual behavior.
3. Determine intended behavior if possible.
4. Make the smallest appropriate correction.
5. Update documentation.
6. Mention the discrepancy in the final summary.
```

---

# 31. DOCUMENTATION SHOULD BE AGENT-OPTIMIZED

Write documentation for both humans and AI agents.

Prefer:

```md
Course
 ├── Lesson
 ├── Quiz
 └── QuizAttempt
```

over long prose.

Prefer:

```md
Implementation:
- app/courses/[id]/page.tsx
- models/Course.ts
- lib/course.ts
```

over vague descriptions.

Include actual paths.

Include important symbols/classes/functions when useful.

Use tables for structured information.

Use diagrams for relationships and workflows.

---

# 32. CODE REFERENCES

Where useful, identify:

```text
Route:
app/courses/[id]/page.tsx

Model:
models/Course.ts

Service:
lib/course.ts

API:
app/api/courses/route.ts

Component:
components/course/CourseCard.tsx
```

Paths must be verified against the actual repository.

Never invent paths.

---

# 33. DO NOT OVER-DOCUMENT

Do not document:

- Every function
- Every variable
- Obvious JSX
- Trivial utility functions
- Standard framework behavior
- Implementation details that can be read directly from code

Document information that helps an agent make decisions.

The goal is:

```text
Maximum useful context
Minimum documentation noise
```

---

# 34. DO NOT CREATE FALSE CERTAINTY

If something cannot be determined from the repository:

Say:

```text
Unknown / Not established from repository
```

or:

```text
Implementation exists, but architectural rationale is not documented.
```

Do not invent reasons.

---

# 35. DOCUMENTATION QUALITY CHECK

Before finishing, verify:

## Completeness

- [ ] Project purpose documented
- [ ] Architecture documented
- [ ] Database documented
- [ ] APIs documented
- [ ] Authentication documented
- [ ] Features documented
- [ ] Development setup documented
- [ ] Deployment documented
- [ ] Important decisions documented
- [ ] Current TODO documented

## Accuracy

- [ ] Paths verified
- [ ] Routes verified
- [ ] Models verified
- [ ] APIs verified
- [ ] Commands verified
- [ ] Dependencies verified
- [ ] Environment variable names verified
- [ ] Rendering behavior verified

## Agent usefulness

- [ ] AGENTS.md explains how to safely modify the repo
- [ ] Important constraints documented
- [ ] Database relationships documented
- [ ] Architectural boundaries documented
- [ ] Business rules documented
- [ ] Dangerous changes identified
- [ ] Documentation maintenance rules established

---

# 36. FINAL OUTPUT

After completing the analysis, provide a concise summary containing:

## Repository Summary

- Framework
- Language
- Database
- Authentication
- Deployment
- Major architectural pattern

## Documentation Created

List every created/updated documentation file.

## Generated Documentation

List generated documentation.

## Maintenance Tooling

List:

- docs:generate
- docs:check
- CI integration if implemented

## Important Findings

List important architectural discoveries.

## Documentation Gaps

List anything that could not be determined confidently.

## Potential Risks

Identify areas where future agents should be careful.

---

# 37. FUTURE AGENT RULE

Add the following principle to `AGENTS.md`:

> Before changing code, understand the existing system. Before completing a change, ensure the documentation still describes the existing system.

The agent must never treat documentation as a one-time artifact.

Documentation is a continuously maintained part of the repository.

---

# 38. MAINTENANCE RULE — EVERY FUTURE TASK

For every future coding task, the agent must follow:

```text
UNDERSTAND
    ↓
SEARCH
    ↓
PLAN
    ↓
CHECK DOCUMENTATION IMPACT
    ↓
IMPLEMENT
    ↓
TEST
    ↓
UPDATE DOCUMENTATION
    ↓
GENERATE DOCUMENTATION
    ↓
VALIDATE DOCUMENTATION
    ↓
FINAL REVIEW
```

Never skip the documentation-impact step.

---

# 39. MAINTENANCE PRIORITY

When deciding whether to update documentation:

### MUST UPDATE

If changing:

- Database schema
- Database relationships
- API contract
- Authentication
- Authorization
- Business rules
- Architecture
- Rendering strategy
- Deployment
- Environment variables
- Public behavior
- Major feature behavior

### SHOULD UPDATE

If changing:

- Development workflow
- Important component conventions
- Folder architecture
- Testing strategy
- Performance architecture
- Caching strategy
- Important technical debt

### USUALLY DOES NOT REQUIRE UPDATE

If changing only:

- Variable names
- Internal implementation
- Formatting
- Comments
- Refactoring with identical external behavior
- Tests without behavior changes

Use judgment.

---

# 40. FINAL PRINCIPLE

The purpose of this documentation system is NOT to create a large collection of Markdown files.

The purpose is to create a reliable **repository knowledge system**.

The ideal result is:

```text
                         REPOSITORY
                             │
              ┌──────────────┴──────────────┐
              │                             │
           SOURCE CODE                 DOCUMENTATION
              │                             │
              │                    ┌────────┴────────┐
              │                    │                 │
              │                 HUMAN             AGENT
              │                 CONTEXT           CONTEXT
              │                    │                 │
              └──────────────┬─────┴─────────────────┘
                             ↓
                     SHARED UNDERSTANDING
                             ↓
                     SAFE IMPLEMENTATION
                             ↓
                     DOCUMENTATION UPDATE
                             ↓
                       VALIDATION
```

The repository implementation remains the ultimate authority.

Documentation explains the system, its constraints, decisions, relationships, and workflows.

Generated documentation should represent facts derived from source.

Manual documentation should explain concepts that cannot reliably be generated.

Every meaningful code change must keep the documentation synchronized.

Do not optimize for documentation quantity.

Optimize for **accuracy, discoverability, maintainability, and fast AI-agent comprehension**.