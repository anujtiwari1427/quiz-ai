import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Layers, 
  Shuffle, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  ChevronDown, 
  Printer, 
  ShieldCheck, 
  Upload, 
  Cpu, 
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PaperWebsiteHome: React.FC = () => {
  const { setCurrentView, theme } = useApp();
  const isDark = theme === 'dark';

  // Interactive FAQ state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Does QP-M generate papers conforming to official CBSE and ICSE blueprints?',
      a: 'Yes. QP-M is purpose-built to enforce official CBSE, ICSE, and State Board blueprint structures, including Section A (MCQs & Assertion-Reason), Section B (Short Answer I), Section C (Short Answer II), Section D (Long Answer), and Section E (Case-Based Integrated units).'
    },
    {
      q: 'Can I export the question paper to Microsoft Word (.doc) as well as PDF?',
      a: 'Absolutely. You can export a fully editable Microsoft Word document (.doc) with native tables, section headers, marks allocations, and candidate roll number boxes, or print directly to print-ready vector A4 PDF.'
    },
    {
      q: 'How does real-time marks balancing work?',
      a: 'As you drag questions into Section A, B, C, or D, the top status bar continuously calculates the total marks for each section and alerts you when your paper matches your target examination blueprint (e.g. 80 / 80 marks balanced).'
    },
    {
      q: 'Can I upload our school textbook and generate questions directly from exercises?',
      a: 'Yes! Navigate to the "My Textbooks" tab, upload your curriculum PDF, and our parser will automatically detect chapters and exercise sections ("Practice Set", "Exercises", "Review Questions"). You can then generate test papers grounded strictly in those exercises.'
    },
    {
      q: 'Is my school examination data kept private and secure?',
      a: '100% confidential. Question papers, school names, student keys, and questions are stored locally in your browser storage or private server. No exam papers are ever made public.'
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-orange-500 selection:text-white ${
      isDark ? 'bg-[#090714] text-slate-100' : 'bg-white text-slate-900'
    }`}>

      {/* ──────────────────────────────────────────────────────────
          1. HERO SECTION (Orange, White & Purple Theme)
          ────────────────────────────────────────────────────────── */}
      <section className={`relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden border-b transition-colors duration-300 ${
        isDark
          ? 'bg-[#0c091d] border-purple-950/60'
          : 'bg-white border-slate-200'
      }`}>
        {/* Subtle geometric dot pattern */}
        <div className={`absolute inset-0 pointer-events-none [background-size:24px_24px] ${
          isDark
            ? 'bg-[radial-gradient(#2e1065_1px,transparent_1px)] opacity-30'
            : 'bg-[radial-gradient(#ede9fe_1px,transparent_1px)] opacity-70'
        }`} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7">
          
          {/* Top Pill Announcement */}
          <div 
            onClick={() => setCurrentView('paper-builder')}
            className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border shadow-xs transition-all cursor-pointer group ${
              isDark
                ? 'bg-purple-950/50 border-purple-900/60 hover:border-orange-500 text-purple-200'
                : 'bg-purple-50 border-purple-200 hover:border-orange-500 text-purple-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className={`text-xs font-semibold transition-colors ${
              isDark ? 'group-hover:text-orange-400' : 'group-hover:text-orange-700'
            }`}>
              QP-M 2.0 • The Professional Question Paper Maker for Schools
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Main Headline with Solid, Authoritative Typography */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.1] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Craft Board-Standard <br />
              <span className="text-purple-700 dark:text-purple-400">
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
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2.5 active:scale-95 group"
            >
              <Layers className="w-4 h-4 text-white" />
              <span>Launch QP-M Studio</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setCurrentView('ai-paper-gen')}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-xl border font-bold text-sm shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 active:scale-95 ${
                isDark
                  ? 'bg-purple-950/40 hover:bg-purple-900/60 border-purple-800 text-purple-200'
                  : 'bg-white hover:bg-purple-50 border-purple-300 text-purple-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Generate with AI Blueprint</span>
            </button>

            <button
              onClick={() => setCurrentView('textbook-paper')}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl border font-bold text-sm shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 active:scale-95 ${
                isDark
                  ? 'bg-purple-900/40 hover:bg-purple-900/70 border-purple-700 text-purple-100'
                  : 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-orange-500" />
              <span>From Textbook Exercises</span>
            </button>
          </div>

          {/* Trust strip */}
          <div className={`pt-8 border-t flex flex-wrap items-center justify-center gap-6 text-xs font-medium ${
            isDark ? 'border-purple-950 text-slate-400' : 'border-slate-200 text-slate-600'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>CBSE &amp; ICSE Format Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Real-Time Marks Balancing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>Word (.doc) &amp; Vector A4 Print</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>100% Private &amp; Offline Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          2. INTERACTIVE CANVAS SHOWCASE MOCKUP
          ────────────────────────────────────────────────────────── */}
      <section className={`py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark ? 'bg-[#090714]' : 'bg-white'
      }`}>
        <div className="text-center space-y-3 mb-12">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
            isDark
              ? 'bg-purple-950/50 text-purple-300 border-purple-800'
              : 'bg-purple-50 text-purple-800 border-purple-200'
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

        {/* Visual Studio Showcase Frame (Clean Window Style) */}
        <div className={`rounded-3xl border overflow-hidden transition-all duration-300 ${
          isDark
            ? 'border-purple-900/40 bg-[#0e0c1f] shadow-2xl shadow-purple-950/40'
            : 'border-slate-200 bg-white shadow-xl shadow-slate-200/70'
        }`}>
          
          {/* Window Chrome Header Bar */}
          <div className={`px-4 py-3 border-b flex items-center justify-between ${
            isDark ? 'bg-[#120f26] border-purple-900/40' : 'bg-slate-100/90 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/30" />
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/30" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/30" />
              <span className={`ml-2 text-xs font-mono font-medium ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>qpm-canvas-workspace.exam</span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                isDark
                  ? 'text-orange-300 bg-orange-950/40 border-orange-800'
                  : 'text-orange-800 bg-orange-100 border-orange-200'
              }`}>
                80 / 80 Marks Balanced
              </span>
              <button
                onClick={() => setCurrentView('paper-builder')}
                className="px-3 py-1 rounded-lg bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition-colors shadow-xs"
              >
                Open Studio
              </button>
            </div>
          </div>

          {/* Interactive Preview Body (Split Screen) */}
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x min-h-[500px] ${
            isDark ? 'divide-purple-950' : 'divide-slate-200'
          }`}>
            
            {/* Left Column: Question Bank */}
            <div className={`lg:col-span-5 p-5 space-y-3.5 ${
              isDark ? 'bg-[#0b0917]' : 'bg-slate-50/70'
            }`}>
              <div className={`flex items-center justify-between pb-2 border-b ${
                isDark ? 'border-purple-950' : 'border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className={`text-xs font-bold uppercase tracking-wider font-mono ${
                    isDark ? 'text-purple-200' : 'text-slate-800'
                  }`}>Question Bank</span>
                </div>
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                  isDark
                    ? 'text-purple-300 bg-purple-950/40 border-purple-800'
                    : 'text-purple-800 bg-purple-50 border-purple-200'
                }`}>
                  24 Available
                </span>
              </div>

              {/* Sample Question Cards */}
              <div className="space-y-2.5">
                <div className={`p-3.5 rounded-2xl border shadow-xs transition-all cursor-grab group ${
                  isDark
                    ? 'bg-[#15122b] border-purple-900/30 hover:border-orange-500/50 hover:bg-[#1a1636]'
                    : 'bg-white border-slate-200 hover:border-orange-500/50 hover:shadow-md'
                }`}>
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold border ${
                      isDark ? 'bg-purple-950/60 text-purple-300 border-purple-800' : 'bg-purple-50 text-purple-800 border-purple-200'
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
                    <span className="text-orange-600 dark:text-orange-400 font-bold group-hover:translate-x-0.5 transition-transform">Drag to Canvas →</span>
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border shadow-xs transition-all cursor-grab group ${
                  isDark
                    ? 'bg-[#15122b] border-purple-900/30 hover:border-purple-500/50 hover:bg-[#1a1636]'
                    : 'bg-white border-slate-200 hover:border-purple-500/50 hover:shadow-md'
                }`}>
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold border ${
                      isDark ? 'bg-orange-950/40 text-orange-300 border-orange-800' : 'bg-orange-50 text-orange-800 border-orange-200'
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
                    <span className="text-purple-600 dark:text-purple-400 font-bold group-hover:translate-x-0.5 transition-transform">Drag to Canvas →</span>
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border shadow-xs transition-all cursor-grab group ${
                  isDark
                    ? 'bg-[#15122b] border-purple-900/30 hover:border-orange-500/50 hover:bg-[#1a1636]'
                    : 'bg-white border-slate-200 hover:border-orange-500/50 hover:shadow-md'
                }`}>
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold border ${
                      isDark ? 'bg-purple-950/60 text-purple-300 border-purple-800' : 'bg-purple-50 text-purple-800 border-purple-200'
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
                    <span className="text-orange-600 dark:text-orange-400 font-bold group-hover:translate-x-0.5 transition-transform">Drag to Canvas →</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic A4 Examination Sheet */}
            <div className={`lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center items-center ${
              isDark ? 'bg-[#080613]' : 'bg-slate-100/50'
            }`}>
              <div className={`rounded-2xl border p-6 sm:p-8 max-w-xl w-full space-y-5 transition-all ${
                isDark
                  ? 'bg-[#120f24] border-purple-900/40 text-white shadow-2xl'
                  : 'bg-white border-slate-200 text-slate-900 shadow-lg'
              }`}>
                
                {/* School Header */}
                <div className={`border-b-2 pb-4 text-center space-y-1 ${
                  isDark ? 'border-purple-800' : 'border-purple-900'
                }`}>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 font-bold">
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
                    <span className="text-orange-600 font-bold">Maximum Marks: 80</span>
                  </div>
                </div>

                {/* Candidate Roll Number Box */}
                <div className={`flex items-center justify-between text-[11px] font-mono p-2 rounded-lg border ${
                  isDark ? 'bg-black/30 border-purple-900/40 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <span>Candidate Roll No: [ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]</span>
                  <span>Q.P. Code: <strong>30/10/402</strong></span>
                </div>

                {/* Instructions Box */}
                <div className={`p-3 rounded-xl border text-[11px] space-y-1 ${
                  isDark ? 'bg-black/30 border-purple-900/40 text-slate-300' : 'bg-purple-50/50 border-purple-100 text-slate-700'
                }`}>
                  <div className={`font-bold uppercase text-[10px] font-mono ${isDark ? 'text-white' : 'text-purple-950'}`}>General Instructions:</div>
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
                    isDark ? 'border-purple-900/40' : 'border-slate-200'
                  }`}>
                    <span className={`text-xs font-bold font-mono uppercase ${
                      isDark ? 'text-purple-400' : 'text-purple-800'
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
                    isDark ? 'bg-white/[0.03] border-purple-900/30 text-slate-200' : 'bg-slate-50/70 border-slate-200 text-slate-800'
                  }`}>
                    <div className="text-xs">
                      <span className={`font-bold mr-2 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>Q1.</span>
                      Which of the following organic functional groups is present in butanone?
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      isDark ? 'bg-orange-950/40 text-orange-300 border-orange-800' : 'bg-orange-50 text-orange-800 border-orange-200'
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
        isDark ? 'bg-[#0c091d] border-purple-950/60' : 'bg-slate-50 border-slate-200/80'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-orange-600 font-bold">
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
            <div className={`p-6 rounded-3xl border shadow-xs transition-all space-y-4 ${
              isDark ? 'bg-[#120f26] border-purple-900/40 hover:border-purple-500/40' : 'bg-white border-slate-200 hover:shadow-md'
            }`}>
              <div className={`w-10 h-10 rounded-xl font-mono font-bold text-base flex items-center justify-center ${
                isDark ? 'bg-purple-950/80 text-purple-300 border border-purple-800' : 'bg-purple-100 text-purple-800'
              }`}>
                01
              </div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Set Exam Meta &amp; Rules</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Configure your school name, examination title, class grade, subject, time allowed, and general instructions in one clear dialog.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`p-6 rounded-3xl border shadow-xs transition-all space-y-4 ${
              isDark ? 'bg-[#120f26] border-purple-900/40 hover:border-orange-500/40' : 'bg-white border-slate-200 hover:shadow-md'
            }`}>
              <div className={`w-10 h-10 rounded-xl font-mono font-bold text-base flex items-center justify-center ${
                isDark ? 'bg-orange-950/80 text-orange-300 border border-orange-800' : 'bg-orange-100 text-orange-800'
              }`}>
                02
              </div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Assemble &amp; Drag-and-Drop</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Drag questions into Section A, B, C, or D. Or hit "Auto-Assemble" to automatically select questions matching your target marks and difficulty mix.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`p-6 rounded-3xl border shadow-xs transition-all space-y-4 ${
              isDark ? 'bg-[#120f26] border-purple-900/40 hover:border-purple-500/40' : 'bg-white border-slate-200 hover:shadow-md'
            }`}>
              <div className={`w-10 h-10 rounded-xl font-mono font-bold text-base flex items-center justify-center ${
                isDark ? 'bg-purple-950/80 text-purple-300 border border-purple-800' : 'bg-purple-100 text-purple-800'
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
        isDark ? 'bg-[#090714]' : 'bg-white'
      }`}>
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 font-bold">
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
          <div className={`p-6 rounded-3xl border shadow-xs transition-all space-y-3 group ${
            isDark
              ? 'bg-[#120f26] border-purple-900/30 hover:border-purple-500/50 hover:bg-[#161233]'
              : 'bg-white border-slate-200 hover:border-purple-500/50 hover:shadow-xl'
          }`}>
            <div className={`w-12 h-12 rounded-2xl p-3 flex items-center justify-center transition-colors border ${
              isDark
                ? 'bg-purple-950/60 text-purple-300 border-purple-800 group-hover:bg-purple-700 group-hover:text-white'
                : 'bg-purple-50 text-purple-700 border-purple-200 group-hover:bg-purple-700 group-hover:text-white'
            }`}>
              <Layers className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Split-Screen Drag &amp; Drop Canvas</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Move questions seamlessly between Section A, B, C, and D. Watch live section marks and overall balance calculate instantly in real time.
            </p>
          </div>

          {/* Feature 2 */}
          <div className={`p-6 rounded-3xl border shadow-xs transition-all space-y-3 group ${
            isDark
              ? 'bg-[#120f26] border-purple-900/30 hover:border-orange-500/50 hover:bg-[#161233]'
              : 'bg-white border-slate-200 hover:border-orange-500/50 hover:shadow-xl'
          }`}>
            <div className={`w-12 h-12 rounded-2xl p-3 flex items-center justify-center transition-colors border ${
              isDark
                ? 'bg-orange-950/60 text-orange-300 border-orange-800 group-hover:bg-orange-600 group-hover:text-white'
                : 'bg-orange-50 text-orange-700 border-orange-200 group-hover:bg-orange-600 group-hover:text-white'
            }`}>
              <Shuffle className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Target-Balanced Auto Assembler</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Define your target marks (80, 70, 40) and difficulty distribution (e.g. 40% Easy, 40% Medium, 20% Hard). The solver picks the ideal question mix automatically.
            </p>
          </div>

          {/* Feature 3 */}
          <div className={`p-6 rounded-3xl border shadow-xs transition-all space-y-3 group ${
            isDark
              ? 'bg-[#120f26] border-purple-900/30 hover:border-purple-500/50 hover:bg-[#161233]'
              : 'bg-white border-slate-200 hover:border-purple-500/50 hover:shadow-xl'
          }`}>
            <div className={`w-12 h-12 rounded-2xl p-3 flex items-center justify-center transition-colors border ${
              isDark
                ? 'bg-purple-950/60 text-purple-300 border-purple-800 group-hover:bg-purple-700 group-hover:text-white'
                : 'bg-purple-50 text-purple-700 border-purple-200 group-hover:bg-purple-700 group-hover:text-white'
            }`}>
              <Download className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Word (.doc) &amp; A4 Print Ready</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              One-click export to native Microsoft Word format or print directly to A4 portrait with candidate roll number boxes, Q.P. Code, and signature blocks.
            </p>
          </div>

          {/* Feature 4 */}
          <div className={`p-6 rounded-3xl border shadow-xs transition-all space-y-3 group ${
            isDark
              ? 'bg-[#120f26] border-purple-900/30 hover:border-orange-500/50 hover:bg-[#161233]'
              : 'bg-white border-slate-200 hover:border-orange-500/50 hover:shadow-xl'
          }`}>
            <div className={`w-12 h-12 rounded-2xl p-3 flex items-center justify-center transition-colors border ${
              isDark
                ? 'bg-orange-950/60 text-orange-300 border-orange-800 group-hover:bg-orange-600 group-hover:text-white'
                : 'bg-orange-50 text-orange-700 border-orange-200 group-hover:bg-orange-600 group-hover:text-white'
            }`}>
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Gemini 2.0 AI Synthesis</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Integrate Google Gemini to generate board-standard questions for any subject or topic, complete with model answers and Bloom taxonomy classifications.
            </p>
          </div>

          {/* Feature 5 */}
          <div className={`p-6 rounded-3xl border shadow-xs transition-all space-y-3 group ${
            isDark
              ? 'bg-[#120f26] border-purple-900/30 hover:border-purple-500/50 hover:bg-[#161233]'
              : 'bg-white border-slate-200 hover:border-purple-500/50 hover:shadow-xl'
          }`}>
            <div className={`w-12 h-12 rounded-2xl p-3 flex items-center justify-center transition-colors border ${
              isDark
                ? 'bg-purple-950/60 text-purple-300 border-purple-800 group-hover:bg-purple-700 group-hover:text-white'
                : 'bg-purple-50 text-purple-700 border-purple-200 group-hover:bg-purple-700 group-hover:text-white'
            }`}>
              <Upload className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Textbook &amp; Exercise Ingestion</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Upload full curriculum textbooks in PDF, DOCX, or TXT. Automatically detect chapters and exercise sets to generate grounded test papers.
            </p>
          </div>

          {/* Feature 6 */}
          <div className={`p-6 rounded-3xl border shadow-xs transition-all space-y-3 group ${
            isDark
              ? 'bg-[#120f26] border-purple-900/30 hover:border-orange-500/50 hover:bg-[#161233]'
              : 'bg-white border-slate-200 hover:border-orange-500/50 hover:shadow-xl'
          }`}>
            <div className={`w-12 h-12 rounded-2xl p-3 flex items-center justify-center transition-colors border ${
              isDark
                ? 'bg-orange-950/60 text-orange-300 border-orange-800 group-hover:bg-orange-600 group-hover:text-white'
                : 'bg-orange-50 text-orange-700 border-orange-200 group-hover:bg-orange-600 group-hover:text-white'
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
          5. BOARD STANDARDS COMPLIANCE CARD (Orange-White-Purple)
          ────────────────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-3xl p-8 sm:p-12 border relative overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-[#100d24] border-purple-900/50 shadow-xl'
            : 'bg-slate-50 border-slate-200 shadow-xs'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${
                isDark
                  ? 'bg-purple-950/60 text-purple-300 border-purple-800'
                  : 'bg-purple-100 text-purple-900 border-purple-200'
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
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
                >
                  <span>Build Paper Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className={`p-4 rounded-2xl border shadow-xs space-y-1 ${
                isDark ? 'bg-slate-900/80 border-purple-900/40' : 'bg-white border-slate-200'
              }`}>
                <span className="text-purple-700 dark:text-purple-400 font-bold">CBSE Class 10 &amp; 12</span>
                <p className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>80 Marks • 3 Hours • 39 Questions Standard Pattern</p>
              </div>
              <div className={`p-4 rounded-2xl border shadow-xs space-y-1 ${
                isDark ? 'bg-slate-900/80 border-purple-900/40' : 'bg-white border-slate-200'
              }`}>
                <span className="text-orange-600 dark:text-orange-400 font-bold">ICSE / ISC Board</span>
                <p className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Compulsory Section I &amp; Section II Internal Choices</p>
              </div>
              <div className={`p-4 rounded-2xl border shadow-xs space-y-1 ${
                isDark ? 'bg-slate-900/80 border-purple-900/40' : 'bg-white border-slate-200'
              }`}>
                <span className="text-purple-700 dark:text-purple-400 font-bold">State Board Formats</span>
                <p className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Maharashtra, Karnataka &amp; Tamil Nadu Blueprint Rules</p>
              </div>
              <div className={`p-4 rounded-2xl border shadow-xs space-y-1 ${
                isDark ? 'bg-slate-900/80 border-purple-900/40' : 'bg-white border-slate-200'
              }`}>
                <span className="text-orange-600 dark:text-orange-400 font-bold">Foundation &amp; Olympiad</span>
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
        isDark ? 'bg-[#0c091d] border-purple-950/60' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-orange-600 font-bold">
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
                className={`rounded-2xl border shadow-xs overflow-hidden transition-all ${
                  isDark ? 'border-purple-900/40 bg-[#120f26]' : 'border-slate-200 bg-white'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className={`w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold transition-colors ${
                    isDark ? 'text-white hover:text-orange-400' : 'text-slate-900 hover:text-orange-700'
                  }`}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      activeFaq === idx ? 'rotate-180 text-orange-600' : ''
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
        isDark ? 'bg-[#090714] border-purple-950/60' : 'bg-white border-slate-200'
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
              className="px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Open QP-M Studio</span>
            </button>
            <button
              onClick={() => setCurrentView('ai-paper-gen')}
              className={`px-7 py-3.5 rounded-xl border font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                isDark
                  ? 'bg-purple-950/40 hover:bg-purple-900/60 border-purple-800 text-purple-200'
                  : 'bg-white hover:bg-purple-50 border-purple-300 text-purple-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>AI Blueprint Generator</span>
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          8. FOOTER
          ────────────────────────────────────────────────────────── */}
      <footer className={`border-t py-8 text-xs transition-colors duration-300 ${
        isDark ? 'border-purple-950/60 bg-[#06040e] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-700 text-white p-1.5 flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <span className={`font-display font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              QP-<span className="text-orange-600">M</span>
            </span>
            <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>• Professional Question Paper Generator</span>
          </div>

          <div className={`flex items-center gap-6 text-[11px] font-medium ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <button onClick={() => setCurrentView('paper-builder')} className="hover:text-orange-600 transition-colors">
              Canvas Studio
            </button>
            <button onClick={() => setCurrentView('books')} className="hover:text-orange-600 transition-colors">
              My Textbooks
            </button>
            <button onClick={() => setCurrentView('ai-paper-gen')} className="hover:text-orange-600 transition-colors">
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
