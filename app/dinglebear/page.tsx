import type { Metadata, Viewport } from "next"

import registry from "@/registry.json"

import { DinglebearFleetPage } from "./fleet-page"
import "./dinglebear.css"

// dinglebear.ai is the umbrella home for the MCP server fleet AND the Aurora
// design system: proxy.ts rewrites the dinglebear.ai root to /dinglebear
// (this page) and passes every other path through to the full app, so
// /components, /themes, /gallery, /docs, and /r/*.json serve on that host
// too. See dinglebear/README.md for the tenant contract.

export const metadata: Metadata = {
  metadataBase: new URL("https://dinglebear.ai"),
  title: "dinglebear.ai — published Rust MCP servers",
  description:
    "Published Rust MCP servers for homelab, media, network, infrastructure, notifications, and observability workflows. One npx install path, stdio first.",
  openGraph: {
    title: "dinglebear.ai — published Rust MCP servers",
    description:
      "Published Rust MCP servers for homelab, media, network, infrastructure, notifications, and observability workflows.",
    url: "https://dinglebear.ai",
    siteName: "dinglebear.ai",
    type: "website",
  },
}

export const viewport: Viewport = {
  colorScheme: "dark",
}

export default function Page() {
  return <DinglebearFleetPage registryCount={registry.items.length} />
}
