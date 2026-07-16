"use client"

import * as React from "react"
import { Play, Sparkles } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/aurora/ui/select"
import { Button } from "@/registry/aurora/ui/button"

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
const AI_ORANGE = "var(--axon-orange)"

const VoiceSelector = (
    { ref,
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
    }: VoiceSelectorProps & { ref?: React.Ref<HTMLDivElement> }
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
            style={{ color: AI_ORANGE }}
          />
          <span
            className="aurora-text-label"
            style={{
              color: AI_ORANGE,
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
              <SelectGroup>
                {voices.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
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
            <Button
              type="button"
              aria-label={`Preview ${selected} voice`}
              disabled={disabled}
              variant="neutral"
              size="icon"
              shape="pill"
              className="size-11 shrink-0"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--axon-orange) 50%, var(--aurora-border-default))",
                background:
                  "color-mix(in srgb, var(--axon-orange) 10%, transparent)",
                color: AI_ORANGE,
              }}
            >
              <Play className="size-4" fill="currentColor" aria-hidden />
            </Button>

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
                    background:
                      index < 6
                        ? "color-mix(in srgb, var(--axon-orange) 64%, var(--aurora-accent-primary))"
                        : "var(--aurora-text-muted)",
                    opacity: index < 6 ? 0.86 : 0.45,
                  }}
                />
              ))}
            </div>

            <span
              className="min-w-0 max-w-[42%] shrink-0 truncate aurora-text-control"
              title={selected}
              style={{
                color: "var(--aurora-text-primary)",
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
VoiceSelector.displayName = "VoiceSelector"

export { VoiceSelector }
