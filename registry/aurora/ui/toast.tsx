"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToastStatus = "info" | "success" | "error" | "warn";

export interface ToastItem {
  id: string;
  status?: ToastStatus;
  title?: React.ReactNode;
  description?: React.ReactNode;
  duration?: number; // ms, default 4500
}

interface ToastContextValue {
  toast: (opts: Omit<ToastItem, "id">) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ---------------------------------------------------------------------------
// Keyframe injection (once)
// ---------------------------------------------------------------------------

const SLIDE_ID = "aurora-toast-slide";

function injectSlideKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(SLIDE_ID)) return;
  const style = document.createElement("style");
  style.id = SLIDE_ID;
  style.textContent = `
    @keyframes aurora-toast-in {
      from { transform: translateX(110%); opacity: 0; }
      to   { transform: translateX(0);   opacity: 1; }
    }
    @keyframes aurora-toast-out {
      from { transform: translateX(0);   opacity: 1; max-height: 120px; margin-bottom: 10px; }
      to   { transform: translateX(110%); opacity: 0; max-height: 0;   margin-bottom: 0;  }
    }
    .aurora-toast-enter { animation: aurora-toast-in  0.28s cubic-bezier(0.16,1,0.3,1) forwards; }
    .aurora-toast-exit  { animation: aurora-toast-out 0.22s ease-in             forwards; }
  `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Status colour + icon
// ---------------------------------------------------------------------------

const STATUS_COLOR: Record<ToastStatus, string> = {
  info:    "var(--aurora-accent-primary)",
  success: "var(--aurora-success)",
  error:   "var(--aurora-error)",
  warn:    "var(--aurora-warn)",
};

function StatusIcon({ status }: { status: ToastStatus }) {
  const color = STATUS_COLOR[status];

  // Inline SVGs — stacked-plane / Labby mark style for success, error, info;
  // simple warning triangle for warn.
  const inner =
    status === "warn" ? (
      // Warning triangle
      <svg viewBox="0 0 16 16" fill="none" width="10" height="10">
        <path
          d="M8 2.5L14 13.5H2L8 2.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M8 7v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="12.25" r="0.75" fill="currentColor" />
      </svg>
    ) : (
      // Stacked-plane mark (three diagonal bars, Labby-style)
      <svg viewBox="0 0 16 16" fill="none" width="10" height="10">
        <rect x="3" y="3.5" width="10" height="2"  rx="1" fill="currentColor" opacity="0.6" transform="rotate(-12 8 8)" />
        <rect x="3" y="7"   width="10" height="2"  rx="1" fill="currentColor" opacity="0.85" />
        <rect x="3" y="10.5" width="10" height="2" rx="1" fill="currentColor" opacity="0.6" transform="rotate(12 8 8)" />
      </svg>
    );

  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: `color-mix(in srgb, ${color} 18%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`,
        color,
        flexShrink: 0,
      }}
    >
      {inner}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Individual Toast UI
// ---------------------------------------------------------------------------

export interface ToastProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  function Toast({ item, onDismiss }, ref) {
    const status: ToastStatus = item.status ?? "info";
    const color = STATUS_COLOR[status];

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className="aurora-toast-enter pointer-events-auto flex w-[340px] max-w-[90vw] items-start gap-3 rounded-[var(--aurora-radius-1)] px-4 py-3.5"
        style={{
          background: "var(--aurora-panel-strong)",
          border: `1px solid var(--aurora-border-strong)`,
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-medium)",
        }}
      >
        <StatusIcon status={status} />

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {item.title && (
            <ToastTitle>{item.title}</ToastTitle>
          )}
          {item.description && (
            <ToastDescription>{item.description}</ToastDescription>
          )}
        </div>

        {/* Dismiss × */}
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => onDismiss(item.id)}
          style={{ color }}
          className="shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M1.5 1.5l10 10M11.5 1.5l-10 10" />
          </svg>
        </button>
      </div>
    );
  },
);
Toast.displayName = "Toast";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export function ToastTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn("text-[13px] font-semibold leading-snug", className)}
      style={{ color: "var(--aurora-text-primary)" }}
    >
      {children}
    </p>
  );
}
ToastTitle.displayName = "ToastTitle";

export function ToastDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn("text-[12px] leading-relaxed", className)}
      style={{ color: "var(--aurora-text-muted)" }}
    >
      {children}
    </p>
  );
}
ToastDescription.displayName = "ToastDescription";

// ---------------------------------------------------------------------------
// Provider + Portal
// ---------------------------------------------------------------------------

let _toastId = 0;
function nextId() {
  return String(++_toastId);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const [exiting, setExiting] = React.useState<Set<string>>(new Set());
  const timersRef = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  React.useEffect(() => {
    injectSlideKeyframes();
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setExiting((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
      setExiting((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 240);
  }, []);

  const toast = React.useCallback(
    (opts: Omit<ToastItem, "id">) => {
      const id = nextId();
      const duration = opts.duration ?? 4500;
      setItems((prev) => [...prev, { ...opts, id }]);

      if (duration > 0) {
        const timer = setTimeout(() => removeItem(id), duration);
        timersRef.current.set(id, timer);
      }
    },
    [removeItem],
  );

  // Clean up timers on unmount
  React.useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  const contextValue = React.useMemo(() => ({ toast }), [toast]);

  const portal =
    typeof document !== "undefined"
      ? createPortal(
          <div
            aria-label="Notifications"
            className="pointer-events-none fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5"
            style={{ maxWidth: "100vw" }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className={exiting.has(item.id) ? "aurora-toast-exit" : undefined}
              >
                <Toast item={item} onDismiss={removeItem} />
              </div>
            ))}
          </div>,
          document.body,
        )
      : null;

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {portal}
    </ToastContext.Provider>
  );
}
ToastProvider.displayName = "ToastProvider";
