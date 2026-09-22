import React, { useRef, useState, useEffect } from 'react';
import { ShieldCheck, UserX, Server, Award, CheckCircle2, Lock, Fingerprint, Globe2 } from 'lucide-react';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const PILLARS = [
  {
    icon: ShieldCheck,
    color: 'brand',
    iconBg: 'rgba(16,185,129,0.1)',
    iconBorder: 'rgba(16,185,129,0.2)',
    iconColor: '#34d399',
    title: 'India DPDP Act 2023',
    text: 'Strict consent framework for minors, verifiable parental consent capture, and clear purpose limitation for K-12 assessments.',
  },
  {
    icon: UserX,
    color: 'indigo',
    iconBg: 'rgba(99,102,241,0.1)',
    iconBorder: 'rgba(99,102,241,0.2)',
    iconColor: '#818cf8',
    title: 'Student Zero-Data Retention',
    text: 'Students take assessments with ephemeral single-use links. No personal social logins, passwords, or tracking telemetry stored without consent.',
  },
  {
    icon: Server,
    color: 'amber',
    iconBg: 'rgba(245,158,11,0.1)',
    iconBorder: 'rgba(245,158,11,0.2)',
    iconColor: '#fbbf24',
    title: 'India Data Residency',
    text: '100% of data hosted in Tier-4 Mumbai / Hyderabad data centers, ensuring ultra-low 25 ms test latencies and sovereign compliance.',
  },
  {
    icon: Award,
    color: 'emerald',
    iconBg: 'rgba(52,211,153,0.1)',
    iconBorder: 'rgba(52,211,153,0.2)',
    iconColor: '#6ee7b7',
    title: 'Global Student ID (GSID)',
    text: 'A portable cryptographic academic identifier that enables students to retain mastery milestones seamlessly across school transfers.',
  },
];

const AUDIT_FEATURES = [
  { title: 'Right to Erasure & Export', body: 'One-click parent export of all academic mastery telemetry in JSON / PDF formats.' },
  { title: 'Encrypted AI Inferences', body: 'No student identity information is passed into AI prompts during question generation or rubric grading.' },
  { title: 'Role-Based Access Control', body: 'Strict separation of duties between Admins, Subject Heads, Teachers, and Parents.' },
  { title: 'Low-Bandwidth Offline Sync', body: 'Offline-resilient answer queue for low-connectivity environments across Tier-2/3 cities.' },
];

export const SecurityTrust: React.FC = () => {
  const headerReveal = useReveal();
  const pillarsReveal = useReveal();
  const auditReveal = useReveal();

  return (
    <section className="py-24 relative overflow-hidden border-t border-white/[0.04]" id="security">
      {/* Background */}
      <div className="absolute inset-0 radial-glow-indigo opacity-20 pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div
          ref={headerReveal.ref}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${headerReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="section-label glass-sm border border-white/[0.06] text-slate-400 mb-5">
            <Lock style={{width:'13px',height:'13px',color:'#818cf8'}} />
            DPDP Act 2023 &amp; Enterprise Trust
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mb-4">
            Engineered for{' '}
            <span className="gradient-text-indigo">Uncompromising Privacy</span>
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Student privacy and institutional security are baked into every layer of EduPulse AI architecture — not bolted on as an afterthought.
          </p>
        </div>

        {/* 4 Pillars */}
        <div
          ref={pillarsReveal.ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14"
        >
          {PILLARS.map((p, i) => (
            <div
              key={i}
              className={`card-glow-hover rounded-3xl p-6 space-y-4 flex flex-col transition-all duration-500 ${pillarsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{
                background: 'rgba(15,23,42,0.55)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${p.iconBorder}`,
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: p.iconBg, border: `1px solid ${p.iconBorder}` }}
              >
                <p.icon style={{ width: '20px', height: '20px', color: p.iconColor }} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white mb-2">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Audit Trail Box */}
        <div
          ref={auditReveal.ref}
          className={`rounded-3xl p-8 glass border border-indigo-500/15 transition-all duration-700 ${auditReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Fingerprint style={{width:'22px',height:'22px',color:'#818cf8'}} />
              </div>
              <h3 className="text-2xl font-display font-bold text-white leading-tight">
                Institutional Grade Audit Trails
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every test generation, score override, and proctoring violation is logged immutably with cryptographic timestamps for complete transparency and NCPCR compliance.
              </p>
              <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500">
                <Globe2 style={{width:'12px',height:'12px',color:'#6366f1'}} />
                Mumbai · Hyderabad Edge CDN · 25ms avg latency
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AUDIT_FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-white/[0.06] flex items-start gap-3 card-hover"
                  style={{animationDelay:`${i*60}ms`}}
                >
                  <div className="w-6 h-6 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 style={{width:'12px',height:'12px',color:'#34d399'}} />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block mb-1">{f.title}</span>
                    <span className="text-[11px] text-slate-400 leading-relaxed">{f.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
