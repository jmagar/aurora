"use client"

import * as React from "react"
import { NavigationMenu, NavigationMenuItem } from "@/registry/aurora/ui/navigation-menu"

const heading: React.CSSProperties = {
  color: "var(--aurora-text-primary)",
  fontFamily: "var(--aurora-font-display)",
  fontSize: 22,
  fontWeight: 760,
  lineHeight: 1.2,
  marginBottom: 6,
}

const copy: React.CSSProperties = {
  color: "var(--aurora-text-muted)",
  fontSize: 13,
  lineHeight: 1.55,
}

const items: ReadonlyArray<readonly [string, string]> = [
  ["overview", "Overview"],
  ["logs", "Logs"],
  ["metrics", "Metrics"],
  ["config", "Config"],
]

export default function NavigationMenuDemo() {
  const [active, setActive] = React.useState("overview")

  return (
    <div style={{ display: "grid", gap: 24, padding: 0 }}>
      <div>
        <h2 style={heading}>Navigation Menu</h2>
        <p style={copy}>Nav rail with an active item.</p>
      </div>

      <NavigationMenu>
        {items.map(([key, label]) => (
          <NavigationMenuItem
            key={key}
            href="#"
            active={active === key}
            onClick={(e) => {
              e.preventDefault()
              setActive(key)
            }}
          >
            {label}
          </NavigationMenuItem>
        ))}
      </NavigationMenu>
    </div>
  )
}
