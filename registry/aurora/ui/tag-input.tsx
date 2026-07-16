"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TagInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "size"
  > {
  /** Controlled list of tags. */
  value?: string[]
  /** Initial list of tags for uncontrolled usage. */
  defaultValue?: string[]
  /** Fired whenever the tag list changes (add or remove). */
  onValueChange?: (tags: string[]) => void
  /** Placeholder for the inline text field. */
  placeholder?: string
  /** Disable all interaction. */
  disabled?: boolean
}

/**
 * TagInput — Aurora extension. A bordered container holding removable chips
 * plus an inline text field. Press Enter (or comma) to add the current value
 * as a chip; press Backspace on an empty field to remove the last chip.
 */
function TagInput(
  {
    ref,
    className,
    value,
    defaultValue,
    onValueChange,
    placeholder = "Add tag…",
    disabled = false,
    style,
    onKeyDown,
    ...props
  }: TagInputProps & { ref?: React.Ref<HTMLInputElement> }
) {
    const isControlled = value !== undefined
    const [internalTags, setInternalTags] = React.useState<string[]>(
      defaultValue ?? []
    )
    const tags = isControlled ? (value as string[]) : internalTags

    const [draft, setDraft] = React.useState("")
    const [focused, setFocused] = React.useState(false)

    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLInputElement | null>).current = node
        }
      },
      [ref]
    )

    const commit = React.useCallback(
      (next: string[]) => {
        if (!isControlled) {
          setInternalTags(next)
        }
        onValueChange?.(next)
      },
      [isControlled, onValueChange]
    )

    const addTag = React.useCallback(
      (raw: string) => {
        const trimmed = raw.trim()
        if (!trimmed) return
        if (tags.includes(trimmed)) {
          setDraft("")
          return
        }
        commit([...tags, trimmed])
        setDraft("")
      },
      [tags, commit]
    )

    const removeTag = React.useCallback(
      (index: number) => {
        commit(tags.filter((_, i) => i !== index))
      },
      [tags, commit]
    )

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e)
      if (e.defaultPrevented) return
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault()
        addTag(draft)
      } else if (e.key === "Backspace" && draft.length === 0 && tags.length > 0) {
        e.preventDefault()
        removeTag(tags.length - 1)
      }
    }

    return (
      <div
        data-slot="tag-input"
        data-disabled={disabled || undefined}
        className={cn(
          "flex w-full flex-wrap items-center gap-1.5",
          "border border-[var(--aurora-border-strong)]",
          "rounded-[var(--aurora-radius-2)]",
          "px-2.5 py-2",
          "transition-all duration-150 ease-out",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
          className
        )}
        style={{
          background: "var(--aurora-control-surface)",
          minHeight: 44,
          boxShadow: focused
            ? [
                "0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent)",
                "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 45%, transparent)",
              ].join(", ")
            : "none",
          ...style,
        }}
        onMouseDown={(e) => {
          // Clicking blank space within the container focuses the field
          if (e.target === e.currentTarget && !disabled) {
            e.preventDefault()
            inputRef.current?.focus()
          }
        }}
      >
        {tags.map((tag, index) => (
          <TagChip
            key={`${tag}-${index}`}
            label={tag}
            disabled={disabled}
            onRemove={() => removeTag(index)}
          />
        ))}

        <input
          ref={setRefs}
          type="text"
          value={draft}
          disabled={disabled}
          placeholder={tags.length === 0 ? placeholder : ""}
          className={cn(
            "min-w-[60px] flex-1 bg-transparent",
            "border-0 outline-none",
            "text-[var(--aurora-text-primary)]",
            "placeholder:text-[var(--aurora-text-muted)]",
            "disabled:cursor-not-allowed"
          )}
          style={{
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "var(--aurora-type-body-sm)",
            fontWeight: "var(--aurora-weight-body)",
            letterSpacing: "var(--aurora-letter-ui)",
            lineHeight: "var(--aurora-line-ui)",
            height: 24,
          }}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            setFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            props.onBlur?.(e)
          }}
          {...props}
        />
      </div>
    )
}

export interface TagChipProps {
  label: string
  disabled?: boolean
  onRemove?: () => void
}

/** A single removable chip rendered inside TagInput. */
function TagChip({ ref, label, disabled, onRemove }: TagChipProps & { ref?: React.Ref<HTMLSpanElement> }) {
  return (
    <span
      ref={ref}
      data-slot="tag-chip"
      className={cn(
        "inline-flex items-center gap-1.5",
        "border",
        "rounded-[var(--aurora-radius-1)]",
        "pl-2.5 pr-1.5 py-1",
        "select-none"
      )}
      style={{
        borderColor:
          "color-mix(in srgb, var(--aurora-accent-primary) 55%, transparent)",
        background:
          "color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)",
        color: "var(--aurora-accent-primary)",
        fontFamily: "var(--aurora-font-sans)",
        fontSize: "var(--aurora-type-body-sm)",
        fontWeight: 560,
        letterSpacing: "var(--aurora-letter-ui)",
        lineHeight: 1,
      }}
    >
      {label}
      <button
        type="button"
        aria-label={`Remove ${label}`}
        disabled={disabled}
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-full",
          "transition-colors duration-100",
          "hover:bg-[color-mix(in_srgb,var(--aurora-accent-primary)_22%,transparent)]",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--aurora-focus-ring)]",
          "disabled:pointer-events-none"
        )}
        style={{ color: "var(--aurora-accent-primary)" }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onRemove}
      >
        <X size={12} strokeWidth={2} aria-hidden="true" />
      </button>
    </span>
  )
}

export { TagInput, TagChip }
export default TagInput
