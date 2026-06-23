"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Badge } from "@/registry/aurora/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/aurora/ui/table"

const mono: React.CSSProperties = { fontFamily: "var(--aurora-font-mono)" }

type Row = { gw: string; code: "200" | "429" | "502"; p99: string }

const rows: Row[] = [
  { gw: "edge-1", code: "200", p99: "42ms" },
  { gw: "edge-2", code: "200", p99: "51ms" },
  { gw: "edge-3", code: "502", p99: "—" },
  { gw: "edge-4", code: "429", p99: "88ms" },
]

const codeTone = (code: Row["code"]) =>
  code === "200" ? "success" : code === "429" ? "warn" : "error"

export default function TableDemo() {
  return (
    <div style={{ display: "grid", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Data"
        heading="Table"
        description="Sticky header, zebra striping, and inline status cells. Use Tables for dense, read-only data with row affordances."
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Gateway</TableHead>
            <TableHead style={{ textAlign: "center" }}>Code</TableHead>
            <TableHead style={{ textAlign: "right" }}>P99</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.gw} style={{ cursor: "pointer" }} tabIndex={0}>
              <TableCell style={mono}>{r.gw}</TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <Badge tone={codeTone(r.code)} dot>
                  {r.code}
                </Badge>
              </TableCell>
              <TableCell style={{ ...mono, textAlign: "right" }}>{r.p99}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
