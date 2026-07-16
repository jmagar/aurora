"use client"

import * as React from "react"
import { Check, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "onChange" | "size" | "type"> {
  checked?: boolean
  defaultChecked?: boolean
  /** Tri-state: render a dash instead of a tick (e.g. a partially-selected group). Visually overrides `checked`. */
  indeterminate?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onCheckedChange?: (checked: boolean) => void
  /** Label content rendered next to the box. */
  children?: React.ReactNode
}

function Checkbox({
  ref,
  checked,
  defaultChecked = false,
  indeterminate = false,
  onCheckedChange,
  children,
  className,
  disabled,
  id,
  style,
  onFocus,
  onBlur,
  onChange,
  ...props
}: CheckboxProps & { ref?: React.Ref<HTMLInputElement> }) {
  const generatedId = React.useId()
  const resolvedId = id ?? generatedId
  const isControlled = checked !== undefined
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
  const [focused, setFocused] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const setRefs = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<HTMLInputElement | null>).current = node
      }
    },
    [ref]
  )

  const currentChecked = Boolean(isControlled ? checked : internalChecked)
  const state = indeterminate ? "indeterminate" : currentChecked ? "checked" : "unchecked"

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const input = (
    <Input
      {...props}
      id={resolvedId}
      ref={setRefs}
      unstyled
      type="checkbox"
      disabled={disabled}
      className="sr-only"
      checked={isControlled ? currentChecked : undefined}
      defaultChecked={isControlled ? undefined : defaultChecked}
      onChange={(event) => {
        if (!isControlled) {
          setInternalChecked(event.target.checked)
        }
        onCheckedChange?.(event.target.checked)
        onChange?.(event)
      }}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
    />
  )

  const indicator = (
    <span
      aria-hidden="true"
      data-state={state}
      className="inline-grid size-[19px] shrink-0 place-items-center rounded-[5px]"
      style={{
        background:
          indeterminate || currentChecked
            ? "color-mix(in srgb, var(--aurora-accent-primary) 30%, var(--aurora-control-surface))"
            : "var(--aurora-control-surface)",
        border: `1px solid ${
          indeterminate || currentChecked
            ? "color-mix(in srgb, var(--aurora-accent-primary) 60%, var(--aurora-border-strong))"
            : "var(--aurora-border-strong)"
        }`,
        boxShadow: focused
          ? "0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent)"
          : indeterminate || currentChecked
            ? "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent)"
            : "var(--aurora-highlight-medium)",
        color: "var(--aurora-accent-strong)",
        opacity: disabled ? 0.45 : 1,
        transition: "background 140ms ease, border-color 140ms ease, box-shadow 140ms ease",
      }}
    >
      <Check
        className={cn("h-[13px] w-[13px]", indeterminate ? "hidden" : currentChecked ? "block" : "hidden")}
        strokeWidth="2.4"
      />
      <Minus
        className={cn("h-[13px] w-[13px]", indeterminate ? "block" : "hidden")}
        strokeWidth="2.4"
      />
    </span>
  )

  if (!children) {
    return (
      <label
        htmlFor={resolvedId}
        className={cn(
          "inline-flex items-center",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className
        )}
        style={style}
      >
        {input}
        {indicator}
      </label>
    )
  }

  return (
    <label
      htmlFor={resolvedId}
      className={cn(
        "inline-flex items-center gap-[10px]",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
      style={style}
    >
      {input}
      {indicator}
      <span
        style={{
          color: disabled ? "var(--aurora-disabled-text)" : "var(--aurora-text-primary)",
          fontFamily: "var(--aurora-font-sans)",
          fontSize: "var(--aurora-type-control)",
          fontWeight: "var(--aurora-weight-body)",
          letterSpacing: "var(--aurora-letter-ui)",
          lineHeight: "var(--aurora-line-ui)",
          userSelect: "none",
        }}
      >
        {children}
      </span>
    </label>
  )
}

export { Checkbox }
export default Checkbox
