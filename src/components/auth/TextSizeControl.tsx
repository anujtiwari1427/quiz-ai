import React from 'react';
import { Type, Check, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TextSizeTheme } from '../../types';

interface TextSizeControlProps {
  variant?: 'bar' | 'compact' | 'floating';
  className?: string;
}

export const TextSizeControl: React.FC<TextSizeControlProps> = ({ variant = 'bar', className = '' }) => {
  const { textSizeTheme, setTextSizeTheme } = useApp();

  const options: { id: TextSizeTheme; label: string; desc: string; sizeTag: string }[] = [
    { id: 'normal', label: 'Standard', desc: '100% standard body text', sizeTag: 'A' },
    { id: 'large', label: 'Large (Theme Default)', desc: '115% comfortable reading size', sizeTag: 'A+' },
    { id: 'extra-large', label: 'Extra Large', desc: '130% enhanced accessibility size', sizeTag: 'A++' },
  ];

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.07] border border-white/[0.12] backdrop-blur-xl ${className}`}>
        <div className="flex items-center gap-1 px-2 text-[11px] font-semibold text-slate-300">
          <Type className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Text Size:</span>
        </div>
        {options.map((opt) => {
          const isActive = textSizeTheme === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setTextSizeTheme(opt.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-white/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
              }`}
              title={`${opt.label}: ${opt.desc}`}
            >
              {opt.sizeTag}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#1c1c1e]/90 to-slate-900/90 border border-white/[0.12] p-3 shadow-xl backdrop-blur-2xl ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">Large Text Size Theme</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Senior &amp; Accessibility Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Clearer, larger fonts and spacious layout for effortless reading on desktop and mobile.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 rounded-xl bg-black/40 border border-white/[0.08]">
          {options.map((opt) => {
            const isActive = textSizeTheme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setTextSizeTheme(opt.id)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-white/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="font-mono text-[13px]">{opt.sizeTag}</span>
                <span>{opt.label.split(' ')[0]}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
