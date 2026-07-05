# Aurora Agent Skill

This registry item installs the Aurora design-system skill into the current project so Claude, Codex, Gemini, or another agent runtime can copy/adapt it.

Shadcn registry items install files only. They do not run shell commands.

For Claude Code plugin installation, install `aurora-plugin-installer` and then run the generated installer script from your project:

```bash
bash .config/aurora/agent/install-aurora-plugin.sh
```

For Codex/Gemini, copy or adapt the full `.config/aurora/agent/aurora-design-system/` directory into the runtime-specific skill directory used by that tool. Keep `SKILL.md` and the `references/` directory together; the skill expects those reference files to be present.
