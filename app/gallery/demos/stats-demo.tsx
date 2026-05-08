"use client";

import * as React from "react";
import { StatCard, StatGrid } from "@/registry/aurora/ui/stat-card";

export default function StatsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--aurora-text-muted)",
            marginBottom: 12,
          }}
        >
          Gateway Metrics
        </p>
        <StatGrid style={{ maxWidth: 700 }}>
          <StatCard
            label="Active Gateways"
            value="7"
            delta="+1 this week"
            deltaPositive={true}
          />
          <StatCard
            label="Requests / min"
            value="1,284"
            delta="stable"
          />
          <StatCard
            label="P99 Latency"
            value="42 ms"
            delta="−6 ms"
            deltaPositive={true}
          />
          <StatCard
            label="Error Rate"
            value="0.12%"
            delta="+0.04%"
            deltaPositive={false}
          />
          <StatCard
            label="Active Agents"
            value="3"
            delta="2 idle"
          />
          <StatCard
            label="Deployed Plugins"
            value="18"
            delta="+2 today"
            deltaPositive={true}
          />
        </StatGrid>
      </div>
    </div>
  );
}
