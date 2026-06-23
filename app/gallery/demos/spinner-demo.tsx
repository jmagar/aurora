"use client"

import * as React from "react"
import { Spinner } from "@/registry/aurora/ui/spinner"

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

// CD dsCard chrome: a horizontal row of stacked cells.
const stage: React.CSSProperties = {
  background: "var(--aurora-page-bg)",
  color: "var(--aurora-text-primary)",
  boxSizing: "border-box",
  padding: 30,
  display: "flex",
  alignItems: "center",
  gap: 26,
  borderRadius: "var(--aurora-radius-2)",
  border: "1px solid var(--aurora-border-default)",
}

const cell: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
}

const caption: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10.5,
  color: "var(--aurora-text-muted)",
}

export default function SpinnerDemo() {
  return (
    <div style={{ display: "grid", gap: 24, padding: 0 }}>
      <div>
        <h2 style={heading}>Spinner</h2>
        <p style={copy}>700ms thinking curve — compact loading indicators for registry refreshes, agent runs, and background verification.</p>
      </div>

      <section style={stage}>
        <div style={cell}>
          <Spinner size={16} />
          <span style={caption}>16</span>
        </div>
        <div style={cell}>
          <Spinner size={24} />
          <span style={caption}>24</span>
        </div>
        <div style={cell}>
          <Spinner size={34} thickness={3} />
          <span style={caption}>34</span>
        </div>
        <div style={cell}>
          <Spinner size={24} style={{ color: "var(--aurora-accent-pink)" }} />
          <span style={caption}>rose</span>
        </div>
      </section>
    </div>
  )
}
