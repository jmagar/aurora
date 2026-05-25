"use client";

import * as React from "react";
import { GalleryPageIntro } from "@/components/gallery-page-intro";
import { Button } from "@/registry/aurora/ui/button";
import { Toast, type ToastItem } from "@/registry/aurora/ui/toast";

const TOASTS: ToastItem[] = [
  {
    id: "success",
    status: "success",
    title: "Plugin deployed successfully",
    description: "labby-auth-proxy v2.1.0 is now active on production-edge.lab.local.",
  },
  {
    id: "error",
    status: "error",
    title: "Gateway connection failed",
    description: "us-east-1-gw-02 refused the connection. Check firewall rules or the upstream router.",
  },
  {
    id: "info",
    status: "info",
    title: "Policy sync complete",
    description: "47 rules applied across 3 gateway clusters. No conflicts detected.",
  },
  {
    id: "warn",
    status: "warn",
    title: "Certificate expiring in 7 days",
    description: "production-edge.lab.local - schedule renewal to avoid service interruption.",
  },
];

export default function ToastsDemo() {
  const [visibleIds, setVisibleIds] = React.useState(() => new Set(TOASTS.map((toast) => toast.id)));
  const visibleToasts = TOASTS.filter((toast) => visibleIds.has(toast.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GalleryPageIntro
        eyebrow="Feedback"
        heading="Toasts"
        description="Transient notifications with semantic status icons, assertive error/warn announcements, and dismiss controls."
      />

      <Button
        variant="neutral"
        size="sm"
        type="button"
        onClick={() => setVisibleIds(new Set(TOASTS.map((toast) => toast.id)))}
        style={{ justifySelf: "start" }}
      >
        Reset stack
      </Button>

      <div style={{ display: "grid", gap: 10, width: "min(400px, 100%)" }}>
        {visibleToasts.map((item) => (
          <Toast
            key={item.id}
            item={item}
            onDismiss={(id) => setVisibleIds((current) => {
              const next = new Set(current);
              next.delete(id);
              return next;
            })}
          />
        ))}
      </div>
    </div>
  );
}
