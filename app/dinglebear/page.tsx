import type { Metadata, Viewport } from "next"

import { DinglebearFleetPage } from "./fleet-page"
import "./dinglebear.css"

// dinglebear.ai is a co-hosted tenant of this app: proxy.ts rewrites the
// dinglebear.ai host to /dinglebear, which renders this page. Unlike the old
// static-HTML tenant, the page is Aurora-native — it composes registry
// components directly. See dinglebear/README.md for the tenant contract.

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
  return <DinglebearFleetPage />
}
