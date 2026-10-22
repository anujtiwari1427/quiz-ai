import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, CheckCircle2, Bookmark, ArrowLeft, ArrowRight, 
  Send, AlertCircle, Shield, HelpCircle, Check, RotateCcw,
  Sparkles
} from 'lucide-react';
import { ExamModel, ExamQuestionModel, AttemptModel } from '../../types/schemas';
import { GRADING_AND_ANALYSIS_SERVICE } from '../../services/gradingAndAnalysisService';

interface ExamRunnerProps {
  exam: ExamModel;
  onFinishExam: (exam: ExamModel, attempt: AttemptModel) => void;
  onExit: () => void;
}

export const ExamRunner: React.FC<ExamRunnerProps> = ({ exam, onFinishExam, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Student answer state per question
  // Note: Correct answers are NEVER exposed in this state or component before submit!
  const [userAnswers, setUserAnswers] = useState<{
    [questionId: string]: {
      answer: string;
      timeSpentSec: number;
      timesChanged: number;
      markedReview: boolean;
    };
  }>({});

  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState(exam.timeLimitMinutes * 60);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time tracker for active question
  const activeQuestionStartTimeRef = useRef<number>(Date.now());

  // Initialize answers map
  useEffect(() => {
    const initial: typeof userAnswers = {};
    exam.questions.forEach(q => {
      initial[q.id] = {
        answer: '',
        timeSpentSec: 0,
        timesChanged: 0,
        markedReview: false
      };
    });
    setUserAnswers(initial);
  }, [exam]);

  // Record time spent on question before switching
  const recordActiveQuestionTime = () => {
    const elapsed = Math.round((Date.now() - activeQuestionStartTimeRef.current) / 1000);
    const activeQ = exam.questions[currentQuestionIndex];
    if (activeQ) {
      setUserAnswers(prev => ({
        ...prev,
        [activeQ.id]: {
          ...prev[activeQ.id],
          timeSpentSec: (prev[activeQ.id]?.timeSpentSec || 0) + elapsed
        }
      }));
    }
    activeQuestionStartTimeRef.current = Date.now();
  };

  // Main countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQ = exam.questions[currentQuestionIndex];
  const currentAnswerData = userAnswers[currentQ?.id] || {
    answer: '',
    timeSpentSec: 0,
    timesChanged: 0,
    markedReview: false
  };

  const handleSelectAnswer = (ans: string) => {
    if (!currentQ) return;
    const oldAnswer = currentAnswerData.answer;
    const changed = oldAnswer !== '' && oldAnswer !== ans;

    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        answer: ans,
        timesChanged: (prev[currentQ.id]?.timesChanged || 0) + (changed ? 1 : 0)
      }
    }));
  };

  const handleToggleMarkReview = () => {
    if (!currentQ) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        markedReview: !prev[currentQ.id]?.markedReview
      }
    }));
  };

  const goToQuestion = (idx: number) => {
    recordActiveQuestionTime();
    setCurrentQuestionIndex(idx);
  };

  const handleSubmit = async () => {
    recordActiveQuestionTime();
    setIsSubmitting(true);

    const answersPayload = exam.questions.map(q => {
      const data = userAnswers[q.id] || {
        answer: '',
        timeSpentSec: 0,
        timesChanged: 0,
        markedReview: false
      };
      return {
        questionId: q.id,
        answer: data.answer,
        timeSpentSec: data.timeSpentSec,
        timesChanged: data.timesChanged,
        markedReview: data.markedReview
      };
    });

    try {
      const attempt = GRADING_AND_ANALYSIS_SERVICE.submitExamAttempt(exam, answersPayload);
      setIsSubmitting(false);
      onFinishExam(exam, attempt);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.values(userAnswers).filter(a => a.answer.trim().length > 0).length;
  const markedCount = Object.values(userAnswers).filter(a => a.markedReview).length;
  const isTimeCritical = secondsRemaining < 300; // < 5 mins

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col font-sans selection:bg-[#0071e3] selection:text-white">
      
      {/* ── Top Exam Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
            EP
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{exam.title}</h1>
            <p className="text-[10px] text-slate-400">Total Marks: {exam.totalMarks} • Verified Curriculum</p>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-mono text-xs font-bold ${
            isTimeCritical 
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse' 
              : 'bg-white/[0.06] border-white/[0.1] text-white'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setIsSubmitConfirmOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 flex items-center gap-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Submit Paper</span>
          </button>
        </div>
      </header>

      {/* ── Main Exam Body ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Active Question Workspace (3 cols) */}
        <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] space-y-6">
            
            {/* Question Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                  Q{currentQuestionIndex + 1}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.06] text-[10px] font-mono uppercase text-slate-300">
                  {currentQ?.type.replace('_', ' ')}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/15 text-[10px] font-bold text-indigo-300">
                  {currentQ?.bloomLevel}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {currentQ?.chapterName}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleMarkReview}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                    currentAnswerData.markedReview
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{currentAnswerData.markedReview ? 'Marked for Review' : 'Mark Review'}</span>
                </button>
                <span className="text-xs font-bold text-blue-400">
                  +{currentQ?.marks} Marks
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <p className="text-base sm:text-lg font-medium text-white leading-relaxed whitespace-pre-line">
                {currentQ?.question}
              </p>
            </div>

            {/* Answer Input Area based on Question Type */}
            <div className="pt-2">
              {/* Case 1: MCQ */}
              {currentQ?.type === 'mcq' && currentQ.options && (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = currentAnswerData.answer === opt.text;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectAnswer(opt.text)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                          isSelected
                            ? 'bg-blue-600/20 border-[#0071e3] text-white shadow-md'
                            : 'bg-black/30 border-white/[0.06] hover:border-white/[0.14] text-slate-300'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? 'bg-[#0071e3] border-[#0071e3] text-white' : 'border-slate-600 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                        <span className="text-sm font-medium leading-snug">{opt.text}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Case 2: True/False */}
              {currentQ?.type === 'true_false' && (
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  {['True', 'False'].map(tf => {
                    const isSelected = currentAnswerData.answer === tf;
                    return (
                      <button
                        key={tf}
                        type="button"
                        onClick={() => handleSelectAnswer(tf)}
                        className={`p-4 rounded-2xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                          isSelected
                            ? 'bg-blue-600/20 border-[#0071e3] text-white'
                            : 'bg-black/30 border-white/[0.06] text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{tf}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Case 3: Fill in Blanks or Numerical */}
              {(currentQ?.type === 'fill_in_blank' || currentQ?.type === 'numerical') && (
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 block">
                    {currentQ.type === 'numerical' ? 'Enter numerical calculation result:' : 'Type the missing word / phrase:'}
                  </label>
                  <input
                    type="text"
                    value={currentAnswerData.answer}
                    onChange={e => handleSelectAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full max-w-lg px-4 py-3 rounded-2xl bg-black/60 border border-white/[0.1] text-sm text-white focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              )}

              {/* Case 4: Short or Long Answer */}
              {(currentQ?.type === 'short_answer' || currentQ?.type === 'long_answer') && (
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Write detailed explanation / derivation:</span>
                    <span>{currentAnswerData.answer.length} characters</span>
                  </label>
                  <textarea
                    rows={currentQ.type === 'long_answer' ? 7 : 4}
                    value={currentAnswerData.answer}
                    onChange={e => handleSelectAnswer(e.target.value)}
                    placeholder="Provide a step-by-step answer including definitions, formulas, and justifications..."
                    className="w-full p-4 rounded-2xl bg-black/60 border border-white/[0.1] text-sm text-white focus:outline-none focus:border-[#0071e3] leading-relaxed resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Question Controls */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1c1c1e] border border-white/[0.08]">
            <button
              onClick={() => goToQuestion(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-30 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-400 font-mono">
              Question {currentQuestionIndex + 1} of {exam.questions.length}
            </span>

            {currentQuestionIndex < exam.questions.length - 1 ? (
              <button
                onClick={() => goToQuestion(currentQuestionIndex + 1)}
                className="px-5 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Save &amp; Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setIsSubmitConfirmOpen(true)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow-md"
              >
                <span>Submit Exam</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question Navigator Palette (1 col) */}
        <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Question Palette
            </h3>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Review ({markedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span>Skipped ({exam.questions.length - answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border border-blue-500 bg-blue-500/20" />
                <span>Active</span>
              </div>
            </div>

            {/* Grid of Question Numbers */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-2">
              {exam.questions.map((q, idx) => {
                const ansData = userAnswers[q.id];
                const isAnswered = ansData?.answer.trim().length > 0;
                const isMarked = ansData?.markedReview;
                const isActive = idx === currentQuestionIndex;

                let badgeStyle = 'bg-black/40 border-white/[0.08] text-slate-400';
                if (isActive) {
                  badgeStyle = 'bg-blue-600 border-blue-400 text-white font-bold ring-2 ring-blue-500/50';
                } else if (isMarked) {
                  badgeStyle = 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold';
                } else if (isAnswered) {
                  badgeStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(idx)}
                    className={`h-9 rounded-xl border text-xs font-mono transition-all flex items-center justify-center ${badgeStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick submission button */}
          <div className="pt-4 border-t border-white/[0.06] space-y-2">
            <button
              onClick={() => setIsSubmitConfirmOpen(true)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Complete Assessment</span>
            </button>
            <p className="text-[10px] text-center text-slate-500">
              Autosave active. Answers are evaluated upon final submission.
            </p>
          </div>
        </div>
      </div>

      {/* ── Submission Confirmation Modal ── */}
      {isSubmitConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#1c1c1e] border border-white/[0.1] shadow-2xl p-6 text-white space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Ready to Submit Exam?</h3>
                <p className="text-xs text-slate-400">Review your answered summary before grading.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Total Questions:</span>
                <span className="font-bold text-white">{exam.questions.length}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Questions Answered:</span>
                <span className="font-bold text-emerald-400">{answeredCount}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Questions Skipped:</span>
                <span className="font-bold text-slate-400">{exam.questions.length - answeredCount}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Marked for Review:</span>
                <span className="font-bold text-amber-400">{markedCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSubmitConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Return to Paper
              </button>
              <button
                onClick={() => {
                  setIsSubmitConfirmOpen(false);
                  handleSubmit();
                }}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
