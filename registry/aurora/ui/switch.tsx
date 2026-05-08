"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

// ─── Size presets ─────────────────────────────────────────────────────────────
//
//  translateX values:
//    OFF  = thumbOffset
//    ON   = trackW - thumbSize - thumbOffset
//
const sizeConfig = {
  sm:      { trackW: 28, trackH: 16, thumbSize: 10, thumbOff: 2,  thumbOn: 16 },
  default: { trackW: 36, trackH: 20, thumbSize: 14, thumbOff: 3,  thumbOn: 19 },
  lg:      { trackW: 44, trackH: 24, thumbSize: 18, thumbOff: 3,  thumbOn: 23 },
} as const

type SwitchSize = keyof typeof sizeConfig

// ─── CSS injected once ────────────────────────────────────────────────────────

const SWITCH_CSS = `
[data-radix-switch-thumb] {
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
[data-aurora-switch="sm"] [data-radix-switch-thumb]                    { transform: translateX(2px);  }
[data-aurora-switch="sm"][data-state="checked"] [data-radix-switch-thumb]  { transform: translateX(16px); }

[data-aurora-switch="default"] [data-radix-switch-thumb]                   { transform: translateX(3px);  }
[data-aurora-switch="default"][data-state="checked"] [data-radix-switch-thumb] { transform: translateX(19px); }

[data-aurora-switch="lg"] [data-radix-switch-thumb]                    { transform: translateX(3px);  }
[data-aurora-switch="lg"][data-state="checked"] [data-radix-switch-thumb]  { transform: translateX(23px); }
`

let switchCSSInjected = false
function ensureSwitchCSS() {
  if (switchCSSInjected || typeof document === "undefined") return
  const el = document.createElement("style")
  el.textContent = SWITCH_CSS
  document.head.appendChild(el)
  switchCSSInjected = true
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  size?: SwitchSize
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size = "default", style, ...props }, ref) => {
  React.useEffect(() => {
    ensureSwitchCSS()
  }, [])

  const { trackW, trackH, thumbSize } = sizeConfig[size]

  return (
    <SwitchPrimitive.Root
      ref={ref}
      // Used by injected CSS to select the right translate values
      data-aurora-switch={size}
      className={cn(
        "group relative inline-flex shrink-0 cursor-pointer items-center",
        "focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-45",
        className
      )}
      style={{
        width: trackW,
        height: trackH,
        borderRadius: trackH,
        background: "var(--aurora-control-surface, #0c1a24)",
        border: "1.5px solid var(--aurora-border-strong, #24536c)",
        transition: "border-color 200ms, box-shadow 200ms",
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = [
          "0 0 0 3px color-mix(in srgb, #29b6f6 22%, transparent)",
          "0 0 0 1px color-mix(in srgb, #29b6f6 45%, transparent)",
        ].join(", ")
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        const checked = e.currentTarget.getAttribute("data-state") === "checked"
        e.currentTarget.style.boxShadow = checked
          ? [
              "0 0 0 1px color-mix(in srgb, #29b6f6 25%, transparent)",
              "0 2px 8px color-mix(in srgb, #29b6f6 18%, transparent)",
            ].join(", ")
          : "none"
        props.onBlur?.(e)
      }}
      {...props}
    >
      {/* Checked fill — fades in via opacity transition */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          "opacity-0 group-data-[state=checked]:opacity-100",
          "transition-opacity duration-200"
        )}
        style={{
          borderRadius: "inherit",
          background: "linear-gradient(180deg, #4dc8fa 0%, #1da8e6 100%)",
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.15)",
            "0 0 0 1px color-mix(in srgb, #29b6f6 30%, transparent)",
            "0 2px 10px color-mix(in srgb, #29b6f6 22%, transparent)",
          ].join(", "),
        }}
      />

      {/* Thumb */}
      <SwitchPrimitive.Thumb
        className="relative z-10 block will-change-transform"
        style={{
          width: thumbSize,
          height: thumbSize,
          borderRadius: "50%",
          background: "linear-gradient(180deg, #ffffff 0%, #daedf7 100%)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.20)",
          flexShrink: 0,
        }}
      />
    </SwitchPrimitive.Root>
  )
})
Switch.displayName = "Switch"

export { Switch }
export default Switch
