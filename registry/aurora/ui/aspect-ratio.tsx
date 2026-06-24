"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number
}

function AspectRatio({ ref, className, ratio = 16 / 9, style, ...props }: AspectRatioProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn("relative w-full overflow-hidden", className)}
      style={{
        aspectRatio: `${ratio}`,
        ...style,
      }}
      {...props}
    />
  )
}

export { AspectRatio }
export default AspectRatio
