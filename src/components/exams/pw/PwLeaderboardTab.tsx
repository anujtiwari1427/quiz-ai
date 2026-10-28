import React from 'react';
import { 
  Trophy, Medal, Award, CheckCircle2, XCircle, 
  Clock, Zap, Target, TrendingUp, AlertTriangle, Users 
} from 'lucide-react';
import { PwThemeConfig } from './pwTheme';
import { PW_TOPPERS_LIST, PwTopperItem } from '../../../mock/pwTestData';

interface PwLeaderboardTabProps {
  theme: PwThemeConfig;
  userScore: number;
  totalMarks: number;
}

export const PwLeaderboardTab: React.FC<PwLeaderboardTabProps> = ({
  theme,
  userScore,
  totalMarks
}) => {
  const topper = PW_TOPPERS_LIST[0];
  const currentUser = PW_TOPPERS_LIST.find(t => t.isCurrentUser) || PW_TOPPERS_LIST[4];

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ── 1. You vs Topper vs Batch Average Comparison ── */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${theme.cardBorder} ${theme.cardBg} space-y-6 shadow-xl`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
          <div>
            <h3 className={`text-base font-bold ${theme.textPrimary} flex items-center gap-2`}>
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>EduPlus Benchmark: You vs Topper vs Batch Average</span>
            </h3>
            <p className={`text-xs ${theme.textMuted} mt-0.5`}>
              Direct comparison with All-India Rank #1 and current test series batch
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">12,480 Active Test Takers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rank 1 Topper */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
                Rank #1 (Topper)
              </span>
              <Medal className="w-5 h-5 text-amber-400" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">{topper.name}</h4>
              <p className="text-[11px] text-amber-300 font-mono">{topper.city}</p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-amber-500/20 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">Score:</span>
                <span className="font-bold text-amber-400">{topper.score} / {totalMarks} (100%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Accuracy:</span>
                <span className="font-bold text-emerald-400">{topper.accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Time Taken:</span>
                <span className="font-mono text-blue-300">{formatSecs(topper.timeSpentSec)}</span>
              </div>
            </div>
          </div>

          {/* Current User */}
          <div className={`p-5 rounded-2xl border-2 border-[#5a4bda] ${theme.subCardBg} space-y-3 relative shadow-lg shadow-indigo-600/10`}>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#5a4bda] text-white text-[10px] font-black uppercase tracking-wider">
                You (Rank #{currentUser.rank})
              </span>
              <Award className="w-5 h-5 text-[#818cf8]" />
            </div>

            <div>
              <h4 className={`text-sm font-bold ${theme.textPrimary}`}>{currentUser.name}</h4>
              <p className={`text-[11px] ${theme.accentText} font-mono`}>{currentUser.city}</p>
            </div>

            <div className={`space-y-1.5 pt-2 border-t ${theme.subCardBorder} text-xs`}>
              <div className="flex justify-between">
                <span className={theme.textMuted}>Score:</span>
                <span className={`font-bold ${theme.accentText}`}>{userScore} / {totalMarks} ({Math.round((userScore/totalMarks)*100)}%)</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textMuted}>Accuracy:</span>
                <span className="font-bold text-emerald-400">{currentUser.accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textMuted}>Time Taken:</span>
                <span className="font-mono text-blue-400">{formatSecs(currentUser.timeSpentSec)}</span>
              </div>
            </div>
          </div>

          {/* Batch Average */}
          <div className={`p-5 rounded-2xl border ${theme.subCardBorder} ${theme.subCardBg} space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-wider">
                Batch Average
              </span>
              <Users className="w-5 h-5 text-slate-400" />
            </div>

            <div>
              <h4 className={`text-sm font-bold ${theme.textPrimary}`}>EduPlus AITS Batch Avg</h4>
              <p className={`text-[11px] ${theme.textMuted} font-mono`}>All Verified Candidates</p>
            </div>

            <div className={`space-y-1.5 pt-2 border-t ${theme.subCardBorder} text-xs`}>
              <div className="flex justify-between">
                <span className={theme.textMuted}>Average Score:</span>
                <span className={`font-bold ${theme.textSecondary}`}>21.5 / {totalMarks} (53%)</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textMuted}>Average Accuracy:</span>
                <span className="font-bold text-amber-400">68%</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textMuted}>Average Time:</span>
                <span className="font-mono text-slate-400">34m 45s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Top 10 Toppers Leaderboard Table ── */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${theme.cardBorder} ${theme.cardBg} space-y-4 shadow-xl`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-base font-bold ${theme.textPrimary} flex items-center gap-2`}>
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>EduPlus All-India Rankers (Top 10)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Target JEE / NEET 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${theme.cardBorder} ${theme.textMuted} uppercase text-[10px] font-mono tracking-wider`}>
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Candidate</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-right">Score</th>
                <th className="py-3 px-3 text-right">Accuracy</th>
                <th className="py-3 px-3 text-right">Time Taken</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {PW_TOPPERS_LIST.map((topperItem) => {
                const isUser = topperItem.isCurrentUser;
                return (
                  <tr
                    key={topperItem.rank}
                    className={`transition-colors ${
                      isUser
                        ? `${theme.badgeBg} font-bold`
                        : `hover:${theme.subCardBg}`
                    }`}
                  >
                    <td className="py-3 px-3 font-mono">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold ${
                        topperItem.rank === 1 ? 'bg-amber-500 text-black shadow-md' :
                        topperItem.rank === 2 ? 'bg-slate-300 text-black' :
                        topperItem.rank === 3 ? 'bg-amber-700 text-white' :
                        isUser ? 'bg-[#5a4bda] text-white' :
                        'bg-white/5 text-slate-400'
                      }`}>
                        #{topperItem.rank}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={topperItem.avatar} 
                          alt={topperItem.name} 
                          className="w-7 h-7 rounded-full object-cover border border-white/10"
                        />
                        <span className={isUser ? 'text-[#818cf8] font-bold' : theme.textPrimary}>
                          {topperItem.name}
                        </span>
                      </div>
                    </td>

                    <td className={`py-3 px-3 ${theme.textMuted} font-mono text-[11px]`}>
                      {topperItem.city}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                      {topperItem.score} <span className="text-slate-500 font-normal">/ {topperItem.maxScore}</span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-400">
                      {topperItem.accuracy}%
                    </td>

                    <td className={`py-3 px-3 text-right font-mono ${theme.textMuted}`}>
                      {formatSecs(topperItem.timeSpentSec)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 3. PW Speed vs Accuracy Matrix (4 Quadrants) ── */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${theme.cardBorder} ${theme.cardBg} space-y-5 shadow-xl`}>
        <div>
          <h3 className={`text-base font-bold ${theme.textPrimary} flex items-center gap-2`}>
            <Target className="w-4 h-4 text-emerald-400" />
            <span>EduPlus Speed vs Accuracy Diagnostic Matrix</span>
          </h3>
          <p className={`text-xs ${theme.textMuted} mt-0.5`}>
            Analyzes whether questions were answered through mastery, overtime effort, or careless guessing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">1. Ideal Mastery Zone</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                6 Questions (60%)
              </span>
            </div>
            <p className="text-xs text-emerald-200/80">
              High Accuracy &amp; Optimal Speed. Solved correctly well under time limit.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-300">2. Overtime Correct</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold">
                1 Question (10%)
              </span>
            </div>
            <p className="text-xs text-blue-200/80">
              High Accuracy but slower speed. Spent &gt;75s but answered correctly. Practice EduPlus shortcuts to speed up!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">3. Quick Guesses / Flukes</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
                0 Questions (0%)
              </span>
            </div>
            <p className="text-xs text-amber-200/80">
              Low time spent without verified conceptual derivation. Avoid guessing in negative marking exams.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-300">4. Red Danger Zone (Wasted Time)</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold">
                1 Question (Q3 - 92s)
              </span>
            </div>
            <p className="text-xs text-rose-200/80">
              Spent excessive time (&gt;90s) and still received -1 negative marking. Learn to skip or verify early.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
