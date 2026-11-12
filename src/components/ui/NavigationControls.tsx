import React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  content?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  variant?: 'pill' | 'underline';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  defaultValue = tabs[0]?.id,
  onValueChange,
  variant = 'pill',
  className
}) => {
  return (
    <RadixTabs.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className={clsx('w-full', className)}
    >
      <RadixTabs.List
        className={clsx(
          'flex items-center gap-1 overflow-x-auto select-none',
          variant === 'pill'
            ? 'p-1 bg-neutral-100 dark:bg-neutral-800/70 rounded-xl border border-neutral-200/80 dark:border-neutral-700/60 inline-flex'
            : 'border-b border-neutral-200 dark:border-neutral-800 gap-6'
        )}
      >
        {tabs.map((tab) => (
          <RadixTabs.Trigger
            key={tab.id}
            value={tab.id}
            className={clsx(
              'flex items-center gap-2 text-xs font-semibold rounded-lg transition-all outline-none whitespace-nowrap',
              variant === 'pill' && [
                'px-3 py-1.5',
                'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white',
                'data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white data-[state=active]:shadow-soft-xs',
              ],
              variant === 'underline' && [
                'pb-2.5 pt-1 px-1 -mb-px border-b-2 border-transparent',
                'text-neutral-500 hover:text-neutral-900 dark:hover:text-white',
                'data-[state=active]:border-brand-600 data-[state=active]:text-brand-600 dark:data-[state=active]:text-brand-400',
              ]
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && <span>{tab.badge}</span>}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {tabs.map((tab) => (
        <RadixTabs.Content
          key={tab.id}
          value={tab.id}
          className="mt-4 outline-none focus:outline-none"
        >
          {tab.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
};

export interface StepItem {
  id: string;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStepIndex,
  onStepClick,
  className
}) => {
  return (
    <nav aria-label="Progress" className={clsx('w-full', className)}>
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isClickable = onStepClick && (isCompleted || isCurrent);

          return (
            <li
              key={step.id}
              className={clsx(
                'relative flex-1 flex flex-col items-center group',
                idx !== steps.length - 1 && 'after:content-[""] after:w-full after:h-0.5 after:border-b after:border-neutral-200 dark:after:border-neutral-800 after:top-4 after:left-1/2 after:absolute after:-z-0'
              )}
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => onStepClick?.(idx)}
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all relative z-10 focus:outline-none',
                  isCompleted && 'bg-emerald-600 text-white shadow-soft-xs',
                  isCurrent && 'bg-brand-600 text-white shadow-soft ring-4 ring-brand-100 dark:ring-brand-950/60',
                  !isCompleted && !isCurrent && 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border border-neutral-300 dark:border-neutral-700',
                  isClickable && 'cursor-pointer hover:scale-105'
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </button>

              <div className="mt-2 text-center">
                <div
                  className={clsx(
                    'text-xs font-bold transition-colors',
                    isCurrent && 'text-brand-600 dark:text-brand-400',
                    isCompleted && 'text-neutral-800 dark:text-neutral-200',
                    !isCompleted && !isCurrent && 'text-neutral-400 dark:text-neutral-500'
                  )}
                >
                  {step.title}
                </div>
                {step.description && (
                  <p className="hidden sm:block text-[10px] text-neutral-400 mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
