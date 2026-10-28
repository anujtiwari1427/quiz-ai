import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, XCircle, Clock, Bookmark, Sparkles, 
  Play, RotateCcw, HelpCircle, ChevronRight, ChevronLeft,
  MessageSquare, Send, Check, AlertTriangle, ShieldCheck,
  Video, Eye, EyeOff, BookOpen, Star
} from 'lucide-react';
import { PwThemeConfig } from './pwTheme';
import { ExamModel, AttemptModel, ExamQuestionModel } from '../../../types/schemas';
import { PwVideoSolutionModal } from './PwVideoSolutionModal';
import { PwVideoSolutionData } from '../../../mock/pwTestData';

interface PwSolutionsTabProps {
  exam: ExamModel;
  attempt: AttemptModel;
  theme: PwThemeConfig;
}

export const PwSolutionsTab: React.FC<PwSolutionsTabProps> = ({
  exam,
  attempt,
  theme
}) => {
  // Navigation & Filter state
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'all' | 'correct' | 'incorrect' | 'unattempted' | 'marked'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  
  // Interactive Modals & Features
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Record<string, boolean>>({});
  const [reattemptMode, setReattemptMode] = useState<boolean>(false);
  const [reattemptSelection, setReattemptSelection] = useState<string | null>(null);
  const [reattemptFeedback, setReattemptFeedback] = useState<string | null>(null);

  // PW AI Doubt Solver Chat State
  const [doubtMessages, setDoubtMessages] = useState<Record<string, { sender: 'user' | 'ai'; text: string }[]>>({});
  const [doubtInput, setDoubtInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Group questions by subject
  const subjectsList = useMemo(() => {
    const set = new Set<string>();
    exam.questions.forEach(q => {
      const s = (q as any).subject || q.chapterName.split(' ')[0] || 'General';
      set.add(s);
    });
    return Array.from(set);
  }, [exam]);

  // Map answers for fast lookup
  const answersMap = useMemo(() => {
    const map = new Map<string, typeof attempt.answers[0]>();
    attempt.answers.forEach(a => map.set(a.questionId, a));
    return map;
  }, [attempt]);

  // Filter questions based on subject & status
  const filteredQuestions = useMemo(() => {
    return exam.questions.map((q, originalIndex) => ({ q, originalIndex })).filter(({ q }) => {
      const ans = answersMap.get(q.id);
      const isAttempted = ans && ans.answer.trim().length > 0;
      const isCorrect = ans?.isCorrect || false;
      const isIncorrect = isAttempted && !isCorrect;
      const isUnattempted = !isAttempted;
      const isMarked = ans?.markedReview || false;

      // Subject filter
      if (subjectFilter !== 'all') {
        const s = (q as any).subject || q.chapterName.split(' ')[0] || 'General';
        if (s !== subjectFilter) return false;
      }

      // Status filter
      if (statusFilter === 'correct') return isCorrect;
      if (statusFilter === 'incorrect') return isIncorrect;
      if (statusFilter === 'unattempted') return isUnattempted;
      if (statusFilter === 'marked') return isMarked;
      return true;
    });
  }, [exam, answersMap, subjectFilter, statusFilter]);

  // Current active question
  const currentQ = exam.questions[selectedQuestionIndex] || exam.questions[0];
  const currentAnswer = answersMap.get(currentQ?.id);
  const isCurrentAttempted = currentAnswer && currentAnswer.answer.trim().length > 0;
  const isCurrentCorrect = currentAnswer?.isCorrect || false;
  const isCurrentIncorrect = isCurrentAttempted && !isCurrentCorrect;

  // Question counts for filter pills
  const counts = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    let marked = 0;

    exam.questions.forEach(q => {
      const ans = answersMap.get(q.id);
      if (!ans || !ans.answer.trim()) unattempted++;
      else if (ans.isCorrect) correct++;
      else incorrect++;

      if (ans?.markedReview) marked++;
    });

    return { total: exam.questions.length, correct, incorrect, unattempted, marked };
  }, [exam, answersMap]);

  // Toggle bookmark
  const toggleBookmark = (qId: string) => {
    setBookmarkedQuestions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Re-attempt handler
  const handleReattemptSubmit = () => {
    if (!reattemptSelection) return;
    if (reattemptSelection === currentQ.correctAnswer) {
      setReattemptFeedback('🎉 Brilliant! You cracked it correctly this time!');
    } else {
      setReattemptFeedback(`❌ Still not quite right. Correct answer is "${currentQ.correctAnswer}". Check the step-by-step solution below.`);
    }
  };

  // AI Doubt Solver handler
  const handleSendDoubt = (textToSend?: string) => {
    const q = textToSend || doubtInput;
    if (!q.trim() || !currentQ) return;

    const qId = currentQ.id;
    const currentList = doubtMessages[qId] || [];

    const updatedList = [...currentList, { sender: 'user' as const, text: q }];
    setDoubtMessages(prev => ({ ...prev, [qId]: updatedList }));
    setDoubtInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      let reply = `In this question (${currentQ.chapterName}), the correct approach is: "${currentQ.explanation.slice(0, 180)}...". Remember to apply the EduPlus shortcut: ${(currentQ as any).pwTrick || 'Check fundamental principles first!'}`;
      if (q.toLowerCase().includes('hinglish') || q.toLowerCase().includes('hindi')) {
        reply = `Dekho simple si baat hai! Is question mein concept yeh hai ki: ${(currentQ as any).pwTrick || currentQ.explanation}. Is formula ko dhyan se lagao aur step 1 me direct values put karo!`;
      } else if (q.toLowerCase().includes('shortcut') || q.toLowerCase().includes('trick')) {
        reply = `🔥 EduPlus Pro Trick: ${(currentQ as any).pwTrick || 'Observe proportionalities and eliminate dimensions directly in 5 seconds!'}`;
      }

      setDoubtMessages(prev => ({
        ...prev,
        [qId]: [...(prev[qId] || []), { sender: 'ai' as const, text: reply }]
      }));
      setIsAiTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ── Top Bar: Subject Selector & Question Status Filter Pills ── */}
      <div className={`p-5 rounded-3xl border ${theme.cardBorder} ${theme.cardBg} space-y-4 shadow-sm`}>
        
        {/* Subject Filter Row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className={`font-bold mr-2 text-[11px] uppercase tracking-wider ${theme.textMuted}`}>Subject:</span>
            <button
              onClick={() => setSubjectFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                subjectFilter === 'all'
                  ? 'bg-[#5a4bda] text-white shadow-sm'
                  : `${theme.subCardBg} ${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              All Subjects ({exam.questions.length})
            </button>

            {subjectsList.map(subj => (
              <button
                key={subj}
                onClick={() => setSubjectFilter(subj)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  subjectFilter === subj
                    ? 'bg-[#5a4bda] text-white shadow-sm'
                    : `${theme.subCardBg} ${theme.textSecondary} hover:${theme.textPrimary}`
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Active: <span className="text-[#818cf8] font-bold">Question {selectedQuestionIndex + 1} of {exam.questions.length}</span>
          </div>
        </div>

        {/* Status Filter Row (All, Correct, Incorrect, Unattempted, Marked) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs border-t border-white/5 pt-3">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-white/15 text-white border border-white/20'
                : `${theme.subCardBg} ${theme.textMuted} hover:${theme.textPrimary}`
            }`}
          >
            All Questions ({counts.total})
          </button>

          <button
            onClick={() => setStatusFilter('correct')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              statusFilter === 'correct'
                ? 'bg-emerald-500/25 border border-emerald-500/40 text-emerald-300'
                : `${theme.subCardBg} text-emerald-400/80 hover:text-emerald-300`
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Correct ({counts.correct})</span>
          </button>

          <button
            onClick={() => setStatusFilter('incorrect')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              statusFilter === 'incorrect'
                ? 'bg-rose-500/25 border border-rose-500/40 text-rose-300'
                : `${theme.subCardBg} text-rose-400/80 hover:text-rose-300`
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Incorrect ({counts.incorrect})</span>
          </button>

          <button
            onClick={() => setStatusFilter('unattempted')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              statusFilter === 'unattempted'
                ? 'bg-slate-600/30 border border-slate-500/40 text-slate-200'
                : `${theme.subCardBg} text-slate-400 hover:text-slate-200`
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Unattempted ({counts.unattempted})</span>
          </button>

          <button
            onClick={() => setStatusFilter('marked')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              statusFilter === 'marked'
                ? 'bg-amber-500/25 border border-amber-500/40 text-amber-300'
                : `${theme.subCardBg} text-amber-400/80 hover:text-amber-300`
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Marked for Review ({counts.marked})</span>
          </button>
        </div>

      </div>

      {/* ── Main Layout: Left Question View (8 cols) + Right PW Palette (4 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Detailed Question Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className={`p-6 sm:p-8 rounded-3xl border ${theme.cardBorder} ${theme.cardBg} space-y-6 shadow-xl`}>
            
            {/* Question Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-8 h-8 rounded-xl bg-[#5a4bda] text-white font-mono font-bold text-xs flex items-center justify-center shadow-md">
                  Q{selectedQuestionIndex + 1}
                </span>

                <span className="px-2.5 py-1 rounded-full bg-white/5 text-[11px] font-bold text-[#818cf8]">
                  {(currentQ as any).subject || 'Science'}
                </span>

                <span className="text-xs text-slate-400 font-semibold truncate max-w-xs">
                  {currentQ.chapterName}
                </span>

                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono ${
                  currentQ.difficulty === 'easy' ? 'bg-emerald-500/15 text-emerald-400' :
                  currentQ.difficulty === 'medium' ? 'bg-amber-500/15 text-amber-400' :
                  'bg-rose-500/15 text-rose-400'
                }`}>
                  {currentQ.difficulty}
                </span>

                <span className="text-[10px] text-slate-500 font-mono">
                  Marks: +4 / -1
                </span>
              </div>

              {/* Status Badge & Bookmark */}
              <div className="flex items-center gap-2">
                {isCurrentCorrect && (
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Correct (+4 Marks)</span>
                  </span>
                )}

                {isCurrentIncorrect && (
                  <span className="px-2.5 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold font-mono flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Incorrect (-1 Mark)</span>
                  </span>
                )}

                {!isCurrentAttempted && (
                  <span className="px-2.5 py-1 rounded-xl bg-slate-700/30 border border-slate-600/30 text-slate-400 text-xs font-bold font-mono">
                    Unattempted (0 Marks)
                  </span>
                )}

                <button
                  onClick={() => toggleBookmark(currentQ.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    bookmarkedQuestions[currentQ.id]
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      : `${theme.subCardBg} ${theme.subCardBorder} text-slate-400 hover:text-white`
                  }`}
                  title={bookmarkedQuestions[currentQ.id] ? 'Bookmarked for Revision' : 'Bookmark this question'}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Time Benchmarking Comparison */}
            <div className={`p-3.5 rounded-2xl border ${theme.subCardBorder} ${theme.subCardBg} flex flex-wrap items-center justify-between gap-3 text-xs font-mono`}>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Your Time</span>
                  <span className={`font-bold ${
                    (currentAnswer?.timeSpentSec || 0) > ((currentQ as any).avgTimeSec || 60)
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    {currentAnswer?.timeSpentSec || 0}s
                  </span>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Batch Avg Time</span>
                  <span className="font-bold text-slate-300">{(currentQ as any).avgTimeSec || 60}s</span>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Topper Time</span>
                  <span className="font-bold text-blue-400">{(currentQ as any).topperTimeSec || 28}s</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1 font-sans">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ref: <strong className="text-slate-300">{currentQ.pageRef}</strong></span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <h3 className={`text-base sm:text-lg font-medium leading-relaxed ${theme.textPrimary}`}>
                {currentQ.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options?.map((opt, oIdx) => {
                const optLetter = String.fromCharCode(65 + oIdx);
                const isCorrectOption = opt.text === currentQ.correctAnswer;
                const isStudentChoice = currentAnswer?.answer === opt.text;

                // Re-attempt mode selection
                const isReattemptSelected = reattemptMode && reattemptSelection === opt.text;

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (reattemptMode) setReattemptSelection(opt.text);
                    }}
                    className={`p-4 rounded-2xl border transition-all ${
                      reattemptMode
                        ? `cursor-pointer ${isReattemptSelected ? 'border-[#5a4bda] bg-[#5a4bda]/15' : `${theme.subCardBg} ${theme.subCardBorder}`}`
                        : isCorrectOption
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-sm'
                        : isStudentChoice
                        ? 'border-rose-500/50 bg-rose-500/10 text-rose-300'
                        : `${theme.subCardBg} ${theme.subCardBorder} ${theme.textSecondary}`
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                          !reattemptMode && isCorrectOption
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : !reattemptMode && isStudentChoice
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/5 text-slate-400'
                        }`}>
                          {optLetter}
                        </span>

                        <span className="text-xs sm:text-sm font-medium">
                          {opt.text}
                        </span>
                      </div>

                      {/* Right Tag Indicator */}
                      {!reattemptMode && (
                        <div className="flex items-center gap-2">
                          {isCorrectOption && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Correct Answer</span>
                            </span>
                          )}

                          {isStudentChoice && !isCorrectOption && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold font-mono flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              <span>Your Choice</span>
                            </span>
                          )}

                          {isStudentChoice && isCorrectOption && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
                              (Your Choice)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Re-attempt feedback if in reattempt mode */}
            {reattemptMode && (
              <div className="p-4 rounded-2xl bg-[#5a4bda]/10 border border-[#5a4bda]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#818cf8] flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Interactive Re-attempt Mode Active</span>
                  </span>
                  <button
                    onClick={() => {
                      setReattemptMode(false);
                      setReattemptSelection(null);
                      setReattemptFeedback(null);
                    }}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Cancel Re-attempt
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReattemptSubmit}
                    disabled={!reattemptSelection}
                    className="px-4 py-2 rounded-xl bg-[#5a4bda] hover:bg-[#6859eb] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md"
                  >
                    Verify Answer
                  </button>
                  {reattemptFeedback && (
                    <span className="text-xs font-semibold text-white animate-fade-in">
                      {reattemptFeedback}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ── PW Step-by-Step Solution & Pedagogical Breakdown ── */}
            <div className={`p-6 rounded-2xl border ${theme.subCardBorder} ${theme.subCardBg} space-y-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div>
                  <h4 className={`text-sm font-bold ${theme.textPrimary} flex items-center gap-2`}>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>EduPlus Step-by-Step Explanation</span>
                  </h4>
                  <p className={`text-[11px] ${theme.textMuted}`}>
                    Curriculum Concept: <strong className="text-indigo-400">{(currentQ as any).conceptName || currentQ.chapterName}</strong>
                  </p>
                </div>

                {/* Video Solution & Reattempt Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Watch Video Solution</span>
                  </button>

                  <button
                    onClick={() => {
                      setReattemptMode(!reattemptMode);
                      setReattemptSelection(null);
                      setReattemptFeedback(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      reattemptMode
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : `${theme.cardBorder} text-slate-300 hover:text-white`
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{reattemptMode ? 'Hide Re-attempt' : 'Re-attempt Question'}</span>
                  </button>
                </div>
              </div>

              {/* Text Explanation */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Core Theory &amp; Derivation:
                  </span>
                  <p className={theme.textSecondary}>
                    {currentQ.explanation}
                  </p>
                </div>

                {/* EduPlus Shortcut Trick */}
                {(currentQ as any).pwTrick && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block font-mono flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>EduPlus Shortcut Trick (3 Seconds):</span>
                    </span>
                    <p className="font-medium">
                      {(currentQ as any).pwTrick}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Ask EduPlus AI Doubt Assistant (Interactive) ── */}
            <div className={`p-5 rounded-2xl border ${theme.subCardBorder} ${theme.subCardBg} space-y-3`}>
              <div className="flex items-center justify-between">
                <h5 className={`text-xs font-bold uppercase tracking-wider ${theme.textPrimary} flex items-center gap-1.5`}>
                  <MessageSquare className="w-3.5 h-3.5 text-[#818cf8]" />
                  <span>Ask EduPlus AI Doubt Solver</span>
                </h5>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Instant 24x7 Tutor</span>
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                <button
                  onClick={() => handleSendDoubt("Why is the other option incorrect?")}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 whitespace-nowrap transition-colors"
                >
                  Why are the other options wrong?
                </button>
                <button
                  onClick={() => handleSendDoubt("Explain this in simple Hinglish")}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 whitespace-nowrap transition-colors"
                >
                  Hinglish me samjhao
                </button>
                <button
                  onClick={() => handleSendDoubt("Give me a shortcut memory trick")}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 whitespace-nowrap transition-colors"
                >
                  Shortcut formula batao
                </button>
              </div>

              {/* Conversation messages */}
              {doubtMessages[currentQ.id]?.length > 0 && (
                <div className="space-y-2 pt-2 max-h-48 overflow-y-auto">
                  {doubtMessages[currentQ.id].map((msg, mIdx) => (
                    <div
                      key={mIdx}
                      className={`p-3 rounded-xl text-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#5a4bda]/20 text-[#c7d2fe] ml-6 border border-[#5a4bda]/30'
                          : 'bg-black/40 text-slate-200 mr-6 border border-white/5'
                      }`}
                    >
                      <strong className="block text-[10px] font-mono uppercase text-slate-400 mb-0.5">
                        {msg.sender === 'user' ? 'You' : 'EduPlus AI Master Tutor'}:
                      </strong>
                      {msg.text}
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="text-[11px] text-slate-400 font-mono italic animate-pulse">
                      EduPlus AI Tutor is formulating step-by-step response...
                    </div>
                  )}
                </div>
              )}

              {/* Input box */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={doubtInput}
                  onChange={(e) => setDoubtInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendDoubt();
                  }}
                  placeholder="Ask a specific doubt about this question..."
                  className={`flex-1 px-3.5 py-2 rounded-xl text-xs bg-black/40 border border-white/10 ${theme.textPrimary} focus:outline-none focus:border-[#5a4bda]`}
                />
                <button
                  onClick={() => handleSendDoubt()}
                  disabled={!doubtInput.trim()}
                  className="p-2 rounded-xl bg-[#5a4bda] hover:bg-[#6859eb] disabled:opacity-40 text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Question Prev / Next Navigator */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <button
                disabled={selectedQuestionIndex === 0}
                onClick={() => setSelectedQuestionIndex(prev => Math.max(0, prev - 1))}
                className={`px-4 py-2 rounded-xl border ${theme.subCardBorder} ${theme.subCardBg} text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Question</span>
              </button>

              <span className="text-xs font-mono text-slate-400">
                {selectedQuestionIndex + 1} / {exam.questions.length}
              </span>

              <button
                disabled={selectedQuestionIndex === exam.questions.length - 1}
                onClick={() => setSelectedQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
                className={`px-4 py-2 rounded-xl ${theme.accentBtn} text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40`}
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: EduPlus Question Palette Grid (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-6 rounded-3xl border ${theme.cardBorder} ${theme.cardBg} space-y-5 sticky top-24 shadow-xl`}>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`text-sm font-bold ${theme.textPrimary}`}>EduPlus Question Palette</h4>
                <p className={`text-[11px] ${theme.textMuted}`}>Click to jump to any question</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {counts.correct} / {counts.total} Correct
              </span>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-y border-white/5 py-3">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm" />
                <span className={theme.textSecondary}>Correct (+4)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm" />
                <span className={theme.textSecondary}>Incorrect (-1)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-slate-600" />
                <span className={theme.textSecondary}>Unattempted</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-400" />
                <span className={theme.textSecondary}>Review Marked</span>
              </div>
            </div>

            {/* Question Buttons Grid */}
            <div className="grid grid-cols-5 gap-2.5">
              {exam.questions.map((q, idx) => {
                const ans = answersMap.get(q.id);
                const isAtt = ans && ans.answer.trim().length > 0;
                const isCorr = ans?.isCorrect || false;
                const isMark = ans?.markedReview || false;
                const isSelected = selectedQuestionIndex === idx;

                let btnBg = 'bg-slate-700/60 text-slate-300';
                if (isAtt) {
                  if (isCorr) btnBg = 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30';
                  else btnBg = 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestionIndex(idx);
                      setReattemptMode(false);
                      setReattemptSelection(null);
                      setReattemptFeedback(null);
                    }}
                    className={`relative h-11 rounded-2xl flex flex-col items-center justify-center font-mono text-xs transition-all ${btnBg} ${
                      isSelected
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105 shadow-lg'
                        : 'hover:scale-102 hover:brightness-110'
                    }`}
                  >
                    <span>{idx + 1}</span>

                    {/* Small icon or mark dot */}
                    {isMark && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-black" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Stats Summary */}
            <div className={`p-4 rounded-2xl border ${theme.subCardBorder} ${theme.subCardBg} space-y-2 text-xs`}>
              <div className="flex justify-between">
                <span className={theme.textMuted}>Attempt Rate:</span>
                <span className="font-bold font-mono text-white">
                  {Math.round(((counts.total - counts.unattempted) / counts.total) * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textMuted}>Accuracy Rate:</span>
                <span className="font-bold font-mono text-emerald-400">
                  {(counts.total - counts.unattempted) > 0 ? Math.round((counts.correct / (counts.total - counts.unattempted)) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textMuted}>Negative Deduction:</span>
                <span className="font-bold font-mono text-rose-400">-{counts.incorrect} marks</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── PW Video Solution Simulator Modal ── */}
      {isVideoModalOpen && (
        <PwVideoSolutionModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoData={(currentQ as any).videoSolution || {
            instructor: 'Alakh Sir (Physics Dept)',
            title: `Q${selectedQuestionIndex + 1}: ${currentQ.chapterName} Solution`,
            duration: '2m 45s',
            timestamps: [
              { time: '0:00', label: 'Concept Analysis' },
              { time: '1:10', label: 'Given Values & Formula' },
              { time: '2:00', label: 'PW Fast Shortcut' }
            ],
            whiteboardNotes: [
              currentQ.explanation.slice(0, 120),
              (currentQ as any).pwTrick || 'Key concept verification rule'
            ]
          }}
          questionNumber={selectedQuestionIndex + 1}
          questionText={currentQ.question}
          theme={theme}
          onAskDoubt={() => {
            handleSendDoubt("Can you explain the step from the video solution?");
          }}
        />
      )}

    </div>
  );
};
