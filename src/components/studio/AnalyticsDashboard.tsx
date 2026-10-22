import React from 'react';
import { UserLearningAnalytics } from '../../types/strater';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  Award, 
  Zap, 
  Sparkles 
} from 'lucide-react';

interface AnalyticsDashboardProps {
  analytics: UserLearningAnalytics;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics }) => {
  const hours = (analytics.totalStudyTimeMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-900/20 via-[#1c1c1e] to-blue-900/20 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#ff9f0a]/20 text-[#ff9f0a] border border-[#ff9f0a]/30 flex items-center gap-1">
              <Flame className="w-3 h-3 fill-current" /> {analytics.currentStreakDays}-Day Streak Active
            </span>
            <span className="text-xs text-[#86868b]">Cognitive Retention Metrics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">Study Analytics & Mastery Curve</h2>
          <p className="text-xs sm:text-sm text-[#86868b] mt-0.5">
            Empirical telemetry tracking active recall performance, study cadence, and forgetting curve mitigation.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#ff9f0a]/20 text-[#ff9f0a] flex items-center justify-center">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-lg font-bold text-white font-mono leading-none">{analytics.currentStreakDays} Days</div>
            <div className="text-[10px] text-[#86868b]">Longest: {analytics.longestStreakDays} days</div>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[#2997ff]">
            <span className="text-xs text-[#86868b]">Study Time</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{hours}h</div>
          <div className="text-[10px] text-[#86868b]">{analytics.totalStudyTimeMinutes} minutes logged</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[#30d158]">
            <span className="text-xs text-[#86868b]">Cards Mastered</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{analytics.totalCardsMastered}</div>
          <div className="text-[10px] text-[#86868b]">of {analytics.totalCardsReviewed} total reviews</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[#ff9f0a]">
            <span className="text-xs text-[#86868b]">Quiz Accuracy</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{analytics.quizAverageAccuracy}%</div>
          <div className="text-[10px] text-[#86868b]">Avg across assessments</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[#bf5af2]">
            <span className="text-xs text-[#86868b]">Sources Ingested</span>
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{analytics.sourcesIngestedCount}</div>
          <div className="text-[10px] text-[#86868b]">Active study materials</div>
        </div>
      </div>

      {/* Ebbinghaus Forgetting Curve vs Spaced Repetition Chart */}
      <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0071e3]" />
              <span>Ebbinghaus Forgetting Curve vs. SuperMemo SM-2 Retention</span>
            </h3>
            <p className="text-xs text-[#86868b]">Comparison of projected memory decay without review vs optimized active recall</p>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded-full bg-[#30d158]" />
              <span className="text-[#a1a1a6]">With SM-2 (~94%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded-full bg-red-400" />
              <span className="text-[#a1a1a6]">Without Review (~18%)</span>
            </div>
          </div>
        </div>

        {/* SVG Curve Diagram */}
        <div className="w-full h-56 pt-4 relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
            <defs>
              <linearGradient id="spacedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#30d158" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#30d158" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="20" x2="500" y2="20" stroke="#ffffff" strokeOpacity="0.05" />
            <line x1="0" y1="60" x2="500" y2="60" stroke="#ffffff" strokeOpacity="0.05" />
            <line x1="0" y1="100" x2="500" y2="100" stroke="#ffffff" strokeOpacity="0.05" />
            <line x1="0" y1="140" x2="500" y2="140" stroke="#ffffff" strokeOpacity="0.05" />

            {/* Forgetting decay line (Red) */}
            <path
              d="M 0,20 Q 80,120 500,145"
              fill="none"
              stroke="#ff453a"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />

            {/* Spaced repetition saw-tooth retention line (Green) */}
            <path
              d="M 0,20 
                 L 40,35 L 42,20 
                 L 120,40 L 122,20 
                 L 260,35 L 262,20 
                 L 500,28"
              fill="none"
              stroke="#30d158"
              strokeWidth="3"
            />

            {/* Filled area under spaced line */}
            <path
              d="M 0,20 
                 L 40,35 L 42,20 
                 L 120,40 L 122,20 
                 L 260,35 L 262,20 
                 L 500,28 L 500,160 L 0,160 Z"
              fill="url(#spacedGrad)"
            />

            {/* Markers */}
            <circle cx="42" cy="20" r="4" fill="#30d158" />
            <circle cx="122" cy="20" r="4" fill="#30d158" />
            <circle cx="262" cy="20" r="4" fill="#30d158" />
          </svg>

          {/* Time axis labels */}
          <div className="flex justify-between text-[10px] text-[#86868b] pt-2 border-t border-white/5">
            <span>Day 0 (Ingested)</span>
            <span>Day 1 (1st Review)</span>
            <span>Day 3 (2nd Review)</span>
            <span>Day 7 (3rd Review)</span>
            <span>Day 14 (4th Review)</span>
            <span>Day 30 (Mastered)</span>
          </div>
        </div>
      </div>

      {/* Weekly Activity Grid & Topic Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Weekly Activity Heatmap */}
        <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#ff9f0a]" />
              <span>Daily Study Activity Heatmap</span>
            </h4>
            <span className="text-[10px] text-[#86868b]">Last 7 Days</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {analytics.dailyLogs.map((log, idx) => {
              const dayName = new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' });
              const intensity = log.minutesStudied > 60 ? 'bg-[#30d158]' :
                                log.minutesStudied > 30 ? 'bg-[#0071e3]' :
                                log.minutesStudied > 0 ? 'bg-white/20' : 'bg-white/5';

              return (
                <div key={idx} className="space-y-1.5">
                  <span className="text-[10px] text-[#86868b]">{dayName}</span>
                  <div 
                    className={`h-12 rounded-xl flex flex-col items-center justify-center p-1 border border-white/5 transition-transform hover:scale-105 ${intensity}`}
                  >
                    <span className="text-xs font-bold text-white font-mono">{log.minutesStudied}m</span>
                    <span className="text-[8px] text-white/80">{log.cardsReviewed} cards</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Topic Mastery Distribution */}
        <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#bf5af2]" />
            <span>Domain Topic Mastery Breakdown</span>
          </h4>

          <div className="space-y-3">
            {analytics.topicProficiency.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white font-medium">{item.topic}</span>
                  <span className="text-[#2997ff] font-mono font-semibold">{item.score}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0071e3] to-[#30d158] rounded-full"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
