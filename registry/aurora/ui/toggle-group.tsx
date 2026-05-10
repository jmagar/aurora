"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToggleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(({ className, orientation = "horizontal", style, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    className={cn("inline-flex rounded-[12px] border p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]", orientation === "vertical" ? "flex-col" : "items-center", className)}
    style={{
      background: "linear-gradient(180deg, color-mix(in srgb, var(--aurora-panel-strong) 92%, transparent), var(--aurora-control-surface))",
      borderColor: "var(--aurora-border-strong)",
      gap: 6,
      ...style,
    }}
    {...props}
  />
))
ToggleGroup.displayName = "ToggleGroup"

export { ToggleGroup }
export default ToggleGroup
