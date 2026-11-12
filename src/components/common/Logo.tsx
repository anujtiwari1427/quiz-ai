import React from 'react';
import { FileText, Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
  className?: string;
  subtitle?: string;
}

const sizeMap = {
  xs: { box: 'w-6 h-6', icon: 'w-3.5 h-3.5', text: 'text-xs', dot: 'w-1.5 h-1.5' },
  sm: { box: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-sm', dot: 'w-2 h-2' },
  md: { box: 'w-9 h-9', icon: 'w-4.5 h-4.5', text: 'text-base', dot: 'w-2 h-2' },
  lg: { box: 'w-11 h-11', icon: 'w-5.5 h-5.5', text: 'text-lg', dot: 'w-2.5 h-2.5' },
  xl: { box: 'w-14 h-14', icon: 'w-7 h-7', text: 'text-xl', dot: 'w-3 h-3' },
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  textClassName = '',
  className = '',
  subtitle,
}) => {
  const { box, icon, text, dot } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon Mark: Deep Indigo base with warm saffron accent */}
      <div className={`relative ${box} rounded-xl bg-brand-700 text-white flex items-center justify-center shadow-soft-xs shrink-0 transition-transform duration-200 group-hover:scale-105`}>
        <FileText className={`${icon} stroke-[2.2]`} />
        {/* Subtle Saffron Accent Dot (Indian Context Craft Nod) */}
        <span className={`absolute -top-0.5 -right-0.5 ${dot} rounded-full bg-accent-500 ring-2 ring-white dark:ring-neutral-900 shadow-xs`} />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 ${textClassName || text}`}>
              EduPulse <span className="text-brand-700 dark:text-brand-400">AI</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              Local
            </span>
          </div>
          {subtitle && (
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium tracking-wide leading-tight">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
