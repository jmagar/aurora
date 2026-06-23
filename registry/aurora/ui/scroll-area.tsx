"use client"

import * as React from "react"

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string
  /** Max height of the scrollable viewport. Number → px. Omit for the default 18rem cap. */
  maxHeight?: number | string
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, viewportClassName, style, children, maxHeight, ...props }, ref) => (
    <div
      ref={ref}
      className={["overflow-hidden rounded-[8px] border", className].filter(Boolean).join(" ")}
      style={{
        background: "var(--aurora-panel-medium)",
        borderColor: "var(--aurora-border-default)",
        ...style,
      }}
      {...props}
    >
      <div
        className={[
          // Default viewport: 18rem cap + Aurora scrollbar (Axon contract marker).
          maxHeight === undefined
            ? "max-h-72 overflow-auto aurora-scrollbar"
            : "overflow-auto aurora-scrollbar",
          viewportClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        style={
          maxHeight === undefined
            ? undefined
            : { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight }
        }
      >
        {children}
      </div>
    </div>
  )
)
ScrollArea.displayName = "ScrollArea"

export default ScrollArea
