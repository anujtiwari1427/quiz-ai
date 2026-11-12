import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { TextbookLibraryView } from './components/library/TextbookLibraryView';
import { ChapterManagerView } from './components/library/ChapterManagerView';
import { QuestionBankView } from './components/questions/QuestionBankView';
import { BlueprintBuilderView } from './components/blueprint/BlueprintBuilderView';
import { PaperEditorView } from './components/editor/PaperEditorView';
import { SavedPapersHub } from './components/papers/SavedPapersHub';
import { SettingsModal } from './components/settings/SettingsModal';
import { AlertCircle, X } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { 
    currentView, 
    activePaperId, 
    activeTextbookId, 
    activeBlueprintId,
    isSettingsOpen, 
    setIsSettingsOpen,
    showBackupReminder,
    dismissBackupReminder,
    openEditor,
    openChapterManager,
    openBlueprintBuilder,
    openSavedPapers,
    openLibrary
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <Navbar />

      {/* Backup Reminder Banner */}
      {showBackupReminder && (
        <div className="bg-amber-500 text-white px-4 py-2.5 shadow-sm text-xs sm:text-sm font-medium flex items-center justify-between gap-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2 flex-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Local Backup Reminder:</strong> Your data is stored strictly in this browser. Remember to export a backup ZIP periodically so you never lose your textbooks and exam papers.
            </span>
            <button
              onClick={() => {
                setIsSettingsOpen(true);
                dismissBackupReminder();
              }}
              className="ml-3 underline font-bold hover:text-amber-100 whitespace-nowrap"
            >
              Backup Now
            </button>
          </div>
          <button
            onClick={dismissBackupReminder}
            className="p-1 hover:bg-amber-600 rounded"
            title="Dismiss reminder"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main View Container */}
      <main className="flex-1 pb-16">
        {currentView === 'library' && (
          <TextbookLibraryView
            onSelectChapterManager={openChapterManager}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentView === 'chapter-manager' && (
          <ChapterManagerView
            textbookId={activeTextbookId || ''}
            onBack={openLibrary}
          />
        )}

        {currentView === 'question-bank' && (
          <QuestionBankView />
        )}

        {currentView === 'blueprints' && (
          <BlueprintBuilderView
            initialBlueprintId={activeBlueprintId || undefined}
            onPaperGenerated={(paperId: string) => openEditor(paperId)}
          />
        )}

        {currentView === 'editor' && (
          activePaperId ? (
            <PaperEditorView
              paperId={activePaperId}
              onBack={openSavedPapers}
            />
          ) : (
            <div className="max-w-3xl mx-auto py-20 text-center px-4">
              <h2 className="text-xl font-bold mb-2">No Active Paper Selected</h2>
              <p className="text-sm text-slate-500 mb-4">Please select a paper from your Saved Papers hub or generate one via Blueprints.</p>
              <button
                onClick={openSavedPapers}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm"
              >
                Go to Saved Papers
              </button>
            </div>
          )
        )}

        {currentView === 'saved-papers' && (
          <SavedPapersHub
            onOpenEditor={openEditor}
            onCreateNew={() => openBlueprintBuilder()}
            onReuseBlueprint={(bId) => openBlueprintBuilder(bId)}
          />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default AppContent;
