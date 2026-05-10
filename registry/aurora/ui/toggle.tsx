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
    className={cn("inline-flex h-8 items-center justify-center gap-2 rounded-[8px] border px-3 transition-all", className)}
    style={{
      background: pressed ? "color-mix(in srgb, var(--aurora-accent-primary) 10%, var(--aurora-control-surface))" : "var(--aurora-control-surface)",
      borderColor: pressed ? "color-mix(in srgb, var(--aurora-accent-primary) 44%, var(--aurora-border-strong))" : "var(--aurora-border-default)",
      boxShadow: pressed ? "var(--aurora-active-glow)" : "inset 0 1px 0 rgba(255,255,255,0.04)",
      color: pressed ? "var(--aurora-text-primary)" : "var(--aurora-text-muted)",
      fontFamily: "var(--aurora-font-sans)",
      fontSize: "var(--aurora-type-control)",
      fontWeight: "var(--aurora-weight-ui)",
      ...style,
    }}
    {...props}
  />
))
Toggle.displayName = "Toggle"

export { Toggle }
export default Toggle
