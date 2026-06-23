"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/registry/aurora/ui/tooltip";

// ─── CD demo chrome ─────────────────────────────────────────────────────────
// Ports the dsCard's injected CSS (.ib / .kb / .row / .hint) as inline styles.

function Icon({ d }: { d: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: d }}
    />
  );
}

function IconBox({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-grid",
        placeItems: "center",
        width: 34,
        height: 34,
        borderRadius: 9,
        color: color ?? (hover ? "var(--aurora-text-primary)" : "var(--aurora-text-muted)"),
        background: hover ? "var(--aurora-hover-bg)" : "var(--aurora-control-surface)",
        border: "1px solid var(--aurora-border-strong)",
        cursor: "pointer",
      }}
    >
      {children}
    </span>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        color: "var(--aurora-text-muted)",
        border: "1px solid var(--aurora-border-strong)",
        borderRadius: 5,
        padding: "1px 5px",
        marginLeft: 7,
      }}
    >
      {children}
    </span>
  );
}

export default function TooltipDemo() {
  return (
    <TooltipProvider delayDuration={150}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          alignItems: "center",
          justifyContent: "center",
          padding: 30,
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconBox>
                <Icon d='<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/>' />
              </IconBox>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>
                Restart gateway
                <Kbd>⌘R</Kbd>
              </span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <IconBox>
                <Icon d='<path d="m4 17 6-6-6-6M12 19h8"/>' />
              </IconBox>
            </TooltipTrigger>
            <TooltipContent side="top">Open terminal</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <IconBox>
                <Icon d='<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 14H4a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 10 4.6V4a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 2.82 1.18l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 10H20a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' />
              </IconBox>
            </TooltipTrigger>
            <TooltipContent side="bottom">Settings</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <IconBox color="var(--aurora-error)">
                <Icon d='<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>' />
              </IconBox>
            </TooltipTrigger>
            <TooltipContent side="right">Delete · permanent</TooltipContent>
          </Tooltip>
        </div>

        <span style={{ fontSize: 12, color: "var(--aurora-text-muted)" }}>
          Hover or focus any control to reveal its tooltip.
        </span>
      </div>
    </TooltipProvider>
  );
}
