import * as React from "react"
import { ComponentCatalog } from "@/components/site/component-catalog"

export const metadata = {
  title: "Components — Aurora design system",
  description:
    "The Aurora component catalog: every registry component rendered live, with fuzzy search, category filters, and one-line shadcn installs.",
}

export default function ComponentsPage() {
  return (
    <div style={{ paddingTop: 18 }}>
      <ComponentCatalog heading="Components" />
    </div>
  )
}
