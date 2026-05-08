"use client"

import * as React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/registry/aurora/ui/pagination"

const section: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 32 }
const panel: React.CSSProperties = {
  background: "var(--aurora-panel-medium)",
  border: "1px solid var(--aurora-border-strong)",
  borderRadius: 22,
  padding: "22px 24px",
  display: "flex",
  flexDirection: "column",
  gap: 16,
}
const label: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
  textTransform: "uppercase", color: "var(--aurora-text-muted)",
}

export default function PaginationDemo() {
  const [page, setPage] = React.useState(3)
  const total = 12

  return (
    <div style={section}>
      <div style={{ paddingBottom: 20, borderBottom: "1px solid var(--aurora-border-default)" }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--aurora-text-primary)", marginBottom: 4 }}>Pagination</div>
        <div style={{ fontSize: 14, color: "var(--aurora-text-muted)", lineHeight: 1.6 }}>
          Page navigation. Active = accent border + glow. Ellipsis for large sets.
        </div>
      </div>

      <div style={panel}>
        <div style={label}>Interactive</div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1)) }} aria-disabled={page === 1} />
            </PaginationItem>
            <PaginationItem><PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(1) }} isActive={page === 1}>1</PaginationLink></PaginationItem>
            {page > 3 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
            {[...Array(total)].map((_, i) => {
              const n = i + 1
              if (n === 1 || n === total) return null
              if (Math.abs(n - page) > 1) return null
              return (
                <PaginationItem key={n}>
                  <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(n) }} isActive={page === n}>{n}</PaginationLink>
                </PaginationItem>
              )
            })}
            {page < total - 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
            <PaginationItem><PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(total) }} isActive={page === total}>{total}</PaginationLink></PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage(p => Math.min(total, p + 1)) }} aria-disabled={page === total} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div style={{ textAlign: "center", fontSize: 12, color: "var(--aurora-text-muted)" }}>
          Page {page} of {total}
        </div>
      </div>

      <div style={panel}>
        <div style={label}>First page</div>
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" aria-disabled /></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
            <PaginationItem><PaginationEllipsis /></PaginationItem>
            <PaginationItem><PaginationLink href="#">12</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div style={panel}>
        <div style={label}>Last page</div>
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationEllipsis /></PaginationItem>
            <PaginationItem><PaginationLink href="#">10</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">11</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>12</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" aria-disabled /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
