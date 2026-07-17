"use client"

import * as React from "react"

export interface ItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  icon?: React.ReactNode
}

export function Item({ title, description, action, icon, className, style, ref, ...props }: ItemProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
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
      {icon ? (
        <span aria-hidden="true" style={{ color: "var(--aurora-text-muted)", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16 }}>
          {icon}
        </span>
      ) : (
        <span aria-hidden="true" style={{ display: "inline-flex", width: 16, height: 16 }} />
      )}
      <span className="min-w-0">
        <span
          className="block truncate"
          style={{
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "var(--aurora-type-body)",
            fontWeight: "var(--aurora-weight-label)",
            lineHeight: "var(--aurora-line-ui)",
            letterSpacing: "var(--aurora-letter-ui)",
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
              fontSize: "var(--aurora-type-body-sm)",
              fontWeight: "var(--aurora-weight-body)",
              lineHeight: "var(--aurora-line-body)",
              color: "var(--aurora-text-muted)",
            }}
          >
            {description}
          </span>
        ) : null}
      </span>
      {action ? <span className="shrink-0">{action}</span> : null}
    </div>
  )
}

export default Item
