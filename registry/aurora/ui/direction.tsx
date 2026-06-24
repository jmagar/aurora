"use client"

import * as React from "react"

export interface DirectionProps extends React.HTMLAttributes<HTMLDivElement> {
  dir?: "ltr" | "rtl"
}

export function Direction({ ref, dir = "ltr", ...props }: DirectionProps & { ref?: React.Ref<HTMLDivElement> }) {
  return <div ref={ref} dir={dir} {...props} />
}

export default Direction

