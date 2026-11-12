import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Printer, 
  FileText, 
  Download, 
  Trash2, 
  Plus, 
  RotateCcw, 
  Sparkles, 
  Copy, 
  CheckCircle2, 
  ChevronUp, 
  ChevronDown,
  Layers,
  ArrowRightLeft,
  X,
  FileCheck
} from 'lucide-react';
import { db } from '../../db';
import { SavedPaper, PaperSection, PaperQuestion, QuestionItem } from '../../types';
import { PAPER_EXPORT_SERVICE } from '../../services/paperExportService';
import { AI_PROVIDER_SERVICE } from '../../services/aiProviderService';
import { INGESTION_SERVICE } from '../../services/ingestionService';

interface PaperEditorViewProps {
  paperId: string;
  onBack: () => void;
}

export const PaperEditorView: React.FC<PaperEditorViewProps> = ({ paperId, onBack }) => {
  const [paper, setPaper] = useState<SavedPaper | null>(null);
  const [activeSet, setActiveSet] = useState<'Original' | 'Set A' | 'Set B' | 'Set C'>('Original');
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving'>('saved');

  // Undo / Redo history
  const [history, setHistory] = useState<SavedPaper[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Swap modal
  const [swapTarget, setSwapTarget] = useState<{ sectionId: string; questionId: string } | null>(null);
  const [bankQuestions, setBankQuestions] = useState<QuestionItem[]>([]);

  // Regenerating state
  const [regeneratingQId, setRegeneratingQId] = useState<string | null>(null);

  const autosaveTimerRef = useRef<any>(null);

  useEffect(() => {
    loadPaper();
  }, [paperId]);

  const loadPaper = async () => {
    const p = await db.savedPapers.get(paperId);
    if (p) {
      setPaper(p);
      setHistory([p]);
      setHistoryIndex(0);
      if (p.sections.length > 0) {
        setActiveSectionId(p.sections[0].id);
      }
    }
  };

  /**
   * Debounced 1-Second Autosave to IndexedDB
   */
  const triggerAutosave = (newPaper: SavedPaper) => {
    setAutosaveStatus('saving');
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(async () => {
      newPaper.updatedAt = Date.now();
      await db.savedPapers.put(newPaper);
      setAutosaveStatus('saved');
    }, 1000);
  };

  const updatePaperWithHistory = (updater: (prev: SavedPaper) => SavedPaper) => {
    if (!paper) return;
    const next = updater(paper);
    setPaper(next);
    triggerAutosave(next);

    // Push to undo stack
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(next);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setPaper(prev);
      triggerAutosave(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setPaper(next);
      triggerAutosave(next);
    }
  };

  const handleUpdateQuestion = (sectionId: string, qId: string, field: keyof PaperQuestion, val: any) => {
    updatePaperWithHistory(prev => {
      const sections = prev.sections.map(sec => {
        if (sec.id !== sectionId) return sec;
        const questions = sec.questions.map(q => {
          if (q.id !== qId) return q;
          return { ...q, [field]: val };
        });
        return { ...sec, questions };
      });
      return { ...prev, sections };
    });
  };

  const handleMoveQuestion = (sectionId: string, qIdx: number, direction: 'up' | 'down') => {
    updatePaperWithHistory(prev => {
      const sections = prev.sections.map(sec => {
        if (sec.id !== sectionId) return sec;
        const targetIdx = direction === 'up' ? qIdx - 1 : qIdx + 1;
        if (targetIdx < 0 || targetIdx >= sec.questions.length) return sec;

        const copy = [...sec.questions];
        const temp = copy[qIdx];
        copy[qIdx] = copy[targetIdx];
        copy[targetIdx] = temp;

        // Re-number
        const renumbered = copy.map((q, idx) => ({ ...q, questionNumber: idx + 1 }));
        return { ...sec, questions: renumbered };
      });
      return { ...prev, sections };
    });
  };

  const handleDeleteQuestion = (sectionId: string, qId: string) => {
    if (!confirm('Remove this question from the examination paper?')) return;
    updatePaperWithHistory(prev => {
      const sections = prev.sections.map(sec => {
        if (sec.id !== sectionId) return sec;
        const filtered = sec.questions.filter(q => q.id !== qId).map((q, i) => ({ ...q, questionNumber: i + 1 }));
        const totalMarks = filtered.reduce((sum, q) => sum + (q.marks || 0), 0);
        return { ...sec, questions: filtered, totalMarks };
      });
      const newTotal = sections.reduce((sum, s) => sum + s.totalMarks, 0);
      return { ...prev, sections, totalMarks: newTotal };
    });
  };

  const handleOpenSwapModal = async (sectionId: string, questionId: string) => {
    setSwapTarget({ sectionId, questionId });
    const items = await db.questionBank.where('subject').equals(paper?.subject || '').toArray();
    setBankQuestions(items);
  };

  const handleSwapFromBank = (bankQ: QuestionItem) => {
    if (!swapTarget || !paper) return;
    updatePaperWithHistory(prev => {
      const sections = prev.sections.map(sec => {
        if (sec.id !== swapTarget.sectionId) return sec;
        const questions = sec.questions.map(q => {
          if (q.id !== swapTarget.questionId) return q;
          return {
            ...bankQ,
            sectionId: sec.id,
            questionNumber: q.questionNumber,
            marks: q.marks // Retain section marks
          };
        });
        return { ...sec, questions };
      });
      return { ...prev, sections };
    });
    setSwapTarget(null);
  };

  const handleRegenerateQuestion = async (sectionId: string, q: PaperQuestion) => {
    if (!paper) return;
    setRegeneratingQId(q.id);

    try {
      const chunks = await INGESTION_SERVICE.searchRelevantChunks(q.chapter || paper.subject, { limit: 2 });
      const contextText = chunks.map(c => c.content).join('\n');

      const generated = await AI_PROVIDER_SERVICE.generateQuestionGrounded({
        questionType: q.type,
        marks: q.marks,
        difficulty: q.difficulty,
        bloomLevel: q.bloomLevel,
        subject: paper.subject,
        grade: paper.grade,
        board: paper.board,
        chapterName: q.chapter || paper.subject,
        chunksText: contextText || `Core concepts of ${paper.subject} for Class ${paper.grade}`
      });

      updatePaperWithHistory(prev => {
        const sections = prev.sections.map(sec => {
          if (sec.id !== sectionId) return sec;
          const questions = sec.questions.map(item => {
            if (item.id !== q.id) return item;
            return {
              ...item,
              ...generated,
              id: `q_regen_${Date.now()}`
            };
          });
          return { ...sec, questions };
        });
        return { ...prev, sections };
      });
    } catch (e: any) {
      alert(`Regeneration failed: ${e.message}`);
    } finally {
      setRegeneratingQId(null);
    }
  };

  if (!paper) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-xs">
        <p>Loading examination canvas editor...</p>
      </div>
    );
  }

  // Active section questions
  const currentSection = paper.sections.find(s => s.id === activeSectionId) || paper.sections[0];
  const calculatedTotalMarks = paper.sections.reduce((sum, s) => sum + s.totalMarks, 0);

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top action header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#202342] tracking-tight">
                {paper.title}
              </h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                autosaveStatus === 'saved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {autosaveStatus === 'saved' ? 'Saved locally ✓' : 'Saving...'}
              </span>
            </div>
            <p className="text-xs text-[#4e516a] mt-0.5">
              Class {paper.grade} • {paper.subject} ({paper.board}) • {calculatedTotalMarks} Total Marks
            </p>
          </div>
        </div>

        {/* Action Controls & Exports */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 hover:bg-slate-100 text-slate-600 disabled:opacity-30"
              title="Undo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 hover:bg-slate-100 text-slate-600 disabled:opacity-30"
              title="Redo"
            >
              <RotateCcw className="w-4 h-4 -scale-x-100" />
            </button>
          </div>

          {/* Export PDF */}
          <button
            onClick={() => PAPER_EXPORT_SERVICE.exportPaperPdf(paper, false)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#4555fd]" />
            <span>Print PDF</span>
          </button>

          {/* Export Answer Key PDF */}
          <button
            onClick={() => PAPER_EXPORT_SERVICE.exportPaperPdf(paper, true)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Answer Key PDF</span>
          </button>

          {/* Export Word DOCX */}
          <button
            onClick={() => PAPER_EXPORT_SERVICE.exportPaperDocx(paper)}
            className="px-4 py-2 rounded-xl bg-[#202342] hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export DOCX</span>
          </button>
        </div>
      </div>

      {/* Section Switcher Tabs */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {paper.sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSectionId(sec.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentSection.id === sec.id
                  ? 'bg-[#4555fd] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{sec.name}</span>
              <span className="text-[10px] opacity-80">({sec.totalMarks}M)</span>
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-slate-600">
          Showing {currentSection.questions.length} Questions ({currentSection.marksPerQuestion}M each)
        </div>
      </div>

      {/* Main Questions Canvas */}
      <div className="mt-6 space-y-4">
        {currentSection.questions.map((q, idx) => (
          <div 
            key={q.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#c2d4ff] shadow-xs space-y-3 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#edf2ff] text-[#4555fd] font-extrabold text-xs flex items-center justify-center font-mono">
                  {q.questionNumber}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {q.type.replace('_', ' ')} • [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                </span>
                {q.sourceBookTitle && (
                  <span className="text-[11px] text-slate-400">
                    Source: {q.sourceBookTitle} {q.sourcePage ? `(p.${q.sourcePage})` : ''}
                  </span>
                )}
              </div>

              {/* Action Buttons for this Question */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMoveQuestion(currentSection.id, idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-20"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveQuestion(currentSection.id, idx, 'down')}
                  disabled={idx === currentSection.questions.length - 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-20"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenSwapModal(currentSection.id, q.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#4555fd] hover:bg-[#edf2ff] transition-colors"
                  title="Swap with Question from Bank"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleRegenerateQuestion(currentSection.id, q)}
                  disabled={regeneratingQId === q.id}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                  title="Regenerate with AI"
                >
                  <Sparkles className={`w-4 h-4 ${regeneratingQId === q.id ? 'animate-spin text-amber-500' : ''}`} />
                </button>
                <button
                  onClick={() => handleDeleteQuestion(currentSection.id, q.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editable Question Text */}
            <div>
              <textarea
                rows={2}
                value={q.text}
                onChange={(e) => handleUpdateQuestion(currentSection.id, q.id, 'text', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-[#4555fd] focus:ring-1 focus:ring-[#4555fd]"
              />
            </div>

            {/* MCQ Options Editor */}
            {q.type === 'mcq' && q.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options.map((opt, oIdx) => (
                  <div key={opt.id} className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 bg-slate-50">
                    <input
                      type="radio"
                      name={`opt_corr_${q.id}`}
                      checked={opt.isCorrect}
                      onChange={() => {
                        const updatedOpts = q.options!.map((o, i) => ({
                          ...o,
                          isCorrect: i === oIdx
                        }));
                        handleUpdateQuestion(currentSection.id, q.id, 'options', updatedOpts);
                      }}
                      className="text-[#4555fd]"
                    />
                    <span className="font-bold text-slate-500 w-4 font-mono">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const updatedOpts = q.options!.map((o, i) => 
                          i === oIdx ? { ...o, text: e.target.value } : o
                        );
                        handleUpdateQuestion(currentSection.id, q.id, 'options', updatedOpts);
                      }}
                      className="flex-1 bg-transparent border-0 focus:outline-none text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Model Answer & Explanation */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-3 text-xs">
              <div className="flex-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">
                  Model Answer:
                </span>
                <input
                  type="text"
                  value={q.answer || ''}
                  onChange={(e) => handleUpdateQuestion(currentSection.id, q.id, 'answer', e.target.value)}
                  className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-emerald-900 bg-emerald-50/30"
                />
              </div>

              <div className="flex-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Marking Rubric:
                </span>
                <input
                  type="text"
                  value={q.explanation || ''}
                  onChange={(e) => handleUpdateQuestion(currentSection.id, q.id, 'explanation', e.target.value)}
                  className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 bg-slate-50/50"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Swap from Bank Modal */}
      {swapTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Swap Question from Local Bank</h3>
              <button onClick={() => setSwapTarget(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs">
              {bankQuestions.length === 0 ? (
                <p className="text-center text-slate-500 py-6">
                  No matching questions found in your local Question Bank.
                </p>
              ) : (
                bankQuestions.map(bq => (
                  <div key={bq.id} className="p-3.5 rounded-xl border border-slate-200 hover:border-[#4555fd] flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <span className="px-2 py-0.5 rounded-full bg-[#edf2ff] text-[#4555fd] text-[10px] font-bold">
                        {bq.type} • {bq.marks}M
                      </span>
                      <p className="font-medium text-slate-800">{bq.text}</p>
                    </div>
                    <button
                      onClick={() => handleSwapFromBank(bq)}
                      className="px-3 py-1.5 rounded-lg bg-[#4555fd] text-white font-bold text-xs"
                    >
                      Select
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
