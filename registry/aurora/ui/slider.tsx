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

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

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
  )
}

export { Slider }
export default Slider
