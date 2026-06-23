"use client"

/**
 * Aurora PackageInfo — dependency card.
 *
 * Visual layer ported verbatim from the Claude Design source: a stacked-layers
 * icon tile (orange/axon tint), a mono package name + cyan version, a state
 * badge (LATEST = success teal / OUTDATED = warn amber), an optional footer of
 * registry • license • size with an Install action. Reads only `--aurora-*`
 * tokens so it renders identically in dark + `.light`.
 *
 * Architecture stays shadcn/registry: self-contained, `forwardRef`,
 * `displayName`, `React.memo`, extends `HTMLAttributes<HTMLDivElement>`.
 */

import * as React from "react"
import { Download, Layers } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"

export type PackageInfoVariant = "default" | "compact"

export interface PackageInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Package name (rendered in the mono display weight). */
  name: string
  /** Resolved version string, shown in the cyan accent next to the name. */
  version: string
  /** One-line summary under the title. */
  description?: string
  /** Source registry label (e.g. `cargo`, `npm`). Uppercased in the axon-orange footer tone. */
  registry?: string
  /** SPDX-ish license string for the footer. */
  license?: string
  /** Install size string (e.g. `92 KB`) for the footer. */
  size?: string
  /** Marks the version as current — shows the teal LATEST badge. */
  latest?: boolean
  /** Marks the version as behind — shows the amber OUTDATED badge. */
  outdated?: boolean
  /** `compact` drops the footer/install row and shrinks the icon tile. */
  variant?: PackageInfoVariant
  /** Optional handler for the footer Install action. */
  onInstall?: () => void
}

// ─── Visual layer (ported from Claude Design) ──────────────────────────────────

const CSS = `
.aurora-pkg {
  display: grid; gap: 13px;
  border: 1px solid var(--aurora-border-strong);
  border-radius: var(--aurora-radius-1);
  background: var(--aurora-surface-raised);
  box-shadow: var(--aurora-shadow-medium), var(--aurora-highlight-medium);
  padding: 16px 18px;
  box-sizing: border-box;
}
.aurora-pkg--compact { gap: 0; padding: 13px 15px; }

.aurora-pkg__head { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 14px; align-items: start; }
.aurora-pkg--compact .aurora-pkg__head { gap: 12px; align-items: center; }

.aurora-pkg__tile {
  display: inline-flex; align-items: center; justify-content: center;
  width: 60px; height: 60px; border-radius: 12px; flex-shrink: 0;
  border: 1px solid color-mix(in srgb, var(--axon-orange) 30%, var(--aurora-border-strong));
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--axon-orange) 14%, transparent), transparent 62%),
    var(--aurora-control-surface);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  color: var(--axon-orange);
}
.aurora-pkg--compact .aurora-pkg__tile { width: 42px; height: 42px; border-radius: 10px; }

.aurora-pkg__body { min-width: 0; display: grid; gap: 5px; }
.aurora-pkg--compact .aurora-pkg__body { gap: 3px; }

.aurora-pkg__title { display: flex; align-items: center; gap: 11px; flex-wrap: wrap; min-width: 0; }
.aurora-pkg__name {
  font-family: var(--aurora-font-mono); font-weight: 700; font-size: 17px;
  letter-spacing: -0.01em; color: var(--aurora-text-primary);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;
}
.aurora-pkg--compact .aurora-pkg__name { font-size: 15px; }
.aurora-pkg__version {
  font-family: var(--aurora-font-mono); font-weight: 520; font-size: 14px;
  color: var(--aurora-accent-strong); letter-spacing: 0;
}
.aurora-pkg--compact .aurora-pkg__version { font-size: 13px; }

.aurora-pkg__badge {
  display: inline-flex; align-items: center;
  font-family: var(--aurora-font-mono); font-weight: 600; font-size: 11px;
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 3px 9px; border-radius: 7px; border: 1px solid transparent;
  line-height: 1; white-space: nowrap;
}
.aurora-pkg__badge--latest {
  color: var(--aurora-success);
  background: var(--aurora-success-surface);
  border-color: var(--aurora-success-border);
}
.aurora-pkg__badge--outdated {
  color: var(--aurora-warn);
  background: var(--aurora-warn-surface);
  border-color: var(--aurora-warn-border);
}

.aurora-pkg__desc {
  font-family: var(--aurora-font-sans); font-weight: 460; font-size: 14px;
  color: var(--aurora-text-muted); line-height: 1.4; margin: 0;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.aurora-pkg--compact .aurora-pkg__desc { font-size: 13px; }

.aurora-pkg__divider { height: 1px; border: 0; margin: 0; background: var(--aurora-border-default); }

.aurora-pkg__foot {
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
}
.aurora-pkg__meta {
  display: flex; align-items: center; gap: 14px; min-width: 0; flex-wrap: wrap;
  font-family: var(--aurora-font-mono); font-size: 13px; letter-spacing: 0;
}
.aurora-pkg__registry { color: var(--axon-orange); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
.aurora-pkg__metaitem { color: var(--aurora-text-muted); font-weight: 500; }
`

let injected = false
function ensureCSS() {
  if (injected || typeof document === "undefined") return
  const el = document.createElement("style")
  el.setAttribute("data-aurora-package-info", "")
  el.textContent = CSS
  document.head.appendChild(el)
  injected = true
}

const PackageInfo = React.forwardRef<HTMLDivElement, PackageInfoProps>(
  (
    {
      name,
      version,
      description,
      registry,
      license,
      size,
      latest = false,
      outdated = false,
      variant = "default",
      onInstall,
      className,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      ensureCSS()
    }, [])

    const isCompact = variant === "compact"
    const hasFooter =
      !isCompact && Boolean(registry || license || size || onInstall)

    return (
      <div
        ref={ref}
        className={["aurora-pkg", isCompact && "aurora-pkg--compact", className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <div className="aurora-pkg__head">
          <span className="aurora-pkg__tile">
            <Layers
              width={isCompact ? 18 : 24}
              height={isCompact ? 18 : 24}
              aria-hidden
            />
          </span>
          <span className="aurora-pkg__body">
            <span className="aurora-pkg__title">
              <span className="aurora-pkg__name">{name}</span>
              <span className="aurora-pkg__version">{version}</span>
              {latest ? (
                <span className="aurora-pkg__badge aurora-pkg__badge--latest">
                  Latest
                </span>
              ) : null}
              {outdated ? (
                <span className="aurora-pkg__badge aurora-pkg__badge--outdated">
                  Outdated
                </span>
              ) : null}
            </span>
            {description ? (
              <p className="aurora-pkg__desc">{description}</p>
            ) : null}
          </span>
        </div>

        {hasFooter ? (
          <>
            <hr className="aurora-pkg__divider" aria-hidden />
            <div className="aurora-pkg__foot">
              <div className="aurora-pkg__meta">
                {registry ? (
                  <span className="aurora-pkg__registry">{registry}</span>
                ) : null}
                {license ? (
                  <span className="aurora-pkg__metaitem">{license}</span>
                ) : null}
                {size ? (
                  <span className="aurora-pkg__metaitem">{size}</span>
                ) : null}
              </div>
              {onInstall || registry || license || size ? (
                <Button
                  type="button"
                  variant="aurora"
                  filled
                  size="sm"
                  onClick={onInstall}
                  iconLeft={<Download className="size-4" aria-hidden />}
                >
                  Install
                </Button>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    )
  }
)
PackageInfo.displayName = "PackageInfo"

const MemoPackageInfo = React.memo(PackageInfo)
MemoPackageInfo.displayName = "PackageInfo"

export { MemoPackageInfo as PackageInfo }
export default MemoPackageInfo
