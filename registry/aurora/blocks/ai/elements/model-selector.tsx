"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/aurora/ui/select"

export interface ModelSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  models: string[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  label?: string
  description?: string
  name?: string
  disabled?: boolean
  required?: boolean
  triggerId?: string
  triggerLabel?: string
  placeholder?: string
}

const ModelSelector = React.forwardRef<HTMLDivElement, ModelSelectorProps>(
  (
    {
      models,
      value,
      defaultValue,
      onValueChange,
      label = "Model",
      description = "Select a model for this conversation.",
      name,
      disabled,
      required,
      triggerId,
      triggerLabel,
      placeholder,
      className,
      style,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn("grid gap-3 border p-3", className)}
      style={{
        background: "var(--aurora-surface-raised)",
        borderColor: "var(--aurora-border-strong)",
        borderRadius: "var(--aurora-radius-1)",
        boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
        ...style,
      }}
      {...props}
    >
      <div className="grid gap-1">
        <div
          className="flex items-center gap-2 aurora-text-label"
          style={{ color: "var(--aurora-accent-pink)", fontWeight: "var(--aurora-weight-heading)" }}
        >
          <Sparkles className="size-3.5" aria-hidden style={{ color: "var(--aurora-accent-pink)" }} />
          {label}
        </div>
        <p className="aurora-text-meta" style={{ margin: 0 }}>
          {description}
        </p>
      </div>
      <Select
        value={value}
        defaultValue={defaultValue ?? models[0]}
        onValueChange={onValueChange}
        name={name}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger id={triggerId} aria-label={triggerLabel ?? label} className="h-10 rounded-[10px]">
          <SelectValue placeholder={placeholder ?? models[0]} />
        </SelectTrigger>
        <SelectContent>
          {models.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
)
ModelSelector.displayName = "ModelSelector"

export { ModelSelector }
