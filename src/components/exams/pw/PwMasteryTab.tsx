import React from 'react';
import { 
  BarChart2, Brain, TrendingUp, Sparkles, AlertTriangle, 
  CheckCircle2, BookOpen, ArrowRight 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, CartesianGrid 
} from 'recharts';
import { PwThemeConfig } from './pwTheme';
import { ChapterMasteryItem, ChapterToImproveItem } from '../../../services/gradingAndAnalysisService';

interface PwMasteryTabProps {
  chapterMastery: ChapterMasteryItem[];
  chaptersToImprove: ChapterToImproveItem[];
  theme: PwThemeConfig;
  onPracticeChapter: (chapterName: string) => void;
}

export const PwMasteryTab: React.FC<PwMasteryTabProps> = ({
  chapterMastery,
  chaptersToImprove,
  theme,
  onPracticeChapter
}) => {
  // Recharts radar data format
  const radarData = chapterMastery.map(cm => ({
    subject: cm.chapterName.slice(0, 16),
    score: cm.percentage,
    fullMark: 100
  }));

  // Recharts bar data format
  const barData = chapterMastery.map(cm => ({
    name: cm.chapterName.slice(0, 18),
    percentage: cm.percentage,
    status: cm.status
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ── Mastery Charts: Bar Chart + Radar Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar Chart Mastery */}
        <div className={`p-6 sm:p-8 rounded-3xl border ${theme.cardBorder} ${theme.cardBg} space-y-4 shadow-xl`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-bold ${theme.textPrimary} flex items-center gap-2`}>
              <BarChart2 className="w-4 h-4 text-blue-400" />
              <span>Chapter Score % Mastery</span>
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-rose-400">&lt;50% Weak</span>
              <span className="text-amber-400">50-75% Avg</span>
              <span className="text-emerald-400">&gt;75% Strong</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2e" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme.mode === 'pw-light' ? '#ffffff' : '#1c1c1e', 
                    borderColor: '#3f3f46', 
                    borderRadius: '12px', 
                    fontSize: '11px',
                    color: theme.mode === 'pw-light' ? '#0f172a' : '#ffffff'
                  }} 
                  formatter={(val: any) => [`${val}%`, 'Mastery Score']}
                />
                <Bar dataKey="percentage" fill="#5a4bda" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart Mastery */}
        <div className={`p-6 sm:p-8 rounded-3xl border ${theme.cardBorder} ${theme.cardBg} space-y-4 shadow-xl`}>
          <h3 className={`text-sm font-bold ${theme.textPrimary} flex items-center gap-2`}>
            <Brain className="w-4 h-4 text-purple-400" />
            <span>Curriculum Knowledge Radar</span>
          </h3>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2c2c2e" opacity={0.4} />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 9 }} />
                <Radar name="Score %" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Chapters to Improve with 1-Click Targeted Practice ── */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${theme.cardBorder} ${theme.cardBg} space-y-6 shadow-xl`}>
        <div>
          <h3 className={`text-base font-bold ${theme.textPrimary} flex items-center gap-2`}>
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Chapters to Improve &amp; Target Practice</span>
          </h3>
          <p className={`text-xs ${theme.textMuted} mt-0.5`}>
            Targeted diagnostic recommendations with textbook page numbers and 1-click AI practice exam generation
          </p>
        </div>

        {chaptersToImprove.length === 0 ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>🎉 Outstanding performance! All tested chapters reached Strong mastery (&gt;75%).</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chaptersToImprove.map((ch, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border ${theme.subCardBorder} ${theme.subCardBg} flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${theme.textPrimary} truncate`}>{ch.chapterName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 text-[10px] font-bold font-mono">
                      {ch.percentage}% Mastery
                    </span>
                  </div>

                  <p className={`text-xs ${theme.textSecondary}`}>
                    <strong className={theme.textMuted}>Diagnosis:</strong> {ch.whyWeakReason}
                  </p>

                  <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                    <div>
                      <strong className="text-slate-300">Missed Sub-Topics:</strong> {ch.missedSubtopics.join(', ')}
                    </div>
                    <div>
                      <strong className="text-slate-300">NCERT Pages to Revisit:</strong>{' '}
                      <span className="text-[#818cf8] font-mono">{ch.pagesToRevisit.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onPracticeChapter(ch.chapterName)}
                  className={`w-full py-2.5 rounded-xl ${theme.accentBtn} text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Practice this Chapter (Generate Exam)</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
