import React from 'react';
import { 
  Clock, AlertTriangle, Sparkles, TrendingUp, 
  CheckCircle2, XCircle, Zap, BookOpen 
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip 
} from 'recharts';
import { PwThemeConfig } from './pwTheme';
import { AIStudyPlan } from '../../../types/schemas';

interface PwTimeAnalyticsTabProps {
  timeTakenSec: number;
  timeAllowedSec: number;
  aiStudyPlan: AIStudyPlan;
  trendHistory: { attemptNumber: number; date: string; scorePct: number }[];
  theme: PwThemeConfig;
}

export const PwTimeAnalyticsTab: React.FC<PwTimeAnalyticsTabProps> = ({
  timeTakenSec,
  timeAllowedSec,
  aiStudyPlan,
  trendHistory,
  theme
}) => {
  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const unusedTime = Math.max(0, timeAllowedSec - timeTakenSec);
  const timeEfficiencyPct = Math.round((timeTakenSec / timeAllowedSec) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ── Time Allocation Breakdown Cards ── */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${theme.cardBorder} ${theme.cardBg} space-y-6 shadow-xl`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-base font-bold ${theme.textPrimary} flex items-center gap-2`}>
              <Clock className="w-4 h-4 text-blue-400" />
              <span>EduPlus Time Management Diagnostic</span>
            </h3>
            <p className={`text-xs ${theme.textMuted} mt-0.5`}>
              Pacing metrics, time strain, and strategic allocation
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {timeEfficiencyPct}% Time Utilized
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-4 rounded-2xl border ${theme.subCardBorder} ${theme.subCardBg} space-y-1`}>
            <span className={`text-[10px] uppercase font-bold ${theme.textMuted} block`}>Total Time Taken</span>
            <span className="text-2xl font-black text-blue-400">{formatSecs(timeTakenSec)}</span>
            <span className="text-[11px] text-slate-400 block">Out of {formatSecs(timeAllowedSec)}</span>
          </div>

          <div className={`p-4 rounded-2xl border ${theme.subCardBorder} ${theme.subCardBg} space-y-1`}>
            <span className={`text-[10px] uppercase font-bold ${theme.textMuted} block`}>Average / Question</span>
            <span className="text-2xl font-black text-emerald-400">48s</span>
            <span className="text-[11px] text-slate-400 block">Target: Under 60s / Q</span>
          </div>

          <div className={`p-4 rounded-2xl border ${theme.subCardBorder} ${theme.subCardBg} space-y-1`}>
            <span className={`text-[10px] uppercase font-bold ${theme.textMuted} block`}>Buffer Time Remaining</span>
            <span className="text-2xl font-black text-purple-400">{formatSecs(unusedTime)}</span>
            <span className="text-[11px] text-slate-400 block">Available for Review</span>
          </div>
        </div>

        {/* Wasted time alert */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Pacing Insight:</span>
            <p>
              On Question #3 (Electric Power &amp; Voltage scaling), you spent <strong>92 seconds</strong> and ultimately incurred a negative mark. In competitive exams (JEE/NEET), if a formula doesn't click within 45 seconds, flag it for review and move on to protect your net positive marks!
            </p>
          </div>
        </div>
      </div>

      {/* ── AI Personalized Study Plan ── */}
      <div className={`p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-[#121929] to-[#0a0e17] space-y-6 shadow-xl`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5a4bda]/20 text-[#818cf8] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">EduPlus AI Custom Action Plan</h3>
            <p className="text-xs text-indigo-200/80">
              Formulated by analyzing your error taxonomy and time distribution
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-indigo-300 uppercase font-bold">Priority Chapter</span>
            <p className="text-xs font-semibold text-white truncate">
              {aiStudyPlan.priorityChapters[0] || 'Electricity & Circuit Theory'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-indigo-300 uppercase font-bold">Recommended Daily Cadence</span>
            <p className="text-xs font-semibold text-white">
              {aiStudyPlan.suggestedDailyMinutes || 45} Minutes / Day
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-indigo-300 uppercase font-bold">Key Sub-Topics</span>
            <p className="text-xs font-semibold text-white truncate">
              {aiStudyPlan.topicsToRevise.slice(0, 2).join(', ') || 'Formulas & Scaling Traps'}
            </p>
          </div>
        </div>

        {/* 3 Tailored Tips */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
            EduPlus Master Faculty Coaching Advice:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiStudyPlan.tips.map((tip, tIdx) => (
              <div key={tIdx} className="p-3.5 rounded-2xl bg-black/30 border border-white/5 text-xs text-slate-300 leading-relaxed">
                <span className="text-amber-400 font-bold block mb-1">Tip #{tIdx + 1}:</span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Progress Over Time Line Chart ── */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${theme.cardBorder} ${theme.cardBg} space-y-4 shadow-xl`}>
        <h3 className={`text-sm font-bold ${theme.textPrimary} flex items-center gap-2`}>
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Progress &amp; Score Trend Over Time</span>
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendHistory} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2e" opacity={0.3} />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.mode === 'pw-light' ? '#ffffff' : '#1c1c1e', 
                  borderColor: '#3f3f46', 
                  borderRadius: '12px', 
                  fontSize: '11px',
                  color: theme.mode === 'pw-light' ? '#0f172a' : '#ffffff'
                }}
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
