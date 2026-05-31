import * as React from "react"
import { ThemesGrid } from "@/components/site/themes-grid"

export const metadata = {
  title: "Themes — Aurora everywhere you work",
  description:
    "Aurora themes for your editor, terminal, browser, and shell: Zed, Warp, Claude Code, Chrome, Powerlevel10k, bat, Midnight Commander, nano, and zsh — the same palette, every surface.",
}

export default function ThemesPage() {
  return <ThemesGrid />
}
