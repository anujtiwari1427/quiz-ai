import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, ArrowRight, CheckCircle2, GraduationCap, Users, 
  Smartphone, Play, FileCheck2, Zap, ShieldCheck, BarChart3,
  Star, Quote, ChevronRight, Award, Globe, Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PricingSection } from './PricingSection';
import { SecurityTrust } from './SecurityTrust';

/* ── tiny hook: animate-on-scroll ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ── animated counter ── */
function AnimatedCounter({ target, suffix = '', duration = 1800 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useReveal();
  useEffect(() => {
    if (!visible) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target, duration]);
  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>;
}

/* ── subject pill demos ── */
const DEMO_SUBJECTS = [
  { label: 'Class 10 Science', board: 'CBSE', bloom: 'Apply & Analyze', marks: 4,
    question: 'A concave mirror of focal length 15 cm produces an image twice the object size. Calculate both possible object distances and justify with the mirror formula.',
    scheme: 'Case 1 (Real image): m = −2 ⟹ v = −2u. Mirror formula: 1/f = 1/v + 1/u ⟹ u = −22.5 cm (2 M). Case 2 (Virtual): m = +2 ⟹ u = −7.5 cm (2 M).' },
  { label: 'Class 10 Math', board: 'CBSE', bloom: 'Deductive Logic & Proof', marks: 5,
    question: 'Prove the Basic Proportionality Theorem: If a line is drawn parallel to one side of a triangle, the other two sides are divided in the same ratio.',
    scheme: '1 M: Correct construction. 2 M: Ratio of areas of two triangles. 2 M: Concluding the theorem with geometric rigor.' },
  { label: 'Class 10 History', board: 'CBSE', bloom: 'Historical Evaluation', marks: 5,
    question: 'Analyze the economic hardships in Europe during the 1830s and explain how they contributed to popular revolts.',
    scheme: 'Population boom (1 M) + urban migration (1 M) + textile competition (1 M) + 1848 food crisis (1 M) + synthesis (1 M).' },
];

/* ── testimonials ── */
const TESTIMONIALS = [
  { name: 'Dr. Meera Krishnan', role: 'Science HOD, DPS R.K. Puram', text: 'EduPulse generates board-accurate CBSE marking schemes that would take me 3 hours in under 30 seconds. The proctoring telemetry alone has eliminated copying incidents by over 80%.' },
  { name: 'Vikram Sharma', role: 'Parent, Class 10 CBSE', text: 'My son Aarav\'s AI Tutor explanations in Hindi are more targeted than anything a private tutor gave us. It focuses specifically on his wrong answers — not generic syllabus revision.' },
  { name: 'Principal Archana Iyer', role: 'The Cathedral School, Mumbai', text: 'The DPDP Act compliance dashboard and immutable audit trails gave our legal team complete confidence during the NCPCR review. No other EdTech platform offered this.' },
];

export const MarketingLanding: React.FC = () => {
  const { setCurrentView, setUserRole, launchStudentTestRoom, tests } = useApp();
  const [activeAudience, setActiveAudience] = useState<'schools' | 'parents'>('schools');
  const [demoIdx, setDemoIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const heroReveal = useReveal();
  const statsReveal = useReveal();
  const pillarsReveal = useReveal();

  const handleDemoClick = (idx: number) => {
    setIsGenerating(true);
    setDemoIdx(idx);
    setTimeout(() => setIsGenerating(false), 700);
  };

  const demo = DEMO_SUBJECTS[demoIdx];

  return (
    <div className="relative">

      {/* ──────────────────────────────────────
          HERO
      ────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-16 pb-24 overflow-hidden">

        {/* Background orbs */}
        <div className="orb absolute w-[600px] h-[400px] top-[-80px] left-1/2 -translate-x-1/2" style={{background:'radial-gradient(ellipse, rgba(16,185,129,0.12) 0%, transparent 70%)', animationDuration:'7s'}} />
        <div className="orb absolute w-[400px] h-[300px] top-[30%] right-[-100px]" style={{background:'radial-gradient(ellipse, rgba(99,102,241,0.10) 0%, transparent 70%)', animationDuration:'9s', animationDelay:'-3s'}} />
        <div className="orb absolute w-[300px] h-[200px] bottom-[10%] left-[-50px]" style={{background:'radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)', animationDuration:'8s', animationDelay:'-5s'}} />

        {/* Animated grid */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        {/* Particle dots */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="particle-dot" style={{
            left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%`,
            '--duration': `${5 + i}s`, '--delay': `${-i * 1.2}s`
          } as React.CSSProperties} />
        ))}

        <div ref={heroReveal.ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Top badge */}
          <div className={`flex justify-center mb-6 transition-all duration-700 ${heroReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="section-label glass border border-blue-500/20 text-blue-200 flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg">
              <div className="w-5 h-5 rounded-md bg-white p-0.5 flex items-center justify-center shadow-sm">
                <img src="/logo.png" alt="EduPulse AI Logo" className="w-4 h-4 object-contain" />
              </div>
              <div className="status-dot-live" />
              <span className="font-semibold text-xs text-slate-200">Next-Generation K-12 AI Platform for India</span>
            </div>
          </div>

          {/* Headline */}
          <div className={`transition-all duration-700 delay-100 ${heroReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h1 className="hero-headline text-white mb-2">
              Instant AI Assessments for
            </h1>
            <h1 className="hero-headline gradient-text-emerald mb-6">
              Schools, Teachers & Parents
            </h1>
          </div>

          {/* Sub-headline */}
          <p className={`text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 transition-all duration-700 delay-200 ${heroReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Generate blueprint-accurate CBSE &amp; ICSE tests in <strong className="text-white">30 seconds</strong>, proctor in real-time, auto-grade subjective answers with Claude 3.5, and empower parents with targeted AI mistake tutoring in <strong className="text-white">12 languages</strong>.
          </p>

          {/* Decision Aid + CTA */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 mb-14 transition-all duration-700 delay-300 ${heroReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {/* Role switcher */}
            <div className="tab-bar">
              <button
                onClick={() => setActiveAudience('schools')}
                className={`tab-item flex items-center gap-1.5 ${activeAudience === 'schools' ? 'active' : ''}`}
              >
                <GraduationCap style={{width:'13px',height:'13px'}} />
                School / Teacher
              </button>
              <button
                onClick={() => setActiveAudience('parents')}
                className={`tab-item flex items-center gap-1.5 ${activeAudience === 'parents' ? 'active' : ''}`}
              >
                <Users style={{width:'13px',height:'13px'}} />
                Parent / Student
              </button>
            </div>

            {/* Primary CTA */}
            <button
              onClick={() => {
                if (activeAudience === 'schools') { setUserRole('teacher'); setCurrentView('teacher'); }
                else { setUserRole('parent'); setCurrentView('parent'); }
              }}
              className="btn-primary text-sm px-5 py-3 rounded-xl"
            >
              <span>{activeAudience === 'schools' ? 'Launch Teacher Console' : 'Open Parent Portal'}</span>
              <ArrowRight style={{width:'15px',height:'15px'}} />
            </button>
          </div>

          {/* ── Animated Stats Row ── */}
          <div ref={statsReveal.ref} className={`grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16 transition-all duration-700 delay-400 ${heroReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {[
              { value: 30, suffix: 'sec', label: 'Blueprint Generation' },
              { value: 98, suffix: '%', label: 'Rubric Accuracy' },
              { value: 12, suffix: ' Langs', label: 'AI Tutor Support' },
              { value: 5950, suffix: '+', label: 'GSID Students' },
            ].map((stat, i) => (
              <div key={i} className="stat-card text-left" style={{animationDelay:`${i*80}ms`}}>
                <div className="text-2xl sm:text-3xl font-display font-black text-white mb-0.5 counter-animate">
                  {statsReveal.visible ? <AnimatedCounter target={stat.value} suffix={stat.suffix} /> : '—'}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* ── Interactive AI Demo Card ── */}
          <div className="max-w-5xl mx-auto glass-emerald rounded-3xl overflow-hidden shadow-2xl">
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-black/20">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-white p-0.5 flex items-center justify-center">
                    <img src="/logo.png" alt="Logo" className="w-3.5 h-3.5 object-contain" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-300 font-medium">
                    EduPulse AI Blueprint Studio • Claude 3.5 Sonnet
                  </span>
                </div>
              </div>

              {/* Subject selector pills */}
              <div className="flex items-center gap-1.5">
                {DEMO_SUBJECTS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleDemoClick(i)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all duration-200 ${
                      demoIdx === i
                        ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question content */}
            <div className="p-6 sm:p-8 min-h-[220px] flex flex-col justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 border-2 border-brand-500/30 rounded-full" />
                    <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin absolute inset-0" />
                  </div>
                  <p className="text-xs font-mono text-brand-400 animate-pulse">
                    Claude 3.5 synthesizing {demo.board} marking scheme & Bloom's criteria…
                  </p>
                </div>
              ) : (
                <div className="animate-fade-in-up space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge badge-emerald">{demo.bloom}</span>
                    <span className="badge badge-indigo">{demo.board} Board</span>
                    <span className="badge" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'#94a3b8'}}>{demo.marks} Marks</span>
                  </div>

                  <p className="text-base sm:text-lg font-medium text-white leading-relaxed text-left">
                    {demo.question}
                  </p>

                  <div className="p-4 rounded-2xl bg-black/30 border border-amber-500/15 text-left">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 mb-2 uppercase tracking-wider">
                      <FileCheck2 style={{width:'12px',height:'12px'}} />
                      AI Marking Scheme
                    </div>
                    <p className="text-xs font-mono text-slate-300 leading-relaxed">{demo.scheme}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <CheckCircle2 style={{width:'13px',height:'13px',color:'#10b981'}} />
                      NEP 2020 Competency-Checked
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { if (tests.length > 0) launchStudentTestRoom(tests[0].id); }}
                        className="btn-secondary text-[11px] py-1.5 px-3 rounded-lg"
                      >
                        <Play style={{width:'11px',height:'11px',color:'#10b981'}} />
                        Try as Student
                      </button>
                      <button
                        onClick={() => { setUserRole('teacher'); setCurrentView('teacher'); }}
                        className="btn-primary text-[11px] py-1.5 px-3 rounded-lg"
                      >
                        <Sparkles style={{width:'11px',height:'11px'}} />
                        <span>Open Full Builder</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────
          THREE PILLARS
      ────────────────────────────────────── */}
      <section className="py-24 relative" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div ref={pillarsReveal.ref} className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${pillarsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="section-label glass-sm border border-white/[0.06] text-slate-400 mb-5">
              <BarChart3 style={{width:'13px',height:'13px',color:'#10b981'}} />
              Full Assessment Lifecycle
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mb-4">
              Built for Every <span className="gradient-text-emerald">Stakeholder</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Zero clunky portals. Frictionless link-based delivery, live proctoring telemetry, and targeted parental insight — all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                color: 'emerald',
                title: 'For Teachers & Schools',
                badge: 'Educator Layer',
                features: [
                  { text: 'AI Test Builder with board-accurate blueprints', tag: 'CBSE / ICSE' },
                  { text: 'Live Proctoring HUD with cheat telemetry', tag: 'Realtime' },
                  { text: 'Claude 3.5 Rubric Subjective Grader', tag: 'AI' },
                  { text: 'Chapter Mastery Heatmaps & At-Risk Alerts', tag: 'Analytics' },
                ],
                cta: 'Explore Teacher Hub',
                onClick: () => { setUserRole('teacher'); setCurrentView('teacher'); }
              },
              {
                icon: Smartphone,
                color: 'indigo',
                title: 'For Students (Link Only)',
                badge: 'Zero Login',
                features: [
                  { text: 'Single-use signed magic links, no account needed', tag: 'Friction-free' },
                  { text: 'Offline-resilient answer queue for rural 3G/4G', tag: 'Low-Bandwidth' },
                  { text: 'Instant AI mistake diagnostic breakdown', tag: 'Instant' },
                  { text: 'Anti-cheat fullscreen & clipboard protection', tag: 'Secure' },
                ],
                cta: 'Launch Test Simulator',
                onClick: () => { if (tests.length > 0) launchStudentTestRoom(tests[0].id); }
              },
              {
                icon: Users,
                color: 'amber',
                title: 'For Parents & AI Tutor',
                badge: 'Parent Layer',
                features: [
                  { text: 'WhatsApp OTP login, multi-child dashboard', tag: 'Passwordless' },
                  { text: 'RAG tutor anchored to actual wrong answers', tag: '12 Languages' },
                  { text: 'At-Risk proactive alerts before board exams', tag: 'Predictive' },
                  { text: 'Razorpay billing with GST invoice history', tag: 'India-First' },
                ],
                cta: 'Open Parent Portal',
                onClick: () => { setUserRole('parent'); setCurrentView('parent'); }
              }
            ].map((pillar, i) => {
              const borderColor = pillar.color === 'emerald' ? 'rgba(16,185,129,0.15)' : pillar.color === 'indigo' ? 'rgba(99,102,241,0.15)' : 'rgba(245,158,11,0.15)';
              const iconBg = pillar.color === 'emerald' ? 'rgba(16,185,129,0.1)' : pillar.color === 'indigo' ? 'rgba(99,102,241,0.1)' : 'rgba(245,158,11,0.1)';
              const iconColor = pillar.color === 'emerald' ? '#34d399' : pillar.color === 'indigo' ? '#818cf8' : '#fbbf24';
              const badgeCls = pillar.color === 'emerald' ? 'badge-emerald' : pillar.color === 'indigo' ? 'badge-indigo' : 'badge-amber';

              return (
                <div
                  key={i}
                  className={`card-glow-hover rounded-3xl p-7 flex flex-col gap-5 transition-all duration-500 ${pillarsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{
                    background: 'rgba(15,23,42,0.55)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${borderColor}`,
                    transitionDelay: `${i * 100}ms`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{background: iconBg, border:`1px solid ${borderColor}`}}>
                      <pillar.icon style={{width:'22px',height:'22px',color:iconColor}} />
                    </div>
                    <span className={`badge ${badgeCls}`}>{pillar.badge}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-bold text-white mb-3">{pillar.title}</h3>
                    <ul className="space-y-2.5">
                      {pillar.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 style={{width:'14px',height:'14px',color:iconColor,flexShrink:0,marginTop:'1px'}} />
                          <span>{f.text} <span className="tag ml-1">{f.tag}</span></span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={pillar.onClick}
                    className="btn-secondary mt-auto w-full justify-center text-xs py-2.5"
                  >
                    {pillar.cta}
                    <ChevronRight style={{width:'13px',height:'13px'}} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────
          TESTIMONIALS
      ────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="orb absolute w-[500px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{background:'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)'}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-label glass-sm border border-white/[0.06] text-slate-400 mb-4">
              <Star style={{width:'13px',height:'13px',color:'#fbbf24',fill:'#fbbf24'}} />
              Trusted by Top Indian Schools
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
              Educators & Parents <span className="gradient-text-indigo">Love EduPulse</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="card-hover glass rounded-3xl p-6 space-y-4"
                style={{animationDelay:`${i*100}ms`}}
              >
                <div className="flex items-center gap-1" >
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} style={{width:'13px',height:'13px',color:'#fbbf24',fill:'#fbbf24'}} />
                  ))}
                </div>
                <Quote style={{width:'20px',height:'20px',color:'rgba(16,185,129,0.3)'}} />
                <p className="text-sm text-slate-300 leading-relaxed italic">"{t.text}"</p>
                <div className="pt-2 border-t border-white/[0.05]">
                  <p className="font-bold text-xs text-white">{t.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust logos strip */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 opacity-40">
            {['CBSE Aligned', 'NEP 2020', 'DPDP Act 2023', 'ISO 27001', 'Mumbai Edge CDN'].map((label, i) => (
              <div key={i} className="px-4 py-2 rounded-xl glass text-[11px] font-bold text-slate-400 border border-white/[0.05] flex items-center gap-1.5">
                <ShieldCheck style={{width:'12px',height:'12px',color:'#10b981'}} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <PricingSection />

      {/* SECURITY */}
      <SecurityTrust />

    </div>
  );
};
