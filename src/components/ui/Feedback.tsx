import React from 'react';
import { clsx } from 'clsx';

export interface ProgressBarProps {
  value?: number; // 0 - 100
  label?: string;
  showPercent?: boolean;
  variant?: 'brand' | 'structure' | 'success';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercent = true,
  variant = 'brand',
  className
}) => {
  const isIndeterminate = value === undefined;

  const barColors = {
    brand: 'bg-brand-600',
    structure: 'bg-structure-700',
    success: 'bg-success-600',
  };

  return (
    <div className={clsx('w-full space-y-1.5 text-left', className)}>
      {(label || (showPercent && !isIndeterminate)) && (
        <div className="flex items-center justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300">
          {label && <span>{label}</span>}
          {showPercent && !isIndeterminate && <span className="font-mono">{Math.round(value!)}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden relative">
        {isIndeterminate ? (
          <div className={clsx('h-full w-1/3 rounded-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-brand-500 to-transparent', barColors[variant])} />
        ) : (
          <div
            className={clsx('h-full rounded-full transition-all duration-300 ease-out', barColors[variant])}
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          />
        )}
      </div>
    </div>
  );
};

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      style={{ width, height }}
      className={clsx(
        'animate-pulse bg-neutral-200 dark:bg-neutral-800',
        variantStyles[variant],
        className
      )}
    />
  );
};
