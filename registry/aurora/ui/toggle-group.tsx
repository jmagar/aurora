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
    className={cn("inline-flex", orientation === "vertical" ? "flex-col" : "items-center", className)}
    style={{
      // CD ToggleGroup is a segmented control: the items share one raised
      // panel-strong surface (gradient + recessed hairline + inset highlight),
      // 6px padding and gap, 12px radius — 1:1 with the dsCard container.
      gap: 6,
      padding: 6,
      borderRadius: 12,
      border: "1px solid color-mix(in srgb, var(--aurora-panel-strong) 72%, #000)",
      background:
        "linear-gradient(180deg, var(--aurora-panel-strong-top), var(--aurora-panel-strong))",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      ...style,
    }}
    {...props}
  />
))
ToggleGroup.displayName = "ToggleGroup"

export { ToggleGroup }
export default ToggleGroup
