import type * as React from "react"

/**
 * Pure Aurora style helpers — NO "use client". Safe to import from both server
 * and client components. (Exports of a "use client" module become client
 * references and can't be invoked during server render.)
 */

/** tokenized tint helper — never raw hex in product code */
export const tint = (v: string, pct: number) =>
  `color-mix(in srgb, var(${v}) ${pct}%, transparent)`

/** Tier-2 panel surface (inspectors / primary content) */
export const panelStrong: React.CSSProperties = {
  background: "var(--aurora-panel-strong)",
  border: "1px solid var(--aurora-border-strong)",
  boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
}
