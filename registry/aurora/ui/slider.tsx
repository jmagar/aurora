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
  onValueChange?: (value: number) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, defaultValue = 0, min = 0, max = 100, step = 1, onValueChange, style, ...props }, ref) => {
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
        className={cn("aurora-slider h-5 w-full cursor-pointer appearance-none bg-transparent", className)}
        style={{
          ["--aurora-slider-value" as string]: `${percent}%`,
          ...style,
        }}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
export default Slider
