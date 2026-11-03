import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Layers,
  Download,
  Shuffle,
  Upload,
  CheckCircle2,
  ChevronRight,
  Printer,
  ShieldCheck,
  Award,
  BookOpen,
  ArrowRight,
  School,
  FileCheck,
  Zap,
  Sliders,
  HelpCircle,
  Copy,
  ChevronDown,
  Check,
  Star,
  ExternalLink,
  Laptop,
  Clock,
  Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PaperWebsiteHome: React.FC = () => {
  const { setCurrentView, theme } = useApp();
  const isDark = theme === 'dark';

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Can I export the question paper to Microsoft Word for custom editing?',
      a: 'Yes, absolutely! QP-M includes a native Word (.doc) exporter that preserves standard board examination typography, school headers, two-column MCQ option tables, right-aligned marks columns, and general instructions. You can open and edit it in Microsoft Word, Google Docs, or LibreOffice.'
    },
    {
      q: 'Does QP-M calculate and balance total marks automatically?',
      a: 'Yes. The real-time marks tracker monitors allocated marks across every section (Section A through Section D) against your target exam marks (e.g. 80 Marks, 70 Marks, or 50 Marks). The Auto-Assemble engine can also automatically select questions matching your exact difficulty ratio (e.g. 40% Easy, 40% Medium, 20% Hard).'
    },
    {
      q: 'Can I import questions from past papers or scanned notes?',
      a: 'Yes! Using the Import / OCR tool, you can paste raw question text from documents, syllabus PDFs, or typed notes. The parser automatically detects question numbers, options (a, b, c, d), and assigns them directly to your Question Bank.'
    },
    {
      q: 'How does the AI Blueprint Generator work with Google Gemini?',
      a: 'The AI Blueprint Generator uses Google Gemini 2.0 to analyze your syllabus topics or uploaded document and generate a full multi-section board exam paper with marking schemes, Bloom\'s taxonomy tags, and anti-cheating shuffled paper sets (Set 1, Set 2, Set 3).'
    },
    {
      q: 'Can I print directly to A4 without formatting issues?',
      a: 'Yes. The Print engine outputs clean vector A4 portrait layouts with official school headers, candidate roll number boxes, Q.P. Codes, general instructions, and optional teacher answer schemes.'
    },
    {
      q: 'Is my Question Bank stored securely?',
      a: 'All question bank items and custom layouts are stored locally in your browser. You can export a JSON backup at any time to transfer between computers or back up your school repository with zero cloud data lock-in.'
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-emerald-500 selection:text-white ${
      isDark ? 'bg-[#07090e] text-slate-100' : 'bg-white text-slate-900'
    }`}>

      {/* ──────────────────────────────────────────────────────────
          1. HERO SECTION (Theme Aware with Crisp Emerald Accents)
          ────────────────────────────────────────────────────────── */}
      <section className={`relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden border-b transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-[#07090e] via-[#0b0f19] to-[#07090e] border-white/[0.08]'
          : 'bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 border-slate-200/80'
      }`}>
        {/* Subtle Ambient Radial Lighting */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-emerald-500/[0.12] via-teal-500/[0.06] to-transparent blur-3xl pointer-events-none rounded-full ${
          isDark ? 'opacity-70' : 'opacity-100'
        }`} />
        <div className={`absolute top-24 left-12 w-64 h-64 bg-emerald-400/[0.08] blur-2xl pointer-events-none rounded-full ${
          isDark ? 'opacity-80' : 'opacity-60'
        }`} />
        <div className={`absolute bottom-10 right-10 w-80 h-80 bg-teal-400/[0.08] blur-3xl pointer-events-none rounded-full ${
          isDark ? 'opacity-80' : 'opacity-60'
        }`} />

        {/* Delicate Micro-Grid Pattern */}
        <div className={`absolute inset-0 pointer-events-none [background-size:24px_24px] ${
          isDark
            ? 'bg-[radial-gradient(#1e293b_1px,transparent_1px)] opacity-40'
            : 'bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] opacity-60'
        }`} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7">
          
          {/* Top Pill Announcement */}
          <div 
            onClick={() => setCurrentView('paper-builder')}
            className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border shadow-sm transition-all cursor-pointer group ${
              isDark
                ? 'bg-white/[0.04] border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.07] text-slate-300'
                : 'bg-white border-slate-200/90 hover:border-emerald-500/50 hover:shadow-md text-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`text-xs font-semibold transition-colors ${
              isDark ? 'group-hover:text-emerald-300' : 'group-hover:text-emerald-700'
            }`}>
              QP-M 2.0 • The Professional Question Paper Maker for Schools
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Main Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.1] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Craft Board-Standard <br />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Question Papers
              </span> in Minutes.
            </h1>
            <p className={`text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Say goodbye to broken Word formatting and marks-balancing headaches. Drag &amp; drop questions into official CBSE &amp; ICSE blueprints, auto-balance section marks, and export to Word or print-ready A4 PDF.
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <button
              onClick={() => setCurrentView('paper-builder')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all flex items-center justify-center gap-2.5 active:scale-95 group"
            >
              <Layers className="w-4 h-4 text-white" />
              <span>Launch QP-M Studio</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setCurrentView('ai-paper-gen')}
              className={`w-full sm:w-auto px-7 py-4 rounded-2xl border font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 active:scale-95 ${
                isDark
                  ? 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Generate with AI Blueprint</span>
            </button>
          </div>

          {/* Trust strip */}
          <div className={`pt-8 border-t flex flex-wrap items-center justify-center gap-6 text-xs font-medium ${
            isDark ? 'border-white/10 text-slate-400' : 'border-slate-200/80 text-slate-600'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>CBSE &amp; ICSE Format Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              <span>Real-Time Marks Balancing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-500" />
              <span>Word (.doc) &amp; Vector A4 Print</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% Private &amp; Offline Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          2. INTERACTIVE CANVAS SHOWCASE MOCKUP
          ────────────────────────────────────────────────────────── */}
      <section className={`py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark ? 'bg-[#07090e]' : 'bg-white'
      }`}>
        <div className="text-center space-y-3 mb-12">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
            isDark
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            <span>SPLIT-SCREEN CANVAS</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-display font-extrabold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Designed for Speed, Precision &amp; Official Standards
          </h2>
          <p className={`text-sm sm:text-base max-w-xl mx-auto ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Experience the dual-pane workflow: drag questions from your repository on the left straight onto your examination sheet on the right.
          </p>
        </div>

        {/* Visual Studio Showcase Frame (macOS Style) */}
        <div className={`rounded-3xl border overflow-hidden transition-all duration-300 ${
          isDark
            ? 'border-white/10 bg-[#0d1322] shadow-2xl shadow-emerald-950/20'
            : 'border-slate-200 bg-white shadow-2xl shadow-slate-200/80'
        }`}>
          
          {/* Window Chrome Header Bar */}
          <div className={`px-4 py-3 border-b flex items-center justify-between ${
            isDark ? 'bg-[#090d16] border-white/10' : 'bg-slate-100/90 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/30" />
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/30" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/30" />
              <span className={`ml-2 text-xs font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>qpm-canvas-workspace.exam</span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                isDark
                  ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                  : 'text-emerald-700 bg-emerald-100/80 border-emerald-200'
              }`}>
                80 / 80 Marks Balanced
              </span>
              <button
                onClick={() => setCurrentView('paper-builder')}
                className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors shadow-sm"
              >
                Open Studio
              </button>
            </div>
          </div>

          {/* Interactive Preview Body (Split Screen) */}
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x min-h-[500px] ${
            isDark ? 'divide-white/10' : 'divide-slate-200'
          }`}>
            
            {/* Left Column: Question Bank */}
            <div className={`lg:col-span-5 p-5 space-y-3.5 ${
              isDark ? 'bg-[#0b101d]' : 'bg-slate-50/70'
            }`}>
              <div className={`flex items-center justify-between pb-2 border-b ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  <span className={`text-xs font-bold uppercase tracking-wider font-mono ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}>Question Bank</span>
                </div>
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                  isDark
                    ? 'text-slate-400 bg-white/5 border-white/10'
                    : 'text-slate-500 bg-white border-slate-200'
                }`}>
                  24 Available
                </span>
              </div>

              {/* Sample Question Cards */}
              <div className="space-y-2.5">
                <div className={`p-3.5 rounded-2xl border shadow-sm transition-all cursor-grab group ${
                  isDark
                    ? 'bg-[#131b2e] border-white/[0.08] hover:border-emerald-500/40 hover:bg-[#162138]'
                    : 'bg-white border-slate-200 hover:border-emerald-500/50 hover:shadow-md'
                }`}>
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold border ${
                      isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      1 Mark • MCQ
                    </span>
                    <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Physics • Optics</span>
                  </div>
                  <p className={`text-xs font-medium leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    A concave mirror produces a real inverted image twice the object size. What is the object distance (u)?
                  </p>
                  <div className={`flex items-center justify-between mt-2 pt-1.5 border-t text-[10px] font-mono ${
                    isDark ? 'border-white/5 text-slate-500' : 'border-slate-100 text-slate-400'
                  }`}>
                    <span>Bloom: Apply (L3)</span>
                    <span className="text-emerald-500 font-bold group-hover:translate-x-0.5 transition-transform">Drag to Canvas →</span>
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border shadow-sm transition-all cursor-grab group ${
                  isDark
                    ? 'bg-[#131b2e] border-white/[0.08] hover:border-amber-500/40 hover:bg-[#162138]'
                    : 'bg-white border-slate-200 hover:border-amber-500/50 hover:shadow-md'
                }`}>
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold border ${
                      isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      3 Marks • Short Answer
                    </span>
                    <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Biology • Circulation</span>
                  </div>
                  <p className={`text-xs font-medium leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Explain why the muscular wall of the left ventricle is significantly thicker than that of the right ventricle in humans.
                  </p>
                  <div className={`flex items-center justify-between mt-2 pt-1.5 border-t text-[10px] font-mono ${
                    isDark ? 'border-white/5 text-slate-500' : 'border-slate-100 text-slate-400'
                  }`}>
                    <span>Bloom: Analyze (L4)</span>
                    <span className="text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform">Drag to Canvas →</span>
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border shadow-sm transition-all cursor-grab group ${
                  isDark
                    ? 'bg-[#131b2e] border-white/[0.08] hover:border-rose-500/40 hover:bg-[#162138]'
                    : 'bg-white border-slate-200 hover:border-rose-500/50 hover:shadow-md'
                }`}>
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold border ${
                      isDark ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      5 Marks • Long Answer
                    </span>
                    <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Mathematics • Triangles</span>
                  </div>
                  <p className={`text-xs font-medium leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    State and prove the Basic Proportionality Theorem (Thales Theorem). Hence prove that parallel lines divide triangle sides proportionally.
                  </p>
                  <div className={`flex items-center justify-between mt-2 pt-1.5 border-t text-[10px] font-mono ${
                    isDark ? 'border-white/5 text-slate-500' : 'border-slate-100 text-slate-400'
                  }`}>
                    <span>Bloom: Prove &amp; Calculate</span>
                    <span className="text-rose-500 font-bold group-hover:translate-x-0.5 transition-transform">Drag to Canvas →</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic A4 Examination Sheet */}
            <div className={`lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center items-center ${
              isDark ? 'bg-[#070b13]' : 'bg-slate-100/50'
            }`}>
              <div className={`rounded-2xl border p-6 sm:p-8 max-w-xl w-full space-y-5 transition-all ${
                isDark
                  ? 'bg-[#111827] border-white/15 text-white shadow-2xl'
                  : 'bg-white border-slate-200 text-slate-900 shadow-xl'
              }`}>
                
                {/* School Header */}
                <div className={`border-b-2 pb-4 text-center space-y-1 ${
                  isDark ? 'border-white/20' : 'border-slate-900'
                }`}>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-500 font-bold">
                    APEX ACADEMY OF SCIENCES · TERMINAL EXAM 2026
                  </div>
                  <h3 className={`text-lg font-black uppercase font-display tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    Class X — General Science &amp; Mathematics
                  </h3>
                  <div className={`flex items-center justify-between text-xs pt-2 font-mono font-semibold ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <span>Time Allowed: <strong>3 Hours</strong></span>
                    <span className="text-emerald-500 font-bold">Maximum Marks: 80</span>
                  </div>
                </div>

                {/* Candidate Roll Number Box */}
                <div className={`flex items-center justify-between text-[11px] font-mono p-2 rounded-lg border ${
                  isDark ? 'bg-black/30 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <span>Candidate Roll No: [ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]</span>
                  <span>Q.P. Code: <strong>30/10/402</strong></span>
                </div>

                {/* Instructions Box */}
                <div className={`p-3 rounded-xl border text-[11px] space-y-1 ${
                  isDark ? 'bg-black/30 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className={`font-bold uppercase text-[10px] font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>General Instructions:</div>
                  <ol className={`list-decimal list-inside leading-relaxed space-y-0.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <li>All questions are compulsory. Section A consists of 20 MCQs (1 Mark each).</li>
                    <li>Section B consists of 6 Short Answer questions (2 Marks each).</li>
                  </ol>
                </div>

                {/* Section Preview */}
                <div className="space-y-3">
                  <div className={`flex items-center justify-between border-b pb-1.5 ${
                    isDark ? 'border-white/10' : 'border-slate-200'
                  }`}>
                    <span className={`text-xs font-bold font-mono uppercase ${
                      isDark ? 'text-emerald-400' : 'text-emerald-800'
                    }`}>
                      Section A — Multiple Choice Questions
                    </span>
                    <span className={`text-[11px] font-mono font-semibold ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      20 Questions • 20 Marks
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                    isDark ? 'bg-white/[0.03] border-white/10 text-slate-200' : 'bg-slate-50/70 border-slate-200 text-slate-800'
                  }`}>
                    <div className="text-xs">
                      <span className={`font-bold mr-2 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>Q1.</span>
                      Which of the following organic functional groups is present in butanone?
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      [1M]
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. HOW IT WORKS (3 Simple Steps)
          ────────────────────────────────────────────────────────── */}
      <section className={`py-16 sm:py-20 border-t border-b transition-colors duration-300 ${
        isDark ? 'bg-[#090d16] border-white/[0.08]' : 'bg-slate-50 border-slate-200/80'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-500 font-bold">
              EFFORTLESS THREE-STEP WORKFLOW
            </span>
            <h2 className={`text-3xl sm:text-4xl font-display font-black ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              How QP-M Transforms Exam Preparation
            </h2>
            <p className={`text-sm sm:text-base max-w-xl mx-auto ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Built for examiners who value clean layout, balanced marks, and zero wasted hours in word processors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className={`p-6 rounded-3xl border shadow-sm transition-all space-y-4 ${
              isDark ? 'bg-[#101726] border-white/10 hover:border-emerald-500/30' : 'bg-white border-slate-200 hover:shadow-md'
            }`}>
              <div className={`w-10 h-10 rounded-xl font-mono font-bold text-base flex items-center justify-center ${
                isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700'
              }`}>
                01
              </div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Set Exam Meta &amp; Rules</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Configure your school name, examination title, class grade, subject, time allowed, and general instructions in one clear dialog.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`p-6 rounded-3xl border shadow-sm transition-all space-y-4 ${
              isDark ? 'bg-[#101726] border-white/10 hover:border-teal-500/30' : 'bg-white border-slate-200 hover:shadow-md'
            }`}>
              <div className={`w-10 h-10 rounded-xl font-mono font-bold text-base flex items-center justify-center ${
                isDark ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-teal-100 text-teal-700'
              }`}>
                02
              </div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Assemble &amp; Drag-and-Drop</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Drag questions into Section A, B, C, or D. Or hit "Auto-Assemble" to automatically select questions matching your target marks and difficulty mix.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`p-6 rounded-3xl border shadow-sm transition-all space-y-4 ${
              isDark ? 'bg-[#101726] border-white/10 hover:border-cyan-500/30' : 'bg-white border-slate-200 hover:shadow-md'
            }`}>
              <div className={`w-10 h-10 rounded-xl font-mono font-bold text-base flex items-center justify-center ${
                isDark ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-cyan-100 text-cyan-700'
              }`}>
                03
              </div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Export Word or Print A4</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Download a clean, fully formatted editable Word document (.doc) or print directly to A4 portrait with candidate roll number grids and answer keys.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. CORE SUPERPOWERS / FEATURE GRID
          ────────────────────────────────────────────────────────── */}
      <section className={`py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 transition-colors duration-300 ${
        isDark ? 'bg-[#07090e]' : 'bg-white'
      }`}>
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-500 font-bold">
            WHY EDUCATORS CHOOSE QP-M
          </span>
          <h2 className={`text-3xl sm:text-4xl font-display font-black ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Engineered for Official Board Workflows
          </h2>
          <p className={`text-sm sm:text-base max-w-xl mx-auto ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Everything required to assemble, balance, proof, and print curricular examination papers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className={`p-6 rounded-3xl border shadow-sm transition-all space-y-3 group ${
            isDark
              ? 'bg-[#101726] border-white/10 hover:border-emerald-500/40 hover:bg-[#141d30]'
              : 'bg-white border-slate-200 hover:border-emerald-500/50 hover:shadow-xl'
          }`}>
            <div className={`w-12 h-12 rounded-2xl p-3 flex items-center justify-center transition-colors border ${
              isDark
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black'
                : 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white'
            }`}>
              <Layers className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Split-Screen Drag &amp; Drop Canvas</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Move questions seamlessly between Section A, B, C, and D. Watch live section marks and overall balance calculate instantly in real time.
            </p>
          </div>

          {/* Feature 2 */}
          <div className={`p-6 rounded-3xl border shadow-sm transition-all space-y-3 group ${
            isDark
              ? 'bg-[#101726] border-white/10 hover:border-teal-500/40 hover:bg-[#141d30]'
              : 'bg-white border-slate-200 hover:border-teal-500/50 hover:shadow-xl'
          }`}>
            <div className={`w-12 h-12 rounded-2xl p-3 flex items-center justify-center transition-colors border ${
              isDark
                ? 'bg-teal-500/10 text-teal-400 border-teal-500/20 group-hover:bg-teal-500 group-hover:text-black'
                : 'bg-teal-50 text-teal-600 border-teal-100 group-hover:bg-teal-600 group-hover:text-white'
            }`}>
              <Shuffle className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Target-Balanced Auto Assembler</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Define your target marks (80, 70, 40) and difficulty distribution (e.g. 40% Easy, 40% Medium, 20% Hard). The solver picks the ideal question mix automatically.
            </p>
          </div>

          {/* Feature 3 */}
          <div className={`p-6 rounded-3xl border shadow-sm transition-all space-y-3 group ${
            isDark
              ? 'bg-[#101726] border-white/10 hover:border-cyan-500/40 hover:bg-[#141d30]'
              : 'bg-white border-slate-200 hover:border-cyan-500/50 hover:shadow-xl'
          }`}>
            <div className={`w-12 h-12 rounded-2xl p-3 flex items-center justify-center transition-colors border ${
              isDark
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-black'
                : 'bg-cyan-50 text-cyan-600 border-cyan-100 group-hover:bg-cyan-600 group-hover:text-white'
            }`}>
              <Download className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Word (.doc) &amp; A4 Print Ready</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              One-click export to native Microsoft Word format or print directly to A4 portrait with candidate roll number boxes, Q.P. Code, and signature blocks.
            </p>
          </div>

          {/* Feature 4 */}
          <div className={`p-6 rounded-3xl border shadow-sm transition-all space-y-3 group ${
            isDark
              ? 'bg-[#101726] border-white/10 hover:border-emerald-500/40 hover:bg-[#141d30]'
              : 'bg-white border-slate-200 hover:border-emerald-500/50 hover:shadow-xl'
          }`}>
            <div className={`w-12 h-12 rounded-2xl p-3 flex items-center justify-center transition-colors border ${
              isDark
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black'
                : 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white'
            }`}>
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Gemini 2.0 AI Synthesis</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Integrate Google Gemini to generate board-standard questions for any subject or topic, complete with model answers and Bloom taxonomy classifications.
            </p>
          </div>

          {/* Feature 5 */}
          <div className={`p-6 rounded-3xl border shadow-sm transition-all space-y-3 group ${
            isDark
              ? 'bg-[#101726] border-white/10 hover:border-teal-500/40 hover:bg-[#141d30]'
              : 'bg-white border-slate-200 hover:border-teal-500/50 hover:shadow-xl'
          }`}>
            <div className={`w-12 h-12 rounded-2xl p-3 flex items-center justify-center transition-colors border ${
              isDark
                ? 'bg-teal-500/10 text-teal-400 border-teal-500/20 group-hover:bg-teal-500 group-hover:text-black'
                : 'bg-teal-50 text-teal-600 border-teal-100 group-hover:bg-teal-600 group-hover:text-white'
            }`}>
              <Upload className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>OCR &amp; Document Text Importer</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Paste question papers from previous years or scanned OCR text. The intelligent parser extracts questions, options, and marks with zero manual re-typing.
            </p>
          </div>

          {/* Feature 6 */}
          <div className={`p-6 rounded-3xl border shadow-sm transition-all space-y-3 group ${
            isDark
              ? 'bg-[#101726] border-white/10 hover:border-cyan-500/40 hover:bg-[#141d30]'
              : 'bg-white border-slate-200 hover:border-cyan-500/50 hover:shadow-xl'
          }`}>
            <div className={`w-12 h-12 rounded-2xl p-3 flex items-center justify-center transition-colors border ${
              isDark
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-black'
                : 'bg-cyan-50 text-cyan-600 border-cyan-100 group-hover:bg-cyan-600 group-hover:text-white'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Confidential &amp; 100% Offline</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              School test papers stay strictly within your browser. Export and restore your private question repository as encrypted JSON backups anytime.
            </p>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          5. BOARD STANDARDS COMPLIANCE CARD
          ────────────────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-3xl p-8 sm:p-12 border relative overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-[#0c1f28] via-[#0c1626] to-[#070e1a] border-emerald-500/30 shadow-2xl shadow-emerald-950/30'
            : 'bg-gradient-to-br from-emerald-50 via-teal-50/60 to-cyan-50/40 border-emerald-200 shadow-lg'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${
                isDark
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}>
                OFFICIAL FORMATS
              </span>
              <h2 className={`text-2xl sm:text-3xl font-display font-black ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Pre-configured for CBSE, ICSE &amp; State Board Guidelines
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                QP-M formats papers to match official board requirements: Section A (MCQs / Assert-Reason), Section B (Very Short Answer), Section C (Short Answer), Section D (Long Answer 5M), and Section E (Case-Based Integrated Units).
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('paper-builder')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                >
                  <span>Build Paper Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className={`p-4 rounded-2xl border shadow-sm space-y-1 ${
                isDark ? 'bg-white/[0.04] border-white/10' : 'bg-white border-emerald-100'
              }`}>
                <span className="text-emerald-400 font-bold">CBSE Class 10 &amp; 12</span>
                <p className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>80 Marks • 3 Hours • 39 Questions Standard Pattern</p>
              </div>
              <div className={`p-4 rounded-2xl border shadow-sm space-y-1 ${
                isDark ? 'bg-white/[0.04] border-white/10' : 'bg-white border-teal-100'
              }`}>
                <span className="text-teal-400 font-bold">ICSE / ISC Board</span>
                <p className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Compulsory Section I &amp; Section II Internal Choices</p>
              </div>
              <div className={`p-4 rounded-2xl border shadow-sm space-y-1 ${
                isDark ? 'bg-white/[0.04] border-white/10' : 'bg-white border-cyan-100'
              }`}>
                <span className="text-cyan-400 font-bold">State Board Formats</span>
                <p className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Maharashtra, Karnataka &amp; Tamil Nadu Blueprint Rules</p>
              </div>
              <div className={`p-4 rounded-2xl border shadow-sm space-y-1 ${
                isDark ? 'bg-white/[0.04] border-white/10' : 'bg-white border-indigo-100'
              }`}>
                <span className="text-indigo-400 font-bold">Foundation &amp; Olympiad</span>
                <p className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>JEE/NEET diagnostic weighting &amp; negative marking keys</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          6. FAQ SECTION (Theme-Aware Accordion)
          ────────────────────────────────────────────────────────── */}
      <section className={`py-16 sm:py-24 border-t transition-colors duration-300 ${
        isDark ? 'bg-[#090d16] border-white/[0.08]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-500 font-bold">
              COMMON QUESTIONS
            </span>
            <h2 className={`text-2xl sm:text-3xl font-display font-extrabold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border shadow-sm overflow-hidden transition-all ${
                  isDark ? 'border-white/10 bg-[#101726]' : 'border-slate-200 bg-white'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className={`w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold transition-colors ${
                    isDark ? 'text-white hover:text-emerald-400' : 'text-slate-900 hover:text-emerald-700'
                  }`}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      activeFaq === idx ? 'rotate-180 text-emerald-500' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className={`px-4 pb-5 sm:px-5 text-xs leading-relaxed border-t pt-3 ${
                    isDark ? 'text-slate-400 border-white/5' : 'text-slate-600 border-slate-100'
                  }`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          7. BOTTOM CALL TO ACTION
          ────────────────────────────────────────────────────────── */}
      <section className={`py-16 sm:py-20 text-center border-t transition-colors duration-300 ${
        isDark ? 'bg-[#07090e] border-white/[0.08]' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className={`text-3xl sm:text-4xl font-display font-black ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Ready to Generate Professional Examination Papers?
          </h2>
          <p className={`text-sm sm:text-base max-w-xl mx-auto ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Join hundreds of teachers and examination coordinators saving hours every test session.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('paper-builder')}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Open QP-M Studio</span>
            </button>
            <button
              onClick={() => setCurrentView('ai-paper-gen')}
              className={`px-7 py-3.5 rounded-2xl border font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                isDark
                  ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Blueprint Generator</span>
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          8. FOOTER
          ────────────────────────────────────────────────────────── */}
      <footer className={`border-t py-8 text-xs transition-colors duration-300 ${
        isDark ? 'border-white/[0.08] bg-[#05070b] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white p-1.5 flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
            <span className={`font-display font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              QP-<span className="text-emerald-500">M</span>
            </span>
            <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>• Professional Question Paper Generator</span>
          </div>

          <div className={`flex items-center gap-6 text-[11px] font-medium ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <button onClick={() => setCurrentView('paper-builder')} className="hover:text-emerald-500 transition-colors">
              Canvas Studio
            </button>
            <button onClick={() => setCurrentView('ai-paper-gen')} className="hover:text-emerald-500 transition-colors">
              AI Blueprint
            </button>
            <span>CBSE &amp; ICSE Compliant</span>
            <span>© {new Date().getFullYear()} QP-M Studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
};