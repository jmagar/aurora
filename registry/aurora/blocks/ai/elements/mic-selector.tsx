"use client"

/**
 * Aurora MicSelector — microphone picker with a live input-level meter + mute.
 *
 * Visual layer lives in registry/aurora/styles/aurora-components.css
 * (`@layer aurora-components`, reading only `--aurora-*` tokens) so it renders
 * identically in dark + `.light`. Architecture stays shadcn/registry-grade: a Radix `Select`
 * for device choice, `forwardRef`, `displayName`, `React.memo`, full a11y on the
 * mute toggle (`aria-pressed` + `aria-label`), and the original prop/escape-hatch
 * API (`value`/`defaultValue`/`onValueChange`/`name`/`disabled`/`required`/
 * `triggerId`/`triggerLabel`).
 */

import * as React from "react"
import { Mic, MicOff } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/aurora/ui/select"
import { Button } from "@/registry/aurora/ui/button"
import { cn } from "@/lib/utils"

export interface MicSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Available input devices, listed in the dropdown. */
  devices: string[]
  /** Controlled selected device. */
  value?: string
  /** Uncontrolled initial device (defaults to `devices[0]`). */
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Form field name for the underlying select. */
  name?: string
  disabled?: boolean
  required?: boolean
  /** `id` wired onto the select trigger (label association). */
  triggerId?: string
  /** Accessible label for the select trigger. Defaults to "Microphone". */
  triggerLabel?: string
  /** Controlled mute state for the toggle. */
  muted?: boolean
  /** Uncontrolled initial mute state. */
  defaultMuted?: boolean
  onMutedChange?: (muted: boolean) => void
}

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

// Bar layout: varying widths (in flex units) with a peaking dot near center.
const BAR_WEIGHTS = [1, 1.2, 1.6, 1.4, 2, 1.5, 1.4, 1.8, "peak", 1.9, 1.5, 1.3, 1.7, 1.4, 2, 1.6, 1.3, 1.8, 1.4, 1.2]

// ─── Component ──────────────────────────────────────────────────────────────

const MicSelector = (
    { ref,
      devices,
      value,
      defaultValue,
      onValueChange,
      name,
      disabled,
      required,
      triggerId,
      triggerLabel,
      muted,
      defaultMuted,
      onMutedChange,
      className,
      ...props
    }: MicSelectorProps & { ref?: React.Ref<HTMLDivElement> }
  ) => {
    const isMuteControlled = muted !== undefined
    const [internalMuted, setInternalMuted] = React.useState(defaultMuted ?? false)
    const isMuted = isMuteControlled ? muted : internalMuted

    const toggleMute = React.useCallback(() => {
      const next = !isMuted
      if (!isMuteControlled) setInternalMuted(next)
      onMutedChange?.(next)
    }, [isMuted, isMuteControlled, onMutedChange])

    return (
      <div
        ref={ref}
        className={cn("aurora-mic", isMuted && "aurora-mic--muted", className)}
        {...props}
      >
        <div className="aurora-mic__head">
          <span className="aurora-mic__title">
            <Mic className="size-3.5" aria-hidden />
            Microphone
          </span>
          <Button
            type="button"
            variant={isMuted ? "destructive" : "neutral"}
            size="icon"
            className="aurora-mic__mute"
            aria-pressed={isMuted}
            aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
            disabled={disabled}
            onClick={toggleMute}
          >
            {isMuted ? (
              <MicOff className="size-4" aria-hidden />
            ) : (
              <Mic className="size-4" aria-hidden />
            )}
          </Button>
        </div>

        <div className="aurora-mic__meter" aria-hidden>
          {BAR_WEIGHTS.map((weight, i) =>
            weight === "peak" ? (
              <span key={i} className="aurora-mic__bar aurora-mic__bar--peak" />
            ) : (
              <span
                key={i}
                className="aurora-mic__bar"
                style={{
                  flexGrow: weight as number,
                  animationDelay: `${(i % 6) * 90}ms`,
                }}
              />
            )
          )}
        </div>

        <Select
          value={value}
          defaultValue={defaultValue ?? devices[0]}
          onValueChange={onValueChange}
          name={name}
          disabled={disabled}
          required={required}
        >
          <SelectTrigger
            id={triggerId}
            aria-label={triggerLabel ?? "Microphone"}
            className="h-11 rounded-[10px]"
          >
            <SelectValue placeholder={devices[0]} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {devices.map((device) => (
                <SelectItem key={device} value={device}>
                  {device}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    )
  }
MicSelector.displayName = "MicSelector"

const MemoMicSelector = React.memo(MicSelector)
MemoMicSelector.displayName = "MicSelector"

export { MemoMicSelector as MicSelector }
export default MemoMicSelector
