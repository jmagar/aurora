"use client"

import * as React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/registry/aurora/ui/dialog"
import { Button } from "@/registry/aurora/ui/button"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

/* Mirrors the Claude Design Dialog preview 1:1 — Tier-2 modal on a blurred
   scrim. CD shows it open; here a trigger opens it (gallery UX). */

export default function ModalsDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GalleryPageIntro
        eyebrow="Overlays"
        heading="Modal & dialog"
        description="A Tier-2 modal on a dimmed, blurred scrim — gradient panel, 22px corners, Esc / scrim-click to close. Built on Radix Dialog (focus trap + scroll lock)."
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">Delete environment</Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete environment?</DialogTitle>
            <DialogDescription>
              This removes prod-edge-3 and its 7 gateways. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="neutral" size="sm">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" size="sm" onClick={() => setOpen(false)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
