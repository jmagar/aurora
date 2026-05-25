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
        "inline-flex rounded-[8px] border p-1",
        orientation === "vertical" ? "flex-col" : "items-center",
        className
      )}
      style={{
        background: "var(--aurora-control-surface)",
        borderColor: "var(--aurora-border-default)",
        boxShadow: "var(--aurora-highlight-medium)",
        ...style,
      }}
      {...props}
    />
  )
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup }
export default ButtonGroup
