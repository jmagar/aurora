import type { BadgeTone } from "@/registry/aurora/ui/badge"

/**
 * Aurora theme catalog — single source of truth for the landing page and the
 * /themes hub. Source files live in `themes/{editors,browser,shell}/`; served
 * copies install from `aurora.tootie.tv`. Card previews are palette-faithful
 * renders generated from each theme's real colors (see docs/mockups).
 */

export type ThemeCategory = "editors" | "browser" | "shell"

export interface AuroraTheme {
  id: string
  name: string
  /** the tool this theme targets, e.g. "Zed editor + icon theme" */
  tool: string
  category: ThemeCategory
  badge?: { tone: BadgeTone; label: string }
  description: string
  /** one-line install / source pointer shown in the card */
  install: string
  /** served preview image (under /public) */
  preview: string
  /** repo path or download URL for the "Download" action */
  download: string
  /** path to the theme's README in the repo */
  readme: string
  /** repo-relative path to the README file (read at runtime for the dialog) */
  readmePath: string
  /** anchor colors for the per-card spectrum bar — each theme's real palette */
  spectrum: string[]
}

export const THEME_CATEGORIES: {
  id: ThemeCategory
  label: string
  blurb: string
}[] = [
  { id: "editors", label: "Editors", blurb: "Zed, Warp, and Claude Code." },
  { id: "browser", label: "Browser", blurb: "Google Chrome, dark and light." },
  { id: "shell", label: "Shell", blurb: "Prompt, statusline, pager, and color configs." },
]

