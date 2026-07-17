"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Button } from "@/registry/aurora/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogCard,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/aurora/ui/alert-dialog"

export default function AlertDialogDemo() {
  return (
    <div style={{ display: "grid", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Overlays"
        heading="Alert Dialog"
        description="Use the inline card for persistent caution states and the modal API when the operator must confirm or cancel before continuing."
      />

      <div
        style={{
          display: "grid",
          gap: 18,
          alignItems: "start",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        <AlertDialogCard
          destructive
          title="Delete Environment?"
          description="This removes prod-edge-3 and its 7 gateways. This cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />

        <div
          style={{
            display: "grid",
            gap: 12,
            alignContent: "start",
            padding: 20,
            borderRadius: "var(--aurora-radius-2)",
            border: "1px solid var(--aurora-border-default)",
            background: "var(--aurora-panel-medium)",
          }}
        >
          <div className="aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>
            Triggered confirmation
          </div>
          <p className="aurora-text-body-sm" style={{ margin: 0, color: "var(--aurora-text-muted)" }}>
            Opens a focus-trapped confirmation dialog with Cancel and Delete actions.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Environment</Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Environment?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes prod-edge-3 and its 7 gateways. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="neutral">Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button variant="rose">Delete</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
