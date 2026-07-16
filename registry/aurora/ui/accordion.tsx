"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AuroraAccordionProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>,
    "children" | "collapsible" | "defaultValue" | "onValueChange" | "type" | "value"
  > {
  children: React.ReactNode
  type?: "single" | "multiple"
  collapsible?: boolean
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: ((value: string) => void) | ((value: string[]) => void)
  ref?: React.Ref<React.ComponentRef<typeof AccordionPrimitive.Root>>
}

export interface AuroraAccordionItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
    "children" | "title" | "value"
  > {
  title: React.ReactNode
  meta?: React.ReactNode
  defaultOpen?: boolean
  value?: string
  children: React.ReactNode
  ref?: React.Ref<React.ComponentRef<typeof AccordionPrimitive.Item>>
}

export type AccordionProps = AuroraAccordionProps
export type AccordionItemProps = AuroraAccordionItemProps

function Accordion({
  ref,
  children,
  className,
  type = "multiple",
  collapsible = true,
  defaultValue,
  value,
  onValueChange,
  style,
  ...props
}: AuroraAccordionProps) {
  const items = React.Children.toArray(children)

  const normalizedChildren = items.map((child, index) => {
    if (!React.isValidElement<AuroraAccordionItemProps>(child)) {
      return child
    }

    return React.cloneElement(child, {
      value: child.props.value ?? `accordion-item-${index}`,
    })
  })

  const derivedDefaultValue = React.useMemo(() => {
    if (defaultValue !== undefined) {
      return defaultValue
    }

    const openValues = items.flatMap((child, index) => {
      if (!React.isValidElement<AuroraAccordionItemProps>(child) || !child.props.defaultOpen) {
        return []
      }

      return [child.props.value ?? `accordion-item-${index}`]
    })

    return type === "multiple" ? openValues : openValues[0]
  }, [defaultValue, items, type])

  const rootClassName = cn("overflow-hidden rounded-[12px] border", className)
  const rootStyle = {
    background: "var(--aurora-panel-medium)",
    borderColor: "var(--aurora-border-default)",
    ...style,
  }

  if (type === "multiple") {
    return (
      <AccordionPrimitive.Root
        ref={ref}
        data-slot="accordion"
        type="multiple"
        defaultValue={derivedDefaultValue as string[] | undefined}
        value={value as string[] | undefined}
        onValueChange={onValueChange as ((value: string[]) => void) | undefined}
        className={rootClassName}
        style={rootStyle}
        {...props}
      >
        {normalizedChildren}
      </AccordionPrimitive.Root>
    )
  }

  return (
    <AccordionPrimitive.Root
      ref={ref}
      data-slot="accordion"
      type="single"
      collapsible={collapsible}
      defaultValue={derivedDefaultValue as string | undefined}
      value={value as string | undefined}
      onValueChange={onValueChange as ((value: string) => void) | undefined}
      className={rootClassName}
      style={rootStyle}
      {...props}
    >
      {normalizedChildren}
    </AccordionPrimitive.Root>
  )
}

function AccordionItem({
  ref,
  className,
  title,
  meta,
  children,
  value,
  style,
  ...props
}: AuroraAccordionItemProps) {
  const itemValue = value ?? "accordion-item"

  return (
    <AccordionPrimitive.Item
      ref={ref}
      data-slot="accordion-item"
      value={itemValue}
      className={cn("border-b last:border-b-0", className)}
      style={{ borderColor: "var(--aurora-border-default)", ...style }}
      {...props}
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(
            "group flex flex-1 items-center justify-between gap-3 px-5 py-3.5 text-left outline-none transition-colors duration-150",
            "hover:bg-[var(--aurora-hover-bg)] focus-visible:ring-2 focus-visible:ring-[var(--aurora-focus-ring)] focus-visible:ring-inset"
          )}
          style={{
            color: "var(--aurora-text-primary)",
            fontFamily: "var(--aurora-font-display)",
            fontSize: "15px",
            fontWeight: "var(--aurora-weight-heading)",
          }}
        >
          <span className="min-w-0 flex-1 truncate">{title}</span>
          {meta ? (
            <span className="truncate aurora-text-meta" style={{ maxWidth: 160 }}>
              {meta}
            </span>
          ) : null}
          <ChevronDown
            className="size-4 shrink-0 text-[var(--aurora-text-muted)] transition-transform duration-200 group-data-[state=open]:rotate-180"
            strokeWidth={2}
            aria-hidden
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        data-slot="accordion-content"
        className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      >
        <div
          className="px-5 pb-4 pt-1"
          style={{
            color: "var(--aurora-text-muted)",
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "var(--aurora-type-body)",
            lineHeight: 1.55,
          }}
        >
          {children}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

export { Accordion, AccordionItem }
export default Accordion
