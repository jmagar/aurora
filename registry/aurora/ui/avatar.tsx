"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ─── Size map ─────────────────────────────────────────────────────────────────

const sizeMap = {
  sm: { wh: 24, text: 9, statusSize: 7, statusOffset: -1 },
  md: { wh: 32, text: 11, statusSize: 9, statusOffset: -1 },
  lg: { wh: 40, text: 13, statusSize: 10, statusOffset: 0 },
  xl: { wh: 56, text: 17, statusSize: 13, statusOffset: 1 },
} as const

type AvatarSize = keyof typeof sizeMap
type AvatarVariant = "default" | "beacon" | "bot" | "status"
type StatusColor = "online" | "away" | "busy" | "offline"

const statusColorMap: Record<StatusColor, string> = {
  online: "#7dd3c7",
  away: "#c6a36b",
  busy: "#c78490",
  offline: "#3a5568",
}

// ─── Keyframes injected once ──────────────────────────────────────────────────

const BEACON_KEYFRAMES = `
@keyframes aurora-beacon-ping {
  0%   { transform: scale(1);    opacity: 0.6; }
  70%  { transform: scale(1.55); opacity: 0;   }
  100% { transform: scale(1.55); opacity: 0;   }
}
@keyframes aurora-beacon-ring {
  0%, 100% { opacity: 0.7; }
  50%       { opacity: 1;   }
}
`

let keyframesInjected = false

function ensureBeaconKeyframes() {
  if (keyframesInjected || typeof document === "undefined") return
  const style = document.createElement("style")
  style.textContent = BEACON_KEYFRAMES
  document.head.appendChild(style)
  keyframesInjected = true
}

// ─── Avatar component ─────────────────────────────────────────────────────────

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  /** Visual variant */
  variant?: AvatarVariant
  /** Size preset */
  size?: AvatarSize
  /** Image src */
  src?: string
  /** Alt text */
  alt?: string
  /** Fallback text (initials) */
  fallback?: string
  /** Status dot color — only shown when variant="status" */
  status?: StatusColor
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(
  (
    {
      className,
      variant = "default",
      size = "md",
      src,
      alt = "",
      fallback,
      status = "online",
      style,
      ...props
    },
    ref
  ) => {
    const dims = sizeMap[size]
    const isBot = variant === "bot"
    const isBeacon = variant === "beacon"
    const hasStatus = variant === "status"

    React.useEffect(() => {
      if (isBeacon) ensureBeaconKeyframes()
    }, [isBeacon])

    // Shared ring style for default / status
    const defaultRing: React.CSSProperties =
      variant === "default" || variant === "status"
        ? {
            boxShadow: "var(--aurora-active-glow)",
          }
        : {}

    // Bot variant: square border, cyan glow
    const botStyle: React.CSSProperties = isBot
      ? {
          borderRadius: "var(--aurora-radius-1, 14px)",
          border: "1.5px solid var(--aurora-border-strong, #24536c)",
          boxShadow: [
            "0 0 0 1px color-mix(in srgb, #29b6f6 20%, transparent)",
            "0 2px 12px color-mix(in srgb, #29b6f6 18%, transparent)",
          ].join(", "),
        }
      : {}

    const rootStyle: React.CSSProperties = {
      width: dims.wh,
      height: dims.wh,
      minWidth: dims.wh,
      ...defaultRing,
      ...botStyle,
      ...style,
    }

    return (
      <span
        className={cn("relative inline-flex shrink-0", className)}
        style={{ width: dims.wh, height: dims.wh }}
      >
        {/* Beacon pulsing outer ring */}
        {isBeacon && (
          <>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: -4,
                borderRadius: "50%",
                border: "2px solid #29b6f6",
                animation: "aurora-beacon-ping 1.8s cubic-bezier(0.4,0,0.6,1) infinite",
                pointerEvents: "none",
              }}
            />
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: -2,
                borderRadius: "50%",
                border: "1.5px solid rgba(41,182,246,0.5)",
                animation: "aurora-beacon-ring 1.8s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
          </>
        )}

        <AvatarPrimitive.Root
          ref={ref}
          className={cn(
            "inline-flex items-center justify-center overflow-hidden",
            "select-none shrink-0",
            !isBot && "rounded-full",
          )}
          style={rootStyle}
          {...props}
        >
          <AvatarPrimitive.Image
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            style={isBot ? { borderRadius: "inherit" } : {}}
          />
          <AvatarPrimitive.Fallback
            className={cn(
              "flex h-full w-full items-center justify-center font-semibold uppercase",
              "text-[var(--aurora-accent-primary)]",
            )}
            style={{
              background: "var(--aurora-panel-strong, #13293a)",
              fontSize: dims.text,
              fontFamily: "var(--aurora-font-sans, Inter, sans-serif)",
            }}
            delayMs={300}
          >
            {fallback ?? alt?.slice(0, 2) ?? "?"}
          </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>

        {/* Status dot */}
        {hasStatus && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: dims.statusOffset,
              right: dims.statusOffset,
              width: dims.statusSize,
              height: dims.statusSize,
              borderRadius: "50%",
              backgroundColor: statusColorMap[status],
              border: "2px solid var(--aurora-page-bg, #07131c)",
              boxShadow: `0 0 4px ${statusColorMap[status]}`,
            }}
          />
        )}
      </span>
    )
  }
)
Avatar.displayName = "Avatar"

// ─── Sub-components for composable use ───────────────────────────────────────

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full",
      "bg-[var(--aurora-panel-strong)] text-[var(--aurora-accent-primary)]",
      "text-xs font-semibold uppercase",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
export default Avatar
