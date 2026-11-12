import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { AppSidebar } from './components/layout/AppSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { MobileDrawer, MobileBottomBar } from './components/layout/MobileNav';
import { OnboardingModal } from './components/layout/OnboardingModal';
import { ProductTourModal } from './components/layout/ProductTourModal';
import { CommandPalette } from './components/ui/CommandPalette';
import { ToastProvider } from './components/ui/Toast';
import { Alert } from './components/ui/Alert';
import { Button } from './components/ui/Button';
import { FileText } from 'lucide-react';

// Main Application Views
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { TextbookLibraryView } from './components/library/TextbookLibraryView';
import { ChapterManagerView } from './components/library/ChapterManagerView';
import { QuestionBankView } from './components/questions/QuestionBankView';
import { CreatePaperWizard } from './components/wizard/CreatePaperWizard';
import { PaperEditorView } from './components/editor/PaperEditorView';
import { SavedPapersHub } from './components/papers/SavedPapersHub';
import { TemplatesHub } from './components/templates/TemplatesHub';
import { SettingsView } from './components/settings/SettingsView';
import { SettingsModal } from './components/settings/SettingsModal';
import { DesignSystemShowcase } from './components/ui/DesignSystemShowcase';
import { MarketingLandingView } from './components/marketing/MarketingLandingView';

export const AppContent: React.FC = () => {
  const { 
    currentView, 
    setCurrentView,
    activePaperId, 
    activeTextbookId, 
    activeBlueprintId,
    isSettingsOpen, 
    setIsSettingsOpen,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isOnboardingOpen,
    setIsOnboardingOpen,
    isProductTourOpen,
    setIsProductTourOpen,
    toggleTheme,
    showBackupReminder,
    dismissBackupReminder,
    openEditor,
    openChapterManager,
    openCreatePaper,
    openSavedPapers,
    openLibrary,
    openDashboard
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex font-sans transition-colors antialiased selection:bg-brand-500 selection:text-white">
        
        {/* Collapsible Left Sidebar (Desktop) */}
        <AppSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Sticky SaaS Top Navigation Bar */}
          <AppHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

          {/* Local Backup Reminder Banner */}
          {showBackupReminder && (
            <div className="p-4 pb-0 max-w-7xl mx-auto w-full">
              <Alert
                variant="warning"
                title="Local Backup Recommended"
                onDismiss={dismissBackupReminder}
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentView('settings');
                      dismissBackupReminder();
                    }}
                    className="bg-white dark:bg-neutral-900 mt-1"
                  >
                    Backup Now to Local ZIP
                  </Button>
                }
              >
                EduPulse AI stores textbooks, question banks, and generated exam papers strictly on your device inside IndexedDB. Export a backup ZIP periodically so you never lose your work.
              </Alert>
            </div>
          )}

          {/* Dynamic View Content */}
          <main className="flex-1 pb-20 md:pb-8">
            {currentView === 'dashboard' && <TeacherDashboard />}

            {currentView === 'library' && (
              <TextbookLibraryView
                onSelectChapterManager={openChapterManager}
                onOpenSettings={() => setCurrentView('settings')}
              />
            )}

            {currentView === 'chapter-manager' && (
              <ChapterManagerView
                textbookId={activeTextbookId || ''}
                onBack={openLibrary}
              />
            )}

            {currentView === 'question-bank' && <QuestionBankView />}

            {currentView === 'create-paper' && (
              <CreatePaperWizard
                initialBlueprintId={activeBlueprintId || undefined}
                onPaperGenerated={(paperId) => openEditor(paperId)}
                onCancel={openDashboard}
              />
            )}

            {currentView === 'editor' && (
              activePaperId ? (
                <PaperEditorView
                  paperId={activePaperId}
                  onBack={openSavedPapers}
                />
              ) : (
                <div className="max-w-xl mx-auto py-24 text-center px-4 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">No Active Paper Loaded</h2>
                  <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                    Select a paper from your Saved Papers collection, or start generating a new examination paper with the wizard.
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <Button variant="secondary" onClick={openSavedPapers}>
                      Go to Saved Papers
                    </Button>
                    <Button variant="primary" onClick={() => openCreatePaper()}>
                      Create New Paper
                    </Button>
                  </div>
                </div>
              )
            )}

            {currentView === 'saved-papers' && (
              <SavedPapersHub
                onOpenEditor={openEditor}
                onCreateNew={() => openCreatePaper()}
                onReuseBlueprint={(bId) => openCreatePaper(bId)}
              />
            )}

            {currentView === 'templates' && <TemplatesHub />}

            {currentView === 'settings' && <SettingsView />}

            {currentView === 'design-system' && <DesignSystemShowcase />}

            {currentView === 'landing' && <MarketingLandingView />}
          </main>

          {/* Mobile Drawer (Slide-Over Menu) */}
          <MobileDrawer
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Thumb-Friendly Bottom Navigation Bar */}
          <MobileBottomBar />

          {/* Global Command Palette Dialog (⌘K / Ctrl+K) */}
          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            onNavigate={(view) => {
              setCurrentView(view);
              setIsCommandPaletteOpen(false);
            }}
            onToggleTheme={toggleTheme}
            onOpenSettings={() => {
              setCurrentView('settings');
              setIsCommandPaletteOpen(false);
            }}
          />

          {/* First-Run Onboarding Modal */}
          <OnboardingModal
            isOpen={isOnboardingOpen}
            onClose={() => setIsOnboardingOpen(false)}
            onComplete={() => setIsOnboardingOpen(false)}
          />

          {/* Interactive Product Tour Modal */}
          <ProductTourModal
            isOpen={isProductTourOpen}
            onClose={() => setIsProductTourOpen(false)}
          />

          {/* Secondary Settings Modal */}
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </div>
      </div>
    </ToastProvider>
  );
};

export default AppContent;
