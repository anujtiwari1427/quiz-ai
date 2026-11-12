import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      // Primary Action: Deep Indigo / Ink-Blue (#4338ca)
      primary:
        'bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white shadow-soft-xs hover:shadow-soft border border-brand-800/80 focus-visible:ring-brand-600 focus-visible:ring-offset-white dark:bg-brand-600 dark:hover:bg-brand-500 dark:border-brand-500/80 dark:focus-visible:ring-offset-neutral-950',
      // Secondary: Warm Stone Neutral
      secondary:
        'bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 border border-neutral-200/80 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 dark:text-neutral-200 dark:border-neutral-700 focus-visible:ring-brand-500',
      // Outline: Clean Neutral border
      outline:
        'bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 shadow-soft-xs hover:border-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700 focus-visible:ring-brand-500',
      // Ghost: Subtly flat
      ghost:
        'bg-transparent hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300 dark:hover:text-white focus-visible:ring-brand-500',
      // Danger: Red
      danger:
        'bg-danger-600 hover:bg-danger-700 active:bg-danger-800 text-white shadow-soft-xs border border-danger-700 focus-visible:ring-danger-500',
    };

    const sizes = {
      xs: 'text-xs px-2.5 py-1 rounded-sm gap-1.5 min-h-[28px]',
      sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5 min-h-[32px]',
      md: 'text-sm px-4 py-2 rounded-lg gap-2 min-h-[40px]',
      lg: 'text-base px-5 py-2.5 rounded-lg gap-2.5 min-h-[44px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'ghost' | 'primary' | 'secondary' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  ariaLabel: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'outline',
      size = 'md',
      ariaLabel,
      icon,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] shrink-0';

    const variants = {
      primary:
        'bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white shadow-soft-xs border border-brand-800/80 focus-visible:ring-brand-600',
      secondary:
        'bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 border border-neutral-200/80 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 dark:text-neutral-200 dark:border-neutral-700 focus-visible:ring-brand-500',
      outline:
        'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 shadow-soft-xs hover:border-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 focus-visible:ring-brand-500',
      ghost:
        'bg-transparent hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-400 dark:hover:text-white focus-visible:ring-brand-500',
      danger:
        'bg-danger-50 hover:bg-danger-100 text-danger-700 border border-danger-200 dark:bg-danger-950/40 dark:hover:bg-danger-900/60 dark:text-danger-400 dark:border-danger-800/60 focus-visible:ring-danger-500',
    };

    const sizes = {
      xs: 'w-7 h-7 rounded-sm p-1 text-xs',
      sm: 'w-8 h-8 rounded-md p-1.5 text-xs',
      md: 'w-10 h-10 rounded-lg p-2 text-sm',
      lg: 'w-11 h-11 rounded-lg p-2.5 text-base',
    };

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        title={ariaLabel}
        disabled={disabled || isLoading}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';
