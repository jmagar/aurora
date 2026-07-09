"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ResizablePanelsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: number
  minSize?: number
  maxSize?: number
}

function ResizablePanels({ className, children, defaultSize = 34, minSize = 22, maxSize = 70, style, ...props }: ResizablePanelsProps) {
  const [size, setSize] = React.useState(defaultSize)
  const childrenArray = React.Children.toArray(children)

  return (
    <div
      className={cn("grid min-h-[280px] overflow-hidden rounded-[var(--aurora-radius-2)] border", className)}
      style={{
        gridTemplateColumns: `${size}% 8px minmax(0,1fr)`,
        borderColor: "var(--aurora-border-strong)",
        background: "var(--aurora-panel-medium)",
        ...style,
      }}
      {...props}
    >
      <div className="min-w-0 overflow-auto">{childrenArray[0]}</div>
      <input
        aria-label="Resize panels"
        type="range"
        min={minSize}
        max={maxSize}
        value={size}
        onChange={(event) => setSize(Number(event.target.value))}
        className="aurora-resizable-panels__input h-full w-2 cursor-col-resize appearance-none border-x bg-[var(--aurora-panel-strong)]"
        style={{ borderColor: "var(--aurora-border-default)" }}
      />
      <div className="min-w-0 overflow-auto">{childrenArray[1]}</div>
    </div>
  )
}

export { ResizablePanels }
export default ResizablePanels
