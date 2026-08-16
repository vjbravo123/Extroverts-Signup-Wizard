// src/components/ToastProvider.tsx
'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { CheckCircle2, XCircle, X as CloseIcon } from 'lucide-react';

type ToastType = 'success' | 'error';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
  leaving?: boolean;
}

interface ToastContextValue {
  /** Generic entry point — pick a type explicitly */
  showToast: (type: ToastType, message: string, duration?: number) => void;
  /** Convenience helpers, use these in components */
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DEFAULT_DURATION = 4000;
const EXIT_ANIMATION_MS = 200;

let idCounter = 0;
const nextId = () => `toast_${Date.now()}_${idCounter++}`;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  // Track pending timeouts so we can clear them on manual dismiss/unmount
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const removeToast = useCallback((id: string) => {
    // Mark as leaving first so the exit transition can play, then unmount
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    const exitTimer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timers.current[id];
    }, EXIT_ANIMATION_MS);
    timers.current[id] = exitTimer;
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      const existing = timers.current[id];
      if (existing) clearTimeout(existing);
      removeToast(id);
    },
    [removeToast]
  );

  const showToast = useCallback(
    (type: ToastType, message: string, duration: number = DEFAULT_DURATION) => {
      const id = nextId();
      setToasts((prev) => [...prev, { id, type, message, duration }]);
      const autoTimer = setTimeout(() => removeToast(id), duration);
      timers.current[id] = autoTimer;
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, duration?: number) => showToast('success', message, duration),
    [showToast]
  );
  const error = useCallback(
    (message: string, duration?: number) => showToast('error', message, duration),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
};

/* ------------------------------------------------------------------ */
/* Presentational layer                                                */
/* ------------------------------------------------------------------ */

const ToastViewport: React.FC<{
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="
        fixed inset-x-0 bottom-8 z-[100]
        flex flex-col items-center gap-2
        px-6 pointer-events-none
      "
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const Toast: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const isError = toast.type === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`
        w-full max-w-100 pointer-events-auto
        bg-white rounded-2xl shadow-[0_10px_40px_-8px_rgba(0,0,0,0.5)]
        px-4 py-4 flex items-start gap-3
        transition-all duration-200 ease-out
        ${toast.leaving ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
      `}
    >
      {isError ? (
        <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-orange-500" strokeWidth={2.25} />
      ) : (
        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" strokeWidth={2.25} />
      )}

      <p className="text-sm font-bold text-black leading-snug flex-1">
        {toast.message}
      </p>

      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        className="shrink-0 text-zinc-400 hover:text-zinc-700 transition-colors"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
};