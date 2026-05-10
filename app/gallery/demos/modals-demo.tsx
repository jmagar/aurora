"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/registry/aurora/ui/dialog";
import { Button } from "@/registry/aurora/ui/button";
import { RadioGroup, RadioGroupItem } from "@/registry/aurora/ui/radio-group";

// ---------------------------------------------------------------------------
// Delete Gateway Dialog
// ---------------------------------------------------------------------------

function DeleteGatewayDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete gateway
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete production-edge?</DialogTitle>
          <DialogDescription>
            This will permanently remove the{" "}
            <span
              style={{
                fontFamily: "var(--aurora-font-mono, monospace)",
                color: "var(--aurora-text-primary)",
              }}
            >
              production-edge
            </span>{" "}
            gateway and all associated route configurations. Traffic currently
            routed through it will be dropped immediately. This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="neutral" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Yes, delete gateway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Deploy to Production Dialog
// ---------------------------------------------------------------------------

function DeployDialog() {
  const [open, setOpen] = React.useState(false);
  const [env, setEnv] = React.useState("production");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="aurora" size="sm">
          Deploy to production
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deploy v2.5.0-rc</DialogTitle>
          <DialogDescription>
            Select the target environment. A rolling deployment will be
            initiated and health checks run before traffic is shifted.
          </DialogDescription>
        </DialogHeader>

        <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <label
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--aurora-text-muted)",
            }}
          >
            Target environment
          </label>
          <RadioGroup value={env} onValueChange={setEnv} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["production", "staging", "dev-local"].map((e) => (
              <div
                key={e}
                onClick={() => setEnv(e)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${env === e ? "var(--aurora-accent-primary)" : "var(--aurora-border-default)"}`,
                  background:
                    env === e
                      ? "color-mix(in srgb, var(--aurora-accent-primary) 8%, transparent)"
                      : "transparent",
                  fontSize: 13,
                  color: "var(--aurora-text-primary)",
                }}
              >
                <RadioGroupItem value={e} />
                <span
                  style={{
                    fontFamily: "var(--aurora-font-mono, monospace)",
                    fontSize: 12,
                  }}
                >
                  {e}
                </span>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="neutral" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="aurora"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Deploy to {env}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Unsaved Changes Dialog
// ---------------------------------------------------------------------------

function UnsavedChangesDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="neutral" size="sm">
          Unsaved changes
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Discard unsaved changes?</DialogTitle>
          <DialogDescription>
            You have unsaved edits to the{" "}
            <span
              style={{
                fontFamily: "var(--aurora-font-mono, monospace)",
                color: "var(--aurora-text-primary)",
              }}
            >
              staging
            </span>{" "}
            gateway configuration. Leaving now will permanently discard those
            changes. Any active route overrides will revert to their last saved
            state.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="aurora" size="sm">
              Keep editing
            </Button>
          </DialogClose>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            style={{ color: "var(--aurora-error)" }}
          >
            Discard changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Demo page
// ---------------------------------------------------------------------------

export default function ModalsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--aurora-text-muted)",
        }}
      >
        Dialog patterns — click to open
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <DeleteGatewayDialog />
        <DeployDialog />
        <UnsavedChangesDialog />
      </div>
    </div>
  );
}
