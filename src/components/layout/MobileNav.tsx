import React from 'react';
import { clsx } from 'clsx';
import { 
  LayoutDashboard, 
  PlusCircle, 
  BookOpen, 
  FileText, 
  Settings, 
  X,
  Sliders,
  Database,
  Palette
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView, openCreatePaper } = useApp();

  if (!isOpen) return null;

  const items: { id: AppView; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create-paper', label: 'Create Paper Wizard', icon: PlusCircle },
    { id: 'library', label: 'Textbooks', icon: BookOpen },
    { id: 'question-bank', label: 'Question Bank', icon: Database },
    { id: 'saved-papers', label: 'Saved Papers', icon: FileText },
    { id: 'templates', label: 'Templates', icon: Sliders },
    { id: 'settings', label: 'Settings & Storage', icon: Settings },
    { id: 'design-system', label: 'Design System', icon: Palette },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-neutral-950/50 backdrop-blur-xs transition-opacity" 
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-5 shadow-soft-lg flex flex-col z-50">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-neutral-900 dark:text-white">EduPulse AI</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'create-paper') openCreatePaper();
                  else setCurrentView(item.id);
                  onClose();
                }}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                  isActive
                    ? 'bg-structure-50 text-structure-800 dark:bg-structure-950 dark:text-structure-300'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export const MobileBottomBar: React.FC = () => {
  const { currentView, setCurrentView, openCreatePaper } = useApp();

  const items = [
    { id: 'dashboard' as const, label: 'Home', icon: LayoutDashboard },
    { id: 'library' as const, label: 'Library', icon: BookOpen },
    { id: 'create-paper' as const, label: 'Create', icon: PlusCircle, isPrimary: true },
    { id: 'saved-papers' as const, label: 'Papers', icon: FileText },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 px-2 py-1.5 flex items-center justify-around safe-bottom">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;

        if (item.isPrimary) {
          return (
            <button
              key={item.id}
              onClick={() => openCreatePaper()}
              className="flex flex-col items-center justify-center -mt-5 focus:outline-none"
            >
              <div className="w-11 h-11 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-soft-md border-2 border-white dark:border-neutral-900 active:scale-95 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={clsx(
              'flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors',
              isActive
                ? 'text-structure-700 dark:text-structure-300 font-bold'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            )}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
