import React, { createContext, useContext, useState, useEffect } from 'react';
import { FILE_SYSTEM_SERVICE } from '../services/fileSystemService';

export type AppView = 
  | 'library' 
  | 'chapter-manager' 
  | 'question-bank' 
  | 'blueprints' 
  | 'editor' 
  | 'saved-papers';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activePaperId: string | null;
  setActivePaperId: (id: string | null) => void;
  activeTextbookId: string | null;
  setActiveTextbookId: (id: string | null) => void;
  activeBlueprintId: string | null;
  setActiveBlueprintId: (id: string | null) => void;
  
  // Settings Modal
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Backup Reminder
  showBackupReminder: boolean;
  dismissBackupReminder: () => void;

  // Navigation helpers
  openEditor: (paperId: string) => void;
  openChapterManager: (textbookId: string) => void;
  openBlueprintBuilder: (blueprintId?: string) => void;
  openSavedPapers: () => void;
  openLibrary: () => void;
  openQuestionBank: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('library');
  const [activePaperId, setActivePaperId] = useState<string | null>(null);
  const [activeTextbookId, setActiveTextbookId] = useState<string | null>(null);
  const [activeBlueprintId, setActiveBlueprintId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showBackupReminder, setShowBackupReminder] = useState(false);

  // Theme
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('edupulse_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('edupulse_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Check backup reminder on startup
  useEffect(() => {
    FILE_SYSTEM_SERVICE.shouldShowBackupReminder().then((needed) => {
      if (needed) {
        setShowBackupReminder(true);
      }
    });
  }, []);

  const setTheme = (t: 'light' | 'dark') => setThemeState(t);
  const toggleTheme = () => setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));

  const dismissBackupReminder = () => {
    setShowBackupReminder(false);
    FILE_SYSTEM_SERVICE.recordBackupEvent();
  };

  const openEditor = (paperId: string) => {
    setActivePaperId(paperId);
    setCurrentView('editor');
  };

  const openChapterManager = (textbookId: string) => {
    setActiveTextbookId(textbookId);
    setCurrentView('chapter-manager');
  };

  const openBlueprintBuilder = (blueprintId?: string) => {
    setActiveBlueprintId(blueprintId || null);
    setCurrentView('blueprints');
  };

  const openSavedPapers = () => {
    setCurrentView('saved-papers');
  };

  const openLibrary = () => {
    setCurrentView('library');
  };

  const openQuestionBank = () => {
    setCurrentView('question-bank');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        activePaperId,
        setActivePaperId,
        activeTextbookId,
        setActiveTextbookId,
        activeBlueprintId,
        setActiveBlueprintId,
        isSettingsOpen,
        setIsSettingsOpen,
        theme,
        setTheme,
        toggleTheme,
        showBackupReminder,
        dismissBackupReminder,
        openEditor,
        openChapterManager,
        openBlueprintBuilder,
        openSavedPapers,
        openLibrary,
        openQuestionBank
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
