"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button";
import { GalleryPageIntro } from "@/components/gallery-page-intro";
import { Input } from "@/registry/aurora/ui/input"
import { Textarea } from "@/registry/aurora/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/aurora/ui/select"

const section: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: "clamp(16px, 4vw, 32px)",
  background: "var(--aurora-panel-medium)",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--aurora-radius-2)",
}

const groupLabel: React.CSSProperties = {
  fontSize: "11px",
  fontFamily: "var(--aurora-font-mono)",
  color: "var(--aurora-text-muted)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "4px",
}

const fieldLabel: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 500,
  color: "var(--aurora-text-primary)",
  fontFamily: "var(--aurora-font-sans)",
  marginBottom: "6px",
  display: "block",
}

const helperText: React.CSSProperties = {
  fontSize: "11px",
  color: "var(--aurora-text-muted)",
  fontFamily: "var(--aurora-font-mono)",
  marginTop: "5px",
  display: "block",
}

const errorText: React.CSSProperties = {
  fontSize: "11px",
  color: "var(--aurora-error)",
  fontFamily: "var(--aurora-font-mono)",
  marginTop: "5px",
  display: "block",
}

const grid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))",
  gap: "16px",
}

const heading: React.CSSProperties = {
  fontSize: "18px",
  fontFamily: "var(--aurora-font-display)",
  fontWeight: 600,
  color: "var(--aurora-text-primary)",
  marginBottom: "4px",
}

const subheading: React.CSSProperties = {
  fontSize: "13px",
  color: "var(--aurora-text-muted)",
  fontFamily: "var(--aurora-font-sans)",
  marginBottom: "24px",
}

const divider: React.CSSProperties = {
  height: "1px",
  background: "var(--aurora-border-default)",
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5l2.5 2.5" />
    </svg>
  )
}

function KeyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="8" r="3.5" />
      <path d="M9.5 8h5M12.5 8v2" />
    </svg>
  )
}

function UrlIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 9.5a3.5 3.5 0 0 0 5 0l1-1a3.5 3.5 0 0 0-5-5L6.5 4.5" />
      <path d="M9.5 6.5a3.5 3.5 0 0 0-5 0l-1 1a3.5 3.5 0 0 0 5 5l1-1" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="6" width="8" height="8" rx="2" />
      <path d="M4 10H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" />
    </svg>
  )
}

function ErrorInput(props: React.ComponentPropsWithoutRef<typeof Input>) {
  return (
    <Input
      {...props}
      style={{ borderColor: "var(--aurora-error)", ...props.style }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = [
          "0 0 0 3px color-mix(in srgb, #c78490 22%, transparent)",
          "0 0 0 1px color-mix(in srgb, #c78490 45%, transparent)",
        ].join(", ")
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = "none"
        e.currentTarget.style.borderColor = "var(--aurora-error)"
        props.onBlur?.(e)
      }}
    />
  )
}

