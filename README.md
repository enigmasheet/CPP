> Status: Current
> Source of truth: Repository implementation

# TeachMate

A teacher assistant tool that replaces PowerPoint presentations with interactive notes, quizzes, and games during class.

## What It Does

- **For Teachers**: Prepare notes, create quiz/game sessions, display QR codes for students to join, review results and audit logs
- **For Students**: Scan QR code, join session, participate in quizzes and games, see score instantly

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.3.4 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| Database | MongoDB via Mongoose |
| State | React Query + localStorage |
| Package Manager | pnpm |

## Quick Start

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables in `.env.local`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ADMIN_PASSWORD=your_teacher_password
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Seed the database:
   ```bash
   pnpm seed:oop
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Features

- **Session Management**: Create quiz/game sessions with 6-character join codes
- **MCQ System**: Create, import, and manage multiple choice questions
- **Learn Pages**: Browse curriculum notes with progress tracking
- **Classes**: Track class sections and log teaching activities
- **Audit Log**: Track planned, completed, and skipped teaching activities
- **Teaching Plans**: Plan topics with status and priority
- **Games**: Output Predictor, Speed Code, Bug Hunter
- **Search**: Global search across notes, MCQs, and resources
- **QR Codes**: Display QR codes for easy student session join

## Project Structure

```
src/
├── app/              # Pages and API routes
│   ├── admin/        # Teacher dashboard
│   ├── api/          # 44 API endpoints
│   ├── subjects/     # Subject pages
│   └── s/            # Student session view
├── components/       # React components
├── config/           # Subject configuration
├── data/             # Static content (notes, knowledge, games)
├── hooks/            # Custom React hooks
├── lib/              # Utilities and shared code
├── models/           # 10 Mongoose models
└── services/         # Business logic
```

## Documentation

- [Project Context](PROJECT_CONTEXT.md) — Purpose, users, workflows
- [Architecture](ARCHITECTURE.md) — System design and rendering strategy
- [Database](DATABASE.md) — Models, relationships, indexes
- [API Reference](API.md) — All endpoints documented
- [Authentication](AUTH.md) — Auth mechanism and protected routes
- [Features](FEATURES.md) — Feature inventory with code locations
- [Development](DEVELOPMENT.md) — Setup, commands, conventions
- [Deployment](DEPLOYMENT.md) — Build, deploy, environment config
- [Decisions](DECISIONS.md) — Architectural decisions and rationale
- [TODO](TODO.md) — Known issues and planned features

## License

Private project.
