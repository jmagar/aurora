"use client"

import * as React from "react"

export interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode
}

export function HoverCard({ trigger, className, children, style, ...props }: HoverCardProps) {
  return (
    <span className={["group relative inline-flex", className].filter(Boolean).join(" ")} style={style} {...props}>
      {trigger}
      <span
        className="pointer-events-none absolute left-0 top-[calc(100%+8px)] z-40 hidden min-w-64 rounded-[8px] border p-3 text-left group-hover:block"
        style={{
          background: "var(--aurora-panel-strong)",
          borderColor: "var(--aurora-border-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
          color: "var(--aurora-text-primary)",
        }}
      >
        {children}
      </span>
    </span>
  )
}

export default HoverCard

