"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { CircleCheck, Info, TriangleAlert, X, CircleX } from "lucide-react";
import { Button } from "./button";
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
  action?: {
    label: string;
    onClick: () => void;
  };
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
// ---------------------------------------------------------------------------

const DISMISS_COLOR: Record<ToastStatus, string> = {
  success: "var(--aurora-success)",
  error:   "var(--aurora-error)",
  info:    "var(--aurora-accent-primary)",
  warn:    "var(--aurora-warn)",
};

// ---------------------------------------------------------------------------
// Status icons - communicates toast type visually
// ---------------------------------------------------------------------------

function StatusIcon({ status }: { status: ToastStatus }) {
  const iconProps = { size: 18, strokeWidth: 1.65, "aria-hidden": true } as const;

  if (status === "success") return <CircleCheck {...iconProps} color="var(--aurora-success)" />;
  if (status === "error") return <CircleX {...iconProps} color="var(--aurora-error)" />;
  if (status === "warn") return <TriangleAlert {...iconProps} color="var(--aurora-warn)" />;
  return <Info {...iconProps} color="var(--aurora-info)" />;
}

// ---------------------------------------------------------------------------
// Individual Toast UI
// ---------------------------------------------------------------------------

export interface ToastProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

export function Toast({ ref, item, onDismiss }: ToastProps & { ref?: React.Ref<HTMLDivElement> }) {
  const status: ToastStatus = item.status ?? "info";
  const dismissColor = DISMISS_COLOR[status];

  return (
    <div
      ref={ref}
      role={status === "error" || status === "warn" ? "alert" : "status"}
      aria-live={status === "error" || status === "warn" ? "assertive" : "polite"}
      className="aurora-toast-enter pointer-events-auto flex items-start gap-3 rounded-[var(--aurora-radius-1)] px-4 py-3.5"
      style={{
        maxWidth: 400,
        width: "100%",
        background: "var(--aurora-panel-strong)",
        border: "1px solid var(--aurora-border-strong)",
        boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-medium)",
      }}
    >
      {/* Status icon */}
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
        <StatusIcon status={status} />
      </span>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {item.title && (
          <ToastTitle>{item.title}</ToastTitle>
        )}
        {item.description && (
          <ToastDescription>{item.description}</ToastDescription>
        )}
        {item.action && (
          <button
            type="button"
            onClick={item.action.onClick}
            style={{
              fontSize: "var(--aurora-type-body-sm)",
              fontFamily: "var(--aurora-font-sans)",
              fontWeight: 650,
              color: "var(--aurora-accent-primary)",
              background: "none",
              border: "none",
              padding: "2px 0",
              cursor: "pointer",
              alignSelf: "flex-start",
            }}
          >
            {item.action.label}
          </button>
        )}
      </div>

      {/* Dismiss x - colored by status */}
      <Button variant="plain" size="unstyled"
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(item.id)}
        style={{ color: dismissColor }}
        className="shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1"
      >
        <X size={13} strokeWidth={1.8} aria-hidden="true" />
      </Button>
    </div>
  );
}

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
      className={className}
      style={{
        color: "var(--aurora-text-primary)",
        fontSize: "var(--aurora-type-control)",
        fontWeight: "var(--aurora-weight-label)",
        lineHeight: "var(--aurora-line-ui)",
        fontFamily: "var(--aurora-font-sans)",
      }}
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
      className={className}
      style={{
        color: "var(--aurora-text-muted)",
        fontSize: "var(--aurora-type-label)",
        lineHeight: "1.5",
        fontFamily: "var(--aurora-font-sans)",
      }}
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

interface ToastProviderProps {
  children: React.ReactNode;
  position?: "top-right" | "top-center" | "bottom-right" | "bottom-center";
}

const POSITION_CLASS: Record<NonNullable<ToastProviderProps["position"]>, string> = {
  "top-right":    "fixed right-5 top-5",
  "top-center":   "fixed left-1/2 -translate-x-1/2 top-5",
  "bottom-right": "fixed right-5 bottom-5",
  "bottom-center":"fixed left-1/2 -translate-x-1/2 bottom-5",
};

export function ToastProvider({ children, position = "top-right" }: ToastProviderProps) {
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
            className={cn("pointer-events-none z-[9999] flex flex-col gap-2.5", POSITION_CLASS[position])}
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
