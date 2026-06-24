"use client"

/**
 * Aurora Button — operator-grade action control.
 * Border + glow (the tight hard ring), never a flooded fill or soft corner halo.
 *
 * Visual layer is ported verbatim from the Claude Design source (injected once,
 * reads only `--aurora-*` tokens) so it renders pixel-identical in dark + `.light`.
 * Architecture stays shadcn: `Slot`/`asChild`, `cva` `buttonVariants`, `VariantProps`,
 * `React.memo`, `forwardRef`.
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { injectOnce } from "@/registry/aurora/lib/inject-once"

export type ButtonVariant =
  | "aurora"
  | "neutral"
  | "rose"
  | "success"
  | "warn"
  | "ghost"
  | "destructive"
  | "plain"

export type ButtonSize = "sm" | "default" | "lg" | "icon" | "unstyled"

// ─── Visual layer (ported from Claude Design) ──────────────────────────────────

const CSS = `
.aurora-btn {
  position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  white-space: nowrap; cursor: pointer; user-select: none; font-family: var(--font-sans, Inter, sans-serif);
  font-weight: 560; border: 1px solid var(--aurora-border-strong); background: var(--aurora-control-surface);
  color: var(--aurora-text-primary); height: 32px; padding: 0 14px; border-radius: 9px; font-size: 13px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.34), 0 2px 6px rgba(0,0,0,0.16); text-decoration: none; box-sizing: border-box;
  transition: background 150ms var(--motion-ease-out, ease), border-color 150ms var(--motion-ease-out, ease), box-shadow 200ms var(--motion-ease-out, ease), color 150ms var(--motion-ease-out, ease), transform 80ms ease-out;
}
.aurora-btn:active { transform: translateY(1px); }
.aurora-btn:focus-visible { outline: none; box-shadow: inset 0 1px 0 rgba(255,255,255,0.055), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 45%, transparent), 0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent); }
.aurora-btn:disabled, .aurora-btn[aria-disabled="true"] { opacity: 0.45; cursor: not-allowed; transform: none; }
.aurora-btn--block { width: 100%; }
.aurora-btn--pill { border-radius: 999px; }
.aurora-btn--sm { height: 27px; padding: 0 11px; border-radius: 7px; font-size: 12px; gap: 6px; }
.aurora-btn--lg { height: 40px; padding: 0 20px; border-radius: 11px; font-size: 14px; gap: 8px; }
.aurora-btn--icon { width: 32px; padding: 0; }
.aurora-btn--sm.aurora-btn--icon { width: 27px; }
.aurora-btn--lg.aurora-btn--icon { width: 40px; }

.aurora-btn--aurora {
  border-color: color-mix(in srgb, var(--aurora-accent-primary) 42%, var(--aurora-border-strong));
  background: linear-gradient(180deg, color-mix(in srgb, var(--aurora-accent-primary) 11%, transparent), transparent 58%), var(--aurora-control-surface);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.055), 0 1px 2px rgba(0,0,0,0.34), 0 2px 6px rgba(0,0,0,0.16), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent);
}
.aurora-btn--aurora:hover { border-color: color-mix(in srgb, var(--aurora-accent-primary) 70%, var(--aurora-border-strong)); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.4), 0 3px 9px rgba(0,0,0,0.22), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 38%, transparent); }

.aurora-btn--neutral:hover { background: var(--aurora-hover-bg); border-color: var(--aurora-border-strong); box-shadow: inset 0 1px 0 rgba(255,255,255,0.07), 0 1px 2px rgba(0,0,0,0.4), 0 3px 9px rgba(0,0,0,0.22); }

.aurora-btn--rose {
  border-color: color-mix(in srgb, var(--aurora-accent-pink) 52%, var(--aurora-border-strong));
  background: linear-gradient(180deg, color-mix(in srgb, var(--aurora-accent-pink) 14%, transparent), transparent 58%), var(--aurora-control-surface);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-pink) 24%, transparent);
}
.aurora-btn--rose:hover { border-color: color-mix(in srgb, var(--aurora-accent-pink) 76%, var(--aurora-border-strong)); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-pink) 40%, transparent); }

.aurora-btn--success {
  color: var(--aurora-success); border-color: color-mix(in srgb, var(--aurora-success) 46%, var(--aurora-border-strong));
  background: linear-gradient(180deg, color-mix(in srgb, var(--aurora-success) 12%, transparent), transparent 58%), var(--aurora-control-surface);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px color-mix(in srgb, var(--aurora-success) 22%, transparent);
}
.aurora-btn--success:hover { border-color: color-mix(in srgb, var(--aurora-success) 72%, var(--aurora-border-strong)); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px color-mix(in srgb, var(--aurora-success) 42%, transparent); }

.aurora-btn--warn {
  color: var(--aurora-warn); border-color: color-mix(in srgb, var(--aurora-warn) 48%, var(--aurora-border-strong));
  background: linear-gradient(180deg, color-mix(in srgb, var(--aurora-warn) 12%, transparent), transparent 58%), var(--aurora-control-surface);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px color-mix(in srgb, var(--aurora-warn) 22%, transparent);
}
.aurora-btn--warn:hover { border-color: color-mix(in srgb, var(--aurora-warn) 74%, var(--aurora-border-strong)); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px color-mix(in srgb, var(--aurora-warn) 42%, transparent); }

.aurora-btn--ghost { border-color: transparent; background: transparent; box-shadow: none; color: var(--aurora-text-muted); }
.aurora-btn--ghost:hover { color: var(--aurora-text-primary); background: var(--aurora-hover-bg); }

/* plain — structural escape hatch: a bare clickable button with no Aurora fill */
.aurora-btn--plain { border-color: transparent; background: transparent; box-shadow: none; color: inherit; }
.aurora-btn--plain:hover { background: transparent; }

