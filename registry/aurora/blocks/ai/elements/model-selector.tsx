"use client"

import * as React from "react"
import { Cpu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/registry/aurora/ui/select"

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

const ModelSelector = (
    { ref,
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
    }: ModelSelectorProps & { ref?: React.Ref<HTMLDivElement> }
  ) => {
    const reactId = React.useId()
    const descriptionId = description ? `${reactId}-description` : undefined
    const fallbackValue = models[0]

    return (
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
          style={{ color: "var(--axon-orange)", fontWeight: "var(--aurora-weight-heading)" }}
        >
          <Cpu className="size-3.5" aria-hidden style={{ color: "var(--axon-orange)" }} />
          {label}
        </div>
        <p id={descriptionId} className="aurora-text-meta" style={{ margin: 0 }}>
          {description}
        </p>
      </div>
      <Select
        value={value}
        defaultValue={defaultValue ?? fallbackValue}
        onValueChange={onValueChange}
        name={name}
        disabled={disabled || models.length === 0}
        required={required}
      >
        <SelectTrigger
          id={triggerId}
          aria-label={triggerLabel ?? label}
          aria-describedby={descriptionId}
          className="h-10 rounded-[10px]"
        >
          <SelectValue placeholder={placeholder ?? fallbackValue ?? "Select Model"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {models.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    )
  }
ModelSelector.displayName = "ModelSelector"

export { ModelSelector }
