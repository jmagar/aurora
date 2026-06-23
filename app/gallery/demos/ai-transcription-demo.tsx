"use client";

import * as React from "react";
import { Transcription } from "@/registry/aurora/blocks/ai/elements/transcription";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

export default function AiTranscriptionDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Transcription"
        description="A live transcript panel — a mic-labelled header with a pink LIVE indicator above a stack of segment rows. Each row pairs a cyan timecode and uppercase speaker with the transcript text and a status pill: a teal confidence badge, or a pink LIVE pill (with a pink accent bar) for the streaming segment."
      />

      <div style={{ maxWidth: 500 }}>
        <Transcription
          segments={[
            {
              speaker: "Operator",
              timecode: "00:02",
              text: "Deploy the gateway.",
              confidence: 98,
            },
            {
              speaker: "Axon",
              timecode: "00:05",
              text: "Rolling 3 replicas now.",
            },
          ]}
        />
      </div>
    </div>
  );
}
