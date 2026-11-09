import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Cpu, 
  Layers,
  Menu,
  X,
  ChevronRight,
  Home,
  Sun,
  Moon,
  BookOpen,
  Shield,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LIVE_AI_SERVICE } from '../../services/liveAiService';
import { AiSettingsModal } from '../studio/AiSettingsModal';
import { MarklabButton } from '../common/MarklabButton';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
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
      <header className={`sticky top-0 z-50 w-full transition-all duration-200 border-b ${
        isLight 
          ? 'bg-white/90 backdrop-blur-md border-[#dcdde2] text-[#202342] shadow-[0_2px_12px_rgba(32,35,66,0.04)]' 
          : 'bg-[#202342]/95 backdrop-blur-md border-white/10 text-white shadow-md'
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo with Marklab styling */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('marketing')}
              className="flex items-center gap-3 focus:outline-none group text-left"
            >
              <div className="relative w-10 h-10 rounded-2xl bg-[#edf2ff] border border-[#c2d4ff] p-2 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                <img 
                  src="/marklab/flash-dynamic-gradient.svg" 
                  alt="EduPulse AI Logo" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={`font-['Tasaorbiterdeck',sans-serif] font-bold text-xl tracking-tight leading-none ${
                    isLight ? 'text-[#202342]' : 'text-white'
                  }`}>
                    EduPulse <span className="text-[#4555fd]">AI</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-[#edf2ff] text-[#4555fd] border border-[#c2d4ff]">
                    K-12 Board
                  </span>
                </div>
                <span className={`text-[11px] font-medium hidden sm:block ${
                  isLight ? 'text-[#4e516a]' : 'text-[#a2a3b1]'
                }`}>
                  AI Assessment &amp; Intelligence
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Links (Marklab pill-tab design) */}
          <nav className={`hidden lg:flex items-center gap-1.5 p-1.5 rounded-full border transition-colors ${
            isLight 
              ? 'bg-[#efeff1]/80 border-[#dcdde2]' 
              : 'bg-white/[0.06] border-white/10'
          }`}>
            <button
              onClick={() => setCurrentView('marketing')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                currentView === 'marketing'
                  ? 'bg-[#4555fd] text-white shadow-sm font-semibold'
                  : isLight
                    ? 'text-[#202342] hover:text-[#4555fd] hover:bg-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setCurrentView('paper-builder')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                currentView === 'paper-builder'
                  ? 'bg-[#4555fd] text-white shadow-sm font-semibold'
                  : isLight
                    ? 'text-[#202342] hover:text-[#4555fd] hover:bg-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Canvas Studio</span>
            </button>

            <button
              onClick={() => setCurrentView('books')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                currentView === 'books'
                  ? 'bg-[#4555fd] text-white shadow-sm font-semibold'
                  : isLight
                    ? 'text-[#202342] hover:text-[#4555fd] hover:bg-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>NCERT Reader</span>
            </button>

            <button
              onClick={() => setCurrentView('ai-paper-gen')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                currentView === 'ai-paper-gen'
                  ? 'bg-[#4555fd] text-white shadow-sm font-semibold'
                  : isLight
                    ? 'text-[#202342] hover:text-[#4555fd] hover:bg-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4555fd] group-hover:text-white" />
              <span>AI Blueprint</span>
            </button>
          </nav>

          {/* Right Action Elements */}
          <div className="flex items-center gap-3">
            {/* Live AI Status Pill */}
            <button
              onClick={() => setShowAiSettings(true)}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                isLive
                  ? 'bg-[#edf2ff] text-[#4555fd] border-[#c2d4ff] hover:bg-[#dde9ff]'
                  : isLight
                    ? 'bg-[#efeff1] text-[#4e516a] border-[#dcdde2] hover:border-[#4555fd]'
                    : 'bg-white/5 text-slate-300 border-white/10'
              }`}
              title="Configure Gemini 2.0 AI API Key"
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#4555fd] animate-pulse' : 'bg-amber-500'}`} />
              <Cpu className="w-3.5 h-3.5" />
              <span>{isLive ? 'Gemini AI Active' : 'Configure AI'}</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-colors ${
                isLight 
                  ? 'bg-white text-[#202342] border-[#dcdde2] hover:bg-[#edf2ff] hover:text-[#4555fd]' 
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Theme"
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
            </button>

            {/* Launch Studio Button with Marklab Rolling Text Effect */}
            <MarklabButton
              onClick={() => setCurrentView('paper-builder')}
              variant="primary"
              className="hidden sm:inline-flex"
            >
              Launch Studio
            </MarklabButton>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl border transition-colors ${
                isLight 
                  ? 'bg-white border-[#dcdde2] text-[#202342]' 
                  : 'bg-white/10 border-white/20 text-white'
              }`}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-t px-4 py-4 space-y-2 ${
            isLight ? 'bg-white border-[#dcdde2]' : 'bg-[#202342] border-white/10'
          }`}>
            <button
              onClick={() => {
                setCurrentView('marketing');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold hover:bg-[#edf2ff] text-[#202342]"
            >
              <span className="flex items-center gap-2">
                <Home className="w-4 h-4 text-[#4555fd]" />
                <span>Overview (Home)</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#a2a3b1]" />
            </button>

            <button
              onClick={() => {
                setCurrentView('paper-builder');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold hover:bg-[#edf2ff] text-[#202342]"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#4555fd]" />
                <span>Canvas Studio (QP-M)</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#a2a3b1]" />
            </button>

            <button
              onClick={() => {
                setCurrentView('books');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold hover:bg-[#edf2ff] text-[#202342]"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#4555fd]" />
                <span>NCERT Textbook Reader</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#a2a3b1]" />
            </button>

            <button
              onClick={() => {
                setCurrentView('ai-paper-gen');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold hover:bg-[#edf2ff] text-[#202342]"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4555fd]" />
                <span>AI Blueprint Generator</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#a2a3b1]" />
            </button>

            <div className="pt-3 border-t border-[#dcdde2] flex items-center justify-between">
              <button
                onClick={() => {
                  setShowAiSettings(true);
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-semibold text-[#4555fd] flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>{isLive ? 'Gemini 2.0 Live' : 'AI Setup'}</span>
              </button>
              <MarklabButton
                onClick={() => {
                  setCurrentView('paper-builder');
                  setMobileMenuOpen(false);
                }}
                variant="primary"
              >
                Launch Studio
              </MarklabButton>
            </div>
          </div>
        )}
      </header>

      {/* AI Key Settings Modal */}
      <AiSettingsModal isOpen={showAiSettings} onClose={() => setShowAiSettings(false)} />
    </>
  );
};

export default Navbar;
