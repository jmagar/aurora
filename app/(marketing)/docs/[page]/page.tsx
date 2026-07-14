import * as React from "react"
import { notFound } from "next/navigation"
import { DocBody, type DocPageId } from "@/components/site/docs-content"
import registry from "@/registry.json"

const PAGES: { id: Exclude<DocPageId, "start">; title: string; description: string }[] = [
  {
    id: "install",
    title: "Installation",
    description:
      "Install the Aurora token contract, add registry components with the shadcn CLI, and wire the Android Compose library.",
  },
  {
    id: "foundations",
    title: "Foundations",
    description:
      "Aurora's foundations: three surface lift tiers, three radii, tokenized color, the Manrope/Inter/JetBrains Mono type ramp, and calm motion.",
  },
  {
    id: "theming",
    title: "Theming",
    description:
      "Dark-first with a verified light remap, accent swapping on the token surface, and the Axon operation-tone override.",
  },
  {
    id: "voice",
    title: "Voice & Content",
    description:
      "Aurora's content rules: operator-to-operator, Title Case labels, factual status copy, no exclamation marks in chrome.",
  },
  {
    id: "contribute",
    title: "Contributing",
    description:
      "How to contribute to Aurora: the upstream registry is canonical, tokens originate in aurora.css, and new components register in registry.json.",
  },
]

export function generateStaticParams() {
  return PAGES.map((p) => ({ page: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const meta = PAGES.find((p) => p.id === page)
  if (!meta) return {}
  return {
    title: `${meta.title} — Aurora Design System`,
    description: meta.description,
  }
}

export default async function DocPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const meta = PAGES.find((p) => p.id === page)
  if (!meta) notFound()
  return <DocBody page={meta.id} counts={{ registryItems: registry.items.length }} />
}
