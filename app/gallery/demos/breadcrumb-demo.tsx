"use client";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/aurora/ui/breadcrumb";

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
        {label}
      </p>
      <div
        style={{
          padding: "16px 20px",
          border: "1px solid var(--aurora-border-default)",
          borderRadius: 14,
          background: "var(--aurora-panel-medium)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function BreadcrumbDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--aurora-text-muted)", marginBottom: 6 }}>
          Navigation
        </p>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--aurora-text-primary)", margin: 0 }}>
          Breadcrumbs
        </h2>
        <p style={{ fontSize: 13, color: "var(--aurora-text-muted)", marginTop: 6, lineHeight: 1.55 }}>
          Three styles for navigating Labby hierarchy. The active page supports a badge left of the label to surface environment or version context.
        </p>
      </div>

      {/* Default — chevron */}
      <Panel label="Default — chevron separator">
        <Breadcrumb variant="default">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Gateways</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">us-east-1</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage badge="prod">production-edge.lab.local</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Panel>

      {/* Mono — dot separator */}
      <Panel label="Mono — dot separator">
        <Breadcrumb variant="mono">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">agents</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">labby-auth-proxy</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage badge="v2.1">config.yaml</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Panel>

      {/* Pill trail — no separator */}
      <Panel label="Pill trail — no separator">
        <Breadcrumb variant="pill-trail">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Environments</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Production</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage badge="live">Plugins</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Panel>

      {/* Deep nesting example */}
      <Panel label="Deep nesting — with badge on current page">
        <Breadcrumb variant="default">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Labby</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Clusters</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">eu-central-1</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Gateways</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage badge="degraded">fra-gw-03.lab.local</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Panel>
    </div>
  );
}
