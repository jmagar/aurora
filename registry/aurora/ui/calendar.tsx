"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  month?: Date
  selected?: Date
  onSelect?: (date: Date) => void
}

function sameDay(a?: Date, b?: Date) {
  return Boolean(a && b && a.toDateString() === b.toDateString())
}

function buildDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const start = new Date(first)
  start.setDate(first.getDate() - first.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

export function Calendar({ month, selected, onSelect, className, style, ...props }: CalendarProps) {
  const [visibleMonth, setVisibleMonth] = React.useState(month ?? new Date())
  const days = buildDays(visibleMonth)
  const formatter = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" })

  return (
    <div
      className={["grid gap-3 rounded-[8px] border p-3", className].filter(Boolean).join(" ")}
      style={{
        background: "var(--aurora-panel-medium)",
        borderColor: "var(--aurora-border-default)",
        color: "var(--aurora-text-primary)",
        boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
        ...style,
      }}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="neutral"
          size="icon"
          aria-label="Previous month"
          onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
        >
          <ChevronLeft className="size-4" aria-hidden />
        </Button>
        <div className="aurora-text-section" style={{ fontSize: "var(--aurora-type-control)", fontWeight: "var(--aurora-weight-label)" }}>{formatter.format(visibleMonth)}</div>
        <Button
          type="button"
          variant="neutral"
          size="icon"
          aria-label="Next month"
          onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
        >
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="grid h-7 place-items-center aurora-text-meta" style={{ fontWeight: 700 }}>
            {day}
          </div>
        ))}
        {days.map((date) => {
          const isCurrentMonth = date.getMonth() === visibleMonth.getMonth()
          const isSelected = sameDay(date, selected)
          return (
            <Button variant="plain" size="unstyled"
              key={date.toISOString()}
              type="button"
              className="grid h-8 place-items-center rounded-[6px] border text-sm transition-colors"
              onClick={() => onSelect?.(date)}
              style={{
                background: isSelected ? "color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)" : "transparent",
                borderColor: isSelected ? "color-mix(in srgb, var(--aurora-accent-primary) 45%, transparent)" : "transparent",
                color: isCurrentMonth ? "var(--aurora-text-primary)" : "var(--aurora-disabled-text)",
                boxShadow: isSelected ? "var(--aurora-active-glow)" : "none",
              }}
            >
              {date.getDate()}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar

