"use client"

/**
 * Aurora NumberInput — stepper control (decrement · value · increment).
 *
 * Visual layer is ported from the Claude Design source so it renders
 * pixel-identical in dark + `.light`: square 32px neutral stepper buttons
 * flanking a lit, accent-ringed center field that holds the value. The
 * injected CSS reads only `--aurora-*` tokens.
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

// ─── Visual layer (ported from Claude Design) ──────────────────────────────────

const CSS = `
.aurora-number-input {
  display: inline-grid;
  grid-template-columns: 32px minmax(0, 1fr) 32px;
  align-items: center;
  gap: 8px;
  width: 100%;
}
/* Center field — lit accent ring, pill rounding, centered value (CD spec). */
.aurora-number-input__field {
  width: 100%;
  height: 32px;
  padding: 0 12px;
  text-align: center;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 38%, var(--aurora-border-strong));
  background: var(--aurora-control-surface);
  color: var(--aurora-text-primary);
  font-family: var(--font-sans, Inter, sans-serif);
  font-size: 13px;
  font-weight: 560;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 18%, transparent);
  box-sizing: border-box;
  appearance: textfield;
  -moz-appearance: textfield;
  transition:
    border-color 150ms var(--motion-ease-out, ease),
    box-shadow 200ms var(--motion-ease-out, ease);
}
.aurora-number-input__field::-webkit-outer-spin-button,
.aurora-number-input__field::-webkit-inner-spin-button {
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
}
.aurora-number-input__field:focus,
.aurora-number-input__field:focus-visible {
  outline: none;
  border-color: color-mix(in srgb, var(--aurora-accent-primary) 60%, var(--aurora-border-strong));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.055),
    0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 45%, transparent),
    0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent);
}
.aurora-number-input__field:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
`

let injected = false
function ensureCSS() {
  if (injected || typeof document === "undefined") return
  const el = document.createElement("style")
  el.setAttribute("data-aurora-number-input", "")
  el.textContent = CSS
  document.head.appendChild(el)
  injected = true
}

function NumberInput({ ref, value, defaultValue = 0, min, max, step = 1, onValueChange, className, ...props }: NumberInputProps & { ref?: React.Ref<HTMLInputElement> }) {
    React.useEffect(() => {
      ensureCSS()
    }, [])

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
