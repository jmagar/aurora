"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  /**
   * Accent color for the filled track and glowing thumb. Accepts any CSS color
   * or token reference (e.g. `var(--aurora-accent-pink)`). Defaults to the
   * Aurora primary accent.
   */
  tone?: string
  onValueChange?: (value: number) => void
}

// Self-contained Aurora slider styling — filled track + glowing thumb, driven
// by the per-instance `--aurora-slider-tone` custom property so the `tone` prop
// recolors the track and thumb without touching the global aurora.css layer.
const SLIDER_CSS = `
.aurora-slider-cd {
  --aurora-slider-tone: var(--aurora-accent-primary);
  height: 20px;
  width: 100%;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
}
.aurora-slider-cd:focus-visible { outline: none; }
.aurora-slider-cd::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 999px;
  background:
    linear-gradient(
      90deg,
      var(--aurora-slider-tone) 0%,
      var(--aurora-slider-tone) var(--aurora-slider-value, 0%),
      var(--aurora-control-surface) var(--aurora-slider-value, 0%),
      var(--aurora-control-surface) 100%
    );
  border: 1px solid var(--aurora-border-strong);
}
.aurora-slider-cd::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  margin-top: -6px;
  border-radius: 999px;
  background: var(--aurora-slider-tone);
  border: 2px solid var(--aurora-panel-strong);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--aurora-slider-tone) 45%, transparent),
    0 0 12px color-mix(in srgb, var(--aurora-slider-tone) 35%, transparent);
  transition: box-shadow 120ms var(--aurora-motion-ease, ease);
}
.aurora-slider-cd:hover::-webkit-slider-thumb,
.aurora-slider-cd:focus-visible::-webkit-slider-thumb {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--aurora-slider-tone) 60%, transparent),
    0 0 16px color-mix(in srgb, var(--aurora-slider-tone) 50%, transparent);
}
.aurora-slider-cd::-moz-range-track {
  height: 6px;
  border-radius: 999px;
  background: var(--aurora-control-surface);
  border: 1px solid var(--aurora-border-strong);
}
.aurora-slider-cd::-moz-range-progress {
  height: 6px;
  border-radius: 999px;
  background: var(--aurora-slider-tone);
}
.aurora-slider-cd::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: var(--aurora-slider-tone);
  border: 2px solid var(--aurora-panel-strong);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--aurora-slider-tone) 45%, transparent),
    0 0 12px color-mix(in srgb, var(--aurora-slider-tone) 35%, transparent);
}
`

function Slider({ ref, className, value, defaultValue = 0, min = 0, max = 100, step = 1, tone, onValueChange, style, ...props }: SliderProps & { ref?: React.Ref<HTMLInputElement> }) {
    const controlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const current = controlled ? value : internalValue
    const percent = max === min ? 0 : ((current - min) / (max - min)) * 100

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const next = Number(event.target.value)
      if (!controlled) setInternalValue(next)
      onValueChange?.(next)
    }

    return (
      <>
        <style>{SLIDER_CSS}</style>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={handleChange}
          className={cn("aurora-slider-cd", className)}
          style={{
            ["--aurora-slider-value" as string]: `${percent}%`,
            ...(tone ? { ["--aurora-slider-tone" as string]: tone } : {}),
            ...style,
          }}
          {...props}
        />
      </>
    )
}

export { Slider }
export default Slider
