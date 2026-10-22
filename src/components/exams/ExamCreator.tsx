import React, { useState, useEffect } from 'react';
import { 
  Sparkles, BookOpen, Layers, CheckCircle2, Sliders, Clock, 
  HelpCircle, AlertTriangle, ArrowRight, Printer, RefreshCw, 
  Trash2, Edit3, ArrowLeft, ShieldAlert, Check, Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  ExamConfigInput, 
  ExamQuestionModel, 
  ExamModel, 
  QuestionType, 
  QuestionTypeEnum 
} from '../../types/schemas';
import { LIBRARY_SERVICE } from '../../services/libraryService';
import { EXAM_GENERATOR_SERVICE } from '../../services/examGeneratorService';
import { GRADING_AND_ANALYSIS_SERVICE } from '../../services/gradingAndAnalysisService';

interface ExamCreatorProps {
  onStartExam: (exam: ExamModel) => void;
  onBack?: () => void;
}

export const ExamCreator: React.FC<ExamCreatorProps> = ({ onStartExam, onBack }) => {
  const { setCurrentView } = useApp();
  const books = LIBRARY_SERVICE.getBooks();

  // Wizard steps: 'form' | 'generating' | 'preview'
  const [step, setStep] = useState<'form' | 'generating' | 'preview'>('form');
  const [generationProgressMessage, setGenerationProgressMessage] = useState('');

  // Selected books and chapters
  const preselectedBookId = localStorage.getItem('edupulse_preselect_book');
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>(
    preselectedBookId && books.some(b => b.id === preselectedBookId) 
      ? [preselectedBookId] 
      : books.length > 0 ? [books[0].id] : []
  );
  const [selectedChapterNames, setSelectedChapterNames] = useState<string[]>([]);
  const [selectAllChapters, setSelectAllChapters] = useState(true);

  // Exam parameters
  const [examTitle, setExamTitle] = useState('CBSE Mid-Term Preparatory Exam 2026');
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [totalMarks, setTotalMarks] = useState(25);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    'mcq',
    'true_false',
    'fill_in_blank',
    'short_answer',
    'numerical'
  ]);
  const [difficultyMode, setDifficultyMode] = useState<'custom' | 'adaptive'>('custom');
  const [difficultyMix, setDifficultyMix] = useState({ easy: 40, medium: 40, hard: 20 });
  const [negativeMarking, setNegativeMarking] = useState(true);
  const [negativeMarkingValue, setNegativeMarkingValue] = useState(0.25);
  const [language, setLanguage] = useState('English');
  const [focusOnWeakChapters, setFocusOnWeakChapters] = useState(false);

  // Form error
  const [formError, setFormError] = useState<string | null>(null);

  // Generated exam state for preview/edit
  const [generatedExam, setGeneratedExam] = useState<ExamModel | null>(null);

  // Clean up preselection on mount
  useEffect(() => {
    localStorage.removeItem('edupulse_preselect_book');
  }, []);

  // Update available chapters based on selected books
  const availableChapters = selectedBookIds.flatMap(bId => {
    const book = books.find(b => b.id === bId);
    return book ? book.chapters.map(c => c.name) : [];
  });

  const toggleBookSelection = (bId: string) => {
    if (selectedBookIds.includes(bId)) {
      if (selectedBookIds.length === 1) return; // Keep at least one
      setSelectedBookIds(selectedBookIds.filter(id => id !== bId));
    } else {
      setSelectedBookIds([...selectedBookIds, bId]);
    }
  };

  const toggleChapterSelection = (chName: string) => {
    setSelectAllChapters(false);
    if (selectedChapterNames.includes(chName)) {
      setSelectedChapterNames(selectedChapterNames.filter(c => c !== chName));
    } else {
      setSelectedChapterNames([...selectedChapterNames, chName]);
    }
  };

  const toggleQuestionType = (t: QuestionType) => {
    if (selectedTypes.includes(t)) {
      if (selectedTypes.length === 1) return; // Keep at least one
      setSelectedTypes(selectedTypes.filter(item => item !== t));
    } else {
      setSelectedTypes([...selectedTypes, t]);
    }
  };

  const handleGenerateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (selectedBookIds.length === 0) {
      setFormError('Please select at least one source book.');
      return;
    }

    const effectiveChapters = selectAllChapters || selectedChapterNames.length === 0
      ? availableChapters
      : selectedChapterNames;

    if (effectiveChapters.length === 0) {
      setFormError('No chapters available for the selected books.');
      return;
    }

    // Config validation
    const config: ExamConfigInput = {
      title: examTitle.trim() || 'Curriculum Exam Paper',
      sourceBookIds: selectedBookIds,
      sourceChapterIds: effectiveChapters,
      totalQuestions: Number(totalQuestions),
      totalMarks: Number(totalMarks),
      questionTypes: selectedTypes,
      difficultyMode,
      difficultyMix,
      timeLimitMinutes: Number(timeLimitMinutes),
      negativeMarking,
      negativeMarkingValue: Number(negativeMarkingValue),
      language,
      focusOnWeakChapters
    };

    setStep('generating');

    try {
      const exam = await EXAM_GENERATOR_SERVICE.generateExam(config, (msg) => {
        setGenerationProgressMessage(msg);
      });
      setGeneratedExam(exam);
      setStep('preview');
    } catch (err: any) {
      setStep('form');
      setFormError(err.message || 'Failed to generate exam. Please check configuration.');
    }
  };

  const handleDeleteQuestion = (qId: string) => {
    if (!generatedExam) return;
    if (generatedExam.questions.length <= 1) {
      alert('Exam must contain at least one question.');
      return;
    }
    const updatedQs = generatedExam.questions.filter(q => q.id !== qId);
    const updatedMarks = updatedQs.reduce((acc, q) => acc + q.marks, 0);
    const updatedExam: ExamModel = {
      ...generatedExam,
      questions: updatedQs,
      totalMarks: updatedMarks
    };
    EXAM_GENERATOR_SERVICE.saveExam(updatedExam);
    setGeneratedExam(updatedExam);
  };

  const handleRegenerateQuestion = (qId: string) => {
    if (!generatedExam) return;
    const targetQ = generatedExam.questions.find(q => q.id === qId);
    if (!targetQ) return;

    const newQ = EXAM_GENERATOR_SERVICE.regenerateSingleQuestion(
      targetQ,
      targetQ.chapterName,
      targetQ.type
    );

    const updatedQs = generatedExam.questions.map(q => q.id === qId ? newQ : q);
    const updatedExam: ExamModel = {
      ...generatedExam,
      questions: updatedQs
    };
    EXAM_GENERATOR_SERVICE.saveExam(updatedExam);
    setGeneratedExam(updatedExam);
  };

  // ── STEP 2: GENERATING ANIMATION ──
  if (step === 'generating') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
          <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Synthesizing Exam Questions...</h2>
          <p className="text-xs text-slate-400">{generationProgressMessage}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-left text-xs text-slate-300 space-y-1.5 max-w-md mx-auto">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Strict RAG retrieval from selected chapters</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Exact marks balance &amp; Bloom taxonomy alignment</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified 4-option MCQs with plausible distractors</span>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 3: PREVIEW & EDIT SCREEN ──
  if (step === 'preview' && generatedExam) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
        
        {/* Top Header */}
        <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span className="badge badge-emerald">Ready for Assessment</span>
              <span>• Total Marks: {generatedExam.totalMarks}</span>
              <span>• Time: {generatedExam.timeLimitMinutes} Mins</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{generatedExam.title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Review, swap, or delete questions. Export as PDF with separate answer key, or start exam mode.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setStep('form')}
              className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-slate-300"
            >
              Modify Config
            </button>
            <button
              onClick={() => EXAM_GENERATOR_SERVICE.exportExamToPdf(generatedExam)}
              className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-bold text-white flex items-center gap-1.5 transition-colors border border-white/[0.08]"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>Export PDF Paper</span>
            </button>
            <button
              onClick={() => onStartExam(generatedExam)}
              className="px-5 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-xs font-bold text-white shadow-lg shadow-blue-500/25 flex items-center gap-1.5 transition-all"
            >
              <span>Start Exam</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Questions ({generatedExam.questions.length})
            </h3>
            <span className="text-xs text-slate-500">
              Hover over question to regenerate or remove
            </span>
          </div>

          {generatedExam.questions.map((q, idx) => (
            <div
              key={q.id}
              className="p-5 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] hover:border-white/[0.15] transition-all space-y-3 relative group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/15 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
                    Q{idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-mono text-slate-300 uppercase">
                    {q.type.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-[10px] font-bold text-indigo-300">
                    {q.bloomLevel}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    q.difficulty === 'easy' ? 'bg-emerald-500/15 text-emerald-300' :
                    q.difficulty === 'hard' ? 'bg-rose-500/15 text-rose-300' :
                    'bg-amber-500/15 text-amber-300'
                  }`}>
                    {q.difficulty.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-400">
                    {q.marks} Mark{q.marks > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => handleRegenerateQuestion(q.id)}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-amber-400"
                    title="Regenerate question from chapter"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                    title="Remove question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-sm font-medium text-white leading-relaxed">
                {q.question}
              </p>

              {/* Options if MCQ */}
              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={opt.id}
                      className={`p-2.5 rounded-xl border text-xs leading-snug ${
                        opt.text === q.correctAnswer
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200 font-medium'
                          : 'bg-black/30 border-white/[0.05] text-slate-300'
                      }`}
                    >
                      <span className="font-mono text-slate-500 mr-2">
                        ({String.fromCharCode(65 + oIdx)})
                      </span>
                      {opt.text}
                    </div>
                  ))}
                </div>
              )}

              {/* Verified book citation footer */}
              <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                <span>Chapter: <strong className="text-slate-300">{q.chapterName}</strong></span>
                <span>Verified Reference: <strong className="text-blue-400">{q.pageRef}</strong></span>
                <span>Est. Time: <strong className="text-slate-300">{q.estimatedTimeSec}s</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── STEP 1: EXAM BUILDER CONFIG FORM ──
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/[0.08] shadow-2xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="badge badge-indigo flex items-center gap-1 text-[10px]">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>AI Exam Paper Generator</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">• Strictly RAG-Retrieved from Books</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
          Create AI Exam Paper
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          Customize questions generated strictly from your uploaded textbooks. Questions adhere to Bloom's Taxonomy, balanced difficulty distributions, verified page citations, and exact total marks.
        </p>
      </div>

      {formError && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleGenerateExam} className="space-y-6">
        
        {/* Section 1: Title & Source Books */}
        <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>1. Exam Title &amp; Source Textbooks</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Exam Title *</label>
            <input
              type="text"
              value={examTitle}
              onChange={e => setExamTitle(e.target.value)}
              placeholder="e.g. Class 10 Science Preparatory Assessment"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0071e3]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Select Source Books (Multi-Select) *</label>
            {books.length === 0 ? (
              <p className="text-xs text-slate-500">No books uploaded in your library yet. Please upload a textbook first.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {books.map(b => {
                  const isSelected = selectedBookIds.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      onClick={() => toggleBookSelection(b.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500/50 text-white'
                          : 'bg-black/30 border-white/[0.06] hover:border-white/[0.12] text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">{b.title}</p>
                          <p className="text-[10px] text-slate-500">{b.chapters.length} Chapters • {b.totalPages} Pages</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chapters selection */}
          {availableChapters.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Chapters to Include:</label>
                <button
                  type="button"
                  onClick={() => {
                    setSelectAllChapters(!selectAllChapters);
                    if (!selectAllChapters) setSelectedChapterNames([]);
                  }}
                  className="text-[11px] font-bold text-blue-400 hover:text-blue-300"
                >
                  {selectAllChapters ? 'Deselect All (Choose Specific)' : 'Select All Chapters'}
                </button>
              </div>

              {!selectAllChapters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {availableChapters.map((ch, idx) => {
                    const isSelected = selectedChapterNames.includes(ch);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleChapterSelection(ch)}
                        className={`p-2 rounded-xl border text-xs cursor-pointer truncate flex items-center gap-2 ${
                          isSelected
                            ? 'bg-indigo-500/15 border-indigo-500/40 text-white'
                            : 'bg-black/30 border-white/[0.06] text-slate-400'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="truncate">{ch}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Weak chapters checkbox */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <input
              type="checkbox"
              id="weakChaptersCheckbox"
              checked={focusOnWeakChapters}
              onChange={e => setFocusOnWeakChapters(e.target.checked)}
              className="w-4 h-4 rounded border-amber-500 text-amber-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="weakChaptersCheckbox" className="text-xs text-amber-200 cursor-pointer">
              <strong>Focus on my weak chapters:</strong> Automatically weights questions toward chapters where previous exam accuracy was below 50%.
            </label>
          </div>
        </div>

        {/* Section 2: Questions, Marks, & Types */}
        <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>2. Questions &amp; Marks Distribution</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Total Questions</label>
              <input
                type="number"
                min={3}
                max={40}
                value={totalQuestions}
                onChange={e => setTotalQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Total Marks</label>
              <input
                type="number"
                min={5}
                max={100}
                value={totalMarks}
                onChange={e => setTotalMarks(Math.max(5, parseInt(e.target.value) || 5))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Time Limit (Minutes)</label>
              <input
                type="number"
                min={5}
                max={180}
                value={timeLimitMinutes}
                onChange={e => setTimeLimitMinutes(Math.max(5, parseInt(e.target.value) || 5))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#0071e3]"
              />
            </div>
          </div>

          {/* Question types pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Question Types to Include *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'mcq', label: 'MCQ (4 Options)' },
                { id: 'true_false', label: 'True / False' },
                { id: 'fill_in_blank', label: 'Fill in the blanks' },
                { id: 'short_answer', label: 'Short Answer' },
                { id: 'long_answer', label: 'Long Answer' },
                { id: 'numerical', label: 'Numerical / Problem' }
              ].map(t => {
                const isSelected = selectedTypes.includes(t.id as QuestionType);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleQuestionType(t.id as QuestionType)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                        : 'bg-black/30 border-white/[0.06] text-slate-400'
                    }`}
                  >
                    <span>{t.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Difficulty & Rules */}
        <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>3. Difficulty &amp; Evaluation Rules</span>
          </h2>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDifficultyMode('custom')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                difficultyMode === 'custom'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              Custom Mix (%)
            </button>
            <button
              type="button"
              onClick={() => setDifficultyMode('adaptive')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                difficultyMode === 'adaptive'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              Adaptive (Easy → Medium → Hard)
            </button>
          </div>

          {difficultyMode === 'custom' && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Easy ({difficultyMix.easy}%)</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={difficultyMix.easy}
                  onChange={e => setDifficultyMix({ ...difficultyMix, easy: parseInt(e.target.value) || 0 })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Medium ({difficultyMix.medium}%)</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={difficultyMix.medium}
                  onChange={e => setDifficultyMix({ ...difficultyMix, medium: parseInt(e.target.value) || 0 })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Hard ({difficultyMix.hard}%)</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={difficultyMix.hard}
                  onChange={e => setDifficultyMix({ ...difficultyMix, hard: parseInt(e.target.value) || 0 })}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/[0.06]">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/[0.06]">
              <div>
                <span className="text-xs font-semibold text-white block">Negative Marking</span>
                <span className="text-[10px] text-slate-400">Deduct marks for incorrect objective answers</span>
              </div>
              <input
                type="checkbox"
                checked={negativeMarking}
                onChange={e => setNegativeMarking(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Exam Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#0071e3]"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi / हिन्दी</option>
                <option value="Hinglish">Hinglish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#0071e3] hover:bg-[#0077ed] text-xs font-bold text-white shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate &amp; Preview Exam Paper</span>
          </button>
        </div>
      </form>
    </div>
  );
};
