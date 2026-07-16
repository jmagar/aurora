"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Listbox, ListboxGroup, ListboxItem } from "@/registry/aurora/ui/listbox"

interface GatewayDemoItem {
  id: string
  description: string
  meta: string
  disabled?: boolean
}

const gatewayGroups: Array<{
  heading: string
  items: GatewayDemoItem[]
}> = [
  {
    heading: "Primary Region",
    items: [
      { id: "edge-1", description: "us-east · healthy", meta: "42 ms" },
      { id: "edge-2", description: "us-west · healthy", meta: "51 ms" },
    ],
  },
  {
    heading: "Maintenance Window",
    items: [
      {
        id: "edge-3",
        description: "eu-central · patching in progress",
        meta: "Unavailable",
        disabled: true,
      },
    ],
  },
]

export default function ListboxDemo() {
  const [sel, setSel] = React.useState("edge-1")
  const selectedGateway = gatewayGroups
    .flatMap((group) => group.items)
    .find((gateway) => gateway.id === sel)

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
        <div className="grid gap-4 md:grid-cols-[360px_minmax(0,1fr)]">
          <Listbox style={{ maxWidth: 360 }}>
            {gatewayGroups.map((group) => (
              <ListboxGroup key={group.heading} heading={group.heading}>
                {group.items.map((gateway) => (
                  <ListboxItem
                    key={gateway.id}
                    title={gateway.id}
                    description={gateway.description}
                    meta={gateway.meta}
                    active={sel === gateway.id}
                    disabled={gateway.disabled}
                    onClick={() => setSel(gateway.id)}
                  />
                ))}
              </ListboxGroup>
            ))}
          </Listbox>

          <div
            className="grid gap-2"
            style={{
              alignContent: "start",
              borderRadius: "var(--aurora-radius-2)",
              border: "1px solid var(--aurora-border-default)",
              background: "var(--aurora-panel-medium)",
              padding: "18px 20px",
            }}
          >
            <p className="aurora-text-label" style={{ color: "var(--aurora-text-muted)", margin: 0 }}>
              Selected Gateway
            </p>
            <p className="aurora-text-section" style={{ margin: 0 }}>
              {selectedGateway?.id ?? "None"}
            </p>
            <p className="aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)", margin: 0 }}>
              {selectedGateway?.description ??
                "Use the listbox to inspect the available edge regions."}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
