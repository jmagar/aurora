"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

/**
 * Docs content — ported from the CD `aurora-site` docs pages. Six hand-authored
 * pages (start, install, foundations, theming, voice, contribute). Registry
 * counts arrive as props from the server pages so the copy can never drift
 * from `registry.json`.
 */

export type DocPageId = "start" | "install" | "foundations" | "theming" | "voice" | "contribute"

export interface DocCounts {
  registryItems: number
}

const MODERN_REGISTRY_COMMANDS = [
  ["Base", "npx shadcn@latest add https://aurora.tootie.tv/r/aurora-base.json"],
  ["Terminal Page", "npx shadcn@latest add https://aurora.tootie.tv/r/aurora-terminal.json"],
  ["Gateway Page", "npx shadcn@latest add https://aurora.tootie.tv/r/aurora-gateway.json"],
  ["Chat Page", "npx shadcn@latest add https://aurora.tootie.tv/r/aurora-chat.json"],
  ["Zed Theme File", "npx shadcn@latest add https://aurora.tootie.tv/r/aurora-zed-theme.json"],
  ["Agent Skill", "npx shadcn@latest add https://aurora.tootie.tv/r/aurora-agent-skill.json"],
]

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--aurora-font-display)",
        fontWeight: 800,
        fontSize: 22,
        letterSpacing: "-0.03em",
        margin: "32px 0 12px",
        color: "var(--aurora-text-primary)",
      }}
    >
      {children}
    </h2>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 14.5,
        lineHeight: 1.7,
        color: "var(--aurora-text-muted)",
        margin: "0 0 14px",
        textWrap: "pretty",
      }}
    >
      {children}
    </p>
  )
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: "var(--aurora-text-primary)" }}>{children}</strong>
}

function M({ children }: { children: React.ReactNode }) {
  return (
    <span className="aurora-text-code" style={{ fontSize: 13, color: "var(--aurora-accent-strong)" }}>
      {children}
    </span>
  )
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--aurora-text-muted)", marginBottom: 7 }}>
      {children}
    </li>
  )
}

/** Click-to-copy code line (CD `Code`). */
function DocCode({ children }: { children: string }) {
  const [done, setDone] = React.useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(children)
        setDone(true)
        setTimeout(() => setDone(false), 1200)
      }}
      className="mb-4 flex w-full items-center gap-2.5 rounded-[var(--aurora-radius-1)] px-3.5 py-3 text-left"
      style={{
        cursor: "pointer",
        background: "var(--aurora-panel-strong)",
        border: "1px solid var(--aurora-border-strong)",
        boxShadow: "var(--aurora-shadow-subtle), var(--aurora-highlight-medium)",
      }}
    >
      <span
        className="aurora-text-code flex-1"
        style={{ fontSize: 12.5, color: "var(--aurora-text-primary)", whiteSpace: "pre-wrap", wordBreak: "break-all" }}
      >
        {children}
      </span>
      {done ? (
        <Check size={13} strokeWidth={2} style={{ color: "var(--aurora-success)", flexShrink: 0 }} />
      ) : (
        <Copy size={13} strokeWidth={1.75} style={{ color: "var(--aurora-text-muted)", flexShrink: 0 }} />
      )}
    </button>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="aurora-text-eyebrow">{children}</span>
}

function StartPage() {
  return (
    <div>
      <Eyebrow>Getting Started</Eyebrow>
      <h1
        style={{
          fontFamily: "var(--aurora-font-display)",
          fontWeight: 800,
          fontSize: 38,
          letterSpacing: "-0.04em",
          margin: "10px 0 14px",
          color: "var(--aurora-text-primary)",
        }}
      >
        Aurora
      </h1>
      <P>
        Operator-first, dark-first design language for agent products. A tokenized navy/cyan system
        built for terminals, dashboards, AI chat, and dense data surfaces — not marketing pages. It
        is the inside of a high-trust operator console.
      </P>
      <H>Quickstart</H>
      <P>
        Add the token contract, then start building on the page shell. Every page opens with the
        two-radial cyan wash — the brand.
      </P>
      <DocCode>npx shadcn@latest add https://aurora.tootie.tv/r/aurora-base.json</DocCode>
      <P>Then reach for a component from the registry:</P>
      <DocCode>npx shadcn@latest add https://aurora.tootie.tv/r/aurora-button.json</DocCode>
      <H>Three Principles</H>
      <ul style={{ paddingLeft: 18, margin: 0 }}>
        <Li>
          <Strong>One palette, every surface.</Strong> The same tokens dress the app, your editor,
          terminal, and shell.
        </Li>
        <Li>
          <Strong>Border + glow, never flooded fill.</Strong>{" "}
          Selection and focus wrap the edge, they don&apos;t paint the middle.
        </Li>
        <Li>
          <Strong>Status is calm.</Strong> A successful deploy looks measured, not Vegas. No neon,
          no exclamation marks.
        </Li>
      </ul>
    </div>
  )
}

