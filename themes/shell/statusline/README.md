# Aurora Claude Code statusline

A two-line statusline for [Claude Code](https://code.claude.com), bash + jq,
24-bit ANSI. Reads the status JSON on stdin (single read, single jq parse).

- **Line 1:** `model · dir · branch ± ⑂wt · ❖ output-style`
- **Line 2:** `context-bar % tokens · 5h limit · wk limit · +added/-removed`

Bars and rate-limits escalate **cyan (<60) → rose (60–84) → deep-rose (≥85)**.
Model cyan, dir white (muted parents), branch rose, dirty rose-deep,
separators deep-blue — the same roles as the p10k prompt.

## Install

```sh
cp themes/shell/statusline/statusline-aurora.sh ~/.claude/statusline-aurora.sh
chmod +x ~/.claude/statusline-aurora.sh
```

`~/.claude/settings.json`:

```json
{ "statusLine": { "type": "command", "command": "~/.claude/statusline-aurora.sh", "padding": 0 } }
```

Requires `jq` and a truecolor terminal.

## Source of truth

`themes/shell/statusline/statusline-aurora.sh` is canonical; `~/.claude/statusline-aurora.sh`
is a deployed copy.
