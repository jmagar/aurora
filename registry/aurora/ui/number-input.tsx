"use client"

/**
 * Aurora NumberInput — stepper control (decrement · value · increment).
 *
 * Visual layer is ported from the Claude Design source so it renders
 * pixel-identical in dark + `.light`: square 32px neutral stepper buttons
 * flanking a lit, accent-ringed center field that holds the value. The
 * CSS reads only `--aurora-*` tokens.
 *
 * Architecture stays shadcn-compatible: controlled/uncontrolled value,
 * `min`/`max`/`step` clamping, `onValueChange`, `forwardRef`, `displayName`,
 * full native input prop pass-through, and a11y labels on the steppers.
 */

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange" | "size"> {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number) => void
}

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

function NumberInput({ ref, value, defaultValue = 0, min, max, step = 1, onValueChange, className, ...props }: NumberInputProps & { ref?: React.Ref<HTMLInputElement> }) {
    const controlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const current = controlled ? value : internalValue

    function clamp(next: number) {
      if (min !== undefined && next < min) return min
      if (max !== undefined && next > max) return max
      return next
    }

    function commit(next: number) {
      const clamped = clamp(next)
      if (!controlled) setInternalValue(clamped)
      onValueChange?.(clamped)
    }

    return (
      <div className="aurora-number-input">
        <Button
          type="button"
          variant="neutral"
          size="sm"
          aria-label="Decrease value"
          onClick={() => commit(current - step)}
          disabled={props.disabled || (min !== undefined && current <= min)}
          style={{ width: 32, height: 32, padding: 0, borderRadius: 9 }}
        >
          <Minus className="size-3.5" aria-hidden />
        </Button>
        <Input
          ref={ref}
          unstyled
          type="number"
          value={current}
          min={min}
          max={max}
          step={step}
          onChange={(event) => commit(Number(event.target.value))}
          className={["aurora-number-input__field", className].filter(Boolean).join(" ")}
          {...props}
        />
        <Button
          type="button"
          variant="neutral"
          size="sm"
          aria-label="Increase value"
          onClick={() => commit(current + step)}
          disabled={props.disabled || (max !== undefined && current >= max)}
          style={{ width: 32, height: 32, padding: 0, borderRadius: 9 }}
        >
          <Plus className="size-3.5" aria-hidden />
        </Button>
      </div>
    )
}

export { NumberInput }
export default NumberInput
