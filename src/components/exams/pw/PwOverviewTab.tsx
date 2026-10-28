import React from 'react';
import { 
  Trophy, CheckCircle2, XCircle, Clock, Target, 
  ArrowRight, Sparkles, Award, Zap, BookOpen 
} from 'lucide-react';
import { PwThemeConfig } from './pwTheme';
import { ExamModel, AttemptModel } from '../../../types/schemas';

interface PwOverviewTabProps {
  exam: ExamModel;
  attempt: AttemptModel;
  theme: PwThemeConfig;
  onNavigateToSolutions: () => void;
  onNavigateToLeaderboard: () => void;
}

export const PwOverviewTab: React.FC<PwOverviewTabProps> = ({
  exam,
  attempt,
  theme,
  onNavigateToSolutions,
  onNavigateToLeaderboard
}) => {
  const score = attempt.score;
  const totalMarks = attempt.total || exam.totalMarks;
  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
  const timeTaken = attempt.timeSpentSeconds || 0;
  const timeAllowed = exam.timeLimitMinutes * 60;

  const answers = attempt.answers;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const attemptedCount = answers.filter(a => a.answer.trim().length > 0).length;
  const incorrectCount = answers.filter(a => !a.isCorrect && a.answer.trim().length > 0).length;
  const unattemptedCount = exam.questions.length - attemptedCount;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  // Estimated All-India Rank & Percentile
  const percentile = Math.min(99.5, Math.max(15, Math.round(percentage * 0.94 + 5)));
  const estimatedRank = Math.max(1, Math.round((100 - percentile) * 120 + 5));

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // Subject breakdown
  const subjectsMap: Record<string, { total: number; correct: number; incorrect: number; timeSec: number }> = {};
  exam.questions.forEach(q => {
    const subj = (q as any).subject || q.chapterName.split(' ')[0] || 'General';
    if (!subjectsMap[subj]) {
      subjectsMap[subj] = { total: 0, correct: 0, incorrect: 0, timeSec: 0 };
    }
    subjectsMap[subj].total += 1;
    const ans = answers.find(a => a.questionId === q.id);
    if (ans) {
      subjectsMap[subj].timeSec += ans.timeSpentSec || 0;
      if (ans.isCorrect) subjectsMap[subj].correct += 1;
      else if (ans.answer.trim().length > 0) subjectsMap[subj].incorrect += 1;
    }
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ── PW Hero Scorecard Banner ── */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${theme.cardBorder} ${theme.cardBg} relative overflow-hidden shadow-xl`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#5a4bda] text-white text-[10px] font-black tracking-widest uppercase">
                EduPlus Diagnostic
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Qualified (Target 18+ Met)</span>
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <h2 className={`text-4xl sm:text-5xl font-display font-black tracking-tight ${theme.textPrimary}`}>
                {score} <span className="text-2xl font-normal text-slate-400">/ {totalMarks}</span>
              </h2>
              <span className={`px-3 py-1 rounded-2xl text-sm font-bold ${
                percentage >= 70 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                percentage >= 45 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {percentage}% Score
              </span>
            </div>

            <p className={`text-xs sm:text-sm ${theme.textSecondary} max-w-xl`}>
              Based on official EduPlus scoring pattern: <strong className="text-emerald-400">+4 for correct</strong>, <strong className="text-rose-400">-1 for incorrect</strong>, and 0 for unattempted.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-4 rounded-2xl border ${theme.subCardBorder} ${theme.subCardBg} text-center`}>
              <span className={`text-[10px] uppercase font-bold ${theme.textMuted} block`}>AIR Rank</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">#{estimatedRank}</span>
              <span className="text-[10px] text-slate-400 block">All-India Standing</span>
            </div>

            <div className={`p-4 rounded-2xl border ${theme.subCardBorder} ${theme.subCardBg} text-center`}>
              <span className={`text-[10px] uppercase font-bold ${theme.textMuted} block`}>Percentile</span>
              <span className="text-xl sm:text-2xl font-black text-[#818cf8]">{percentile}th</span>
              <span className="text-[10px] text-slate-400 block">Class Standing</span>
            </div>

            <div className={`p-4 rounded-2xl border ${theme.subCardBorder} ${theme.subCardBg} text-center`}>
              <span className={`text-[10px] uppercase font-bold ${theme.textMuted} block`}>Accuracy</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">{accuracy}%</span>
              <span className="text-[10px] text-slate-400 block">Strike Precision</span>
            </div>

            <div className={`p-4 rounded-2xl border ${theme.subCardBorder} ${theme.subCardBg} text-center`}>
              <span className={`text-[10px] uppercase font-bold ${theme.textMuted} block`}>Time Spent</span>
              <span className="text-xl sm:text-2xl font-black text-blue-400">{formatSecs(timeTaken)}</span>
              <span className="text-[10px] text-slate-400 block">of {formatSecs(timeAllowed)}</span>
            </div>
          </div>
        </div>

        {/* Action bar inside Hero */}
        <div className={`mt-6 pt-4 border-t ${theme.cardBorder} flex flex-wrap items-center justify-between gap-3`}>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Negative Marking Deductions: <strong className="text-rose-400">-{incorrectCount} Marks</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToLeaderboard}
              className={`px-4 py-2 rounded-xl border ${theme.subCardBorder} ${theme.subCardBg} ${theme.textPrimary} hover:${theme.cardBorder} text-xs font-bold flex items-center gap-1.5 transition-colors`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>View Leaderboard</span>
            </button>

            <button
              onClick={onNavigateToSolutions}
              className={`px-4 py-2 rounded-xl ${theme.accentBtn} text-xs font-bold flex items-center gap-1.5 shadow-md`}
            >
              <span>View Question Solutions (Tab 2)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── PW Question Breakdown Matrix ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border ${theme.cardBorder} ${theme.cardBg} space-y-1`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${theme.textMuted}`}>Correct Answers</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{correctCount}</div>
          <span className="text-[11px] text-emerald-500/80 font-mono">+{correctCount * 4} Marks Gained</span>
        </div>

        <div className={`p-5 rounded-2xl border ${theme.cardBorder} ${theme.cardBg} space-y-1`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${theme.textMuted}`}>Incorrect Answers</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">{incorrectCount}</div>
          <span className="text-[11px] text-rose-500/80 font-mono">-{incorrectCount} Negative Marks</span>
        </div>

        <div className={`p-5 rounded-2xl border ${theme.cardBorder} ${theme.cardBg} space-y-1`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${theme.textMuted}`}>Unattempted</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-400">{unattemptedCount}</div>
          <span className="text-[11px] text-slate-500 font-mono">0 Marks Impact</span>
        </div>

        <div className={`p-5 rounded-2xl border ${theme.cardBorder} ${theme.cardBg} space-y-1`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${theme.textMuted}`}>Total Questions</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className={`text-2xl font-black ${theme.textPrimary}`}>{exam.questions.length}</div>
          <span className="text-[11px] text-blue-400 font-mono">Max Marks: {totalMarks}</span>
        </div>
      </div>

      {/* ── PW Subject-wise Performance Cards ── */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${theme.cardBorder} ${theme.cardBg} space-y-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-base font-bold ${theme.textPrimary} flex items-center gap-2`}>
              <BookOpen className="w-4 h-4 text-[#818cf8]" />
              <span>Subject-wise Performance Breakdown</span>
            </h3>
            <p className={`text-xs ${theme.textMuted} mt-0.5`}>
              Physics, Chemistry, and Mathematics section metrics
            </p>
          </div>
          <span className="text-xs font-mono text-[#818cf8] font-bold">EduPlus Test Series Analytics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(subjectsMap).map(([subjectName, stats]) => {
            const subjMarks = stats.correct * 4 - stats.incorrect;
            const subjMax = stats.total * 4;
            const subjPct = subjMax > 0 ? Math.round((Math.max(0, subjMarks) / subjMax) * 100) : 0;
            const subjAccuracy = (stats.correct + stats.incorrect) > 0 
              ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100) 
              : 0;

            return (
              <div
                key={subjectName}
                className={`p-5 rounded-2xl border ${theme.subCardBorder} ${theme.subCardBg} space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${theme.textPrimary}`}>{subjectName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                    subjPct >= 70 ? 'bg-emerald-500/15 text-emerald-400' :
                    subjPct >= 40 ? 'bg-amber-500/15 text-amber-400' :
                    'bg-rose-500/15 text-rose-400'
                  }`}>
                    {subjMarks} / {subjMax} Marks
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Mastery</span>
                    <span>{subjPct}%</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all ${
                        subjPct >= 70 ? 'bg-emerald-500' : subjPct >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${subjPct}%` }}
                    />
                  </div>
                </div>

                {/* Counters */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-white/5">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Correct</span>
                    <span className="font-bold text-emerald-400">{stats.correct}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Wrong</span>
                    <span className="font-bold text-rose-400">{stats.incorrect}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Accuracy</span>
                    <span className="font-bold text-blue-400">{subjAccuracy}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
