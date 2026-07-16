"use client";

import * as React from "react";
import { Button } from "@/registry/aurora/ui/button";
import { Banner, type BannerStatus } from "@/registry/aurora/ui/banner";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

type BannerItem = {
  id: number;
  tone: BannerStatus;
  title: string;
  body: string;
  action?: React.ReactNode;
};

const INITIAL: BannerItem[] = [
  {
    id: 1,
    tone: "success",
    title: "Plex authorized",
    body: "Token stored. Library sync started.",
    action: <Button variant="neutral" size="sm">Inspect Run</Button>,
  },
  {
    id: 2,
    tone: "warn",
    title: "Couldn’t reach gateway",
    body: "Retrying in 4 seconds.",
    action: <Button variant="warn" size="sm">Retry Now</Button>,
  },
  {
    id: 3,
    tone: "error",
    title: "Backend unavailable",
    body: "502 from edge-3. Check the upstream.",
    action: <Button variant="destructive" size="sm">View Logs</Button>,
  },
];

export default function BannersDemo() {
  const [list, setList] = React.useState<BannerItem[]>(INITIAL);
  const [leaving, setLeaving] = React.useState<number | null>(null);

  function dismiss(id: number) {
    setLeaving(id);
    setTimeout(() => {
      setList((l) => l.filter((b) => b.id !== id));
      setLeaving(null);
    }, 200);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Feedback"
        heading="Banner"
        description="Inline status notices. Each banner surfaces a system-level event with a tone-tinted surface, leading status icon, and a dismiss affordance."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {list.map((b) => (
          <div
            key={b.id}
            style={{
              transition: "opacity 200ms ease, transform 200ms ease",
              opacity: leaving === b.id ? 0 : 1,
              transform: leaving === b.id ? "translateX(10px)" : "none",
            }}
          >
            <Banner
              tone={b.tone}
              title={b.title}
              description={b.body}
              action={b.action}
              onClose={() => dismiss(b.id)}
            />
          </div>
        ))}
        {list.length === 0 && (
          <Button
            variant="neutral"
            size="sm"
            type="button"
            onClick={() => setList(INITIAL)}
            style={{ alignSelf: "flex-start" }}
          >
            Replay
          </Button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Banner kind="tag" tone="info" title="Index ready." description=" 38 sources are searchable." />
        <Banner kind="tag" tone="warn" title="Permission changed." description=" Review gateway access before the next run." />
        <Banner kind="tag" tone="success" title="Deploy completed." description=" All workers are on the latest registry build." />
      </div>
    </div>
  );
}
