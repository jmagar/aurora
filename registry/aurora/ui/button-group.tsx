"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Layout-only segmented container. It renders the shared raised surface and
 * `role="group"`, but does NOT coordinate selection — manage the pressed/active
 * state of the child controls yourself. (There is no `value`/`onValueChange`.)
 */
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lay the items in a row (default) or a column. */
  orientation?: "horizontal" | "vertical"
}

function ButtonGroup({ ref, className, orientation = "horizontal", style, ...props }: ButtonGroupProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
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
}

export { ButtonGroup }
export default ButtonGroup
