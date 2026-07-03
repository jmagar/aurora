"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Segmented container for related, mutually-exclusive controls. Renders the
 * shared raised surface and `role="group"`. It does NOT coordinate selection —
 * pair with `ButtonGroupItem` and manage the pressed state yourself (there is no
 * `value`/`onValueChange`). Any children work; `ButtonGroupItem` supplies the
 * ready-made segment styling.
 */
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lay the items in a row (default) or a column. */
  orientation?: "horizontal" | "vertical"
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", style, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      data-orientation={orientation}
      className={cn(
        "aurora-btn-group inline-flex border",
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

/**
 * A segment inside a `ButtonGroup`. Bare `<button>` with the Aurora segmented
 * look (idle / hover / selected / focus-visible / disabled) supplied by
 * `@layer aurora-components` — no hand-rolled inline styles. Drive selection via
 * the `selected` prop, which sets `aria-pressed`.
 */
export interface ButtonGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected/active segment — sets `aria-pressed` and the lit styling. */
  selected?: boolean
}

const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
  ({ className, selected, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={cn("aurora-btn-group-item", className)}
      {...props}
    />
  )
)
ButtonGroupItem.displayName = "ButtonGroupItem"

export { ButtonGroup, ButtonGroupItem }
export default ButtonGroup
