"use client";

import * as React from "react";
import { Skeleton, SkeletonRow } from "@/registry/aurora/ui/skeleton";

export default function SkeletonDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--aurora-text-muted)", marginBottom: 6 }}>
          Loading
        </p>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--aurora-text-primary)", margin: 0 }}>
          Skeletons
        </h2>
        <p style={{ fontSize: 13, color: "var(--aurora-text-muted)", marginTop: 6, lineHeight: 1.55 }}>
          Shimmer placeholders that preserve layout during data fetches. Used in gateway lists, card grids, and data tables across Labby.
        </p>
      </div>

      {/* List skeleton */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
          List rows — avatar + text + button
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid var(--aurora-border-default)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                padding: "12px 16px",
                borderBottom: i < 2 ? "1px solid var(--aurora-border-default)" : "none",
              }}
            >
              <SkeletonRow />
            </div>
          ))}
        </div>
      </div>

      {/* Card grid skeleton */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
          Card grid
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                padding: 16,
                border: "1px solid var(--aurora-border-default)",
                borderRadius: 14,
                background: "var(--aurora-panel-medium)",
              }}
            >
              <Skeleton variant="card" />
              <Skeleton variant="title" style={{ width: "75%" }} />
              <Skeleton variant="text" style={{ width: "90%" }} />
              <Skeleton variant="text" style={{ width: "60%" }} />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Skeleton variant="button" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table skeleton */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
          Table
        </p>
        <div
          style={{
            border: "1px solid var(--aurora-border-default)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 80px",
              gap: 16,
              padding: "10px 16px",
              borderBottom: "1px solid var(--aurora-border-default)",
              background: "var(--aurora-panel-strong)",
            }}
          >
            <Skeleton variant="text" style={{ width: "50%", height: 10 }} />
            <Skeleton variant="text" style={{ width: "60%", height: 10 }} />
            <Skeleton variant="text" style={{ width: "45%", height: 10 }} />
            <Skeleton variant="text" style={{ width: "70%", height: 10 }} />
          </div>
          {/* Rows */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 80px",
                gap: 16,
                padding: "12px 16px",
                alignItems: "center",
                borderBottom: i < 4 ? "1px solid var(--aurora-border-default)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Skeleton variant="avatar" style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0 }} />
                <Skeleton variant="text" style={{ flex: 1, maxWidth: 160 }} />
              </div>
              <Skeleton variant="text" style={{ width: "70%" }} />
              <Skeleton variant="text" style={{ width: "55%" }} />
              <Skeleton variant="button" style={{ width: 64, height: 28 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
