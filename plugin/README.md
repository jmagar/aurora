# aurora

Claude Code plugin packaging the Aurora design system skill — dark-first, navy
base with cyan/rose/violet accents, served from the `@aurora` shadcn registry at
`aurora.tootie.tv`.

## Installation

```bash
claude plugin install ./plugin
```

## Commands

| Command | Description |
| ------- | ----------- |
| (none yet) | — |

## Agents

(none yet)

## Skills

| Skill | Description |
| ----- | ----------- |
| `aurora-design-system` | Build, modify, or style React/Next.js UI for Aurora/Labby/Lab surfaces using Aurora tokens and the `@aurora` registry. |

## Development

```
plugin/
├── .claude-plugin/plugin.json   — Plugin manifest
├── agents/                      — Subagent definitions
├── bin/                         — Executable scripts
├── commands/                    — Slash command .md files
├── hooks/                       — Pre/PostToolUse hooks
├── monitors/                    — Background monitors
├── output-styles/               — Output formatting styles
├── scripts/                     — Helper scripts
├── skills/                      — Skill .md files
│   └── aurora-design-system/    — Aurora usage skill (SKILL.md + references/)
├── .mcp.json                    — MCP server configuration
├── CHANGELOG.md
└── README.md
```
