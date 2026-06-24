"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A tag rendered in the card footer. A plain string renders as a neutral
 * outline pill; `{ label, accent: true }` renders as a filled cyan pill.
 */
export type ComponentCardTag = string | { label: string; accent?: boolean };

export interface ComponentCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onClick"> {
  /** Component display name shown as the card heading. */
  name: string;
  /** Short one/two-line description. */
  blurb?: React.ReactNode;
  /** Footer tags. Strings → neutral pills; `{accent:true}` → cyan pill. */
  tags?: ComponentCardTag[];
  /** Live preview rendered inside the thumbnail / stage. */
  preview?: React.ReactNode;
  /** Height (px) of the preview thumb / stage. */
  thumbHeight?: number;
  /** `"tile"` = gallery grid tile (default). `"viewer"` = focused viewer. */
  variant?: "tile" | "viewer";

  // --- tile ---------------------------------------------------------------
  /** Tile only: invoked when the open affordance (or the tile) is activated. */
  onOpen?: () => void;

  // --- viewer -------------------------------------------------------------
  /** Viewer only: zero-based index of the current entry. */
  index?: number;
  /** Viewer only: total number of entries (for the `n / N` counter). */
  total?: number;
  /** Viewer only: sibling names powering the jump dropdown. */
  siblings?: string[];
  /** Viewer only: go to previous entry. */
  onPrev?: () => void;
  /** Viewer only: go to next entry. */
  onNext?: () => void;
  /** Viewer only: jump directly to a named sibling. */
  onJump?: (name: string) => void;
  /** Viewer only: preview node for the compare slot. */
  comparePreview?: React.ReactNode;
  /** Viewer only: name of the compare target. */
  compareName?: string;

  className?: string;
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

function Thumb({
  height,
  children,
  rounded,
}: {
  height: number;
  children?: React.ReactNode;
  rounded: string;
}) {
  return (
    <div
      aria-hidden={children == null ? true : undefined}
      style={{
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        boxSizing: "border-box",
        borderRadius: rounded,
        // opaque → opaque gradient: no translucent-over-opaque seam
        background:
          "linear-gradient(180deg, var(--aurora-panel-strong-top), var(--aurora-control-surface))",
        color: "var(--aurora-text-muted)",
      }}
    >
      {children}
    </div>
  );
}

