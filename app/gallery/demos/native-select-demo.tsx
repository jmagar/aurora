"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Combobox } from "@/registry/aurora/ui/combobox"
import { NativeSelect } from "@/registry/aurora/ui/native-select"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/aurora/ui/select"

const section: React.CSSProperties = {
  display: "grid",
  gap: 24,
}

const cardGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 320px))",
  gap: 16,
}

const card: React.CSSProperties = {
  display: "grid",
  gap: 12,
  padding: 18,
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--aurora-radius-2)",
  background: "var(--aurora-panel-medium)",
  boxShadow: "var(--aurora-shadow-medium), inset 0 1px 0 rgba(255,255,255,0.04)",
}

const label: React.CSSProperties = {
  display: "grid",
  gap: 6,
  color: "var(--aurora-text-muted)",
  fontFamily: "var(--aurora-font-sans)",
  fontSize: "var(--aurora-type-label)",
  fontWeight: 650,
}

const helper: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.55,
  color: "var(--aurora-text-muted)",
}

const valueNote: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.45,
  color: "var(--aurora-text-primary)",
}

export default function NativeSelectDemo() {
  const [runtime, setRuntime] = React.useState("server")
  const [channel, setChannel] = React.useState("stable")
  const [source, setSource] = React.useState("")
  const [status, setStatus] = React.useState("active")
  const [component, setComponent] = React.useState("button")

  return (
    <div style={section}>
      <GalleryPageIntro
        eyebrow="Form elements"
        heading="Native select"
        description="Use the native select when you want the operating system menu and browser-managed interaction. Reach for Select or Combobox when you need a custom Aurora dropdown instead."
      />

      <div style={cardGrid}>
        <div style={card}>
          <label htmlFor="native-runtime" style={label}>
            Runtime target
            <NativeSelect
              id="native-runtime"
              name="runtime-target"
              value={runtime}
              onChange={(event) => setRuntime(event.target.value)}
              autoComplete="off"
            >
              <option value="server">Remote Dolt server</option>
              <option value="embedded">Embedded Dolt</option>
              <option value="shared">Shared local server</option>
            </NativeSelect>
          </label>
          <p style={helper}>Best when the system menu itself is a feature, not something you need to restyle.</p>
          <p style={valueNote}>Selected value: {runtime}</p>
        </div>

        <div style={card}>
          <label htmlFor="native-channel" style={label}>
            Release channel
            <NativeSelect
              id="native-channel"
              name="release-channel"
              value={channel}
              onChange={(event) => setChannel(event.target.value)}
              autoComplete="off"
            >
              <option value="stable">Stable</option>
              <option value="preview">Preview</option>
              <option value="nightly">Nightly</option>
            </NativeSelect>
          </label>
          <p style={helper}>This stays intentionally compact so it reads like a control, not a full-width panel.</p>
          <p style={valueNote}>Selected value: {channel}</p>
        </div>

        <div style={card}>
          <label htmlFor="native-source" style={label}>
            Registry source
            <NativeSelect
              id="native-source"
              name="registry-source"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              placeholder="Select a source…"
              autoComplete="off"
            >
              <option value="local">Local registry</option>
              <option value="remote">Remote registry</option>
              <option value="marketplace">Marketplace index</option>
            </NativeSelect>
          </label>
          <p style={helper}>Placeholder text makes the empty state obvious before a choice has been made.</p>
          <p style={valueNote}>Selected value: {source || "No source selected yet"}</p>
        </div>
      </div>

      <div style={cardGrid}>
        <div style={card}>
          <label style={label}>
            Aurora Select
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="degraded">Degraded</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <p style={helper}>Use this when the dropdown itself needs Aurora styling, richer states, and clearer active feedback.</p>
          <p style={valueNote}>Selected value: {status}</p>
        </div>

        <div style={card}>
          <label style={label}>
            Aurora Combobox
            <Combobox
              value={component}
              onValueChange={setComponent}
              options={[
                { value: "button", label: "Button" },
                { value: "sheet", label: "Sheet" },
                { value: "menubar", label: "Menubar" },
                { value: "breadcrumb", label: "Breadcrumb" },
              ]}
              placeholder="Find a component"
            />
          </label>
          <p style={helper}>Use this when search matters and the option list is too long for a native menu.</p>
          <p style={valueNote}>Selected value: {component}</p>
        </div>
      </div>
    </div>
  )
}
