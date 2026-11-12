import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { clsx } from 'clsx';
import { 
  Search, 
  FileText, 
  BookOpen, 
  Database, 
  Sliders, 
  Settings, 
  Plus, 
  Download, 
  Sun, 
  Moon, 
  ArrowRight
} from 'lucide-react';
import { KbdHint } from './Misc';

export interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Settings';
  icon: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: any) => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onToggleTheme,
  onOpenSettings
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    {
      id: 'nav-dash',
      title: 'Go to Dashboard',
      category: 'Navigation',
      icon: <FileText className="w-4 h-4 text-structure-600" />,
      onSelect: () => { onNavigate('dashboard'); onClose(); }
    },
    {
      id: 'nav-lib',
      title: 'Go to Textbook Library',
      category: 'Navigation',
      icon: <BookOpen className="w-4 h-4 text-structure-600" />,
      onSelect: () => { onNavigate('library'); onClose(); }
    },
    {
      id: 'nav-qb',
      title: 'Go to Question Bank',
      category: 'Navigation',
      icon: <Database className="w-4 h-4 text-structure-600" />,
      onSelect: () => { onNavigate('question-bank'); onClose(); }
    },
    {
      id: 'nav-bp',
      title: 'Create Paper / Blueprint Wizard',
      category: 'Navigation',
      icon: <Plus className="w-4 h-4 text-brand-600" />,
      shortcut: 'N',
      onSelect: () => { onNavigate('create-paper'); onClose(); }
    },
    {
      id: 'nav-papers',
      title: 'Saved Exam Papers Hub',
      category: 'Navigation',
      icon: <FileText className="w-4 h-4 text-structure-600" />,
      onSelect: () => { onNavigate('saved-papers'); onClose(); }
    },
    {
      id: 'nav-tpl',
      title: 'Blueprint Templates',
      category: 'Navigation',
      icon: <Sliders className="w-4 h-4 text-structure-600" />,
      onSelect: () => { onNavigate('templates'); onClose(); }
    },
    {
      id: 'act-upload',
      title: 'Upload New Textbook PDF',
      category: 'Actions',
      icon: <Plus className="w-4 h-4 text-brand-600" />,
      onSelect: () => { onNavigate('library'); onClose(); }
    },
    {
      id: 'act-theme',
      title: 'Toggle Light / Dark Mode',
      category: 'Settings',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      shortcut: 'T',
      onSelect: () => { onToggleTheme(); onClose(); }
    },
    {
      id: 'nav-settings',
      title: 'Open Settings (Storage, API Keys, Backup)',
      category: 'Settings',
      icon: <Settings className="w-4 h-4 text-neutral-500" />,
      shortcut: ',',
      onSelect: () => { onOpenSettings(); onClose(); }
    },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].onSelect();
      }
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-950/40 dark:bg-neutral-950/70 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
        <Dialog.Content
          onKeyDown={handleKeyDown}
          className="fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-soft-lg outline-none animate-in zoom-in-95"
        >
          {/* Input field */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800">
            <Search className="w-5 h-5 text-neutral-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Type a command or search screens (e.g., 'Upload', 'Paper', 'Settings')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
            />
            <KbdHint>ESC</KbdHint>
          </div>

          {/* Results list */}
          <div className="max-h-[320px] overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                No matching commands found.
              </div>
            ) : (
              <div className="space-y-1">
                {filtered.map((cmd, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      onClick={cmd.onSelect}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={clsx(
                        'flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs font-medium transition-colors select-none',
                        isSelected
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                          : 'text-neutral-700 dark:text-neutral-300'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="shrink-0">{cmd.icon}</span>
                        <span>{cmd.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-400 font-normal">
                          {cmd.category}
                        </span>
                        {cmd.shortcut && <KbdHint>{cmd.shortcut}</KbdHint>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-950/60 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Use ↑↓ to navigate, Enter to select</span>
            <span>EduPulse Command Palette</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
