"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type WebPreviewVariant = "browser" | "unfurl-card" | "skeleton" | "error"

export interface WebPreviewProps {
  url: string
  title?: string
  description?: string
  favicon?: string
  screenshot?: string
  variant?: WebPreviewVariant
  isLoading?: boolean
}

// ---------------------------------------------------------------------------
// Icons (inline SVG)
// ---------------------------------------------------------------------------

function ReloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M12 7A5 5 0 1 1 7 2c1.38 0 2.63.56 3.54 1.46L13 6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 2v4H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="11" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="3" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="11" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.4 6.3L9.6 3.7M4.4 7.7L9.6 10.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
      <rect x="1" y="5" width="8" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
      <path d="M2.5 5V3.5a2.5 2.5 0 0 1 5 0V5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="8" cy="8" rx="2.8" ry="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 8h13M8 1.5C6 3.5 5 5.5 5 8s1 4.5 3 6.5M8 1.5c2 2 3 4 3 6.5s-1 4.5-3 6.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" stroke="var(--aurora-error)" strokeWidth="2" opacity="0.4" />
      <path d="M16 9v8M16 22v1" stroke="var(--aurora-error)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Window dots (three neutral squares — NOT Mac colored)
// ---------------------------------------------------------------------------

function WindowDots() {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: "10px",
            height: "10px",
            borderRadius: "2px",
            background: "var(--aurora-border-strong)",
          }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Chrome button
// ---------------------------------------------------------------------------

function ChromeButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode
  onClick?: () => void
  title?: string
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      title={title}
      style={{
        width: "28px",
        height: "26px",
        padding: 0,
      }}
    >
      {children}
    </Button>
  )
}

// ---------------------------------------------------------------------------
// Skeleton shimmer
// ---------------------------------------------------------------------------

const SHIMMER_STYLE = `
@keyframes aurora-shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
.aurora-shimmer-block {
  background: linear-gradient(
    90deg,
    var(--aurora-panel-medium) 25%,
    var(--aurora-hover-bg) 50%,
    var(--aurora-panel-medium) 75%
  );
  background-size: 800px 100%;
  animation: aurora-shimmer 1.4s ease-in-out infinite;
  border-radius: 6px;
}
`

function SkeletonBlock({ width = "100%", height = "14px", style }: { width?: string; height?: string; style?: React.CSSProperties }) {
  return (
    <div
      className="aurora-shimmer-block"
      style={{ width, height, borderRadius: "6px", ...style }}
    />
  )
}

// ---------------------------------------------------------------------------
// URL parser helper
// ---------------------------------------------------------------------------

function getDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function isHttps(url: string): boolean {
  return url.startsWith("https://")
}

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

function BrowserChrome({
  url,
  title,
  screenshot,
  isLoading,
}: WebPreviewProps) {
  const domain = getDomain(url)
  const secure = isHttps(url)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--aurora-border-default)",
        borderRadius: "var(--aurora-radius-2)",
        overflow: "hidden",
        boxShadow: "var(--aurora-shadow-medium)",
      }}
    >
      {/* Titlebar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0 12px",
          height: "42px",
          background: "var(--aurora-panel-strong)",
          borderBottom: "1px solid var(--aurora-border-default)",
          flexShrink: 0,
        }}
      >
        <WindowDots />
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
          {/* Address bar */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              height: "28px",
              padding: "0 10px",
              background: "var(--aurora-control-surface)",
              border: "1px solid var(--aurora-border-default)",
              borderRadius: "8px",
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "12px",
              color: "var(--aurora-text-muted)",
              overflow: "hidden",
            }}
          >
            <span style={{ color: secure ? "var(--aurora-success)" : "var(--aurora-warn)", flexShrink: 0 }}>
              <LockIcon />
            </span>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {url}
            </span>
          </div>
        </div>
        <ChromeButton title="Reload"><ReloadIcon /></ChromeButton>
        <ChromeButton title="Share"><ShareIcon /></ChromeButton>
      </div>

      {/* Content area */}
      <div
        style={{
          background: "var(--aurora-panel-medium)",
          minHeight: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <div style={{ width: "100%", padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <style>{SHIMMER_STYLE}</style>
            <SkeletonBlock height="20px" width="60%" />
            <SkeletonBlock height="14px" width="90%" />
            <SkeletonBlock height="14px" width="75%" />
            <SkeletonBlock height="14px" width="50%" />
          </div>
        ) : screenshot ? (
          <img
            src={screenshot}
            alt={title ?? domain}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "32px" }}>
            <GlobeIcon />
            <div
              style={{
                marginTop: "10px",
                fontFamily: "var(--aurora-font-sans)",
                fontSize: "13px",
                color: "var(--aurora-text-muted)",
              }}
            >
              {title ?? domain}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function UnfurlCard({ url, title, description, favicon }: WebPreviewProps) {
  const domain = getDomain(url)
  const [hovered, setHovered] = React.useState(false)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 0,
        textDecoration: "none",
        border: `1px solid ${hovered ? "var(--aurora-border-strong)" : "var(--aurora-border-default)"}`,
        borderRadius: "var(--aurora-radius-1)",
        background: "var(--aurora-panel-strong)",
        overflow: "hidden",
        boxShadow: hovered ? "var(--aurora-shadow-medium)" : "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
        maxWidth: "480px",
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          width: "3px",
          background: "var(--aurora-accent-primary)",
          flexShrink: 0,
          opacity: 0.7,
        }}
      />
      <div style={{ padding: "12px 14px", flex: 1, minWidth: 0 }}>
        {/* Domain chip */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
          {favicon ? (
            <img src={favicon} alt="" width="14" height="14" style={{ borderRadius: "3px", flexShrink: 0 }} />
          ) : (
            <span style={{ color: "var(--aurora-text-muted)", flexShrink: 0 }}>
              <GlobeIcon />
            </span>
          )}
          <span
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "11px",
              color: "var(--aurora-text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {domain}
          </span>
        </div>

        {title && (
          <div
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--aurora-text-primary)",
              marginBottom: "4px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </div>
        )}

        {description && (
          <div
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "12px",
              color: "var(--aurora-text-muted)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.45,
            }}
          >
            {description}
          </div>
        )}
      </div>
    </a>
  )
}

