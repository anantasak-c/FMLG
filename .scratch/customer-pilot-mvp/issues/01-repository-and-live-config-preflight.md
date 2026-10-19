# 01: Repository and live configuration preflight

Type: task
Status: resolved
Blocked by: None

## Work

- Resolve the local repository state before edits: this directory is not currently a Git worktree, while the intended remote is `https://github.com/anantasak-c/FMLG.git`. Inspect the remote first; clone it or initialize/connect it only after confirming which copy is canonical.
- Read the installed Next.js guides under `node_modules/next/dist/docs/` before writing application code, per `AGENTS.md`.
- Add a server-only environment validation module that reports missing required configuration by name without ever echoing values.
- Keep `.env.local` ignored; maintain `.env.example` with only names/placeholders.
- Configure a non-production deployment first and record the public HTTPS URL needed by LINE.

## Acceptance criteria

- A CLI operator can run one command that identifies missing config without leaking secrets.
- The canonical worktree has the intended Git remote and a clean baseline policy.
- There is a deployed HTTPS preview URL or a documented remaining Vercel blocker.

## Comments

- 2026-08-24: Claimed. Confirmed the intended `origin` is reachable and currently has no refs, so this local copy is being established as its initial canonical worktree. Environment inspection is limited to variable names and presence only; no values are logged.
- 2026-08-24: Initialized the empty `main` worktree and connected `origin` to `https://github.com/anantasak-c/FMLG.git`. `.gitignore` continues to exclude every `.env*` file except `.env.example`; no environment values were changed, printed, or staged.
- 2026-08-24: Added `npm run config:check`, backed by a server-only guard. It reports only missing configuration names and invalid HTTPS URL variable names. `.env.example` now includes the server-only `OPENAI_API_KEY` placeholder required by ADR 0017. Automated tests, Windows-compatible typecheck, and production build pass.
- 2026-08-24: Vercel CLI login is available, but the preview deployment was blocked because uploading the repository to Vercel needs explicit authorization. No project payload was uploaded and no preview URL exists yet. After authorization, run `vercel deploy . -y` from this worktree, set the public HTTPS URL in `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_LIFF_REDIRECT_URL`, then rerun `npm run config:check`.
