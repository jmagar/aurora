import * as React from "react"
import { DocBody } from "@/components/site/docs-content"
import registry from "@/registry.json"

export const metadata = {
  title: "Docs — Aurora Design System",
  description:
    "Getting started with Aurora: install the token contract, build on the page shell, and follow the three principles — one palette, border + glow, calm status.",
}

export default function DocsStartPage() {
  return <DocBody page="start" counts={{ registryItems: registry.items.length }} />
}
