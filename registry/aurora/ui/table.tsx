"use client"

import * as React from "react"

const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div
      className="overflow-auto rounded-[8px] border"
      style={{ borderColor: "var(--aurora-border-default)" }}
    >
      <table
        ref={ref}
        className={["w-full border-collapse text-left aurora-text-control", className].filter(Boolean).join(" ")}
        {...props}
      />
    </div>
  )
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>((props, ref) => <thead ref={ref} {...props} />)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    // Zebra striping via documented token (opaque-over-opaque → no gradient seam).
    <tbody
      ref={ref}
      className={["[&>tr:nth-child(even)]:bg-[var(--aurora-subtle-bg)]", className].filter(Boolean).join(" ")}
      {...props}
    />
  )
)
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, style, ...props }, ref) => (
    <tr
      ref={ref}
      className={["border-b last:border-b-0 transition-colors duration-100 hover:bg-[var(--aurora-hover-bg)]", className].filter(Boolean).join(" ")}
      style={{ borderColor: "var(--aurora-border-default)", ...style }}
      {...props}
    />
  )
)
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, style, ...props }, ref) => (
    // Sticky header: opaque panel fill so rows scroll cleanly beneath it.
    <th
      ref={ref}
      className={["sticky top-0 z-[1] px-3 py-2 aurora-text-label", className].filter(Boolean).join(" ")}
      style={{ background: "var(--aurora-panel-medium)", color: "var(--aurora-text-muted)", ...style }}
      {...props}
    />
  )
)
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, style, ...props }, ref) => (
    <td
      ref={ref}
      className={["px-3 py-2 aurora-text-control", className].filter(Boolean).join(" ")}
      style={{ color: "var(--aurora-text-primary)", ...style }}
      {...props}
    />
  )
)
TableCell.displayName = "TableCell"

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow }
export default Table
