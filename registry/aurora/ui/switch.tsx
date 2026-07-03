"use client"

/**
 * Aurora Switch — the only pill control besides scrollbars. The track tints to
 * cyan when on; the thumb gains a self-glow.
 *
 * Visual layer matches the Claude Design source (track tint, colored glowing
 * thumb) ported onto the Radix primitive, which keeps full keyboard/form a11y.
 */

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

// ─── Size presets ──────────────────────────────────────────────────────────────
//   translateX: OFF = off, ON = on (absolute, no track padding)
const sizeConfig = {
  sm:      { trackW: 28, trackH: 16, thumbSize: 10, off: 2, on: 16 },
  default: { trackW: 40, trackH: 23, thumbSize: 17, off: 2, on: 19 },
  lg:      { trackW: 44, trackH: 24, thumbSize: 18, off: 3, on: 23 },
} as const

type SwitchSize = keyof typeof sizeConfig

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

// ─── Component ──────────────────────────────────────────────────────────────────

export interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  size?: SwitchSize
}

function Switch({ ref, className, size = "default", style, ...props }: SwitchProps & { ref?: React.Ref<React.ElementRef<typeof SwitchPrimitive.Root>> }) {
  const { trackW, trackH, thumbSize } = sizeConfig[size]

  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-aurora-switch={size}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center",
        "focus-visible:outline-none",
        "disabled:pointer-events-none",
        className
      )}
      style={{
        width: trackW,
        height: trackH,
        borderRadius: 999,
        ...style,
      }}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-radix-switch-thumb
        className="relative z-10 block will-change-transform"
        style={{
          width: thumbSize,
          height: thumbSize,
          borderRadius: "50%",
          flexShrink: 0,
        }}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
export default Switch
