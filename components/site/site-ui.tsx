"use client"

import * as React from "react"
import { Copy, Check } from "lucide-react"
import { useClipboard } from "@/lib/use-clipboard"

export function SpectrumBar({
  colors,
  className = "",
}: {
  colors: string[]
  className?: string
}) {
  return (
    <div className={`flex h-1.5 overflow-hidden rounded-full ${className}`}>
      {colors.map((c, i) => (
        <span
          key={i}
          style={{ flex: 1, background: c.startsWith("--") ? `var(${c})` : c }}
        />
      ))}
    </div>
  )
}

export function CopyLine({ cmd }: { cmd: string }) {
  const { state, copied, copy } = useClipboard(1200)
  return (
    <div
      className="flex items-center gap-2 rounded-[10px] px-2.5 py-2"
      style={{
        background: "var(--aurora-control-surface)",
        border: "1px solid var(--aurora-border-default)",
      }}
    >
      <span className="font-mono text-xs" style={{ color: "var(--aurora-accent-primary)" }}>
        $
      </span>
      <code
        className="flex-1 truncate font-mono text-[11.5px]"
        style={{ color: "var(--aurora-text-primary)" }}
      >
        {cmd}
      </code>
      <button
        aria-label={state === "error" ? "Copy failed; retry" : copied ? "Copied command" : "Copy command"}
        onClick={() => void copy(cmd)}
        className="grid size-[26px] shrink-0 place-items-center rounded-[7px]"
        style={{
          background: "var(--aurora-panel-medium)",
          border: "1px solid var(--aurora-border-strong)",
          color: "var(--aurora-text-muted)",
        }}
      >
        {copied ? (
          <Check size={13} strokeWidth={2} style={{ color: "var(--aurora-success)" }} />
        ) : state === "error" ? (
          <span className="text-[10px]" style={{ color: "var(--aurora-error)" }}>!</span>
        ) : (
          <Copy size={13} strokeWidth={1.75} />
        )}
      </button>
    </div>
  )
}
