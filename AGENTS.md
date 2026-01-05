# Repository Guidelines

## Project Structure & Module Organization
- Framework: Next.js (App Router) with Tailwind CSS and Shadcn UI.
- Expected layout:
  - `app/` for routes and pages (e.g., `app/menu/page.tsx`, `app/name/page.tsx`, `app/game/page.tsx`).
  - `components/` for reusable UI and game widgets (Shadcn components live here).
  - `lib/` for data access, DB utilities, and shared helpers.
  - `public/` for static assets (icons, optional sprite sheets).
  - `tests/` for automated tests.
  - `docker-compose.yml` for local database services.

## Build, Test, and Development Commands
- After scaffolding, document the exact commands here. Target pattern:
  - `pnpm install` — install dependencies.
  - `pnpm dev` — start the Next.js dev server.
  - `pnpm build` — produce a production build.
  - `pnpm start` — run the production server.
  - `pnpm test` — run the test suite.
  - `docker compose up -d` — start MariaDB locally.

## Coding Style & Naming Conventions
- TypeScript-first. Use ESLint + Prettier defaults for Next.js once initialized.
- Indentation: 2 spaces in JSON/YAML, 2 spaces in JS/TS, and 2 spaces in CSS.
- Naming:
  - React components: `PascalCase` (e.g., `GameCanvas.tsx`).
  - Hooks/utilities: `camelCase` (e.g., `useSnakeGame.ts`).
  - Routes: lowercase folder names (e.g., `app/menu`).

## Testing Guidelines
- Add tests once the core loop is in place; prefer unit tests for game logic and integration tests for API routes.
- Target naming pattern: `*.test.ts` or `*.test.tsx` under `tests/` or next to the module.

## Commit & Pull Request Guidelines
- Use short imperative commit subjects (e.g., "Add menu screen").
- PRs should include:
  - Clear description of changes and intent.
  - Screenshots or GIFs for UI changes.
  - Linked issues (if tracked).

## Game Requirements & UX
- Game: classic Snake on a HTML `<canvas>`; 2D top-down.
- Style direction: neon arcade grid with subtle glow, crisp pixel-ish snake segments, and soft shadowed food targets.
- Pages:
  - Menu page with play options and leaderboard entry.
  - Name entry page to capture the player's display name before play.

## Data & Persistence
- Store max score per user in MariaDB.
- Provide a local DB starter in `docker-compose.yml` (MariaDB service, exposed port, and volume).
- Use best practices for data access (parameterized queries, env-based credentials, no secrets in git).

## Configuration & Environment
- Maintain `.env` for local settings and a checked-in `.env.example`.
- Document required variables (e.g., `DATABASE_URL`) once the DB layer is added.

## Implementation Notes
- Use Shadcn UI components for menus, inputs, and layout.
- If any requirement is ambiguous or conflicts with best practices, ask before implementing.
