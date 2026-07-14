import * as React from "react"

import { PluginsView } from "@/components/site/plugins-view"

export const metadata = {
  title: "Plugins — dendrite Marketplace",
  description:
    "The dendrite plugin marketplace for Claude Code, Codex, and Gemini CLI: agent skills, MCP integrations, hooks, commands, and companion agents.",
}

export default function PluginsPage() {
  return <PluginsView />
}
