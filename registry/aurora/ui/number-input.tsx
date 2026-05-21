"use client"

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

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, defaultValue = 0, min, max, step = 1, onValueChange, ...props }, ref) => {
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
      <div className="inline-grid w-full grid-cols-[32px_minmax(0,1fr)_32px] items-center gap-2">
        <Button
          type="button"
          variant="neutral"
          size="sm"
          aria-label="Decrease value"
          onClick={() => commit(current - step)}
          disabled={props.disabled || (min !== undefined && current <= min)}
          style={{ width: 32, padding: 0 }}
        >
          <Minus className="size-3.5" aria-hidden />
        </Button>
        <Input
          ref={ref}
          type="number"
          value={current}
          min={min}
          max={max}
          step={step}
          onChange={(event) => commit(Number(event.target.value))}
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
          {...props}
        />
        <Button
          type="button"
          variant="neutral"
          size="sm"
          aria-label="Increase value"
          onClick={() => commit(current + step)}
          disabled={props.disabled || (max !== undefined && current >= max)}
          style={{ width: 32, padding: 0 }}
        >
          <Plus className="size-3.5" aria-hidden />
        </Button>
      </div>
    )
  }
)
NumberInput.displayName = "NumberInput"

export { NumberInput }
export default NumberInput
