import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function devWarn(message: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(message)
  }
}