/* unstyled — strip the base dimensions/typography (pairs with --plain for a raw wrapper) */
.aurora-btn--unstyled { height: auto; min-height: 0; padding: 0; border: 0; border-radius: 0; font-size: inherit; font-weight: inherit; gap: 0; box-shadow: none; }

/* filled — the one flooded hero action (flooded fills are allowed; keep to one per surface) */
.aurora-btn--filled.aurora-btn--rose { background: var(--aurora-accent-pink); border-color: var(--aurora-accent-pink-deep); color: #2a0f18; box-shadow: inset 0 1px 0 rgba(255,255,255,0.22), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-pink-deep) 50%, transparent); }
.aurora-btn--filled.aurora-btn--rose:hover { background: var(--aurora-accent-pink-strong); border-color: var(--aurora-accent-pink-deep); }
.aurora-btn--filled.aurora-btn--aurora { background: var(--aurora-accent-primary); border-color: var(--aurora-accent-deep); color: #06131c; }
.aurora-btn--filled.aurora-btn--aurora:hover { background: color-mix(in srgb, var(--aurora-accent-primary) 86%, #fff); }
.aurora-btn--filled.aurora-btn--success { background: var(--aurora-success); border-color: color-mix(in srgb, var(--aurora-success) 60%, #000); color: #06201b; }
.aurora-btn--filled.aurora-btn--warn { background: var(--aurora-warn); border-color: color-mix(in srgb, var(--aurora-warn) 60%, #000); color: #211803; }

.aurora-btn--destructive {
  color: var(--aurora-error); border-color: color-mix(in srgb, var(--aurora-error) 42%, var(--aurora-border-strong));
  background: linear-gradient(180deg, color-mix(in srgb, var(--aurora-error) 9%, transparent), transparent 58%), var(--aurora-control-surface);
}
.aurora-btn--destructive:hover { border-color: color-mix(in srgb, var(--aurora-error) 62%, var(--aurora-border-strong)); }

.aurora-btn--pulse:not(:disabled):not([aria-disabled="true"]) { animation: aurora-btn-pulse 2.4s ease-in-out infinite; }
@keyframes aurora-btn-pulse {
  0%, 100% { box-shadow: inset 0 1px 0 rgba(255,255,255,0.055), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 30%, transparent); }
  50% { box-shadow: inset 0 1px 0 rgba(255,255,255,0.055), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 60%, transparent); }
}
@media (prefers-reduced-motion: reduce) { .aurora-btn--pulse { animation: none; } }

.aurora-btn--loading { cursor: progress; }
.aurora-btn__spinner { width: 1em; height: 1em; border-radius: 50%; border: 2px solid currentColor; border-top-color: transparent; animation: aurora-btn-spin 0.62s linear infinite; flex-shrink: 0; }
@keyframes aurora-btn-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .aurora-btn__spinner { animation-duration: 1.4s; } }
.aurora-btn__icon { display: inline-flex; align-items: center; flex-shrink: 0; }
`

function ensureCSS() { injectOnce("aurora-button", CSS) }

// ─── cva (class selection + buttonVariants export) ─────────────────────────────

const buttonVariants = cva("aurora-btn", {
  variants: {
    variant: {
      aurora: "aurora-btn--aurora",
      neutral: "aurora-btn--neutral",
      rose: "aurora-btn--rose",
      success: "aurora-btn--success",
      warn: "aurora-btn--warn",
      ghost: "aurora-btn--ghost",
      destructive: "aurora-btn--destructive",
      plain: "aurora-btn--plain",
    },
    size: {
      sm: "aurora-btn--sm",
      default: "",
      lg: "aurora-btn--lg",
      icon: "aurora-btn--icon",
      unstyled: "aurora-btn--unstyled",
    },
  },
  defaultVariants: {
    variant: "neutral",
    size: "default",
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Intent. `aurora` is the lit-outline cyan primary; rose is send/agent; warn is the clay-orange caution. */
  variant?: ButtonVariant
  size?: ButtonSize
  /** Slow glow pulse to draw attention without bouncing. Respects reduced-motion. */
  pulse?: boolean
  /** Flood the variant accent as a solid fill (the one hero/armed action per surface). Default false = lit-outline. */
  filled?: boolean
  /** Swap content for a spinner and block interaction. Width holds steady so the button doesn't jump. */
  loading?: boolean
  /** Stretch to fill the container width (forms, stacked CTAs, mobile). */
  block?: boolean
  /** Fully rounded pill shape (filter chips, compact toolbars). */
  shape?: "default" | "pill"
  /** Icon element rendered before the label (auto-sized to the text). */
  iconLeft?: React.ReactNode
  /** Icon element rendered after the label. */
  iconRight?: React.ReactNode
  /**
   * Render as the single child element (e.g. an `<a>`), merging Aurora classes
   * onto it via Radix `Slot` instead of emitting a `<button>`. Ignores the
   * `loading` spinner injection.
   */
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "neutral",
      size = "default",
      pulse = false,
      filled = false,
      loading = false,
      block = false,
      shape = "default",
      iconLeft,
      iconRight,
      asChild = false,
      className,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      ensureCSS()
    }, [])

    const isDisabled = disabled || loading

    const cls = cn(
      buttonVariants({ variant, size }),
      shape === "pill" && "aurora-btn--pill",
      pulse && !loading && "aurora-btn--pulse",
      filled && "aurora-btn--filled",
      block && "aurora-btn--block",
      loading && "aurora-btn--loading",
      // asChild renders a non-<button> (which ignores `disabled`), so emulate
      // the disabled visuals and drop it from the tab order via class + aria.
      asChild && isDisabled && "pointer-events-none opacity-45",
      className
    )

    // Guard clicks while disabled/loading. A native <button disabled> already
    // suppresses clicks, but asChild renders a non-button element that does not,
    // so swallow the event there (and defensively everywhere).
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) {
          event.preventDefault()
          event.stopPropagation()
          return
        }
        onClick?.(event)
      },
      [isDisabled, onClick]
    )

    // asChild: render the consumer's element via Slot, merging classes. No spinner.
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cls}
          aria-busy={loading ? "true" : undefined}
          onClick={handleClick}
          // asChild renders a non-<button>, which ignores `disabled`; expose
          // disabled state to AT and drop it from the tab order instead.
          {...(isDisabled ? { "aria-disabled": true, tabIndex: -1 } : {})}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    const body = loading ? (
      <>
        <span className="aurora-btn__spinner" aria-hidden="true" />
        {size !== "icon" && children ? (
          <span style={{ opacity: 0 }}>{children}</span>
        ) : null}
      </>
    ) : (
      <>
        {iconLeft ? <span className="aurora-btn__icon">{iconLeft}</span> : null}
        {children}
        {iconRight ? <span className="aurora-btn__icon">{iconRight}</span> : null}
      </>
    )

    return (
      <button
        ref={ref}
        className={cls}
        disabled={isDisabled}
        aria-busy={loading ? "true" : undefined}
        onClick={handleClick}
        {...props}
      >
        {body}
      </button>
    )
  }
)
Button.displayName = "Button"

const MemoButton = React.memo(Button)
MemoButton.displayName = "Button"

export { MemoButton as Button, buttonVariants }
export default MemoButton
