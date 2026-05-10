"use client";

import * as React from "react";
import { StatCard, StatGrid } from "@/registry/aurora/ui/stat-card";

export default function StatsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <p
          style={{
            fontSize: "var(--aurora-type-label)",
            fontWeight: "var(--aurora-weight-label)",
            letterSpacing: "var(--aurora-letter-label)",
            color: "var(--aurora-text-muted)",
            marginBottom: 12,
          }}
        >
          Gateway metrics
        </p>
        <StatGrid style={{ maxWidth: 700 }}>
          <StatCard
            label="Active Gateways"
            value="7"
            delta="+1 this week"
            deltaPositive={true}
            description="Healthy edge nodes"
            tone="success"
          />
          <StatCard
            label="Requests / min"
            value="1,284"
            delta="stable"
            description="Five minute average"
            tone="info"
          />
          <StatCard
            label="P99 Latency"
            value="42 ms"
            delta="−6 ms"
            deltaPositive={true}
            description="Across gateway routes"
            tone="success"
          />
          <StatCard
            label="Error Rate"
            value="0.12%"
            delta="+0.04%"
            deltaPositive={false}
            description="Below alert threshold"
            tone="warn"
          />
          <StatCard
            label="Active Agents"
            value="3"
            delta="2 idle"
            description="Runs in progress"
          />
          <StatCard
            label="Deployed Plugins"
            value="18"
            delta="+2 today"
            deltaPositive={true}
            description="Enabled in prod"
            tone="info"
          />
        </StatGrid>
      </div>
    </div>
  );
}
