"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CollapsibleProps extends Omit<React.HTMLAttributes<HTMLDetailsElement>, "title"> {
  title: React.ReactNode
  defaultOpen?: boolean
}

const Collapsible = React.forwardRef<HTMLDetailsElement, CollapsibleProps>(
  ({ className, title, children, defaultOpen = false, style, onToggle, ...props }, ref) => {
    const [open, setOpen] = React.useState(defaultOpen)
    return (
      <details
        ref={ref}
        open={open}
        className={cn("group rounded-[8px] border", className)}
        style={{ background: "var(--aurora-panel-medium)", borderColor: "var(--aurora-border-default)", ...style }}
        onToggle={(event) => {
          setOpen(event.currentTarget.open)
          onToggle?.(event)
        }}
        {...props}
      >
        <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)] items-center gap-2 px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-accent-primary)] focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
          <ChevronRight className="size-3.5 transition-transform group-open:rotate-90" aria-hidden style={{ color: "var(--aurora-text-muted)" }} />
          <span className="aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>{title}</span>
        </summary>
        <div className="border-t px-4 py-3" style={{ borderColor: "var(--aurora-border-default)" }}>{children}</div>
      </details>
    )
  }
)
Collapsible.displayName = "Collapsible"

export { Collapsible }
export default Collapsible
