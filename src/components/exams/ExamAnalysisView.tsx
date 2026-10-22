import React, { useMemo } from 'react';
import { 
  Trophy, Clock, Target, AlertTriangle, CheckCircle2, 
  HelpCircle, BookOpen, ArrowRight, Sparkles, TrendingUp,
  Brain, FileText, RotateCcw, Share2, BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { ExamModel, AttemptModel } from '../../types/schemas';
import { GRADING_AND_ANALYSIS_SERVICE, ComprehensiveAnalysisResult } from '../../services/gradingAndAnalysisService';

interface ExamAnalysisViewProps {
  exam: ExamModel;
  attempt: AttemptModel;
  onRetakeExam: () => void;
  onPracticeChapter: (chapterName: string) => void;
  onBackToLibrary: () => void;
}

export const ExamAnalysisView: React.FC<ExamAnalysisViewProps> = ({
  exam,
  attempt,
  onRetakeExam,
  onPracticeChapter,
  onBackToLibrary
}) => {
  const analysis: ComprehensiveAnalysisResult = useMemo(() => {
    return GRADING_AND_ANALYSIS_SERVICE.generateAnalysis(exam, attempt);
  }, [exam, attempt]);

  const {
    score,
    totalMarks,
    percentage,
    timeTakenSec,
    timeAllowedSec,
    percentile,
    accuracyByType,
    accuracyByDifficulty,
    hardestQuestions,
    chapterMastery,
    chaptersToImprove,
    aiStudyPlan,
    trendHistory
  } = analysis;

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // Recharts radar data format
  const radarData = chapterMastery.map(cm => ({
    subject: cm.chapterName.slice(0, 18),
    score: cm.percentage,
    fullMark: 100
  }));

  // Recharts bar data format
  const barData = chapterMastery.map(cm => ({
    name: cm.chapterName.slice(0, 20),
    percentage: cm.percentage,
    status: cm.status
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-white">
      
      {/* ── Top Hero Score Banner ── */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/[0.08] bg-gradient-to-br from-indigo-950 via-slate-900 to-black shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald flex items-center gap-1 text-[10px]">
                <CheckCircle2 className="w-3 h-3" />
                <span>Performance Diagnostic Ready</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">• {exam.title}</span>
            </div>

            <div className="flex items-baseline gap-4">
              <h1 className="text-4xl sm:text-5xl font-display font-black text-white">
                {score} <span className="text-2xl font-normal text-slate-400">/ {totalMarks}</span>
              </h1>
              <span className={`px-3 py-1 rounded-2xl text-sm font-bold ${
                percentage >= 75 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                percentage >= 50 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {percentage}% Score
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Diagnostic calculated using weighted multi-factor difficulty scoring, time strain analysis, and AI curriculum mistake taxonomy.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Percentile Rank</span>
              <span className="text-xl font-black text-amber-400">{percentile}th</span>
              <span className="text-[10px] text-slate-500 block">Class Standing</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Time Spent</span>
              <span className="text-xl font-black text-blue-400">{formatSecs(timeTakenSec)}</span>
              <span className="text-[10px] text-slate-500 block">of {formatSecs(timeAllowedSec)}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Daily Study Rec</span>
              <span className="text-xl font-black text-purple-400">{aiStudyPlan.suggestedDailyMinutes}m</span>
              <span className="text-[10px] text-slate-500 block">Target Schedule</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <button
            onClick={onBackToLibrary}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-slate-300"
          >
            ← Back to Library
          </button>
          <button
            onClick={onRetakeExam}
            className="px-5 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-xs font-bold text-white shadow-lg shadow-blue-500/25 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Exam</span>
          </button>
        </div>
      </div>

      {/* ── Accuracy Grids: By Type & By Difficulty ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Accuracy by Question Type */}
        <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Accuracy by Question Type</span>
          </h3>

          <div className="space-y-3">
            {Object.keys(accuracyByType).map(typeKey => {
              const data = accuracyByType[typeKey];
              return (
                <div key={typeKey} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="capitalize font-semibold text-slate-300">{typeKey.replace('_', ' ')}</span>
                    <span className="font-mono text-slate-400">{data.correct} / {data.total} ({data.pct}%)</span>
                  </div>
                  <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/[0.04]">
                    <div
                      className={`h-full rounded-full transition-all ${
                        data.pct >= 75 ? 'bg-emerald-500' : data.pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${data.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accuracy by Difficulty */}
        <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <span>Accuracy by Difficulty Level</span>
          </h3>

          <div className="space-y-3">
            {['easy', 'medium', 'hard'].map(diffKey => {
              const data = accuracyByDifficulty[diffKey] || { correct: 0, total: 0, pct: 0 };
              return (
                <div key={diffKey} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="capitalize font-semibold text-slate-300">{diffKey} Level</span>
                    <span className="font-mono text-slate-400">{data.correct} / {data.total} ({data.pct}%)</span>
                  </div>
                  <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/[0.04]">
                    <div
                      className={`h-full rounded-full transition-all ${
                        diffKey === 'easy' ? 'bg-emerald-500' : diffKey === 'medium' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${data.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section 2: Hardest Questions (Top 5 by Difficulty Score) ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Top Hardest Questions Faced (By Difficulty Score)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by the prompt formula: <code className="text-[11px] text-blue-300">40*(1-marks/max) + 30*time + 15*changes + 15*skipped</code>
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Showing Top 5 Challenging Items</span>
        </div>

        <div className="space-y-4">
          {hardestQuestions.map((hq, idx) => (
            <div
              key={hq.questionId}
              className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-white/[0.12] transition-all space-y-3"
            >
              {/* Question header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-300 font-mono text-xs font-bold flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">{hq.chapterName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 font-mono">
                    Ref: {hq.pageRef}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-rose-400 font-bold">
                    Diff Score: {hq.difficultyScore} / 100
                  </span>
                  <span className="text-slate-400">
                    Class Accuracy: {hq.classWideAccuracyPct}%
                  </span>
                </div>
              </div>

              {/* Question text */}
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                {hq.questionText}
              </p>

              {/* Answer comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-rose-400 block">Your Answer:</span>
                  <p className="font-semibold">{hq.studentAnswer}</p>
                  <span className="text-[10px] text-slate-400 block">Time Spent: {hq.timeSpentSec}s (Est: {hq.estimatedTimeSec}s)</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Correct Textbook Answer:</span>
                  <p className="font-semibold">{hq.correctAnswer}</p>
                  <p className="text-[10px] text-slate-400 italic">Explanation: {hq.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Chapter-Wise Mastery Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar Chart Mastery */}
        <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-400" />
              <span>Chapter Score % Mastery</span>
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-rose-400">Weak &lt;50%</span>
              <span className="text-amber-400">Avg 50-75%</span>
              <span className="text-emerald-400">Strong &gt;75%</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2e" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1c1e', borderColor: '#3f3f46', borderRadius: '12px', fontSize: '11px' }} 
                  formatter={(val: any) => [`${val}%`, 'Score Mastery']}
                />
                <Bar dataKey="percentage" fill="#0071e3" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart Mastery */}
        <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>Curriculum Knowledge Radar</span>
          </h3>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2c2c2e" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 9 }} />
                <Radar name="Score %" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Section 4: Chapters to Improve with 1-Click Practice Exam ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] space-y-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Chapters to Improve &amp; Target Practice</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked list of weak chapters with exact page references and 1-click targeted exam generation.
          </p>
        </div>

        {chaptersToImprove.length === 0 ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
            🎉 Outstanding performance! All tested chapters reached Strong mastery (&gt;75%).
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chaptersToImprove.map((ch, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{ch.chapterName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 text-[10px] font-bold font-mono">
                      {ch.percentage}% Mastery
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    <strong className="text-slate-400">Diagnosis:</strong> {ch.whyWeakReason}
                  </p>

                  <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                    <div>
                      <strong className="text-slate-300">Missed Sub-Topics:</strong> {ch.missedSubtopics.join(', ')}
                    </div>
                    <div>
                      <strong className="text-slate-300">Pages to Revisit:</strong>{' '}
                      <span className="text-blue-400 font-mono">{ch.pagesToRevisit.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onPracticeChapter(ch.chapterName)}
                  className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Practice this Chapter (Generate Exam)</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Section 5: AI Study Plan ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">AI Custom Study Plan</h2>
            <p className="text-xs text-indigo-200">
              Formulated by analyzing your specific mistake patterns (careless slips, concept gaps, and time pressure).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
            <span className="text-[10px] text-indigo-300 uppercase font-bold">Priority Revision</span>
            <p className="text-xs font-semibold text-white truncate">
              {aiStudyPlan.priorityChapters[0] || 'Core Principles'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
            <span className="text-[10px] text-indigo-300 uppercase font-bold">Suggested Daily Cadence</span>
            <p className="text-xs font-semibold text-white">
              {aiStudyPlan.suggestedDailyMinutes} Minutes / Day
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
            <span className="text-[10px] text-indigo-300 uppercase font-bold">Key Sub-Topics</span>
            <p className="text-xs font-semibold text-white truncate">
              {aiStudyPlan.topicsToRevise.slice(0, 2).join(', ') || 'Formulas & Definitions'}
            </p>
          </div>
        </div>

        {/* 3 Tailored Tips */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
            Tailored Coaching Recommendations:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiStudyPlan.tips.map((tip, tIdx) => (
              <div key={tIdx} className="p-3.5 rounded-2xl bg-black/30 border border-white/[0.06] text-xs text-slate-300 leading-relaxed">
                <span className="text-amber-400 font-bold block mb-1">Tip #{tIdx + 1}:</span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 6: Progress Over Time Line Chart ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Progress &amp; Score Trend Over Time</span>
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendHistory} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2e" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1c1c1e', borderColor: '#3f3f46', borderRadius: '12px', fontSize: '11px' }}
                formatter={(val: any) => [`${val}%`, 'Score']}
              />
              <Line type="monotone" dataKey="scorePct" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
