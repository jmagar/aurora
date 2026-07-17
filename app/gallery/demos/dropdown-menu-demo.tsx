"use client"

import * as React from "react"
import { ChevronDown, Pencil, Copy, Trash2 } from "lucide-react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Button } from "@/registry/aurora/ui/button"
import {
  DropdownMenuGroup,
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

      <div style={{ display: "flex", minHeight: 220, alignItems: "flex-start" }}>
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button variant="neutral">
              Session
              <ChevronDown data-icon="inline-end" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Session</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Pencil aria-hidden />
                Rename
                <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy aria-hidden />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem danger>
                <Trash2 aria-hidden />
                Delete Session
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
