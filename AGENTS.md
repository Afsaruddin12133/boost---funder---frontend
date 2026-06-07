# AGENTS.md — Agent guidance for this repository

Purpose: give AI coding agents the minimal, high-value info needed to be productive without duplicating existing docs. Link to authoritative files for details.

Quick commands

- Install dependencies: `pnpm install` (this is a pnpm workspace). If pnpm is unavailable use `npm install`.
- Dev server: `pnpm dev` (runs Vite dev server).
- Build: `pnpm build` (runs `vite build`).
- Preview production build: `pnpm preview` or run a static server against `dist/`.

Environment

- Vite exposes only `VITE_`-prefixed env vars. Ensure required keys like `VITE_FIREBASE_*` and `VITE_API_BASE_URL` are present in your `.env`.

Where to look (high-value entry points)

- Project manifest: [package.json](package.json)
- Vite config and build settings: [vite.config.js](vite.config.js)
- Workspace config: [pnpm-workspace.yaml](pnpm-workspace.yaml)
- App entry & providers: [src/main.jsx](src/main.jsx), [src/providers/providers.jsx](src/providers/providers.jsx)
- Top-level app and routing: [src/app/App.jsx](src/app/App.jsx), [src/config/routes.js](src/config/routes.js)
- API helper and backend integration: [src/lib/api.js](src/lib/api.js)
- Firebase + auth plumbing: [src/lib/firebase.js](src/lib/firebase.js), [src/features/auth/hooks/useAuth.js](src/features/auth/hooks/useAuth.js), [src/features/auth/services/auth.service.js](src/features/auth/services/auth.service.js)
- Shared UI primitives: [src/shared/ui/index.js](src/shared/ui/index.js)

Conventions & notes for agents

- Feature-first layout: inspect `src/features/<feature>/{components,hooks,services,types}` for feature logic.
- UI components live in `src/shared/ui` and are Radix/Tailwind wrappers — prefer reusing these over new raw HTML.
- Routing: uses `react-router` with nested routes; use `src/config/routes.js` for canonical paths.
- Avoid modifying environment-sensitive files; instead, add `.env.example` entries and document required VITE\_ vars in PRs.
- Auth flows depend on Firebase OAuth and a backend API. When changing auth code, update tests and verify with a local backend or mocked responses.

Common pitfalls to surface in PRs

- Missing `VITE_` env vars causing runtime failures.
- CORS issues with backend endpoints referenced in `src/lib/api.js`.
- Changing shared UI signatures without updating all imports in `src/features`.

If you need to perform an action

- To run tests or linting, consult `package.json` (scripts) and the repository `README.md` for any project-specific steps.

Next suggested agent customizations

- Create a small `skill` for auth-related tasks that: maps API contract fields, lists required env vars, and provides a mock server snippet.
- Create a `create-pr` prompt template that enforces adding env var notes and references to impacted features when auth/infra code changes.

If you'd like, I can also add a `.github/copilot-instructions.md` variant with the same guidance formatted for GitHub Copilot specifically—tell me which preference you want.
