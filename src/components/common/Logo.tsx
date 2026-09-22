import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
  className?: string;
  subtitle?: string;
}

const sizeMap = {
  xs: { box: 'w-6 h-6', img: 'w-5 h-5 rounded-md' },
  sm: { box: 'w-8 h-8', img: 'w-7 h-7 rounded-lg' },
  md: { box: 'w-9 h-9', img: 'w-8 h-8 rounded-xl' },
  lg: { box: 'w-12 h-12', img: 'w-10 h-10 rounded-xl' },
  xl: { box: 'w-16 h-16', img: 'w-14 h-14 rounded-2xl' },
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = false,
  textClassName = '',
  className = '',
  subtitle,
}) => {
  const { box, img } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${box} shrink-0`}>
        {/* Subtle glow behind logo */}
        <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-sm" />
        <div className={`relative ${box} rounded-xl bg-white p-0.5 shadow-md flex items-center justify-center overflow-hidden border border-white/20 transition-transform duration-300 hover:scale-105`}>
          <img
            src="/logo.png"
            alt="EduPulse AI Logo"
            className={`${img} object-contain`}
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-black tracking-tight text-white ${textClassName || 'text-[19px]'}`}>
              Edu<span className="gradient-text-emerald">Pulse</span>
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '9px', padding: '2px 6px' }}>AI K-12</span>
          </div>
          {subtitle && (
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
};
