"use client";

import * as React from "react";
import { Checkbox } from "@/registry/aurora/ui/checkbox";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

function Row({
  defaultChecked,
  children,
}: {
  defaultChecked: boolean;
  children: React.ReactNode;
}) {
  const [on, setOn] = React.useState(defaultChecked);
  return (
    <label
      onClick={(e) => {
        e.preventDefault();
        setOn(!on);
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 15,
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      <Checkbox checked={on} onCheckedChange={setOn} />
      {children}
    </label>
  );
}

export default function CheckboxDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Components"
        heading="Checkbox"
        description="Accent fill + glow. A controlled checkbox with a cyan accent fill, soft glow, and animated checkmark."
      />

      <div>
        <Row defaultChecked>Color-code by operation</Row>
        <Row defaultChecked>Stream tokens</Row>
        <Row defaultChecked={false}>Compact density</Row>
      </div>
    </div>
  );
}
