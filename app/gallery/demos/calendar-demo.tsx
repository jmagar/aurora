"use client"

import * as React from "react"
import { Calendar } from "@/registry/aurora/ui/calendar"

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

export default function CalendarDemo() {
  // Match the CD source: day 15 of the current month is the selected date.
  const initial = React.useMemo(() => {
    const d = new Date()
    d.setDate(15)
    return d
  }, [])
  const [selected, setSelected] = React.useState<Date>(initial)

  return (
    <div style={{ display: "grid", gap: 24, padding: 0 }}>
      <div>
        <h2 style={heading}>Calendar</h2>
        <p style={copy}>Month date picker with selected and current-day states.</p>
      </div>

      <div style={{ display: "grid", placeItems: "center", padding: 20 }}>
        <Calendar selected={selected} onSelect={setSelected} />
      </div>
    </div>
  )
}
