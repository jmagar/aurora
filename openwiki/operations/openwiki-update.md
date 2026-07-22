# OpenWiki Update Workflow

## What changed

The scheduled OpenWiki update workflow in `.github/workflows/openwiki-update.yml` currently runs with:

- Node.js 22 via `actions/setup-node@v4`
- `npm install --global openwiki`
- `openwiki code --update --print`
- OpenRouter model execution (`OPENWIKI_PROVIDER=openrouter`, `OPENWIKI_MODEL_ID=z-ai/glm-5.2`) with LangSmith tracing env vars (`LANGSMITH_API_KEY`, `LANGCHAIN_PROJECT`, `LANGCHAIN_TRACING_V2`)
- Pull request generation via `peter-evans/create-pull-request` pinned to commit `22a9089034f40e5a961c8808d113e2c98fb63676`

## Files written by workflow

The PR creation step includes:

- `openwiki`
- `AGENTS.md`
- `CLAUDE.md`
- `.github/workflows/openwiki-update.yml`

## Historical note

This workflow used to rely on a self-hosted `openai-compatible` endpoint plus Tailscale bootstrap; those preflight/login steps were removed in favor of direct OpenRouter credentials and tracing.

## Why this matters for future updates

When the source changes in this repo are mostly operational (for example, this workflow and instruction files), update or regenerate only the OpenWiki pages that actually depend on those files to keep edits surgical.