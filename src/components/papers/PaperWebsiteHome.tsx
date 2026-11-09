import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  BookOpen, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  FileText, 
  Download, 
  Printer, 
  HelpCircle, 
  ChevronDown, 
  Star, 
  Clock, 
  Users, 
  ExternalLink,
  Zap,
  Lock,
  MessageSquare,
  GraduationCap,
  Award,
  BarChart3,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MarklabButton } from '../common/MarklabButton';

export const PaperWebsiteHome: React.FC = () => {
  const { setCurrentView, theme } = useApp();
  const isLight = theme === 'light';

  // Interactive 4-Step Accordion State (Section 4)
  const [activeStep, setActiveStep] = useState<number>(0);

  // Interactive FAQ State (Section 7)
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Newsletter Email State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Interactive Hero Preview Tab
  const [heroTab, setHeroTab] = useState<'blueprint' | 'proctor' | 'reader'>('blueprint');

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setNewsletterSubmitted(false);
      }, 4000);
    }
  };

  const stepsData = [
    {
      step: '01',
      title: 'Ingest Blueprint, Syllabus or NCERT Chapters',
      description: 'Select your target board (CBSE, ICSE, State), standard (6-12), and subject. Upload custom syllabus documents or select straight from the built-in NCERT textbook library.',
      badge: 'Step 01 • Curriculum Mapping'
    },
    {
      step: '02',
      title: 'AI Auto-Generates Balanced Question Paper',
      description: 'Our Gemini 2.0 engine constructs Section A through E with exact mark allocations (MCQs, Short Answer, Long Answer, and Case Studies), difficulty balancing, and marking rubrics.',
      badge: 'Step 02 • Intelligent Synthesis'
    },
    {
      step: '03',
      title: 'Dispatch Proctored Link or Export to DOC/PDF',
      description: 'Share a zero-app web test room link with anti-cheat fullscreen lock and tab-switch telemetry, or print directly to clean vector A4 PDF or editable Microsoft Word (.doc).',
      badge: 'Step 03 • Zero-Friction Delivery'
    },
    {
      step: '04',
      title: 'Instant Auto-Grading & 360° Academic Intelligence',
      description: 'Objective MCQs are evaluated instantly. Subjective answers receive rubric evaluations with teacher review, class mastery heatmaps, and automated WhatsApp parent digests.',
      badge: 'Step 04 • 360° Mastery Analytics'
    }
  ];

  const faqData = [
    {
      q: 'Does EduPulse AI strictly adhere to CBSE and ICSE examination blueprints?',
      a: 'Yes. EduPulse AI is purpose-built to enforce official board blueprints. For example, in CBSE Class 10 Science, it rigorously structures Section A (20 MCQs & Assertion-Reason, 1M each), Section B (6 Short Answer I, 2M each), Section C (7 Short Answer II, 3M each), Section D (3 Long Answer, 5M each), and Section E (3 Case-Based Units, 4M each), preserving exact weightage and internal choice rules.'
    },
    {
      q: 'How does the zero-friction student test room prevent cheating?',
      a: 'Students access tests via a single unique link with zero app downloads or accounts required. The room activates full-screen enforcement, real-time tab-switch interception, clipboard copy-paste blocking, idle timeouts, and continuous device telemetry that flags unauthorized background processes immediately on the teacher dashboard.'
    },
    {
      q: 'Can teachers edit generated questions and export them to Microsoft Word and PDF?',
      a: 'Absolutely. Every single question, mark weightage, and rubric detail is fully editable on the split-screen Canvas Studio. You can export clean, print-ready vector A4 PDFs with school header logos and candidate roll number boxes, or download editable Microsoft Word (.doc) documents.'
    },
    {
      q: 'How does the hybrid subjective auto-grading engine work?',
      a: 'Objective questions are evaluated instantaneously with 100% precision. Subjective short and long answers are evaluated by our AI grader mapped against official board step-marking rubrics. Teachers receive an intuitive verification queue where they can accept, tweak, or override marks in one click before publishing results.'
    },
    {
      q: 'Is EduPulse AI compliant with India\'s Digital Personal Data Protection Act (DPDPA 2023)?',
      a: 'Yes. EduPulse AI is built from the ground up for strict DPDPA 2023 compliance. Student data is encrypted in transit and at rest, zero identifiable student data is used to train public AI models, role-based access control (RBAC) separates staff permissions, and immutable audit logs record every grade adjustment.'
    },
    {
      q: 'Can parents receive automated test reports and attendance on WhatsApp?',
      a: 'Yes. Schools can enable automated WhatsApp parent notifications. Parents receive immediate exam completion notices, PDF grade cards with concept breakdown charts, and an AI home tutor link tailored specifically to address their child\'s mistakes from recent tests.'
    }
  ];

  const partnerLogos = [
    { name: 'CBSE Affiliated Schools', code: 'CBSE' },
    { name: 'Council for the Indian School Certificate (CISCE)', code: 'ICSE / ISC' },
    { name: 'Kendriya Vidyalaya Sangathan', code: 'KVS' },
    { name: 'Delhi Public School Society', code: 'DPS' },
    { name: 'DAV College Managing Committee', code: 'DAV' },
    { name: 'Ryan International Group of Institutions', code: 'RYAN' },
    { name: 'National Board Examination Forum', code: 'NBEF' },
    { name: 'Maharashtra State Board of Secondary & Higher Secondary', code: 'MSBSHSE' },
    { name: 'Karnataka Pre-University Examination Board', code: 'PUE' }
  ];

  return (
    <div className={`w-full overflow-hidden transition-colors duration-300 font-['Tasaorbiterdeck',sans-serif] ${
      isLight ? 'bg-[#f7f8fc] text-[#202342]' : 'bg-[#0f1225] text-white'
    }`}>

      {/* ──────────────────────────────────────────────────────────
          SECTION 0: HERO BANNER (home-banner)
          Matches Marklab home-banner layout, typography & badges
          ────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden" id="Service">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-radial from-[#4555fd]/15 via-[#4555fd]/5 to-transparent pointer-events-none blur-3xl -z-10" />

        {/* Decorative Floating 3D Bell Icon */}
        <div className="hidden lg:block absolute top-12 right-[12%] animate-float pointer-events-none z-10">
          <img 
            src="/marklab/bell-dynamic-gradient.svg" 
            alt="Notification" 
            className="w-16 h-16 drop-shadow-[0_12px_24px_rgba(69,85,253,0.25)]" 
          />
        </div>

        {/* Decorative Vector Hand-drawn Line */}
        <div className="hidden md:block absolute top-40 left-[8%] animate-pulse-subtle pointer-events-none -z-10 opacity-70">
          <img 
            src="/marklab/vector-1.svg" 
            alt="Decoration" 
            className="w-28 h-auto" 
          />
        </div>

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#edf2ff] border border-[#c2d4ff] text-[#4555fd] text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#4555fd] animate-ping" />
            <span>✦ Next-Gen K-12 AI Assessment Platform</span>
          </div>

          {/* Signature Marklab Headline with Editorial Serif Italic Accent */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#202342] dark:text-white max-w-4xl mx-auto leading-[1.08]">
            Assessment that <span className="itlic text-[#4555fd]">moves the</span> Needle
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-[#4e516a] dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            All examination authoring, anti-cheat proctoring, and CBSE/ICSE evaluation here is designed to deliver impact—not just test scores.
          </p>

          {/* Dual Action Buttons (Marklab Webflow Rolling-Text Style) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <MarklabButton
              onClick={() => setCurrentView('paper-builder')}
              variant="dark"
              className="text-base px-7 py-3.5"
            >
              Launch Exam Studio
            </MarklabButton>

            <MarklabButton
              onClick={() => setCurrentView('ai-paper-gen')}
              variant="primary"
              className="text-base px-7 py-3.5"
            >
              AI Blueprint Generator
            </MarklabButton>
          </div>

          {/* Decorative Underline Accent */}
          <div className="flex justify-center mt-6">
            <img 
              src="/marklab/line.svg" 
              alt="Line" 
              className="w-48 opacity-80" 
            />
          </div>

          {/* ────────────────────────────────────────────────────────
              HERO INTERACTIVE DASHBOARD SHOWCASE CARD
              Gives immediate hands-on proof of the platform
              ──────────────────────────────────────────────────────── */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-white dark:bg-[#161a35] border border-[#dcdde2] dark:border-white/10 shadow-[0_24px_70px_rgba(32,35,66,0.12)] p-4 sm:p-7 text-left transition-all">
            
            {/* Card Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#efeff1] dark:border-white/10 gap-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10 mx-1" />
                <span className="text-xs font-semibold tracking-wide text-[#202342] dark:text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#4555fd]" />
                  CBSE Class 10 Board Science 2026 • Official Blueprint Spec
                </span>
              </div>

              {/* Interactive Tabs */}
              <div className="flex items-center gap-1 bg-[#f4f6fb] dark:bg-white/5 p-1 rounded-xl text-xs font-medium">
                <button
                  onClick={() => setHeroTab('blueprint')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    heroTab === 'blueprint' 
                      ? 'bg-white dark:bg-[#202342] text-[#4555fd] shadow-xs font-semibold' 
                      : 'text-[#4e516a] dark:text-slate-400 hover:text-[#202342]'
                  }`}
                >
                  Blueprint Engine
                </button>
                <button
                  onClick={() => setHeroTab('proctor')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    heroTab === 'proctor' 
                      ? 'bg-white dark:bg-[#202342] text-[#4555fd] shadow-xs font-semibold' 
                      : 'text-[#4e516a] dark:text-slate-400 hover:text-[#202342]'
                  }`}
                >
                  Anti-Cheat Guard
                </button>
                <button
                  onClick={() => setHeroTab('reader')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    heroTab === 'reader' 
                      ? 'bg-white dark:bg-[#202342] text-[#4555fd] shadow-xs font-semibold' 
                      : 'text-[#4e516a] dark:text-slate-400 hover:text-[#202342]'
                  }`}
                >
                  NCERT Split-Reader
                </button>
              </div>
            </div>

            {/* Tab 1: Blueprint Engine Preview */}
            {heroTab === 'blueprint' && (
              <div className="pt-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#edf2ff] border border-[#c2d4ff]/70">
                    <span className="text-[11px] font-semibold text-[#4555fd] uppercase tracking-wider block">Section A</span>
                    <span className="text-xl font-bold text-[#202342] dark:text-white mt-1 block">20 Marks</span>
                    <span className="text-[11px] text-[#4e516a] dark:text-slate-300">20 MCQs &amp; A-R</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#f7f8fc] dark:bg-white/5 border border-[#dcdde2] dark:border-white/10">
                    <span className="text-[11px] font-semibold text-[#4e516a] dark:text-slate-400 uppercase tracking-wider block">Section B</span>
                    <span className="text-xl font-bold text-[#202342] dark:text-white mt-1 block">12 Marks</span>
                    <span className="text-[11px] text-[#4e516a] dark:text-slate-400">6 Short Answer (2M)</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#f7f8fc] dark:bg-white/5 border border-[#dcdde2] dark:border-white/10">
                    <span className="text-[11px] font-semibold text-[#4e516a] dark:text-slate-400 uppercase tracking-wider block">Section C</span>
                    <span className="text-xl font-bold text-[#202342] dark:text-white mt-1 block">21 Marks</span>
                    <span className="text-[11px] text-[#4e516a] dark:text-slate-400">7 Short Answer (3M)</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#f7f8fc] dark:bg-white/5 border border-[#dcdde2] dark:border-white/10">
                    <span className="text-[11px] font-semibold text-[#4e516a] dark:text-slate-400 uppercase tracking-wider block">Section D</span>
                    <span className="text-xl font-bold text-[#202342] dark:text-white mt-1 block">15 Marks</span>
                    <span className="text-[11px] text-[#4e516a] dark:text-slate-400">3 Long Answer (5M)</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#edf2ff] border border-[#c2d4ff]/70 col-span-2 sm:col-span-1">
                    <span className="text-[11px] font-semibold text-[#4555fd] uppercase tracking-wider block">Section E</span>
                    <span className="text-xl font-bold text-[#202342] dark:text-white mt-1 block">12 Marks</span>
                    <span className="text-[11px] text-[#4e516a] dark:text-slate-300">3 Case Studies (4M)</span>
                  </div>
                </div>

                {/* Sample Live Question generated */}
                <div className="p-4 rounded-2xl bg-[#fbfbfe] dark:bg-white/[0.02] border border-[#e5e7eb] dark:border-white/10">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#edf2ff] text-[#4555fd] font-mono">
                      Q.17 • Section A • Assertion &amp; Reason (1 Mark)
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> CBSE Blueprinted
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#202342] dark:text-slate-200 font-medium leading-relaxed">
                    <strong>Assertion (A):</strong> When white light passes through a glass prism, red light deviates the least while violet light deviates the most.<br />
                    <strong>Reason (R):</strong> The refractive index of glass is highest for violet light and lowest for red light.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#efeff1] dark:border-white/10 text-xs">
                    <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-medium">
                      ✓ (a) Both (A) and (R) are true and (R) is correct explanation of (A)
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500">
                      (b) Both (A) and (R) are true but (R) is not correct explanation
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Anti-Cheat Guard Preview */}
            {heroTab === 'proctor' && (
              <div className="pt-6 space-y-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      Zero-Install Real-Time Student Anti-Cheat Telemetry
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                      Enforces full-screen mode, intercepts Alt+Tab and OS shortcuts, and logs all anomaly timestamps in real time.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#fbfbfe] dark:bg-white/5 border border-[#e5e7eb] dark:border-white/10">
                    <span className="text-slate-400 block text-[11px]">Fullscreen Lock</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm mt-0.5 block">100% Enforced</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#fbfbfe] dark:bg-white/5 border border-[#e5e7eb] dark:border-white/10">
                    <span className="text-slate-400 block text-[11px]">Tab-Switch Interception</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400 text-sm mt-0.5 block">Active Logging</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#fbfbfe] dark:bg-white/5 border border-[#e5e7eb] dark:border-white/10">
                    <span className="text-slate-400 block text-[11px]">Clipboard Copy-Paste</span>
                    <span className="font-bold text-red-700 dark:text-red-400 text-sm mt-0.5 block">Strictly Blocked</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: NCERT Split-Reader Preview */}
            {heroTab === 'reader' && (
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#fbfbfe] dark:bg-white/5 border border-[#e5e7eb] dark:border-white/10">
                  <span className="text-[11px] font-semibold text-[#4555fd] uppercase tracking-wider block mb-1">
                    NCERT Biology • Chapter 6: Life Processes
                  </span>
                  <p className="text-[#202342] dark:text-slate-300 leading-relaxed font-serif text-sm">
                    "The human heart is a muscular organ which is as big as our fist. Because both oxygen and carbon dioxide have to be transported by the blood, the heart has different chambers to prevent oxygen-rich blood from mixing with carbon dioxide-rich blood..."
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#edf2ff] border border-[#c2d4ff] flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-[#4555fd] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Inline Explainer &amp; Diagram Breakdown
                    </span>
                    <p className="text-[#202342] text-xs leading-relaxed mt-1">
                      <strong>Double Circulation:</strong> Blood flows through the heart twice in one complete cycle (Pulmonary and Systemic loops). Ensures high oxygen efficiency required by warm-blooded mammals.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#c2d4ff]/60 flex items-center justify-between text-[11px] font-semibold text-[#4555fd]">
                    <span>Generate Instant 5-Question Quiz</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Card Action Footer */}
            <div className="mt-5 pt-4 border-t border-[#efeff1] dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 text-[#4e516a] dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  CBSE 2026 Marking Scheme Included
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#4555fd]" />
                  Word (.doc) &amp; A4 Print Ready
                </span>
              </div>
              <button
                onClick={() => setCurrentView('paper-builder')}
                className="text-[#4555fd] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Open in Canvas Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 1: MARQUEE INSTITUTION SLIDER (home-slider)
          Matches Marklab home-slider infinite animation
          ────────────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-[#dcdde2] dark:border-white/10 bg-white dark:bg-[#12162e]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-6 text-center">
          <p className="text-xs sm:text-sm font-medium text-[#4e516a] dark:text-slate-400 uppercase tracking-widest">
            Be part of the 120+ schools &amp; institutions transforming their examination standards
          </p>
        </div>

        {/* Infinite Scrolling Marquee Track */}
        <div className="relative w-full overflow-hidden flex items-center">
          <div className="flex animate-marquee whitespace-nowrap items-center gap-12 sm:gap-16 py-2">
            {[...partnerLogos, ...partnerLogos].map((partner, idx) => (
              <div 
                key={idx} 
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#f7f8fc] dark:bg-white/5 border border-[#dcdde2] dark:border-white/10 hover:border-[#4555fd] transition-colors cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-full bg-[#edf2ff] text-[#4555fd] font-bold text-xs flex items-center justify-center font-mono">
                  {partner.code.slice(0, 2)}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#202342] dark:text-slate-200 group-hover:text-[#4555fd] transition-colors">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 2: WHY CHOOSE US / WHO WE ARE (no-padding-top)
          Matches Marklab choose-wrapper 2-column layout
          ────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            
            {/* Left Card: Growth Image + Content */}
            <div className="marklab-card p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden bg-white dark:bg-[#161a35]">
              <div className="relative mb-8">
                <img 
                  src="/marklab/choose-image.png" 
                  alt="Student Growth" 
                  className="w-full h-64 object-cover rounded-2xl shadow-sm"
                />
                <div className="absolute top-4 right-4 bg-white/95 dark:bg-[#202342]/95 backdrop-blur-md px-4 py-2 rounded-full border border-[#dcdde2] dark:border-white/10 shadow-md flex items-center gap-2">
                  <img src="/marklab/growth.svg" alt="Growth" className="w-4 h-4" />
                  <span className="text-xs font-bold text-[#4555fd]">+84% Time Saved</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#202342] dark:text-white leading-tight">
                  Choose EduPulse AI <span className="itlic black text-[#4555fd]">for Academic Growth</span>
                </h3>
                <p className="mt-4 text-sm sm:text-base text-[#4e516a] dark:text-slate-300 leading-relaxed">
                  We go beyond traditional test authoring. We deliver value with cutting-edge, board-aligned academic intelligence and automated grading pipelines.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <MarklabButton
                    onClick={() => setCurrentView('paper-builder')}
                    variant="primary"
                  >
                    Open Canvas Studio
                  </MarklabButton>

                  <MarklabButton
                    onClick={() => setCurrentView('books')}
                    variant="outline"
                  >
                    Read NCERT Books
                  </MarklabButton>
                </div>
              </div>
            </div>

            {/* Right Card: Who We Are & Mission */}
            <div className="marklab-card-tint p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden bg-[#edf2ff] dark:bg-[#1a214d]/60 border-[#c2d4ff] dark:border-white/10">
              <div className="flex items-center justify-between mb-8">
                <span className="px-3.5 py-1 rounded-full bg-white dark:bg-white/10 text-xs font-semibold text-[#4555fd] uppercase tracking-wider border border-[#c2d4ff] dark:border-transparent">
                  Who We Are
                </span>
                <img 
                  src="/marklab/circle.svg" 
                  alt="Circle Decorative" 
                  className="w-12 h-12 opacity-80" 
                />
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-bold text-[#202342] dark:text-white leading-snug">
                  Become the <span className="itlic text-[#4555fd]">Next-Gen Assessment</span> squad
                </h3>
                <p className="mt-6 text-sm sm:text-base text-[#4e516a] dark:text-slate-300 leading-relaxed">
                  We exist to fuel the academic growth of leading CBSE, ICSE, and State Board institutions across India. Our mission is to be the strategic digital powerhouse behind every teacher and student—transforming complex curriculum guidelines and manual evaluation fatigue into automated, scalable excellence.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-[#c2d4ff]/60 dark:border-white/10">
                  <div>
                    <span className="text-3xl font-extrabold text-[#4555fd] block">100%</span>
                    <span className="text-xs font-medium text-[#4e516a] dark:text-slate-400 mt-1 block">
                      CBSE/ICSE Blueprint Fidelity
                    </span>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-[#202342] dark:text-white block">DPDPA</span>
                    <span className="text-xs font-medium text-[#4e516a] dark:text-slate-400 mt-1 block">
                      Indian Data Protection Certified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 3: SMART SERVICES / CAPABILITIES (service-section)
          Matches Marklab service-section 4-card grid
          ────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#12162e] border-y border-[#dcdde2] dark:border-white/10">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#edf2ff] text-[#4555fd] text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Core Platform Capabilities
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-[#202342] dark:text-white leading-tight">
                Smart <span className="itlic text-[#4555fd]">Features That Deliver</span> Real Impact.
              </h2>
            </div>

            <MarklabButton
              onClick={() => setCurrentView('paper-builder')}
              variant="dark"
            >
              Explore Capabilities
            </MarklabButton>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="marklab-card p-6 flex flex-col justify-between hover:border-[#4555fd] group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#edf2ff] flex items-center justify-center p-3 mb-6 group-hover:scale-110 transition-transform">
                  <img src="/marklab/sheild-iso-gradient.svg" alt="Authoring" className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#202342] dark:text-white mb-2.5">
                  AI Question Authoring &amp; Blueprint Studio
                </h4>
                <p className="text-xs sm:text-sm text-[#4e516a] dark:text-slate-400 leading-relaxed">
                  Synthesize chapter-wise MCQs, assertion-reason, and competency-based questions aligned with official marking schemes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#efeff1] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#4555fd]">
                <span>Launch Authoring</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="marklab-card-tint p-6 flex flex-col justify-between hover:border-[#4555fd] group bg-[#edf2ff] dark:bg-[#1a214d]">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center p-3 mb-6 group-hover:scale-110 transition-transform shadow-xs">
                  <img src="/marklab/thumb-up-iso-gradient.svg" alt="Proctoring" className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#202342] dark:text-white mb-2.5">
                  Zero-Friction Proctored Test Rooms
                </h4>
                <p className="text-xs sm:text-sm text-[#4e516a] dark:text-slate-300 leading-relaxed">
                  Instant link-based access with zero app downloads. Enforces full-screen lock and flags tab-switch anomalies in real time.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#c2d4ff]/60 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#4555fd]">
                <span>Anti-Cheat Guard</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="marklab-card p-6 flex flex-col justify-between hover:border-[#4555fd] group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#edf2ff] flex items-center justify-center p-3 mb-6 group-hover:scale-110 transition-transform">
                  <img src="/marklab/bell-dynamic-gradient.svg" alt="Grading" className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#202342] dark:text-white mb-2.5">
                  Dual-Engine Auto Grading &amp; Rubrics
                </h4>
                <p className="text-xs sm:text-sm text-[#4e516a] dark:text-slate-400 leading-relaxed">
                  Instant scoring for objective tests paired with AI subjective rubric scoring and one-click teacher review queues.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#efeff1] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#4555fd]">
                <span>View Evaluation</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Card 4 */}
            <div className="marklab-card-tint p-6 flex flex-col justify-between hover:border-[#4555fd] group bg-[#edf2ff] dark:bg-[#1a214d]">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center p-3 mb-6 group-hover:scale-110 transition-transform shadow-xs">
                  <img src="/marklab/copy-dynamic-gradient.svg" alt="NCERT Reader" className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#202342] dark:text-white mb-2.5">
                  Interactive NCERT &amp; Board Reader
                </h4>
                <p className="text-xs sm:text-sm text-[#4e516a] dark:text-slate-300 leading-relaxed">
                  Digital textbook shelf with inline AI explanations, formula sheets, bilingual translations, and voice read-aloud.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#c2d4ff]/60 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#4555fd]">
                <span>Explore Textbooks</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 4: 4 SIMPLE STEPS (quick 4 Simple Steps)
          Matches Marklab how-works-wrapper layout with interactive tabs
          ────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Card: 3D Flash Gradient + Stats badge */}
            <div className="lg:col-span-5 marklab-card p-8 sm:p-12 bg-white dark:bg-[#161a35] text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-28 h-28 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-[#4555fd]/20 blur-2xl rounded-full" />
                <img 
                  src="/marklab/flash-dynamic-gradient.svg" 
                  alt="Lightning Fast" 
                  className="w-full h-full object-contain relative z-10 animate-soft-bounce" 
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#edf2ff] text-[#4555fd] text-xs font-bold mb-3 border border-[#c2d4ff]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>4.95 Rating • 1,200+ Educators</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-[#202342] dark:text-white">
                Ultra-Fast <span className="itlic text-[#4555fd]">Assessment Engine</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#4e516a] dark:text-slate-400 mt-2 max-w-xs">
                Over 12,000 examination papers generated and 450,000 questions blueprinted seamlessly.
              </p>
            </div>

            {/* Right Card: Title + Interactive 4 Steps Accordion */}
            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-5xl font-bold text-[#202342] dark:text-white leading-tight mb-8">
                Academic Excellence in <span className="itlic text-[#4555fd]">quick 4 Simple</span> Steps
              </h2>

              <div className="space-y-3">
                {stepsData.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      activeStep === idx
                        ? 'bg-white dark:bg-[#1a214d] border-[#4555fd] shadow-md'
                        : 'bg-[#edf2ff]/50 dark:bg-white/[0.03] border-[#dcdde2] dark:border-white/10 hover:border-[#9fb6ff]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-colors ${
                          activeStep === idx
                            ? 'bg-[#4555fd] text-white'
                            : 'bg-white dark:bg-white/10 text-[#4e516a]'
                        }`}>
                          {step.step}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-[#202342] dark:text-white">
                          {step.title}
                        </h4>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${
                        activeStep === idx ? 'rotate-180 text-[#4555fd]' : ''
                      }`} />
                    </div>

                    {activeStep === idx && (
                      <div className="mt-3.5 pt-3 border-t border-[#efeff1] dark:border-white/10 text-xs sm:text-sm text-[#4e516a] dark:text-slate-300 leading-relaxed">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#edf2ff] text-[#4555fd] text-[10px] font-semibold uppercase mb-2">
                          {step.badge}
                        </span>
                        <p>{step.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <MarklabButton
                  onClick={() => setCurrentView('paper-builder')}
                  variant="primary"
                >
                  Start Your Assessment Blueprint
                </MarklabButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 5: "WE HAVE BUILT" SHOWCASE GALLERY (propertie-v1)
          Matches Marklab project showcase scroll-section
          ────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#12162e] border-y border-[#dcdde2] dark:border-white/10">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-[#202342] dark:text-white leading-tight">
              We have <span className="itlic text-[#4555fd]">built</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#4e516a] dark:text-slate-300">
              We go beyond traditional question papers. We deliver value with cutting-edge, board-aligned academic intelligence tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Project 1 */}
            <div 
              onClick={() => setCurrentView('paper-builder')}
              className="marklab-card p-6 flex flex-col justify-between cursor-pointer group hover:border-[#4555fd]"
            >
              <div>
                <div className="h-44 rounded-xl bg-gradient-to-br from-[#4555fd]/15 to-[#4555fd]/5 p-4 flex flex-col justify-between border border-[#c2d4ff]/50 mb-5 relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#202342] text-[10px] font-bold text-[#4555fd] self-start shadow-xs">
                    CBSE Blueprint Spec
                  </span>
                  <div>
                    <span className="text-xs font-mono text-[#4555fd] block">Full 80 Marks Matrix</span>
                    <span className="text-sm font-bold text-[#202342] dark:text-white block mt-0.5">
                      Class 10 Science (Physics, Chem, Bio)
                    </span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-[#202342] dark:text-white group-hover:text-[#4555fd] transition-colors">
                  Complete 80-Marks CBSE Board Paper Assembly
                </h4>
                <p className="text-xs text-[#4e516a] dark:text-slate-400 mt-2 leading-relaxed">
                  Strict Section A through E allocation with assertion-reason and case studies.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#efeff1] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#4555fd]">
                <span>Launch in Studio</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Project 2 */}
            <div 
              onClick={() => setCurrentView('books')}
              className="marklab-card p-6 flex flex-col justify-between cursor-pointer group hover:border-[#4555fd]"
            >
              <div>
                <div className="h-44 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-4 flex flex-col justify-between border border-emerald-500/20 mb-5 relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#202342] text-[10px] font-bold text-emerald-700 dark:text-emerald-400 self-start shadow-xs">
                    NCERT Split Reader
                  </span>
                  <div>
                    <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 block">AI Inline Explainer</span>
                    <span className="text-sm font-bold text-[#202342] dark:text-white block mt-0.5">
                      Life Processes &amp; Chemical Reactions
                    </span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-[#202342] dark:text-white group-hover:text-[#4555fd] transition-colors">
                  Interactive NCERT Digital Textbook Shelf
                </h4>
                <p className="text-xs text-[#4e516a] dark:text-slate-400 mt-2 leading-relaxed">
                  Split-screen reading with instant AI concept summaries, formulas, and mock drills.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#efeff1] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#4555fd]">
                <span>Open Reader</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Project 3 */}
            <div 
              onClick={() => setCurrentView('ai-paper-gen')}
              className="marklab-card p-6 flex flex-col justify-between cursor-pointer group hover:border-[#4555fd]"
            >
              <div>
                <div className="h-44 rounded-xl bg-gradient-to-br from-purple-500/15 to-purple-500/5 p-4 flex flex-col justify-between border border-purple-500/20 mb-5 relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#202342] text-[10px] font-bold text-purple-700 dark:text-purple-400 self-start shadow-xs">
                    Auto-Grading &amp; Rubrics
                  </span>
                  <div>
                    <span className="text-xs font-mono text-purple-700 dark:text-purple-400 block">99.4% Precision</span>
                    <span className="text-sm font-bold text-[#202342] dark:text-white block mt-0.5">
                      Hybrid Subjective Review Queue
                    </span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-[#202342] dark:text-white group-hover:text-[#4555fd] transition-colors">
                  Dual-Engine Auto Grading &amp; Marks Dashboard
                </h4>
                <p className="text-xs text-[#4e516a] dark:text-slate-400 mt-2 leading-relaxed">
                  Step-marking rubric scoring with teacher-in-the-loop review and mastery heatmaps.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#efeff1] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#4555fd]">
                <span>Try Generator</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 6: TESTIMONIALS (Client take some lovely words)
          Matches Marklab feedback-block layout
          ────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-[#202342] dark:text-white leading-tight">
              Educators <span className="itlic text-[#4555fd]">share some</span> lovely words
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#4e516a] dark:text-slate-300">
              Heartfelt Feedback from Leading Principals, HODs and Examination Coordinators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Testimonial 1 */}
            <div className="marklab-card p-8 bg-white dark:bg-[#161a35] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-base sm:text-lg text-[#202342] dark:text-slate-200 font-medium leading-relaxed italic">
                  “EduPulse AI cut our mid-term exam paper generation time from 3 weeks to 40 minutes while strictly following CBSE marking schemes. The Word export saved our DTP team countless hours.”
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-[#efeff1] dark:border-white/10 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#edf2ff] text-[#4555fd] font-bold text-sm flex items-center justify-center">
                  SS
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#202342] dark:text-white">Dr. Shalini Sharma</h5>
                  <p className="text-xs text-[#4e516a] dark:text-slate-400">Principal, Delhi Public School</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="marklab-card-tint p-8 bg-[#edf2ff] dark:bg-[#1a214d] flex flex-col justify-between border-[#c2d4ff]">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-base sm:text-lg text-[#202342] dark:text-slate-200 font-medium leading-relaxed italic">
                  “The zero-install student test room with tab-switch logging gave us 100% integrity during our online assessments. Zero app installs meant parents were ecstatic.”
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-[#c2d4ff]/60 dark:border-white/10 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-white dark:bg-white/10 text-[#4555fd] font-bold text-sm flex items-center justify-center shadow-xs">
                  RP
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#202342] dark:text-white">Prof. Rajesh Pillai</h5>
                  <p className="text-xs text-[#4e516a] dark:text-slate-400">Academic Dean, Ryan Group of Schools</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="marklab-card-tint p-8 bg-[#edf2ff] dark:bg-[#1a214d] flex flex-col justify-between border-[#c2d4ff]">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-base sm:text-lg text-[#202342] dark:text-slate-200 font-medium leading-relaxed italic">
                  “The split-screen NCERT reader helped our Class 12 students master complex Physics concepts with instant step-by-step guidance. Our term test scores rose by 14%.”
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-[#c2d4ff]/60 dark:border-white/10 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-white dark:bg-white/10 text-[#4555fd] font-bold text-sm flex items-center justify-center shadow-xs">
                  SM
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#202342] dark:text-white">S. Meenakshi</h5>
                  <p className="text-xs text-[#4e516a] dark:text-slate-400">HOD Science, DAV Educational Society</p>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="marklab-card p-8 bg-white dark:bg-[#161a35] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-base sm:text-lg text-[#202342] dark:text-slate-200 font-medium leading-relaxed italic">
                  “DPDPA 2023 compliance and role-based access control gave our school management complete peace of mind regarding student data privacy.”
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-[#efeff1] dark:border-white/10 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#edf2ff] text-[#4555fd] font-bold text-sm flex items-center justify-center">
                  VR
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#202342] dark:text-white">Vikramaditya Rao</h5>
                  <p className="text-xs text-[#4e516a] dark:text-slate-400">Trustee &amp; Board Member, Modern Academy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 7: FREQUENTLY ASKED QUESTIONS (pricing-details-section)
          Matches Marklab FAQ accordion
          ────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#12162e] border-y border-[#dcdde2] dark:border-white/10">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-[#202342] dark:text-white leading-tight">
              Frequently asked <span className="itlic text-[#4555fd]">questions</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#4e516a] dark:text-slate-400">
              Everything you need to know about EduPulse AI assessment authoring, proctoring, and board compliance.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#dcdde2] dark:border-white/10 bg-[#fbfbfe] dark:bg-white/[0.03] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#202342] dark:text-white hover:text-[#4555fd] transition-colors"
                >
                  <span>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full border border-[#dcdde2] dark:border-white/15 flex items-center justify-center shrink-0 transition-transform ${
                    activeFaq === idx ? 'bg-[#4555fd] text-white rotate-180 border-[#4555fd]' : 'text-[#4e516a]'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {activeFaq === idx && (
                  <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[#4e516a] dark:text-slate-300 leading-relaxed border-t border-[#efeff1] dark:border-white/10">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 8: ARTICLES & INSIGHTS (Read article)
          Matches Marklab article section
          ────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl sm:text-5xl font-bold text-[#202342] dark:text-white leading-tight">
                Read <span className="itlic text-[#4555fd]">article</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#4e516a] dark:text-slate-400">
                Real pedagogy results, board guidelines, and expert insights to help your institution.
              </p>
            </div>

            <MarklabButton
              onClick={() => setCurrentView('paper-builder')}
              variant="outline"
            >
              All Articles &amp; Guides
            </MarklabButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Article 1 */}
            <div className="marklab-card p-6 flex flex-col justify-between group cursor-pointer hover:border-[#4555fd]">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-[#edf2ff] text-[#4555fd] text-[10px] font-bold uppercase tracking-wide">
                  CBSE 2026 Guidelines
                </span>
                <h4 className="text-lg font-bold text-[#202342] dark:text-white mt-4 group-hover:text-[#4555fd] transition-colors leading-snug">
                  Designing Competency-Based Assessment Under CBSE 2026 Directives
                </h4>
                <p className="text-xs text-[#4e516a] dark:text-slate-400 mt-2.5 leading-relaxed">
                  How case-based questions and real-world problem scenarios are weighted in the new 80-mark curriculum.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#efeff1] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#4555fd]">
                <span>Read Full Article</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Article 2 */}
            <div className="marklab-card p-6 flex flex-col justify-between group cursor-pointer hover:border-[#4555fd]">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-[#edf2ff] text-[#4555fd] text-[10px] font-bold uppercase tracking-wide">
                  Exam Proctoring
                </span>
                <h4 className="text-lg font-bold text-[#202342] dark:text-white mt-4 group-hover:text-[#4555fd] transition-colors leading-snug">
                  Top 5 Online Exam Proctoring Blind Spots and How to Eliminate Them
                </h4>
                <p className="text-xs text-[#4e516a] dark:text-slate-400 mt-2.5 leading-relaxed">
                  Overcoming tab-switch bypasses, secondary monitors, and unauthorized communication during school remote tests.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#efeff1] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#4555fd]">
                <span>Read Full Article</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Article 3 */}
            <div className="marklab-card p-6 flex flex-col justify-between group cursor-pointer hover:border-[#4555fd]">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-[#edf2ff] text-[#4555fd] text-[10px] font-bold uppercase tracking-wide">
                  Study Science
                </span>
                <h4 className="text-lg font-bold text-[#202342] dark:text-white mt-4 group-hover:text-[#4555fd] transition-colors leading-snug">
                  Boosting Student Retention with Spaced Repetition and PYQ Practice Drills
                </h4>
                <p className="text-xs text-[#4e516a] dark:text-slate-400 mt-2.5 leading-relaxed">
                  How previous 10 years board questions coupled with SM-2 spaced repetition algorithms lock in recall before finals.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#efeff1] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#4555fd]">
                <span>Read Full Article</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 9: HIGH-IMPACT CALL TO ACTION & FOOTER (footer)
          Matches Marklab footer layout, background graphic & typography
          ────────────────────────────────────────────────────────── */}
      <footer className="relative bg-[#202342] text-white pt-24 pb-12 overflow-hidden">
        
        {/* Background Graphic Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay">
          <img 
            src="/marklab/footer-image.webp" 
            alt="Footer Graphic" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-radial from-[#4555fd]/30 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Big CTA Banner Area */}
          <div className="text-center max-w-4xl mx-auto pb-20 border-b border-white/15">
            <p className="text-xs sm:text-sm font-semibold text-[#9fb6ff] uppercase tracking-widest mb-3">
              Start building now
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">
              Transform your school curriculum into <span className="itlic text-[#9fb6ff]">exceptional assessments</span>
            </h2>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mt-4 mb-8">
              Ready to <span className="itlic text-[#9fb6ff]">see real</span> Results
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <MarklabButton
                onClick={() => setCurrentView('paper-builder')}
                variant="primary"
                className="text-base px-8 py-4"
              >
                Launch Free Studio
              </MarklabButton>

              <MarklabButton
                onClick={() => setCurrentView('books')}
                variant="white"
                className="text-base px-8 py-4"
              >
                Read NCERT Library
              </MarklabButton>
            </div>
          </div>

          {/* Navigation & Details Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-16 border-b border-white/15">
            
            {/* Col 1 & 2: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 p-2 flex items-center justify-center border border-white/20">
                  <img src="/marklab/flash-dynamic-gradient.svg" alt="EduPulse" className="w-6 h-6 object-contain" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">
                  EduPulse <span className="text-[#768eff]">AI</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed">
                India's next-generation dual-sided K-12 AI assessment and academic intelligence platform for CBSE, ICSE, and State Boards.
              </p>
              
              {/* Offices */}
              <div className="pt-2 space-y-2 text-xs text-slate-300">
                <p>
                  <strong className="text-white">Academic Innovation Hub:</strong> Sector 44, Cyber City, Gurugram, Haryana 122003
                </p>
                <p>
                  <strong className="text-white">Tech Engineering Lab:</strong> 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038
                </p>
                <p>
                  <strong className="text-white">Direct Support:</strong> support@edupulse.ai
                </p>
              </div>
            </div>

            {/* Col 3: Platform Tools */}
            <div className="space-y-3 text-xs">
              <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-4">Platform Studio</h5>
              <ul className="space-y-2.5 text-slate-300">
                <li>
                  <button onClick={() => setCurrentView('paper-builder')} className="hover:text-[#768eff] transition-colors">
                    Canvas Paper Studio (QP-M)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('books')} className="hover:text-[#768eff] transition-colors">
                    NCERT &amp; Board Book Reader
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('ai-paper-gen')} className="hover:text-[#768eff] transition-colors">
                    AI Blueprint Generator
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('textbook-paper')} className="hover:text-[#768eff] transition-colors">
                    Textbook Exercise Papers
                  </button>
                </li>
                <li>
                  <a href="#Service" className="hover:text-[#768eff] transition-colors">
                    Proctoring Telemetry HUD
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Boards & Standards */}
            <div className="space-y-3 text-xs">
              <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-4">Board Blueprints</h5>
              <ul className="space-y-2.5 text-slate-300">
                <li><span className="text-slate-400">CBSE Class 10 &amp; 12 Board Spec</span></li>
                <li><span className="text-slate-400">ICSE &amp; ISC Council 2026</span></li>
                <li><span className="text-slate-400">State Boards (MSBSHSE, Karnataka)</span></li>
                <li><span className="text-slate-400">Section A-E Marking Schemes</span></li>
                <li><span className="text-slate-400">Bloom's Taxonomy Difficulty Balancing</span></li>
              </ul>
            </div>

            {/* Col 5: Newsletter */}
            <div className="space-y-3 text-xs">
              <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-4">Exam Updates</h5>
              <p className="text-slate-300 leading-relaxed text-xs">
                Subscribe for weekly board question bank additions, revised blueprints, and sample papers.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-2 pt-1">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter educator email"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#768eff]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#4555fd] hover:bg-[#3343e0] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
              {newsletterSubmitted && (
                <p className="text-[11px] text-emerald-400 font-medium">
                  ✓ Thank you! You will receive weekly board updates.
                </p>
              )}
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>
              © {new Date().getFullYear()} EduPulse AI. Built for CBSE, ICSE &amp; State Board Academic Institutions.
            </p>
            <div className="flex items-center gap-6">
              <span>DPDPA 2023 Compliant</span>
              <span>•</span>
              <span>100% Offline Generation Ready</span>
              <span>•</span>
              <button onClick={() => setCurrentView('marketing')} className="hover:text-white transition-colors">
                Back to Top ↑
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaperWebsiteHome;
