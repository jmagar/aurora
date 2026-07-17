"use client";

import { Bot, CircleAlert, Info, ShieldCheck, TriangleAlert, WifiOff } from "lucide-react";
import { Callout } from "@/registry/aurora/ui/callout";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

export default function CalloutDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <GalleryPageIntro
        eyebrow="Components"
        heading="Callout"
        description="A status message with a left accent bar. Each tone carries a small glowing dot, a bold title, and a tinted surface keyed to its semantic color — info, success, and warn shown here."
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 520,
        }}
      >
        <Callout variant="info" title="Heads up" icon={<Info size={16} strokeWidth={1.75} />}>
          Crawl depth is capped at 4 for this workspace.
        </Callout>
        <Callout variant="success" title="Indexed" icon={<ShieldCheck size={16} strokeWidth={1.75} />}>
          642 pages · 4 198 chunks now searchable.
        </Callout>
        <Callout variant="warn" title="Rate limited" icon={<TriangleAlert size={16} strokeWidth={1.75} />}>
          Backing off docs.rs for 2s.
        </Callout>
        <Callout variant="error" title="Connection failed" icon={<WifiOff size={16} strokeWidth={1.75} />}>
          The upstream API is unreachable. Check credentials before retrying.
        </Callout>
        <Callout variant="neutral" title="Queued" icon={<CircleAlert size={16} strokeWidth={1.75} />}>
          Waiting for the next available runner slot.
        </Callout>
        <Callout variant="rose" title="Agent handoff" icon={<Bot size={16} strokeWidth={1.75} />}>
          This workspace will ask for human confirmation before publishing.
        </Callout>
      </div>
    </div>
  );
}
