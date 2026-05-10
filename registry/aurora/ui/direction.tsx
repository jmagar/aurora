"use client"

import * as React from "react"

export interface DirectionProps extends React.HTMLAttributes<HTMLDivElement> {
  dir?: "ltr" | "rtl"
}

export const Direction = React.forwardRef<HTMLDivElement, DirectionProps>(
  ({ dir = "ltr", ...props }, ref) => <div ref={ref} dir={dir} {...props} />
)
Direction.displayName = "Direction"

export default Direction

