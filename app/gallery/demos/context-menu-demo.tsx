"use client";

import * as React from "react";
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

// dsCard icon helper: 15px, stroke 1.6, currentColor.
function Icon({ d }: { d: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      dangerouslySetInnerHTML={{ __html: d }}
    />
  );
}

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
          <Icon d='<path d="m9 18 6-6-6-6"/>' />
          Open session
          <ContextMenuShortcut>↵</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem>
          <Icon d='<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>' />
          Rename
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem danger>
          <Icon d='<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>' />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
