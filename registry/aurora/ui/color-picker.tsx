"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// --- color math -------------------------------------------------------------

interface Hsv {
  h: number // 0..360
  s: number // 0..1
  v: number // 0..1
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const int = parseInt(m[1], 16)
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 }
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0")
  return `#${to(r)}${to(g)}${to(b)}`
}

function rgbToHsv(r: number, g: number, b: number): Hsv {
  const rr = r / 255
  const gg = g / 255
  const bb = b / 255
  const max = Math.max(rr, gg, bb)
  const min = Math.min(rr, gg, bb)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d) % 6
    else if (max === gg) h = (bb - rr) / d + 2
    else h = (rr - gg) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  const s = max === 0 ? 0 : d / max
  return { h, s, v: max }
}

function hsvToRgb({ h, s, v }: Hsv): { r: number; g: number; b: number } {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 }
}

function hexToHsv(hex: string): Hsv | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  return rgbToHsv(rgb.r, rgb.g, rgb.b)
}

function hsvToHex(hsv: Hsv): string {
  const { r, g, b } = hsvToRgb(hsv)
  return rgbToHex(r, g, b)
}

// Pure-hue hex (full saturation + value) for the saturation/value plane bg.
function hueHex(h: number): string {
  return hsvToHex({ h, s: 1, v: 1 })
}

// --- injected styles --------------------------------------------------------

// Self-contained Aurora ColorPicker styling. Surface tiers, borders, radii and
// the mono hex font all read from --aurora-* / --radius-* / --font-* tokens so
// the picker matches the CD source without touching the global aurora.css layer.
const COLOR_PICKER_CSS = `
.aurora-cp {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: var(--radius-3, 16px);
  background: var(--aurora-panel-strong);
  border: 1px solid var(--aurora-border-default);
  font-family: var(--font-sans, "Inter", system-ui, sans-serif);
  color: var(--aurora-text-primary);
}
.aurora-cp *,
.aurora-cp *::before,
.aurora-cp *::after { box-sizing: border-box; }
.aurora-cp__label {
  font-family: var(--font-sans, "Inter", system-ui, sans-serif);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--aurora-text-muted);
  margin: 0;
}
.aurora-cp__sv {
  position: relative;
  width: 100%;
  height: 160px;
  border-radius: var(--radius-2, 12px);
  border: 1px solid var(--aurora-border-default);
  cursor: crosshair;
  touch-action: none;
  overflow: hidden;
  outline: none;
}
.aurora-cp__sv:focus-visible {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--aurora-accent-primary) 60%, transparent);
}
.aurora-cp__sv-handle {
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.45), 0 1px 4px rgba(0, 0, 0, 0.5);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.aurora-cp__hue {
  position: relative;
  width: 100%;
  height: 14px;
  border-radius: 999px;
  cursor: pointer;
  touch-action: none;
  outline: none;
  background: linear-gradient(
    90deg,
    #ff0000 0%,
    #ffff00 17%,
    #00ff00 33%,
    #00ffff 50%,
    #0000ff 67%,
    #ff00ff 83%,
    #ff0000 100%
  );
  border: 1px solid var(--aurora-border-strong);
}
.aurora-cp__hue:focus-visible {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--aurora-accent-primary) 60%, transparent);
}
.aurora-cp__hue-handle {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid #ffffff;
  background: var(--aurora-cp-color, #29b6f6);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.45), 0 1px 4px rgba(0, 0, 0, 0.5);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.aurora-cp__row {
  display: flex;
  align-items: stretch;
  gap: 12px;
}
.aurora-cp__preview {
  flex: none;
  width: 64px;
  height: 56px;
  border-radius: var(--radius-2, 12px);
  background: var(--aurora-cp-color, #29b6f6);
  border: 1px solid color-mix(in srgb, #ffffff 16%, transparent);
}
.aurora-cp__input-wrap {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 56px;
  padding: 0 14px;
  border-radius: var(--radius-2, 12px);
  background: var(--aurora-control-surface);
  border: 1px solid var(--aurora-border-strong);
  transition: border-color 120ms var(--aurora-motion-ease, ease),
    box-shadow 120ms var(--aurora-motion-ease, ease);
}
.aurora-cp__input-wrap:focus-within {
  border-color: color-mix(in srgb, var(--aurora-accent-primary) 70%, var(--aurora-border-strong));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 40%, transparent);
}
.aurora-cp__hash {
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 16px;
  font-weight: 600;
  color: var(--aurora-text-muted);
  user-select: none;
}
.aurora-cp__input {
  flex: 1 1 auto;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: var(--aurora-text-primary);
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0;
}
.aurora-cp__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.aurora-cp__swatch {
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: var(--radius-2, 12px);
  background: var(--aurora-cp-swatch, #29b6f6);
  border: 1px solid color-mix(in srgb, #ffffff 14%, transparent);
  cursor: pointer;
  padding: 0;
  outline: none;
  transition: transform 120ms var(--aurora-motion-ease, ease),
    box-shadow 120ms var(--aurora-motion-ease, ease);
}
.aurora-cp__swatch:hover {
  transform: translateY(-1px);
}
.aurora-cp__swatch:focus-visible {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--aurora-accent-primary) 60%, transparent);
}
.aurora-cp__swatch[data-selected="true"] {
  box-shadow:
    0 0 0 2px var(--aurora-panel-strong),
    0 0 0 4px var(--aurora-accent-primary);
}
`

