"use client"

import * as React from "react"
import { DatePicker } from "@/registry/aurora/ui/date-picker"

/**
 * DatePicker gallery demo — reproduces the Claude Design dsCard composition 1:1:
 * a single DatePicker, open by default, with the 12th of the current month
 * selected so the popover month grid shows the cyan-filled selected day.
 */
export default function DatePickerDemo() {
  const selected = React.useMemo(() => {
    const d = new Date()
    d.setDate(12)
    return d
  }, [])

  return (
    <div style={{ minHeight: 340, padding: 30 }}>
      <DatePicker defaultOpen defaultValue={selected} />
    </div>
  )
}
