import React, { useState } from 'react';
import { 
  BookOpen, 
  Database, 
  Sliders, 
  FileText, 
  Edit3, 
  Settings, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Menu, 
  X,
  HardDrive
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    activePaperId, 
    setIsSettingsOpen, 
    theme, 
    toggleTheme 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'library', label: 'Textbooks', icon: BookOpen },
    { id: 'question-bank', label: 'Question Bank', icon: Database },
    { id: 'blueprints', label: 'Blueprints', icon: Sliders },
    { id: 'saved-papers', label: 'Saved Papers', icon: FileText },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentView('library')}
            className="flex items-center gap-2.5 focus:outline-none group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base leading-none text-slate-900 dark:text-white flex items-center gap-1.5">
                EduPulse AI
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Local-First
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Teacher Exam Generator
              </div>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}

            {/* Active Editor Tab if paper is active */}
            {activePaperId && (
              <button
                onClick={() => setCurrentView('editor')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentView === 'editor'
                    ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 shadow-sm ring-1 ring-violet-400/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Edit3 className="w-4 h-4 text-violet-500 animate-pulse" />
                Paper Editor
              </button>
            )}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Local-First Privacy Pill */}
          <div 
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-medium"
            title="100% offline-ready & stored strictly in IndexedDB on this device."
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Zero Cloud DB</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle color theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-xl transition-all border border-slate-200 dark:border-slate-700"
            title="Configure API Keys, Storage, & Backups"
          >
            <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
          {activePaperId && (
            <button
              onClick={() => {
                setCurrentView('editor');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Edit3 className="w-4 h-4" />
              Active Paper Editor
            </button>
          )}
        </div>
      )}
    </header>
  );
};
