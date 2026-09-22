import React, { useState } from 'react';
import { BarChart3, AlertTriangle, Send, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const CHAPTERS = [
  { name: 'Chemical Reactions',  mastery: 88, difficulty: 'Easy',   bloom: 'Recall & Balance' },
  { name: 'Acids, Bases & Salts',mastery: 82, difficulty: 'Medium', bloom: 'Application' },
  { name: 'Metals & Non-metals', mastery: 74, difficulty: 'Medium', bloom: 'Reasoning' },
  { name: 'Life Processes',      mastery: 86, difficulty: 'Medium', bloom: 'Systems Biology' },
  { name: 'Light – Reflection',  mastery: 79, difficulty: 'Hard',   bloom: 'Ray Diagrams' },
  { name: 'Electricity',         mastery: 64, difficulty: 'Hard',   bloom: 'Numerical Formulas' },
  { name: 'Magnetic Effects',    mastery: 71, difficulty: 'Medium', bloom: 'Right-Hand Rule' },
];

const SUBJECTS = ['Science', 'Mathematics', 'Social Science'];

export const MasteryHeatmap: React.FC = () => {
  const { students } = useApp();
  const [selectedSubject, setSelectedSubject] = useState('Science');
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);

  const atRisk = students.filter(s => s.isAtRisk);
  const classAvg = Math.round(CHAPTERS.reduce((s, c) => s + c.mastery, 0) / CHAPTERS.length);

  const handleWhatsApp = (name: string, phone: string, reason: string) => {
    alert(`WhatsApp diagnostic alert sent to parent of ${name} (${phone}):\n"${reason}. AI Tutor review session scheduled."`);
  };

  const tier = (m: number) => m >= 80 ? 'high' : m >= 70 ? 'medium' : 'low';
  const tierLabel = (m: number) => m >= 80 ? 'Mastery' : m >= 70 ? 'Progressing' : 'Needs Help';
  const tierBadge = (m: number) => m >= 80 ? 'badge-emerald' : m >= 70 ? 'badge-amber' : 'badge-rose';
  const tierBorder = (m: number) => m >= 80
    ? 'border-brand-500/25 bg-brand-500/5'
    : m >= 70
    ? 'border-amber-500/25 bg-amber-500/5'
    : 'border-rose-500/25 bg-rose-500/5';
  const TierIcon = (m: number) => m >= 80
    ? <TrendingUp style={{width:'12px',height:'12px',color:'#34d399'}} />
    : m >= 70
    ? <Minus style={{width:'12px',height:'12px',color:'#fbbf24'}} />
    : <TrendingDown style={{width:'12px',height:'12px',color:'#fb7185'}} />;

  return (
    <div className="space-y-6">

      {/* Header card */}
      <div className="glass rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 style={{width:'18px',height:'18px',color:'#10b981'}} />
            <h2 className="text-xl font-display font-bold text-white">Chapter Mastery Heatmap</h2>
          </div>
          <p className="text-xs text-slate-400">Real-time competency tracking aligned with NEP 2020 benchmarks</p>
        </div>

        {/* Subject selector */}
        <div className="tab-bar shrink-0">
          {SUBJECTS.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`tab-item ${selectedSubject === sub ? 'active' : ''}`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Class Average Banner */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Class Average',  value: `${classAvg}%`, sub: `${selectedSubject} · 7 chapters`, color: 'text-brand-400' },
          { label: 'Strong Chapters',value: CHAPTERS.filter(c => c.mastery >= 80).length, sub: 'Above 80% mastery', color: 'text-emerald-400' },
          { label: 'Needs Focus',    value: CHAPTERS.filter(c => c.mastery < 70).length, sub: 'Below 70% mastery', color: 'text-rose-400' },
        ].map((s, i) => (
          <div key={i} className="stat-card text-center">
            <p className={`text-3xl font-display font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-bold text-white mt-1">{s.label}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="glass rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-bold text-base text-white">Chapter-wise Distribution</h3>
          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-500 inline-block"/>≥ 80% Mastery</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/>70–79%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block"/>&lt; 70%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHAPTERS.map(ch => (
            <div
              key={ch.name}
              onMouseEnter={() => setHoveredChapter(ch.name)}
              onMouseLeave={() => setHoveredChapter(null)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 space-y-3 ${tierBorder(ch.mastery)} ${hoveredChapter === ch.name ? 'scale-[1.02] shadow-lg' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-xs text-white leading-tight flex-1">{ch.name}</span>
                <span className={`badge ${tierBadge(ch.mastery)} shrink-0`} style={{fontSize:'9px'}}>
                  {ch.mastery}%
                </span>
              </div>

              <div className="mastery-bar">
                <div
                  className={`mastery-bar-fill ${tier(ch.mastery)}`}
                  style={{ width: `${ch.mastery}%`, animation: 'none', transition: 'width 0.6s ease' }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {TierIcon(ch.mastery)}
                  <span className={`text-[10px] font-semibold ${
                    ch.mastery >= 80 ? 'text-brand-400' : ch.mastery >= 70 ? 'text-amber-400' : 'text-rose-400'
                  }`}>{tierLabel(ch.mastery)}</span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono truncate max-w-[80px]">{ch.bloom}</span>
              </div>

              <div className="flex justify-between text-[10px] text-slate-500">
                <span>{ch.difficulty} Difficulty</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* At-Risk Early Warning */}
      <div className="glass rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center">
              <AlertTriangle style={{width:'15px',height:'15px',color:'#fb7185'}} />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white">AI Early Warning System</h3>
              <p className="text-[10px] text-slate-400">Students requiring proactive intervention</p>
            </div>
          </div>
          <span className="badge badge-rose" style={{fontSize:'9px'}}>
            {atRisk.length} student{atRisk.length !== 1 ? 's' : ''} flagged
          </span>
        </div>

        <div className="space-y-3">
          {atRisk.map(st => (
            <div
              key={st.gsid}
              className="p-4 rounded-2xl bg-rose-950/15 border border-rose-500/20 hover:border-rose-500/35 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-300 font-black font-display text-base flex items-center justify-center shrink-0">
                  {st.name.charAt(0)}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white">{st.name}</span>
                    <span className="badge" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'#64748b',fontSize:'9px'}}>
                      Roll: {st.rollNumber}
                    </span>
                    <span className="text-[9px] font-mono text-slate-600">{st.gsid}</span>
                  </div>
                  <p className="text-xs text-rose-300 font-medium">{st.riskReason}</p>
                  <p className="text-[11px] text-slate-500">
                    Parent: <span className="text-slate-400">{st.parentName}</span> · {st.parentPhone}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleWhatsApp(st.name, st.parentPhone, st.riskReason || '')}
                className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all hover:scale-[1.02] shadow-md shadow-emerald-600/20 shrink-0"
              >
                <Send style={{width:'12px',height:'12px'}} />
                Dispatch WhatsApp Alert
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
