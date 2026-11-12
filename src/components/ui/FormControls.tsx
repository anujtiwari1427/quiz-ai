import React from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import * as RadixSwitch from '@radix-ui/react-switch';
import * as RadixSlider from '@radix-ui/react-slider';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

export interface CheckboxProps {
  id?: string;
  label?: React.ReactNode;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className
}) => {
  const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={clsx('flex items-start gap-2.5 select-none', className)}>
      <RadixCheckbox.Root
        id={checkboxId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={(c) => onCheckedChange?.(c === true)}
        disabled={disabled}
        className={clsx(
          'w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-all duration-150 border',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900',
          'data-[state=checked]:bg-brand-600 data-[state=checked]:border-brand-600 text-white'
        )}
      >
        <RadixCheckbox.Indicator>
          <Check className="w-3 h-3 stroke-[3]" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {(label || description) && (
        <div className="flex flex-col text-left">
          {label && (
            <label
              htmlFor={checkboxId}
              className="text-xs font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export interface SwitchProps {
  id?: string;
  label?: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  id,
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className
}) => {
  const switchId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={clsx('flex items-center justify-between gap-4 select-none', className)}>
      {(label || description) && (
        <div className="flex flex-col text-left">
          {label && (
            <label
              htmlFor={switchId}
              className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
      <RadixSwitch.Root
        id={switchId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={clsx(
          'w-9 h-5 rounded-full transition-colors relative outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          'bg-neutral-200 dark:bg-neutral-700 data-[state=checked]:bg-brand-600 disabled:opacity-50'
        )}
      >
        <RadixSwitch.Thumb
          className={clsx(
            'block w-4 h-4 bg-white rounded-full shadow-soft-xs transition-transform duration-150',
            'translate-x-0.5 data-[state=checked]:translate-x-[18px]'
          )}
        />
      </RadixSwitch.Root>
    </div>
  );
};

export interface SliderProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  unit?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  unit = '%',
  className
}) => {
  return (
    <div className={clsx('w-full space-y-2 text-left select-none', className)}>
      <div className="flex items-center justify-between text-xs">
        {label && <span className="font-semibold text-neutral-700 dark:text-neutral-300">{label}</span>}
        <span className="font-mono font-medium text-brand-600 dark:text-brand-400">
          {value}{unit}
        </span>
      </div>
      <RadixSlider.Root
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => onChange(vals[0])}
        className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
      >
        <RadixSlider.Track className="bg-neutral-200 dark:bg-neutral-700 relative grow rounded-full h-1.5 overflow-hidden">
          <RadixSlider.Range className="absolute bg-brand-600 h-full rounded-full" />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          className="block w-4 h-4 bg-white border border-brand-600 shadow-soft-xs rounded-full hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-transform"
          aria-label={label || 'Slider'}
        />
      </RadixSlider.Root>
    </div>
  );
};
