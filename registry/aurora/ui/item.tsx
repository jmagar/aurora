"use client"

import * as React from "react"

export interface ItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  icon?: React.ReactNode
}

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ title, description, action, icon, className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={["grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[8px] border px-3 py-2.5", className].filter(Boolean).join(" ")}
      style={{
        background: "var(--aurora-panel-medium)",
        borderColor: "var(--aurora-border-default)",
        color: "var(--aurora-text-primary)",
        ...style,
      }}
      {...props}
    >
      {icon ? <span style={{ color: "var(--aurora-text-muted)", display: "inline-flex" }}>{icon}</span> : <span />}
      <span className="min-w-0">
        <span
          className="block truncate"
          style={{
            fontFamily: "var(--aurora-font-display)",
            fontSize: "15px",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            color: "var(--aurora-text-primary)",
          }}
        >
          {title}
        </span>
        {description ? (
          <span
            className="block truncate"
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "13px",
              fontWeight: 500,
              lineHeight: 1.35,
              color: "var(--aurora-text-muted)",
            }}
          >
            {description}
          </span>
        ) : null}
      </span>
      {action ? <span>{action}</span> : null}
    </div>
  )
)
Item.displayName = "Item"

export default Item
