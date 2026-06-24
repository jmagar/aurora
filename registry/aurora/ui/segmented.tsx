"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  options: SegmentedOption[];
  /** Uncontrolled selected value. */
  defaultValue?: string;
  /** Controlled selected value. */
  value?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "md";
  disabled?: boolean;
}

// Visual values ported 1:1 from the Claude Design `Segmented` dsCard:
// a pill container holding option buttons; the selected option lifts onto a
// tinted cyan fill with a hairline accent ring and accent text.
const SIZES = {
  md: { containerPad: 4, height: 34, optionPad: "0 16px", font: 13, radius: 999 },
  sm: { containerPad: 3, height: 28, optionPad: "0 13px", font: 12, radius: 999 },
} as const;

function Segmented({
  ref,
  className,
  style,
  options,
  defaultValue,
  value: controlledValue,
  onValueChange,
  size = "md",
  disabled = false,
  ...props
}: SegmentedProps & { ref?: React.Ref<HTMLDivElement> }) {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState<string>(
      defaultValue ?? options[0]?.value ?? "",
    );
    const value = isControlled ? controlledValue : internalValue;

    const select = React.useCallback(
      (next: string) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const s = SIZES[size];

    const containerStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: 2,
      padding: s.containerPad,
      borderRadius: s.radius,
      background: "var(--aurora-control-surface)",
      border: "1px solid var(--aurora-border-default)",
      opacity: disabled ? 0.55 : undefined,
      ...style,
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-disabled={disabled || undefined}
        className={cn("aurora-segmented", className)}
        style={containerStyle}
        {...props}
      >
        {options.map((opt) => {
          const selected = opt.value === value;
          const isDisabled = disabled || opt.disabled;
          const optionStyle: React.CSSProperties = {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: s.height,
            padding: s.optionPad,
            border: "none",
            borderRadius: s.radius,
            background: selected
              ? "color-mix(in srgb, var(--aurora-accent-primary) 16%, var(--aurora-control-surface))"
              : "transparent",
            boxShadow: selected
              ? "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 30%, transparent)"
              : "none",
            color: selected
              ? "var(--aurora-accent-strong)"
              : "var(--aurora-text-muted)",
            font: `${selected ? 700 : 600} ${s.font}px var(--font-sans)`,
            cursor: isDisabled ? "not-allowed" : "pointer",
            outline: "none",
            transition:
              "color 140ms ease, background 140ms ease, box-shadow 140ms ease",
            whiteSpace: "nowrap",
          };
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={typeof opt.label === "string" ? opt.label : undefined}
              disabled={isDisabled}
              tabIndex={isDisabled ? -1 : selected ? 0 : -1}
              onClick={() => !isDisabled && select(opt.value)}
              onKeyDown={(e) => {
                if (isDisabled) return;
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  const enabled = options.filter((o) => !o.disabled && !disabled);
                  const idx = enabled.findIndex((o) => o.value === value);
                  const next = enabled[(idx + 1) % enabled.length];
                  if (next) select(next.value);
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const enabled = options.filter((o) => !o.disabled && !disabled);
                  const idx = enabled.findIndex((o) => o.value === value);
                  const prev = enabled[(idx - 1 + enabled.length) % enabled.length];
                  if (prev) select(prev.value);
                }
              }}
              style={optionStyle}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
}

export { Segmented };
export default Segmented;
