"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface AccordionItemProps extends Omit<React.HTMLAttributes<HTMLDetailsElement>, "title"> {
  title: React.ReactNode
  meta?: React.ReactNode
  defaultOpen?: boolean
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("overflow-hidden rounded-[12px] border", className)}
    style={{
      background: "var(--aurora-panel-medium)",
      borderColor: "var(--aurora-border-default)",
    }}
    {...props}
  />
))
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<HTMLDetailsElement, AccordionItemProps>(
  ({ className, title, meta, children, defaultOpen = false, style, onToggle, ...props }, ref) => {
    const [open, setOpen] = React.useState(defaultOpen)

    return (
      <details
        ref={ref}
        open={open}
        className={cn("group border-b last:border-b-0", className)}
        style={{
          borderColor: "var(--aurora-border-default)",
          ...style,
        }}
        onToggle={(event) => {
          setOpen(event.currentTarget.open)
          onToggle?.(event)
        }}
        {...props}
      >
        <summary
          className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--aurora-hover-bg)] group-open:bg-[var(--aurora-subtle-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-focus-ring)] focus-visible:ring-offset-0 [&::-webkit-details-marker]:hidden"
          style={{
            fontFamily: "var(--aurora-font-display)",
            fontSize: "15px",
            fontWeight: "var(--aurora-weight-heading)",
            color: open ? "var(--aurora-accent-primary)" : "var(--aurora-text-primary)",
          }}
        >
          <span className="truncate">{title}</span>
          {meta ? (
            <span className="truncate aurora-text-meta" style={{ maxWidth: 160 }}>
              {meta}
            </span>
          ) : null}
          <ChevronDown
            className="size-4 transition-transform duration-200 group-open:-rotate-180"
            strokeWidth={2}
            style={{ color: open ? "var(--aurora-accent-primary)" : "var(--aurora-text-muted)" }}
            aria-hidden
          />
        </summary>
        <div
          className="px-5 pb-4 pt-1"
          style={{
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
)
AccordionItem.displayName = "AccordionItem"

export { Accordion, AccordionItem }
export default Accordion
