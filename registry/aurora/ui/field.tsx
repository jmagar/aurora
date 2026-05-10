"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
  disabled?: boolean
  htmlFor?: string
  orientation?: "vertical" | "horizontal"
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
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
    },
    ref
  ) => {
    const invalid = Boolean(error)

    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-2",
          orientation === "horizontal" && "items-start gap-4 sm:grid-cols-[180px_minmax(0,1fr)]",
          disabled && "opacity-55",
          className
        )}
        data-disabled={disabled ? "" : undefined}
        data-invalid={invalid ? "" : undefined}
        {...props}
      >
        {(label || description) && (
          <div className="min-w-0">
            {label && (
              <label
                htmlFor={htmlFor}
                className="block"
                style={{
                  color: "var(--aurora-text-primary)",
                  fontFamily: "var(--aurora-font-sans)",
                  fontSize: "var(--aurora-type-body-sm)",
                  fontWeight: "var(--aurora-weight-label)",
                  letterSpacing: "var(--aurora-letter-label)",
                  lineHeight: "var(--aurora-line-ui)",
                }}
              >
                {label}
                {required && (
                  <span aria-hidden="true" style={{ color: "var(--aurora-error)", marginLeft: 4 }}>
                    *
                  </span>
                )}
              </label>
            )}
            {description && (
              <p
                style={{
                  color: "var(--aurora-text-muted)",
                  fontSize: "var(--aurora-type-caption)",
                  lineHeight: 1.45,
                  marginTop: label ? 4 : 0,
                }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        <div className="min-w-0">
          {children}
          {error && (
            <p
              role="alert"
              style={{
                color: "var(--aurora-error)",
                fontFamily: "var(--aurora-font-sans)",
                fontSize: "var(--aurora-type-caption)",
                fontWeight: 560,
                lineHeight: 1.45,
                marginTop: 6,
              }}
            >
              {error}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Field.displayName = "Field"

export { Field }
export default Field
