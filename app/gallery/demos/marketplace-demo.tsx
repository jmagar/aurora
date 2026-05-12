"use client"

import * as React from "react"
import { Marketplace } from "@/registry/aurora/blocks/workspace/marketplace/marketplace"

export default function MarketplaceDemo() {
  return (
    <div style={{ display: "grid", gap: 24, padding: 0, width: "100%" }}>
      <Marketplace readOnlyPreview />
    </div>
  )
}
