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
    <div className={["flex gap-2", className].filter(Boolean).join(" ")} style={style} {...props}>
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
          className="size-10 rounded-[8px] border text-center aurora-text-code"
          style={{
            background: "var(--aurora-control-surface)",
            borderColor: "var(--aurora-border-strong)",
            color: "var(--aurora-text-primary)",
          }}
        />
      ))}
    </div>
  )
}

export default InputOTP

