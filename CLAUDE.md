# Project Instructions for AI Agents

This file provides instructions and context for AI coding agents working on this project.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->


## Build & Test

```bash
pnpm install
pnpm dev                  # Next dev server (Turbopack)
pnpm build                # Production Next build
pnpm lint                 # ESLint (flat config)
pnpm registry:build       # Rebuild shadcn registry JSON → public/r/*.json
pnpm tokens:generate      # Export Aurora tokens + run Android Style Dictionary
pnpm audit:composition    # Check registry composition rules
```

## Architecture Overview

Aurora is a **shadcn-compatible component registry** (128 items) served as a
Next.js 16 / React 19 / Tailwind v4 app at `aurora.tootie.tv`. The site doubles
as a gallery and a live registry endpoint — `/` content-negotiates between
browser (gallery) and shadcn CLI (registry JSON from `public/r/*.json`).

- `app/` — Next.js App Router (gallery UI, root content negotiation)
- `registry/aurora/styles/` — Aurora token layer (`aurora.css`, CSS custom properties)
- `registry/aurora/ui/` — 64 shadcn UI primitives recolored to Aurora tokens
- `registry/aurora/blocks/{ai,auth,feedback,files,navigation,workspace}` — composed product blocks
- `android/` — Style Dictionary output for native parity
- `scripts/` — `export-aurora-tokens.mjs`, `audit-composition.mjs`
- `registry.json` — shadcn registry manifest (source of truth for the build)

## Conventions & Patterns

- **Dark-first.** Navy base `#07131c`; accents = Cyan (primary), Rose (secondary), Violet (AI).
- **Always use Aurora tokens** via CSS custom properties — no raw Tailwind color defaults.
- **Registry changes require rebuild.** After editing anything in `registry/aurora/**`,
  run `pnpm registry:build` so `public/r/*.json` stays in sync.
- **Token changes are cross-platform.** Edits to `registry/aurora/styles/aurora.css`
  must be followed by `pnpm tokens:generate` to refresh Android outputs.
- **Package manager: pnpm** (`packageManager: pnpm@10.33.2`). Do not introduce npm/yarn lockfiles.
- **Non-interactive shell.** Use `cp -f`, `mv -f`, `rm -f`, `rm -rf` — see `AGENTS.md`.
- **See also:** `AGENTS.md` (agent shell rules), `SKILL.md` (Aurora usage skill),
  `docs/component-kotlin-map.md` (Kotlin/Compose parity matrix).
