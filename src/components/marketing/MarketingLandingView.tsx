import React from 'react';
import { 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  BookOpen, 
  Sliders, 
  Printer, 
  CheckCircle2, 
  ChevronRight, 
  HardDrive,
  Cpu,
  Lock,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';

export const MarketingLandingView: React.FC = () => {
  const { openCreatePaper, openDashboard } = useApp();

  const benefits = [
    {
      step: '01',
      title: 'Upload Any Textbook or Question Bank',
      description: 'Drag & drop textbook PDFs, DOCX, or PYQ papers. Our in-browser worker extracts pages, detects chapters, and runs OCR on scanned pages without leaving your device.',
      icon: <BookOpen className="w-6 h-6 text-brand-600" />
    },
    {
      step: '02',
      title: 'Design Deterministic Blueprints',
      description: 'Specify section structures, question counts, internal choices, and chapter weightages. All marks math is computed in code, guaranteeing zero calculation mistakes.',
      icon: <Sliders className="w-6 h-6 text-structure-600" />
    },
    {
      step: '03',
      title: 'Export Print-Ready Word & PDF Papers',
      description: 'Generate Set A, B, and C variations with matching model answer keys. Export to editable Microsoft Word (.docx) or print-ready PDF with full Devanagari font support.',
      icon: <Printer className="w-6 h-6 text-emerald-600" />
    }
  ];

  const faqs = [
    {
      q: 'Does my textbook data get uploaded to any cloud server?',
      a: 'No. EduPulse AI is strictly local-first. Textbooks, question banks, and generated exam papers are stored exclusively on your device inside your browser (IndexedDB) and optional local folder. When you use an AI provider, only the few paragraphs needed to write the question are sent to the AI API endpoint.'
    },
    {
      q: 'What educational boards are supported?',
      a: 'EduPulse AI includes built-in patterns for CBSE, ICSE, and Maharashtra State Board formats. You can also customize or create custom blueprint structures for any school, college, or competitive exam pattern.'
    },
    {
      q: 'Does it support Hindi and Marathi question papers?',
      a: 'Yes. All generated PDF exports embed Noto Sans Devanagari to guarantee Hindi and Marathi characters render without tofu blocks or broken conjuncts.'
    },
    {
      q: 'Can I use it offline without an API key?',
      a: 'Yes. If you are offline or do not have an API key configured, EduPulse AI automatically fulfills blueprint slots directly from your local Question Bank.'
    }
  ];

  return (
    <div className="w-full text-left bg-neutral-50 dark:bg-neutral-950 transition-colors">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>100% Local-First • Zero Cloud Database • Indian Board Standards</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight leading-[1.15]">
            Turn your textbooks into <br />
            <span className="text-brand-600">exam-ready papers</span> in minutes.
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            A private, SaaS-grade assessment engineering suite for Indian school teachers.
            Upload books, design exact blueprints, customize questions inline, and export to Word & print-ready PDF.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Sparkles className="w-5 h-5 text-amber-300" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={openDashboard}
              className="shadow-soft-md"
            >
              Open Teacher Dashboard
            </Button>
            <Button
              variant="outline"
              size="lg"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => openCreatePaper()}
            >
              Create Exam Paper Now
            </Button>
          </div>
        </div>

        {/* Product Interactive Mockup */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-12">
          <div className="rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-soft-lg overflow-hidden">
            {/* Window bar */}
            <div className="h-10 bg-neutral-100 dark:bg-neutral-800/80 px-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-danger-500/80" />
                <span className="w-3 h-3 rounded-full bg-warning-500/80" />
                <span className="w-3 h-3 rounded-full bg-success-500/80" />
              </div>
              <span className="text-xs font-mono text-neutral-500">
                EduPulse Paper Editor • Class 10 Science Mid-Term (80 Marks)
              </span>
              <Badge variant="success" size="xs">Saved Locally ✓</Badge>
            </div>

            {/* Simulated split view */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800 p-6 gap-6 text-xs text-left bg-neutral-50/50 dark:bg-neutral-950/40">
              
              {/* Left pane: question list */}
              <div className="space-y-3">
                <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">
                  Interactive Question Stream
                </span>
                
                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-soft-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="structure">Section A • MCQ</Badge>
                    <span className="font-mono text-brand-600 font-bold">1 Mark</span>
                  </div>
                  <p className="font-medium text-neutral-800 dark:text-neutral-200">
                    Q.1. Which gas is liberated when dilute hydrochloric acid reacts with active zinc metal?
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-400">
                    <div>(A) Oxygen</div>
                    <div className="font-bold text-emerald-600">(B) Hydrogen ✓</div>
                    <div>(C) Chlorine</div>
                    <div>(D) Nitrogen</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-soft-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="structure">Section B • Short Answer</Badge>
                    <span className="font-mono text-brand-600 font-bold">2 Marks</span>
                  </div>
                  <p className="font-medium text-neutral-800 dark:text-neutral-200">
                    Q.2. Define a combination reaction. Give one balanced chemical equation as an example.
                  </p>
                  <span className="text-[10px] text-neutral-400">
                    Grounded in NCERT Class 10 Science, Chapter 1, Page 6
                  </span>
                </div>
              </div>

              {/* Right pane: print preview */}
              <div className="space-y-3">
                <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">
                  Board Print Preview (A4 Sheet)
                </span>
                <div className="p-5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white text-neutral-900 shadow-soft-sm space-y-3 font-serif">
                  <div className="text-center border-b pb-2">
                    <h5 className="font-bold text-sm tracking-wide">DELHI PUBLIC SCHOOL</h5>
                    <div className="text-[10px] text-neutral-600 font-sans">ANNUAL EXAMINATION 2026 • CLASS X SCIENCE</div>
                    <div className="text-[10px] text-neutral-500 font-sans mt-0.5">TIME: 3 HOURS | MAXIMUM MARKS: 80</div>
                  </div>
                  <div className="space-y-2 text-[11px] leading-relaxed">
                    <div className="font-sans font-bold text-[10px] uppercase text-neutral-700">SECTION A (20 Marks)</div>
                    <div><strong>Q.1.</strong> Which gas is liberated when dilute HCl reacts with active zinc? [1]</div>
                    <div><strong>Q.2.</strong> Define combination reaction with an example. [2]</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3 Benefit Sections */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight mt-1">
            Engineered specifically for Indian educators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((b) => (
            <Card key={b.step} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  {b.icon}
                </div>
                <span className="font-mono text-2xl font-bold text-neutral-300 dark:text-neutral-700">
                  {b.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {b.title}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {b.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section className="py-16 bg-neutral-100/60 dark:bg-neutral-900/60 border-y border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-soft-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Your data stays strictly on your device.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto leading-relaxed">
            No server database. No account creation. No tracking cookies. All your questions, drafts, and uploaded PDFs remain in your browser's IndexedDB and your local folder.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 text-center tracking-tight mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <Card key={i} className="p-5 space-y-2">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {f.q}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {f.a}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 EduPulse AI. Production-ready local-first examination software.</span>
          <div className="flex items-center gap-4">
            <button onClick={openDashboard} className="hover:text-neutral-900 dark:hover:text-white">Dashboard</button>
            <button onClick={() => openCreatePaper()} className="hover:text-neutral-900 dark:hover:text-white">Create Paper</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
