"use client"

import * as React from "react"
import type { RegistryMeta } from "@/lib/registry-meta"

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }).catch(() => {
      // Fallback for non-secure contexts or denied permissions
      try {
        const el = document.createElement("textarea")
        el.value = value
        el.style.position = "fixed"
        el.style.opacity = "0"
        document.body.appendChild(el)
        el.select()
        document.execCommand("copy")
        document.body.removeChild(el)
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      } catch {
        // silent — nothing useful to surface to the user
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy install command"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "0 10px",
        height: "28px",
        borderRadius: "7px",
        border: "1px solid var(--aurora-border-strong)",
        background: copied
          ? "color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)"
          : "color-mix(in srgb, var(--aurora-control-surface) 80%, transparent)",
        color: copied ? "var(--aurora-accent-primary)" : "var(--aurora-text-muted)",
        fontSize: "11px",
        fontWeight: 600,
        fontFamily: "var(--aurora-font-sans)",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background 140ms, color 140ms, border-color 140ms",
        borderColor: copied
          ? "color-mix(in srgb, var(--aurora-accent-primary) 32%, transparent)"
          : undefined,
      }}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 4V2.5A1.5 1.5 0 006.5 1H2.5A1.5 1.5 0 001 2.5v4A1.5 1.5 0 002.5 8H4" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          Copy
        </>
      )}
    </button>
  )
}

interface ComponentInstallProps {
  meta: RegistryMeta
  className?: string
}

function parsePkgName(dep: string): string {
  // Handles scoped packages: "@radix-ui/react-slot@^1.2.3" → "@radix-ui/react-slot"
  if (dep.startsWith("@")) {
    const withoutLeading = dep.slice(1)
    const versionIdx = withoutLeading.indexOf("@")
    return versionIdx === -1 ? dep : "@" + withoutLeading.slice(0, versionIdx)
  }
  return dep.split("@")[0]
}

export function ComponentInstall({ meta, className }: ComponentInstallProps) {
  const installCmd = `npx shadcn@latest add ${meta.installUrl}`
  const hasNpmDeps = meta.dependencies.length > 0
  const hasRegDeps = meta.registryDependencies.length > 0

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gap: "16px",
        padding: "20px 24px",
        borderRadius: "var(--aurora-radius-2)",
        border: "1px solid var(--aurora-border-default)",
        background: "var(--aurora-panel-strong)",
        boxShadow: "var(--aurora-shadow-strong), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Description */}
      {meta.description && (
        <p
          className="aurora-text-body"
          style={{ margin: 0, color: "var(--aurora-text-secondary)", maxWidth: 680 }}
        >
          {meta.description}
        </p>
      )}

      {/* Install command */}
      <div>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--aurora-text-muted)",
            fontFamily: "var(--aurora-font-sans)",
          }}
        >
          Install
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 14px",
            borderRadius: "var(--aurora-radius-1)",
            border: "1px solid var(--aurora-border-strong)",
            background: "color-mix(in srgb, var(--aurora-panel-medium) 90%, transparent)",
          }}
        >
          <code
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: "12.5px",
              fontFamily: "var(--aurora-font-mono)",
              color: "var(--aurora-text-primary)",
              lineHeight: 1.5,
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {installCmd}
          </code>
          <CopyButton value={installCmd} />
        </div>
      </div>

      {/* Dependencies row */}
      {(hasNpmDeps || hasRegDeps) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            paddingTop: "4px",
            borderTop: "1px solid var(--aurora-border-default)",
          }}
        >
          {hasRegDeps && (
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--aurora-text-muted)",
                  fontFamily: "var(--aurora-font-sans)",
                  marginRight: "8px",
                }}
              >
                Requires
              </span>
              {meta.registryDependencies.map((dep) => (
                <code
                  key={dep}
                  style={{
                    fontSize: "11.5px",
                    fontFamily: "var(--aurora-font-mono)",
                    color: "var(--aurora-accent-primary)",
                    background: "color-mix(in srgb, var(--aurora-accent-primary) 10%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent)",
                    borderRadius: "5px",
                    padding: "1px 6px",
                    marginRight: "4px",
                  }}
                >
                  {dep}
                </code>
              ))}
            </div>
          )}
          {hasNpmDeps && (
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--aurora-text-muted)",
                  fontFamily: "var(--aurora-font-sans)",
                  marginRight: "8px",
                }}
              >
                npm
              </span>
              {meta.dependencies.map((dep) => (
                <code
                  key={dep}
                  style={{
                    fontSize: "11.5px",
                    fontFamily: "var(--aurora-font-mono)",
                    color: "var(--aurora-text-secondary)",
                    background: "color-mix(in srgb, var(--aurora-control-surface) 70%, transparent)",
                    border: "1px solid var(--aurora-border-default)",
                    borderRadius: "5px",
                    padding: "1px 6px",
                    marginRight: "4px",
                  }}
                >
                  {parsePkgName(dep)}
                </code>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
