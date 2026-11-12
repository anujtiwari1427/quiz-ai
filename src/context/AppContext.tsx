import React, { createContext, useContext, useState, useEffect } from 'react';
import { FILE_SYSTEM_SERVICE } from '../services/fileSystemService';

export type AppView = 
  | 'dashboard'
  | 'library' 
  | 'chapter-manager' 
  | 'question-bank' 
  | 'create-paper' 
  | 'editor' 
  | 'saved-papers'
  | 'templates'
  | 'settings'
  | 'design-system'
  | 'landing';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activePaperId: string | null;
  setActivePaperId: (id: string | null) => void;
  activeTextbookId: string | null;
  setActiveTextbookId: (id: string | null) => void;
  activeBlueprintId: string | null;
  setActiveBlueprintId: (id: string | null) => void;
  
  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  // Command palette
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Settings
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  // First-run Onboarding & Product Tour
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isProductTourOpen: boolean;
  setIsProductTourOpen: (open: boolean) => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Backup Reminder
  showBackupReminder: boolean;
  dismissBackupReminder: () => void;

  // Navigation helpers
  openDashboard: () => void;
  openEditor: (paperId: string) => void;
  openChapterManager: (textbookId: string) => void;
  openCreatePaper: (blueprintId?: string) => void;
  openSavedPapers: () => void;
  openLibrary: () => void;
  openQuestionBank: () => void;
  openTemplates: () => void;
  openDesignSystem: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    // If first visit, show dashboard
    return 'dashboard';
  });

  const [activePaperId, setActivePaperId] = useState<string | null>(null);
  const [activeTextbookId, setActiveTextbookId] = useState<string | null>(null);
  const [activeBlueprintId, setActiveBlueprintId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('edupulse_sidebar_collapsed') === 'true';
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showBackupReminder, setShowBackupReminder] = useState(false);

  // First run onboarding
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    return localStorage.getItem('edupulse_onboarding_done') !== 'true';
  });
  const [isProductTourOpen, setIsProductTourOpen] = useState(false);

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

  useEffect(() => {
    localStorage.setItem('edupulse_sidebar_collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  const dismissBackupReminder = () => {
    setShowBackupReminder(false);
    FILE_SYSTEM_SERVICE.recordBackupEvent();
  };

  const openDashboard = () => setCurrentView('dashboard');

  const openEditor = (paperId: string) => {
    setActivePaperId(paperId);
    setCurrentView('editor');
  };

  const openChapterManager = (textbookId: string) => {
    setActiveTextbookId(textbookId);
    setCurrentView('chapter-manager');
  };

  const openCreatePaper = (blueprintId?: string) => {
    setActiveBlueprintId(blueprintId || null);
    setCurrentView('create-paper');
  };

  const openSavedPapers = () => setCurrentView('saved-papers');
  const openLibrary = () => setCurrentView('library');
  const openQuestionBank = () => setCurrentView('question-bank');
  const openTemplates = () => setCurrentView('templates');
  const openDesignSystem = () => setCurrentView('design-system');

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
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isProductTourOpen,
        setIsProductTourOpen,
        theme,
        setTheme,
        toggleTheme,
        showBackupReminder,
        dismissBackupReminder,
        openDashboard,
        openEditor,
        openChapterManager,
        openCreatePaper,
        openSavedPapers,
        openLibrary,
        openQuestionBank,
        openTemplates,
        openDesignSystem,
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