function SkeletonVariant({ url }: { url: string }) {
  void url
  return (
    <div
      style={{
        border: "1px solid var(--aurora-border-default)",
        borderRadius: "var(--aurora-radius-2)",
        overflow: "hidden",
        boxShadow: "var(--aurora-shadow-medium)",
      }}
    >
      <style>{SHIMMER_STYLE}</style>
      {/* Skeleton titlebar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0 12px",
          height: "42px",
          background: "var(--aurora-panel-strong)",
          borderBottom: "1px solid var(--aurora-border-default)",
        }}
      >
        <WindowDots />
        <SkeletonBlock height="26px" style={{ flex: 1, borderRadius: "8px" }} />
      </div>
      {/* Skeleton body */}
      <div
        style={{
          background: "var(--aurora-panel-medium)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          minHeight: "140px",
        }}
      >
        <SkeletonBlock height="18px" width="55%" />
        <SkeletonBlock height="13px" width="85%" />
        <SkeletonBlock height="13px" width="70%" />
        <SkeletonBlock height="13px" width="40%" />
      </div>
    </div>
  )
}

function ErrorVariant({ url }: { url: string }) {
  const domain = getDomain(url)
  return (
    <div
      style={{
        border: "1px solid var(--aurora-border-default)",
        borderRadius: "var(--aurora-radius-2)",
        overflow: "hidden",
        boxShadow: "var(--aurora-shadow-medium)",
      }}
    >
      {/* Titlebar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0 12px",
          height: "42px",
          background: "var(--aurora-panel-strong)",
          borderBottom: "1px solid var(--aurora-border-default)",
        }}
      >
        <WindowDots />
        <div
          style={{
            flex: 1,
            height: "26px",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            background: "var(--aurora-control-surface)",
            border: "1px solid var(--aurora-border-default)",
            borderRadius: "8px",
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {url}
          </span>
        </div>
        <ChromeButton title="Reload"><ReloadIcon /></ChromeButton>
      </div>

      {/* Error body */}
      <div
        style={{
          background: "color-mix(in srgb, var(--aurora-error) 4%, var(--aurora-panel-medium))",
          minHeight: "160px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "32px",
        }}
      >
        <AlertIcon />
        <div
          style={{
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--aurora-text-primary)",
          }}
        >
          Failed to load
        </div>
        <div
          style={{
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "13px",
            color: "var(--aurora-text-muted)",
            textAlign: "center",
          }}
        >
          {domain} could not be reached.
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main WebPreview component
// ---------------------------------------------------------------------------

export const WebPreview = React.forwardRef<HTMLDivElement, WebPreviewProps>(
  function WebPreview(props, ref) {
    const { variant = "browser", isLoading } = props

    const content =
      isLoading && variant === "browser" ? (
        <BrowserChrome {...props} isLoading />
      ) : variant === "skeleton" ? (
        <SkeletonVariant {...props} />
      ) : variant === "error" ? (
        <ErrorVariant {...props} />
      ) : variant === "unfurl-card" ? (
        <UnfurlCard {...props} />
      ) : (
        <BrowserChrome {...props} />
      )

    return (
      <div ref={ref} style={{ fontFamily: "var(--aurora-font-sans)" }}>
        {content}
      </div>
    )
  }
)

export default WebPreview
