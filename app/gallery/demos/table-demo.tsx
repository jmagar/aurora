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

const section: React.CSSProperties = {
  display: "grid",
  gap: 14,
}

export default function TableDemo() {
  return (
    <div style={{ display: "grid", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Data"
        heading="Table"
        description="The primitive table is for custom structure and dense read-only layouts. Use Tables when you want sorting and a ready-made data-grid pattern."
      />

      <div style={section}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)" }}>
          Primitive table example
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>gateway-admin</TableCell>
              <TableCell>platform</TableCell>
              <TableCell><Badge variant="success">Live</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>policy-engine</TableCell>
              <TableCell>runtime</TableCell>
              <TableCell><Badge variant="warn">Draining</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>registry-sync</TableCell>
              <TableCell>tooling</TableCell>
              <TableCell><Badge>Queued</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div style={section}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)" }}>
          Compact audit rows
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Actor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell style={{ fontFamily: "var(--aurora-font-mono)" }}>10:42:18</TableCell>
              <TableCell>Registry build published</TableCell>
              <TableCell>copilot</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ fontFamily: "var(--aurora-font-mono)" }}>10:39:05</TableCell>
              <TableCell>Wordmark accent updated</TableCell>
              <TableCell>jacob</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
