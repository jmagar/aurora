"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const DescriptionList = React.forwardRef<HTMLDListElement, React.HTMLAttributes<HTMLDListElement>>(
  ({ className, ...props }, ref) => (
    <dl ref={ref} className={cn("grid gap-0 overflow-hidden rounded-[8px] border", className)} style={{ borderColor: "var(--aurora-border-default)" }} {...props} />
  )
)
DescriptionList.displayName = "DescriptionList"

export interface DescriptionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode
  value: React.ReactNode
}

const DescriptionItem = React.forwardRef<HTMLDivElement, DescriptionItemProps>(
  ({ className, label, value, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid grid-cols-[150px_minmax(0,1fr)] gap-4 border-b px-4 py-3 last:border-b-0", className)}
      style={{ borderColor: "var(--aurora-border-default)" }}
      {...props}
    >
      <dt style={{ color: "var(--aurora-text-muted)", fontSize: "var(--aurora-type-label)", fontWeight: "var(--aurora-weight-label)", letterSpacing: "var(--aurora-letter-label)", lineHeight: "var(--aurora-line-dense)" }}>
        {label}
      </dt>
      <dd style={{ color: "var(--aurora-text-primary)", fontSize: "var(--aurora-type-table)", fontWeight: "var(--aurora-weight-body)", lineHeight: 1.42, margin: 0, minWidth: 0 }}>
        {value}
      </dd>
    </div>
  )
)
DescriptionItem.displayName = "DescriptionItem"

export { DescriptionList, DescriptionItem }
