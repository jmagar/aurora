"use client"

import { Combobox } from "@/registry/aurora/ui/combobox"

export default function ComboboxDemo() {
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
        defaultOpen
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
