import React, { useState } from 'react';
import { 
  IngestedSource, 
  StudySummary, 
  SmartNotes, 
  FlashcardDeck, 
  StudioQuiz 
} from '../../types/strater';
import { 
  Download, 
  X, 
  FileText, 
  Layers, 
  Printer, 
  FileCode, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { EXPORT_SERVICE } from '../../services/exportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: IngestedSource;
  summary: StudySummary | null;
  notes: SmartNotes | null;
  deck: FlashcardDeck | null;
  quiz: StudioQuiz | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  source,
  summary,
  notes,
  deck,
  quiz
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportMarkdown = () => {
    const md = EXPORT_SERVICE.exportToMarkdown(source, summary, notes, deck, quiz);
    const filename = `${source.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_study_pack.md`;
    EXPORT_SERVICE.downloadStringAsFile(filename, md, 'text/markdown');
    showSuccess('Markdown document downloaded');
  };

  const handleExportAnki = () => {
    if (!deck) return;
    const ankiTxt = EXPORT_SERVICE.exportToAnki(deck);
    const filename = `${deck.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_anki.txt`;
    EXPORT_SERVICE.downloadStringAsFile(filename, ankiTxt, 'text/plain');
    showSuccess('Anki flashcard deck (.txt) downloaded');
  };

  const handleExportJson = () => {
    const data = {
      source,
      summary,
      notes,
      deck,
      quiz,
      exportedAt: new Date().toISOString()
    };
    const filename = `${source.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_backup.json`;
    EXPORT_SERVICE.downloadStringAsFile(filename, JSON.stringify(data, null, 2), 'application/json');
    showSuccess('Complete JSON data archive downloaded');
  };

  const handlePrintSheet = () => {
    EXPORT_SERVICE.triggerPrintStudySheet(source.title);
  };

  const showSuccess = (msg: string) => {
    setDownloadSuccess(msg);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#1c1c1e] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0071e3] to-[#30d158] flex items-center justify-center text-white">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">Export Study Materials</h3>
              <p className="text-xs text-[#86868b]">Download offline artifacts & Anki decks</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#86868b] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-xl bg-[#30d158]/20 border border-[#30d158]/30 text-[#30d158] text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Export Options List */}
        <div className="space-y-3">
          
          {/* Markdown */}
          <button
            onClick={handleExportMarkdown}
            className="w-full p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-left transition-all flex items-start gap-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-[#0071e3]/10 text-[#2997ff] group-hover:bg-[#0071e3] group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Universal Markdown (.md)</div>
              <p className="text-[11px] text-[#86868b] mt-0.5">
                Complete bundle with summary, Cornell notes, flashcards, and assessment quiz.
              </p>
            </div>
          </button>

          {/* Anki Deck */}
          <button
            onClick={handleExportAnki}
            disabled={!deck}
            className="w-full p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] disabled:opacity-40 border border-white/10 text-left transition-all flex items-start gap-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-[#bf5af2]/10 text-[#bf5af2] group-hover:bg-[#bf5af2] group-hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Anki Flashcard Deck (.txt)</div>
              <p className="text-[11px] text-[#86868b] mt-0.5">
                Tab-separated HTML format ready to drag-and-drop into Anki with tags.
              </p>
            </div>
          </button>

          {/* Printable Study Sheet */}
          <button
            onClick={handlePrintSheet}
            className="w-full p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-left transition-all flex items-start gap-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-[#ff9f0a]/10 text-[#ff9f0a] group-hover:bg-[#ff9f0a] group-hover:text-white transition-colors">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Printable Study Sheet / PDF</div>
              <p className="text-[11px] text-[#86868b] mt-0.5">
                High-contrast clean browser print layout for physical binder notes.
              </p>
            </div>
          </button>

          {/* Raw JSON Backup */}
          <button
            onClick={handleExportJson}
            className="w-full p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-left transition-all flex items-start gap-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-white/5 text-[#d1d1d6] group-hover:bg-white/10 group-hover:text-white transition-colors">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Structured Data Backup (.json)</div>
              <p className="text-[11px] text-[#86868b] mt-0.5">
                Complete JSON archive including semantic graph nodes and source telemetry.
              </p>
            </div>
          </button>

        </div>

        <div className="pt-2 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-[#86868b] hover:text-white"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
