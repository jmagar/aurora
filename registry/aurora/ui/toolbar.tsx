"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Toolbar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      role="toolbar"
      className={cn("flex min-h-10 flex-wrap items-center gap-1.5 rounded-[8px] border px-2 py-1.5", className)}
      style={{
        background: "var(--aurora-panel-medium)",
        borderColor: "var(--aurora-border-default)",
        boxShadow: "var(--aurora-shadow-medium), inset 0 1px 0 rgba(255,255,255,0.04)",
        ...style,
      }}
      {...props}
    />
  )
)
Toolbar.displayName = "Toolbar"

const ToolbarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-1.5", className)} {...props} />
  )
)
ToolbarGroup.displayName = "ToolbarGroup"

const ToolbarSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn("mx-1 h-5 w-px", className)}
      style={{ background: "var(--aurora-border-default)", ...style }}
      {...props}
    />
  )
)
ToolbarSeparator.displayName = "ToolbarSeparator"

export { Toolbar, ToolbarGroup, ToolbarSeparator }
