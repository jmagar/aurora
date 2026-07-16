"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { DescriptionItem, DescriptionList } from "@/registry/aurora/ui/description-list"

// CD-parity composition for the DescriptionList component: a four-row label/value
// list describing a gateway (Gateway / Status / Region / Version) with the Status
// row highlighted as the active/selected surface, matching the Claude Design source.
export default function DescriptionListDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="Components / description list"
        heading="Description List"
        description="Label and value rows with a cyan accent marker and a highlighted active row."
      />
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          justifyContent: "center",
          padding: "26px 30px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <DescriptionList>
          <DescriptionItem
            label="Gateway"
            value="labby.local:8765"
          />
          <DescriptionItem active label="Status" value="Healthy · 200 OK" />
          <DescriptionItem label="Region" value="us-east · edge-1" />
          <DescriptionItem label="Version" value="v0.9.4" />
        </DescriptionList>
      </section>
    </div>
  )
}
