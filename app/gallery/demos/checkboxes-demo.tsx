"use client";

import * as React from "react";
import { Checkbox } from "@/registry/aurora/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/registry/aurora/ui/radio-group";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

export default function CheckboxesDemo() {
  const [notifyDeploy, setNotifyDeploy] = React.useState(true);
  const [notifyError, setNotifyError] = React.useState(true);
  const [notifyMaint, setNotifyMaint] = React.useState(false);
  const [logLevel, setLogLevel] = React.useState("warn");
  const [failover, setFailover] = React.useState("auto");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Form elements"
        heading="Checkboxes &amp; radio groups"
        description="Aurora-styled selection controls used in gateway settings, policy editors, and notification preferences."
      />

      {/* Checkbox states */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
          Checkbox states
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Checkbox defaultChecked>Checked (default)</Checkbox>
          <Checkbox>Unchecked</Checkbox>
          <Checkbox disabled defaultChecked>Disabled — checked</Checkbox>
          <Checkbox disabled>Disabled — unchecked</Checkbox>
        </div>
      </div>

      {/* Radio states */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
          Radio group states
        </p>
        <RadioGroup defaultValue="b">
          <RadioGroupItem value="a">Option A — automatic failover</RadioGroupItem>
          <RadioGroupItem value="b">Option B — manual approval (selected)</RadioGroupItem>
          <RadioGroupItem value="c" disabled>Option C — disabled (deprecated)</RadioGroupItem>
        </RadioGroup>
      </div>

      {/* Settings panel */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
          Settings panel
        </p>
        <div
          style={{
            maxWidth: 480,
            border: "1px solid var(--aurora-border-default)",
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          {/* Notifications */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--aurora-border-default)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--aurora-text-primary)", margin: "0 0 12px 0" }}>
              Notifications
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Checkbox checked={notifyDeploy} onCheckedChange={setNotifyDeploy}>
                Notify on plugin deployment
              </Checkbox>
              <Checkbox checked={notifyError} onCheckedChange={setNotifyError}>
                Notify on gateway errors
              </Checkbox>
              <Checkbox checked={notifyMaint} onCheckedChange={setNotifyMaint}>
                Notify on scheduled maintenance
              </Checkbox>
            </div>
          </div>

          {/* Log level */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--aurora-border-default)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--aurora-text-primary)", margin: "0 0 12px 0" }}>
              Log level
            </p>
            <RadioGroup value={logLevel} onValueChange={setLogLevel}>
              <RadioGroupItem value="debug">Debug — verbose output</RadioGroupItem>
              <RadioGroupItem value="info">Info — standard events</RadioGroupItem>
              <RadioGroupItem value="warn">Warn — warnings and above</RadioGroupItem>
              <RadioGroupItem value="error">Error — errors only</RadioGroupItem>
            </RadioGroup>
          </div>

          {/* Failover policy */}
          <div style={{ padding: "16px 20px" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--aurora-text-primary)", margin: "0 0 12px 0" }}>
              Failover policy
            </p>
            <RadioGroup value={failover} onValueChange={setFailover}>
              <RadioGroupItem value="auto">Automatic — Labby decides</RadioGroupItem>
              <RadioGroupItem value="manual">Manual — require operator approval</RadioGroupItem>
              <RadioGroupItem value="none" disabled>Disabled — no failover (deprecated)</RadioGroupItem>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
