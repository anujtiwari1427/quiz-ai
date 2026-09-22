import React, { useState } from 'react';
import {
  Users, Sparkles, TrendingUp, AlertTriangle, CheckCircle2,
  Download, MessageSquareQuote, CreditCard, Award, ChevronRight,
  BookOpen, BarChart3, Target, Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WhatsAppAuthModal } from './WhatsAppAuthModal';
import { AITutorDrawer } from './AITutorDrawer';
import { PricingSection } from '../marketing/PricingSection';

/* ── Score ring SVG ── */
const ScoreRing: React.FC<{ pct: number; size?: number }> = ({ pct, size = 72 }) => {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? '#10b981' : pct >= 65 ? '#f59e0b' : '#f43f5e';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={6} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.34,1.56,.64,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display font-black text-xs" style={{ color }}>{pct}%</span>
      </div>
    </div>
  );
};

export const ParentPortal: React.FC = () => {
  const {
    parentTab, setParentTab, students, activeChildGsid, setActiveChildGsid,
    isParentLoggedIn, setIsParentLoggedIn, attempts, tests, activePlan
  } = useApp();

  const [showAuthModal, setShowAuthModal] = useState(!isParentLoggedIn);

  const activeChild = students.find(s => s.gsid === activeChildGsid) || students[0];
  const childAttempts = attempts.filter(a => a.studentGsid === activeChild?.gsid);

  const handleDownloadReport = (testTitle: string) => {
    alert(`Generating DPDP-compliant report card for ${activeChild.name} (${testTitle}). PDF sent to WhatsApp +91 98765 43210.`);
  };

  const parentTabs = [
    { id: 'overview', label: 'Performance', icon: BarChart3 },
    { id: 'tutor', label: 'AI Tutor', icon: Sparkles },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="relative w-11 h-11 rounded-2xl bg-white p-1 shadow-lg flex items-center justify-center border border-white/20 shrink-0 mt-0.5">
            <img src="/logo.png" alt="EduPulse AI Logo" className="w-9 h-9 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="badge badge-emerald">Parent Portal</span>
              <span className="text-xs text-slate-500">• Verified WhatsApp +91 98765 43210</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Academic Dashboard &amp; AI Tutor
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">Real-time insight for every subject, every test, every child.</p>
          </div>
        </div>

        {/* Multi-Child Switcher */}
        <div className="tab-bar">
          {students.slice(0, 2).map(child => (
            <button
              key={child.gsid}
              onClick={() => setActiveChildGsid(child.gsid)}
              className={`tab-item flex items-center gap-2 ${child.gsid === activeChildGsid ? 'active' : ''}`}
            >
              <div className="w-5 h-5 rounded-full bg-slate-950/60 text-white text-[10px] flex items-center justify-center font-black">
                {child.name.charAt(0)}
              </div>
              {child.name.split(' ')[0]} · {child.classGrade}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="tab-bar">
        {parentTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setParentTab(tab.id)}
            className={`tab-item flex items-center gap-1.5 ${parentTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon style={{width:'12px',height:'12px'}} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ──────── OVERVIEW TAB ──────── */}
      {parentTab === 'overview' && (
        <div className="space-y-6 animate-fade-in-up">

          {/* Child profile hero card */}
          <div className="glass-emerald rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-slate-950 font-display font-black text-2xl flex items-center justify-center shadow-lg shadow-brand-500/30 shrink-0">
                {activeChild.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-xl font-display font-bold text-white">{activeChild.name}</h2>
                  <span className="badge badge-emerald" style={{fontSize:'9px'}}>{activeChild.board}</span>
                  {activeChild.isAtRisk && (
                    <span className="badge badge-rose" style={{fontSize:'9px'}}>At Risk</span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Class {activeChild.classGrade}-{activeChild.section} · Roll {activeChild.rollNumber} · {activeChild.schoolName}
                </p>
                <p className="text-[10px] font-mono text-slate-500 mt-1">
                  GSID: <strong className="text-slate-300">{activeChild.gsid}</strong>
                </p>
              </div>
            </div>

            {/* Mastery ring */}
            <div className="flex items-center gap-6 shrink-0">
              <div className="text-center">
                <ScoreRing pct={activeChild.overallMasteryPercentage} size={80} />
                <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">Overall Mastery</p>
                <p className="text-[10px] text-brand-400 font-bold">Top 10% Cohort</p>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 style={{width:'12px',height:'12px',color:'#34d399'}} />
                  {childAttempts.length} Tests Taken
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Award style={{width:'12px',height:'12px',color:'#fbbf24'}} />
                  NEP 2020 Competencies
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Target style={{width:'12px',height:'12px',color:'#818cf8'}} />
                  GSID Portable Record
                </div>
              </div>
            </div>
          </div>

          {/* At-risk alert */}
          {activeChild.isAtRisk && (
            <div className="p-5 rounded-3xl border border-rose-500/25 bg-rose-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle style={{width:'18px',height:'18px',color:'#fb7185'}} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-0.5">Proactive Concept Alert</h4>
                  <p className="text-xs text-rose-300 leading-relaxed">{activeChild.riskReason}</p>
                </div>
              </div>
              <button
                onClick={() => setParentTab('tutor')}
                className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] shrink-0"
              >
                <Sparkles style={{width:'13px',height:'13px'}} />
                Start Remedial Session
              </button>
            </div>
          )}

          {/* Subject mastery grid */}
          <div className="glass rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-white">Subject Mastery Breakdown</h3>
              <span className="badge badge-indigo" style={{fontSize:'9px'}}>Live Analytics</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(activeChild.subjectMastery).map(([subject, pct]) => (
                <div key={subject} className="p-4 rounded-2xl bg-slate-950/70 border border-white/[0.06] space-y-3 card-hover">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen style={{width:'13px',height:'13px',color: pct >= 80 ? '#34d399' : pct >= 65 ? '#fbbf24' : '#fb7185'}} />
                      <span className="text-xs font-bold text-white">{subject}</span>
                    </div>
                  </div>
                  <ScoreRing pct={pct} size={52} />
                  <div className="mastery-bar">
                    <div
                      className={`mastery-bar-fill ${pct >= 80 ? 'high' : pct >= 65 ? 'medium' : 'low'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {pct >= 80 ? '✓ Mastery Achieved' : pct >= 65 ? '⚡ Practice Recommended' : '⚠ Needs Attention'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment history */}
          <div className="glass rounded-3xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-white">Assessment Results History</h3>
            {childAttempts.length > 0 ? (
              <div className="space-y-3">
                {childAttempts.map(att => {
                  const t = tests.find(x => x.id === att.testId) || tests[0];
                  const scoreColor = (att.percentage ?? 0) >= 80 ? 'text-brand-400' : (att.percentage ?? 0) >= 60 ? 'text-amber-400' : 'text-rose-400';
                  return (
                    <div key={att.id} className="p-4 rounded-2xl bg-slate-950/60 border border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-hover">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <ScoreRing pct={att.percentage ?? 0} size={48} />
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-white truncate">{t.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {new Date(att.startTime).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                            {' '}· {Math.floor(att.timeSpentSeconds / 60)} min
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`text-xs font-bold ${scoreColor}`}>{att.totalScore}/{att.maxScore}</span>
                            <span className="text-[10px] text-slate-500">marks</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleDownloadReport(t.title)} className="btn-secondary py-1.5 px-3 rounded-xl text-[11px]">
                          <Download style={{width:'11px',height:'11px',color:'#10b981'}} />
                          PDF
                        </button>
                        <button onClick={() => setParentTab('tutor')} className="btn-primary py-1.5 px-3 rounded-xl text-[11px]">
                          <Sparkles style={{width:'11px',height:'11px'}} />
                          <span>AI Review</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center">
                <BookOpen style={{width:'28px',height:'28px',color:'#334155',margin:'0 auto 8px'}} />
                <p className="text-xs text-slate-400">No test attempts recorded yet for this child.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {parentTab === 'tutor'   && <div className="animate-fade-in-up"><AITutorDrawer /></div>}
      {parentTab === 'billing' && <div className="animate-fade-in-up"><PricingSection /></div>}

      {/* WhatsApp Login Modal */}
      {showAuthModal && (
        <WhatsAppAuthModal
          onSuccess={() => { setIsParentLoggedIn(true); setShowAuthModal(false); }}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};
