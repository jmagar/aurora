"use client"

import * as React from "react"
import { Copy, Check } from "lucide-react"

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
  const [done, setDone] = React.useState(false)
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
        aria-label="Copy command"
        onClick={() => {
          navigator.clipboard?.writeText(cmd)
          setDone(true)
          setTimeout(() => setDone(false), 1200)
        }}
        className="grid size-[26px] shrink-0 place-items-center rounded-[7px]"
        style={{
          background: "var(--aurora-panel-medium)",
          border: "1px solid var(--aurora-border-strong)",
          color: "var(--aurora-text-muted)",
        }}
      >
        {done ? (
          <Check size={13} strokeWidth={2} style={{ color: "var(--aurora-success)" }} />
        ) : (
          <Copy size={13} strokeWidth={1.75} />
        )}
      </button>
    </div>
  )
}

/** Signature site atmosphere + motion. Injected once by the marketing layout. */
export const SITE_STYLES = `
.aurora-gradient-text {
  background: linear-gradient(100deg, var(--aurora-accent-strong) 0%, var(--aurora-accent-primary) 38%, var(--aurora-accent-violet-strong) 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.aurora-ribbon {
  position: absolute; inset: -22% -10% auto -10%; height: 540px; z-index: 0; pointer-events: none;
  background:
    radial-gradient(40% 60% at 22% 30%, color-mix(in srgb, var(--aurora-accent-primary) 34%, transparent), transparent 70%),
    radial-gradient(38% 56% at 70% 22%, color-mix(in srgb, var(--aurora-accent-violet) 30%, transparent), transparent 70%),
    radial-gradient(34% 50% at 50% 64%, color-mix(in srgb, var(--aurora-accent-pink) 18%, transparent), transparent 70%);
  filter: blur(64px) saturate(118%); opacity: .5;
}
.aurora-grain {
  position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: .03; mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.aurora-bento { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 150px; gap: 18px; }
.aurora-bento-tile { cursor: pointer; }
.aurora-bento-big { grid-column: span 2; grid-row: span 2; }
.aurora-bento-tile:hover { border-color: color-mix(in srgb, var(--aurora-accent-primary) 36%, var(--aurora-border-strong)) !important; box-shadow: var(--aurora-shadow-strong), var(--aurora-active-glow) !important; }
@media (max-width: 760px) {
  .aurora-bento { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 130px; }
  .aurora-bento-big { grid-column: span 2; grid-row: span 1; }
}
.aurora-card:hover { border-color: color-mix(in srgb, var(--aurora-accent-primary) 34%, var(--aurora-border-strong)) !important; box-shadow: var(--aurora-shadow-strong), var(--aurora-active-glow) !important; }
@media (prefers-reduced-motion: no-preference) {
  .aurora-reveal { opacity: 0; transform: translateY(14px); animation: aurora-rise .6s cubic-bezier(.2,.7,.2,1) forwards; }
  @keyframes aurora-rise { to { opacity: 1; transform: none; } }
  .aurora-ribbon { animation: aurora-drift 22s ease-in-out infinite alternate; }
  @keyframes aurora-drift {
    0%   { transform: translate3d(-3%, 0, 0) rotate(-2deg) scale(1.05); opacity: .46; }
    50%  { transform: translate3d(4%, -2%, 0) rotate(2deg) scale(1.12); opacity: .58; }
    100% { transform: translate3d(-2%, 1%, 0) rotate(-1deg) scale(1.06); opacity: .46; }
  }
}
.aurora-still .aurora-reveal { opacity: 1 !important; transform: none !important; animation: none !important; }
.aurora-still .aurora-ribbon { animation: none !important; }
`
