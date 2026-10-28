import React from 'react';
import { 
  Trophy, Share2, Printer, RotateCcw, ArrowLeft, 
  Moon, Sun, Sparkles, CheckCircle2, ShieldCheck,
  Layers, BarChart2, BookOpen, Clock, Award
} from 'lucide-react';
import { PwThemeConfig, PwThemeMode, PW_THEMES } from './pwTheme';

interface PwHeaderProps {
  testTitle: string;
  testId: string;
  activeTab: number;
  onTabChange: (tabIndex: number) => void;
  currentTheme: PwThemeConfig;
  onThemeChange: (mode: PwThemeMode) => void;
  onOpenShareModal: () => void;
  onRetakeExam: () => void;
  onBackToLibrary: () => void;
}

export const PwHeader: React.FC<PwHeaderProps> = ({
  testTitle,
  testId,
  activeTab,
  onTabChange,
  currentTheme,
  onThemeChange,
  onOpenShareModal,
  onRetakeExam,
  onBackToLibrary
}) => {
  const tabs = [
    { id: 0, label: 'Overview', icon: BarChart2, badge: null },
    { id: 1, label: 'Leaderboard', icon: Trophy, badge: 'Top 10' },
    { id: 2, label: 'Solutions', icon: Layers, badge: 'Q-Palette' }, // activeTabIndex=2
    { id: 3, label: 'Chapter Mastery', icon: BookOpen, badge: null },
    { id: 4, label: 'Time & Strategy', icon: Clock, badge: null },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`border-b ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-colors duration-200 shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            {/* EduPlus Breadcrumb */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <button 
                onClick={onBackToLibrary}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Library</span>
              </button>
              <span className="text-slate-500">•</span>
              <span className="px-2 py-0.5 rounded-md bg-[#5a4bda]/15 text-[#818cf8] font-bold text-[11px] uppercase tracking-wider">
                EduPlus Practice Test Series
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Attempt Completed</span>
              </span>
            </div>

            {/* Title & Metadata */}
            <h1 className={`text-xl sm:text-2xl font-display font-black tracking-tight ${currentTheme.textPrimary} flex items-center gap-2.5`}>
              <span>{testTitle}</span>
            </h1>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono flex-wrap">
              <span>Test ID: <span className="text-[#818cf8]">{testId.slice(0, 16)}</span></span>
              <span>•</span>
              <span>Source: <strong className="text-slate-300">TEST_SERIES</strong></span>
              <span>•</span>
              <span className="text-amber-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>EduPlus AI Verified Diagnostic</span>
              </span>
            </div>
          </div>

          {/* Quick Controls: Theme Switcher & Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Theme Selector Toggle */}
            <div className={`p-1 rounded-2xl border ${currentTheme.subCardBorder} ${currentTheme.subCardBg} flex items-center gap-1 text-xs`}>
              <button
                onClick={() => onThemeChange('pw-dark')}
                className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-xs font-semibold ${
                  currentTheme.mode === 'pw-dark'
                    ? 'bg-[#5a4bda] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="EduPlus Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">EduPlus Dark</span>
              </button>

              <button
                onClick={() => onThemeChange('pw-light')}
                className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-xs font-semibold ${
                  currentTheme.mode === 'pw-light'
                    ? 'bg-[#5a4bda] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-800'
                }`}
                title="EduPlus Clean White"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">EduPlus Light</span>
              </button>

              <button
                onClick={() => onThemeChange('pw-cyber')}
                className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-xs font-semibold ${
                  currentTheme.mode === 'pw-cyber'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
                title="EduPlus Cyber Mode"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cyber</span>
              </button>
            </div>

            {/* Share Scorecard */}
            <button
              onClick={onOpenShareModal}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border ${currentTheme.subCardBorder} ${currentTheme.subCardBg} ${currentTheme.textPrimary} hover:${currentTheme.cardBorder} text-xs font-bold flex items-center gap-1.5 transition-colors`}
              title="Share Result Badge"
            >
              <Share2 className="w-3.5 h-3.5 text-[#818cf8]" />
              <span className="hidden sm:inline">Share Card</span>
            </button>

            {/* Print / Download Report PDF */}
            <button
              onClick={handlePrint}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border ${currentTheme.subCardBorder} ${currentTheme.subCardBg} ${currentTheme.textPrimary} hover:${currentTheme.cardBorder} text-xs font-bold flex items-center gap-1.5 transition-colors`}
              title="Print / Export PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">PDF Report</span>
            </button>

            {/* Retake Paper */}
            <button
              onClick={onRetakeExam}
              className={`px-3.5 py-1.5 rounded-xl ${currentTheme.accentBtn} text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
          </div>
        </div>

        {/* Physics Wallah Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar border-t border-slate-700/20">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? currentTheme.navActiveBg
                    : `${currentTheme.subCardBg} ${currentTheme.textMuted} hover:${currentTheme.textPrimary}`
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-[#5a4bda]/20 text-[#818cf8]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
