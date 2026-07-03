"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type WebPreviewVariant = "browser" | "unfurl-card" | "skeleton" | "error"
export type WebPreviewViewport = "desktop" | "tablet" | "mobile"

export interface WebPreviewProps {
  url: string
  title?: string
  description?: string
  favicon?: string
  screenshot?: string
  variant?: WebPreviewVariant
  isLoading?: boolean
  /** Show viewport toggle buttons in the browser chrome (default: true) */
  showViewportToggle?: boolean
  /** Show the Console strip at the bottom (default: true) */
  showConsole?: boolean
  /** Number shown in the Console badge */
  consoleCount?: number
}

// ---------------------------------------------------------------------------
// Icons (inline SVG)
// ---------------------------------------------------------------------------

function ReloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
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


function LockIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
      <rect x="1" y="5" width="8" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
      <path d="M2.5 5V3.5a2.5 2.5 0 0 1 5 0V5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="8" cy="8" rx="2.8" ry="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 8h13M8 1.5C6 3.5 5 5.5 5 8s1 4.5 3 6.5M8 1.5c2 2 3 4 3 6.5s-1 4.5-3 6.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function DesktopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 14h6M8 12v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function TabletIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="1" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="12.5" r="0.8" fill="currentColor" />
    </svg>
  )
}

function MobileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="4.5" y="1" width="7" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="12.5" r="0.7" fill="currentColor" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M6 2H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9 1h4m0 0v4m0-4L7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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
      aria-label={title}
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

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

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
  showViewportToggle = true,
  showConsole = true,
  consoleCount = 3,
}: WebPreviewProps) {
  const domain = getDomain(url)
  const secure = isHttps(url)
  const [viewport, setViewport] = React.useState<WebPreviewViewport>("desktop")
  const [consoleOpen, setConsoleOpen] = React.useState(false)

  const VIEWPORTS: { id: WebPreviewViewport; Icon: () => React.ReactElement; label: string }[] = [
    { id: "desktop", Icon: DesktopIcon, label: "Desktop" },
    { id: "tablet",  Icon: TabletIcon,  label: "Tablet" },
    { id: "mobile",  Icon: MobileIcon,  label: "Mobile" },
  ]

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
        <ChromeButton title="Reload"><ReloadIcon /></ChromeButton>
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
          {/* Live indicator dot */}
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--aurora-success)",
              flexShrink: 0,
            }}
          />
        </div>
        {/* Viewport toggles */}
        {showViewportToggle && (
          <div style={{ display: "flex", gap: "2px" }}>
            {VIEWPORTS.map(({ id, Icon, label }) => {
              const active = viewport === id
              return (
                <Button
                  variant="plain"
                  size="unstyled"
                  key={id}
                  type="button"
                  aria-label={label}
                  title={label}
                  onClick={() => setViewport(id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "26px",
                    border: active ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 40%, transparent)" : "1px solid transparent",
                    borderRadius: "6px",
                    background: active ? "color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)" : "transparent",
                    color: active ? "var(--aurora-accent-primary)" : "var(--aurora-text-muted)",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <Icon />
                </Button>
              )
            })}
          </div>
        )}
        <ChromeButton title="Open in new tab"><ExternalLinkIcon /></ChromeButton>
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

      {/* Console strip */}
      {showConsole && (
        <div
          style={{
            borderTop: "1px solid var(--aurora-border-default)",
            background: "var(--aurora-panel-strong)",
          }}
        >
          <Button
            variant="plain"
            size="unstyled"
            type="button"
            onClick={() => setConsoleOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              padding: "0 12px",
              height: "32px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--aurora-text-muted)",
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "12px",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "10px", opacity: 0.7 }}>{consoleOpen ? "▾" : "▸"}</span>
            <span>Console</span>
            {consoleCount > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "18px",
                  height: "16px",
                  padding: "0 5px",
                  borderRadius: "10px",
                  background: "color-mix(in srgb, var(--aurora-warn) 18%, transparent)",
                  color: "var(--aurora-warn)",
                  fontFamily: "var(--aurora-font-mono)",
                  fontSize: "10px",
                  fontWeight: 600,
                }}
              >
                {consoleCount}
              </span>
            )}
          </Button>
          {consoleOpen && (
            <div
              style={{
                padding: "8px 12px",
                borderTop: "1px solid var(--aurora-border-default)",
                fontFamily: "var(--aurora-font-mono)",
                fontSize: "11px",
                color: "var(--aurora-text-muted)",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span style={{ color: "var(--aurora-warn)" }}>⚠ Mixed content blocked (2)</span>
              <span style={{ color: "var(--aurora-text-muted)" }}>&gt; Labby gateway connected</span>
            </div>
          )}
        </div>
      )}
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
