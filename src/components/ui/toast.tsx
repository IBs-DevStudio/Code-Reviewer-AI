"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "destructive" | "info";

export interface ToastData {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
}

type ToastListener = (toasts: ToastData[]) => void;

let toasts: ToastData[] = [];
const listeners: Set<ToastListener> = new Set();

function notify() {
  listeners.forEach((listener) => listener([...toasts]));
}

export function toast({
  title,
  description,
  variant = "default",
  duration = 4000,
}: Omit<ToastData, "id">) {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: ToastData = { id, title, description, variant, duration };

  toasts = [...toasts, newToast];
  notify();

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }

  return id;
}

toast.success = (title: React.ReactNode, description?: React.ReactNode) =>
  toast({ title, description, variant: "success" });

toast.error = (title: React.ReactNode, description?: React.ReactNode) =>
  toast({ title, description, variant: "destructive" });

toast.info = (title: React.ReactNode, description?: React.ReactNode) =>
  toast({ title, description, variant: "info" });

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export function useToast() {
  const [currentToasts, setCurrentToasts] = React.useState<ToastData[]>(toasts);

  React.useEffect(() => {
    listeners.add(setCurrentToasts);
    return () => {
      listeners.delete(setCurrentToasts);
    };
  }, []);

  return {
    toasts: currentToasts,
    toast,
    dismiss: dismissToast,
  };
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex max-h-screen w-full max-w-sm flex-col gap-2 pointer-events-none p-4"
    >
      {toasts.map((t) => {
        const isDestructive = t.variant === "destructive";
        const isSuccess = t.variant === "success";

        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-5",
              isDestructive
                ? "border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/20"
                : isSuccess
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200"
                  : "border-border/60 bg-popover/95 text-popover-foreground"
            )}
          >
            {isDestructive ? (
              <AlertCircle className="size-5 shrink-0 text-destructive mt-0.5" />
            ) : isSuccess ? (
              <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            ) : (
              <Info className="size-5 shrink-0 text-muted-foreground mt-0.5" />
            )}

            <div className="flex-1 min-w-0 pr-2">
              {t.title && (
                <p className="text-sm font-semibold tracking-tight leading-snug">
                  {t.title}
                </p>
              )}
              {t.description && (
                <p
                  className={cn(
                    "text-xs mt-1 leading-relaxed",
                    isDestructive
                      ? "text-destructive/90"
                      : isSuccess
                        ? "text-emerald-800 dark:text-emerald-300/90"
                        : "text-muted-foreground"
                  )}
                >
                  {t.description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Dismiss notification"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
