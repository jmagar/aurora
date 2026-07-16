"use client";

import * as React from "react";
import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/registry/aurora/ui/context-menu";

/**
 * Gallery demo — Context Menu
 * Rebuilt 1:1 from the Claude Design `ContextMenu.dsCard` composition:
 * a cursor-anchored menu opened by right-clicking a dashed area, with
 * icon + shortcut items and a danger Delete row.
 */

const iconProps = { size: 15, strokeWidth: 1.6, "aria-hidden": true } as const;

export default function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          style={{
            height: 192,
            borderRadius: "var(--radius-2)",
            border: "1px dashed var(--aurora-border-strong)",
            display: "grid",
            placeItems: "center",
            color: "var(--aurora-text-muted)",
            fontSize: 13,
            fontFamily: "var(--aurora-font-sans, var(--font-sans))",
            background: "var(--aurora-control-surface)",
            userSelect: "none",
            cursor: "context-menu",
          }}
        >
          Right-click anywhere
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem>
          <ChevronRight {...iconProps} />
          Open Session
          <ContextMenuShortcut>↵</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem>
          <Pencil {...iconProps} />
          Rename
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem danger>
          <Trash2 {...iconProps} />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
