"use client";

// Aurora extension — StatusDot
// CD parity: a small self-glowing live dot paired with a label. Each status
// maps to one of Aurora's semantic tone families (success / warn / error /
// info / neutral). `pulse` arms a soft glowing keyframe. `violet` is not part
// of the system and is intentionally absent.

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Status tones
// ---------------------------------------------------------------------------
// CD's demo uses semantic status names (ready / running / error / info). We
// map those to Aurora's semantic accent tokens and also accept the raw tone
// names (success / warn / neutral) as aliases so the component reads naturally
// in both vocabularies.

export type StatusDotStatus =
  | "ready"
  | "running"
  | "error"
  | "info"
  | "success"
  | "warn"
  | "neutral";

/** Resolve a status name to the Aurora accent token that colors the dot + glow. */
const STATUS_COLOR: Record<StatusDotStatus, string> = {
  ready: "var(--aurora-success)",
  success: "var(--aurora-success)",
  running: "var(--aurora-warn)",
  warn: "var(--aurora-warn)",
  error: "var(--aurora-error)",
  info: "var(--aurora-info)",
  neutral: "var(--aurora-neutral)",
};

/** Accessible status word announced to assistive tech for each tone. */
const STATUS_ROLE_LABEL: Record<StatusDotStatus, string> = {
  ready: "ready",
  success: "ready",
  running: "running",
  warn: "warning",
  error: "error",
  info: "info",
  neutral: "idle",
};

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

// ---------------------------------------------------------------------------
// StatusDot
// ---------------------------------------------------------------------------

export interface StatusDotProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /** Semantic status — drives the dot color and the glow. */
  status?: StatusDotStatus;
  /** Arm the soft pulsing glow (e.g. for live / in-flight states). */
  pulse?: boolean;
  /** Text label shown beside the dot. When omitted, only the dot renders. */
  label?: React.ReactNode;
}

function StatusDot(
  { ref, status = "neutral", pulse = false, label, className, style, ...props }: StatusDotProps & { ref?: React.Ref<HTMLSpanElement> }
) {
  const color = STATUS_COLOR[status] ?? STATUS_COLOR.neutral;
  const roleLabel = STATUS_ROLE_LABEL[status] ?? STATUS_ROLE_LABEL.neutral;

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-[10px] font-[var(--font-sans)] text-[13px] leading-none text-[var(--aurora-text-primary)]",
        className
      )}
      style={style}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "aurora-status-dot",
          pulse && "aurora-status-dot--pulse"
        )}
        style={{ ["--status-dot-color" as string]: color }}
      />
      {label != null && (
        <span className="inline-flex items-center">
          {/* Status word for assistive tech; the visible label carries the rest. */}
          <span className="sr-only">{roleLabel}: </span>
          <span>{label}</span>
        </span>
      )}
    </span>
  );
}

export { StatusDot };
export default StatusDot;