// --- component --------------------------------------------------------------

export interface ColorPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Caption rendered above the picker (uppercased). */
  label?: string
  /** Controlled hex value (e.g. `#29b6f6`). */
  value?: string
  /** Uncontrolled initial hex value. */
  defaultValue?: string
  /** Quick-pick swatch colors rendered below the input. */
  colors?: string[]
  /** Fires with the new hex string whenever the color changes. */
  onValueChange?: (hex: string) => void
}

const DEFAULT_COLOR = "#29b6f6"

function ColorPicker(
  {
    className,
    label,
    value,
    defaultValue = DEFAULT_COLOR,
    colors,
    onValueChange,
    style,
    ref,
    ...props
  }: ColorPickerProps & { ref?: React.Ref<HTMLDivElement> }
) {
    const controlled = value !== undefined

    // Internal source of truth is HSV so dragging on the SV plane at v=0/s=0
    // doesn't lose the hue. Hex is derived for display / emit.
    const [hsv, setHsv] = React.useState<Hsv>(
      () => hexToHsv((controlled ? value : defaultValue) ?? DEFAULT_COLOR) ?? { h: 199, s: 0.83, v: 0.96 }
    )
    const [draft, setDraft] = React.useState<string>(
      () => (controlled ? value : defaultValue) ?? DEFAULT_COLOR
    )

    // Sync from a controlled value prop.
    React.useEffect(() => {
      if (!controlled) return
      const next = hexToHsv(value ?? DEFAULT_COLOR)
      if (next) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHsv(next)
        setDraft(value ?? DEFAULT_COLOR)
      }
    }, [controlled, value])

    const hex = hsvToHex(hsv)

    const commit = React.useCallback(
      (next: Hsv) => {
        if (!controlled) {
          setHsv(next)
          setDraft(hsvToHex(next))
        }
        onValueChange?.(hsvToHex(next))
      },
      [controlled, onValueChange]
    )

    const svRef = React.useRef<HTMLDivElement>(null)
    const hueRef = React.useRef<HTMLDivElement>(null)

    function pointerToSv(clientX: number, clientY: number) {
      const el = svRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const s = clamp((clientX - rect.left) / rect.width, 0, 1)
      const v = clamp(1 - (clientY - rect.top) / rect.height, 0, 1)
      commit({ ...hsv, s, v })
    }

    function pointerToHue(clientX: number) {
      const el = hueRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const h = clamp((clientX - rect.left) / rect.width, 0, 1) * 360
      commit({ ...hsv, h })
    }

    function makeDragHandler(move: (x: number, y: number) => void) {
      return (e: React.PointerEvent) => {
        e.preventDefault()
        const target = e.currentTarget as HTMLElement
        target.setPointerCapture?.(e.pointerId)
        move(e.clientX, e.clientY)
        const onMove = (ev: PointerEvent) => move(ev.clientX, ev.clientY)
        const onUp = () => {
          window.removeEventListener("pointermove", onMove)
          window.removeEventListener("pointerup", onUp)
        }
        window.addEventListener("pointermove", onMove)
        window.addEventListener("pointerup", onUp)
      }
    }

    const onSvKeyDown = (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? 0.1 : 0.02
      let { s, v } = hsv
      switch (e.key) {
        case "ArrowLeft": s = clamp(s - step, 0, 1); break
        case "ArrowRight": s = clamp(s + step, 0, 1); break
        case "ArrowUp": v = clamp(v + step, 0, 1); break
        case "ArrowDown": v = clamp(v - step, 0, 1); break
        default: return
      }
      e.preventDefault()
      commit({ ...hsv, s, v })
    }

    const onHueKeyDown = (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 2
      let h = hsv.h
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") h = (h - step + 360) % 360
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") h = (h + step) % 360
      else return
      e.preventDefault()
      commit({ ...hsv, h })
    }

    function onHexChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6)
      setDraft(`#${raw}`)
      const parsed = hexToHsv(`#${raw}`)
      if (parsed) commit(parsed)
    }

    function onHexBlur() {
      setDraft(hex)
    }

    const draftValue = draft.replace(/^#/, "").toUpperCase()

    return (
      <div
        ref={ref}
        className={cn("aurora-cp", className)}
        style={{ ["--aurora-cp-color" as string]: hex, ...style }}
        {...props}
      >
        <style>{COLOR_PICKER_CSS}</style>
        {label ? <p className="aurora-cp__label">{label}</p> : null}

        {/* Saturation / value plane */}
        <div
          ref={svRef}
          className="aurora-cp__sv"
          role="slider"
          tabIndex={0}
          aria-label={`${label ? `${label} ` : ""}saturation and brightness`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(hsv.v * 100)}
          aria-valuetext={`saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
          // eslint-disable-next-line react-hooks/refs
          onPointerDown={makeDragHandler(pointerToSv)}
          onKeyDown={onSvKeyDown}
          style={{
            background: `linear-gradient(to top, #000 0%, transparent 100%), linear-gradient(to right, #fff 0%, ${hueHex(hsv.h)} 100%)`,
          }}
        >
          <span
            className="aurora-cp__sv-handle"
            style={{
              left: `${hsv.s * 100}%`,
              top: `${(1 - hsv.v) * 100}%`,
              background: hex,
            }}
          />
        </div>

        {/* Hue slider */}
        <div
          ref={hueRef}
          className="aurora-cp__hue"
          role="slider"
          tabIndex={0}
          aria-label={`${label ? `${label} ` : ""}hue`}
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={Math.round(hsv.h)}
          // eslint-disable-next-line react-hooks/refs
          onPointerDown={makeDragHandler((x) => pointerToHue(x))}
          onKeyDown={onHueKeyDown}
        >
          <span
            className="aurora-cp__hue-handle"
            style={{ left: `${(hsv.h / 360) * 100}%`, background: hueHex(hsv.h) }}
          />
        </div>

        {/* Preview + hex input */}
        <div className="aurora-cp__row">
          <div className="aurora-cp__preview" aria-hidden="true" />
          <div className="aurora-cp__input-wrap">
            <span className="aurora-cp__hash" aria-hidden="true">#</span>
            <input
              className="aurora-cp__input"
              value={draftValue}
              onChange={onHexChange}
              onBlur={onHexBlur}
              spellCheck={false}
              autoComplete="off"
              aria-label={`${label ? `${label} ` : ""}hex value`}
            />
          </div>
        </div>

        {/* Quick-pick swatches */}
        {colors && colors.length > 0 ? (
          <div className="aurora-cp__swatches" role="group" aria-label="Preset colors">
            {colors.map((c) => {
              const selected = c.toLowerCase() === hex.toLowerCase()
              return (
                <button
                  key={c}
                  type="button"
                  className="aurora-cp__swatch"
                  data-selected={selected}
                  aria-label={c}
                  aria-pressed={selected}
                  style={{ ["--aurora-cp-swatch" as string]: c }}
                  onClick={() => {
                    const next = hexToHsv(c)
                    if (next) commit(next)
                  }}
                />
              )
            })}
          </div>
        ) : null}
      </div>
    )
}

export { ColorPicker }
export default ColorPicker
