"use client";

import * as React from "react";
import { Button } from "@/registry/aurora/ui/button";
import { Stepper } from "@/registry/aurora/ui/stepper";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

export default function StepperDemo() {
  const steps = [
    { label: "Connect", description: "Authorize the workspace." },
    { label: "Configure", description: "Pick the target service." },
    { label: "Embed", description: "Install the generated component." },
    { label: "Deploy", description: "Ship the update to production." },
  ];
  const [current, setCurrent] = React.useState(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Aurora Extensions"
        heading="Stepper"
        description="Aurora extension for workflow progress, with complete, active, and upcoming states exercised live."
      />

      <div
        style={{
          display: "grid",
          gap: 18,
          padding: "36px 26px",
          border: "1px solid var(--aurora-border-default)",
          borderRadius: 18,
          background: "var(--aurora-page-bg)",
        }}
      >
        <Stepper current={current} steps={steps} />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="neutral"
            size="sm"
            type="button"
            onClick={() => setCurrent((value) => Math.max(value - 1, 0))}
            disabled={current === 0}
          >
            Back
          </Button>
          <Button
            variant="aurora"
            size="sm"
            type="button"
            onClick={() =>
              setCurrent((value) => Math.min(value + 1, steps.length - 1))
            }
            disabled={current === steps.length - 1}
          >
            Next
          </Button>
          <Button variant="plain" size="sm" type="button" onClick={() => setCurrent(0)}>
            Reset
          </Button>
        </div>

        <p className="aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)", margin: 0 }}>
          Current step: {steps[current].label}
        </p>
      </div>
    </div>
  );
}
