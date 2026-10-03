import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, Clock, Award, RotateCcw, 
  ArrowRight, BarChart3, HelpCircle, Check, Sparkles, 
  ChevronRight, AlertTriangle, ShieldAlert, BookOpen, 
  Download, Filter, Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuestionSetAttempt, QuestionSet } from '../../types';
import { calculateGrade } from '../../utils/gradeUtils';
import { useApp } from '../../context/AppContext';

interface QuestionResultSheetProps {
  attempt: QuestionSetAttempt;
  questionSet: QuestionSet;
  onRetake: () => void;
  onExit: () => void;
  onViewMarksDashboard: () => void;
}

export const QuestionResultSheet: React.FC<QuestionResultSheetProps> = ({
  attempt,
  questionSet,
  onRetake,
  onExit,
  onViewMarksDashboard
}) => {
  const { openBookForSubjectOrChapter } = useApp();
  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'incorrect' | 'skipped'>('all');

  const gradeInfo = calculateGrade(attempt.percentage);
  const minutes = Math.floor(attempt.timeTakenSeconds / 60);
  const seconds = attempt.timeTakenSeconds % 60;

  // Trigger celebration confetti on high marks
  useEffect(() => {
    if (attempt.percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }
    }
  }, [attempt.percentage]);

  const grossMarks = attempt.grossMarks ?? (attempt.correctAnswers * (questionSet.marksPerQuestion || 1));
  const negativeDeducted = attempt.negativeMarksDeducted ?? 0;
  const passingMarks = attempt.passingMarks ?? Math.ceil(attempt.totalMarks * 0.33);
  const isPassed = attempt.obtainedMarks >= passingMarks;

  // Filtered questions for diagnostic review
  const filteredQuestions = questionSet.questions.filter(q => {
    const userAns = attempt.userAnswers.find(ua => ua.questionId === q.id);
    const isCorrect = userAns?.isCorrect ?? false;
    const isSkipped = !userAns || (!userAns.selectedOptionId && !userAns.answerText);

    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'incorrect') return !isCorrect && !isSkipped;
    if (filterMode === 'skipped') return isSkipped;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in-up">
      
      {/* ── Top Result Header Card ── */}
      <div className="glass-emerald rounded-3xl p-6 sm:p-10 border border-emerald-500/30 shadow-2xl space-y-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="badge badge-emerald text-[10px]">Assessment Completed</span>
            <span className={`badge ${isPassed ? 'badge-emerald' : 'badge-rose'} text-[10px] font-bold`}>
              {isPassed ? '✓ PASSED BENCHMARK' : '⚠️ BELOW PASSING CRITERIA'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            {attempt.questionSetTitle}
          </h1>
          <p className="text-xs text-slate-400">
            {attempt.subject} {attempt.chapter && `• ${attempt.chapter}`}
          </p>
        </div>

        {/* Big Score Hero */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 font-medium">Net Final Marks</span>
            <div className="text-5xl sm:text-6xl font-display font-black text-white tracking-tight">
              {attempt.obtainedMarks}
              <span className="text-2xl text-slate-500 font-normal ml-1">/ {attempt.totalMarks}</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 font-mono">Passing Threshold: {passingMarks} Marks</span>
          </div>

          <div className="h-16 w-px bg-white/10 hidden sm:block" />

          <div className="flex flex-col items-center sm:items-start">
            <span className="text-xs text-slate-400 font-medium">Academic Grade</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge ${gradeInfo.badgeClass} text-2xl px-5 py-1 font-black`}>
                {gradeInfo.grade}
              </span>
              <span className="text-base font-bold text-white">({attempt.percentage}%)</span>
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 font-semibold">{gradeInfo.label}</span>
          </div>
        </div>

        {/* Detailed Marks & Negative Deductions Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/[0.08] max-w-xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block">GROSS MARKS</span>
            <span className="text-white font-bold text-sm">+{grossMarks} M</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">NEGATIVE PENALTY</span>
            <span className={`font-bold text-sm ${negativeDeducted > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {negativeDeducted > 0 ? `-${negativeDeducted} M` : '0 M'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">NET ACCURACY</span>
            <span className="text-emerald-400 font-bold text-sm">
              {Math.round((attempt.correctAnswers / (attempt.correctAnswers + attempt.incorrectAnswers || 1)) * 100)}%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">TIME DURATION</span>
            <span className="text-indigo-400 font-bold text-sm">{minutes}m {seconds}s</span>
          </div>
        </div>

        {/* Auto-sync to Marks badge banner */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/25 max-w-lg mx-auto flex items-center justify-between text-xs text-slate-300 shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981', flexShrink: 0 }} />
            <span>Score record successfully logged to your <strong>Marks Dashboard</strong>!</span>
          </div>
          <button
            onClick={onViewMarksDashboard}
            className="text-brand-400 hover:text-brand-300 font-bold underline whitespace-nowrap ml-2"
          >
            Open Marks
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onRetake}
            className="btn-secondary text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5"
          >
            <RotateCcw style={{ width: '13px', height: '13px' }} />
            <span>Retake Practice</span>
          </button>

          <button
            onClick={onViewMarksDashboard}
            className="btn-primary text-xs py-2.5 px-5 rounded-xl shadow-lg shadow-brand-500/25 font-bold flex items-center gap-1.5"
          >
            <BarChart3 style={{ width: '14px', height: '14px' }} />
            <span>View Marks Dashboard</span>
          </button>

          {questionSet.subject && (
            <button
              onClick={() => openBookForSubjectOrChapter(questionSet.subject, questionSet.chapter)}
              className="btn-secondary text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 text-amber-400 hover:text-amber-300"
            >
              <BookOpen style={{ width: '13px', height: '13px' }} />
              <span>Read Textbook Chapter</span>
            </button>
          )}

          <button
            onClick={onExit}
            className="btn-secondary text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5"
          >
            <span>Back to Question Sets</span>
            <ChevronRight style={{ width: '13px', height: '13px' }} />
          </button>
        </div>
      </div>

      {/* ── Question-by-Question Diagnostic Review ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Diagnostic Question Review</h2>
            <p className="text-xs text-slate-400">Detailed answers, board rubric schemes, and full step-by-step explanations</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/[0.08] text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                filterMode === 'all' ? 'bg-brand-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({questionSet.questions.length})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                filterMode === 'correct' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              Correct ({attempt.correctAnswers})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                filterMode === 'incorrect' ? 'bg-rose-500 text-white font-bold' : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              Incorrect ({attempt.incorrectAnswers})
            </button>
            <button
              onClick={() => setFilterMode('skipped')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                filterMode === 'skipped' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Skipped ({attempt.unansweredQuestions})
            </button>
          </div>
        </div>

        {/* Questions Diagnostic List */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const userAns = attempt.userAnswers.find(ua => ua.questionId === q.id);
            const isCorrect = userAns?.isCorrect ?? false;
            const isSkipped = !userAns || (!userAns.selectedOptionId && !userAns.answerText);
            const negDeduction = userAns?.negativeDeducted ?? 0;

            return (
              <div
                key={q.id}
                className={`glass rounded-2xl p-5 sm:p-6 border space-y-4 transition-all shadow-md ${
                  isCorrect 
                    ? 'border-emerald-500/30 bg-emerald-500/[0.03]' 
                    : isSkipped 
                    ? 'border-white/[0.08] bg-slate-950/40' 
                    : 'border-rose-500/30 bg-rose-500/[0.03]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold font-mono flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{q.chapter}</span>
                    {q.bloomsLevel && (
                      <span className="badge badge-indigo text-[9px]">{q.bloomsLevel}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="badge badge-emerald flex items-center gap-1 text-[11px] font-bold">
                        <CheckCircle2 style={{ width: '13px', height: '13px' }} />
                        +{q.marks} Marks
                      </span>
                    ) : isSkipped ? (
                      <span className="badge bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
                        Skipped (0 Marks)
                      </span>
                    ) : (
                      <span className="badge badge-rose flex items-center gap-1 text-[11px] font-bold">
                        <XCircle style={{ width: '13px', height: '13px' }} />
                        {negDeduction > 0 ? `-${negDeduction}M Penalty` : `0/${q.marks} Marks`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Question text */}
                <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
                  {q.questionText}
                </p>

                {/* Answer Options comparison for MCQ */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map(opt => {
                      const isUserSelected = userAns?.selectedOptionId === opt.id;
                      const isRightOption = opt.isCorrect;

                      return (
                        <div
                          key={opt.id}
                          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                            isRightOption 
                              ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 font-semibold' 
                              : isUserSelected 
                              ? 'bg-rose-500/15 border-rose-500/50 text-rose-200' 
                              : 'bg-slate-950/50 border-white/[0.04] text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isRightOption ? (
                              <CheckCircle2 style={{ width: '15px', height: '15px', color: '#34d399', flexShrink: 0 }} />
                            ) : isUserSelected ? (
                              <XCircle style={{ width: '15px', height: '15px', color: '#fb7185', flexShrink: 0 }} />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                            )}
                            <span className="leading-snug">{opt.text}</span>
                          </div>
                          {isUserSelected && (
                            <span className="text-[9px] uppercase tracking-wider font-bold shrink-0 ml-2 text-rose-300">
                              Your Pick
                            </span>
                          )}
                          {isRightOption && !isUserSelected && (
                            <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-400 shrink-0 ml-2">
                              Correct Key
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Subjective answer if applicable */}
                {!q.options && userAns?.answerText && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/[0.06] space-y-1.5 text-xs">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Your Written Answer:</span>
                    <p className="text-slate-200 whitespace-pre-line leading-relaxed">{userAns.answerText}</p>
                  </div>
                )}

                {/* Explanation Card */}
                {q.explanation && (
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-brand-500/20 text-xs space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-brand-400 font-bold text-[11px]">
                      <Sparkles style={{ width: '13px', height: '13px' }} />
                      <span>Examiner Explanation &amp; Syllabus Concept:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed pl-4">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default QuestionResultSheet;
