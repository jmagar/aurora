"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

const Listbox = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      role="listbox"
      className={cn("overflow-hidden rounded-[var(--aurora-radius-1)] border p-1", className)}
      style={{
        background: "var(--aurora-panel-strong)",
        borderColor: "var(--aurora-border-strong)",
        ...style,
      }}
      {...props}
    />
  )
)
Listbox.displayName = "Listbox"

const ListboxGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { heading?: React.ReactNode }>(
  ({ className, heading, children, ...props }, ref) => (
    <div ref={ref} className={cn("py-1", className)} {...props}>
      {heading ? (
        <div
          className="px-2 py-1.5"
          style={{
            color: "var(--aurora-text-muted)",
            fontSize: "var(--aurora-type-label)",
            fontWeight: "var(--aurora-weight-label)",
            letterSpacing: "var(--aurora-letter-label)",
            lineHeight: "var(--aurora-line-dense)",
          }}
        >
          {heading}
        </div>
      ) : null}
      {children}
    </div>
  )
)
ListboxGroup.displayName = "ListboxGroup"

export interface ListboxItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  meta?: React.ReactNode
  active?: boolean
}

const ListboxItem = React.forwardRef<HTMLButtonElement, ListboxItemProps>(
  ({ className, title, description, meta, active, style, ...props }, ref) => (
    <Button
      ref={ref}
      variant="plain"
      size="unstyled"
      role="option"
      aria-selected={active}
      className={cn("grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-[8px] px-3 py-2 text-left outline-none transition-colors", className)}
      style={{
        background: active ? "var(--aurora-hover-bg)" : "transparent",
        border: active ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 28%, transparent)" : "1px solid transparent",
        color: "var(--aurora-text-primary)",
        ...style,
      }}
      {...props}
    >
      <span className="min-w-0">
        <span className="block truncate" style={{ fontSize: "var(--aurora-type-control)", fontWeight: "var(--aurora-weight-label)", lineHeight: "var(--aurora-line-dense)" }}>{title}</span>
        {description ? <span className="block truncate" style={{ color: "var(--aurora-text-muted)", fontSize: "var(--aurora-type-label)", fontWeight: "var(--aurora-weight-body)", lineHeight: 1.4 }}>{description}</span> : null}
      </span>
      {meta ? <span style={{ color: "var(--aurora-text-muted)", fontFamily: "var(--aurora-font-mono)", fontSize: "var(--aurora-type-caption)", letterSpacing: 0 }}>{meta}</span> : null}
    </Button>
  )
)
ListboxItem.displayName = "ListboxItem"

export { Listbox, ListboxGroup, ListboxItem }
export default Listbox
