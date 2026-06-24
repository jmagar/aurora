"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToggleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

function ToggleGroup({ ref, className, orientation = "horizontal", style, ...props }: ToggleGroupProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      role="group"
      className={cn("inline-flex", orientation === "vertical" ? "flex-col" : "items-center", className)}
      style={{
        gap: 4,
        ...style,
      }}
      {...props}
    />
  )
}

export { ToggleGroup }
export default ToggleGroup
