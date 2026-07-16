"use client"

import * as React from "react"
import { Separator } from "./separator"
import { cn } from "@/lib/utils"

type ToolbarOrientation = "horizontal" | "vertical"

const ToolbarContext = React.createContext<ToolbarOrientation>("horizontal")

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lay controls in a row (default) or a vertical rail. */
  orientation?: ToolbarOrientation
}

function Toolbar({
  ref,
  className,
  style,
  orientation = "horizontal",
  ...props
}: ToolbarProps & { ref?: React.Ref<HTMLDivElement> }) {
  const vertical = orientation === "vertical"
  return (
    <ToolbarContext.Provider value={orientation}>
      <div
        ref={ref}
        role="toolbar"
        aria-orientation={orientation}
        data-orientation={orientation}
        className={cn(
          "flex items-center gap-1.5 rounded-[8px] border px-2 py-1.5",
          vertical ? "w-fit flex-col" : "min-h-10 flex-wrap",
          className
        )}
        style={{
          background: "var(--aurora-panel-medium)",
          borderColor: "var(--aurora-border-default)",
          boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
          ...style,
        }}
        {...props}
      />
    </ToolbarContext.Provider>
  )
}

function ToolbarGroup({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  const orientation = React.useContext(ToolbarContext)
  return (
    <div
      ref={ref}
      role="group"
      className={cn(
        "flex items-center gap-1.5",
        orientation === "vertical" && "flex-col",
        className
      )}
      {...props}
    />
  )
}

function ToolbarSeparator({
  ref,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  // The separator runs perpendicular to the toolbar's flow: a vertical hairline
  // in a horizontal toolbar, a horizontal hairline in a vertical one.
  const orientation = React.useContext(ToolbarContext)
  const perpendicularVertical = orientation === "horizontal"
  return (
    <Separator
      ref={ref}
      decorative
      orientation={perpendicularVertical ? "vertical" : "horizontal"}
      className={cn(
        perpendicularVertical ? "mx-1 h-5" : "my-1 w-5",
        className
      )}
      style={style}
      {...props}
    />
  )
}

/**
 * Flexible spacer — pushes the groups on either side apart (e.g. actions left,
 * search right). Grows along the toolbar's main axis.
 */
function ToolbarSpacer({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return <div ref={ref} aria-hidden className={cn("flex-1", className)} {...props} />
}

export { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarSpacer }
