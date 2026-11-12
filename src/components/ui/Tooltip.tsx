import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { clsx } from 'clsx';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 200,
  className
}) => {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            sideOffset={4}
            className={clsx(
              'z-50 px-2.5 py-1 text-[11px] font-medium rounded-md shadow-soft bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 select-none animate-in fade-in-0 zoom-in-95',
              className
            )}
          >
            {content}
            <RadixTooltip.Arrow className="fill-neutral-900 dark:fill-neutral-100" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
