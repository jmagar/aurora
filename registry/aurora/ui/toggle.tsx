"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(({ className, pressed = false, style, ...props }, ref) => (
  <Button variant="plain" size="unstyled"
    ref={ref}
    type="button"
    aria-pressed={pressed}
    className={cn("inline-flex h-9 items-center justify-center gap-2 rounded-[10px] border px-3.5 transition-all", className)}
    style={{
      background: pressed
        ? "linear-gradient(180deg, color-mix(in srgb, var(--aurora-panel-strong) 85%, transparent), color-mix(in srgb, var(--aurora-accent-primary) 16%, var(--aurora-control-surface)))"
        : "linear-gradient(180deg, color-mix(in srgb, var(--aurora-panel-strong) 92%, transparent), var(--aurora-control-surface))",
      borderColor: pressed ? "color-mix(in srgb, var(--aurora-accent-primary) 48%, var(--aurora-border-strong))" : "var(--aurora-border-default)",
      boxShadow: pressed
        ? "var(--aurora-highlight-strong), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 16%, transparent), var(--aurora-active-glow)"
        : "var(--aurora-highlight-medium)",
      color: pressed ? "var(--aurora-text-primary)" : "var(--aurora-text-muted)",
      fontFamily: "var(--aurora-font-sans)",
      fontSize: "var(--aurora-type-control)",
      fontWeight: "var(--aurora-weight-ui)",
      letterSpacing: "var(--aurora-letter-ui)",
      ...style,
    }}
    {...props}
  />
))
Toggle.displayName = "Toggle"

export { Toggle }
export default Toggle
