"use client"

import * as React from "react"
import { Play, Sparkles } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/aurora/ui/select"

export interface VoiceSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  voices: string[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  disabled?: boolean
  required?: boolean
  triggerId?: string
  triggerLabel?: string
}

// Static waveform bar heights (px), tuned to mirror the CD preview's player row.
const WAVEFORM_BARS = [9, 14, 7, 18, 11, 22, 8, 16, 6, 13, 9]

const VoiceSelector = React.forwardRef<HTMLDivElement, VoiceSelectorProps>(
  (
    {
      voices,
      value,
      defaultValue,
      onValueChange,
      name,
      disabled,
      required,
      triggerId,
      triggerLabel,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string>(
      value ?? defaultValue ?? voices[0]
    )
    const selected = value ?? internalValue

    const handleChange = React.useCallback(
      (next: string) => {
        if (value === undefined) setInternalValue(next)
        onValueChange?.(next)
      },
      [value, onValueChange]
    )

    return (
      <div
        ref={ref}
        className={["overflow-hidden border", className].filter(Boolean).join(" ")}
        style={{
          background: "var(--aurora-surface-raised)",
          borderColor: "var(--aurora-border-strong)",
          borderRadius: "var(--aurora-radius-2)",
          boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
          color: "var(--aurora-text-primary)",
          ...style,
        }}
        {...props}
      >
        {/* Header band */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{
            background: "var(--aurora-panel-medium-top)",
            borderBottom: "1px solid var(--aurora-border-default)",
          }}
        >
          <Sparkles
            className="size-3.5"
            aria-hidden
            style={{ color: "var(--aurora-accent-pink)" }}
          />
          <span
            className="aurora-text-label"
            style={{
              color: "var(--aurora-accent-pink)",
              fontFamily: "var(--aurora-font-display)",
              fontWeight: 700,
            }}
          >
            Voice
          </span>
        </div>

        {/* Body */}
        <div className="grid gap-3 px-4 py-4">
          <p className="aurora-text-meta" style={{ margin: 0 }}>
            Voice used for spoken audio output.
          </p>

          <Select
            value={value}
            defaultValue={defaultValue ?? voices[0]}
            onValueChange={handleChange}
            name={name}
            disabled={disabled}
            required={required}
          >
            <SelectTrigger
              id={triggerId}
              aria-label={triggerLabel ?? "Voice"}
              className="h-10 rounded-[10px]"
            >
              <SelectValue placeholder={voices[0]} />
            </SelectTrigger>
            <SelectContent>
              {voices.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Player row */}
          <div
            className="flex items-center gap-3 rounded-[12px] border px-4 py-3"
            style={{
              background: "var(--aurora-panel-medium)",
              borderColor: "var(--aurora-border-default)",
            }}
          >
            <button
              type="button"
              aria-label={`Preview ${selected} voice`}
              disabled={disabled}
              className="grid size-11 shrink-0 place-items-center rounded-full border transition-colors"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--aurora-accent-pink) 50%, var(--aurora-border-default))",
                background:
                  "color-mix(in srgb, var(--aurora-accent-pink) 10%, transparent)",
                color: "var(--aurora-accent-pink)",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.55 : 1,
              }}
            >
              <Play className="size-4" fill="currentColor" aria-hidden />
            </button>

            <div
              className="flex h-6 flex-1 items-end gap-[3px]"
              aria-hidden
            >
              {WAVEFORM_BARS.map((height, index) => (
                <span
                  key={index}
                  style={{
                    display: "block",
                    width: 3,
                    height,
                    borderRadius: 999,
                    background: "var(--aurora-text-muted)",
                    opacity: 0.55,
                  }}
                />
              ))}
            </div>

            <span
              className="shrink-0 aurora-text-control"
              style={{
                color: "var(--aurora-text-primary)",
                fontFamily: "var(--aurora-font-display)",
                fontWeight: 700,
              }}
            >
              {selected}
            </span>
          </div>
        </div>
      </div>
    )
  }
)
VoiceSelector.displayName = "VoiceSelector"

export { VoiceSelector }
