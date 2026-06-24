"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

function Listbox({ ref, className, style, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      role="listbox"
      className={cn("overflow-hidden rounded-[var(--aurora-radius-2)] border p-2", className)}
      style={{
        background: "var(--aurora-panel-strong)",
        borderColor: "var(--aurora-border-strong)",
        boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        ...style,
      }}
      {...props}
    />
  )
}

function ListboxGroup({ ref, className, heading, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement>; heading?: React.ReactNode }) {
  return (
    <div ref={ref} className={cn("py-1", className)} {...props}>
      {heading ? (
        <div
          className="px-3 pb-2 pt-1"
          style={{
            color: "var(--aurora-text-muted)",
            fontSize: "var(--aurora-type-body-sm)",
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
}

export interface ListboxItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  meta?: React.ReactNode
  active?: boolean
}

function ListboxItem({ ref, className, title, description, meta, active, style, ...props }: ListboxItemProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <Button
      ref={ref}
      variant="plain"
      size="unstyled"
      role="option"
      aria-selected={active}
      className={cn("grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--aurora-radius-1)] px-4 py-3 text-left outline-none transition-colors", className)}
      style={{
        background: active ? "var(--aurora-hover-bg)" : "transparent",
        border: active ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 32%, transparent)" : "1px solid transparent",
        color: "var(--aurora-text-primary)",
        ...style,
      }}
      {...props}
    >
      <span className="min-w-0">
        <span className="block truncate" style={{ fontSize: "var(--aurora-type-body)", fontWeight: "var(--aurora-weight-heading)", lineHeight: "var(--aurora-line-dense)" }}>{title}</span>
        {description ? <span className="mt-1 block truncate" style={{ color: "var(--aurora-text-muted)", fontSize: "var(--aurora-type-control)", fontWeight: "var(--aurora-weight-body)", lineHeight: 1.4 }}>{description}</span> : null}
      </span>
      {meta ? <span style={{ color: "var(--aurora-text-muted)", fontFamily: "var(--aurora-font-mono)", fontSize: "var(--aurora-type-control)", letterSpacing: 0 }}>{meta}</span> : null}
    </Button>
  )
}

export { Listbox, ListboxGroup, ListboxItem }
export default Listbox
