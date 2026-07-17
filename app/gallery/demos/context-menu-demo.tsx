"use client"

import * as React from "react"
import { ArrowRight, Pencil, Trash2 } from "lucide-react"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/registry/aurora/ui/context-menu"

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
        <ContextMenuGroup>
          <ContextMenuItem>
            <ArrowRight aria-hidden />
            Open Session
            <ContextMenuShortcut>↵</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem>
            <Pencil aria-hidden />
            Rename
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem danger>
            <Trash2 aria-hidden />
            Delete
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}
