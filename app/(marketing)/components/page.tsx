import * as React from "react"
import { ComponentCatalog } from "@/components/site/component-catalog"
import { getKotlinMap } from "@/lib/kotlin-map"

export const metadata = {
  title: "Components — Aurora design system",
  description:
    "The Aurora component catalog: every registry component rendered live, with fuzzy search, category filters, a shadcn/Android flavor toggle, and one-line installs.",
}

export default function ComponentsPage() {
  return (
    <div style={{ paddingTop: 18 }}>
      <ComponentCatalog heading="Components" kotlinMap={getKotlinMap()} />
    </div>
  )
}
