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
      {icon ? <span style={{ color: "var(--aurora-text-muted)" }}>{icon}</span> : <span />}
      <span className="min-w-0">
        <span className="block truncate aurora-text-control">{title}</span>
        {description ? <span className="block aurora-text-meta">{description}</span> : null}
      </span>
      {action ? <span>{action}</span> : null}
    </div>
  )
)
Item.displayName = "Item"

export default Item
