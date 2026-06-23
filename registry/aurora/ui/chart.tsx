"use client"

import * as React from "react"

export interface ChartDatum {
  label: string
  value: number
}

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ChartDatum[]
  type?: "bar" | "line" | "area"
  /** Accent color for the series. Defaults to the Aurora cyan accent. */
  color?: string
}

export function Chart({
  data,
  type = "bar",
  color = "var(--aurora-accent-primary)",
  className,
  style,
  ...props
}: ChartProps) {
  const reactId = React.useId()
  const gradId = `aurora-chart-grad-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`
  const areaGradId = `aurora-chart-area-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`

  const max = Math.max(1, ...data.map((item) => item.value))
  const points = data
    .map((item, index) => {
      const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100
      const y = 90 - (item.value / max) * 72
      return `${x},${y}`
    })
    .join(" ")
  const areaPoints = `0,90 ${points} 100,90`

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
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--aurora-accent-strong)" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
          <linearGradient id={areaGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="var(--aurora-border-default)" strokeWidth="0.5">
          {[20, 40, 60, 80].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} />
          ))}
        </g>
        {type === "area" ? (
          <>
            <polygon points={areaPoints} fill={`url(#${areaGradId})`} stroke="none" />
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((item, index) => {
              const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100
              const y = 90 - (item.value / max) * 72
              return <circle key={index} cx={x} cy={y} r="2.2" fill={color} />
            })}
          </>
        ) : type === "line" ? (
          <>
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((item, index) => {
              const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100
              const y = 90 - (item.value / max) * 72
              return <circle key={index} cx={x} cy={y} r="2.2" fill="var(--aurora-accent-strong)" />
            })}
          </>
        ) : (
          data.map((item, index) => {
            const width = 70 / data.length
            const x = 12 + index * (76 / data.length)
            const height = (item.value / max) * 72
            return (
              <rect
                key={index}
                x={x}
                y={90 - height}
                width={width}
                height={height}
                rx="1.5"
                fill={`url(#${gradId})`}
              />
            )
          })
        )}
      </svg>
      <div className="mt-3 grid gap-2">
        {data.map((item, index) => (
          <div key={index} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 aurora-text-meta">
            <span className="truncate">{item.label}</span>
            <span className="aurora-text-code" style={{ color: "var(--aurora-text-primary)" }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Chart
