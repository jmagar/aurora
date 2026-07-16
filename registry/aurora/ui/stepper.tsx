"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Stepper — Aurora extension (multi-step progress)
// ---------------------------------------------------------------------------
// Self-contained, CD-matching implementation. A horizontal row of circular
// step nodes with labels. Three node states:
//   - complete  (index < current): solid cyan fill + dark check glyph
//   - active    (index === current): cyan-tinted surface, cyan border, cyan number
//   - upcoming  (index > current): transparent, faint border, muted number
// Tokens only (no raw hex that a token covers); violet intentionally dropped.

export interface StepperStep {
  /** Visible label rendered beneath the node. */
  label: string;
  /** Optional secondary line beneath the label. */
  description?: string;
}

export type StepperStatus = "complete" | "active" | "upcoming";

export interface StepperProps
  extends Omit<React.HTMLAttributes<HTMLOListElement>, "children"> {
  /** The ordered steps. */
  steps: StepperStep[];
  /**
   * 0-based index of the active step. Steps before it render complete, the
   * step at `current` renders active, steps after render upcoming. Matches the
   * Claude Design source: `current={2}` activates the third step.
   */
  current?: number;
}

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

function statusFor(index: number, current: number): StepperStatus {
  if (index < current) return "complete";
  if (index === current) return "active";
  return "upcoming";
}

export function Stepper({ ref, steps, current = 0, className, ...props }: StepperProps & { ref?: React.Ref<HTMLOListElement> }) {
  const baseId = React.useId();
  const clampedCurrent =
    steps.length === 0
      ? 0
      : Math.min(Math.max(current, 0), steps.length - 1);

  return (
    <ol
      ref={ref}
      className={cn("aurora-stepper", className)}
      aria-label={props["aria-label"] ?? "Progress"}
      {...props}
    >
      {steps.map((step, i) => {
        // `current` is 0-based (CD semantics); compare against the 0-based index.
        const status = statusFor(i, clampedCurrent);
        const descriptionId = step.description
          ? `${baseId}-step-${i}-description`
          : undefined;
        const statusLabel =
          status === "complete"
            ? "Complete"
            : status === "active"
              ? "Current step"
              : "Upcoming step";

        return (
          <li
            key={`${step.label}-${i}`}
            className="aurora-stepper__step"
            data-status={status}
            aria-current={status === "active" ? "step" : undefined}
            aria-describedby={descriptionId}
            aria-label={`${step.label}: ${statusLabel}`}
          >
            <span className="aurora-stepper__node">
              {status === "complete" ? (
                <Check
                  className="aurora-stepper__check"
                  size={20}
                  strokeWidth={2.8}
                  aria-hidden="true"
                />
              ) : (
                <span aria-hidden="true">{i + 1}</span>
              )}
            </span>
            <span className="aurora-stepper__text">
              <span className="aurora-stepper__label">{step.label}</span>
              {step.description ? (
                <span className="aurora-stepper__description">
                  <span id={descriptionId}>{step.description}</span>
                </span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default Stepper;
