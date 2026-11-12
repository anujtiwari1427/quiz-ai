import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onDismiss,
  action,
  className
}) => {
  const configs = {
    info: {
      bg: 'bg-info-50 dark:bg-info-950/40 border-info-200 dark:border-info-800/60 text-info-900 dark:text-info-200',
      icon: <Info className="w-4 h-4 text-info-600 dark:text-info-400 shrink-0 mt-0.5" />,
    },
    success: {
      bg: 'bg-success-50 dark:bg-success-950/40 border-success-200 dark:border-success-800/60 text-success-900 dark:text-success-200',
      icon: <CheckCircle2 className="w-4 h-4 text-success-600 dark:text-success-400 shrink-0 mt-0.5" />,
    },
    warning: {
      bg: 'bg-warning-50 dark:bg-warning-950/40 border-warning-200 dark:border-warning-800/60 text-warning-900 dark:text-warning-200',
      icon: <AlertTriangle className="w-4 h-4 text-warning-600 dark:text-warning-400 shrink-0 mt-0.5" />,
    },
    danger: {
      bg: 'bg-danger-50 dark:bg-danger-950/40 border-danger-200 dark:border-danger-800/60 text-danger-900 dark:text-danger-200',
      icon: <AlertCircle className="w-4 h-4 text-danger-600 dark:text-danger-400 shrink-0 mt-0.5" />,
    },
  };

  const { bg, icon } = configs[variant];

  return (
    <div
      role="alert"
      className={clsx(
        'w-full p-3.5 rounded-xl border flex items-start gap-3 transition-colors text-xs',
        bg,
        className
      )}
    >
      {icon}
      <div className="flex-1 text-left">
        {title && <h5 className="font-bold text-xs mb-0.5">{title}</h5>}
        <div className="leading-relaxed opacity-90">{children}</div>
        {action && <div className="mt-2.5">{action}</div>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 -mr-1 text-current opacity-60 hover:opacity-100 rounded focus:outline-none"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
