"use client"

import * as React from "react"
import {
  CircleAlert,
  ExternalLink,
  Globe2,
  Lock,
  Monitor,
  RefreshCw,
  Smartphone,
  Tablet,
} from "lucide-react"
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
// Icons
// ---------------------------------------------------------------------------

const ICON_STROKE = 1.65

function ReloadIcon() {
  return <RefreshCw size={14} strokeWidth={ICON_STROKE} aria-hidden />
}


function LockIcon() {
  return <Lock size={12} strokeWidth={ICON_STROKE} aria-hidden />
}

function GlobeIcon() {
  return <Globe2 size={16} strokeWidth={ICON_STROKE} aria-hidden />
}

function DesktopIcon() {
  return <Monitor size={16} strokeWidth={ICON_STROKE} aria-hidden />
}

function TabletIcon() {
  return <Tablet size={16} strokeWidth={ICON_STROKE} aria-hidden />
}

function MobileIcon() {
  return <Smartphone size={16} strokeWidth={ICON_STROKE} aria-hidden />
}

function ExternalLinkIcon() {
  return <ExternalLink size={14} strokeWidth={ICON_STROKE} aria-hidden />
}

function AlertIcon() {
  return <CircleAlert size={32} strokeWidth={1.75} aria-hidden style={{ color: "var(--aurora-error)" }} />
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
                  fontFamily: "var(--aurora-font-sans)",
                  fontVariantNumeric: "tabular-nums",
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
