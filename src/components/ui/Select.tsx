import React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { clsx } from 'clsx';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  helperText,
  error,
  placeholder = 'Select an option...',
  value,
  defaultValue,
  onValueChange,
  options,
  disabled,
  required,
  className
}) => {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
          {label} {required && <span className="text-brand-600 dark:text-brand-400">*</span>}
        </label>
      )}

      <RadixSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <RadixSelect.Trigger
          aria-label={label || placeholder}
          className={clsx(
            'w-full flex items-center justify-between bg-white dark:bg-neutral-900/80 border text-neutral-900 dark:text-neutral-100 rounded-lg text-sm px-3 py-2 transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/30'
              : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 focus:border-brand-500 focus:ring-brand-500/30',
            className
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className="text-neutral-400">
            <ChevronDown className="w-4 h-4" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-50 min-w-[200px] w-[var(--radix-select-trigger-width)] max-h-[300px] overflow-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-soft-md p-1 animate-in fade-in-80 zoom-in-95"
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={clsx(
                    'relative flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md cursor-pointer select-none outline-none transition-colors',
                    'text-neutral-700 dark:text-neutral-200 data-[highlighted]:bg-neutral-100 dark:data-[highlighted]:bg-neutral-800 data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed'
                  )}
                >
                  <div className="flex flex-col">
                    <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                    {opt.description && (
                      <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                        {opt.description}
                      </span>
                    )}
                  </div>
                  <RadixSelect.ItemIndicator className="text-brand-600 dark:text-brand-400">
                    <Check className="w-4 h-4 ml-2" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {error ? (
        <p className="flex items-center gap-1 text-xs text-danger-600 dark:text-danger-400 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
