import React from 'react';
import { clsx } from 'clsx';
import { ChevronRight } from 'lucide-react';

export interface KbdHintProps {
  children: React.ReactNode;
  className?: string;
}

export const KbdHint: React.FC<KbdHintProps> = ({ children, className }) => {
  return (
    <kbd
      className={clsx(
        'inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider rounded-md border shadow-soft-xs select-none',
        'bg-neutral-100 text-neutral-600 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
        className
      )}
    >
      {children}
    </kbd>
  );
};

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isCurrent?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={clsx('flex items-center gap-1.5 text-xs text-neutral-500', className)}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {item.onClick && !isLast ? (
              <button
                type="button"
                onClick={item.onClick}
                className="hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span
                className={clsx(
                  isLast ? 'font-semibold text-neutral-900 dark:text-white' : 'font-normal'
                )}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className }) => {
  const sizes = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={clsx(
        'rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold flex items-center justify-center shrink-0 overflow-hidden shadow-soft-xs',
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials || 'EP'}</span>
      )}
    </div>
  );
};
