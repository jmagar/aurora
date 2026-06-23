"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Chart, type ChartDatum } from "@/registry/aurora/ui/chart"

// CD dsCard demo chrome ported as inline styles.
const cell: React.CSSProperties = {
  background:
    "linear-gradient(180deg, var(--aurora-panel-strong-top), var(--aurora-panel-strong))",
  border: "1px solid var(--aurora-border-strong)",
  borderRadius: "var(--radius-2, 18px)",
  padding: "14px",
  boxShadow: "var(--aurora-shadow-medium), inset 0 1px 0 rgba(255,255,255,.045)",
}

const lbl: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--aurora-text-muted)",
  margin: "0 0 10px",
}

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px",
}

const toData = (values: number[]): ChartDatum[] =>
  values.map((value) => ({ label: "", value }))

// CD composition: two token-styled cells in a 2-col grid.
const requestsData = toData([12, 19, 14, 23, 18, 27, 21, 30])
const latencyData = toData([40, 38, 44, 36, 33, 35, 30, 28])

export default function ChartDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <GalleryPageIntro
        eyebrow="Workspace"
        heading="Chart"
        description="Token-styled bar, line, and area charts. Gradient fills track the Aurora accent; any series color is overridable."
      />
      <div style={grid}>
        <div style={cell}>
          <div style={lbl}>Requests / hour</div>
          <Chart type="bar" data={requestsData} />
        </div>
        <div style={cell}>
          <div style={lbl}>P99 latency</div>
          <Chart type="area" color="var(--aurora-success)" data={latencyData} />
        </div>
      </div>
    </div>
  )
}