export const AURORA_THEMES: AuroraTheme[] = [
  {
    id: "zed",
    name: "Aurora Neon",
    tool: "Zed editor + icon theme",
    category: "editors",
    badge: { tone: "info", label: "neon" },
    description:
      "A brighter, electric take on Aurora for Zed — dark + light UI themes plus a full 60-glyph file-icon set.",
    install: "zed: install dev extension",
    preview: "/themes/previews/zed.png",
    download: "/zed/aurora.json",
    readme: "https://github.com/jmagar/aurora/tree/main/themes/editors/zed",
    readmePath: "themes/editors/zed/README.md",
    spectrum: ["#102a3e", "#38d2ff", "#c4a5ff", "#5ef0d8", "#ffcf6b"],
  },
  {
    id: "warp",
    name: "Aurora",
    tool: "Warp terminal",
    category: "editors",
    badge: { tone: "info", label: "pop" },
    description:
      "The pop Aurora palette for Warp — lifted navy frame, vivid cyan, with a matching light variant.",
    install: "curl -O aurora.tootie.tv/warp/aurora.yaml",
    preview: "/themes/previews/warp.png",
    download: "/warp/aurora.yaml",
    readme: "https://github.com/jmagar/aurora/tree/main/themes/editors/warp",
    readmePath: "themes/editors/warp/README.md",
    spectrum: ["#07131c", "#4dc8fa", "#f0f8fd", "#f9a8c4", "#8fe6d8"],
  },
  {
    id: "claude-code",
    name: "Aurora",
    tool: "Claude Code CLI",
    category: "editors",
    badge: { tone: "success", label: "canonical" },
    description:
      "The origin theme every other surface aligns to — dark + light key parity for the Claude Code terminal UI.",
    install: "themes/editors/claude-code/aurora.json",
    preview: "/themes/previews/claude-code.png",
    download: "https://github.com/jmagar/aurora/blob/main/themes/editors/claude-code/aurora.json",
    readme: "https://github.com/jmagar/aurora/tree/main/themes/editors/claude-code",
    readmePath: "themes/editors/claude-code/README.md",
    spectrum: ["#07131c", "#36c9ff", "#a78bfa", "#7dd3c7", "#ff7eb6"],
  },
  {
    id: "chrome-dark",
    name: "Aurora",
    tool: "Google Chrome — dark",
    category: "browser",
    badge: { tone: "info", label: "MV3" },
    description:
      "A code-less Chrome theme on the pop palette: lifted navy chrome, vivid cyan, and an Aurora glow new-tab page.",
    install: "curl -O aurora.tootie.tv/chrome/aurora.zip",
    preview: "/themes/previews/chrome-dark.png",
    download: "/chrome/aurora.zip",
    readme: "https://github.com/jmagar/aurora/tree/main/themes/browser/chrome",
    readmePath: "themes/browser/chrome/README.md",
    spectrum: ["#0a1c2e", "#103154", "#4dc8fa", "#67cbfa", "#b39ddb"],
  },
  {
    id: "chrome-light",
    name: "Aurora Light",
    tool: "Google Chrome — light",
    category: "browser",
    badge: { tone: "info", label: "MV3" },
    description:
      "The light counterpart — cyan-tinted chrome on a clean Aurora light surface for bright environments.",
    install: "curl -O aurora.tootie.tv/chrome/aurora-light.zip",
    preview: "/themes/previews/chrome-light.png",
    download: "/chrome/aurora-light.zip",
    readme: "https://github.com/jmagar/aurora/tree/main/themes/browser/chrome",
    readmePath: "themes/browser/chrome/README.md",
    spectrum: ["#f5f9fc", "#dbe9f4", "#0288d1", "#0d2236", "#c2607f"],
  },
  {
    id: "p10k",
    name: "Aurora prompt",
    tool: "Powerlevel10k",
    category: "shell",
    description:
      "A two-line p10k prompt themed to Aurora — cyan path, rose git, muted status segments.",
    install: "source themes/shell/p10k/aurora-p10k.zsh",
    preview: "/themes/previews/p10k.png",
    download: "https://github.com/jmagar/aurora/blob/main/themes/shell/p10k/aurora-p10k.zsh",
    readme: "https://github.com/jmagar/aurora/tree/main/themes/shell/p10k",
    readmePath: "themes/shell/p10k/README.md",
    spectrum: ["#07131c", "#1c7fac", "#f9a8c4", "#c6a36b", "#7dd3c7"],
  },
  {
    id: "statusline",
    name: "Aurora statusline",
    tool: "Claude Code statusline",
    category: "shell",
    description:
      "The Claude Code statusline script, Aurora-tinted — model, branch, and context segments.",
    install: "themes/shell/statusline/statusline-aurora.sh",
    preview: "/themes/previews/statusline.png",
    download: "https://github.com/jmagar/aurora/blob/main/themes/shell/statusline/statusline-aurora.sh",
    readme: "https://github.com/jmagar/aurora/tree/main/themes/shell/statusline",
    readmePath: "themes/shell/statusline/README.md",
    spectrum: ["#0f2030", "#a78bfa", "#29b6f6", "#f9a8c4", "#7dd3c7"],
  },
  {
    id: "bat",
    name: "Aurora",
    tool: "bat — syntax theme",
    category: "shell",
    description: "A .tmTheme for bat/less highlighting tuned to the Aurora syntax palette.",
    install: "themes/shell/bat/Aurora.tmTheme",
    preview: "/themes/previews/bat.png",
    download: "https://github.com/jmagar/aurora/blob/main/themes/shell/bat/Aurora.tmTheme",
    readme: "https://github.com/jmagar/aurora/tree/main/themes/shell/bat",
    readmePath: "themes/shell/bat/README.md",
    spectrum: ["#07131c", "#29b6f6", "#a78bfa", "#7dd3c7", "#c6a36b"],
  },
  {
    id: "mc",
    name: "Aurora",
    tool: "Midnight Commander",
    category: "shell",
    description: "An .ini skin for mc — Aurora panels, selection glow, and dialog colors.",
    install: "themes/shell/mc/aurora.ini",
    preview: "/themes/previews/mc.png",
    download: "https://github.com/jmagar/aurora/blob/main/themes/shell/mc/aurora.ini",
    readme: "https://github.com/jmagar/aurora/tree/main/themes/shell/mc",
    readmePath: "themes/shell/mc/README.md",
    spectrum: ["#07131c", "#29b6f6", "#1c7fac", "#f0f8fd", "#a78bfa"],
  },
  {
    id: "nano",
    name: "Aurora",
    tool: "nano",
    category: "shell",
    description: "A nanorc syntax + UI theme bringing Aurora colors to the nano editor.",
    install: "themes/shell/nano/nanorc",
    preview: "/themes/previews/nano.png",
    download: "https://github.com/jmagar/aurora/blob/main/themes/shell/nano/nanorc",
    readme: "https://github.com/jmagar/aurora/tree/main/themes/shell/nano",
    readmePath: "themes/shell/nano/README.md",
    spectrum: ["#07131c", "#29b6f6", "#38d2ff", "#c9a6f0", "#b8e6a0"],
  },
  {
    id: "zsh",
    name: "Aurora colors",
    tool: "zsh — eza, dircolors, fzf",
    category: "shell",
    description:
      "A bundle of zsh color configs: eza, LS_COLORS, fzf default opts, and fast-syntax-highlighting.",
    install: "source themes/shell/zsh/aurora-fzf.zsh",
    preview: "/themes/previews/zsh.png",
    download: "https://github.com/jmagar/aurora/tree/main/themes/shell/zsh",
    readme: "https://github.com/jmagar/aurora/tree/main/themes/shell/zsh",
    readmePath: "themes/shell/zsh/README.md",
    spectrum: ["#07131c", "#29b6f6", "#67cbfa", "#7dd3c7", "#f9a8c4"],
  },
]

/** The canonical Aurora palette, as a token-name list for the spectrum rail. */
export const AURORA_SPECTRUM: string[] = [
  "--aurora-accent-deep",
  "--aurora-accent-primary",
  "--aurora-accent-strong",
  "--aurora-success",
  "--aurora-accent-violet",
  "--aurora-accent-violet-strong",
  "--aurora-accent-pink",
  "--aurora-accent-pink-strong",
  "--aurora-warn",
  "--aurora-error",
]

export const themeCounts = {
  editors: AURORA_THEMES.filter((t) => t.category === "editors").length,
  browser: AURORA_THEMES.filter((t) => t.category === "browser").length,
  shell: AURORA_THEMES.filter((t) => t.category === "shell").length,
}
