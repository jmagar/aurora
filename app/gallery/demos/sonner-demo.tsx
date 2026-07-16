"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Button } from "@/registry/aurora/ui/button"
import { ToastProvider, useToast } from "@/registry/aurora/ui/toast"

function SonnerButtons() {
  const { toast } = useToast()

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="success"
        size="sm"
        onClick={() =>
          toast({
            status: "success",
            title: "Deploy completed",
            description: "aurora.tootie.tv is serving the latest registry build.",
          })
        }
      >
        Success Toast
      </Button>
      <Button
        variant="warn"
        size="sm"
        onClick={() =>
          toast({
            status: "warn",
            title: "Couldn’t reach gateway",
            description: "Retrying in 4 seconds.",
            action: { label: "Retry Now", onClick: () => {} },
          })
        }
      >
        Warning Toast
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() =>
          toast({
            status: "error",
            title: "Backend unavailable",
            description: "502 from edge-3. Check the upstream.",
          })
        }
      >
        Error Toast
      </Button>
      <Button
        variant="aurora"
        size="sm"
        onClick={() =>
          toast({
            status: "info",
            title: "Registry build queued",
            description: "Generated output will refresh in the background.",
          })
        }
      >
        Info Toast
      </Button>
    </div>
  )
}

export default function SonnerDemo() {
  const [position, setPosition] = React.useState<"top-right" | "bottom-center">("top-right")

  return (
    <ToastProvider position={position}>
      <div className="grid gap-6">
        <GalleryPageIntro
          eyebrow="Feedback"
          heading="Sonner-style Stack"
          description="Aurora ships its own toast provider with the same quick-fire interaction pattern: fire-and-forget status updates, inline actions, dismiss, and stack positioning."
        />

        <div className="flex flex-wrap gap-2">
          <Button
            variant={position === "top-right" ? "aurora" : "neutral"}
            size="sm"
            onClick={() => setPosition("top-right")}
          >
            Top Right
          </Button>
          <Button
            variant={position === "bottom-center" ? "aurora" : "neutral"}
            size="sm"
            onClick={() => setPosition("bottom-center")}
          >
            Bottom Center
          </Button>
        </div>

        <SonnerButtons />
      </div>
    </ToastProvider>
  )
}
