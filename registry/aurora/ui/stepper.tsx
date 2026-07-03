"use client";

import * as React from "react";
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

const CheckIcon = () => (
  <svg
    className="aurora-stepper__check"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export function Stepper({ ref, steps, current = 0, className, ...props }: StepperProps & { ref?: React.Ref<HTMLOListElement> }) {
  return (
    <ol
      ref={ref}
      className={cn("aurora-stepper", className)}
      {...props}
    >
      {steps.map((step, i) => {
        // `current` is 0-based (CD semantics); compare against the 0-based index.
        const status = statusFor(i, current);
        return (
          <li
            key={`${step.label}-${i}`}
            className="aurora-stepper__step"
            data-status={status}
            aria-current={status === "active" ? "step" : undefined}
          >
            <span className="aurora-stepper__node">
              {status === "complete" ? (
                <CheckIcon />
              ) : (
                <span aria-hidden="true">{i + 1}</span>
              )}
            </span>
            <span className="aurora-stepper__text">
              <span className="aurora-stepper__label">{step.label}</span>
              {step.description ? (
                <span className="aurora-stepper__description">
                  {step.description}
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
