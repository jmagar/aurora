"use client";

import * as React from "react";
import { Button } from "@/registry/aurora/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  PillGroup,
  PillTrigger,
} from "@/registry/aurora/ui/tabs";

const GATEWAYS = [
  { id: "gw-01", name: "production-edge.lab.local", env: "prod",    status: "online",   region: "us-east-1",    requests: "14.2k" },
  { id: "gw-02", name: "staging-gw.lab.local",      env: "staging", status: "online",   region: "eu-west-1",    requests: "2.1k" },
  { id: "gw-03", name: "dev-proxy.lab.local",        env: "dev",     status: "degraded", region: "us-west-2",    requests: "341" },
  { id: "gw-04", name: "fra-gw-02.lab.local",        env: "prod",    status: "offline",  region: "eu-central-1", requests: "0" },
];

const ENV_COLOR: Record<string, string> = {
  prod:    "var(--aurora-accent-primary)",
  staging: "var(--aurora-warn)",
  dev:     "var(--aurora-accent-pink)",
};

const STATUS_COLOR: Record<string, string> = {
  online:   "var(--aurora-success)",
  degraded: "var(--aurora-warn)",
  offline:  "var(--aurora-error)",
};

function EnvBadge({ env }: { env: string }) {
  const color = ENV_COLOR[env] ?? "var(--aurora-text-muted)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 7px",
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase" as const,
        color,
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 28%, transparent)`,
        flexShrink: 0,
      }}
    >
      {env}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = STATUS_COLOR[status] ?? "var(--aurora-text-muted)";
  return (
    <span
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

function ActionBtn({ children }: { children: React.ReactNode }) {
  return (
    <Button variant="plain" size="unstyled"
      type="button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "5px 10px",
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
        border: "1px solid var(--aurora-border-default)",
        background: "var(--aurora-control-surface)",
        color: "var(--aurora-text-muted)",
        flexShrink: 0,
      }}
    >
      {children}
    </Button>
  );
}

function GatewayRow({ gw, last }: { gw: (typeof GATEWAYS)[0]; last: boolean }) {
  const action =
    gw.status === "offline" ? "Restart" : gw.status === "degraded" ? "Diagnose" : "Manage";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 20px",
        borderBottom: last ? "none" : "1px solid var(--aurora-border-default)",
      }}
    >
      <EnvBadge env={gw.env} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <StatusDot status={gw.status} />
        <span
          style={{
            fontSize: 13,
            fontFamily: "var(--aurora-font-mono)",
            color: "var(--aurora-accent-pink)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {gw.name}
        </span>
      </div>
      <span style={{ fontSize: 11, color: "var(--aurora-text-muted)", flexShrink: 0 }}>
        {gw.region}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          fontVariantNumeric: "tabular-nums" as const,
          color: "var(--aurora-text-primary)",
          flexShrink: 0,
          minWidth: 44,
          textAlign: "right" as const,
        }}
      >
        {gw.requests}
      </span>
      <ActionBtn>{action}</ActionBtn>
    </div>
  );
}

export default function TabsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--aurora-text-muted)", marginBottom: 6 }}>
          Navigation
        </p>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--aurora-text-primary)", margin: 0 }}>
          Tabs
        </h2>
        <p style={{ fontSize: 13, color: "var(--aurora-text-muted)", marginTop: 6, lineHeight: 1.55 }}>
          Line tabs for page-level navigation; pill toggles for compact in-panel view switching. Both are built on Radix Tabs.
        </p>
      </div>

      {/* Line tabs */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
          Line tabs
        </p>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div style={{ padding: 16, border: "1px solid var(--aurora-border-default)", borderRadius: 12, background: "var(--aurora-panel-medium)" }}>
              <p style={{ fontSize: 13, color: "var(--aurora-text-muted)", margin: 0 }}>
                Gateway overview — health metrics, connected agents, and recent events for production-edge.lab.local.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="logs">
            <div style={{ padding: 16, border: "1px solid var(--aurora-border-default)", borderRadius: 12, background: "var(--aurora-panel-medium)" }}>
              <p style={{ fontSize: 13, fontFamily: "var(--aurora-font-mono)", color: "var(--aurora-accent-pink)", margin: 0 }}>
                [INFO] 2026-05-08T02:14:31Z heartbeat ok latency=4ms
              </p>
            </div>
          </TabsContent>
          <TabsContent value="policies">
            <div style={{ padding: 16, border: "1px solid var(--aurora-border-default)", borderRadius: 12, background: "var(--aurora-panel-medium)" }}>
              <p style={{ fontSize: 13, color: "var(--aurora-text-muted)", margin: 0 }}>
                47 active policy rules across 3 clusters. Last synced 2 minutes ago.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div style={{ padding: 16, border: "1px solid var(--aurora-border-default)", borderRadius: 12, background: "var(--aurora-panel-medium)" }}>
              <p style={{ fontSize: 13, color: "var(--aurora-text-muted)", margin: 0 }}>
                Gateway configuration — TLS, failover policy, log level, and plugin allowlist.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pill toggle */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
          Pill toggle
        </p>
        <PillGroup defaultValue="live">
          <PillTrigger value="live">Live</PillTrigger>
          <PillTrigger value="recent">Recent</PillTrigger>
          <PillTrigger value="errors">Errors</PillTrigger>
        </PillGroup>
      </div>

      {/* Tabs in context */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
          Tabs in context — gateway list panel
        </p>
        <div
          style={{
            border: "1px solid var(--aurora-border-default)",
            borderRadius: 18,
            overflow: "hidden",
            background: "var(--aurora-panel-medium)",
          }}
        >
          <Tabs defaultValue="all">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                borderBottom: "1px solid var(--aurora-border-default)",
              }}
            >
              <TabsList style={{ border: "none", paddingBottom: 0 }}>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="online">Online</TabsTrigger>
                <TabsTrigger value="degraded">Degraded</TabsTrigger>
                <TabsTrigger value="offline">Offline</TabsTrigger>
              </TabsList>
              <ActionBtn>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 1v10M1 6h10" />
                </svg>
                Add gateway
              </ActionBtn>
            </div>
            <TabsContent value="all" style={{ margin: 0 }}>
              <div>
                {GATEWAYS.map((gw, i) => (
                  <GatewayRow key={gw.id} gw={gw} last={i === GATEWAYS.length - 1} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="online" style={{ margin: 0 }}>
              <div>
                {GATEWAYS.filter((g) => g.status === "online").map((gw, i, arr) => (
                  <GatewayRow key={gw.id} gw={gw} last={i === arr.length - 1} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="degraded" style={{ margin: 0 }}>
              <div>
                {GATEWAYS.filter((g) => g.status === "degraded").map((gw, i, arr) => (
                  <GatewayRow key={gw.id} gw={gw} last={i === arr.length - 1} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="offline" style={{ margin: 0 }}>
              <div>
                {GATEWAYS.filter((g) => g.status === "offline").map((gw, i, arr) => (
                  <GatewayRow key={gw.id} gw={gw} last={i === arr.length - 1} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
