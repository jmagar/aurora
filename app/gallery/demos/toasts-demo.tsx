"use client";

import * as React from "react";
import { GalleryPageIntro } from "@/components/gallery-page-intro";
import { Button } from "@/registry/aurora/ui/button";
import { Toast, type ToastItem } from "@/registry/aurora/ui/toast";

// Composition mirrors the Claude Design "Toast" dsCard 1:1:
// three transient status notices (success / warn / error), with the warn
// toast carrying an inline "Retry now" action.
function buildToasts(retry: () => void): ToastItem[] {
  return [
    {
      id: "success",
      status: "success",
      title: "Deploy completed",
      description: "edge-1 · 200 OK",
    },
    {
      id: "warn",
      status: "warn",
      title: "Couldn’t reach gateway",
      description: "Retrying in 4s.",
      action: { label: "Retry Now", onClick: retry },
    },
    {
      id: "error",
      status: "error",
      title: "Backend unavailable",
      description: "502 from edge-3.",
    },
  ];
}

export default function ToastsDemo() {
  const [visibleIds, setVisibleIds] = React.useState(
    () => new Set(["success", "warn", "error"]),
  );

  const allToasts = React.useMemo(
    () => buildToasts(() => setVisibleIds(new Set(["success", "warn", "error"]))),
    [],
  );
  const visibleToasts = allToasts.filter((toast) => visibleIds.has(toast.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GalleryPageIntro
        eyebrow="Feedback"
        heading="Toast"
        description="Transient status notices with semantic icons, assertive error/warn announcements, an optional inline action, and a dismiss control."
      />

      <Button
        variant="neutral"
        size="sm"
        type="button"
        onClick={() => setVisibleIds(new Set(["success", "warn", "error"]))}
        style={{ justifySelf: "start" }}
      >
        Reset Stack
      </Button>

      <div style={{ display: "grid", gap: 10, width: "min(400px, 100%)" }}>
        {visibleToasts.map((item) => (
          <Toast
            key={item.id}
            item={item}
            onDismiss={(id) =>
              setVisibleIds((current) => {
                const next = new Set(current);
                next.delete(id);
                return next;
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
