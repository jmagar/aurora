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
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(
    { icon, title, description, action, className, ...rest },
    ref,
  ) {
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
              borderRadius: 12,
              flexShrink: 0,
              color: "var(--aurora-text-muted)",
            }}
          >
            {icon}
          </span>
        )}

        <div className="flex flex-col items-center gap-2">
          {/* Title */}
          <p
            className="text-[15px] font-bold leading-snug"
            style={{
              fontFamily: "var(--aurora-font-display)",
              color: "var(--aurora-text-primary)",
            }}
          >
            {title}
          </p>

          {/* Description */}
          {description && (
            <p
              className="text-[13px] leading-relaxed"
              style={{
                color: "var(--aurora-text-muted)",
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
  },
);

EmptyState.displayName = "EmptyState";
