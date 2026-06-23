"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", style, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={cn(
        "inline-flex border",
        orientation === "vertical" ? "flex-col" : "items-center",
        className
      )}
      style={{
        // CD ButtonGroup is a segmented control: shared raised panel-strong
        // surface (gradient + recessed hairline + inset highlight), 4px gap +
        // padding, 10px radius — 1:1 with the dsCard container.
        gap: 4,
        padding: 4,
        borderRadius: 10,
        background:
          "linear-gradient(180deg, var(--aurora-panel-strong-top), var(--aurora-panel-strong))",
        borderColor: "color-mix(in srgb, var(--aurora-panel-strong) 72%, #000)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        ...style,
      }}
      {...props}
    />
  )
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup }
export default ButtonGroup
