import React from 'react';
import { clsx } from 'clsx';
import { 
  LayoutDashboard, 
  PlusCircle, 
  BookOpen, 
  Database, 
  FileText, 
  Sliders, 
  Settings, 
  Palette,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';
import { Tooltip } from '../ui/Tooltip';
import { KbdHint } from '../ui/Misc';

export const AppSidebar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    sidebarCollapsed, 
    toggleSidebar, 
    openCreatePaper,
    setIsProductTourOpen,
    activePaperId
  } = useApp();

  const navGroups: {
    groupTitle?: string;
    items: {
      id: AppView;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      badge?: string;
      isHeroAction?: boolean;
    }[];
  }[] = [
    {
      groupTitle: 'Core',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { 
          id: 'create-paper', 
          label: 'Create Paper', 
          icon: PlusCircle, 
          badge: 'Wizard',
          isHeroAction: true 
        },
        { id: 'saved-papers', label: 'Saved Papers', icon: FileText },
      ],
    },
    {
      groupTitle: 'Library',
      items: [
        { id: 'library', label: 'Textbooks', icon: BookOpen },
        { id: 'question-bank', label: 'Question Bank', icon: Database },
        { id: 'templates', label: 'Templates', icon: Sliders },
      ],
    },
    {
      groupTitle: 'System',
      items: [
        { id: 'settings', label: 'Settings & Backup', icon: Settings },
        { id: 'design-system', label: 'Design System', icon: Palette },
      ],
    },
  ];

  return (
    <aside
      className={clsx(
        'hidden md:flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 transition-all duration-200 ease-out z-30 select-none shrink-0 h-screen sticky top-0',
        sidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-3 text-left focus:outline-none group overflow-hidden"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-soft-xs group-hover:scale-105 transition-transform shrink-0">
            <FileText className="w-4 h-4 stroke-[2.5]" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-sm tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
                EduPulse AI
              </span>
              <span className="text-[10px] text-neutral-400 font-medium tracking-wide">
                Local-First Exam Suite
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!sidebarCollapsed && group.groupTitle && (
              <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                {group.groupTitle}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              const navButton = (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'create-paper') {
                      openCreatePaper();
                    } else {
                      setCurrentView(item.id);
                    }
                  }}
                  className={clsx(
                    'w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 relative group outline-none',
                    item.isHeroAction && !isActive && [
                      'text-brand-700 dark:text-brand-300 bg-brand-50/70 hover:bg-brand-100 dark:bg-brand-950/40 dark:hover:bg-brand-900/60 border border-brand-200/60 dark:border-brand-800/60',
                    ],
                    isActive && [
                      'bg-structure-50 text-structure-800 dark:bg-structure-950/70 dark:text-structure-200 shadow-soft-xs font-bold border border-structure-200/80 dark:border-structure-800/80',
                    ],
                    !isActive && !item.isHeroAction && [
                      'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60',
                    ],
                    sidebarCollapsed && 'justify-center px-0'
                  )}
                >
                  <Icon
                    className={clsx(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive ? 'text-structure-700 dark:text-structure-300' : item.isHeroAction ? 'text-brand-600 dark:text-brand-400' : 'text-neutral-500'
                    )}
                  />
                  {!sidebarCollapsed && (
                    <>
                      <span className="truncate flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider bg-brand-600 text-white shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );

              if (sidebarCollapsed) {
                return (
                  <Tooltip key={item.id} content={item.label} side="right">
                    {navButton}
                  </Tooltip>
                );
              }

              return navButton;
            })}
          </div>
        ))}

        {/* Active Paper Editor link if a paper is actively loaded */}
        {activePaperId && (
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={() => setCurrentView('editor')}
              className={clsx(
                'w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all bg-amber-50 hover:bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60',
                sidebarCollapsed && 'justify-center px-0'
              )}
            >
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
              {!sidebarCollapsed && <span className="truncate">Active Editor</span>}
            </button>
          </div>
        )}
      </div>

      {/* Footer Status & Collapse Toggle */}
      <div className="p-3 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2">
        {!sidebarCollapsed && (
          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-[11px] text-neutral-500">
            <div className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Local-Only</span>
            </div>
            <button
              onClick={() => setIsProductTourOpen(true)}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center gap-1"
              title="Launch interactive tour"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Tour</span>
            </button>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
