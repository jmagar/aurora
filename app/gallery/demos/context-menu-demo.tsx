"use client";

import * as React from "react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuShortcut,
} from "@/registry/aurora/ui/context-menu";
import { Badge } from "@/registry/aurora/ui/badge";

export default function ContextMenuDemo() {
  const [lastAction, setLastAction] = React.useState<string | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--aurora-text-muted)",
        }}
      >
        Right-click the gateway row
      </p>

      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto auto auto",
              alignItems: "center",
              gap: 16,
              padding: "12px 16px",
              background: "var(--aurora-panel-medium)",
              border: "1px solid var(--aurora-border-strong)",
              borderRadius: 8,
              cursor: "context-menu",
              userSelect: "none",
            }}
          >
            {/* Gateway name + host */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--aurora-text-primary)",
                }}
              >
                production-edge
              </span>
              <span
                style={{
                  fontFamily: "var(--aurora-font-mono, monospace)",
                  fontSize: 11,
                  color: "var(--aurora-text-muted)",
                }}
              >
                prod.lab.local
              </span>
            </div>

            <Badge variant="success" dot={true}>
              Live
            </Badge>

            <span
              className="tabular-nums"
              style={{ fontSize: 13, color: "var(--aurora-text-primary)" }}
            >
              1,284 req/min
            </span>

            <span
              className="tabular-nums"
              style={{ fontSize: 13, color: "var(--aurora-text-primary)" }}
            >
              42 ms
            </span>

            <span
              style={{
                fontFamily: "var(--aurora-font-mono, monospace)",
                fontSize: 11,
                color: "var(--aurora-text-muted)",
              }}
            >
              v2.4.1
            </span>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuLabel>production-edge</ContextMenuLabel>

          <ContextMenuItem onSelect={() => setLastAction("Open")}>
            Open
            <ContextMenuShortcut>↵</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem onSelect={() => setLastAction("Inspect")}>
            Inspect
            <ContextMenuShortcut>⌘I</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem
            onSelect={() => {
              setLastAction("Copy ID");
            }}
          >
            Copy ID
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem onSelect={() => setLastAction("Pin")}>
            Pin to dashboard
          </ContextMenuItem>

          <ContextMenuItem onSelect={() => setLastAction("Duplicate")}>
            Duplicate
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem danger onSelect={() => setLastAction("Delete")}>
            Delete gateway
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {lastAction && (
        <p
          style={{
            fontSize: 12,
            color: "var(--aurora-text-muted)",
            fontStyle: "italic",
          }}
        >
          Last action: <strong style={{ color: "var(--aurora-accent-primary)" }}>{lastAction}</strong>
        </p>
      )}
    </div>
  );
}
