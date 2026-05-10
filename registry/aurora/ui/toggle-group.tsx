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
    className={cn("inline-flex rounded-[8px] border p-1", orientation === "vertical" ? "flex-col" : "items-center", className)}
    style={{
      background: "var(--aurora-control-surface)",
      borderColor: "var(--aurora-border-default)",
      ...style,
    }}
    {...props}
  />
))
ToggleGroup.displayName = "ToggleGroup"

export { ToggleGroup }
export default ToggleGroup
