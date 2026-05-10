"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
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
    className={cn("overflow-hidden rounded-[8px] border", className)}
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
          className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--aurora-hover-bg)] [&::-webkit-details-marker]:hidden"
          style={{
            color: "var(--aurora-text-primary)",
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "var(--aurora-type-control)",
            fontWeight: "var(--aurora-weight-label)",
          }}
        >
          <ChevronRight
            className="size-3.5 transition-transform group-open:rotate-90"
            strokeWidth={1.8}
            style={{ color: "var(--aurora-text-muted)" }}
            aria-hidden
          />
          <span className="truncate">{title}</span>
          {meta ? (
            <span className="truncate aurora-text-meta" style={{ maxWidth: 160 }}>
              {meta}
            </span>
          ) : null}
        </summary>
        <div className="border-t px-4 py-3" style={{ borderColor: "var(--aurora-border-default)" }}>
          {children}
        </div>
      </details>
    )
  }
)
AccordionItem.displayName = "AccordionItem"

export { Accordion, AccordionItem }
export default Accordion
