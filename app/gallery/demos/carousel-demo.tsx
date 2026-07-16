"use client"

import * as React from "react"
import { Carousel, CarouselItem } from "@/registry/aurora/ui/carousel"

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

const deploys: Array<[string, string]> = [
  ["edge-1", "42ms"],
  ["edge-2", "51ms"],
  ["edge-3", "88ms"],
  ["edge-4", "37ms"],
]

const itemName: React.CSSProperties = {
  fontFamily: "var(--aurora-font-display)",
  fontWeight: 800,
  fontSize: 18,
  letterSpacing: "-0.02em",
  color: "var(--aurora-text-primary)",
}

const statusRow: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontFamily: "var(--aurora-font-sans)",
  fontSize: "var(--aurora-type-body-sm)",
  fontWeight: "var(--aurora-weight-ui)" as React.CSSProperties["fontWeight"],
  color: "var(--aurora-success)",
  marginTop: 8,
}

const dot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: "var(--aurora-success)",
  boxShadow: "0 0 6px var(--aurora-success)",
}

export default function CarouselDemo() {
  return (
    <div style={{ display: "grid", gap: 24, padding: 0 }}>
      <div>
        <h2 style={heading}>Carousel</h2>
        <p style={copy}>Horizontal snap track with prev/next controls.</p>
      </div>

      <Carousel title="Recent Deploys">
        {deploys.map(([name, time]) => (
          <CarouselItem key={name}>
            <div style={itemName}>{name}</div>
            <div style={statusRow}>
              <span style={dot} aria-hidden />
              200 OK · {time}
            </div>
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  )
}
