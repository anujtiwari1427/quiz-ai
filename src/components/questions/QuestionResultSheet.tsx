import React from 'react';
import { 
  CheckCircle2, XCircle, Clock, Award, RotateCcw, 
  ArrowRight, BarChart3, HelpCircle, Check, Sparkles, 
  ChevronRight, AlertTriangle
} from 'lucide-react';
import { QuestionSetAttempt, QuestionSet } from '../../types';
import { calculateGrade } from '../../utils/gradeUtils';

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
  const gradeInfo = calculateGrade(attempt.percentage);
  const minutes = Math.floor(attempt.timeTakenSeconds / 60);
  const seconds = attempt.timeTakenSeconds % 60;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in-up">
      
      {/* ── Top Result Header Card ── */}
      <div className="glass-emerald rounded-3xl p-6 sm:p-10 border border-emerald-500/30 shadow-2xl space-y-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2">
          <span className="badge badge-emerald text-[10px]">Assessment Completed</span>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            {attempt.questionSetTitle}
          </h1>
          <p className="text-xs text-slate-400">
            {attempt.subject} {attempt.chapter && `• ${attempt.chapter}`}
          </p>
        </div>

        {/* Big Score Hero */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 font-medium">Your Total Score</span>
            <div className="text-5xl sm:text-6xl font-display font-black text-white tracking-tight">
              {attempt.obtainedMarks}
              <span className="text-2xl text-slate-500 font-normal ml-1">/ {attempt.totalMarks}</span>
            </div>
          </div>

          <div className="h-12 w-px bg-white/10 hidden sm:block" />

          <div className="flex flex-col items-center sm:items-start">
            <span className="text-xs text-slate-400 font-medium">Academic Grade</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge ${gradeInfo.badgeClass} text-xl px-4 py-1 font-black`}>
                {gradeInfo.grade}
              </span>
              <span className="text-sm font-bold text-white">({attempt.percentage}%)</span>
            </div>
            <span className="text-[11px] text-emerald-400 mt-1">{gradeInfo.label}</span>
          </div>
        </div>

        {/* Auto-sync to Marks badge banner */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-emerald-500/25 max-w-md mx-auto flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10b981', flexShrink: 0 }} />
            <span>Score automatically synced to your <strong>Marks Dashboard</strong>!</span>
          </div>
          <button
            onClick={onViewMarksDashboard}
            className="text-brand-400 hover:text-brand-300 font-bold underline whitespace-nowrap ml-2"
          >
            View Dashboard
          </button>
        </div>

        {/* Statistics Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.06] text-center">
            <div className="text-xs text-slate-400">Correct Answers</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">{attempt.correctAnswers}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.06] text-center">
            <div className="text-xs text-slate-400">Incorrect</div>
            <div className="text-xl font-bold text-rose-400 mt-0.5">{attempt.incorrectAnswers}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.06] text-center">
            <div className="text-xs text-slate-400">Unanswered</div>
            <div className="text-xl font-bold text-slate-400 mt-0.5">{attempt.unansweredQuestions}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.06] text-center">
            <div className="text-xs text-slate-400">Time Taken</div>
            <div className="text-xl font-bold text-indigo-400 mt-0.5">{minutes}m {seconds}s</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onRetake}
            className="btn-secondary text-xs py-2.5 px-4 rounded-xl"
          >
            <RotateCcw style={{ width: '13px', height: '13px' }} />
            <span>Retake Practice</span>
          </button>

          <button
            onClick={onViewMarksDashboard}
            className="btn-primary text-xs py-2.5 px-5 rounded-xl shadow-lg"
          >
            <BarChart3 style={{ width: '14px', height: '14px' }} />
            <span>View in Marks Dashboard</span>
          </button>

          <button
            onClick={onExit}
            className="btn-secondary text-xs py-2.5 px-4 rounded-xl"
          >
            <span>Back to Question Sets</span>
            <ChevronRight style={{ width: '13px', height: '13px' }} />
          </button>
        </div>
      </div>

      {/* ── Question-by-Question Diagnostic Review ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Question-by-Question Review</h2>
            <p className="text-xs text-slate-400">Examine correct answers, your submissions, and detailed explanations</p>
          </div>
          <span className="badge badge-indigo text-[10px]">
            {questionSet.questions.length} Questions
          </span>
        </div>

        <div className="space-y-4">
          {questionSet.questions.map((q, idx) => {
            const userAns = attempt.userAnswers.find(ua => ua.questionId === q.id);
            const isCorrect = userAns?.isCorrect ?? false;
            const isSkipped = !userAns || (!userAns.selectedOptionId && !userAns.answerText);

            return (
              <div
                key={q.id}
                className={`glass rounded-2xl p-5 border space-y-4 transition-all ${
                  isCorrect 
                    ? 'border-emerald-500/25 bg-emerald-500/[0.02]' 
                    : isSkipped 
                    ? 'border-white/[0.08]' 
                    : 'border-rose-500/25 bg-rose-500/[0.02]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-white/10 text-xs font-bold font-mono flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{q.chapter}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="badge badge-emerald flex items-center gap-1 text-[10px]">
                        <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                        +{q.marks} Marks
                      </span>
                    ) : isSkipped ? (
                      <span className="badge bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
                        Skipped (0 Marks)
                      </span>
                    ) : (
                      <span className="badge badge-rose flex items-center gap-1 text-[10px]">
                        <XCircle style={{ width: '12px', height: '12px' }} />
                        0 / {q.marks} Marks
                      </span>
                    )}
                  </div>
                </div>

                {/* Question text */}
                <p className="text-sm font-medium text-white leading-relaxed">
                  {q.questionText}
                </p>

                {/* Answer Options comparison for MCQ */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map(opt => {
                      const isUserSelected = userAns?.selectedOptionId === opt.id;
                      const isRightOption = opt.isCorrect;

                      return (
                        <div
                          key={opt.id}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                            isRightOption 
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold' 
                              : isUserSelected 
                              ? 'bg-rose-500/15 border-rose-500/40 text-rose-200' 
                              : 'bg-slate-950/40 border-white/[0.04] text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isRightOption ? (
                              <CheckCircle2 style={{ width: '13px', height: '13px', color: '#34d399', flexShrink: 0 }} />
                            ) : isUserSelected ? (
                              <XCircle style={{ width: '13px', height: '13px', color: '#fb7185', flexShrink: 0 }} />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                            )}
                            <span>{opt.text}</span>
                          </div>
                          {isUserSelected && (
                            <span className="text-[9px] uppercase tracking-wider font-bold opacity-70">
                              Your Answer
                            </span>
                          )}
                          {isRightOption && !isUserSelected && (
                            <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-400">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Subjective answer if applicable */}
                {!q.options && userAns?.answerText && (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/[0.06] space-y-1 text-xs">
                    <span className="text-slate-400 text-[10px] font-bold">Your Response:</span>
                    <p className="text-slate-200 whitespace-pre-line">{userAns.answerText}</p>
                  </div>
                )}

                {/* Explanation Card */}
                {q.explanation && (
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-brand-500/20 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-brand-400 font-bold text-[11px]">
                      <Sparkles style={{ width: '12px', height: '12px' }} />
                      <span>Explanation &amp; Concept Mastery:</span>
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
