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
    @keyframes toast-slide-in {
      from { transform: translateX(28px); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes aurora-toast-out {
      from { transform: translateX(0);    opacity: 1; max-height: 120px; margin-bottom: 10px; }
      to   { transform: translateX(28px); opacity: 0; max-height: 0;    margin-bottom: 0; }
    }
    .aurora-toast-enter { animation: toast-slide-in  0.28s cubic-bezier(0.16,1,0.3,1) forwards; }
    .aurora-toast-exit  { animation: aurora-toast-out 0.22s ease-in             forwards; }
  `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Status dismiss-button colour map
// success=#7dd3c7, error=#c78490, info=#29b6f6, warn=#c6a36b
// ---------------------------------------------------------------------------

const DISMISS_COLOR: Record<ToastStatus, string> = {
  success: "#7dd3c7",
  error:   "#c78490",
  info:    "#29b6f6",
  warn:    "#c6a36b",
};

// ---------------------------------------------------------------------------
// Labby stacked-plane SVG mark - used for ALL toast variants
// ---------------------------------------------------------------------------

function LabbyMark() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden>
      <g transform="translate(0,1)">
        <path d="M 8 13 L 24 7 L 40 13 L 24 19 Z" fill="#24536c" />
        <path d="M 8 21 L 24 15 L 40 21 L 24 27 Z" fill="#1c7fac" />
        <path d="M 8 29 L 24 23 L 40 29 L 24 35 Z" fill="#29b6f6" />
        <path d="M 8 37 L 24 31 L 40 37 L 24 43 Z" fill="#67cbfa" />
      </g>
    </svg>
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
    const dismissColor = DISMISS_COLOR[status];

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className="aurora-toast-enter pointer-events-auto flex items-start gap-3 rounded-[var(--aurora-radius-1)] px-4 py-3.5"
        style={{
          maxWidth: 400,
          width: "100%",
          background: "var(--aurora-panel-strong)",
          border: "1px solid var(--aurora-border-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-medium)",
        }}
      >
        {/* Labby stacked-plane mark - same for all variants */}
        <span
          aria-hidden
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            width: 22,
            height: 22,
          }}
        >
          <LabbyMark />
        </span>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {item.title && (
            <ToastTitle>{item.title}</ToastTitle>
          )}
          {item.description && (
            <ToastDescription>{item.description}</ToastDescription>
          )}
        </div>

        {/* Dismiss x - colored by status */}
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => onDismiss(item.id)}
          style={{ color: dismissColor }}
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
            className="pointer-events-none fixed right-5 top-5 z-[9999] flex flex-col gap-2.5"
            style={{ maxWidth: 400 }}
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
