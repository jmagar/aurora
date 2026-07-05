# Aurora Agent Skill

This registry item installs the Aurora design-system skill into the current project so Claude, Codex, Gemini, or another agent runtime can copy/adapt it.

Shadcn registry items install files only. They do not run shell commands.

For Claude Code plugin installation, install the Aurora plugin manually from the Aurora repo:

```bash
git clone https://github.com/jmagar/aurora-design-system.git
cd aurora-design-system
claude plugin install ./plugin
```

For Codex/Gemini, copy `SKILL.md` into the runtime-specific skill directory used by that tool.
