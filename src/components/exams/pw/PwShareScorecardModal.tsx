import React, { useState } from 'react';
import { X, Share2, Copy, Check, Trophy, Sparkles, Award, QrCode } from 'lucide-react';
import { PwThemeConfig } from './pwTheme';

interface PwShareScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
  examTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  percentile: number;
  rank: number;
  accuracy: number;
  theme: PwThemeConfig;
}

export const PwShareScorecardModal: React.FC<PwShareScorecardModalProps> = ({
  isOpen,
  onClose,
  examTitle,
  score,
  totalMarks,
  percentage,
  percentile,
  rank,
  accuracy,
  theme
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `🎯 I just scored ${score}/${totalMarks} (${percentage}%) with AIR #${rank} in ${examTitle}! Checked my detailed solutions and video explanations on EduPlus Live Test Series. 🚀`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-lg rounded-3xl border ${theme.cardBorder} ${theme.cardBg} shadow-2xl p-6 sm:p-8 space-y-6`}>
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#5a4bda] text-white flex items-center justify-center font-bold text-xs">
              EP
            </div>
            <div>
              <h3 className={`text-base font-bold ${theme.textPrimary}`}>EduPlus Scorecard</h3>
              <p className={`text-xs ${theme.textMuted}`}>Share your achievement with batchmates &amp; teachers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border ${theme.subCardBorder} ${theme.subCardBg} ${theme.textMuted} hover:${theme.textPrimary}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Visual PW Achievement Card */}
        <div className="relative overflow-hidden rounded-3xl p-6 border border-white/10 bg-gradient-to-br from-[#121936] via-[#0d142b] to-[#080d1e] text-white shadow-2xl space-y-5">
          {/* Subtle glow circles */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-44 h-44 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Banner */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#5a4bda] text-[10px] font-black tracking-widest text-white uppercase shadow-sm">
                EduPlus Official
              </span>
              <span className="text-[11px] font-semibold text-indigo-200">AITS Test Series</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">ID: EDUPLUS-2026-6A7</span>
          </div>

          {/* Rank & Score Hero */}
          <div className="relative z-10 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
              <Trophy className="w-3.5 h-3.5" />
              <span>ALL INDIA RANK #{rank}</span>
            </div>

            <div className="pt-1">
              <div className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white">
                {score} <span className="text-xl font-normal text-slate-400">/ {totalMarks}</span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5 line-clamp-1">{examTitle}</p>
            </div>
          </div>

          {/* Metrics Pill Grid */}
          <div className="relative z-10 grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Percentile</span>
              <span className="text-base font-extrabold text-amber-400">{percentile}th</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Accuracy</span>
              <span className="text-base font-extrabold text-emerald-400">{accuracy}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Status</span>
              <span className="text-base font-extrabold text-blue-400">Qualified</span>
            </div>
          </div>

          {/* Bottom Verification & QR */}
          <div className="relative z-10 flex items-center justify-between pt-1 text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>EduPlus Verified Result Card</span>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <QrCode className="w-3.5 h-3.5 text-slate-300" />
              <span>SCAN TO VERIFY</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleCopy}
            className={`py-2.5 px-4 rounded-xl border ${theme.subCardBorder} ${theme.subCardBg} ${theme.textPrimary} hover:${theme.cardBorder} text-xs font-bold flex items-center justify-center gap-2 transition-colors`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary Link'}</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
};
