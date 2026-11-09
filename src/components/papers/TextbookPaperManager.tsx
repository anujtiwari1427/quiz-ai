import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  Play, 
  Printer, 
  Copy, 
  Trash2, 
  Plus, 
  Clock, 
  Award, 
  Calendar,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { SavedTestPaper, ExamModel, AttemptModel } from '../../types/schemas';
import { TEXTBOOK_EXAM_SERVICE } from '../../services/textbookExamService';
import { PDF_EXPORT_SERVICE } from '../../services/pdfExportService';
import { TextbookPaperGenerator } from './TextbookPaperGenerator';
import { TextbookPaperPreview } from './TextbookPaperPreview';
import { ExamRunner } from '../exams/ExamRunner';
import { ExamAnalysisView } from '../exams/ExamAnalysisView';
import { useApp } from '../../context/AppContext';

export const TextbookPaperManager: React.FC = () => {
  const { theme } = useApp();
  const isLight = theme === 'light';

  // Subview states: 'generator' | 'preview' | 'saved' | 'runner' | 'analysis'
  const [activeTab, setActiveTab] = useState<'generator' | 'saved' | 'preview'>('generator');
  const [currentPaper, setCurrentPaper] = useState<SavedTestPaper | null>(null);
  const [savedPapers, setSavedPapers] = useState<SavedTestPaper[]>([]);

  // Online test taking states
  const [activeExam, setActiveExam] = useState<ExamModel | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<AttemptModel | null>(null);
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [isAnalysisMode, setIsAnalysisMode] = useState<boolean>(false);

  const loadSavedPapers = () => {
    const papers = TEXTBOOK_EXAM_SERVICE.getSavedPapers();
    setSavedPapers(papers);
    // If no paper active and saved papers exist, select first for preview
    if (!currentPaper && papers.length > 0) {
      setCurrentPaper(papers[0]);
    }
  };

  useEffect(() => {
    loadSavedPapers();
  }, []);

  // When a new paper is generated
  const handlePaperGenerated = (paper: SavedTestPaper) => {
    setCurrentPaper(paper);
    loadSavedPapers();
    setActiveTab('preview');
  };

  // When user updates questions inside preview
  const handlePaperUpdated = (updated: SavedTestPaper) => {
    setCurrentPaper(updated);
    loadSavedPapers();
  };

  // Launch online test mode
  const handleTakeOnlineTest = (paper: SavedTestPaper) => {
    const examModel = TEXTBOOK_EXAM_SERVICE.convertToExamModel(paper);
    setActiveExam(examModel);
    setIsTestMode(true);
    setIsAnalysisMode(false);
  };

  // Finish exam from ExamRunner
  const handleFinishExam = (exam: ExamModel, attempt: AttemptModel) => {
    setActiveExam(exam);
    setActiveAttempt(attempt);
    setIsTestMode(false);
    setIsAnalysisMode(true);
  };

  // Duplicate paper
  const handleDuplicate = (paper: SavedTestPaper) => {
    const copy = TEXTBOOK_EXAM_SERVICE.duplicatePaper(paper.id);
    if (copy) {
      loadSavedPapers();
      setCurrentPaper(copy);
      setActiveTab('preview');
    }
  };

  // Delete paper
  const handleDeletePaper = (paperId: string) => {
    if (window.confirm('Are you sure you want to delete this test paper?')) {
      TEXTBOOK_EXAM_SERVICE.deletePaper(paperId);
      loadSavedPapers();
      if (currentPaper?.id === paperId) {
        setCurrentPaper(null);
        setActiveTab('generator');
      }
    }
  };

  // If in online test mode, show ExamRunner
  if (isTestMode && activeExam) {
    return (
      <ExamRunner
        exam={activeExam}
        onFinishExam={handleFinishExam}
        onExit={() => setIsTestMode(false)}
      />
    );
  }

  // If in exam analysis mode, show ExamAnalysisView
  if (isAnalysisMode && activeExam && activeAttempt) {
    return (
      <ExamAnalysisView
        exam={activeExam}
        attempt={activeAttempt}
        onRetakeExam={() => {
          setIsAnalysisMode(false);
          setIsTestMode(true);
        }}
        onPracticeChapter={() => setIsAnalysisMode(false)}
        onBackToLibrary={() => {
          setIsAnalysisMode(false);
          setActiveTab('saved');
        }}
      />
    );
  }

  return (
    <div className="flex-1 w-full min-h-screen">
      
      {/* Sub Navigation Bar for Test Papers */}
      <div className={`sticky top-16 z-30 border-b backdrop-blur-xl transition-colors ${
        isLight ? 'bg-white/95 border-slate-200 text-slate-900 shadow-xs' : 'bg-[#0e0a1c]/95 border-purple-900/40 text-white'
      }`}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              Textbook Paper Hub
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'generator'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : isLight
                    ? 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-orange-400" />
              <span>Create Paper</span>
            </button>

            {currentPaper && (
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : isLight
                      ? 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Paper Preview</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'saved'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : isLight
                    ? 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-400" />
              <span>Saved Papers ({savedPapers.length})</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main View Area */}
      <div className="pb-16">
        {activeTab === 'generator' && (
          <TextbookPaperGenerator
            onPaperGenerated={handlePaperGenerated}
          />
        )}

        {activeTab === 'preview' && currentPaper && (
          <TextbookPaperPreview
            paper={currentPaper}
            onPaperUpdated={handlePaperUpdated}
            onTakeOnlineTest={handleTakeOnlineTest}
            onBackToGenerator={() => setActiveTab('generator')}
            onDuplicate={handleDuplicate}
          />
        )}

        {activeTab === 'saved' && (
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-display font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Saved Test Papers
                </h2>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Reopen, edit, duplicate, export to PDF, or take your generated papers online.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('generator')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Paper</span>
              </button>
            </div>

            {savedPapers.length === 0 ? (
              <div className={`text-center py-16 rounded-3xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#120f24] border-purple-900/40'
              }`}>
                <FileText className="w-12 h-12 mx-auto text-purple-300 dark:text-purple-600 mb-3" />
                <h3 className="text-sm font-bold">No test papers generated yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Select an uploaded textbook and generate your first board-standard question paper in seconds.
                </p>
                <button
                  onClick={() => setActiveTab('generator')}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>Generate Test Paper</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedPapers.map(paper => (
                  <div
                    key={paper.id}
                    className={`p-5 rounded-3xl border transition-all space-y-4 ${
                      isLight ? 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-sm' : 'bg-[#120f24] border-purple-900/40 hover:border-purple-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {paper.subject || 'General'}
                        </span>
                        <h3 className={`text-sm font-bold mt-1.5 leading-snug line-clamp-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {paper.title}
                        </h3>
                        <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          Book: {paper.bookTitle || 'Custom Textbook'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDuplicate(paper)}
                          title="Duplicate paper"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePaper(paper.id)}
                          title="Delete paper"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-purple-900/30 text-xs font-mono">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        {paper.durationMinutes}m
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        {paper.questions?.length || 0} Questions
                      </span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">
                        {paper.totalMarks} Marks
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          setCurrentPaper(paper);
                          setActiveTab('preview');
                        }}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                          isLight ? 'bg-slate-50 hover:bg-purple-50 hover:border-purple-300 text-slate-700 hover:text-purple-900' : 'bg-white/5 hover:bg-purple-950/40 border-purple-900/40 text-slate-200'
                        }`}
                      >
                        Preview &amp; Edit
                      </button>

                      <button
                        onClick={() => handleTakeOnlineTest(paper)}
                        className="py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Take Online</span>
                      </button>
                    </div>

                    {/* PDF Export Quick Links */}
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <button
                        onClick={() => PDF_EXPORT_SERVICE.exportSavedPaper(paper, 'student_paper')}
                        className="text-purple-700 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Question Paper (PDF)</span>
                      </button>

                      <button
                        onClick={() => PDF_EXPORT_SERVICE.exportSavedPaper(paper, 'marking_scheme')}
                        className="text-orange-600 dark:text-orange-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <FileCheck className="w-3 h-3" />
                        <span>Answer Key (PDF)</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
