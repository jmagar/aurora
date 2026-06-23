"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"
import { Item } from "@/registry/aurora/ui/item"

function Dot({ c }: { c: string }) {
  return (
    <span
      style={{
        width: 16,
        height: 16,
        borderRadius: 5,
        display: "inline-block",
        background: `color-mix(in srgb, ${c} 30%, transparent)`,
        border: `1px solid ${c}`,
      }}
    />
  )
}

function ActButton({ children }: { children: React.ReactNode }) {
  return (
    <Button variant="plain" size="unstyled"
      type="button"
      style={{
        height: 26,
        padding: "0 11px",
        borderRadius: 7,
        border: "1px solid var(--aurora-border-strong)",
        background: "var(--aurora-control-surface)",
        color: "var(--aurora-text-primary)",
        font: "560 12px var(--aurora-font-sans)",
        cursor: "pointer",
      }}
    >
      {children}
    </Button>
  )
}

export default function ItemDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "26px 30px",
        background: "var(--aurora-page-bg)",
        color: "var(--aurora-text-primary)",
        borderRadius: "var(--aurora-radius-2)",
        border: "1px solid var(--aurora-border-default)",
      }}
    >
      <Item
        icon={<Dot c="var(--aurora-success)" />}
        title="edge-1"
        description="gateway · 200 OK"
        action={<ActButton>Logs</ActButton>}
      />
      <Item
        icon={<Dot c="var(--aurora-error)" />}
        title="edge-3"
        description="gateway · 502"
        action={<ActButton>Restart</ActButton>}
      />
    </div>
  )
}
