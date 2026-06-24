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

// ─── Visual layer (Claude Design parity, keyed to Radix data-state) ─────────────

const SWITCH_CSS = `
[data-aurora-switch] {
  background: var(--aurora-control-surface);
  border: 1px solid var(--aurora-border-strong);
  transition: background 160ms var(--motion-ease-out, ease), border-color 160ms var(--motion-ease-out, ease), box-shadow 160ms var(--motion-ease-out, ease);
}
[data-aurora-switch]:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent);
}
[data-aurora-switch][data-state="checked"] {
  background: color-mix(in srgb, var(--aurora-accent-primary) 32%, var(--aurora-control-surface));
  border-color: color-mix(in srgb, var(--aurora-accent-primary) 50%, var(--aurora-border-strong));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent);
}
[data-aurora-switch]:disabled { opacity: 0.45; cursor: not-allowed; }

[data-aurora-switch] [data-radix-switch-thumb] {
  background: var(--aurora-text-muted);
  transition: transform 160ms var(--motion-ease-out, ease), background 160ms var(--motion-ease-out, ease), box-shadow 160ms var(--motion-ease-out, ease);
  pointer-events: none;
}
[data-aurora-switch][data-state="checked"] [data-radix-switch-thumb] {
  background: var(--aurora-accent-strong);
  box-shadow: 0 0 8px var(--aurora-accent-primary);
}

[data-aurora-switch="sm"]      [data-radix-switch-thumb]                       { transform: translateX(2px);  }
[data-aurora-switch="sm"][data-state="checked"]      [data-radix-switch-thumb] { transform: translateX(16px); }
[data-aurora-switch="default"] [data-radix-switch-thumb]                       { transform: translateX(2px);  }
[data-aurora-switch="default"][data-state="checked"] [data-radix-switch-thumb] { transform: translateX(19px); }
[data-aurora-switch="lg"]      [data-radix-switch-thumb]                       { transform: translateX(3px);  }
[data-aurora-switch="lg"][data-state="checked"]      [data-radix-switch-thumb] { transform: translateX(23px); }

@media (prefers-reduced-motion: reduce) {
  [data-aurora-switch], [data-aurora-switch] [data-radix-switch-thumb] { transition: none; }
}
`

let switchCSSInjected = false
function ensureSwitchCSS() {
  if (switchCSSInjected || typeof document === "undefined") return
  const el = document.createElement("style")
  el.setAttribute("data-aurora-switch-styles", "")
  el.textContent = SWITCH_CSS
  document.head.appendChild(el)
  switchCSSInjected = true
}

// ─── Component ──────────────────────────────────────────────────────────────────

export interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  size?: SwitchSize
}

function Switch({ ref, className, size = "default", style, ...props }: SwitchProps & { ref?: React.Ref<React.ElementRef<typeof SwitchPrimitive.Root>> }) {
  React.useEffect(() => {
    ensureSwitchCSS()
  }, [])

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
