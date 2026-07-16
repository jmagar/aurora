export type NavigationKey = "ArrowDown" | "ArrowUp" | "ArrowLeft" | "ArrowRight" | "Home" | "End"

export function nextEnabledIndex(current: number, key: NavigationKey, disabled: readonly boolean[], direction: "ltr" | "rtl" = "ltr") {
  if (disabled.length === 0 || disabled.every(Boolean)) return -1
  if (key === "Home") return disabled.findIndex((value) => !value)
  if (key === "End") {
    for (let index = disabled.length - 1; index >= 0; index -= 1) if (!disabled[index]) return index
  }
  const forward = key === "ArrowDown" || (key === "ArrowRight" && direction === "ltr") || (key === "ArrowLeft" && direction === "rtl")
  let index = current < 0 ? (forward ? -1 : 0) : current
  for (let count = 0; count < disabled.length; count += 1) {
    index = (index + (forward ? 1 : -1) + disabled.length) % disabled.length
    if (!disabled[index]) return index
  }
  return -1
}

export function isNavigationKey(key: string): key is NavigationKey {
  return ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(key)
}

export const POPOVER_FOCUSABLE_SELECTOR = ["a[href]", "button:not([disabled])", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])", '[tabindex]:not([tabindex="-1"])'].join(",")