export default function FormsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <GalleryPageIntro
        eyebrow="Form elements"
        heading="Forms"
        description="Input, Select, and Textarea across all states: default, focused, error, and disabled. Includes adornments, helper text, and real form layouts."
      />

      <div style={section}>
        <div style={groupLabel}>Input — states</div>
        <div style={grid2}>
          <div>
            <label htmlFor="default-input" style={fieldLabel}>Gateway name</label>
            <Input id="default-input" placeholder="e.g. us-east-prod-01" />
            <span style={helperText}>Unique identifier for this gateway instance</span>
          </div>
          <div>
            <label htmlFor="filled-input" style={fieldLabel}>Environment</label>
            <Input id="filled-input" defaultValue="production" />
            <span style={helperText}>Deployment target environment</span>
          </div>
          <div>
            <label htmlFor="error-input" style={fieldLabel}>Agent token</label>
            <ErrorInput id="error-input" defaultValue="labby_tk_invalid" aria-invalid="true" />
            <span style={errorText}>Token format is invalid — must start with labby_tk_</span>
          </div>
          <div>
            <label htmlFor="disabled-input" style={{ ...fieldLabel, opacity: 0.5 }}>API endpoint</label>
            <Input id="disabled-input" defaultValue="https://api.labby.io/v1" disabled />
            <span style={{ ...helperText, opacity: 0.5 }}>Managed by platform — read only</span>
          </div>
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Input — adornments</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label htmlFor="search-input" style={fieldLabel}>Search agents</label>
            <Input id="search-input" placeholder="Search by name, ID, or tag…" startAdornment={<SearchIcon />} />
          </div>
          <div style={grid2}>
            <div>
              <label htmlFor="api-key-input" style={fieldLabel}>API key</label>
              <Input id="api-key-input" type="password" defaultValue="labby_sk_prod_xxxxxxxxxxxxxx" startAdornment={<KeyIcon />} endAdornment={<CopyIcon />} />
              <span style={helperText}>Secret key — never share externally</span>
            </div>
            <div>
              <label htmlFor="webhook-url" style={fieldLabel}>Webhook URL</label>
              <Input id="webhook-url" placeholder="https://hooks.example.com/labby" startAdornment={<UrlIcon />} />
              <span style={helperText}>POST target for gateway events</span>
            </div>
          </div>
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Select — states</div>
        <div style={grid2}>
          <div>
            <label htmlFor="region-select" style={fieldLabel}>Region</label>
            <Select defaultValue="us-east-1">
              <SelectTrigger id="region-select">
                <SelectValue placeholder="Select region…" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Americas</SelectLabel>
                  <SelectItem value="us-east-1">us-east-1</SelectItem>
                  <SelectItem value="us-west-2">us-west-2</SelectItem>
                  <SelectItem value="ca-central-1">ca-central-1</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Europe</SelectLabel>
                  <SelectItem value="eu-west-1">eu-west-1</SelectItem>
                  <SelectItem value="eu-central-1">eu-central-1</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Asia Pacific</SelectLabel>
                  <SelectItem value="ap-south-1">ap-south-1</SelectItem>
                  <SelectItem value="ap-southeast-1">ap-southeast-1</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <span style={helperText}>Gateway deployment region</span>
          </div>
          <div>
            <label htmlFor="tier-select" style={fieldLabel}>Agent tier</label>
            <Select>
              <SelectTrigger id="tier-select">
                <SelectValue placeholder="Select tier…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <span style={helperText}>Determines compute and rate limits</span>
          </div>
          <div>
            <label htmlFor="log-level-select" style={fieldLabel}>Log level</label>
            <Select defaultValue="info">
              <SelectTrigger id="log-level-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warn">Warn</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="trace">Trace</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label style={{ ...fieldLabel, opacity: 0.5 }}>Protocol</label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="HTTPS (enforced)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="https">HTTPS</SelectItem>
              </SelectContent>
            </Select>
            <span style={{ ...helperText, opacity: 0.5 }}>Enforced by platform policy</span>
          </div>
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Textarea — states</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label htmlFor="system-prompt" style={fieldLabel}>System prompt</label>
            <Textarea id="system-prompt" placeholder="You are a helpful gateway agent responsible for routing requests…" rows={4} />
            <span style={helperText}>Instructions given to the agent at session start</span>
          </div>
          <div style={grid2}>
            <div>
              <label htmlFor="notes-filled" style={fieldLabel}>Deployment notes</label>
              <Textarea id="notes-filled" defaultValue={"Promoted from staging on 2026-05-07.\nAll smoke tests passing.\nRollback target: v2.1.4"} rows={3} />
            </div>
            <div>
              <label htmlFor="notes-disabled" style={{ ...fieldLabel, opacity: 0.5 }}>Audit log excerpt</label>
              <Textarea id="notes-disabled" defaultValue={"[2026-05-07 14:32:01] Agent started\n[2026-05-07 14:32:03] Gateway connected\n[2026-05-07 14:32:05] Ready"} rows={3} disabled />
              <span style={{ ...helperText, opacity: 0.5 }}>Read-only — generated by platform</span>
            </div>
          </div>
          <div>
            <label htmlFor="textarea-error" style={fieldLabel}>Environment config (YAML)</label>
            <Textarea id="textarea-error" defaultValue={"gateway:\n  region: invalid-region\n  tier: enterprise\n  tls: true"} rows={5} style={{ borderColor: "var(--aurora-error)" }} />
            <span style={errorText}>Invalid region: &quot;invalid-region&quot; is not a supported deployment target</span>
          </div>
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Full form — provision new gateway</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={grid2}>
            <div>
              <label htmlFor="gw-name" style={fieldLabel}>
                Gateway name <span style={{ color: "var(--aurora-error)" }}>*</span>
              </label>
              <Input id="gw-name" placeholder="e.g. prod-gateway-01" />
            </div>
            <div>
              <label htmlFor="gw-display" style={fieldLabel}>Display name</label>
              <Input id="gw-display" placeholder="Production Gateway" />
            </div>
          </div>
          <div style={grid2}>
            <div>
              <label htmlFor="gw-region" style={fieldLabel}>
                Region <span style={{ color: "var(--aurora-error)" }}>*</span>
              </label>
              <Select>
                <SelectTrigger id="gw-region">
                  <SelectValue placeholder="Select region…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Americas</SelectLabel>
                    <SelectItem value="us-east-1">us-east-1</SelectItem>
                    <SelectItem value="us-west-2">us-west-2</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Europe</SelectLabel>
                    <SelectItem value="eu-west-1">eu-west-1</SelectItem>
                    <SelectItem value="eu-central-1">eu-central-1</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="gw-tier" style={fieldLabel}>
                Tier <span style={{ color: "var(--aurora-error)" }}>*</span>
              </label>
              <Select defaultValue="professional">
                <SelectTrigger id="gw-tier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label htmlFor="gw-webhook" style={fieldLabel}>Webhook URL</label>
            <Input id="gw-webhook" placeholder="https://hooks.example.com/labby-events" startAdornment={<UrlIcon />} />
            <span style={helperText}>Receives gateway lifecycle events (optional)</span>
          </div>
          <div>
            <label htmlFor="gw-notes" style={fieldLabel}>Notes</label>
            <Textarea id="gw-notes" placeholder="Describe the purpose and configuration of this gateway…" rows={3} />
          </div>
          <div style={divider} />
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <Button variant="plain" size="unstyled"
              style={{
                height: "36px",
                padding: "0 16px",
                borderRadius: "14px",
                border: "1px solid var(--aurora-border-strong)",
                background: "linear-gradient(180deg, rgba(23,54,75,0.6) 0%, rgba(12,26,36,0.8) 100%)",
                color: "var(--aurora-text-primary)",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "var(--aurora-font-sans)",
                cursor: "pointer",
              }}
            >
              Cancel
            </Button>
            <Button variant="plain" size="unstyled"
              style={{
                height: "36px",
                padding: "0 16px",
                borderRadius: "14px",
                border: "1px solid transparent",
                background: "linear-gradient(180deg, #4dc8fa 0%, #1da8e6 100%)",
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "var(--aurora-font-sans)",
                cursor: "pointer",
                boxShadow: [
                  "inset 0 1px 0 rgba(255,255,255,0.25)",
                  "0 0 0 1px color-mix(in srgb, #29b6f6 40%, transparent)",
                  "0 2px 12px color-mix(in srgb, #29b6f6 30%, transparent)",
                ].join(", "),
              }}
            >
              Provision gateway
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
