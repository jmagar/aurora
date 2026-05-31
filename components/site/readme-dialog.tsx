"use client"

import * as React from "react"
import { BookText, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from "@/registry/aurora/ui/dialog"
import { Button } from "@/registry/aurora/ui/button"
import { Markdown } from "@/components/site/markdown"
import type { AuroraTheme } from "@/lib/themes"

type Status = "idle" | "loading" | "loaded" | "error"

export function ReadmeDialog({ theme }: { theme: AuroraTheme }) {
  const { readmePath } = theme
  const [open, setOpen] = React.useState(false)
  const [status, setStatus] = React.useState<Status>("idle")
  const [content, setContent] = React.useState("")
  // Guard so we fetch once per dialog, not on every status-driven re-render.
  // (Depending on `status` here would let the effect's cleanup cancel its own
  // in-flight fetch, leaving the dialog stuck on "Loading README…".)
  const fetched = React.useRef(false)

  React.useEffect(() => {
    if (!open || fetched.current) return
    fetched.current = true
    let cancelled = false
    setStatus("loading")
    fetch(`/api/readme?path=${encodeURIComponent(readmePath)}`)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`${r.status}`))))
      .then((text) => {
        if (cancelled) return
        setContent(text)
        setStatus("loaded")
      })
      .catch(() => {
        if (!cancelled) setStatus("error")
      })
    return () => {
      cancelled = true
    }
  }, [open, readmePath])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="neutral" size="sm" className="flex-1">
          <BookText size={14} strokeWidth={1.75} />
          README
        </Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{theme.name}</DialogTitle>
          <DialogDescription>{theme.tool}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          {status === "loading" && (
            <p className="aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)" }}>
              Loading README…
            </p>
          )}
          {status === "error" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p className="aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)" }}>
                Couldn&apos;t load the README. Open it on GitHub instead.
              </p>
              <a
                href={theme.readme}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
                style={{ color: "var(--aurora-accent-primary)" }}
              >
                View on GitHub <ExternalLink size={13} strokeWidth={1.75} />
              </a>
            </div>
          )}
          {status === "loaded" && <Markdown source={content} />}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