function InstallPage({ counts }: { counts: DocCounts }) {
  return (
    <div>
      <Eyebrow>Installation</Eyebrow>
      <H>Tokens First</H>
      <P>
        The registry is shadcn-compatible. Install the token contract once; it defines every Aurora
        custom property on <M>:root</M> plus the <M>.light</M> remap.
      </P>
      <DocCode>npx shadcn@latest add https://aurora.tootie.tv/r/aurora-tokens.json</DocCode>
      <H>Layer Order (Tailwind v4)</H>
      <P>
        Aurora ships component base styles in <M>@layer aurora-components</M> so your Tailwind
        utilities always win over them. Declare the layer order once, on the first line of your
        globals — <Strong>above</Strong> <M>@import &quot;tailwindcss&quot;</M>. Skip it and the
        layer lands after <M>utilities</M>, so utilities can no longer override component styles.
      </P>
      <DocCode>@layer theme, base, components, aurora-components, utilities;</DocCode>
      <H>Per Component</H>
      <P>
        Each of the {counts.registryItems} registry items installs the same way — primitives and
        composed blocks alike.
      </P>
      <DocCode>npx shadcn@latest add https://aurora.tootie.tv/r/aurora-prompt-input.json</DocCode>
      <H>Modern Registry Capabilities</H>
      <P>
        Aurora also publishes a base bundle, starter pages, project-local theme files, and agent
        artifacts through the same shadcn registry.
      </P>
      <div className="mb-4 grid gap-2">
        {MODERN_REGISTRY_COMMANDS.map(([label, command]) => (
          <div key={label}>
            <div className="aurora-text-label mb-1" style={{ color: "var(--aurora-text-muted)" }}>
              {label}
            </div>
            <DocCode>{command}</DocCode>
          </div>
        ))}
      </div>
      <P>
        Shadcn file targets are project-root scoped. Items that install under{" "}
        <M>~/.config/aurora</M> create files inside the current project, not inside your real home
        directory.
      </P>
      <H>Android</H>
      <P>
        Tokens export to Android via Style Dictionary as a Compose <M>Color</M> palette and{" "}
        <M>dimens</M>; the <M>tv.tootie.aurora:aurora</M> library wraps them in{" "}
        <M>AuroraTheme</M>. The same names carry across — <M>aurora_accent_primary</M>,{" "}
        <M>aurora_radius_3</M>.
      </P>
      <H>The Page Shell</H>
      <P>
        Start every page on <M>class=&quot;aurora-page-shell&quot;</M>. Build working areas on
        Tier-2 panels: 22px radius, strong border, strong shadow, inset top highlight.
      </P>
    </div>
  )
}

function FoundationsPage() {
  return (
    <div>
      <Eyebrow>Foundations</Eyebrow>
      <H>Surfaces — Three Lift Tiers</H>
      <P>
        <Strong>Tier 0</Strong> is the page, flat, with the two-radial wash. <Strong>Tier 1</Strong>{" "}
        is toolbars and rails — medium shadow + 3.5% inset highlight. <Strong>Tier 2</Strong> is
        panels and cards — strong shadow, 5% inset highlight, 22px radius, strong border.
      </P>
      <H>Radii — Three Tokens</H>
      <P>
        14 / 18 / 22px, and nothing else. Badges are sharp at 4px, tables 8px on the wrapper. Pill
        (999px) is reserved for switches, status dots, and scrollbar thumbs.
      </P>
      <H>Color</H>
      <P>
        Cyan is primary, rose is secondary, Axon orange is the AI/automation tone. Status is muted —
        success, warn, error, info each resolve as foreground / 12% surface / 34% border. Never raw
        hex; reach for tokens or <M>color-mix()</M>.
      </P>
      <H>Type</H>
      <P>
        Manrope for display, Inter for UI, JetBrains Mono for code and IDs. Body 14, ui 13, label
        12, caption 11. Weights are non-standard — body 480, ui 560, label 650, heading 760.
      </P>
      <H>Motion</H>
      <P>
        150ms ease-out is the default. No bounces, no scale-up enthusiasm. Skeletons and thinking
        indicators use a slow 700ms rotation. Reduced motion collapses durations to 1ms.
      </P>
    </div>
  )
}

