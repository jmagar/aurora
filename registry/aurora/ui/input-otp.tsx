"use client"

import * as React from "react"

export interface InputOTPProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  length?: number
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Render a separator dot after the segment at this 1-based index. */
  separatorAfter?: number
}

export function InputOTP({
  length = 6,
  value: valueProp,
  defaultValue = "",
  onChange,
  separatorAfter,
  className,
  style,
  ...props
}: InputOTPProps) {
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const value = isControlled ? valueProp : internalValue

  const chars = value.padEnd(length).slice(0, length).split("")

  const commit = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  return (
    <div
      role="group"
      aria-label="One-time passcode"
      className={["flex items-center", className].filter(Boolean).join(" ")}
      style={{ gap: "12px", ...style }}
      {...props}
    >
      {chars.map((char, index) => {
        const filled = char.trim().length > 0
        return (
          <React.Fragment key={index}>
            <input
              aria-label={`Digit ${index + 1}`}
              inputMode="numeric"
              maxLength={1}
              value={char.trim()}
              onChange={(event) => {
                const next = chars.slice()
                next[index] = event.target.value.slice(-1)
                commit(next.join("").trimEnd())
              }}
              className="flex items-center justify-center text-center focus-visible:outline-none [&:focus-visible]:ring-0"
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                borderWidth: "1px",
                borderStyle: "solid",
                fontFamily: "var(--font-mono)",
                fontSize: "22px",
                fontWeight: 600,
                lineHeight: 1,
                transition: "border-color var(--motion-fast, 140ms) ease, box-shadow var(--motion-fast, 140ms) ease, background var(--motion-fast, 140ms) ease",
                background: filled
                  ? "color-mix(in srgb, var(--aurora-accent-primary) 10%, var(--aurora-control-surface))"
                  : "var(--aurora-control-surface)",
                borderColor: filled
                  ? "color-mix(in srgb, var(--aurora-accent-primary) 55%, var(--aurora-border-strong))"
                  : "var(--aurora-border-strong)",
                color: "var(--aurora-text-primary)",
                boxShadow: filled
                  ? "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent), 0 0 18px color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)"
                  : "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  "color-mix(in srgb, var(--aurora-accent-primary) 70%, var(--aurora-border-strong))"
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px var(--aurora-focus-ring), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 55%, transparent)"
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = filled
                  ? "color-mix(in srgb, var(--aurora-accent-primary) 55%, var(--aurora-border-strong))"
                  : "var(--aurora-border-strong)"
                e.currentTarget.style.boxShadow = filled
                  ? "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent), 0 0 18px color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)"
                  : "none"
              }}
            />
            {separatorAfter === index + 1 && index + 1 < length ? (
              <span
                aria-hidden="true"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "8px",
                  color: "var(--aurora-text-muted)",
                  fontSize: "22px",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                ·
              </span>
            ) : null}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default InputOTP
