"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CollapsibleProps extends Omit<React.HTMLAttributes<HTMLDetailsElement>, "title"> {
  title: React.ReactNode
  defaultOpen?: boolean
}

function Collapsible({ className, title, children, defaultOpen = false, style, onToggle, ref, ...props }: CollapsibleProps & { ref?: React.Ref<HTMLDetailsElement> }) {
    const [open, setOpen] = React.useState(defaultOpen)
    return (
      <details
        ref={ref}
        open={open}
        className={cn("group overflow-hidden rounded-[12px] border", className)}
        style={{ background: "var(--aurora-panel-medium)", borderColor: "var(--aurora-border-default)", ...style }}
        onToggle={(event) => {
          setOpen(event.currentTarget.open)
          onToggle?.(event)
        }}
        {...props}
      >
        <summary
          className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-5 py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-focus-ring)] focus-visible:ring-inset [&::-webkit-details-marker]:hidden"
          style={{
            fontFamily: "var(--aurora-font-display)",
            fontSize: "15px",
            fontWeight: "var(--aurora-weight-heading)",
            color: "var(--aurora-text-primary)",
          }}
        >
          <ChevronRight
            className="size-4 transition-transform duration-200 group-open:rotate-90"
            strokeWidth={2}
            aria-hidden
            style={{ color: "var(--aurora-text-muted)" }}
          />
          <span className="truncate">{title}</span>
        </summary>
        <div
          className="border-t px-5 pb-4 pt-3"
          style={{
            borderColor: "var(--aurora-border-default)",
            color: "var(--aurora-text-muted)",
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "var(--aurora-type-body)",
            lineHeight: 1.55,
          }}
        >
          {children}
        </div>
      </details>
    )
}

export { Collapsible }
export default Collapsible
