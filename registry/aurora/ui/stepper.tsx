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

const STYLE_ID = "aurora-stepper-style";

const CSS = `
.aurora-stepper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--font-sans, "Inter", system-ui, sans-serif);
}
.aurora-stepper__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: 96px;
}
.aurora-stepper__node {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  border: 2px solid transparent;
  font-family: var(--font-sans, "Inter", system-ui, sans-serif);
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  box-sizing: border-box;
  transition:
    background-color var(--motion-fast, 140ms) ease,
    border-color var(--motion-fast, 140ms) ease,
    color var(--motion-fast, 140ms) ease;
}
.aurora-stepper__step[data-status="complete"] .aurora-stepper__node {
  background: var(--aurora-accent-primary);
  border-color: var(--aurora-accent-primary);
  color: var(--aurora-accent-foreground);
}
.aurora-stepper__step[data-status="active"] .aurora-stepper__node {
  background: color-mix(in srgb, var(--aurora-accent-primary) 18%, transparent);
  border-color: var(--aurora-accent-primary);
  color: var(--aurora-accent-primary);
}
.aurora-stepper__step[data-status="upcoming"] .aurora-stepper__node {
  background: transparent;
  border-color: var(--aurora-border-default);
  color: var(--aurora-text-muted);
}
.aurora-stepper__check {
  width: 20px;
  height: 20px;
}
.aurora-stepper__text {
  display: block;
  text-align: center;
}
.aurora-stepper__label {
  display: block;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
}
.aurora-stepper__step[data-status="upcoming"] .aurora-stepper__label {
  color: var(--aurora-text-muted);
  font-weight: 600;
}
.aurora-stepper__step[data-status="complete"] .aurora-stepper__label,
.aurora-stepper__step[data-status="active"] .aurora-stepper__label {
  color: var(--aurora-text-primary);
}
.aurora-stepper__description {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  text-align: center;
  color: var(--aurora-text-muted);
}
`;

function useStepperStyle() {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

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
  useStepperStyle();
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
