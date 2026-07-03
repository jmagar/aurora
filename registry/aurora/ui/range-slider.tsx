"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface RangeSliderProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange"
  > {
  /** Controlled value as a `[min, max]` tuple. */
  value?: [number, number]
  /** Uncontrolled initial value as a `[min, max]` tuple. */
  defaultValue?: [number, number]
  min?: number
  max?: number
  step?: number
  /** Disable interaction. */
  disabled?: boolean
  /**
   * Accent color for the filled range and glowing thumbs. Accepts any CSS color
   * or token reference (e.g. `var(--aurora-accent-pink)`). Defaults to the
   * Aurora primary accent.
   */
  tone?: string
  /** Accessible label applied to both thumb inputs. */
  "aria-label"?: string
  onValueChange?: (value: [number, number]) => void
}

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

function RangeSlider(
  {
    ref,
    className,
    value,
    defaultValue = [0, 100],
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    tone,
    onValueChange,
    style,
    "aria-label": ariaLabel,
    ...props
  }: RangeSliderProps & { ref?: React.Ref<HTMLDivElement> }
) {
    const controlled = value !== undefined
    const [internalValue, setInternalValue] =
      React.useState<[number, number]>(defaultValue)
    const current = controlled ? value : internalValue
    const [low, high] = current

    const span = max === min ? 1 : max - min
    const fromPercent = ((low - min) / span) * 100
    const toPercent = ((high - min) / span) * 100

    function commit(next: [number, number]) {
      if (!controlled) setInternalValue(next)
      onValueChange?.(next)
    }

    function handleLowChange(event: React.ChangeEvent<HTMLInputElement>) {
      const raw = Number(event.target.value)
      const next = Math.min(raw, high)
      commit([next, high])
    }

    function handleHighChange(event: React.ChangeEvent<HTMLInputElement>) {
      const raw = Number(event.target.value)
      const next = Math.max(raw, low)
      commit([low, next])
    }

    return (
        <div
          ref={ref}
          className={cn("aurora-range-slider", className)}
          data-disabled={disabled ? "true" : undefined}
          style={{
            ["--aurora-range-from" as string]: `${fromPercent}%`,
            ["--aurora-range-to" as string]: `${toPercent}%`,
            ...(tone ? { ["--aurora-range-tone" as string]: tone } : {}),
            ...style,
          }}
          {...props}
        >
          <div className="aurora-range-slider__track" aria-hidden="true" />
          <div className="aurora-range-slider__fill" aria-hidden="true" />
          <input
            type="range"
            className="aurora-range-slider__input"
            min={min}
            max={max}
            step={step}
            value={low}
            disabled={disabled}
            onChange={handleLowChange}
            aria-label={ariaLabel ? `${ariaLabel} (minimum)` : "Range minimum"}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={low}
          />
          <input
            type="range"
            className="aurora-range-slider__input"
            min={min}
            max={max}
            step={step}
            value={high}
            disabled={disabled}
            onChange={handleHighChange}
            aria-label={ariaLabel ? `${ariaLabel} (maximum)` : "Range maximum"}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={high}
          />
        </div>
    )
}

export { RangeSlider }
export default RangeSlider
