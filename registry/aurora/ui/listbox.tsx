"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

type ListboxOrientation = "vertical" | "horizontal"

export interface ListboxProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: ListboxOrientation
}

function Listbox({
  className,
  style,
  ref,
  orientation = "vertical",
  onKeyDown,
  ...props
}: ListboxProps & { ref?: React.Ref<HTMLDivElement> }) {
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return

      const root = event.currentTarget
      const options = Array.from(
        root.querySelectorAll<HTMLButtonElement>('[role="option"]:not(:disabled)'),
      )

      if (options.length === 0) return

      const activeElement =
        event.target instanceof HTMLElement
          ? event.target.closest<HTMLButtonElement>('[role="option"]')
          : null
      const currentIndex = activeElement
        ? options.indexOf(activeElement)
        : options.findIndex((option) => option.getAttribute("aria-selected") === "true")

      let nextIndex = currentIndex >= 0 ? currentIndex : 0
      const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown"
      const previousKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp"

      if (event.key === nextKey) {
        nextIndex = currentIndex >= 0 ? (currentIndex + 1) % options.length : 0
      } else if (event.key === previousKey) {
        nextIndex =
          currentIndex >= 0
            ? (currentIndex - 1 + options.length) % options.length
            : options.length - 1
      } else if (event.key === "Home") {
        nextIndex = 0
      } else if (event.key === "End") {
        nextIndex = options.length - 1
      } else {
        return
      }

      event.preventDefault()
      const nextOption = options[nextIndex]
      nextOption.focus()
    },
    [onKeyDown, orientation],
  )

  return (
    <div
      ref={ref}
      role="listbox"
      aria-orientation={orientation}
      className={cn(
        "overflow-hidden rounded-[var(--aurora-radius-2)] border p-2",
        className,
      )}
      style={{
        background: "var(--aurora-panel-strong)",
        borderColor: "var(--aurora-border-strong)",
        boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        ...style,
      }}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}

export interface ListboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode
}

function ListboxGroup({
  className,
  heading,
  children,
  ref,
  ...props
}: ListboxGroupProps & { ref?: React.Ref<HTMLDivElement> }) {
  const headingId = React.useId()

  return (
    <div
      ref={ref}
      role="group"
      aria-labelledby={heading ? headingId : undefined}
      className={cn("py-1", className)}
      {...props}
    >
      {heading ? (
        <div
          id={headingId}
          className="px-3 pb-2 pt-1"
          style={{
            color: "var(--aurora-text-muted)",
            fontSize: "var(--aurora-type-body-sm)",
            fontWeight: "var(--aurora-weight-label)",
            letterSpacing: "var(--aurora-letter-label)",
            lineHeight: "var(--aurora-line-dense)",
          }}
        >
          {heading}
        </div>
      ) : null}
      {children}
    </div>
  )
}

export interface ListboxItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  meta?: React.ReactNode
  active?: boolean
}

function ListboxItem({
  className,
  title,
  description,
  meta,
  active = false,
  style,
  ref,
  id,
  disabled,
  ...props
}: ListboxItemProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <Button
      ref={ref}
      id={id}
      variant="plain"
      size="unstyled"
      role="option"
      type="button"
      aria-selected={active}
      disabled={disabled}
      className={cn(
        "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--aurora-radius-1)] px-4 py-3 text-left outline-none transition-colors",
        className,
      )}
      style={{
        background: active ? "var(--aurora-hover-bg)" : "transparent",
        border: active
          ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 32%, transparent)"
          : "1px solid transparent",
        boxShadow: active ? "var(--aurora-active-glow)" : "none",
        color: "var(--aurora-text-primary)",
        opacity: disabled ? 0.58 : 1,
        ...style,
      }}
      {...props}
    >
      <span className="min-w-0">
        <span className="block truncate" style={{ fontSize: "var(--aurora-type-body)", fontWeight: "var(--aurora-weight-heading)", lineHeight: "var(--aurora-line-dense)" }}>{title}</span>
        {description ? <span className="mt-1 block truncate" style={{ color: "var(--aurora-text-muted)", fontSize: "var(--aurora-type-control)", fontWeight: "var(--aurora-weight-body)", lineHeight: 1.4 }}>{description}</span> : null}
      </span>
      {meta ? <span style={{ color: "var(--aurora-text-muted)", fontFamily: "var(--aurora-font-sans)", fontSize: "var(--aurora-type-label)", fontWeight: "var(--aurora-weight-ui)", letterSpacing: "var(--aurora-letter-label)", lineHeight: "var(--aurora-line-dense)" }}>{meta}</span> : null}
    </Button>
  )
}

export { Listbox, ListboxGroup, ListboxItem }
export default Listbox
