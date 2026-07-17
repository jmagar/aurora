"use client"

import { Combobox } from "@/registry/aurora/ui/combobox"
import { usePreviewPoster } from "@/lib/preview-poster"

export default function ComboboxDemo() {
  // Open, Combobox autofocuses its input; in a catalog tile that yanks scroll.
  const poster = usePreviewPoster()
  return (
    <section
      className="grid gap-4 rounded-[var(--aurora-radius-2)] border p-5"
      style={{
        background: "var(--aurora-panel-strong)",
        borderColor: "var(--aurora-border-strong)",
        boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
      }}
    >
      <Combobox
        defaultOpen={!poster}
        defaultValue="labby"
        placeholder="Pick a server…"
        options={[
          { value: "labby", label: "labby" },
          { value: "axon", label: "axon" },
          { value: "syslog", label: "syslog" },
          { value: "rustify", label: "rustify" },
          { value: "gotify", label: "gotify" },
        ]}
      />
    </section>
  )
}
