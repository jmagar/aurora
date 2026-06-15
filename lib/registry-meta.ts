import registryData from "@/registry.json"
import { SLUG_TO_REGISTRY, slugToRegistry } from "@/lib/slug-map"

export { SLUG_TO_REGISTRY, slugToRegistry }

export interface RegistryMeta {
  name: string
  title: string
  description: string
  type: string
  dependencies: string[]
  registryDependencies: string[]
  installUrl: string
}

type RegistryItem = {
  name: string
  title?: string
  description?: string
  type: string
  dependencies?: string[]
  registryDependencies?: string[]
}

const REGISTRY_BASE_URL = "https://aurora.tootie.tv/r"

const items = (registryData as { items: RegistryItem[] }).items
const BY_NAME: Record<string, RegistryItem> = Object.fromEntries(
  items.map((item) => [item.name, item])
)

export const SECTION_TITLE_OVERRIDES: Record<string, string> = {
  colors: "Color tokens",
  type: "Typography",
  spacing: "Spacing & radii",
  brand: "Brand & mark",
  lightmode: "Light mode",
  oauth: "OAuth flow",
  kbd: "Kbd",
}

export const SECTION_REDIRECTS: Record<string, string> = {
  queue: "task",
  resizable: "resizable-panels",
  table: "tables",
}

export function formatSectionTitle(section: string) {
  const override = SECTION_TITLE_OVERRIDES[section]
  if (override) return override

  const words = section.split("-").map((word) => {
    if (word === "ai") return "AI"
    if (word === "otp") return "OTP"
    if (word === "jsx") return "JSX"
    return word.charAt(0).toUpperCase() + word.slice(1)
  })

  return words.join(" ")
}

export function getRegistryMeta(slug: string): RegistryMeta | null {
  // Slug → registry name resolution (incl. ai-{slug} fallback) lives in lib/slug-map.ts.
  const registryName = slugToRegistry(slug)

  if (!registryName) return null

  const item = BY_NAME[registryName]
  if (!item) return null

  return {
    name: item.name,
    title: item.title ?? item.name,
    description: item.description ?? "",
    type: item.type,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    installUrl: `${REGISTRY_BASE_URL}/${item.name}.json`,
  }
}
