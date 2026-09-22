import React from 'react';
import {
  Building2, Users, ShieldCheck, UploadCloud,
  BarChart3, TrendingUp, AlertTriangle, CheckCircle2,
  Globe, Zap, Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BulkRosterImport } from './BulkRosterImport';
import { DPDPAuditLogs } from './DPDPAuditLogs';

export const AdminConsole: React.FC = () => {
  const { adminTab, setAdminTab, organizations, students, tests } = useApp();

  const adminTabs = [
    { id: 'branches', label: 'Branch Overview', icon: Building2 },
    { id: 'roster',   label: 'Bulk CSV Roster', icon: UploadCloud },
    { id: 'dpdp',     label: 'DPDP & Audit',    icon: ShieldCheck },
  ] as const;

  const topStats = [
    { label: 'Affiliated Schools',    value: organizations.length,   sub: 'Delhi · Mumbai · Bengaluru', color: 'brand' },
    { label: 'Enrolled Students',     value: '5,950',                sub: 'GSID Registered',            color: 'emerald' },
    { label: 'Teaching Faculty',      value: '345',                  sub: 'Active AI Creators',         color: 'indigo' },
    { label: 'Institutional Plan',    value: 'Enterprise',           sub: 'Unlimited Assessments',      color: 'amber' },
  ];

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
              <span className="badge badge-amber">Multi-School Institution HQ</span>
              <span className="text-xs text-slate-500">• Principal Archana Iyer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Institutional Admin &amp; Governance Console
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Multi-branch oversight, DPDP compliance, and roster management in one unified hub.
            </p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass border border-amber-500/20">
          <div className="status-dot-live" style={{background:'#f59e0b',boxShadow:'0 0 0 0 rgba(245,158,11,0.6)'}} />
          <span className="text-xs font-bold text-amber-400">Systems Operational</span>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="tab-bar">
        {adminTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id)}
            className={`tab-item flex items-center gap-1.5 ${adminTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon style={{width:'12px',height:'12px'}} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Sub-tab content ── */}
      {adminTab === 'roster' && <div className="animate-fade-in-up"><BulkRosterImport /></div>}
      {adminTab === 'dpdp'   && <div className="animate-fade-in-up"><DPDPAuditLogs /></div>}

      {adminTab === 'branches' && (
        <div className="space-y-6 animate-fade-in-up">

          {/* Top stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {topStats.map((stat, i) => (
              <div key={i} className="stat-card" style={{animationDelay:`${i*60}ms`}}>
                <p className="text-[11px] text-slate-400 mb-1">{stat.label}</p>
                <p className={`text-2xl font-display font-black ${
                  stat.color === 'brand'   ? 'text-white' :
                  stat.color === 'emerald' ? 'text-brand-400' :
                  stat.color === 'indigo'  ? 'gradient-text-indigo' : 'text-amber-400'
                }`}>{stat.value}</p>
                <p className={`text-[11px] mt-0.5 font-semibold ${
                  stat.color === 'brand'   ? 'text-brand-400' :
                  stat.color === 'emerald' ? 'text-emerald-400' :
                  stat.color === 'indigo'  ? 'text-indigo-400' : 'text-amber-400'
                }`}>{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Network-wide health bar */}
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 style={{width:'15px',height:'15px',color:'#10b981'}} />
                <h3 className="font-display font-bold text-sm text-white">Network Assessment Activity</h3>
              </div>
              <span className="badge badge-emerald" style={{fontSize:'9px'}}>Last 30 Days</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Tests Generated', value: tests.length * 3, icon: Zap, color: '#10b981' },
                { label: 'AI Grades Issued', value: 847, icon: CheckCircle2, color: '#818cf8' },
                { label: 'Proctor Flags', value: 23, icon: AlertTriangle, color: '#fbbf24' },
              ].map(({ label, value, icon: Icon, color }, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-white/[0.05] text-center">
                  <Icon style={{width:'18px',height:'18px',color,margin:'0 auto 6px'}} />
                  <p className="text-xl font-display font-black text-white">{value}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* School campuses grid */}
          <div className="glass rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-white">Managed School Campuses</h3>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Globe style={{width:'12px',height:'12px',color:'#818cf8'}} />
                3 cities · India
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {organizations.map((org, i) => (
                <div
                  key={org.id}
                  className="card-glow-hover rounded-2xl p-5 space-y-4"
                  style={{
                    background: 'rgba(15,23,42,0.55)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    animationDelay: `${i * 80}ms`
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <span className="badge badge-emerald" style={{fontSize:'9px'}}>{org.board}</span>
                        <span className="badge" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'#64748b',fontSize:'9px'}}>{org.plan}</span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-white leading-tight">{org.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{org.branch}, {org.city}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                      <Building2 style={{width:'16px',height:'16px',color:'#34d399'}} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.05]">
                    {[
                      { label: 'Students', value: org.studentCount.toLocaleString('en-IN'), icon: Users, color: '#10b981' },
                      { label: 'Teachers', value: org.teacherCount, icon: Award, color: '#818cf8' },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className="p-2.5 rounded-xl bg-slate-950/60 border border-white/[0.04]">
                        <div className="flex items-center gap-1 mb-1">
                          <Icon style={{width:'11px',height:'11px',color}} />
                          <span className="text-[10px] text-slate-500">{label}</span>
                        </div>
                        <span className="font-bold text-sm text-white">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Mini activity bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Platform Adoption</span>
                      <span className="text-brand-400 font-bold">
                        {Math.round((org.teacherCount / 120) * 100)}%
                      </span>
                    </div>
                    <div className="mastery-bar" style={{height:'3px'}}>
                      <div
                        className="mastery-bar-fill high"
                        style={{
                          width: `${Math.round((org.teacherCount / 120) * 100)}%`,
                          animation: 'none',
                          transition: 'width 0.8s ease'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
