"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// FilterSearch — transparent inline input
// ---------------------------------------------------------------------------

export interface FilterSearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const FilterSearch = React.forwardRef<HTMLInputElement, FilterSearchProps>(
  function FilterSearch({ className, onClear, value, onChange, ...rest }, ref) {
    return (
      <div className="relative flex flex-1 items-center">
        {/* Search icon */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 flex items-center"
          style={{ color: "var(--aurora-text-muted)" }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="6" cy="6" r="4.5" />
            <path d="M9.5 9.5L12.5 12.5" />
          </svg>
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
          <Button variant="plain" size="unstyled"
            type="button"
            aria-label="Clear search"
            onClick={onClear}
            className="absolute right-0 inline-flex size-4 items-center justify-center rounded-full"
            style={{ color: "var(--aurora-text-muted)" }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M2 2L8 8M8 2L2 8" />
            </svg>
          </Button>
        ) : null}
      </div>
    );
  },
);

FilterSearch.displayName = "FilterSearch";

// ---------------------------------------------------------------------------
// FilterTag — accent tinted pill
// ---------------------------------------------------------------------------

export interface FilterTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  onRemove?: () => void;
}

export const FilterTag = React.forwardRef<HTMLSpanElement, FilterTagProps>(
  function FilterTag({ children, onRemove, className, ...rest }, ref) {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 leading-snug",
          className,
        )}
        style={{
          background: "color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)",
          border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 30%, transparent)",
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
          <Button variant="plain" size="unstyled"
            type="button"
            aria-label="Remove filter"
            onClick={onRemove}
            className="ml-0.5 rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--aurora-focus-ring)]"
            style={{ color: "var(--aurora-accent-strong)" }}
          >
            <svg
              width="9"
              height="9"
              viewBox="0 0 9 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M1 1l7 7M8 1L1 8" />
            </svg>
          </Button>
        )}
      </span>
    );
  },
);

FilterTag.displayName = "FilterTag";

// ---------------------------------------------------------------------------
// FilterTagRose — rose/pink tinted pill
// ---------------------------------------------------------------------------

export const FilterTagRose = React.forwardRef<HTMLSpanElement, FilterTagProps>(
  function FilterTagRose({ children, onRemove, className, ...rest }, ref) {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 leading-snug",
          className,
        )}
        style={{
          background: "color-mix(in srgb, var(--aurora-accent-pink) 14%, transparent)",
          border: "1px solid color-mix(in srgb, var(--aurora-accent-pink) 30%, transparent)",
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
          <Button variant="plain" size="unstyled"
            type="button"
            aria-label="Remove filter"
            onClick={onRemove}
            className="ml-0.5 rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--aurora-focus-ring)]"
            style={{ color: "var(--aurora-accent-pink)" }}
          >
            <svg
              width="9"
              height="9"
              viewBox="0 0 9 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M1 1l7 7M8 1L1 8" />
            </svg>
          </Button>
        )}
      </span>
    );
  },
);

FilterTagRose.displayName = "FilterTagRose";

// ---------------------------------------------------------------------------
// FilterBar — main container
// ---------------------------------------------------------------------------

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onClearAll?: () => void;
  showClearAll?: boolean;
}

export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  function FilterBar(
    { children, onClearAll, showClearAll = false, className, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center gap-2 px-3 py-2",
          className,
        )}
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
            {/* Divider */}
            <span
              aria-hidden
              className="mx-1 h-4 w-px"
              style={{ background: "var(--aurora-border-default)" }}
            />
            <Button variant="plain" size="unstyled"
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
              Clear all
            </Button>
          </>
        )}
      </div>
    );
  },
);

FilterBar.displayName = "FilterBar";
