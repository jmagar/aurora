"use client"

import * as React from "react"
import { ChevronDown, Pencil, Copy, Trash2 } from "lucide-react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Button } from "@/registry/aurora/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/registry/aurora/ui/dropdown-menu"

export default function DropdownMenuDemo() {
  return (
    <div style={{ display: "grid", gap: 24, padding: 0 }}>
      <GalleryPageIntro
        eyebrow="Components"
        heading="DropdownMenu"
        description="Menu · separators · danger"
      />

      <div style={{ display: "flex", minHeight: 280, alignItems: "flex-start" }}>
        <DropdownMenu open modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="neutral"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              Session
              <ChevronDown className="size-[15px]" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Session</DropdownMenuLabel>
            <DropdownMenuItem>
              <Pencil className="size-[15px] opacity-70" aria-hidden />
              Rename
              <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="size-[15px] opacity-70" aria-hidden />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem danger>
              <Trash2 className="size-[15px]" aria-hidden />
              Delete session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
