"use client"

/**
 * Aurora MicSelector — microphone picker with a live input-level meter + mute.
 *
 * Visual layer is ported 1:1 from the Claude Design source (a scoped <style>
 * injected once, reading only `--aurora-*` tokens) so it renders identically in
 * dark + `.light`. Architecture stays shadcn/registry-grade: a Radix `Select`
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/aurora/ui/select"
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

// ─── Visual layer (ported from Claude Design) ───────────────────────────────

const CSS = `
.aurora-mic {
  display: grid;
  gap: 14px;
  padding: 16px 18px;
  border: 1px solid var(--aurora-border-strong);
  border-radius: var(--aurora-radius-2);
  background: var(--aurora-surface-raised);
  box-shadow: var(--aurora-shadow-medium), var(--aurora-highlight-medium);
  box-sizing: border-box;
}
.aurora-mic__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.aurora-mic__title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--aurora-accent-primary);
  font-family: var(--aurora-font-sans, Inter, sans-serif);
  font-size: var(--aurora-type-control, 14px);
  font-weight: 680;
  letter-spacing: var(--aurora-letter-ui, 0);
  line-height: 1;
}
.aurora-mic__mute {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border: 1px solid var(--aurora-border-strong);
  border-radius: 10px;
  background: var(--aurora-panel-strong);
  color: var(--aurora-accent-primary);
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.045);
  transition: background 150ms var(--motion-ease-out, ease),
    border-color 150ms var(--motion-ease-out, ease),
    color 150ms var(--motion-ease-out, ease),
    box-shadow 200ms var(--motion-ease-out, ease);
}
.aurora-mic__mute:hover {
  border-color: color-mix(in srgb, var(--aurora-accent-primary) 55%, var(--aurora-border-strong));
  background: color-mix(in srgb, var(--aurora-accent-primary) 8%, var(--aurora-panel-strong));
}
.aurora-mic__mute:focus-visible {
  outline: none;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.045),
    0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 45%, transparent),
    0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent);
}
.aurora-mic__mute[aria-pressed="true"] {
  color: var(--aurora-error);
  border-color: color-mix(in srgb, var(--aurora-error) 46%, var(--aurora-border-strong));
  background: color-mix(in srgb, var(--aurora-error) 10%, var(--aurora-panel-strong));
}
.aurora-mic__mute:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.045);
}

/* Live level meter — a row of cyan bars, one peaking center dot */
.aurora-mic__meter {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 2px;
}
.aurora-mic__bar {
  flex: 1 1 0;
  min-width: 0;
  height: 6px;
  border-radius: 999px;
  background: var(--aurora-accent-primary);
  transform-origin: center;
  animation: aurora-mic-pulse 1.2s var(--motion-ease-in-out, ease-in-out) infinite;
}
.aurora-mic__bar--peak {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  border-radius: 999px;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--aurora-accent-primary) 16%, transparent);
}
.aurora-mic--muted .aurora-mic__bar {
  background: color-mix(in srgb, var(--aurora-accent-primary) 30%, var(--aurora-border-default));
  animation: none;
}
.aurora-mic--muted .aurora-mic__bar--peak {
  box-shadow: none;
}
@keyframes aurora-mic-pulse {
  0%, 100% { transform: scaleY(0.55); opacity: 0.7; }
  50% { transform: scaleY(1); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .aurora-mic__bar { animation: none; transform: scaleY(0.8); }
}
`

let injected = false
function ensureCSS() {
  if (injected || typeof document === "undefined") return
  const el = document.createElement("style")
  el.setAttribute("data-aurora-mic-selector", "")
  el.textContent = CSS
  document.head.appendChild(el)
  injected = true
}

// Bar layout: varying widths (in flex units) with a peaking dot near center.
const BAR_WEIGHTS = [1, 1.2, 1.6, 1.4, 2, 1.5, 1.4, 1.8, "peak", 1.9, 1.5, 1.3, 1.7, 1.4, 2, 1.6, 1.3, 1.8, 1.4, 1.2]

// ─── Component ──────────────────────────────────────────────────────────────

const MicSelector = React.forwardRef<HTMLDivElement, MicSelectorProps>(
  (
    {
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
    },
    ref
  ) => {
    React.useEffect(() => {
      ensureCSS()
    }, [])

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
          <button
            type="button"
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
          </button>
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
            {devices.map((device) => (
              <SelectItem key={device} value={device}>
                {device}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }
)
MicSelector.displayName = "MicSelector"

const MemoMicSelector = React.memo(MicSelector)
MemoMicSelector.displayName = "MicSelector"

export { MemoMicSelector as MicSelector }
export default MemoMicSelector
