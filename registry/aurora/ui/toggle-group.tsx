"use client"

import * as React from "react"
import { Toggle, type ToggleProps } from "./toggle"
import { cn } from "@/lib/utils"

type ToggleGroupType = "single" | "multiple"
type ToggleGroupValue = string | string[]

type ToggleGroupContextValue = {
  disabled: boolean
  orientation: "horizontal" | "vertical"
  type: ToggleGroupType
  values: string[]
  setPressed: (value: string, pressed: boolean) => void
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null)

export interface ToggleGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  orientation?: "horizontal" | "vertical"
  type?: ToggleGroupType
  value?: ToggleGroupValue
  defaultValue?: ToggleGroupValue
  onValueChange?: (value: ToggleGroupValue) => void
  disabled?: boolean
}

function toArray(type: ToggleGroupType, value: ToggleGroupValue | undefined) {
  if (value == null) return []
  if (Array.isArray(value)) return type === "multiple" ? value : value.slice(0, 1)
  return value === "" ? [] : [value]
}

function fromArray(type: ToggleGroupType, values: string[]): ToggleGroupValue {
  return type === "multiple" ? values : values[0] ?? ""
}

function ToggleGroup({
  ref,
  className,
  orientation = "horizontal",
  type = "multiple",
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  style,
  children,
  ...props
}: ToggleGroupProps & { ref?: React.Ref<HTMLDivElement> }) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState<string[]>(
    toArray(type, defaultValue)
  )
  const values = isControlled ? toArray(type, value) : internalValue

  const setPressed = React.useCallback(
    (itemValue: string, pressed: boolean) => {
      const nextValues =
        type === "multiple"
          ? pressed
            ? Array.from(new Set([...values, itemValue]))
            : values.filter((value) => value !== itemValue)
          : pressed
            ? [itemValue]
            : []

      if (!isControlled) {
        setInternalValue(nextValues)
      }
      onValueChange?.(fromArray(type, nextValues))
    },
    [isControlled, onValueChange, type, values]
  )

  const contextValue = React.useMemo<ToggleGroupContextValue>(
    () => ({
      disabled,
      orientation,
      type,
      values,
      setPressed,
    }),
    [disabled, orientation, setPressed, type, values]
  )

  return (
    <div
      ref={ref}
      role="toolbar"
      aria-orientation={orientation}
      data-aurora-toggle-group
      data-orientation={orientation}
      className={cn(
        "inline-flex border",
        orientation === "vertical" ? "flex-col" : "items-center",
        className
      )}
      style={{
        gap: 4,
        padding: 4,
        borderRadius: 10,
        background:
          "linear-gradient(180deg, var(--aurora-panel-strong-top), var(--aurora-panel-strong))",
        borderColor:
          "color-mix(in srgb, var(--aurora-panel-strong) 72%, var(--aurora-page-bg))",
        boxShadow: "var(--aurora-highlight-medium)",
        ...style,
      }}
      {...props}
    >
      <ToggleGroupContext.Provider value={contextValue}>
        {children}
      </ToggleGroupContext.Provider>
    </div>
  )
}

export interface ToggleGroupItemProps extends Omit<ToggleProps, "pressed" | "onPressedChange"> {
  value: string
}

function moveGroupFocus(
  currentTarget: HTMLButtonElement,
  direction: "next" | "previous" | "first" | "last"
) {
  const group = currentTarget.closest<HTMLElement>("[data-aurora-toggle-group]")
  if (!group) return
  const items = Array.from(
    group.querySelectorAll<HTMLButtonElement>("[data-aurora-toggle-group-item]:not(:disabled)")
  )
  const currentIndex = items.indexOf(currentTarget)
  if (currentIndex === -1 || items.length <= 1) return
  const nextIndex =
    direction === "first"
      ? 0
      : direction === "last"
        ? items.length - 1
        : direction === "next"
          ? (currentIndex + 1) % items.length
          : (currentIndex - 1 + items.length) % items.length
  items[nextIndex]?.focus()
}

function ToggleGroupItem({
  ref,
  value,
  className,
  disabled,
  onKeyDown,
  ...props
}: ToggleGroupItemProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const context = React.useContext(ToggleGroupContext)

  if (!context) {
    throw new Error("ToggleGroupItem must be used within ToggleGroup")
  }

  const isDisabled = context.disabled || disabled
  const isPressed = context.values.includes(value)

  return (
    <Toggle
      ref={ref}
      data-aurora-toggle-group-item
      value={value}
      pressed={isPressed}
      disabled={isDisabled}
      onPressedChange={(pressed) => context.setPressed(value, pressed)}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented || isDisabled) return

        if (
          event.key === "ArrowRight" ||
          (context.orientation === "vertical" && event.key === "ArrowDown")
        ) {
          event.preventDefault()
          moveGroupFocus(event.currentTarget, "next")
        } else if (
          event.key === "ArrowLeft" ||
          (context.orientation === "vertical" && event.key === "ArrowUp")
        ) {
          event.preventDefault()
          moveGroupFocus(event.currentTarget, "previous")
        } else if (event.key === "Home") {
          event.preventDefault()
          moveGroupFocus(event.currentTarget, "first")
        } else if (event.key === "End") {
          event.preventDefault()
          moveGroupFocus(event.currentTarget, "last")
        }
      }}
      className={cn(className)}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
export default ToggleGroup
