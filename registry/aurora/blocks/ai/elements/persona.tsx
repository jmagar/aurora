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

const CSS = `
.aurora-persona { display: flex; align-items: flex-start; gap: 13px; box-sizing: border-box; color: var(--aurora-text-primary); font-family: var(--font-sans, Inter, sans-serif); }
.aurora-persona__av { position: relative; flex-shrink: 0; display: grid; place-items: center; font-family: var(--font-display, Manrope, sans-serif); font-weight: 800; letter-spacing: -0.01em; color: var(--aurora-accent-pink); background: color-mix(in srgb, var(--aurora-accent-pink) 16%, var(--aurora-control-surface)); border: 1px solid color-mix(in srgb, var(--aurora-accent-pink) 38%, var(--aurora-border-strong)); }
.aurora-persona__dot { position: absolute; right: -2px; bottom: -2px; border-radius: 999px; border: 2px solid var(--aurora-panel-strong); }
.aurora-persona__name { font-family: var(--font-display, Manrope, sans-serif); font-weight: 800; letter-spacing: -0.02em; color: var(--aurora-text-primary); }
.aurora-persona__role { color: var(--aurora-text-muted); margin-top: 2px; }
.aurora-persona__aibadge { display: inline-flex; align-items: center; font-family: var(--font-mono, monospace); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--aurora-accent-pink); background: color-mix(in srgb, var(--aurora-accent-pink) 12%, transparent); border: 1px solid color-mix(in srgb, var(--aurora-accent-pink) 30%, transparent); border-radius: 5px; font-size: 10px; padding: 2px 6px; }
.aurora-persona__status { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono, monospace); font-size: 10.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--aurora-text-muted); }
.aurora-persona__chip { font-family: var(--font-mono, monospace); font-size: 11px; color: var(--aurora-text-muted); background: var(--aurora-control-surface); border: 1px solid var(--aurora-border-default); border-radius: 6px; padding: 3px 9px; }

/* full card */
.aurora-persona--default { background: linear-gradient(180deg, var(--aurora-panel-strong-top), var(--aurora-panel-strong)); border: 1px solid color-mix(in srgb, var(--aurora-border-default) 55%, var(--aurora-page-bg)); border-radius: var(--radius-3, 22px); box-shadow: var(--aurora-shadow-strong), var(--aurora-highlight-strong); padding: 16px 18px; flex-direction: column; gap: 12px; }
.aurora-persona--default .aurora-persona__av { width: 48px; height: 48px; border-radius: 13px; font-size: 16px; }
.aurora-persona__head { display: flex; align-items: flex-start; gap: 13px; }
.aurora-persona__titlerow { display: flex; align-items: center; gap: 9px; }

/* compact row */
.aurora-persona--compact { align-items: center; gap: 11px; background: var(--aurora-control-surface); border: 1px solid var(--aurora-border-default); border-radius: var(--radius-2, 18px); padding: 11px 14px; transition: border-color 150ms var(--motion-ease-out, ease), background 150ms var(--motion-ease-out, ease); }
.aurora-persona--compact.aurora-persona--selected { border-color: color-mix(in srgb, var(--aurora-accent-pink) 60%, var(--aurora-border-strong)); background: color-mix(in srgb, var(--aurora-accent-pink) 8%, var(--aurora-control-surface)); box-shadow: 0 0 0 1px color-mix(in srgb, var(--aurora-accent-pink) 24%, transparent); }
.aurora-persona--compact .aurora-persona__av { width: 38px; height: 38px; border-radius: 11px; font-size: 13px; }
.aurora-persona--compact .aurora-persona__name { font-size: 14px; }
.aurora-persona--clickable { cursor: pointer; }
`

let injected = false
function ensureCSS() {
  if (injected || typeof document === "undefined") return
  const el = document.createElement("style")
  el.setAttribute("data-aurora-persona", "")
  el.textContent = CSS
  document.head.appendChild(el)
  injected = true
}

const Persona = React.forwardRef<HTMLDivElement, PersonaProps>(
  ({ name, role, description, presence, tags, badge = false, variant = "default", selected = false, className, onClick, ...props }, ref) => {
    React.useEffect(() => {
      ensureCSS()
    }, [])
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
