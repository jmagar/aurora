"use client"

import * as React from "react"
import { CalendarDays } from "lucide-react"
import { Input } from "@/registry/aurora/ui/input"

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, ...props }, ref) => (
    <label className={["grid gap-1.5", className].filter(Boolean).join(" ")}>
      {label ? <span className="aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}>{label}</span> : null}
      <span className="relative">
        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" aria-hidden style={{ color: "var(--aurora-text-muted)" }} />
        <Input ref={ref} type="date" style={{ paddingLeft: 34 }} {...props} />
      </span>
    </label>
  )
)
DatePicker.displayName = "DatePicker"

export default DatePicker

