"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/registry/aurora/ui/tooltip";

function StatusDot({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 6px 2px ${color}55`,
        cursor: "default",
        flexShrink: 0,
      }}
    />
  );
}

function IconButton({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: 8,
        border: "1px solid var(--aurora-border-default)",
        background: "var(--aurora-control-surface)",
        color: "var(--aurora-text-muted)",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function HostnameChip({ name }: { name: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 8,
        background: "var(--aurora-control-surface)",
        border: "1px solid var(--aurora-border-default)",
        fontFamily: "var(--aurora-font-mono)",
        fontSize: 12,
        color: "var(--aurora-accent-pink)",
        cursor: "default",
      }}
    >
      {name}
    </span>
  );
}

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--aurora-text-muted)", marginBottom: 6 }}>
            Overlay
          </p>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--aurora-text-primary)", margin: 0 }}>
            Tooltips
          </h2>
          <p style={{ fontSize: 13, color: "var(--aurora-text-muted)", marginTop: 6, lineHeight: 1.55 }}>
            Hover each element to reveal contextual details. Used throughout Labby for hostnames, status info, and action labels.
          </p>
        </div>

        <div>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
            Status indicators
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span style={{ display: "inline-flex" }}>
                  <StatusDot color="var(--aurora-success)" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">Gateway online</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span style={{ display: "inline-flex" }}>
                  <StatusDot color="var(--aurora-warn)" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">Degraded — high latency on us-west-2-gw-01</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span style={{ display: "inline-flex" }}>
                  <StatusDot color="var(--aurora-error)" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">Offline — no response for 3 min</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
            Gateway hostnames
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span style={{ display: "inline-flex" }}>
                  <HostnameChip name="production-edge.lab.local" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom">Region: us-east-1 · v3.8.1 · 99.97% uptime</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span style={{ display: "inline-flex" }}>
                  <HostnameChip name="staging-gw.lab.local" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom">Region: eu-west-1 · v3.9.0-beta · staging env</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
            Action buttons
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span style={{ display: "inline-flex" }}>
                  <IconButton label="Copy hostname">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="5" width="9" height="9" rx="2" />
                      <path d="M11 5V3a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2h2" />
                    </svg>
                  </IconButton>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">Copy hostname</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span style={{ display: "inline-flex" }}>
                  <IconButton label="Open logs">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 4h12M2 8h8M2 12h10" />
                    </svg>
                  </IconButton>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">Open gateway logs</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span style={{ display: "inline-flex" }}>
                  <IconButton label="Restart gateway">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 8A5 5 0 102.5 5.5" />
                      <polyline points="2 3 2.5 5.5 5 5" />
                    </svg>
                  </IconButton>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">Restart gateway</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span style={{ display: "inline-flex" }}>
                  <IconButton label="Gateway settings">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="8" cy="8" r="2" />
                      <path d="M8 1v2M8 13v2M1 8h2M13 8h2" />
                    </svg>
                  </IconButton>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">Gateway settings</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
