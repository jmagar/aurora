"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Toolbar({ ref, className, style, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      role="toolbar"
      className={cn("flex min-h-10 flex-wrap items-center gap-1.5 rounded-[8px] border px-2 py-1.5", className)}
      style={{
        background: "var(--aurora-panel-medium)",
        borderColor: "var(--aurora-border-default)",
        boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
        ...style,
      }}
      {...props}
    />
  )
}

function ToolbarGroup({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return <div ref={ref} className={cn("flex items-center gap-1.5", className)} {...props} />
}

function ToolbarSeparator({ ref, className, style, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation="vertical"
      className={cn("mx-1 h-5 w-px", className)}
      style={{ background: "var(--aurora-border-default)", ...style }}
      {...props}
    />
  )
}

export { Toolbar, ToolbarGroup, ToolbarSeparator }
