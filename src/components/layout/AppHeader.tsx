import React from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Plus, 
  HardDrive, 
  ShieldCheck, 
  HelpCircle,
  Menu,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { KbdHint } from '../ui/Misc';
import { Tooltip } from '../ui/Tooltip';

export interface AppHeaderProps {
  onOpenMobileMenu: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenMobileMenu }) => {
  const { 
    currentView, 
    openCreatePaper, 
    setIsCommandPaletteOpen, 
    theme, 
    toggleTheme,
    setIsProductTourOpen
  } = useApp();

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    library: 'Textbook Library',
    'chapter-manager': 'Chapter Manager',
    'question-bank': 'Question Bank',
    'create-paper': 'Create Examination Paper',
    editor: 'Paper Editor',
    'saved-papers': 'Saved Exam Papers',
    templates: 'Blueprint Templates',
    settings: 'Settings & Storage',
    'design-system': 'Design System',
    landing: 'Home',
  };

  return (
    <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      
      {/* Left: Mobile menu + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
            {viewTitles[currentView] || 'EduPulse AI'}
          </h2>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-400">
            <span>Local Storage</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Auto-Synced</span>
          </div>
        </div>
      </div>

      {/* Center: Global Search / Command Palette Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-neutral-100/80 hover:bg-neutral-100 dark:bg-neutral-800/60 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/60 rounded-xl text-xs text-neutral-400 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span>Search books, papers, or jump to...</span>
          </div>
          <KbdHint>⌘K</KbdHint>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Local-Only Privacy Pill */}
        <Tooltip content="All books, questions & exam drafts remain 100% on your device in IndexedDB." side="bottom">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-medium cursor-help select-none">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Saved locally ✓</span>
          </div>
        </Tooltip>

        {/* Product Tour Trigger */}
        <button
          onClick={() => setIsProductTourOpen(true)}
          className="hidden sm:flex p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
          title="Product Tour"
          aria-label="Product tour"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Primary Action Button (Brand Orange) */}
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => openCreatePaper()}
          className="hidden sm:inline-flex shadow-soft"
        >
          Create Paper
        </Button>
      </div>
    </header>
  );
};
