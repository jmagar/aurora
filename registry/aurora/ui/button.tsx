"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold",
    "transition-all duration-150 ease-out",
    "disabled:pointer-events-none disabled:opacity-45",
    "focus-visible:outline-none",
    "select-none cursor-pointer",
  ].join(" "),
  {
    variants: {
      variant: {
        aurora: [
          "text-white border border-transparent",
          "relative overflow-hidden",
        ].join(" "),
        neutral: [
          "border text-[var(--aurora-text-primary)]",
          "bg-transparent",
        ].join(" "),
        rose: [
          "text-white border border-transparent",
        ].join(" "),
        ghost: [
          "border-transparent text-[var(--aurora-text-muted)]",
          "bg-transparent hover:text-[var(--aurora-text-primary)]",
        ].join(" "),
        destructive: [
          "text-white border border-transparent",
        ].join(" "),
      },
      size: {
        sm: "h-7 px-3 text-xs rounded-[10px]",
        default: "h-9 px-4 rounded-[var(--aurora-radius-1)]",
        lg: "h-11 px-6 text-base rounded-[var(--aurora-radius-2)]",
      },
    },
    defaultVariants: {
      variant: "aurora",
      size: "default",
    },
  }
)

// Inline style maps for Aurora-specific gradients and glows
function getVariantStyle(variant: ButtonVariant | null | undefined): React.CSSProperties {
  switch (variant) {
    case "aurora":
      return {
        background: "linear-gradient(180deg, #4dc8fa 0%, #1da8e6 100%)",
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.25)",
          "0 0 0 1px color-mix(in srgb, #29b6f6 40%, transparent)",
          "0 2px 12px color-mix(in srgb, #29b6f6 30%, transparent)",
          "0 4px 20px color-mix(in srgb, #1da8e6 20%, transparent)",
        ].join(", "),
      }
    case "neutral":
      return {
        borderColor: "var(--aurora-border-strong)",
        background: "linear-gradient(180deg, rgba(23,54,75,0.6) 0%, rgba(12,26,36,0.8) 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }
    case "rose":
      return {
        background: "linear-gradient(180deg, #f9a8c4 0%, #e879a0 100%)",
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.20)",
          "0 0 0 1px color-mix(in srgb, #f9a8c4 35%, transparent)",
          "0 2px 12px color-mix(in srgb, #f9a8c4 25%, transparent)",
        ].join(", "),
      }
    case "ghost":
      return {}
    case "destructive":
      return {
        background: "linear-gradient(180deg, #d9909a 0%, #c78490 100%)",
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.15)",
          "0 0 0 1px color-mix(in srgb, #c78490 35%, transparent)",
          "0 2px 10px color-mix(in srgb, #c78490 25%, transparent)",
        ].join(", "),
      }
    default:
      return {}
  }
}

function getHoverStyle(variant: ButtonVariant | null | undefined): string {
  switch (variant) {
    case "aurora":
      return "hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.30),0_0_0_1px_color-mix(in_srgb,#29b6f6_55%,transparent),0_2px_16px_color-mix(in_srgb,#29b6f6_40%,transparent),0_6px_28px_color-mix(in_srgb,#1da8e6_28%,transparent)]"
    case "neutral":
      return "hover:border-[var(--aurora-border-strong)] hover:bg-[var(--aurora-hover-bg)]"
    case "rose":
      return "hover:opacity-90"
    case "ghost":
      return "hover:bg-[var(--aurora-hover-bg)]"
    case "destructive":
      return "hover:opacity-90"
    default:
      return ""
  }
}

type ButtonVariant = "aurora" | "neutral" | "rose" | "ghost" | "destructive"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const variantStyle = getVariantStyle(variant)
    const hoverClass = getHoverStyle(variant)

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), hoverClass, className)}
        style={{ ...variantStyle, ...style }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export default Button
