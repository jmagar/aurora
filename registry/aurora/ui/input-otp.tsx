"use client"

import * as React from "react"

export interface InputOTPProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  length?: number
  value?: string
  onChange?: (value: string) => void
}

export function InputOTP({ length = 6, value = "", onChange, className, style, ...props }: InputOTPProps) {
  const chars = value.padEnd(length).slice(0, length).split("")

  return (
    <div
      role="group"
      aria-label="One-time passcode"
      className={["flex gap-2", className].filter(Boolean).join(" ")}
      style={style}
      {...props}
    >
      {chars.map((char, index) => (
        <input
          key={index}
          aria-label={`Digit ${index + 1}`}
          inputMode="numeric"
          maxLength={1}
          value={char.trim()}
          onChange={(event) => {
            const next = chars.slice()
            next[index] = event.target.value.slice(-1)
            onChange?.(next.join("").trim())
          }}
          className="size-10 rounded-[8px] border text-center aurora-text-code focus-visible:outline-none [&:focus-visible]:ring-2 [&:focus-visible]:ring-[var(--aurora-focus-ring)]"
          style={{
            background: "var(--aurora-control-surface)",
            borderColor: "var(--aurora-border-strong)",
            color: "var(--aurora-text-primary)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "color-mix(in srgb, var(--aurora-accent-primary) 42%, var(--aurora-border-strong))"
            e.currentTarget.style.boxShadow = "0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 45%, transparent)"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = ""
            e.currentTarget.style.boxShadow = ""
          }}
        />
      ))}
    </div>
  )
}

export default InputOTP

