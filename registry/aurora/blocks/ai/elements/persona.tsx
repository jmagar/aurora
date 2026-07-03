"use client"

/**
 * Aurora Persona — identity card (avatar, role, presence, capability chips) + compact row.
 * CD-parity standalone implementation (self-contained; the canonical shadcn file).
 */

import * as React from "react"
import { cn } from "@/lib/utils"

export type PersonaPresence = "online" | "busy" | "away" | "offline"

export interface PersonaProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  /** Role / one-line description under the name. */
  role?: string
  /** @deprecated alias for `role`. */
  description?: string
  presence?: PersonaPresence
  /** Capability chips (full variant only). */
  tags?: string[]
  /** Show the rose "AI" badge next to the name (full variant). */
  badge?: boolean
  variant?: "default" | "compact"
  /** Compact: render as a selected (rose-outlined) row. */
  selected?: boolean
}

const PRESENCE: Record<PersonaPresence, string> = {
  online: "var(--aurora-success)",
  busy: "var(--aurora-accent-pink)",
  away: "var(--aurora-warn)",
  offline: "var(--aurora-neutral)",
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?"
}

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

const Persona = React.forwardRef<HTMLDivElement, PersonaProps>(
  ({ name, role, description, presence, tags, badge = false, variant = "default", selected = false, className, onClick, ...props }, ref) => {
    const sub = role ?? description
    const dotColor = presence ? PRESENCE[presence] : null
    const isCompact = variant === "compact"
    const dotSize = isCompact ? 10 : 13

    const avatar = (
      <span className="aurora-persona__av" aria-hidden="true">
        {initials(name)}
        {dotColor ? (
          <span
            className="aurora-persona__dot"
            style={{ width: dotSize, height: dotSize, background: dotColor, boxShadow: `0 0 6px ${dotColor}` }}
          />
        ) : null}
      </span>
    )

    if (isCompact) {
      return (
        <div
          ref={ref}
          className={cn("aurora-persona aurora-persona--compact", selected && "aurora-persona--selected", onClick && "aurora-persona--clickable", className)}
          onClick={onClick}
          {...props}
        >
          {avatar}
          <span className="min-w-0">
            <span className="aurora-persona__name" style={{ display: "block" }}>{name}</span>
            {sub ? <span className="aurora-persona__role" style={{ display: "block", fontSize: 12.5 }}>{sub}</span> : null}
          </span>
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("aurora-persona aurora-persona--default", onClick && "aurora-persona--clickable", className)} onClick={onClick} {...props}>
        <div className="aurora-persona__head">
          {avatar}
          <span className="min-w-0" style={{ flex: 1 }}>
            <span className="aurora-persona__titlerow">
              <span className="aurora-persona__name" style={{ fontSize: 19 }}>{name}</span>
              {badge ? <span className="aurora-persona__aibadge">AI</span> : null}
            </span>
            {sub ? <span className="aurora-persona__role" style={{ display: "block", fontSize: 15 }}>{sub}</span> : null}
          </span>
          {presence ? (
            <span className="aurora-persona__status">
              <span style={{ width: 8, height: 8, borderRadius: 999, background: dotColor ?? "transparent", boxShadow: dotColor ? `0 0 6px ${dotColor}` : undefined }} />
              {presence}
            </span>
          ) : null}
        </div>
        {tags && tags.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {tags.map((t) => (
              <span key={t} className="aurora-persona__chip">{t}</span>
            ))}
          </div>
        ) : null}
      </div>
    )
  }
)
Persona.displayName = "Persona"

const MemoPersona = React.memo(Persona)
MemoPersona.displayName = "Persona"

export { MemoPersona as Persona }
export default MemoPersona
