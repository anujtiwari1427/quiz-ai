import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Cpu, 
  Type, 
  RotateCcw, 
  Layers,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  Home,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LIVE_AI_SERVICE } from '../../services/liveAiService';
import { AiSettingsModal } from '../studio/AiSettingsModal';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    resetAllDemoData,
    textSizeTheme,
    setTextSizeTheme,
    theme,
    toggleTheme
  } = useApp();

  const [showAiSettings, setShowAiSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLive = LIVE_AI_SERVICE.isLiveAiAvailable();

  const isLight = theme === 'light';

  const cycleTextSize = () => {
    const order: Array<'normal' | 'large' | 'extra-large'> = ['normal', 'large', 'extra-large'];
    const nextIndex = (order.indexOf(textSizeTheme) + 1) % order.length;
    setTextSizeTheme(order[nextIndex]);
  };

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        isLight 
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 text-slate-900 shadow-sm' 
          : 'bg-[#090d16]/95 backdrop-blur-xl border-b border-white/[0.08] text-white shadow-md'
      }`}>
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('marketing')}
              className="flex items-center gap-2.5 focus:outline-none text-left group"
            >
              <div className="relative w-9 h-9 rounded-xl bg-emerald-700 p-2 flex items-center justify-center shadow-sm border border-emerald-800 transition-transform">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-display font-black text-lg tracking-tight leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    QP-<span className="text-emerald-600">M</span>
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    isLight 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-[#00b87c]/15 text-[#34d399] border-[#00b87c]/30'
                  }`}>
                    Pro Studio
                  </span>
                </div>
                <p className={`text-[10px] font-medium tracking-wide hidden sm:block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Professional Question Paper Generator
                </p>
              </div>
            </button>
          </div>

          {/* Center Mode Switcher Tabs */}
          <nav className={`hidden md:flex items-center gap-1 p-1 rounded-2xl border transition-colors ${
            isLight 
              ? 'bg-slate-100/90 border-slate-200' 
              : 'bg-white/[0.04] border-white/[0.08]'
          }`}>
            <button
              onClick={() => setCurrentView('marketing')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'marketing'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setCurrentView('paper-builder')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'paper-builder'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isLight 
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-white/60' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Split Canvas Studio</span>
            </button>

            <button
              onClick={() => setCurrentView('ai-paper-gen')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'ai-paper-gen'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isLight 
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-white/60' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>AI Blueprint</span>
            </button>
          </nav>

          {/* Right Action Utilities */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* White / Dark Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-300'
              }`}
              title={isLight ? 'Switch to Dark Theme' : 'Switch to White Theme'}
            >
              {isLight ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>White Theme</span>
                </>
              )}
            </button>

            {/* Live AI Status / Config Button */}
            <button
              onClick={() => setShowAiSettings(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.08] text-slate-300'
              }`}
              title="Configure Gemini Live AI"
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse' : 'bg-amber-400'}`} />
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-semibold">{isLive ? 'Gemini 2.0 Live' : 'AI Setup'}</span>
            </button>

            {/* Accessibility text size */}
            <button
              onClick={cycleTextSize}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition-colors ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.08] text-slate-300'
              }`}
              title="Cycle Text Size (Normal / Large / Extra-Large)"
            >
              <Type className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-mono text-[10px] uppercase font-bold">{textSizeTheme}</span>
            </button>

            {/* Launch Studio CTA button when on marketing page */}
            {currentView === 'marketing' ? (
              <button
                onClick={() => setCurrentView('paper-builder')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <span>Launch Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (window.confirm('Reset Question Bank and paper sections to default demo data?')) {
                    resetAllDemoData();
                    window.location.reload();
                  }
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs transition-colors ${
                  isLight 
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600' 
                    : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.08] text-slate-400'
                }`}
                title="Reset questions and sections to defaults"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="text-[11px]">Reset</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/[0.06] border-white/[0.1] text-slate-200'
              }`}
            >
              {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => setCurrentView(currentView === 'paper-builder' ? 'marketing' : 'paper-builder')}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-sm"
            >
              {currentView === 'paper-builder' ? 'Overview' : 'Studio'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg border ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/[0.06] border-white/[0.1] text-slate-200'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t px-4 py-3 space-y-2 ${
            isLight ? 'border-slate-200 bg-white' : 'border-white/10 bg-[#0c111d]'
          }`}>
            <button
              onClick={() => {
                setCurrentView('marketing');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${
                currentView === 'marketing' 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : isLight ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span>Overview (Home)</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setCurrentView('paper-builder');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${
                currentView === 'paper-builder' 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : isLight ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Split Canvas Studio (QP-M)</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setCurrentView('ai-paper-gen');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${
                currentView === 'ai-paper-gen' 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : isLight ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>AI Blueprint Generator</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <div className={`pt-2 border-t flex items-center justify-between ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
              <button
                onClick={() => {
                  setShowAiSettings(true);
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>{isLive ? 'Gemini 2.0 Live' : 'AI Setup'}</span>
              </button>
              <button
                onClick={cycleTextSize}
                className={`text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}
              >
                Size: {textSizeTheme.toUpperCase()}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* AI Key Settings Modal */}
      <AiSettingsModal isOpen={showAiSettings} onClose={() => setShowAiSettings(false)} />
    </>
  );
};
