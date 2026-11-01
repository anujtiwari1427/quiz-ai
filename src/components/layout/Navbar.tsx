import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Bell, 
  GraduationCap, 
  RotateCcw, 
  Menu, 
  X, 
  Cpu, 
  Layers, 
  FileCheck, 
  ShieldCheck, 
  Users, 
  Sun, 
  Moon, 
  Flame, 
  ChevronLeft,
  ChevronRight,
  Clock,
  BarChart3,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  Type
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LIVE_AI_SERVICE } from '../../services/liveAiService';
import { AiSettingsModal } from '../studio/AiSettingsModal';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    setUserRole, 
    userRole,
    tests,
    setTeacherTab,
    notifications, 
    markNotificationRead,
    resetAllDemoData,
    textSizeTheme,
    setTextSizeTheme
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quizpulse_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAiSettings, setShowAiSettings] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light' | 'emerald'>('dark');

  const notifRef = useRef<HTMLDivElement>(null);
  const unreadNotifs = notifications.filter(n => !n.read);
  const isLive = LIVE_AI_SERVICE.isLiveAiAvailable();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('quizpulse_sidebar_collapsed', String(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'dark' ? 'emerald' : currentTheme === 'emerald' ? 'light' : 'dark';
    setCurrentTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const navigateTo = (view: any, role: 'teacher' | 'student' = 'teacher') => {
    setUserRole(role);
    setCurrentView(view);
    setMobileOpen(false);
    setShowNotifications(false);
  };

  const scrollToSection = (id: string) => {
    if (currentView !== 'marketing') {
      setCurrentView('marketing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
    setShowNotifications(false);
  };

  const cycleTextSize = () => {
    const order: Array<'normal' | 'large' | 'extra-large'> = ['normal', 'large', 'extra-large'];
    const nextIndex = (order.indexOf(textSizeTheme) + 1) % order.length;
    setTextSizeTheme(order[nextIndex]);
  };

  // Navigation Items Definitions
  const mainNavItems = [
    {
      id: 'marketing',
      label: 'AI Quiz Maker',
      shortLabel: 'Quiz Maker',
      description: 'PDFs, URLs & topic engine',
      icon: Sparkles,
      isActive: currentView === 'marketing',
      badge: 'Instant',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      onClick: () => navigateTo('marketing', 'student')
    },
    {
      id: 'teacher',
      label: 'Teacher Hub',
      shortLabel: 'Teacher Hub',
      description: 'Assessment & test manager',
      icon: GraduationCap,
      isActive: currentView === 'teacher',
      badge: tests.length > 0 ? `${tests.length} Tests` : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      onClick: () => navigateTo('teacher', 'teacher')
    },
    {
      id: 'ai-paper-gen',
      label: 'AI Exam Blueprint',
      shortLabel: 'Exam Studio',
      description: 'Official CBSE & ICSE papers',
      icon: FileCheck,
      isActive: currentView === 'ai-paper-gen',
      badge: 'Pro',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      onClick: () => navigateTo('ai-paper-gen', 'teacher')
    },
    {
      id: 'smart-attendance',
      label: 'Smart Attendance',
      shortLabel: 'Attendance',
      description: 'QR, Face & attendance stats',
      icon: Clock,
      isActive: currentView === 'smart-attendance',
      onClick: () => navigateTo('smart-attendance', 'teacher')
    },
    {
      id: 'score-upload',
      label: 'Score Uploader',
      shortLabel: 'Scores',
      description: 'Grade analysis & leaderboard',
      icon: BarChart3,
      isActive: currentView === 'score-upload',
      onClick: () => navigateTo('score-upload', 'teacher')
    }
  ];

  const toolsNavItems = [
    {
      id: 'flashcards',
      label: 'Spaced Flashcards',
      shortLabel: 'Flashcards',
      description: 'SM-2 active recall trainer',
      icon: Layers,
      isActive: false,
      badge: 'SM-2',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      onClick: () => scrollToSection('qg-preview-showcase')
    },
    {
      id: 'proctor',
      label: 'Live Proctor HUD',
      shortLabel: 'Proctoring',
      description: 'Anti-cheat telemetry scoring',
      icon: ShieldCheck,
      isActive: false,
      badge: 'Live',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      onClick: () => {
        navigateTo('teacher', 'teacher');
        setTeacherTab('proctor');
      }
    },
    {
      id: 'pricing',
      label: 'Pricing & Plans',
      shortLabel: 'Pricing',
      description: 'Student & school memberships',
      icon: Users,
      isActive: false,
      onClick: () => scrollToSection('qg-pricing')
    }
  ];

  if (currentView === 'marketing') {
    return (
      <>
        {/* Modern Glass Top Navigation Bar for Website */}
        <header className="sticky top-0 z-50 w-full bg-[#07090e]/85 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
            {/* Brand Logo */}
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 group focus:outline-none text-left"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-slate-800 to-indigo-900/40 p-2 shadow-lg flex items-center justify-center border border-emerald-500/30 group-hover:border-emerald-400/60 group-hover:scale-105 transition-all">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-xl tracking-tight text-white leading-none">
                    Quiz<span className="text-emerald-400">Pulse</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    AI 2.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Exam &amp; Quiz Engine
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.08] backdrop-blur-md">
              <button
                onClick={() => scrollToSection('qg-generator-box')}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                AI Studio
              </button>
              <button
                onClick={() => scrollToSection('qg-preview-showcase')}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Live Demo</span>
              </button>
              <button
                onClick={() => scrollToSection('qg-disciplines')}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                Curriculum
              </button>
              <button
                onClick={() => scrollToSection('qg-features')}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('qg-pricing')}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('qg-faq')}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                FAQ
              </button>
            </nav>

            {/* Right Action Cluster */}
            <div className="hidden lg:flex items-center gap-3">
              {/* AI Key Status badge */}
              <button
                onClick={() => setShowAiSettings(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-slate-300 transition-all"
                title="Configure Google Gemini Live AI"
              >
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-[11px] font-semibold">{isLive ? 'Gemini 2.0 Live' : 'AI Setup'}</span>
              </button>

              {/* Teacher Console Link */}
              <button
                onClick={() => navigateTo('teacher', 'teacher')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/[0.06] border border-white/10 transition-all"
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Teacher Hub</span>
              </button>

              {/* Primary CTA Button */}
              <button
                onClick={() => scrollToSection('qg-generator-box')}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Create Free Quiz</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => scrollToSection('qg-generator-box')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Create
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-xl bg-white/[0.06] border border-white/[0.1] text-slate-200"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Slide-out Menu for Marketing */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-between bg-[#07090e]/98 backdrop-blur-2xl p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 p-2 border border-emerald-500/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="font-display font-black text-lg text-white">Quiz<span className="text-emerald-400">Pulse</span></span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => scrollToSection('qg-generator-box')}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.04] text-white font-semibold text-sm hover:bg-white/[0.08]"
                >
                  ⚡ AI Generator Studio
                </button>
                <button
                  onClick={() => scrollToSection('qg-preview-showcase')}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.04] text-white font-semibold text-sm hover:bg-white/[0.08]"
                >
                  🎯 Live Interactive Demo
                </button>
                <button
                  onClick={() => scrollToSection('qg-disciplines')}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.04] text-white font-semibold text-sm hover:bg-white/[0.08]"
                >
                  📚 Board Curriculums
                </button>
                <button
                  onClick={() => scrollToSection('qg-features')}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.04] text-white font-semibold text-sm hover:bg-white/[0.08]"
                >
                  ✨ Features &amp; Proctor HUD
                </button>
                <button
                  onClick={() => scrollToSection('qg-pricing')}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.04] text-white font-semibold text-sm hover:bg-white/[0.08]"
                >
                  💳 Pricing &amp; Plans
                </button>
                <button
                  onClick={() => {
                    navigateTo('teacher', 'teacher');
                  }}
                  className="w-full text-left p-3 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold text-sm"
                >
                  🎓 Teacher &amp; School Console
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                onClick={() => {
                  setShowAiSettings(true);
                  setMobileOpen(false);
                }}
                className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white flex items-center justify-between"
              >
                <span>{isLive ? 'Gemini 2.0 Connected' : 'Setup Gemini AI Key'}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => scrollToSection('qg-generator-box')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm text-center shadow-lg"
              >
                Create Free AI Quiz
              </button>
            </div>
          </div>
        )}

        <AiSettingsModal isOpen={showAiSettings} onClose={() => setShowAiSettings(false)} />
      </>
    );
  }

  return (
    <>
      {/* ──────────────────────────────────────────────────────────
          1. MOBILE TOP BAR (Visible only on < lg screens)
          ────────────────────────────────────────────────────────── */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-lg">
        {/* Mobile Brand */}
        <button
          onClick={() => navigateTo('marketing', 'student')}
          className="flex items-center gap-2.5 focus:outline-none text-left"
        >
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-1.5 shadow-md flex items-center justify-center border border-white/20">
            <Sparkles className="w-4 h-4 text-[#00b87c]" />
          </div>
          <span className="font-display font-black text-lg tracking-tight text-white leading-none">
            Quiz<span className="text-[#00b87c]">Pulse</span>
          </span>
        </button>

        {/* Mobile Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Generate Button */}
          <button
            onClick={() => scrollToSection('qg-generator-box')}
            className="btn-qg-cta px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-white/[0.06] border border-white/[0.1] text-slate-300"
            title="Toggle Theme"
          >
            {currentTheme === 'dark' ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : currentTheme === 'emerald' ? <Flame className="w-3.5 h-3.5 text-emerald-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-white/[0.06] border border-white/[0.1] text-slate-200 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          2. MOBILE SLIDE-OUT DRAWER (Off-canvas sidebar on < lg)
          ────────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-80 max-w-[85vw] bg-[#0c121e] border-r border-white/10 shadow-2xl flex flex-col justify-between p-4 z-50 overflow-y-auto no-scrollbar">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-1.5 flex items-center justify-center border border-white/20">
                    <Sparkles className="w-4 h-4 text-[#00b87c]" />
                  </div>
                  <div>
                    <span className="font-display font-black text-base tracking-tight text-white">
                      Quiz<span className="text-[#00b87c]">Pulse</span>
                    </span>
                    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#00b87c]/15 text-[#34d399] border border-[#00b87c]/30 font-mono">
                      AI Maker
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Quick Action */}
              <button
                onClick={() => scrollToSection('qg-generator-box')}
                className="w-full btn-qg-cta py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Create New Quiz or Test</span>
              </button>

              {/* Main Workspace Navigation */}
              <div className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Core Workspace
                </div>
                {mainNavItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                        item.isActive
                          ? 'bg-[#00b87c]/15 text-[#34d399] border border-[#00b87c]/30 shadow-md'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${item.isActive ? 'bg-[#00b87c]/20 text-[#00b87c]' : 'bg-white/[0.04] text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{item.label}</div>
                          <div className="text-[10px] text-slate-400">{item.description}</div>
                        </div>
                      </div>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border font-mono ${item.badgeColor || 'bg-white/10 text-slate-300 border-white/20'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Secondary Tools */}
              <div className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Study Suite &amp; Tools
                </div>
                {toolsNavItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{item.label}</div>
                          <div className="text-[10px] text-slate-400">{item.description}</div>
                        </div>
                      </div>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border font-mono ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Bottom Settings */}
            <div className="pt-4 mt-6 border-t border-white/10 space-y-3">
              {/* AI Key config button */}
              <button
                onClick={() => {
                  setShowAiSettings(true);
                  setMobileOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-slate-200 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse' : 'bg-amber-400'}`} />
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>{isLive ? 'Gemini 2.0 Connected' : 'Configure Gemini AI Key'}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={resetAllDemoData}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </button>
                <button
                  onClick={cycleTextSize}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <Type className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-mono">{textSizeTheme.toUpperCase()}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          3. DESKTOP VERTICAL SIDEBAR NAVBAR (Docked on the left side)
          ────────────────────────────────────────────────────────── */}
      <aside 
        className={`hidden lg:flex sticky top-0 h-screen shrink-0 z-30 select-none flex-col justify-between bg-[#0b0f19] border-r border-white/10 shadow-2xl transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Background glow behind sidebar */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#00b87c]/5 to-transparent pointer-events-none" />

        {/* ── Top Section: Logo & Toggle ── */}
        <div className="p-4 border-b border-white/10 relative">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-2`}>
            
            {/* Brand Logo */}
            <button
              onClick={() => navigateTo('marketing', 'student')}
              className="flex items-center gap-3 group focus:outline-none text-left"
              title="QuizPulse AI"
            >
              <div className="relative w-9 h-9 shrink-0">
                <div className="absolute inset-0 rounded-xl bg-[#00b87c]/30 blur-md group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-2 shadow-md flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 text-[#00b87c]" />
                </div>
              </div>

              {!isCollapsed && (
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-black text-lg tracking-tight text-white leading-none">
                      Quiz<span className="text-[#00b87c]">Pulse</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#00b87c]/15 text-[#34d399] border border-[#00b87c]/30 font-mono">
                      AI
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wide truncate mt-0.5">
                    Quizzes &amp; Flashcards
                  </p>
                </div>
              )}
            </button>

            {/* Collapse/Expand Toggle Button (In Header when expanded) */}
            {!isCollapsed && (
              <button
                onClick={toggleCollapse}
                title="Collapse sidebar"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── Center Scrolling Navigation Section ── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-3 py-4 space-y-6">
          
          {/* Primary CTA: Generate Quiz */}
          <div>
            {!isCollapsed ? (
              <button
                onClick={() => scrollToSection('qg-generator-box')}
                className="w-full btn-qg-cta py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-lg shadow-[#00b87c]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Generate Quiz</span>
              </button>
            ) : (
              <div className="relative group flex justify-center">
                <button
                  onClick={() => scrollToSection('qg-generator-box')}
                  className="btn-qg-cta w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-[#00b87c]/20 hover:scale-105 active:scale-95 transition-all"
                  aria-label="Generate Quiz"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </button>
                {/* Floating Tooltip */}
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f172a] border border-white/20 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap shadow-2xl flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00b87c]" />
                  <span>Generate Quiz</span>
                </div>
              </div>
            )}
          </div>

          {/* Group 1: Core Navigation */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Workspace
              </div>
            )}

            {mainNavItems.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={item.onClick}
                    className={`relative w-full flex items-center rounded-xl text-left transition-all ${
                      isCollapsed 
                        ? 'justify-center w-11 h-11 mx-auto' 
                        : 'justify-between px-3 py-2.5 gap-3'
                    } ${
                      item.isActive
                        ? 'bg-gradient-to-r from-[#00b87c]/20 to-[#00b87c]/5 text-[#34d399] border border-[#00b87c]/40 font-semibold shadow-[0_0_15px_rgba(0,184,124,0.15)]'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    {/* Active Left Indicator Strip (expanded mode) */}
                    {item.isActive && !isCollapsed && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-[#00b87c] shadow-[0_0_8px_#00b87c]" />
                    )}

                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`shrink-0 transition-colors ${item.isActive ? 'text-[#00b87c]' : 'text-slate-400 group-hover:text-white'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      {!isCollapsed && (
                        <div className="min-w-0">
                          <div className="text-xs font-semibold leading-tight truncate">
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border font-mono shrink-0 ${item.badgeColor || 'bg-white/10 text-slate-300 border-white/20'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* Tooltip for Collapsed Mode */}
                  {isCollapsed && (
                    <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f172a] border border-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold text-white whitespace-nowrap shadow-2xl flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border font-mono ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Group 2: Secondary Tools & Study Suite */}
          <div className="space-y-1 pt-2 border-t border-white/[0.08]">
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Study &amp; Tools
              </div>
            )}

            {toolsNavItems.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={item.onClick}
                    className={`relative w-full flex items-center rounded-xl text-left text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent transition-all ${
                      isCollapsed 
                        ? 'justify-center w-11 h-11 mx-auto' 
                        : 'justify-between px-3 py-2.5 gap-3'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0 text-slate-400 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      {!isCollapsed && (
                        <div className="min-w-0">
                          <div className="text-xs font-medium leading-tight truncate">
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border font-mono shrink-0 ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* Tooltip for Collapsed Mode */}
                  {isCollapsed && (
                    <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f172a] border border-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold text-white whitespace-nowrap shadow-2xl flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border font-mono ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom Section: Preferences, AI Status, Notifications & Collapse Toggle ── */}
        <div className="p-3 border-t border-white/10 bg-[#070b14]/60 space-y-2">
          
          {/* AI Model Status Button */}
          <div className="relative group">
            <button
              onClick={() => setShowAiSettings(true)}
              className={`w-full flex items-center rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-white transition-all ${
                isCollapsed ? 'justify-center w-11 h-11 mx-auto' : 'justify-between px-3 py-2'
              }`}
              title="Google Gemini AI Engine Key"
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full shrink-0 ${isLive ? 'bg-emerald-400 shadow-[0_0_8px_rgba(48,209,88,0.8)] animate-pulse' : 'bg-amber-400'}`} />
                <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                {!isCollapsed && (
                  <span className="font-mono text-[11px] font-bold text-slate-200">
                    {isLive ? 'Gemini 2.0' : 'Set AI Key'}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${isLive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                  {isLive ? 'ONLINE' : 'CONFIG'}
                </span>
              )}
            </button>

            {isCollapsed && (
              <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f172a] border border-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold text-white whitespace-nowrap shadow-2xl">
                {isLive ? 'Gemini 2.0 Live' : 'Configure AI Key'}
              </div>
            )}
          </div>

          {/* Quick Tools Row: Notifications, Theme, Text Size */}
          <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'justify-between gap-1'} pt-1`}>
            
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all flex items-center justify-center"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00b87c] text-[9px] font-bold text-white flex items-center justify-center shadow-md">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Popover Panel (anchored beside sidebar) */}
              {showNotifications && (
                <div className="fixed left-20 lg:left-64 bottom-14 w-80 rounded-2xl bg-[#0f172a]/95 backdrop-blur-2xl border border-white/[0.15] shadow-2xl p-4 z-50 animate-fade-in-down space-y-3">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Notifications ({unreadNotifs.length} new)
                    </span>
                    <button
                      onClick={() => unreadNotifs.forEach(n => markNotificationRead(n.id))}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mark all read</span>
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="text-center py-4 text-xs text-slate-400">No new notifications</div>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-white">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <div className="relative group">
              <button
                onClick={toggleTheme}
                title={`Theme: ${currentTheme.toUpperCase()} (Click to toggle)`}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all flex items-center justify-center"
              >
                {currentTheme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : currentTheme === 'emerald' ? <Flame className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>
              {isCollapsed && (
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f172a] border border-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold text-white whitespace-nowrap shadow-2xl">
                  Theme: {currentTheme.toUpperCase()}
                </div>
              )}
            </div>

            {/* Text Size Control */}
            {!isCollapsed ? (
              <div className="relative group">
                <button
                  onClick={cycleTextSize}
                  className="px-2 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1"
                  title="Cycle font size theme"
                >
                  <Type className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-mono text-[10px] text-blue-300 font-bold">
                    {textSizeTheme === 'normal' ? 'A' : textSizeTheme === 'large' ? 'A+' : 'A++'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="relative group">
                <button
                  onClick={cycleTextSize}
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all flex items-center justify-center"
                  title="Cycle font size"
                >
                  <Type className="w-4 h-4 text-blue-400" />
                </button>
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f172a] border border-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold text-white whitespace-nowrap shadow-2xl">
                  Text Size: {textSizeTheme.toUpperCase()}
                </div>
              </div>
            )}

            {/* Reset Demo Data Button */}
            <div className="relative group">
              <button
                onClick={resetAllDemoData}
                title="Reset All Demo Data"
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-white transition-all flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {isCollapsed && (
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f172a] border border-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold text-white whitespace-nowrap shadow-2xl">
                  Reset Demo Data
                </div>
              )}
            </div>
          </div>

          {/* Bottom Expand / Collapse Toggle Rail */}
          <button
            onClick={toggleCollapse}
            className={`w-full flex items-center rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white border border-transparent hover:border-white/[0.08] transition-all text-xs font-medium ${
              isCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-2'
            }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-slate-300" />
            ) : (
              <>
                <span className="text-[11px] text-slate-400">Collapse sidebar</span>
                <ChevronLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </aside>

      {/* AI Settings Modal */}
      <AiSettingsModal
        isOpen={showAiSettings}
        onClose={() => setShowAiSettings(false)}
      />
    </>
  );
};

export default Navbar;
