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

function getEnabledOptions(options: SegmentedOption[], disabled: boolean) {
  return options.filter((option) => !disabled && !option.disabled)
}

function getNextOption(
  enabledOptions: SegmentedOption[],
  currentValue: string | undefined,
  step: 1 | -1
) {
  if (enabledOptions.length === 0) return undefined
  const currentIndex = enabledOptions.findIndex((option) => option.value === currentValue)
  const startIndex = currentIndex === -1 ? (step === 1 ? 0 : enabledOptions.length - 1) : currentIndex
  return enabledOptions[(startIndex + step + enabledOptions.length) % enabledOptions.length]
}

// Visual values ported 1:1 from the Claude Design `Segmented` dsCard:
// a pill container holding option buttons; the selected option lifts onto a
// tinted cyan fill with a hairline accent ring and accent text.
const SIZES = {
  md: { containerPad: 4, height: 34, optionPad: "0 16px", font: 13, radius: 10, optionRadius: 7 },
  sm: { containerPad: 3, height: 28, optionPad: "0 13px", font: 12, radius: 9, optionRadius: 6 },
} as const;

const Segmented = (
    { ref,
      className,
      style,
      options,
      defaultValue,
      value: controlledValue,
      onValueChange,
      size = "md",
      disabled = false,
      ...props
    }: SegmentedProps & { ref?: React.Ref<HTMLDivElement> },
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState<string>(
      defaultValue ?? options[0]?.value ?? "",
    );
    const value = isControlled ? controlledValue : internalValue;
    const optionRefs = React.useRef(new Map<string, HTMLButtonElement | null>());

    const select = React.useCallback(
      (next: string) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const s = SIZES[size];
    const enabledOptions = getEnabledOptions(options, disabled);
    const hasSelectedEnabledOption = enabledOptions.some((option) => option.value === value);
    const focusableValue = hasSelectedEnabledOption
      ? value
      : enabledOptions[0]?.value;

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
        aria-orientation="horizontal"
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
            borderRadius: s.optionRadius,
            background: selected
              ? "color-mix(in srgb, var(--aurora-accent-primary) 16%, var(--aurora-control-surface))"
              : "transparent",
            boxShadow: selected
              ? "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 30%, transparent)"
              : "none",
            color: selected
              ? "var(--aurora-accent-strong)"
              : "var(--aurora-text-muted)",
            fontFamily: "var(--aurora-font-sans)",
            fontSize: s.font,
            fontWeight: selected ? "var(--aurora-weight-label)" : "var(--aurora-weight-ui)",
            letterSpacing: 0,
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
              aria-disabled={isDisabled || undefined}
              disabled={isDisabled}
              tabIndex={isDisabled ? -1 : opt.value === focusableValue ? 0 : -1}
              ref={(node) => {
                optionRefs.current.set(opt.value, node);
              }}
              onClick={() => !isDisabled && select(opt.value)}
              onKeyDown={(e) => {
                if (isDisabled) return;
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  const next = getNextOption(enabledOptions, value, 1);
                  if (next) select(next.value);
                  requestAnimationFrame(() => optionRefs.current.get(next?.value ?? "")?.focus());
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const prev = getNextOption(enabledOptions, value, -1);
                  if (prev) select(prev.value);
                  requestAnimationFrame(() => optionRefs.current.get(prev?.value ?? "")?.focus());
                }
              }}
              className="focus-visible:ring-2 focus-visible:ring-[var(--aurora-focus-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--aurora-control-surface)] focus-visible:outline-none"
              style={optionStyle}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  };
Segmented.displayName = "Segmented";

export { Segmented };
export default Segmented;