function ThemingPage() {
  return (
    <div>
      <Eyebrow>Theming</Eyebrow>
      <H>Dark-First, Light Verified</H>
      <P>
        The canonical visual is dark. <M>.light</M> is a real, supported remap on the same token
        surface — it overrides only the raw Aurora vars, so every semantic token still resolves.
      </P>
      <DocCode>{'<html class="light">  /* same tokens, lighter values */'}</DocCode>
      <H>Swap the Accent</H>
      <P>
        Override <M>--aurora-accent-primary</M> and its <M>-strong</M> / <M>-deep</M> partners to
        re-tone the whole system. Selection, focus, links, and primary actions all follow.
      </P>
      <H>Every Surface</H>
      <P>
        The palette is hand-ported beyond the app: Zed, Warp, Claude Code, Chrome, and six shell
        tools. See the Themes tab — install any in one line.
      </P>
      <H>Axon Override</H>
      <P>
        Axon drops violet and runs operation tones as cyan = fetch/read and orange = AI/reasoning
        plus async/heavy jobs, with rose reserved for secondary expressive actions. The registry <M>OperationIcon</M> derives the tone from the operation
        name.
      </P>
    </div>
  )
}

function VoicePage() {
  return (
    <div>
      <Eyebrow>Voice &amp; Content</Eyebrow>
      <H>Operator-to-Operator</H>
      <P>
        Matter-of-fact. Reads like good devops copy — like <M>journalctl</M> decided to talk back.
        Title Case for labels — buttons, headers, table columns, menu items, tabs, section titles —
        never all-lowercase. Sentence case only for full-sentence body, help, and status copy.
        Uppercase reserved for eyebrows and badge labels at 0.18em tracking.
      </P>
      <H>Status Copy Is Factual</H>
      <ul style={{ paddingLeft: 18, margin: "0 0 14px" }}>
        <Li>
          <M>Backend unavailable.</M>
        </Li>
        <Li>
          <M>Plex authorized.</M>
        </Li>
        <Li>
          <M>Deploy completed with warnings. 2/3 replicas healthy.</M>
        </Li>
      </ul>
      <H>The Rules</H>
      <ul style={{ paddingLeft: 18, margin: 0 }}>
        <Li>No exclamation marks in chrome. Period.</Li>
        <Li>No &quot;we&quot;, no apology framing, no marketing verbs. Write &quot;Available now.&quot;</Li>
        <Li>
          No celebratory adjectives — replace &quot;blazing-fast&quot; with the measurement
          (&quot;P99 42ms&quot;).
        </Li>
        <Li>Numbers as numbers. Mono earns its slot: paths, IDs, hashes, response codes.</Li>
        <Li>Empty states name the missing thing and the next action. No platitudes.</Li>
      </ul>
    </div>
  )
}

function ContributePage() {
  return (
    <div>
      <Eyebrow>Contributing</Eyebrow>
      <H>The Upstream Is Canonical</H>
      <P>
        Component implementations live in the open-source registry. If you need a primitive Aurora
        ships that isn&apos;t here, pull it from source rather than re-implementing.
      </P>
      <DocCode>github.com/jmagar/aurora</DocCode>
      <H>Token Source of Truth</H>
      <P>
        All tokens originate in <M>registry/aurora/styles/aurora.css</M>. Change a value there;
        everything downstream — components, themes, Android exports — follows.
      </P>
      <H>Adding a Component</H>
      <P>
        Build on Tier-2 panels, type from the ramp, Lucide icons at 1.5–1.75px. Selection and focus
        are border + glow. Then register it in <M>registry.json</M> and run{" "}
        <M>pnpm registry:build</M> so <M>npx shadcn add</M> resolves it.
      </P>
    </div>
  )
}

export function DocBody({ page, counts }: { page: DocPageId; counts: DocCounts }) {
  switch (page) {
    case "start":
      return <StartPage />
    case "install":
      return <InstallPage counts={counts} />
    case "foundations":
      return <FoundationsPage />
    case "theming":
      return <ThemingPage />
    case "voice":
      return <VoicePage />
    case "contribute":
      return <ContributePage />
  }
}
