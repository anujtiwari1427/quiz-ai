import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  CheckSquare, 
  Square, 
  Sliders, 
  Clock, 
  Award, 
  Layers, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Hash, 
  BookMarked,
  ArrowRight,
  FileText,
  ListFilter
} from 'lucide-react';
import { BookModel, ChapterModel, DetectedExercise, QuestionType, ExerciseSourceMode, SavedTestPaper } from '../../types/schemas';
import { LIBRARY_SERVICE } from '../../services/libraryService';
import { TEXTBOOK_EXAM_SERVICE, GenerateTextbookPaperInput } from '../../services/textbookExamService';
import { useApp } from '../../context/AppContext';

interface TextbookPaperGeneratorProps {
  initialBookId?: string;
  onPaperGenerated: (paper: SavedTestPaper) => void;
  onCancel?: () => void;
}

export const TextbookPaperGenerator: React.FC<TextbookPaperGeneratorProps> = ({
  initialBookId,
  onPaperGenerated,
  onCancel
}) => {
  const { theme } = useApp();
  const isLight = theme === 'light';

  const [books, setBooks] = useState<BookModel[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);

  // Question Types configuration
  const [enabledTypes, setEnabledTypes] = useState<Record<QuestionType, boolean>>({
    mcq: true,
    true_false: true,
    fill_in_blank: true,
    short_answer: true,
    long_answer: true,
    numerical: false
  });

  const [typeCounts, setTypeCounts] = useState<Record<QuestionType, number>>({
    mcq: 6,
    true_false: 3,
    fill_in_blank: 3,
    short_answer: 4,
    long_answer: 2,
    numerical: 2
  });

  const [marksPerType, setMarksPerType] = useState<Record<QuestionType, number>>({
    mcq: 1,
    true_false: 1,
    fill_in_blank: 1,
    short_answer: 2,
    long_answer: 4,
    numerical: 3
  });

  // Settings
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [exerciseMode, setExerciseMode] = useState<ExerciseSourceMode>('mixed');
  const [customTitle, setCustomTitle] = useState<string>('');

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<{
    stage: string;
    percent: number;
    message: string;
  }>({ stage: 'preparing', percent: 0, message: '' });
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Load books on mount
  useEffect(() => {
    const list = LIBRARY_SERVICE.getBooks();
    setBooks(list);

    // Pick requested or first available book
    const targetId = initialBookId || localStorage.getItem('qpm_selected_book_id') || (list[0]?.id || '');
    if (targetId && list.some(b => b.id === targetId)) {
      setSelectedBookId(targetId);
    } else if (list.length > 0) {
      setSelectedBookId(list[0].id);
    }
  }, [initialBookId]);

  // When selected book changes, select all its chapters by default
  const selectedBook = useMemo(() => {
    return books.find(b => b.id === selectedBookId) || null;
  }, [books, selectedBookId]);

  useEffect(() => {
    if (selectedBook && selectedBook.chapters) {
      setSelectedChapterIds(selectedBook.chapters.map(c => c.id));
      // Collect all exercise ids
      const exIds: string[] = [];
      selectedBook.chapters.forEach(c => {
        if (c.detectedExercises) {
          c.detectedExercises.forEach(e => exIds.push(e.id));
        }
      });
      setSelectedExerciseIds(exIds);
      setCustomTitle(`${selectedBook.title} — Unit Test Paper`);
    } else {
      setSelectedChapterIds([]);
      setSelectedExerciseIds([]);
    }
  }, [selectedBook]);

  // Calculated live totals
  const totalQuestions = useMemo(() => {
    let sum = 0;
    (Object.keys(enabledTypes) as QuestionType[]).forEach(t => {
      if (enabledTypes[t]) {
        sum += typeCounts[t] || 0;
      }
    });
    return sum;
  }, [enabledTypes, typeCounts]);

  const totalMarks = useMemo(() => {
    let sum = 0;
    (Object.keys(enabledTypes) as QuestionType[]).forEach(t => {
      if (enabledTypes[t]) {
        sum += (typeCounts[t] || 0) * (marksPerType[t] || 1);
      }
    });
    return sum;
  }, [enabledTypes, typeCounts, marksPerType]);

  const toggleChapter = (chapterId: string) => {
    setSelectedChapterIds(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const toggleAllChapters = () => {
    if (!selectedBook?.chapters) return;
    if (selectedChapterIds.length === selectedBook.chapters.length) {
      setSelectedChapterIds([]);
    } else {
      setSelectedChapterIds(selectedBook.chapters.map(c => c.id));
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) {
      setErrorMessage('Please select a textbook first.');
      return;
    }
    if (selectedChapterIds.length === 0) {
      setErrorMessage('Please select at least one chapter from the textbook.');
      return;
    }
    if (totalQuestions <= 0) {
      setErrorMessage('Please specify at least 1 question.');
      return;
    }

    setErrorMessage('');
    setIsGenerating(true);

    const activeTypes = (Object.keys(enabledTypes) as QuestionType[]).filter(t => enabledTypes[t] && (typeCounts[t] || 0) > 0);

    const input: GenerateTextbookPaperInput = {
      bookId: selectedBook.id,
      chapterIds: selectedChapterIds,
      exerciseIds: selectedExerciseIds,
      questionTypes: activeTypes,
      typeCounts,
      marksPerType,
      difficulty,
      durationMinutes,
      exerciseMode,
      customTitle
    };

    try {
      const generated = await TEXTBOOK_EXAM_SERVICE.generatePaperFromExercises(
        input,
        (stage, percent, message) => {
          setGenerationProgress({ stage, percent, message });
        }
      );
      onPaperGenerated(generated);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate test paper from exercises.');
    } finally {
      setIsGenerating(false);
    }
  };

  const questionTypeMeta: { type: QuestionType; label: string; desc: string; defaultMarks: number }[] = [
    { type: 'mcq', label: 'Multiple Choice (MCQ)', desc: '1 correct option + 3 plausible distractors', defaultMarks: 1 },
    { type: 'true_false', label: 'True / False', desc: 'Binary verification statements from exercises', defaultMarks: 1 },
    { type: 'fill_in_blank', label: 'Fill in the Blanks', desc: 'Key terms and formulas from textbook content', defaultMarks: 1 },
    { type: 'short_answer', label: 'Short Answer (2-3 Marks)', desc: 'Concise conceptual reasoning with step marks', defaultMarks: 2 },
    { type: 'long_answer', label: 'Long Answer (4-5 Marks)', desc: 'Comprehensive derivations, proofs, or structured answers', defaultMarks: 4 },
    { type: 'numerical', label: 'Numerical / Problem Solving', desc: 'Stepwise calculations with numerical values & units', defaultMarks: 3 }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xs transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#120f24] border-purple-900/40 text-white'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Feature 2 · Textbook Exercise Test Paper Generator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight">
              Generate Test Paper from Textbook Exercises
            </h1>
            <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Select your uploaded textbook, pick specific chapters and tagged exercise sets, configure question counts, and let AI synthesize official board-standard test papers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Generator Form */}
      <form onSubmit={handleGenerate} className="space-y-6">

        {/* Step 1: Select Textbook */}
        <div className={`p-6 rounded-3xl border shadow-xs space-y-4 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#120f24] border-purple-900/40 text-white'
        }`}>
          <div className="flex items-center gap-2 border-b pb-3 border-slate-100 dark:border-purple-900/30">
            <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h2 className="text-sm font-bold tracking-tight">Select Textbook</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Textbook Source
              </label>
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-purple-600 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1a1630] border-purple-900/60 text-white'
                }`}
              >
                {books.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.subject}) — {b.totalPages || 0} pages
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Test Paper Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Mathematics Part I — Mid-Term Examination"
                className={`w-full p-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-purple-600 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1a1630] border-purple-900/60 text-white'
                }`}
              />
            </div>
          </div>

          {/* Chapters & Tagged Exercises List */}
          {selectedBook && selectedBook.chapters && selectedBook.chapters.length > 0 && (
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Included Chapters & Exercise Sets ({selectedChapterIds.length}/{selectedBook.chapters.length})
                </span>
                <button
                  type="button"
                  onClick={toggleAllChapters}
                  className="text-xs font-semibold text-purple-700 dark:text-purple-400 hover:underline"
                >
                  {selectedChapterIds.length === selectedBook.chapters.length ? 'Deselect All' : 'Select All Chapters'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto p-1">
                {selectedBook.chapters.map((ch, idx) => {
                  const isChecked = selectedChapterIds.includes(ch.id);
                  const exerciseCount = ch.detectedExercises?.length || 0;
                  return (
                    <div
                      key={ch.id}
                      onClick={() => toggleChapter(ch.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                        isChecked 
                          ? isLight 
                            ? 'bg-purple-50/60 border-purple-300 shadow-xs' 
                            : 'bg-purple-950/40 border-purple-700'
                          : isLight 
                            ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600' 
                            : 'bg-[#17132a] hover:bg-[#1f1938] border-purple-900/40 text-slate-400'
                      }`}
                    >
                      <div className="pt-0.5">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs font-bold truncate ${isChecked ? (isLight ? 'text-slate-900' : 'text-white') : ''}`}>
                            Ch. {ch.orderIndex || idx + 1}: {ch.name}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            pp. {ch.pageStart}-{ch.pageEnd}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                          {exerciseCount > 0 ? (
                            ch.detectedExercises?.map(ex => (
                              <span
                                key={ex.id}
                                className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border border-orange-200 dark:border-orange-900"
                              >
                                {ex.title} (p.{ex.page})
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Content chapter</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Question Types, Counts & Marks */}
        <div className={`p-6 rounded-3xl border shadow-xs space-y-4 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#120f24] border-purple-900/40 text-white'
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-purple-900/30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight">Question Types & Marks Configuration</h2>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Configure the number of questions per type and marks per question. Total marks will be auto-calculated.
                </p>
              </div>
            </div>

            {/* Live Auto-Calculated Summary Pill */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Marks</span>
                <span className="font-mono font-black text-base text-orange-600 dark:text-orange-400">
                  {totalMarks} M
                </span>
              </div>
              <div className="text-right border-l pl-3 border-slate-200 dark:border-purple-900/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions</span>
                <span className="font-mono font-bold text-base text-purple-700 dark:text-purple-300">
                  {totalQuestions} Q
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {questionTypeMeta.map(({ type, label, desc, defaultMarks }) => {
              const isEnabled = enabledTypes[type];
              const count = typeCounts[type] || 0;
              const marks = marksPerType[type] || defaultMarks;
              const subtotal = count * marks;

              return (
                <div
                  key={type}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isEnabled 
                      ? isLight 
                        ? 'bg-white border-purple-200 shadow-xs' 
                        : 'bg-[#181432] border-purple-800'
                      : isLight 
                        ? 'bg-slate-50 border-slate-200 opacity-60' 
                        : 'bg-[#110e21] border-purple-900/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`type-${type}`}
                      checked={isEnabled}
                      onChange={(e) => setEnabledTypes(prev => ({ ...prev, [type]: e.target.checked }))}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer accent-orange-600"
                    />
                    <div>
                      <label htmlFor={`type-${type}`} className="text-xs font-bold cursor-pointer">
                        {label}
                      </label>
                      <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {desc}
                      </p>
                    </div>
                  </div>

                  {isEnabled && (
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="flex items-center gap-1.5">
                        <label className="text-[11px] font-semibold text-slate-500">Count:</label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={count}
                          onChange={(e) => setTypeCounts(prev => ({ ...prev, [type]: Math.max(1, parseInt(e.target.value) || 1) }))}
                          className={`w-14 px-2 py-1 rounded-lg border text-xs font-mono font-bold text-center focus:outline-none focus:border-purple-600 ${
                            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#110e21] border-purple-800'
                          }`}
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <label className="text-[11px] font-semibold text-slate-500">Marks each:</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={marks}
                          onChange={(e) => setMarksPerType(prev => ({ ...prev, [type]: Math.max(1, parseInt(e.target.value) || 1) }))}
                          className={`w-14 px-2 py-1 rounded-lg border text-xs font-mono font-bold text-center focus:outline-none focus:border-purple-600 ${
                            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#110e21] border-purple-800'
                          }`}
                        />
                      </div>

                      <span className="w-16 text-right font-mono text-xs font-bold text-orange-600 dark:text-orange-400">
                        = {subtotal} M
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Difficulty, Duration & Exercise Grounding Mode */}
        <div className={`p-6 rounded-3xl border shadow-xs space-y-5 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#120f24] border-purple-900/40 text-white'
        }`}>
          <div className="flex items-center gap-2 border-b pb-3 border-slate-100 dark:border-purple-900/30">
            <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h2 className="text-sm font-bold tracking-tight">Difficulty, Duration & Exercise Mode</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Difficulty */}
            <div>
              <label className={`block text-xs font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Difficulty Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['easy', 'medium', 'hard', 'mixed'] as const).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                      difficulty === d
                        ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                        : isLight
                          ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          : 'bg-[#181432] hover:bg-[#201b44] border-purple-900/40 text-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Duration */}
            <div>
              <label className={`block text-xs font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Test Duration
              </label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                  className={`w-full p-2 rounded-xl border text-xs font-medium focus:outline-none focus:border-purple-600 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1a1630] border-purple-900/60 text-white'
                  }`}
                >
                  <option value={15}>15 Minutes (Quick Quiz)</option>
                  <option value={30}>30 Minutes (Class Test)</option>
                  <option value={45}>45 Minutes (Period Assessment)</option>
                  <option value={60}>60 Minutes (1 Hour Unit Test)</option>
                  <option value={90}>90 Minutes (1.5 Hours Term Exam)</option>
                  <option value={120}>120 Minutes (2 Hours Full Exam)</option>
                  <option value={180}>180 Minutes (3 Hours Board Paper)</option>
                </select>
              </div>
            </div>

            {/* Exercise Source Mode */}
            <div>
              <label className={`block text-xs font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Exercise Sourcing Mode
              </label>
              <div className="space-y-1.5">
                {[
                  { mode: 'as_is' as ExerciseSourceMode, label: 'Use exercise questions as-is', desc: 'Strict reproduction from book' },
                  { mode: 'similar' as ExerciseSourceMode, label: 'Create new similar questions', desc: 'Modeled after exercises' },
                  { mode: 'mixed' as ExerciseSourceMode, label: 'Mix of both (Recommended)', desc: 'Balanced actual & new' }
                ].map(({ mode, label, desc }) => (
                  <label
                    key={mode}
                    className={`block p-2 rounded-xl border cursor-pointer transition-all ${
                      exerciseMode === mode
                        ? isLight ? 'bg-orange-50 border-orange-300' : 'bg-orange-950/30 border-orange-700'
                        : isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-[#181432] border-purple-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="exerciseMode"
                        checked={exerciseMode === mode}
                        onChange={() => setExerciseMode(mode)}
                        className="text-orange-600 accent-orange-600"
                      />
                      <div>
                        <div className="text-xs font-bold leading-tight">{label}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{desc}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center gap-3 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Generation Progress Bar */}
        {isGenerating && (
          <div className={`p-5 rounded-2xl border space-y-2.5 ${
            isLight ? 'bg-purple-50/70 border-purple-200' : 'bg-purple-950/40 border-purple-800'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-2 text-purple-900 dark:text-purple-200">
                <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                {generationProgress.message || 'Synthesizing test paper...'}
              </span>
              <span className="font-mono font-bold text-orange-600">{generationProgress.percent}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-purple-900/50 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`px-5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                isLight ? 'border-slate-200 text-slate-600 hover:bg-slate-100' : 'border-purple-900/40 text-slate-300 hover:bg-white/5'
              }`}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isGenerating || totalQuestions === 0}
            className="ml-auto px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Board-Standard Paper...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Test Paper ({totalMarks} Marks · {totalQuestions} Questions)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
