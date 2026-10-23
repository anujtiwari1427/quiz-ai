import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, ArrowRight, CheckCircle2, GraduationCap, Users, 
  Smartphone, Play, FileCheck2, Zap, ShieldCheck, BarChart3,
  Star, Quote, ChevronRight, Award, Globe, Lock, Upload, BookOpen, Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PricingSection } from './PricingSection';
import { SecurityTrust } from './SecurityTrust';
import { StudyToolsSection } from '../dashboard/StudyToolsSection';

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
  { 
    label: 'Class 10 Science', 
    board: 'CBSE Board', 
    bloom: 'Apply & Analyze (L4)', 
    marks: 4,
    chapter: 'Light — Reflection & Refraction',
    question: 'A concave mirror of focal length 15 cm produces an image twice the height of the object. Calculate both possible object distances (u) and write the mathematical justification using the mirror equation.',
    scheme: 'Case 1 (Real & inverted, m = −2): v = −2u. Formula: 1/f = 1/v + 1/u ⟹ 1/(−15) = 1/(−2u) + 1/u ⟹ u = −22.5 cm (2 Marks).\nCase 2 (Virtual & erect, m = +2): v = 2u ⟹ 1/(−15) = 1/(2u) + 1/u ⟹ u = −7.5 cm (2 Marks).' 
  },
  { 
    label: 'Class 10 Math', 
    board: 'CBSE Board', 
    bloom: 'Deductive Logic & Proof (L5)', 
    marks: 5,
    chapter: 'Triangles — Theorem 6.1 (BPT)',
    question: 'State and prove the Basic Proportionality Theorem (Thales Theorem). If a line is drawn parallel to one side of a triangle intersecting the other two sides, prove that it divides them in the same ratio.',
    scheme: '1 Mark: Accurate geometric statement & diagram construction.\n2 Marks: Area comparison of △ADE to △BDE and △CDE.\n2 Marks: Equating bases on equal parallels to conclude AD/DB = AE/EC with mathematical rigor.' 
  },
  { 
    label: 'Class 10 Social Science', 
    board: 'CBSE / ICSE', 
    bloom: 'Historical Synthesis (L4)', 
    marks: 5,
    chapter: 'The Rise of Nationalism in Europe',
    question: 'Critically analyze the socio-economic hardships faced by Europe during the 1830s. Explain how widespread rural migration and textile industrialization culminated in the popular revolts of 1848.',
    scheme: '1 Mark: Demographic explosion and unemployment surge.\n1 Mark: Small-scale artisan distress vs British mechanized textile imports.\n1 Mark: Feudal burdens on peasant agriculture.\n2 Marks: 1848 food shortages, barricades in Paris, and constitutional demands.' 
  },
  { 
    label: 'Class 12 Physics', 
    board: 'CBSE / State', 
    bloom: 'Calculus & Derivation (L5)', 
    marks: 5,
    chapter: 'Electrostatics — Gauss’s Law',
    question: 'Derive an expression for the electric field intensity at a distance r from an infinitely long straight wire carrying uniform linear charge density λ, using a cylindrical Gaussian surface.',
    scheme: '1 Mark: Symmetry argument and cylinder geometry formulation.\n2 Marks: Flux calculation through curved face (∮E·dA = E·2πrl) and end caps (zero flux).\n2 Marks: Applying Gauss theorem (Φ = q_encl/ε₀ = λl/ε₀) ⟹ E = λ / (2πε₀r).' 
  },
];

