import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Clock, 
  ShieldCheck,
  MessageSquareQuote
} from 'lucide-react';
import { TestAttempt, Test } from '../../types';
import { useApp } from '../../context/AppContext';

interface ResultDiagnosticSheetProps {
  attempt: TestAttempt;
  test: Test;
  onRetakeOrExit: () => void;
}

export const ResultDiagnosticSheet: React.FC<ResultDiagnosticSheetProps> = ({
  attempt,
  test,
  onRetakeOrExit
}) => {
  const { setUserRole, setCurrentView, setParentTab } = useApp();

  useEffect(() => {
    if ((attempt.percentage || 0) >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [attempt.percentage]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 animate-fadeIn">
      
      {/* Top Score Banner */}
      <div className="p-8 rounded-3xl glass-panel-glow border-brand-500/40 text-center space-y-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto shadow-inner">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
            <div className="w-5 h-5 rounded-md bg-white p-0.5 flex items-center justify-center shadow-sm">
              <img src="/logo.png" alt="EduPulse AI" className="w-4 h-4 object-contain" />
            </div>
            <span className="text-[11px] uppercase font-bold tracking-widest text-brand-400">
              EduPulse AI Diagnostic Report
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-1">
            {attempt.studentName}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {test.title} • {test.board} Class {test.classGrade} {test.subject}
          </p>
        </div>

        {/* Score metrics */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-4 border-t border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-950/80">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Score</span>
            <span className="text-2xl font-display font-extrabold text-white">
              {attempt.totalScore} <span className="text-xs text-slate-400">/ {attempt.maxScore}</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Percentage</span>
            <span className="text-2xl font-display font-extrabold text-brand-400">
              {attempt.percentage}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Time Taken</span>
            <span className="text-2xl font-display font-extrabold text-slate-300">
              {Math.floor(attempt.timeSpentSeconds / 60)}m
            </span>
          </div>
        </div>

        {/* Proctored status check */}
        <div className="pt-2 inline-flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Session Verified • {attempt.violations.length} proctor events logged</span>
        </div>
      </div>

      {/* AI Tutor Callout */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-accent-950/60 to-slate-900 border border-accent-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent-500/20 text-accent-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Need help understanding your wrong answers?</h4>
            <p className="text-xs text-slate-400">
              EduPulse AI Tutor can explain the exact steps in English, Hindi, or Hinglish with worked examples.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setUserRole('parent');
            setCurrentView('parent');
            setParentTab('tutor');
          }}
          className="px-5 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-accent-500/25 transition-all"
        >
          <MessageSquareQuote className="w-4 h-4" />
          <span>Launch AI Mistake Tutor</span>
        </button>
      </div>

      {/* Question by Question Diagnostic Analysis */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg text-white">Detailed Diagnostic Breakdown</h3>

        {test.questions.map((q, idx) => {
          const ans = attempt.answers.find(a => a.questionId === q.id);
          const isCorrect = ans?.isCorrect ?? (ans?.scoreAwarded && ans.scoreAwarded > 0);

          return (
            <div
              key={q.id}
              className="p-6 rounded-3xl glass-panel border-slate-800 space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                    Q{idx + 1}
                  </span>
                  <span className="font-mono text-xs text-slate-400">{q.chapter}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    Score: {ans?.scoreAwarded || 0} / {q.marks} M
                  </span>
                  {isCorrect ? (
                    <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="p-1 rounded-full bg-rose-500/20 text-rose-400">
                      <XCircle className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm font-medium text-white whitespace-pre-line">
                {q.questionText}
              </p>

              {/* Student Answer */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Your Answer:</span>
                <p className="text-xs text-slate-200">{ans?.answerText || 'No answer submitted.'}</p>
              </div>

              {/* Correct Solution or AI Explanation */}
              {(q.explanation || q.sampleAnswer || q.correctAnswer) && (
                <div className="p-3.5 rounded-2xl bg-brand-950/20 border border-brand-500/30 space-y-1">
                  <span className="text-[10px] text-brand-400 uppercase font-bold block flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Conceptual Solution & Marking Rationale:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {q.explanation || q.sampleAnswer || `Correct Answer: ${q.correctAnswer}`}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onRetakeOrExit}
          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
        >
          Exit Assessment Room
        </button>
      </div>

    </div>
  );
};
