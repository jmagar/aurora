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

// Self-contained Aurora range-slider styling — two overlaid native range
// inputs share one custom track. The filled segment between the thumbs and the
// thumb glow are driven by the per-instance `--aurora-range-tone` custom
// property so `tone` recolors without touching the global aurora.css layer.
const RANGE_SLIDER_CSS = `
.aurora-range-slider {
  --aurora-range-tone: var(--aurora-accent-primary);
  position: relative;
  width: 100%;
  height: 20px;
  display: flex;
  align-items: center;
}
.aurora-range-slider__track {
  position: absolute;
  left: 0;
  right: 0;
  height: 6px;
  border-radius: 999px;
  background: var(--aurora-control-surface);
  border: 1px solid var(--aurora-border-strong);
  box-sizing: border-box;
}
.aurora-range-slider__fill {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 999px;
  background: var(--aurora-range-tone);
  left: var(--aurora-range-from, 0%);
  right: calc(100% - var(--aurora-range-to, 100%));
}
.aurora-range-slider__input {
  position: absolute;
  left: 0;
  width: 100%;
  height: 20px;
  margin: 0;
  padding: 0;
  background: transparent;
  pointer-events: none;
  appearance: none;
  -webkit-appearance: none;
}
.aurora-range-slider__input:focus-visible {
  outline: none;
}
.aurora-range-slider__input::-webkit-slider-runnable-track {
  height: 20px;
  background: transparent;
  border: none;
}
.aurora-range-slider__input::-moz-range-track {
  height: 20px;
  background: transparent;
  border: none;
}
.aurora-range-slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  pointer-events: auto;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  border-radius: 999px;
  background: var(--aurora-panel-strong);
  border: 2px solid var(--aurora-range-tone);
  cursor: pointer;
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--aurora-range-tone) 45%, transparent),
    0 0 12px color-mix(in srgb, var(--aurora-range-tone) 35%, transparent);
  transition: box-shadow 120ms var(--aurora-motion-ease, ease);
}
.aurora-range-slider__input::-moz-range-thumb {
  pointer-events: auto;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: var(--aurora-panel-strong);
  border: 2px solid var(--aurora-range-tone);
  cursor: pointer;
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--aurora-range-tone) 45%, transparent),
    0 0 12px color-mix(in srgb, var(--aurora-range-tone) 35%, transparent);
  transition: box-shadow 120ms var(--aurora-motion-ease, ease);
}
.aurora-range-slider__input:hover::-webkit-slider-thumb,
.aurora-range-slider__input:focus-visible::-webkit-slider-thumb {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--aurora-range-tone) 60%, transparent),
    0 0 16px color-mix(in srgb, var(--aurora-range-tone) 50%, transparent);
}
.aurora-range-slider__input:hover::-moz-range-thumb,
.aurora-range-slider__input:focus-visible::-moz-range-thumb {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--aurora-range-tone) 60%, transparent),
    0 0 16px color-mix(in srgb, var(--aurora-range-tone) 50%, transparent);
}
.aurora-range-slider[data-disabled="true"] {
  opacity: 0.55;
}
.aurora-range-slider[data-disabled="true"] .aurora-range-slider__input {
  cursor: not-allowed;
}
.aurora-range-slider[data-disabled="true"] .aurora-range-slider__input::-webkit-slider-thumb {
  cursor: not-allowed;
}
.aurora-range-slider[data-disabled="true"] .aurora-range-slider__input::-moz-range-thumb {
  cursor: not-allowed;
}
`

const RangeSlider = React.forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    {
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
    },
    ref
  ) => {
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
      <>
        <style>{RANGE_SLIDER_CSS}</style>
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
      </>
    )
  }
)
RangeSlider.displayName = "RangeSlider"

export { RangeSlider }
export default RangeSlider
