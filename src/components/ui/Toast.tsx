import React, { createContext, useContext, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, AlertCircle, Info, X, RotateCcw } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  undoAction?: () => void;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: 'success' | 'error' | 'info', options?: { undoAction?: () => void; duration?: number }) => void;
  success: (message: string, undoAction?: () => void) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (
      message: string,
      type: 'success' | 'error' | 'info' = 'success',
      options?: { undoAction?: () => void; duration?: number }
    ) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const duration = options?.duration ?? 4000;

      const newToast: ToastItem = {
        id,
        type,
        message,
        undoAction: options?.undoAction,
        duration,
      };

      setToasts((prev) => [...prev.slice(-3), newToast]); // keep max 4

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const value: ToastContextType = {
    toast: addToast,
    success: (msg, undo) => addToast(msg, 'success', { undoAction: undo }),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={clsx(
              'pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-soft-lg border text-xs font-medium',
              'transition-all duration-200 animate-in slide-in-from-bottom-2 fade-in-0',
              t.type === 'success' && 'bg-neutral-900 dark:bg-neutral-800 text-white border-neutral-700/80',
              t.type === 'error' && 'bg-danger-600 text-white border-danger-700',
              t.type === 'info' && 'bg-brand-900 text-white border-brand-800'
            )}
          >
            <div className="flex items-center gap-2.5">
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {t.type === 'error' && <AlertCircle className="w-4 h-4 text-white shrink-0" />}
              {t.type === 'info' && <Info className="w-4 h-4 text-brand-300 shrink-0" />}
              <span className="leading-snug">{t.message}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {t.undoAction && (
                <button
                  onClick={() => {
                    t.undoAction?.();
                    removeToast(t.id);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Undo</span>
                </button>
              )}
              <button
                onClick={() => removeToast(t.id)}
                className="p-1 text-white/70 hover:text-white rounded"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
