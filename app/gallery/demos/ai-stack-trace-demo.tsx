"use client";

import * as React from "react";
import { StackTrace } from "@/registry/aurora/blocks/ai/elements/stack-trace";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

export default function AiStackTraceDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Stack trace"
        description="An error stack-trace panel — a rose-tinted alert tile and the error message header, then numbered frames. App frames lead with a cyan function name; vendor frames (anything under node_modules) are dimmed and tagged VENDOR. Each frame resolves to its file:line:column origin."
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 11,
          maxWidth: 480,
        }}
      >
        <StackTrace
          error="TypeError: cannot read 'id' of undefined"
          frames={[
            { fn: "resolveSession", file: "src/gateway/session.ts", line: 142, column: 18 },
            { fn: "handleRequest", file: "src/gateway/router.ts", line: 88, column: 7 },
            { fn: "Layer.handle", file: "node_modules/express/lib/router/layer.js", line: 95, column: 5 },
            { fn: "next", file: "node_modules/express/lib/router/route.js", line: 144, column: 13 },
          ]}
        />
      </div>
    </div>
  );
}
