"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/aurora/ui/input-group"

export default function InputGroupDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Form elements"
        heading="Input Group"
        description="Input plus addons sharing one outline — for prefixes, suffixes, and bracketed units."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 460 }}>
        <InputGroup style={{ height: 40 }}>
          <InputGroupAddon>https://</InputGroupAddon>
          <InputGroupInput defaultValue="labby.local:8765" aria-label="Host" />
        </InputGroup>

        <InputGroup style={{ height: 40 }}>
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="Amount" aria-label="Amount" />
          <InputGroupAddon align="inline-end">USD</InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  )
}
