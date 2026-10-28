export type PwThemeMode = 'pw-dark' | 'pw-light' | 'pw-cyber';

export interface PwThemeConfig {
  mode: PwThemeMode;
  name: string;
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  subCardBg: string;
  subCardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  navActiveBg: string;
  navActiveText: string;
  accentBtn: string;
  accentBorder: string;
  accentText: string;
  badgeBg: string;
  correctBadge: string;
  incorrectBadge: string;
  unattemptedBadge: string;
  reviewBadge: string;
}

export const PW_THEMES: Record<PwThemeMode, PwThemeConfig> = {
  'pw-dark': {
    mode: 'pw-dark',
    name: 'EduPlus Dark',
    pageBg: 'bg-[#0a0e17] text-[#f1f5f9]',
    cardBg: 'bg-[#121929]',
    cardBorder: 'border-[#1f2a42]',
    subCardBg: 'bg-[#0d121f]',
    subCardBorder: 'border-[#192337]',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    navActiveBg: 'bg-[#5a4bda] text-white shadow-lg shadow-indigo-600/30',
    navActiveText: 'text-white font-bold',
    accentBtn: 'bg-[#5a4bda] hover:bg-[#6859eb] text-white',
    accentBorder: 'border-[#5a4bda]/50',
    accentText: 'text-[#818cf8]',
    badgeBg: 'bg-[#5a4bda]/15 text-[#a5b4fc] border border-[#5a4bda]/30',
    correctBadge: 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400',
    incorrectBadge: 'bg-rose-500/15 border border-rose-500/40 text-rose-400',
    unattemptedBadge: 'bg-slate-700/30 border border-slate-600/40 text-slate-400',
    reviewBadge: 'bg-amber-500/15 border border-amber-500/40 text-amber-400'
  },
  'pw-light': {
    mode: 'pw-light',
    name: 'EduPlus Light',
    pageBg: 'bg-[#f4f6fb] text-[#0f172a]',
    cardBg: 'bg-[#ffffff] shadow-sm',
    cardBorder: 'border-[#e2e8f0]',
    subCardBg: 'bg-[#f8fafc]',
    subCardBorder: 'border-[#e2e8f0]',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    navActiveBg: 'bg-[#5a4bda] text-white shadow-md shadow-indigo-600/20',
    navActiveText: 'text-white font-bold',
    accentBtn: 'bg-[#5a4bda] hover:bg-[#483ab8] text-white',
    accentBorder: 'border-[#5a4bda]/40',
    accentText: 'text-[#5a4bda]',
    badgeBg: 'bg-[#5a4bda]/10 text-[#4338ca] border border-[#5a4bda]/20',
    correctBadge: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
    incorrectBadge: 'bg-rose-50 border border-rose-200 text-rose-700',
    unattemptedBadge: 'bg-slate-100 border border-slate-200 text-slate-600',
    reviewBadge: 'bg-amber-50 border border-amber-200 text-amber-700'
  },
  'pw-cyber': {
    mode: 'pw-cyber',
    name: 'EduPlus Midnight Cyber',
    pageBg: 'bg-[#030712] text-[#e0e7ff]',
    cardBg: 'bg-[#0a0f24] shadow-[0_0_25px_rgba(6,182,212,0.08)]',
    cardBorder: 'border-[#1e294b]',
    subCardBg: 'bg-[#050917]',
    subCardBorder: 'border-[#15203b]',
    textPrimary: 'text-cyan-50',
    textSecondary: 'text-cyan-200/80',
    textMuted: 'text-slate-400',
    navActiveBg: 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25',
    navActiveText: 'text-white font-bold',
    accentBtn: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/30',
    accentBorder: 'border-cyan-500/40',
    accentText: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    correctBadge: 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300',
    incorrectBadge: 'bg-rose-950/60 border border-rose-500/50 text-rose-300',
    unattemptedBadge: 'bg-slate-900/60 border border-slate-700/60 text-slate-400',
    reviewBadge: 'bg-amber-950/60 border border-amber-500/50 text-amber-300'
  }
};
