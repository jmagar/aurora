"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Command } from "@/registry/aurora/ui/command"

function ic(paths: React.ReactNode) {
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
      {paths}
    </svg>
  )
}

const items = [
  {
    group: "Actions",
    label: "New Session",
    description: "Start a fresh agent session",
    icon: ic(
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>,
    ),
    shortcut: "⌘N",
  },
  {
    group: "Actions",
    label: "Open Terminal",
    description: "Attach a shell to the workspace",
    icon: ic(<path d="m4 17 6-6-6-6M12 19h8" />),
    shortcut: "⌘J",
  },
  {
    group: "Navigation",
    label: "Go to Gateways",
    description: "MCP gateway registry",
    icon: ic(
      <>
        <rect x="2" y="3" width="20" height="6" rx="2" />
        <rect x="2" y="15" width="20" height="6" rx="2" />
      </>,
    ),
  },
  {
    group: "Navigation",
    label: "Switch Theme",
    description: "Toggle light / dark surfaces",
    icon: ic(
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4 12H2M22 12h-2" />
      </>,
    ),
  },
  {
    group: "Settings",
    label: "Manage API Keys",
    description: "Rotate provider credentials",
    icon: ic(
      <>
        <circle cx="7.5" cy="15.5" r="3.5" />
        <path d="m10 13 8-8 3 3M16 7l2 2" />
      </>,
    ),
    shortcut: "⌘K",
  },
]

export default function CommandDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="Aurora Extensions"
        heading="Command"
        description="A ⌘K command palette with a search header, group filter chips, an icon-and-description result list with keyboard navigation, and a live preview footer."
      />
      <Command defaultOpen placeholder="Type a command or search…" items={items} />
    </div>
  )
}