/* ── testimonials ── */
const TESTIMONIALS = [
  { name: 'Dr. Meera Krishnan', role: 'Science HOD, DPS R.K. Puram', text: 'EduPulse generates board-accurate CBSE marking schemes that would take our faculty 3 hours in under 30 seconds. The proctoring telemetry alone has eliminated examination integrity disputes by over 80%.' },
  { name: 'Vikram Sharma', role: 'Parent, Class 10 CBSE Student', text: 'My son Aarav\'s AI Tutor explanations in Hindi are vastly more targeted than any offline tuition centre. It analyzes specifically his wrong answers with step-by-step guidance rather than generic lectures.' },
  { name: 'Principal Archana Iyer', role: 'The Cathedral School, Mumbai', text: 'The DPDP Act compliance framework, audit trails, and student privacy sandbox gave our governing board total confidence. It is the gold standard for Indian school assessment intelligence.' },
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
    setTimeout(() => setIsGenerating(false), 550);
  };

  const demo = DEMO_SUBJECTS[demoIdx];

  return (
    <div className="relative">

      {/* ──────────────────────────────────────
          HERO (Apple Aesthetic)
      ────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-12 pb-20 overflow-hidden">

        {/* Ambient Keynote Spotlight mesh */}
        <div className="orb absolute w-[720px] h-[460px] top-[-100px] left-1/2 -translate-x-1/2" style={{background:'radial-gradient(ellipse, rgba(0, 113, 227, 0.18) 0%, transparent 68%)', animationDuration:'8s'}} />
        <div className="orb absolute w-[460px] h-[360px] top-[25%] right-[-80px]" style={{background:'radial-gradient(ellipse, rgba(94, 92, 230, 0.14) 0%, transparent 68%)', animationDuration:'10s', animationDelay:'-3s'}} />
        <div className="orb absolute w-[360px] h-[260px] bottom-[10%] left-[-50px]" style={{background:'radial-gradient(ellipse, rgba(41, 151, 255, 0.1) 0%, transparent 70%)', animationDuration:'9s', animationDelay:'-5s'}} />

        {/* Subtle grid */}
        <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

        {/* Particle dots */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="particle-dot" style={{
            left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%`,
            '--duration': `${5 + i}s`, '--delay': `${-i * 1.2}s`
          } as React.CSSProperties} />
        ))}

        <div ref={heroReveal.ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Top Apple pill badge */}
          <div className={`flex justify-center mb-6 transition-all duration-700 ${heroReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.12] backdrop-blur-xl shadow-lg text-xs text-[#f5f5f7]">
              <div className="w-5 h-5 rounded-full bg-[#1c1c1e] p-0.5 flex items-center justify-center shadow-sm border border-white/20">
                <img src="/logo.png" alt="EduPulse AI Logo" className="w-3.5 h-3.5 object-contain" />
              </div>
              <div className="status-dot-live" />
              <span className="font-semibold text-xs text-[#f5f5f7] tracking-tight">Next-Gen K-12 AI Platform for India</span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/30" />
              <span className="hidden sm:inline-block text-[11px] text-[#9da3ae]">CBSE • ICSE • NEP 2020</span>
            </div>
          </div>

          {/* Headline (Apple Keynote Style) */}
          <div className={`transition-all duration-700 delay-100 ${heroReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h1 className="hero-headline text-[#f5f5f7] mb-2 tracking-tight">
              Instant AI Assessments for
            </h1>
            <h1 className="hero-headline gradient-text-apple mb-6 tracking-tight">
              Schools, Teachers &amp; Learners.
            </h1>
          </div>

          {/* Sub-headline */}
          <p className={`text-base sm:text-lg text-[#c9ccd3] max-w-2xl mx-auto leading-relaxed mb-10 transition-all duration-700 delay-200 ${heroReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Generate blueprint-accurate CBSE &amp; ICSE tests in <strong className="text-white font-semibold">30 seconds</strong>, monitor anti-cheat proctoring in real time, auto-grade subjective answers with Claude 3.5 rubrics, and deliver targeted AI mistake tutoring in <strong className="text-white font-semibold">12 Indian languages</strong>.
          </p>

          {/* Decision Aid + CTA */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 transition-all duration-700 delay-300 ${heroReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
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

            {/* Primary CTA - Apple Pill */}
            <button
              onClick={() => {
                if (activeAudience === 'schools') { setUserRole('teacher'); setCurrentView('teacher'); }
                else { setUserRole('parent'); setCurrentView('parent'); }
              }}
              className="btn-primary text-sm px-6 py-2.5 rounded-full"
            >
              <span>{activeAudience === 'schools' ? 'Launch Teacher Console' : 'Open Parent Portal'}</span>
              <ArrowRight style={{width:'14px',height:'14px'}} />
            </button>

            {/* Strater AI Learning Workspace Hero CTA */}
            <button
              onClick={() => { setUserRole('student'); setCurrentView('strata-studio'); }}
              className="px-6 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[#0071e3] to-[#bf5af2] hover:from-[#0077ed] hover:to-[#cb6df7] text-white flex items-center gap-2 shadow-xl shadow-[#0071e3]/30 hover:scale-105 transition-all"
            >
              <Sparkles style={{width:'14px',height:'14px'}} />
              <span>Launch AI Study Studio</span>
              <ArrowRight style={{width:'14px',height:'14px'}} />
            </button>
          </div>

          {/* ── 4 Major Student Features Quick Navigation Strip (Apple Capsules) ── */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto mb-14 animate-fade-in-up">
            <button
              onClick={() => { setUserRole('student'); setCurrentView('marks'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.16] text-xs font-medium text-[#f5f5f7] transition-all shadow-sm active:scale-95"
            >
              <BarChart3 style={{ width: '13px', height: '13px', color: '#2997ff' }} />
              <span>Marks &amp; Official Transcript</span>
            </button>

            <button
              onClick={() => { setUserRole('student'); setCurrentView('syllabus'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.16] text-xs font-medium text-[#f5f5f7] transition-all shadow-sm active:scale-95"
            >
              <Upload style={{ width: '13px', height: '13px', color: '#bf5af2' }} />
              <span>Upload Syllabus &amp; Blueprint</span>
            </button>

            <button
              onClick={() => { setUserRole('student'); setCurrentView('books'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.16] text-xs font-medium text-[#f5f5f7] transition-all shadow-sm active:scale-95"
            >
              <BookOpen style={{ width: '13px', height: '13px', color: '#ff9f0a' }} />
              <span>Read Book &amp; Audio Player</span>
            </button>

            <button
              onClick={() => { setUserRole('student'); setCurrentView('questions'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.16] text-xs font-medium text-[#f5f5f7] transition-all shadow-sm active:scale-95"
            >
              <Layers style={{ width: '13px', height: '13px', color: '#30d158' }} />
              <span>Question Sets &amp; Negative Marking</span>
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
              <div key={i} className="stat-card text-left bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-sm" style={{animationDelay:`${i*80}ms`}}>
                <div className="text-2xl sm:text-3xl font-display font-black text-white mb-0.5 counter-animate">
                  {statsReveal.visible ? <AnimatedCounter target={stat.value} suffix={stat.suffix} /> : '—'}
                </div>
                <div className="text-[11px] text-[#9da3ae] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* ── Interactive AI Demo Card ── */}
          <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-[#161618]/90 backdrop-blur-2xl border border-white/[0.12] relative">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-80 h-40 bg-[#0071e3]/10 blur-3xl pointer-events-none" />

            {/* Top bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3.5 border-b border-white/[0.08] bg-black/40">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#1c1c1e] p-0.5 flex items-center justify-center border border-white/20">
                    <img src="/logo.png" alt="Logo" className="w-3.5 h-3.5 object-contain" />
                  </div>
                  <span className="text-xs font-mono text-[#cbd5e1] font-semibold">
                    EduPulse AI Blueprint Studio • Claude 3.5 Sonnet
                  </span>
                </div>
              </div>

              {/* Subject selector pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {DEMO_SUBJECTS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleDemoClick(i)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 ${
                      demoIdx === i
                        ? 'bg-[#0071e3] text-white shadow-md border border-[#2997ff]/50'
                        : 'bg-white/[0.04] text-[#9da3ae] hover:text-[#f5f5f7] hover:bg-white/[0.08] border border-white/[0.06]'
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
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30">
                      {demo.bloom}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#5e5ce6]/20 text-[#bf5af2] border border-[#5e5ce6]/30">
                      {demo.board}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.06] border border-white/[0.1] text-[#f5f5f7]">
                      {demo.marks} Marks
                    </span>
                    <span className="text-[11px] text-[#9da3ae] font-medium ml-1">
                      📖 {demo.chapter}
                    </span>
                  </div>

                  <p className="text-base sm:text-lg font-medium text-[#f5f5f7] leading-relaxed text-left">
                    {demo.question}
                  </p>

                  <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/20 text-left">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#ff9f0a] mb-2 uppercase tracking-wider">
                      <FileCheck2 style={{width:'12px',height:'12px'}} />
                      Official Stepwise Marking Scheme
                    </div>
                    <p className="text-xs font-mono text-[#e2e8f0] leading-relaxed whitespace-pre-line">
                      {demo.scheme}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#9da3ae]">
                      <CheckCircle2 style={{width:'14px',height:'14px',color:'#30d158'}} />
                      NEP 2020 Competency-Checked &amp; Bloom's Taxonomy Verified
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { if (tests.length > 0) launchStudentTestRoom(tests[0].id); }}
                        className="btn-secondary text-xs py-1.5 px-3.5 rounded-full"
                      >
                        <Play style={{width:'11px',height:'11px',color:'#30d158'}} />
                        Try as Student
                      </button>
                      <button
                        onClick={() => { setUserRole('teacher'); setCurrentView('teacher'); }}
                        className="btn-primary text-xs py-1.5 px-3.5 rounded-full"
                      >
                        <Sparkles style={{width:'12px',height:'12px'}} />
                        <span>Open Blueprint Builder</span>
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
          STUDENT STUDY TOOLS (4 MAJOR FEATURES)
      ────────────────────────────────────── */}
      <StudyToolsSection />

      {/* ──────────────────────────────────────
          THREE PILLARS
      ────────────────────────────────────── */}
      <section className="py-24 relative" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div ref={pillarsReveal.ref} className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${pillarsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="section-label glass-sm border border-white/[0.08] text-[#9da3ae] mb-5 inline-flex items-center gap-2">
              <BarChart3 style={{width:'13px',height:'13px',color:'#30d158'}} />
              <span>Full Assessment &amp; Learning Lifecycle</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mb-4">
              Built for Every <span className="gradient-text-apple">Stakeholder</span>
            </h2>
            <p className="text-[#c9ccd3] text-base leading-relaxed">
              Zero clunky portals. Frictionless link-based delivery, real-time proctoring telemetry, and targeted parental diagnostic insights — all in one unified ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                color: 'emerald',
                title: 'For Teachers & Schools',
                badge: 'Educator Console',
                features: [
                  { text: 'AI Test Builder with board-accurate blueprints', tag: 'CBSE / ICSE' },
                  { text: 'Live Proctoring HUD with anti-cheat telemetry', tag: 'Realtime' },
                  { text: 'Claude 3.5 Rubric Subjective Answer Grader', tag: 'AI Grader' },
                  { text: 'Chapter Mastery Heatmaps & At-Risk Alerts', tag: 'Analytics' },
                ],
                cta: 'Explore Teacher Console',
                onClick: () => { setUserRole('teacher'); setCurrentView('teacher'); }
              },
              {
                icon: Smartphone,
                color: 'indigo',
                title: 'For Students (Link-Based)',
                badge: 'Friction-Free',
                features: [
                  { text: 'Single-use signed magic links — no password needed', tag: 'Zero Friction' },
                  { text: 'Offline-resilient answer queue for rural 3G/4G', tag: 'Low Bandwidth' },
                  { text: 'Instant AI mistake diagnostic breakdown', tag: 'Instant Feedback' },
                  { text: 'Anti-cheat fullscreen & clipboard protection', tag: 'Proctored' },
                ],
                cta: 'Launch Test Simulator',
                onClick: () => { if (tests.length > 0) launchStudentTestRoom(tests[0].id); }
              },
              {
                icon: Users,
                color: 'amber',
                title: 'For Parents & AI Tutor',
                badge: 'Parent Portal',
                features: [
                  { text: 'WhatsApp OTP login, multi-child overview', tag: 'Passwordless' },
                  { text: 'RAG tutor anchored to actual exam mistakes', tag: '12 Languages' },
                  { text: 'Proactive at-risk alerts before board exams', tag: 'Predictive' },
                  { text: 'Razorpay billing with instant GST tax invoices', tag: 'India-First' },
                ],
                cta: 'Open Parent Portal',
                onClick: () => { setUserRole('parent'); setCurrentView('parent'); }
              }
            ].map((pillar, i) => {
              const borderColor = pillar.color === 'emerald' ? 'rgba(48,209,88,0.25)' : pillar.color === 'indigo' ? 'rgba(94,92,230,0.25)' : 'rgba(255,159,10,0.25)';
              const iconBg = pillar.color === 'emerald' ? 'rgba(48,209,88,0.12)' : pillar.color === 'indigo' ? 'rgba(94,92,230,0.12)' : 'rgba(255,159,10,0.12)';
              const iconColor = pillar.color === 'emerald' ? '#30d158' : pillar.color === 'indigo' ? '#bf5af2' : '#ff9f0a';
              const badgeCls = pillar.color === 'emerald' ? 'bg-[#30d158]/15 text-[#30d158] border-[#30d158]/30' : pillar.color === 'indigo' ? 'bg-[#5e5ce6]/20 text-[#bf5af2] border-[#5e5ce6]/30' : 'bg-[#ff9f0a]/15 text-[#ff9f0a] border-[#ff9f0a]/30';

              return (
                <div
                  key={i}
                  className={`rounded-3xl p-7 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 bg-[#161618]/90 backdrop-blur-2xl shadow-xl hover:shadow-2xl ${pillarsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{
                    border: `1px solid ${borderColor}`,
                    transitionDelay: `${i * 100}ms`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{background: iconBg, border:`1px solid ${borderColor}`}}>
                      <pillar.icon style={{width:'22px',height:'22px',color:iconColor}} />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeCls}`}>{pillar.badge}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-bold text-white mb-3">{pillar.title}</h3>
                    <ul className="space-y-3">
                      {pillar.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-xs text-[#e2e8f0]">
                          <CheckCircle2 style={{width:'15px',height:'15px',color:iconColor,flexShrink:0,marginTop:'1px'}} />
                          <span className="leading-relaxed">{f.text} <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-semibold bg-white/[0.08] text-[#9da3ae] ml-1">{f.tag}</span></span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={pillar.onClick}
                    className="btn-secondary mt-auto w-full justify-center text-xs py-2.5 rounded-full"
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
            <div className="section-label glass-sm border border-white/[0.08] text-[#ff9f0a] mb-4 inline-flex items-center gap-1.5">
              <Star style={{width:'13px',height:'13px',color:'#ff9f0a',fill:'#ff9f0a'}} />
              <span>Endorsed by Top CBSE &amp; ICSE Institutions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
              Educators &amp; Parents <span className="gradient-text-indigo">Trust EduPulse</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="rounded-3xl p-6 space-y-4 bg-[#161618]/90 backdrop-blur-2xl border border-white/[0.1] shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{animationDelay:`${i*100}ms`}}
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} style={{width:'13px',height:'13px',color:'#ff9f0a',fill:'#ff9f0a'}} />
                  ))}
                </div>
                <Quote style={{width:'22px',height:'22px',color:'#2997ff',opacity:0.5}} />
                <p className="text-sm text-[#e2e8f0] leading-relaxed italic">"{t.text}"</p>
                <div className="pt-3 border-t border-white/[0.08]">
                  <p className="font-bold text-xs text-white">{t.name}</p>
                  <p className="text-[11px] text-[#9da3ae] mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust logos strip */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
            {['CBSE Blueprint Aligned', 'ICSE Council Aligned', 'NEP 2020 Competency Verified', 'DPDP Act 2023 Compliant', 'ISO 27001 Certified', 'Mumbai Edge Zero-Latency CDN'].map((label, i) => (
              <div key={i} className="px-3.5 py-2 rounded-full bg-white/[0.04] text-xs font-semibold text-[#c9ccd3] border border-white/[0.1] flex items-center gap-2 shadow-sm hover:border-[#0071e3]/40 transition-colors">
                <ShieldCheck style={{width:'13px',height:'13px',color:'#30d158'}} />
                <span>{label}</span>
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
