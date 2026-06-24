"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Spotlight } from "@/registry/aurora/ui/spotlight"

// CD dsCard icons: 16px line glyphs sharing the Aurora stroke geometry.
function ic(children: React.ReactNode) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

// CD composition: the "Search the catalog" eyebrow + an lg Spotlight,
// auto-focused and open-on-focus, over a five-item grouped catalog.
export default function SpotlightDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <GalleryPageIntro
        eyebrow="Aurora Extensions"
        heading="Spotlight"
        description="Aurora extension — an inline expanding search field that opens a grouped results panel beneath itself. Arrow keys move the highlight; Enter activates."
      />
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--aurora-text-muted)",
            marginBottom: 12,
          }}
        >
          Search the catalog
        </div>
        <Spotlight
          size="lg"
          autoFocus
          openOnFocus
          defaultOpen
          shortcut="⌘K"
          placeholder="Search components, themes, tokens…"
          items={[
            {
              group: "Components",
              label: "Button",
              desc: "Border-and-glow control, six intents",
              tag: "shadcn",
              icon: ic(<rect x="3" y="8" width="18" height="8" rx="3" />),
              keywords: "cta action submit",
            },
            {
              group: "Components",
              label: "PromptInput",
              desc: "Agent composer with slash + @mentions",
              tag: "agent",
              icon: ic(<path d="m4 17 6-6-6-6M12 19h8" />),
              keywords: "chat textarea send",
            },
            {
              group: "Components",
              label: "Terminal",
              desc: "Typed log lines, status, cursor",
              tag: "agent",
              icon: ic(
                <>
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="m7 9 3 3-3 3" />
                </>,
              ),
              keywords: "shell console",
            },
            {
              group: "Themes",
              label: "Midnight Navy",
              desc: "The dark canon",
              tag: "theme",
              icon: ic(<circle cx="12" cy="12" r="9" />),
            },
            {
              group: "Tokens",
              label: "--aurora-accent-primary",
              desc: "#29b6f6 · the one accent",
              tag: "token",
              icon: ic(<circle cx="12" cy="12" r="9" />),
            },
          ]}
        />
      </div>
    </div>
  )
}
