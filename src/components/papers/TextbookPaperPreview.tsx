import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Sparkles, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Play, 
  Copy, 
  Check, 
  Clock, 
  Award, 
  BookOpen, 
  Printer, 
  Layers, 
  FileCheck, 
  AlertCircle,
  RotateCcw,
  X,
  Plus
} from 'lucide-react';
import { SavedTestPaper, PaperSection, ExamQuestionModel } from '../../types/schemas';
import { TEXTBOOK_EXAM_SERVICE } from '../../services/textbookExamService';
import { PDF_EXPORT_SERVICE } from '../../services/pdfExportService';
import { useApp } from '../../context/AppContext';

interface TextbookPaperPreviewProps {
  paper: SavedTestPaper;
  onPaperUpdated: (updated: SavedTestPaper) => void;
  onTakeOnlineTest: (paper: SavedTestPaper) => void;
  onBackToGenerator: () => void;
  onDuplicate: (paper: SavedTestPaper) => void;
}

export const TextbookPaperPreview: React.FC<TextbookPaperPreviewProps> = ({
  paper,
  onPaperUpdated,
  onTakeOnlineTest,
  onBackToGenerator,
  onDuplicate
}) => {
  const { theme } = useApp();
  const isLight = theme === 'light';

  // Active question being edited in modal
  const [editingQuestion, setEditingQuestion] = useState<ExamQuestionModel | null>(null);
  const [regeneratingQuestionId, setRegeneratingQuestionId] = useState<string | null>(null);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // PDF Export handling
  const handleExportQuestionPaper = () => {
    PDF_EXPORT_SERVICE.exportSavedPaper(paper, 'student_paper');
  };

  const handleExportMarkingScheme = () => {
    PDF_EXPORT_SERVICE.exportSavedPaper(paper, 'marking_scheme');
  };

  // Reorder question inside section
  const handleMoveQuestion = (sectionId: string, fromIndex: number, toIndex: number) => {
    const updated = TEXTBOOK_EXAM_SERVICE.reorderQuestion(paper, sectionId, fromIndex, toIndex);
    onPaperUpdated(updated);
  };

  // Delete question
  const handleDeleteQuestion = (questionId: string) => {
    if (paper.questions.length <= 1) {
      alert('A test paper must contain at least 1 question.');
      return;
    }
    if (window.confirm('Delete this question from the paper? Total marks will be re-balanced.')) {
      const updated = TEXTBOOK_EXAM_SERVICE.deleteQuestion(paper, questionId);
      onPaperUpdated(updated);
    }
  };

  // Regenerate single question using AI
  const handleRegenerateQuestion = async (q: ExamQuestionModel) => {
    setRegeneratingQuestionId(q.id);
    try {
      const updated = await TEXTBOOK_EXAM_SERVICE.regenerateSingleQuestion(paper, q.id);
      onPaperUpdated(updated);
      setSaveBanner(`Regenerated question for ${q.chapterName}!`);
      setTimeout(() => setSaveBanner(null), 3000);
    } catch (err: any) {
      alert(`Regeneration failed: ${err.message || 'Error communicating with AI engine'}`);
    } finally {
      setRegeneratingQuestionId(null);
    }
  };

  // Save edit form
  const handleSaveEditedQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    const updated = TEXTBOOK_EXAM_SERVICE.updateQuestion(paper, editingQuestion);
    onPaperUpdated(updated);
    setEditingQuestion(null);
    setSaveBanner('Question updated successfully!');
    setTimeout(() => setSaveBanner(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

      {/* Top Action Bar */}
      <div className={`sticky top-20 z-30 p-4 rounded-2xl border shadow-sm backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 ${
        isLight ? 'bg-white/95 border-slate-200 text-slate-900' : 'bg-[#120f24]/95 border-purple-900/50 text-white'
      }`}>
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToGenerator}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
            }`}
          >
            ← Back
          </button>
          <span className="hidden sm:inline text-xs font-bold text-purple-700 dark:text-purple-300">
            {paper.title}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Question Paper PDF */}
          <button
            onClick={handleExportQuestionPaper}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            title="Export official student copy without answers"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Question Paper (PDF)</span>
          </button>

          {/* Export Marking Scheme PDF */}
          <button
            onClick={handleExportMarkingScheme}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-xs font-bold transition-all"
            title="Export full answer key and step-by-step explanations"
          >
            <FileCheck className="w-3.5 h-3.5 text-orange-500" />
            <span>Answer Key & Solutions</span>
          </button>

          {/* Duplicate Paper */}
          <button
            onClick={() => onDuplicate(paper)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
            }`}
            title="Duplicate this test paper"
          >
            <Copy className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden md:inline">Duplicate</span>
          </button>

          {/* Take Online Test Button */}
          <button
            onClick={() => onTakeOnlineTest(paper)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Take this test in online exam mode with timer and score review"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Take Test Online</span>
          </button>
        </div>
      </div>

      {/* Save / Feedback Banner */}
      {saveBanner && (
        <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-orange-600 stroke-[3]" />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* Official Examination Document Paper Header */}
      <div className={`p-8 rounded-3xl border shadow-sm space-y-6 transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#120f24] border-purple-900/40 text-white'
      }`}>
        
        {/* Formal Exam Header */}
        <div className="text-center space-y-2 border-b pb-6 border-slate-200 dark:border-purple-900/40">
          <div className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            Official Board-Standard Examination Paper
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight">
            {paper.title}
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Source Textbook: <strong className="text-purple-700 dark:text-purple-300">{paper.bookTitle}</strong> &bull; Subject: <strong>{paper.subject}</strong>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4 text-orange-500" />
              Duration: <strong>{paper.durationMinutes} Minutes</strong>
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Award className="w-4 h-4 text-purple-600" />
              Maximum Marks: <strong className="text-orange-600 dark:text-orange-400 text-sm">{paper.totalMarks}</strong>
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Layers className="w-4 h-4 text-purple-600" />
              Total Questions: <strong>{paper.questions.length}</strong>
            </span>
          </div>
        </div>

        {/* General Instructions */}
        <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
          isLight ? 'bg-slate-50/80 border-slate-200 text-slate-700' : 'bg-[#181432] border-purple-900/40 text-slate-300'
        }`}>
          <div className="font-bold uppercase tracking-wider text-[11px] text-purple-900 dark:text-purple-300">
            General Instructions:
          </div>
          <ol className="list-decimal pl-4 space-y-1">
            <li>All questions are compulsory unless internal choice is specified.</li>
            <li>The question paper consists of designated sections: Section A through Section D.</li>
            <li>Section A contains Multiple Choice Questions carrying 1 mark each.</li>
            <li>Section B contains Objective and short-answer questions.</li>
            <li>Section C &amp; D contain analytical and problem-solving questions. Show neat working.</li>
            <li>Use of calculators is strictly prohibited unless authorized.</li>
          </ol>
        </div>

        {/* Sections & Questions */}
        <div className="space-y-8 pt-2">
          {paper.sections.map((section, sIdx) => (
            <div key={section.id || sIdx} className="space-y-4">
              
              {/* Section Header */}
              <div className="border-b-2 pb-2 border-purple-200 dark:border-purple-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-purple-900 dark:text-purple-200 uppercase tracking-tight">
                    {section.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {section.instructions}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 text-xs font-mono font-bold">
                  {section.totalMarks} Marks
                </span>
              </div>

              {/* Questions List in Section */}
              <div className="space-y-4">
                {section.questions.map((q, qIdx) => {
                  const isRegenerating = regeneratingQuestionId === q.id;

                  return (
                    <div
                      key={q.id || qIdx}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                        isLight ? 'bg-white border-slate-200 hover:border-purple-300 shadow-xs' : 'bg-[#181432] border-purple-900/40 hover:border-purple-700'
                      }`}
                    >
                      {/* Top Bar of Question */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-purple-700 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            {qIdx + 1}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {q.chapterName} &bull; {q.sourceExerciseRef || 'Exercise'} &bull; {q.pageRef}
                          </span>
                        </div>

                        {/* Marks & Question Actions */}
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-orange-600 dark:text-orange-400 pr-1">
                            [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                          </span>

                          {/* Reorder Up */}
                          <button
                            type="button"
                            disabled={qIdx === 0}
                            onClick={() => handleMoveQuestion(section.id, qIdx, qIdx - 1)}
                            className="p-1 rounded text-slate-400 hover:text-purple-600 disabled:opacity-30 transition-all"
                            title="Move question up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>

                          {/* Reorder Down */}
                          <button
                            type="button"
                            disabled={qIdx === section.questions.length - 1}
                            onClick={() => handleMoveQuestion(section.id, qIdx, qIdx + 1)}
                            className="p-1 rounded text-slate-400 hover:text-purple-600 disabled:opacity-30 transition-all"
                            title="Move question down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Regenerate Single Question */}
                          <button
                            type="button"
                            disabled={isRegenerating}
                            onClick={() => handleRegenerateQuestion(q)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all"
                            title="Regenerate this question using AI"
                          >
                            <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-orange-600' : ''}`} />
                          </button>

                          {/* Edit Question */}
                          <button
                            type="button"
                            onClick={() => setEditingQuestion(q)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all"
                            title="Edit question text, options or answers"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Question */}
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                            title="Delete question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <p className={`text-sm font-semibold leading-relaxed ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {q.question}
                      </p>

                      {/* MCQ Options Grid */}
                      {q.type === 'mcq' && q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map(opt => (
                            <div
                              key={opt.id}
                              className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                                opt.id === q.correctAnswer
                                  ? isLight ? 'bg-orange-50/80 border-orange-300 text-orange-950' : 'bg-orange-950/30 border-orange-800 text-orange-200'
                                  : isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#110e21] border-purple-900/30'
                              }`}
                            >
                              <span className="font-mono font-bold text-purple-700 dark:text-purple-400">
                                ({opt.id})
                              </span>
                              <span>{opt.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Answer Key & Explanations (collapsible or displayed in preview) */}
                      <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                        isLight ? 'bg-purple-50/50 border-purple-200/80' : 'bg-purple-950/20 border-purple-900/40'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold text-purple-900 dark:text-purple-300">
                          <span>Correct Answer / Model Solution:</span>
                          <span className="font-mono text-orange-600 dark:text-orange-400 font-bold">
                            {q.correctAnswer}
                          </span>
                        </div>
                        {q.explanation && (
                          <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            <strong>Explanation:</strong> {q.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-[#161226] border border-slate-200 dark:border-purple-900/50 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl my-8 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-purple-900/40">
              <h3 className="text-base font-bold">Edit Question</h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                  Question Text:
                </label>
                <textarea
                  rows={3}
                  value={editingQuestion.question}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:border-purple-600 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#110e21] border-purple-800 text-white'
                  }`}
                  required
                />
              </div>

              {/* If MCQ, edit 4 options */}
              {editingQuestion.type === 'mcq' && editingQuestion.options && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                    MCQ Options (A, B, C, D):
                  </label>
                  {editingQuestion.options.map((opt, i) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs w-6">{opt.id}.</span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const updatedOpts = [...(editingQuestion.options || [])];
                          updatedOpts[i] = { ...opt, text: e.target.value };
                          setEditingQuestion({ ...editingQuestion, options: updatedOpts });
                        }}
                        className={`flex-1 p-2 rounded-xl border text-xs focus:outline-none focus:border-purple-600 ${
                          isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#110e21] border-purple-800 text-white'
                        }`}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                    Correct Answer:
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.correctAnswer}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })}
                    className={`w-full p-2 rounded-xl border text-xs focus:outline-none focus:border-purple-600 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#110e21] border-purple-800 text-white'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                    Marks:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={editingQuestion.marks}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, marks: Math.max(1, parseInt(e.target.value) || 1) })}
                    className={`w-full p-2 rounded-xl border text-xs focus:outline-none focus:border-purple-600 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#110e21] border-purple-800 text-white'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                  Explanation & Stepwise Solution:
                </label>
                <textarea
                  rows={2}
                  value={editingQuestion.explanation || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  className={`w-full p-2 rounded-xl border text-xs focus:outline-none focus:border-purple-600 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#110e21] border-purple-800 text-white'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-purple-900/40">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
