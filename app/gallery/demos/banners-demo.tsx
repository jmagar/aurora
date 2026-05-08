"use client";

import * as React from "react";
import { Banner } from "@/registry/aurora/ui/banner";

function ActionLink({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: "var(--aurora-accent-primary)",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        textDecoration: "underline",
        textUnderlineOffset: 2,
      }}
    >
      {children}
    </button>
  );
}

export default function BannersDemo() {
  const [dismissed, setDismissed] = React.useState<Record<string, boolean>>({});

  function dismiss(id: string) {
    setDismissed((prev) => ({ ...prev, [id]: true }));
  }

  const allDismissed = dismissed["a1-info"] && dismissed["a1-warn"] && dismissed["a1-error"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--aurora-text-muted)", marginBottom: 6 }}>
          Feedback
        </p>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--aurora-text-primary)", margin: 0 }}>
          Banners
        </h2>
        <p style={{ fontSize: 13, color: "var(--aurora-text-muted)", marginTop: 6, lineHeight: 1.55 }}>
          Contextual banners surface system-level notices, warnings, and errors inline. Style A1 (elevated) is used for persistent alerts; Style C (inline tag) fits dense panel headers.
        </p>
      </div>

      {/* Style A1 — Elevated */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
          Style A1 — Elevated with glow dot &amp; dismiss
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {!dismissed["a1-info"] && (
            <Banner
              variant="elevated"
              status="info"
              title="Plugin sync in progress"
              description="Fetching plugin manifests from registry.lab.local — this may take up to 30 seconds."
              onDismiss={() => dismiss("a1-info")}
              action={<ActionLink>View plugin registry</ActionLink>}
            />
          )}
          {!dismissed["a1-warn"] && (
            <Banner
              variant="elevated"
              status="warn"
              title="TLS certificate expiring soon"
              description="The certificate for production-edge.lab.local expires in 7 days. Renew before it causes a service outage."
              onDismiss={() => dismiss("a1-warn")}
              action={<ActionLink>Renew certificate</ActionLink>}
            />
          )}
          {!dismissed["a1-error"] && (
            <Banner
              variant="elevated"
              status="error"
              title="Gateway unreachable — us-east-1-gw-02"
              description="No health-check response for 3 minutes. Automatic failover to us-east-1-gw-03 is active."
              onDismiss={() => dismiss("a1-error")}
              action={<ActionLink>View diagnostics</ActionLink>}
            />
          )}
          {allDismissed && (
            <div
              style={{
                padding: "12px 16px",
                border: "1.5px dashed var(--aurora-border-default)",
                borderRadius: 14,
                fontSize: 13,
                color: "var(--aurora-text-muted)",
              }}
            >
              All banners dismissed.{" "}
              <button
                type="button"
                onClick={() => setDismissed({})}
                style={{ color: "var(--aurora-accent-primary)", background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: 0, fontWeight: 600 }}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Style C — Inline tag */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
          Style C — Inline tag
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Banner
            variant="tag"
            status="info"
            title="Scheduled maintenance window active"
            description="Ends at 03:00 UTC"
          />
          <Banner
            variant="tag"
            status="warn"
            title="High CPU on us-west-2-gw-01"
            description="92% for 8 min"
            action={<ActionLink>Scale up</ActionLink>}
          />
          <Banner
            variant="tag"
            status="error"
            title="Auth service degraded — token issuance failing"
            action={<ActionLink>Incident #4412</ActionLink>}
          />
        </div>
      </div>
    </div>
  );
}
