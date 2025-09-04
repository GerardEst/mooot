# Repository Guidelines

## Project Structure & Module Organization
- `src/`: TypeScript modules (e.g., `gameboard-module.ts`, `stats-module.ts`, `storage-module.ts`, `supabase.ts`).
- `pages/`: Project root for Vite dev/build. Contains `index.html`, `joc/`, and `trofeus/` entries.
- `public/`: Static assets served as-is.
- `__tests__/`: Vitest specs (`*.test.ts`) and helpers; global setup in `test-setup.ts`.
- `dist/`: Production build output (generated). 
- `conf.ts`: League names/emojis used across views.

## Build, Test, and Development Commands
- `npm run dev`: Start Vite dev server with HMR.
- `npm run build`: Create production bundle into `dist/` (multi-page: `index.html`, `joc/`, `trofeus/`).
- `npm run preview`: Serve the built `dist/` locally for validation.
- `npm test`: Run Vitest in watch/interactive mode.
- `npm run coverage`: Run tests once and generate coverage (`text` + `html` in `coverage/`).

## Coding Style & Naming Conventions
- TypeScript, ES modules, `strict: true` (see `tsconfig.json`).
- Prettier enforced (see `.prettierrc.json`): 4-space indent, single quotes, no semicolons, `trailingComma: es5`.
- Filenames: lower-kebab-case (e.g., `share-utils.ts`).
- Exports: functions/variables `camelCase`; types/interfaces `PascalCase`.
- Keep DOM helpers pure and side-effect free in `dom-utils.ts` where possible.

## Testing Guidelines
- Framework: Vitest with `jsdom` environment; `@testing-library/*` for DOM assertions.
- Location: `__tests__/*.test.ts`. Name tests after the unit under test (e.g., `gameboard.test.ts`).
- Run: `npm test` for TDD; use `npm run coverage` before PRs. Avoid flaky timers; prefer fake timers if needed.

## Commit & Pull Request Guidelines
- Commits: short, imperative subject ("add…", "fix…"). Group related changes; reference issues if applicable.
- PRs: clear description, rationale, and testing notes. Include screenshots/GIFs for UI changes. Link issues and note breaking changes.

## Security & Configuration Tips
- Environment: Vite reads `VITE_*` vars. Create `.env` locally and avoid committing secrets.
  Example:
  
  VITE_SUPABASE_URL=...
  VITE_SUPABASE_ANON_KEY=...
  
- Consider adding `.env` to `.gitignore`. Never embed keys in source; `src/supabase.ts` loads from env.

## Architecture Overview
- Multi-page Vite app: main page plus `joc` and `trofeus` entries (dev root is `pages/`).
- Core modules handle game logic (`gameboard`, `words`, `stats`, `storage`).
- Remote services via Supabase client in `src/supabase.ts`.
