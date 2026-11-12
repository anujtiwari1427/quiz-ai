import React from 'react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';
import { ChevronRight } from 'lucide-react';

export interface DropdownMenuItem {
  label: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = 'end',
  side = 'bottom',
  className
}) => {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>{trigger}</Dropdown.Trigger>

      <Dropdown.Portal>
        <Dropdown.Content
          align={align}
          side={side}
          sideOffset={6}
          className={clsx(
            'z-50 min-w-[180px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-soft-md p-1.5 focus:outline-none animate-in fade-in-0 zoom-in-95',
            className
          )}
        >
          {items.map((item, idx) => {
            if (item.separator) {
              return (
                <Dropdown.Separator
                  key={idx}
                  className="my-1 h-px bg-neutral-100 dark:bg-neutral-800"
                />
              );
            }

            return (
              <Dropdown.Item
                key={idx}
                disabled={item.disabled}
                onClick={item.onClick}
                className={clsx(
                  'flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg cursor-pointer outline-none transition-colors select-none',
                  item.destructive
                    ? 'text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-950/40'
                    : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800',
                  item.disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
                )}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <span className="w-4 h-4 shrink-0 text-neutral-400 dark:text-neutral-500">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-[10px] text-neutral-400 font-mono tracking-wider ml-4">
                    {item.shortcut}
                  </span>
                )}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
};
