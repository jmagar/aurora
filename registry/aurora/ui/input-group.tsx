"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"
import { Textarea } from "./textarea"

type InputGroupAddonAlign = "inline-start" | "inline-end"

function InputGroup({ ref, className, style, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      data-slot="input-group"
      className={cn(
        "flex min-h-9 w-full items-center overflow-hidden rounded-[8px] border",
        "transition-[border-color,box-shadow] duration-150 ease-out",
        "focus-within:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--aurora-accent-primary)_22%,transparent),0_0_0_1px_color-mix(in_srgb,var(--aurora-accent-primary)_45%,transparent)]",
        className
      )}
      style={{
        background: "var(--aurora-control-surface)",
        borderColor: "var(--aurora-border-strong)",
        ...style,
      }}
      {...props}
    />
  )
}

function InputGroupAddon({
  ref,
  className,
  style,
  align = "inline-start",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  align?: InputGroupAddonAlign
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={ref}
      data-slot="input-group-addon"
      className={cn(
        "inline-flex h-full shrink-0 items-center px-3 aurora-text-control",
        align === "inline-start" ? "border-r" : "border-l",
        className
      )}
      style={{
        borderColor: "var(--aurora-border-default)",
        color: "var(--aurora-text-muted)",
        order: align === "inline-end" ? 2 : 0,
        ...style,
      }}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  style,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      unstyled
      className={cn(
        "h-full min-w-0 flex-1 bg-transparent px-3",
        "font-[var(--aurora-font-sans)] text-[var(--aurora-text-primary)]",
        "placeholder:text-[var(--aurora-text-muted)]",
        "focus:outline-none disabled:cursor-not-allowed",
        className
      )}
      style={{
        fontSize: "var(--aurora-type-body-sm)",
        fontWeight: "var(--aurora-weight-body)",
        letterSpacing: "var(--aurora-letter-ui)",
        lineHeight: "var(--aurora-line-ui)",
        ...style,
      }}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  style,
  rows = 3,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      unstyled
      rows={rows}
      className={cn(
        "min-h-[96px] min-w-0 flex-1 resize-y bg-transparent px-3 py-2.5",
        "font-[var(--aurora-font-sans)] text-[var(--aurora-text-primary)]",
        "placeholder:text-[var(--aurora-text-muted)]",
        "focus:outline-none disabled:cursor-not-allowed",
        className
      )}
      style={{
        fontSize: "var(--aurora-type-body-sm)",
        fontWeight: "var(--aurora-weight-body)",
        letterSpacing: "var(--aurora-letter-ui)",
        lineHeight: "1.55",
        ...style,
      }}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea }
export default InputGroup
