"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function InputGroup({ ref, className, style, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn("flex min-h-9 w-full items-center overflow-hidden rounded-[8px] border", className)}
      style={{
        background: "var(--aurora-control-surface)",
        borderColor: "var(--aurora-border-strong)",
        ...style,
      }}
      {...props}
    />
  )
}

function InputGroupAddon({ ref, className, style, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn("inline-flex h-full items-center border-r px-3 aurora-text-control", className)}
      style={{ borderColor: "var(--aurora-border-default)", color: "var(--aurora-text-muted)", ...style }}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon }
export default InputGroup