function Tags({ tags }: { tags?: ComponentCardTag[] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {tags.map((t, i) => {
        const label = typeof t === "string" ? t : t.label;
        const accent = typeof t === "string" ? false : !!t.accent;
        return (
          <span
            key={`${label}-${i}`}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 600,
              lineHeight: 1,
              padding: "5px 9px",
              borderRadius: 999,
              border: accent
                ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 42%, transparent)"
                : "1px solid var(--aurora-border-strong)",
              background: accent
                ? "color-mix(in srgb, var(--aurora-accent-primary) 16%, transparent)"
                : "var(--aurora-control-surface)",
              color: accent
                ? "var(--aurora-accent-strong)"
                : "var(--aurora-text-muted)",
            }}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tile variant
// ---------------------------------------------------------------------------

function TileCard({
  name,
  blurb,
  tags,
  preview,
  thumbHeight = 104,
  onOpen,
  className,
  style,
  forwardedRef,
  // discard non-DOM / variant-only props so they never reach the <div>
  variant: _variant,
  index: _index,
  total: _total,
  siblings: _siblings,
  onPrev: _onPrev,
  onNext: _onNext,
  onJump: _onJump,
  comparePreview: _comparePreview,
  compareName: _compareName,
  ...rest
}: ComponentCardProps & {
  forwardedRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={forwardedRef}
      className={cn(className)}
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--aurora-border-default)",
        borderRadius: "var(--aurora-radius-2)",
        background: "var(--aurora-panel-medium)",
        boxShadow: "var(--aurora-shadow-medium)",
        overflow: "hidden",
        boxSizing: "border-box",
        ...style,
      }}
      {...rest}
    >
      <Thumb height={thumbHeight} rounded="0">
        {preview}
      </Thumb>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 9,
          padding: "16px 18px 18px",
          borderTop: "1px solid var(--aurora-border-default)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 17,
              fontWeight: 700,
              lineHeight: 1.2,
              color: "var(--aurora-text-primary)",
            }}
          >
            {name}
          </span>
          {onOpen && (
            <button
              type="button"
              onClick={onOpen}
              aria-label={`Open ${name}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 26,
                height: 26,
                flexShrink: 0,
                border: "none",
                background: "transparent",
                color: "var(--aurora-accent-primary)",
                cursor: "pointer",
                padding: 0,
                borderRadius: 8,
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M7 17 17 7M9 7h8v8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {blurb != null && (
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              lineHeight: 1.5,
              color: "var(--aurora-text-muted)",
            }}
          >
            {blurb}
          </p>
        )}

        <Tags tags={tags} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Viewer variant
// ---------------------------------------------------------------------------

function ViewerCard({
  name,
  preview,
  thumbHeight = 120,
  index = 0,
  total = 1,
  siblings,
  onPrev,
  onNext,
  onJump,
  comparePreview,
  compareName,
  className,
  style,
  forwardedRef,
  // discard non-DOM / variant-only props so they never reach the <div>
  variant: _variant,
  blurb: _blurb,
  tags: _tags,
  onOpen: _onOpen,
  ...rest
}: ComponentCardProps & {
  forwardedRef?: React.Ref<HTMLDivElement>;
}) {
  const [comparing, setComparing] = React.useState(false);
  const selectId = React.useId();

  const atStart = index <= 0;
  const atEnd = index >= total - 1;

  const navBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    flexShrink: 0,
    borderRadius: 10,
    border: "1px solid var(--aurora-border-strong)",
    background: "var(--aurora-control-surface)",
    color: "var(--aurora-text-primary)",
    cursor: "pointer",
    padding: 0,
  };

  return (
    <div
      ref={forwardedRef}
      className={cn(className)}
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--aurora-border-default)",
        borderRadius: "var(--aurora-radius-2)",
        background: "var(--aurora-panel-medium)",
        boxShadow: "var(--aurora-shadow-medium)",
        overflow: "hidden",
        boxSizing: "border-box",
        ...style,
      }}
      {...rest}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: 12,
          borderBottom: "1px solid var(--aurora-border-default)",
        }}
      >
        <button
          type="button"
          onClick={onPrev}
          disabled={atStart}
          aria-label="Previous component"
          style={{ ...navBtn, opacity: atStart ? 0.4 : 1, cursor: atStart ? "not-allowed" : "pointer" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 6 9 12l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Jump dropdown */}
        <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
          <select
            id={selectId}
            aria-label="Jump to component"
            value={name}
            onChange={(e) => onJump?.(e.target.value)}
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              width: "100%",
              height: 38,
              boxSizing: "border-box",
              padding: "0 36px 0 14px",
              borderRadius: 10,
              border: "1px solid var(--aurora-border-strong)",
              background: "var(--aurora-control-surface)",
              color: "var(--aurora-text-primary)",
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {siblings && siblings.length > 0 ? (
              siblings.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))
            ) : (
              <option value={name}>{name}</option>
            )}
          </select>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "var(--aurora-text-muted)",
            }}
          >
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Compare toggle */}
        {comparePreview != null && (
          <button
            type="button"
            onClick={() => setComparing((c) => !c)}
            aria-label={compareName ? `Compare with ${compareName}` : "Toggle compare"}
            aria-pressed={comparing}
            style={{
              ...navBtn,
              color: comparing ? "var(--aurora-accent-primary)" : "var(--aurora-text-muted)",
              borderColor: comparing
                ? "color-mix(in srgb, var(--aurora-accent-primary) 52%, transparent)"
                : "var(--aurora-border-strong)",
              background: comparing
                ? "color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)"
                : "var(--aurora-control-surface)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="4" y="5" width="6.5" height="14" rx="1.5" stroke="currentColor" strokeWidth="2" />
              <rect x="13.5" y="5" width="6.5" height="14" rx="1.5" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        )}

        {/* Counter */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: 38,
            padding: "0 12px",
            flexShrink: 0,
            borderRadius: 10,
            border: "1px solid var(--aurora-border-strong)",
            background: "var(--aurora-control-surface)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--aurora-text-muted)",
            whiteSpace: "nowrap",
          }}
        >
          {index + 1} / {total}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={atEnd}
          aria-label="Next component"
          style={{ ...navBtn, opacity: atEnd ? 0.4 : 1, cursor: atEnd ? "not-allowed" : "pointer" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Stage(s) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: comparing && comparePreview != null ? "1fr 1fr" : "1fr",
          gap: 1,
          background: "var(--aurora-border-default)",
        }}
      >
        <div style={{ background: "var(--aurora-panel-medium)" }}>
          <StageLabel>{name}</StageLabel>
          <Thumb height={thumbHeight} rounded="0">
            {preview}
          </Thumb>
        </div>
        {comparing && comparePreview != null && (
          <div style={{ background: "var(--aurora-panel-medium)" }}>
            <StageLabel>{compareName}</StageLabel>
            <Thumb height={thumbHeight} rounded="0">
              {comparePreview}
            </Thumb>
          </div>
        )}
      </div>
    </div>
  );
}

function StageLabel({ children }: { children?: React.ReactNode }) {
  if (children == null) return null;
  return (
    <span
      style={{
        display: "block",
        padding: "10px 14px 0",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        color: "var(--aurora-text-muted)",
      }}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export function ComponentCard(props: ComponentCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const { ref, variant = "tile" } = props;
  if (variant === "viewer") {
    return <ViewerCard {...props} forwardedRef={ref} />;
  }
  return <TileCard {...props} forwardedRef={ref} />;
}

export default ComponentCard;
