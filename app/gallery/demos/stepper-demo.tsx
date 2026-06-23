"use client";

import * as React from "react";
import { Stepper } from "@/registry/aurora/ui/stepper";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

export default function StepperDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Aurora Extensions"
        heading="Stepper"
        description="Aurora extension — multi-step progress. A horizontal row of circular step nodes with labels for onboarding, setup, and deployment flows."
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "36px 26px",
          border: "1px solid var(--aurora-border-default)",
          borderRadius: 18,
          background: "var(--aurora-page-bg)",
        }}
      >
        <Stepper
          current={2}
          steps={[
            { label: "Connect" },
            { label: "Configure" },
            { label: "Embed" },
            { label: "Deploy" },
          ]}
        />
      </div>
    </div>
  );
}
