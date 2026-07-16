"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// FilterSearch — transparent inline input
// ---------------------------------------------------------------------------

export interface FilterSearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export function FilterSearch({
  ref,
  className,
  onClear,
  value,
  onChange,
  ...rest
}: FilterSearchProps & { ref?: React.Ref<HTMLInputElement> }) {
  return (
    <div className="relative flex flex-1 items-center">
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 flex items-center"
        style={{ color: "var(--aurora-text-muted)" }}
      >
        <Search size={14} strokeWidth={1.75} />
      </span>

      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        className={cn(
          "w-full bg-transparent pl-5 pr-5 placeholder:opacity-50",
          "border-none outline-none ring-0 focus:ring-0",
          className,
        )}
        style={{
          color: "var(--aurora-text-primary)",
          caretColor: "var(--aurora-accent-primary)",
          fontFamily: "var(--aurora-font-sans)",
          fontSize: "var(--aurora-type-control)",
          fontWeight: "var(--aurora-weight-body)",
          letterSpacing: "var(--aurora-letter-ui)",
          lineHeight: "var(--aurora-line-dense)",
        }}
        {...rest}
      />
      {onClear && value ? (
        <Button
          variant="plain"
          size="unstyled"
          type="button"
          aria-label="Clear Search"
          onClick={onClear}
          className="absolute right-0 inline-flex size-4 items-center justify-center rounded-full"
          style={{ color: "var(--aurora-text-muted)" }}
        >
          <X size={10} strokeWidth={1.75} aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FilterTag — accent tinted pill
// ---------------------------------------------------------------------------

export interface FilterTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  onRemove?: () => void;
}

export function FilterTag({
  ref,
  children,
  onRemove,
  className,
  ...rest
}: FilterTagProps & { ref?: React.Ref<HTMLSpanElement> }) {
  const removeLabel =
    typeof children === "string" ? `Remove Filter ${children}` : "Remove Filter";

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 leading-snug",
        className,
      )}
      style={{
        background:
          "color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)",
        border:
          "1px solid color-mix(in srgb, var(--aurora-accent-primary) 30%, transparent)",
        color: "var(--aurora-accent-strong)",
        fontFamily: "var(--aurora-font-sans)",
        fontSize: "var(--aurora-type-label)",
        fontWeight: "var(--aurora-weight-ui)",
        letterSpacing: "var(--aurora-letter-ui)",
        lineHeight: "var(--aurora-line-dense)",
      }}
      {...rest}
    >
      {children}
      {onRemove && (
        <Button
          variant="plain"
          size="unstyled"
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--aurora-focus-ring)]"
          style={{ color: "var(--aurora-accent-strong)" }}
        >
          <X size={9} strokeWidth={1.8} aria-hidden="true" />
        </Button>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// FilterTagRose — rose/pink tinted pill
// ---------------------------------------------------------------------------

export function FilterTagRose({
  ref,
  children,
  onRemove,
  className,
  ...rest
}: FilterTagProps & { ref?: React.Ref<HTMLSpanElement> }) {
  const removeLabel =
    typeof children === "string" ? `Remove Filter ${children}` : "Remove Filter";

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 leading-snug",
        className,
      )}
      style={{
        background:
          "color-mix(in srgb, var(--aurora-accent-pink) 14%, transparent)",
        border:
          "1px solid color-mix(in srgb, var(--aurora-accent-pink) 30%, transparent)",
        color: "var(--aurora-accent-pink)",
        fontFamily: "var(--aurora-font-sans)",
        fontSize: "var(--aurora-type-label)",
        fontWeight: "var(--aurora-weight-ui)",
        letterSpacing: "var(--aurora-letter-ui)",
        lineHeight: "var(--aurora-line-dense)",
      }}
      {...rest}
    >
      {children}
      {onRemove && (
        <Button
          variant="plain"
          size="unstyled"
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--aurora-focus-ring)]"
          style={{ color: "var(--aurora-accent-pink)" }}
        >
          <X size={9} strokeWidth={1.8} aria-hidden="true" />
        </Button>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// FilterBar — main container
// ---------------------------------------------------------------------------

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onClearAll?: () => void;
  showClearAll?: boolean;
}

export function FilterBar({
  ref,
  children,
  onClearAll,
  showClearAll = false,
  className,
  ...rest
}: FilterBarProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn("flex flex-wrap items-center gap-2 px-3 py-2", className)}
      style={{
        background: "var(--aurora-control-surface)",
        border: `1px solid var(--aurora-border-default)`,
        borderRadius: "var(--aurora-radius-1)",
        minHeight: 40,
      }}
      {...rest}
    >
      {children}

      {showClearAll && onClearAll && (
        <>
          <span
            aria-hidden
            className="mx-1 h-4 w-px"
            style={{ background: "var(--aurora-border-default)" }}
          />
          <Button
            variant="plain"
            size="unstyled"
            type="button"
            onClick={onClearAll}
            className="transition-colors hover:text-[var(--aurora-error)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--aurora-focus-ring)]"
            style={{
              color: "var(--aurora-text-muted)",
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "var(--aurora-type-label)",
              fontWeight: "var(--aurora-weight-ui)",
              letterSpacing: "var(--aurora-letter-ui)",
              lineHeight: "var(--aurora-line-dense)",
            }}
          >
            Clear All
          </Button>
        </>
      )}
    </div>
  );
}
