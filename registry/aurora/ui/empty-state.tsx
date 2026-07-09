"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  /** Heading level for the title. Defaults to "p" for flexibility; set to "h2"/"h3" when inside a section. */
  as?: "h1" | "h2" | "h3" | "h4" | "p";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EmptyState({
  ref,
  icon,
  title,
  description,
  action,
  className,
  as: Heading = "p",
  ...rest
}: EmptyStateProps & { ref?: React.Ref<HTMLDivElement> }) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-5 px-8 py-14 text-center",
          className,
        )}
        style={{
          border: `1.5px dashed var(--aurora-border-default)`,
          borderRadius: "var(--aurora-radius-2)",
        }}
        {...rest}
      >
        {/* Icon slot */}
        {icon && (
          <span
            aria-hidden
            className="flex items-center justify-center"
            style={{
              width: 52,
              height: 52,
              background: "var(--aurora-control-surface)",
              border: `1px solid var(--aurora-border-strong)`,
              borderRadius: 14,
              flexShrink: 0,
              color: "var(--aurora-text-muted)",
            }}
          >
            {icon}
          </span>
        )}

        <div className="flex flex-col items-center gap-2">
          {/* Title */}
          <Heading
            className="aurora-text-section"
            style={{
              fontWeight: "var(--aurora-weight-heading)",
              lineHeight: "var(--aurora-line-dense)",
              color: "var(--aurora-text-primary)",
            }}
          >
            {title}
          </Heading>

          {/* Description */}
          {description && (
            <p
              style={{
                color: "var(--aurora-text-muted)",
                fontFamily: "var(--aurora-font-sans)",
                fontSize: "var(--aurora-type-control)",
                lineHeight: "var(--aurora-line-body)",
                maxWidth: 320,
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Action slot */}
        {action && <div className="pt-1">{action}</div>}
      </div>
    );
}
