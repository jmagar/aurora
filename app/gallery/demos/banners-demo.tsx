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
};

const INITIAL: BannerItem[] = [
  { id: 1, tone: "success", title: "Plex authorized", body: "Token stored. Library sync started." },
  { id: 2, tone: "warn", title: "Couldn’t reach gateway", body: "Retrying in 4 seconds." },
  { id: 3, tone: "error", title: "Backend unavailable", body: "502 from edge-3. Check the upstream." },
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

      <div className="stack" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
              onClose={() => dismiss(b.id)}
            />
          </div>
        ))}
        {list.length === 0 && (
          <Button
            variant="plain"
            size="unstyled"
            type="button"
            onClick={() => setList(INITIAL)}
            style={{
              alignSelf: "flex-start",
              height: 30,
              padding: "0 13px",
              borderRadius: 9,
              border: "1px solid var(--aurora-border-strong)",
              background: "var(--aurora-control-surface)",
              color: "var(--aurora-text-primary)",
              fontFamily: "var(--aurora-font-sans)",
              fontSize: 13,
              fontWeight: 560,
              cursor: "pointer",
            }}
          >
            Replay
          </Button>
        )}
      </div>
    </div>
  );
}
