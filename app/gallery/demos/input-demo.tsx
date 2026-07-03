"use client"

import * as React from "react"
import {
  AtSign,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Search,
  Server,
  TriangleAlert,
} from "lucide-react"
import { Input } from "@/registry/aurora/ui/input"
import { Button } from "@/registry/aurora/ui/button"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

// CD dsCard chrome ports: `.lbl` uppercase eyebrow + `.field` constrained column.
const lbl: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--aurora-text-muted)",
  margin: "0 0 10px",
}

const section: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
}

const stack: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  maxWidth: 320,
}

const hint: React.CSSProperties = {
  fontSize: 11,
  lineHeight: 1.4,
  color: "var(--aurora-text-muted)",
  margin: "6px 0 0",
}

const fieldLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "var(--aurora-text-primary)",
  marginBottom: 6,
  display: "block",
}

export default function InputDemo() {
  const [search, setSearch] = React.useState("us-east-prod-01")
  const [secret, setSecret] = React.useState("labby_sk_prod_9f2c11a")
  const [showSecret, setShowSecret] = React.useState(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <GalleryPageIntro
        eyebrow="Form elements"
        heading="Input"
        description="Aurora-styled text input with a cyan focus ring, size variants, leading/trailing adornments, and semantic validation states. Used across gateway settings, run editors, and credential forms."
      />

      {/* SIZES ------------------------------------------------------------ */}
      <div style={section}>
        <div style={lbl}>Sizes</div>
        <div style={stack}>
          <Input size="sm" placeholder="sm — compact rows & toolbars" />
          <Input size="default" placeholder="default — standard forms" />
          <Input size="lg" placeholder="lg — prominent primary fields" />
        </div>
      </div>

      {/* ADORNMENTS ------------------------------------------------------- */}
      <div style={section}>
        <div style={lbl}>Leading &amp; trailing adornments</div>
        <div style={stack}>
          <Input
            startAdornment={<Search size={15} strokeWidth={1.75} />}
            placeholder="Search hosts, tags, or IDs…"
          />
          <Input
            startAdornment={<Server size={15} strokeWidth={1.75} />}
            endAdornment={
              <span style={{ fontSize: 11, color: "var(--aurora-text-muted)" }}>
                :7474
              </span>
            }
            defaultValue="gateway-edge-1"
          />
          <Input
            startAdornment={<AtSign size={15} strokeWidth={1.75} />}
            type="email"
            placeholder="you@example.com"
          />
        </div>
      </div>

      {/* CLEARABLE -------------------------------------------------------- */}
      <div style={section}>
        <div style={lbl}>Clearable</div>
        <div style={stack}>
          <Input
            clearable
            startAdornment={<Search size={15} strokeWidth={1.75} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type to reveal the clear button…"
          />
          <p style={hint}>
            The × appears once the field has a value and drives the real input —
            form libraries see a genuine change event.
          </p>
        </div>
      </div>

      {/* PASSWORD WITH TOGGLE --------------------------------------------- */}
      <div style={section}>
        <div style={lbl}>Password with reveal toggle</div>
        <div style={stack}>
          <Input
            type={showSecret ? "text" : "password"}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            startAdornment={<KeyRound size={15} strokeWidth={1.75} />}
            endAdornment={
              <Button
                variant="plain"
                size="unstyled"
                type="button"
                aria-label={showSecret ? "Hide secret" : "Show secret"}
                onClick={() => setShowSecret((v) => !v)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--aurora-text-muted)",
                }}
              >
                {showSecret ? (
                  <EyeOff size={15} strokeWidth={1.75} />
                ) : (
                  <Eye size={15} strokeWidth={1.75} />
                )}
              </Button>
            }
          />
          <p style={hint}>API keys stay masked until you explicitly reveal them.</p>
        </div>
      </div>

      {/* VALIDATION STATES ------------------------------------------------ */}
      <div style={section}>
        <div style={lbl}>Validation states</div>
        <div style={stack}>
          <div>
            <span style={fieldLabel}>Success</span>
            <Input
              state="success"
              defaultValue="prod-cluster-01"
              endAdornment={
                <Check
                  size={15}
                  strokeWidth={2}
                  style={{ color: "var(--aurora-success)" }}
                />
              }
            />
          </div>

          <div>
            <span style={fieldLabel}>Warning</span>
            <Input
              state="warn"
              defaultValue="staging-legacy"
              endAdornment={
                <TriangleAlert
                  size={15}
                  strokeWidth={1.9}
                  style={{ color: "var(--aurora-warn)" }}
                />
              }
            />
            <p style={hint}>This region is scheduled for deprecation.</p>
          </div>

          <div>
            <span style={fieldLabel}>Error</span>
            <Input state="error" defaultValue="bad token" />
            <p style={{ ...hint, color: "var(--aurora-error)" }}>
              Token failed validation — check the format.
            </p>
          </div>

          <div>
            <span style={fieldLabel}>Error (shorthand)</span>
            <Input error placeholder="required field" />
          </div>
        </div>
      </div>

      {/* NON-INTERACTIVE -------------------------------------------------- */}
      <div style={section}>
        <div style={lbl}>Disabled &amp; read-only</div>
        <div style={stack}>
          <div>
            <span style={fieldLabel}>Disabled</span>
            <Input disabled defaultValue="https://api.labby.io/v1" />
          </div>
          <div>
            <span style={fieldLabel}>Read-only</span>
            <Input
              readOnly
              defaultValue="sk_live_immutable_reference"
              startAdornment={<KeyRound size={15} strokeWidth={1.75} />}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
