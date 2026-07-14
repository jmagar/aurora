"use client";

import * as React from "react";
import { InputGroup, InputGroupAddon } from "@/registry/aurora/ui/input-group";
import { Input } from "@/registry/aurora/ui/input";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

// CD dsCard chrome: the bare input that sits inside the group's single outline.
const bareInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  alignSelf: "stretch",
  background: "none",
  border: "none",
  outline: "none",
  color: "var(--aurora-text-primary)",
  font: "13px var(--aurora-font-sans)",
  padding: "0 12px",
};

export default function InputGroupDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Form elements"
        heading="Input Group"
        description="Input plus addons sharing one outline — for prefixes, suffixes, and bracketed units."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 460 }}>
        {/* Leading addon — protocol prefix */}
        <InputGroup style={{ height: 40 }}>
          <InputGroupAddon>https://</InputGroupAddon>
          <Input unstyled style={bareInputStyle} defaultValue="labby.local:8765" aria-label="Host" />
        </InputGroup>

        {/* Leading + trailing addon — currency amount */}
        <InputGroup style={{ height: 40 }}>
          <InputGroupAddon>$</InputGroupAddon>
          <Input unstyled style={bareInputStyle} placeholder="Amount" aria-label="Amount" />
          <InputGroupAddon
            style={{ borderRight: "none", borderLeft: "1px solid var(--aurora-border-default)" }}
          >
            USD
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}
