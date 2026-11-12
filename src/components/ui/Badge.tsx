import React from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'brand' | 'accent' | 'structure' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'xs' | 'sm' | 'md';
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  onRemove,
  icon,
  className
}) => {
  const variants = {
    neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700',
    brand: 'bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border-brand-200 dark:border-brand-800/80',
    accent: 'bg-accent-50 text-accent-800 dark:bg-accent-950/60 dark:text-accent-300 border-accent-200 dark:border-accent-800/80',
    structure: 'bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border-brand-200 dark:border-brand-800/80',
    success: 'bg-success-50 text-success-700 dark:bg-success-950/40 dark:text-success-300 border-success-200 dark:border-success-800/60',
    warning: 'bg-warning-50 text-warning-800 dark:bg-warning-950/40 dark:text-warning-300 border-warning-200 dark:border-warning-800/60',
    danger: 'bg-danger-50 text-danger-700 dark:bg-danger-950/40 dark:text-danger-300 border-danger-200 dark:border-danger-800/60',
    info: 'bg-info-50 text-info-700 dark:bg-info-950/40 dark:text-info-300 border-info-200 dark:border-info-800/60',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 rounded gap-1 font-semibold tracking-wide uppercase',
    sm: 'text-xs px-2 py-0.5 rounded-md gap-1.5 font-medium',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-2 font-medium',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center border select-none transition-colors shrink-0',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-75 focus:outline-none rounded-full p-0.5"
          aria-label="Remove badge"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
