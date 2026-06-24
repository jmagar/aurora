"use client"

import * as React from "react"

function Table({ ref, className, ...props }: React.TableHTMLAttributes<HTMLTableElement> & { ref?: React.Ref<HTMLTableElement> }) {
  return (
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
}

function TableHeader({ ref, ...props }: React.HTMLAttributes<HTMLTableSectionElement> & { ref?: React.Ref<HTMLTableSectionElement> }) {
  return <thead ref={ref} {...props} />
}

function TableBody({ ref, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement> & { ref?: React.Ref<HTMLTableSectionElement> }) {
  return (
    // Zebra striping via documented token (opaque-over-opaque → no gradient seam).
    <tbody
      ref={ref}
      className={["[&>tr:nth-child(even)]:bg-[var(--aurora-subtle-bg)]", className].filter(Boolean).join(" ")}
      {...props}
    />
  )
}

function TableRow({ ref, className, style, ...props }: React.HTMLAttributes<HTMLTableRowElement> & { ref?: React.Ref<HTMLTableRowElement> }) {
  return (
    <tr
      ref={ref}
      className={["border-b last:border-b-0 transition-colors duration-100 hover:bg-[var(--aurora-hover-bg)]", className].filter(Boolean).join(" ")}
      style={{ borderColor: "var(--aurora-border-default)", ...style }}
      {...props}
    />
  )
}

function TableHead({ ref, className, style, ...props }: React.ThHTMLAttributes<HTMLTableCellElement> & { ref?: React.Ref<HTMLTableCellElement> }) {
  return (
    // Sticky header: opaque panel fill so rows scroll cleanly beneath it.
    <th
      ref={ref}
      className={["sticky top-0 z-[1] px-3 py-2 aurora-text-label", className].filter(Boolean).join(" ")}
      style={{ background: "var(--aurora-panel-medium)", color: "var(--aurora-text-muted)", ...style }}
      {...props}
    />
  )
}

function TableCell({ ref, className, style, ...props }: React.TdHTMLAttributes<HTMLTableCellElement> & { ref?: React.Ref<HTMLTableCellElement> }) {
  return (
    <td
      ref={ref}
      className={["px-3 py-2 aurora-text-control", className].filter(Boolean).join(" ")}
      style={{ color: "var(--aurora-text-primary)", ...style }}
      {...props}
    />
  )
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow }
export default Table
