"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, style, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("aurora-text-label", className)}
    style={{
      color: "var(--aurora-text-muted)",
      cursor: "default",
      ...style,
    }}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
export default Label
