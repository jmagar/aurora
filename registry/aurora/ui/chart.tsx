"use client"

import * as React from "react"

export interface ChartDatum {
  label: string
  value: number
}

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ChartDatum[]
  type?: "bar" | "line"
}

export function Chart({ data, type = "bar", className, style, ...props }: ChartProps) {
  const max = Math.max(1, ...data.map((item) => item.value))
  const points = data.map((item, index) => {
    const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100
    const y = 90 - (item.value / max) * 72
    return `${x},${y}`
  }).join(" ")

  return (
    <div
      className={["rounded-[8px] border p-4", className].filter(Boolean).join(" ")}
      style={{
        background: "var(--aurora-panel-medium)",
        borderColor: "var(--aurora-border-default)",
        color: "var(--aurora-text-primary)",
        ...style,
      }}
      {...props}
    >
      <svg viewBox="0 0 100 100" role="img" aria-label="Chart" className="h-48 w-full overflow-visible">
        <g stroke="var(--aurora-border-default)" strokeWidth="0.5">
          {[20, 40, 60, 80].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} />)}
        </g>
        {type === "line" ? (
          <>
            <polyline points={points} fill="none" stroke="var(--aurora-accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {data.map((item, index) => {
              const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100
              const y = 90 - (item.value / max) * 72
              return <circle key={item.label} cx={x} cy={y} r="2.2" fill="var(--aurora-accent-strong)" />
            })}
          </>
        ) : (
          data.map((item, index) => {
            const width = 70 / data.length
            const x = 12 + index * (76 / data.length)
            const height = (item.value / max) * 72
            return (
              <rect
                key={item.label}
                x={x}
                y={90 - height}
                width={width}
                height={height}
                rx="1.5"
                fill="color-mix(in srgb, var(--aurora-accent-primary) 68%, transparent)"
              />
            )
          })
        )}
      </svg>
      <div className="mt-3 grid gap-2">
        {data.map((item) => (
          <div key={item.label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 aurora-text-meta">
            <span className="truncate">{item.label}</span>
            <span className="aurora-text-code" style={{ color: "var(--aurora-text-primary)" }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Chart

