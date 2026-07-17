"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
  disabled?: boolean
  htmlFor?: string
  orientation?: "vertical" | "horizontal"
}

function FieldGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-4", className)} {...props} />
}

function FieldSet({ className, ...props }: React.FieldsetHTMLAttributes<HTMLFieldSetElement>) {
  return <fieldset className={cn("grid gap-3", className)} {...props} />
}

function FieldLegend({ className, ...props }: React.HTMLAttributes<HTMLLegendElement>) {
  return (
    <legend
      data-slot="field-legend"
      className={cn("aurora-text-label mb-1 text-[var(--aurora-text-primary)]", className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="field-content" className={cn("grid gap-1.5", className)} {...props} />
}

function FieldTitle({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="field-title"
      className={cn("aurora-text-control text-[var(--aurora-text-primary)]", className)}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="field-description"
      className={cn("aurora-text-body-sm text-[var(--aurora-text-muted)]", className)}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn("w-full justify-between text-[var(--aurora-text-primary)]", className)}
      {...props}
    />
  )
}

function FieldError({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      role="alert"
      data-slot="field-error"
      className={cn("aurora-text-body-sm font-[var(--aurora-weight-ui)] text-[var(--aurora-error)]", className)}
      {...props}
    />
  )
}

function Field({
  ref,
  className,
  children,
  label,
  description,
  error,
  required,
  disabled,
  htmlFor,
  orientation = "vertical",
  ...props
}: FieldProps & { ref?: React.Ref<HTMLDivElement> }) {
  const rawProps = props as React.HTMLAttributes<HTMLDivElement> & {
    "data-disabled"?: string
    "data-invalid"?: string
  }
  const invalid = rawProps["data-invalid"] !== undefined || Boolean(error)
  const disabledState = rawProps["data-disabled"] !== undefined || Boolean(disabled)
  const hasMeta = Boolean(label || description)

  return (
    <div
      ref={ref}
      className={cn(
        "grid gap-2",
        orientation === "horizontal" &&
          (hasMeta
            ? "items-start gap-4 sm:grid-cols-[180px_minmax(0,1fr)]"
            : "grid-cols-[auto_minmax(0,1fr)] items-start gap-3"),
        disabledState && "opacity-55",
        "[&[data-disabled]_[data-slot=field-description]]:text-[var(--aurora-text-muted)]",
        "[&[data-disabled]_[data-slot=field-label]]:text-[var(--aurora-text-muted)]",
        "[&[data-invalid]_[data-slot=field-description]]:text-[var(--aurora-error)]",
        "[&[data-invalid]_[data-slot=field-label]]:text-[var(--aurora-error)]",
        className
      )}
      data-disabled={disabledState ? "" : undefined}
      data-invalid={invalid ? "" : undefined}
      {...props}
    >
      {hasMeta ? (
        <>
          <FieldContent className="min-w-0">
            {label ? (
              <FieldLabel htmlFor={htmlFor} required={required} disabled={disabledState}>
                {label}
              </FieldLabel>
            ) : null}
            {description ? <FieldDescription>{description}</FieldDescription> : null}
          </FieldContent>
          <FieldContent className="min-w-0">
            {children}
            {error ? <FieldError>{error}</FieldError> : null}
          </FieldContent>
        </>
      ) : (
        children
      )}
    </div>
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
}
export default Field
