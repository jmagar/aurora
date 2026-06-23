"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Listbox, ListboxGroup, ListboxItem } from "@/registry/aurora/ui/listbox"

const gateways = [
  { id: "edge-1", description: "us-east · healthy", meta: "42ms" },
  { id: "edge-2", description: "us-west · healthy", meta: "51ms" },
  { id: "edge-3", description: "eu · degraded", meta: "502" },
]

export default function ListboxDemo() {
  const [sel, setSel] = React.useState("edge-1")
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="Components"
        heading="Listbox"
        description="A selectable list of options grouped under a heading, each row carrying a title, supporting description, and trailing meta value."
      />
      <section
        style={{
          boxSizing: "border-box",
          padding: "30px 30px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          color: "var(--aurora-text-primary)",
        }}
      >
        <Listbox style={{ maxWidth: 360 }}>
          <ListboxGroup heading="Gateways">
            {gateways.map((g) => (
              <ListboxItem
                key={g.id}
                title={g.id}
                description={g.description}
                meta={g.meta}
                active={sel === g.id}
                onClick={() => setSel(g.id)}
              />
            ))}
          </ListboxGroup>
        </Listbox>
      </section>
    </div>
  )
}
