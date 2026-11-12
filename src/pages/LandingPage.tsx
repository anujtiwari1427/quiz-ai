import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  FileText, 
  ArrowRight, 
  BookOpen, 
  Sliders, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown,
  HardDrive, 
  Cpu, 
  Lock, 
  Globe, 
  Sun, 
  Moon, 
  Sparkles,
  Layers,
  Database,
  ExternalLink,
  Download,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Logo } from '../components/common/Logo';
import { LANDING_TRANSLATIONS, LanguageCode } from '../locales/landing';
import { db } from '../db';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useApp();
  const shouldReduceMotion = useReducedMotion();

  const [lang, setLang] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('edupulse_lang');
    if (saved === 'hi' || saved === 'mr' || saved === 'en') return saved;
    return 'en';
  });

  const [hasWorkspaceData, setHasWorkspaceData] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'library' | 'blueprint' | 'editor'>('editor');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = LANDING_TRANSLATIONS[lang];

  useEffect(() => {
    localStorage.setItem('edupulse_lang', lang);
  }, [lang]);

  // Check if teacher has existing data in IndexedDB
  useEffect(() => {
    const checkData = async () => {
      try {
        const [books, papers] = await Promise.all([
          db.textbooks.count(),
          db.savedPapers.count()
        ]);
        if (books > 0 || papers > 0) {
          setHasWorkspaceData(true);
        }
      } catch (e) {
        // Fallback to false if DB check fails
      }
    };
    checkData();
  }, []);

  const handleGoToApp = () => {
    navigate('/app');
  };

  const handleCreatePaper = () => {
    navigate('/app/create');
  };

  const fadeUp = shouldReduceMotion
    ? { opacity: 1, y: 0 }
    : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.25, ease: 'easeOut' } };

  return (
    <div className="min-h-screen bg-surface-canvas text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors antialiased selection:bg-brand-500 selection:text-white">
      
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-soft"
      >
        Skip to main content
      </a>

      {/* 1. Sticky Header */}
      <header className="sticky top-0 z-40 bg-surface/90 dark:bg-surface/90 backdrop-blur-md border-b border-border-subtle transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="focus:outline-none">
            <Logo size="sm" showText subtitle="Local-First Exam Studio" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            <a href="#how-it-works" className="hover:text-brand-700 dark:hover:text-brand-400 transition-colors">
              {t.nav.howItWorks}
            </a>
            <a href="#features" className="hover:text-brand-700 dark:hover:text-brand-400 transition-colors">
              {t.nav.features}
            </a>
            <a href="#showcase" className="hover:text-brand-700 dark:hover:text-brand-400 transition-colors">
              {t.nav.showcase}
            </a>
            <a href="#privacy" className="hover:text-brand-700 dark:hover:text-brand-400 transition-colors">
              {t.nav.privacy}
            </a>
            <a href="#faq" className="hover:text-brand-700 dark:hover:text-brand-400 transition-colors">
              {t.nav.faq}
            </a>
          </nav>

          {/* Right Controls: Language, Theme, CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector */}
            <div className="relative inline-flex items-center">
              <Globe className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as LanguageCode)}
                className="pl-7 pr-4 py-1.5 rounded-lg border border-border-subtle bg-surface text-neutral-700 dark:text-neutral-300 text-xs font-semibold focus:outline-none focus:border-brand-600 cursor-pointer transition-colors"
                aria-label="Select language"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिंदी (HI)</option>
                <option value="mr">मराठी (MR)</option>
              </select>
            </div>

            {/* Dark / Light Mode Switch */}
            <button
              onClick={toggleTheme}
              className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={hasWorkspaceData ? handleGoToApp : handleCreatePaper}
              className="hidden sm:inline-flex shadow-soft"
            >
              {hasWorkspaceData ? t.nav.openWorkspace : t.nav.startCreating}
            </Button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-600 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 py-4 border-b border-border-subtle bg-surface space-y-3 text-left">
            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              {t.nav.howItWorks}
            </a>
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              {t.nav.features}
            </a>
            <a 
              href="#showcase" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              {t.nav.showcase}
            </a>
            <a 
              href="#privacy" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              {t.nav.privacy}
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              {t.nav.faq}
            </a>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => {
                  setMobileMenuOpen(false);
                  hasWorkspaceData ? handleGoToApp() : handleCreatePaper();
                }}
              >
                {hasWorkspaceData ? t.nav.openWorkspace : t.nav.startCreating}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Landmarks */}
      <main id="main-content" className="flex-1">
        
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 border-b border-border-subtle hero-wash text-left">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
            
            {/* Indian Board Standards Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-brand-700 dark:text-brand-400" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight leading-[1.12]">
              {t.hero.titleLine1} <br />
              <span className="text-brand-700 dark:text-brand-400 underline decoration-brand-200 dark:decoration-brand-800/80 decoration-4 underline-offset-8">
                {t.hero.titleHighlight}
              </span>{' '}
              {t.hero.titleLine2}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              {t.hero.subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={handleCreatePaper}
                className="w-full sm:w-auto shadow-soft font-semibold"
              >
                {t.hero.ctaPrimary}
              </Button>
              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-medium"
                >
                  {t.hero.ctaSecondary}
                </Button>
              </a>
            </div>

            {/* Trust Line */}
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 pt-1">
              <Lock className="w-3.5 h-3.5 text-accent-600 dark:text-accent-400" />
              <span>{t.hero.trustBadge}</span>
            </div>

            {/* Realistic Product Mockup (Split-Screen Paper Editor in HTML/CSS/SVG) */}
            <div className="max-w-5xl mx-auto mt-12 text-left">
              <div className="rounded-2xl border border-border-strong bg-surface shadow-soft-lg overflow-hidden transition-all">
                
                {/* Mockup Window Chrome Bar */}
                <div className="h-10 px-4 bg-neutral-100 dark:bg-neutral-800/70 border-b border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="text-[11px] font-mono font-medium text-neutral-600 dark:text-neutral-400 ml-2 truncate">
                      edupulse-workspace / paper-editor / mid-term-science.exam
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="xs">
                      {t.hero.mockup.verifiedLocally}
                    </Badge>
                    <span className="text-[10px] text-neutral-600 dark:text-neutral-400 hidden sm:inline">
                      {t.hero.mockup.printReady}
                    </span>
                  </div>
                </div>

                {/* Mockup Split-Screen Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
                  
                  {/* Left Column: Question Stream (7 cols) */}
                  <div className="lg:col-span-7 p-5 border-b lg:border-b-0 lg:border-r border-border-subtle space-y-4 bg-surface-canvas/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-700 dark:text-brand-400" />
                        <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                          Questions Stream (28 Questions)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/80">
                          Set A (Active)
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-200/80 dark:bg-neutral-800">
                          Set B
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-200/80 dark:bg-neutral-800">
                          Set C
                        </span>
                      </div>
                    </div>

                    {/* Question Card 1 */}
                    <div className="p-3.5 rounded-xl border border-border-subtle bg-surface space-y-2.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-neutral-900 dark:text-neutral-100">Q.1</span>
                          <Badge variant="brand" size="xs">[1 Mark]</Badge>
                          <Badge variant="neutral" size="xs">MCQ</Badge>
                          <span className="text-[10px] text-neutral-600 dark:text-neutral-300 font-mono font-medium">Bloom: Remember</span>
                        </div>
                        <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">Grounded in Ch. 11</span>
                      </div>
                      <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                        {t.hero.mockup.q1Text}
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-400">
                        <div className="p-1.5 rounded border border-brand-200 bg-brand-50/40 text-brand-900 font-medium">(A) Atmospheric refraction ✓</div>
                        <div className="p-1.5 rounded border border-border-subtle">(B) Total internal reflection</div>
                        <div className="p-1.5 rounded border border-border-subtle">(C) Dispersion of light</div>
                        <div className="p-1.5 rounded border border-border-subtle">(D) Scattering of light</div>
                      </div>
                    </div>

                    {/* Question Card 2 */}
                    <div className="p-3.5 rounded-xl border border-border-subtle bg-surface space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-neutral-900 dark:text-neutral-100">Q.2</span>
                          <Badge variant="brand" size="xs">[2 Marks]</Badge>
                          <Badge variant="neutral" size="xs">Short Answer</Badge>
                          <span className="text-[10px] text-neutral-600 dark:text-neutral-300 font-mono font-medium">Bloom: Understand</span>
                        </div>
                        <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">Grounded in Ch. 1</span>
                      </div>
                      <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                        {t.hero.mockup.q2Text}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Print-Accurate A4 Sheet Preview (5 cols) */}
                  <div className="lg:col-span-5 p-5 bg-neutral-200/60 dark:bg-neutral-900/60 flex items-center justify-center">
                    <div className="w-full max-w-[340px] bg-white text-neutral-900 p-5 rounded-lg shadow-soft border border-neutral-300 space-y-3 font-serif text-[10px] select-none">
                      
                      {/* Examination Header */}
                      <div className="text-center border-b border-neutral-300 pb-2 space-y-0.5">
                        <div className="font-bold tracking-tight text-neutral-900 text-[11px] font-sans">
                          {t.hero.mockup.examTitle}
                        </div>
                        <p className="text-neutral-600 font-sans text-[10px]">
                          {t.hero.mockup.classSubject}
                        </p>
                        <p className="text-neutral-500 font-mono text-[9px]">
                          {t.hero.mockup.timeMarks}
                        </p>
                      </div>

                      {/* Section A */}
                      <div className="space-y-1 text-left">
                        <p className="font-sans font-bold text-[9px] uppercase tracking-wide border-b border-neutral-200 pb-0.5">
                          {t.hero.mockup.sectionA}
                        </p>
                        <p className="leading-snug">
                          <strong>1.</strong> {t.hero.mockup.q1Text} <span className="float-right font-sans font-bold">[1]</span>
                        </p>
                        <div className="grid grid-cols-2 gap-0.5 text-[9px] text-neutral-700 pl-2">
                          <span>(a) Atmospheric refraction</span>
                          <span>(b) Total internal reflection</span>
                          <span>(c) Dispersion of light</span>
                          <span>(d) Scattering of light</span>
                        </div>
                      </div>

                      {/* Section B */}
                      <div className="space-y-1 text-left pt-1">
                        <p className="font-sans font-bold text-[9px] uppercase tracking-wide border-b border-neutral-200 pb-0.5">
                          {t.hero.mockup.sectionB}
                        </p>
                        <p className="leading-snug">
                          <strong>2.</strong> {t.hero.mockup.q2Text} <span className="float-right font-sans font-bold">[2]</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. How It Works Section */}
        <section id="how-it-works" className="py-20 border-b border-border-subtle text-left">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
            
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                {t.howItWorks.tag}
              </span>
              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
                {t.howItWorks.title}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t.howItWorks.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Step 1 */}
              <div className="p-6 rounded-2xl border border-border-subtle bg-surface space-y-4 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                  {t.howItWorks.step1Title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {t.howItWorks.step1Desc}
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl border border-border-subtle bg-surface space-y-4 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                  {t.howItWorks.step2Title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {t.howItWorks.step2Desc}
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl border border-border-subtle bg-surface space-y-4 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
                  <Printer className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                  {t.howItWorks.step3Title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {t.howItWorks.step3Desc}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Features Grid Section (6 items max) */}
        <section id="features" className="py-20 border-b border-border-subtle bg-surface-canvas/40 text-left">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
            
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                {t.features.tag}
              </span>
              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
                {t.features.title}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t.features.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.features.items.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-border-subtle bg-surface space-y-3 hover:border-brand-500/50 transition-colors shadow-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-brand-700 dark:text-brand-400 flex items-center justify-center">
                    {idx === 0 && <BookOpen className="w-4 h-4" />}
                    {idx === 1 && <Sliders className="w-4 h-4" />}
                    {idx === 2 && <Sparkles className="w-4 h-4" />}
                    {idx === 3 && <Globe className="w-4 h-4" />}
                    {idx === 4 && <Printer className="w-4 h-4" />}
                    {idx === 5 && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 5. Product Showcase (Tabbed Mockups) */}
        <section id="showcase" className="py-20 border-b border-border-subtle text-left">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
            
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                {t.showcase.tag}
              </span>
              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
                {t.showcase.title}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t.showcase.subtitle}
              </p>
            </div>

            {/* Showcase Tabs Switcher */}
            <div className="flex items-center justify-center gap-2 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl max-w-md mx-auto">
              <button
                onClick={() => setActiveShowcaseTab('library')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                  activeShowcaseTab === 'library'
                    ? 'bg-surface text-brand-700 dark:text-brand-400 shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                }`}
              >
                {t.showcase.tab1Label}
              </button>
              <button
                onClick={() => setActiveShowcaseTab('blueprint')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                  activeShowcaseTab === 'blueprint'
                    ? 'bg-surface text-brand-700 dark:text-brand-400 shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                }`}
              >
                {t.showcase.tab2Label}
              </button>
              <button
                onClick={() => setActiveShowcaseTab('editor')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                  activeShowcaseTab === 'editor'
                    ? 'bg-surface text-brand-700 dark:text-brand-400 shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                }`}
              >
                {t.showcase.tab3Label}
              </button>
            </div>

            {/* Tabbed Interactive Card */}
            <div className="p-6 rounded-2xl border border-border-strong bg-surface shadow-soft">
              {activeShowcaseTab === 'library' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
                    <div>
                      <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">{t.showcase.tab1Title}</h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{t.showcase.tab1Desc}</p>
                    </div>
                    <Badge variant="brand">Zero Cloud Upload</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-canvas space-y-1.5">
                      <div className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100">NCERT Class 10 Science</div>
                      <div className="text-[10px] text-neutral-500">16 Chapters • 248 Pages Extracted</div>
                      <Badge variant="success" size="xs">Ready for Blueprints</Badge>
                    </div>
                    <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-canvas space-y-1.5">
                      <div className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100">Maharashtra SSC History</div>
                      <div className="text-[10px] text-neutral-500">9 Chapters • Marathi & English</div>
                      <Badge variant="success" size="xs">OCR Complete</Badge>
                    </div>
                    <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-canvas space-y-1.5">
                      <div className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100">CBSE Mathematics PYQ Bank</div>
                      <div className="text-[10px] text-neutral-500">180 Questions Tagged by Marks</div>
                      <Badge variant="brand" size="xs">Question Bank</Badge>
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'blueprint' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
                    <div>
                      <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">{t.showcase.tab2Title}</h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{t.showcase.tab2Desc}</p>
                    </div>
                    <Badge variant="success">Arithmetic Balanced: 80/80 Marks</Badge>
                  </div>
                  <div className="space-y-2 pt-2 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-surface-canvas">
                      <span className="font-bold">Section A: MCQs (20 questions × 1 mark)</span>
                      <span className="font-mono font-bold text-brand-700 dark:text-brand-400">20 Marks</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-surface-canvas">
                      <span className="font-bold">Section B: Short Answer (6 questions × 2 marks)</span>
                      <span className="font-mono font-bold text-brand-700 dark:text-brand-400">12 Marks</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-surface-canvas">
                      <span className="font-bold">Section C: Long Answer (7 questions × 3 marks)</span>
                      <span className="font-mono font-bold text-brand-700 dark:text-brand-400">21 Marks</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-surface-canvas">
                      <span className="font-bold">Section D: Case Study / Source Based (3 questions × 4 marks)</span>
                      <span className="font-mono font-bold text-brand-700 dark:text-brand-400">12 Marks</span>
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'editor' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
                    <div>
                      <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">{t.showcase.tab3Title}</h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{t.showcase.tab3Desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="xs" leftIcon={<Download className="w-3.5 h-3.5" />}>Word (.docx)</Button>
                      <Button variant="primary" size="xs" leftIcon={<Printer className="w-3.5 h-3.5" />}>Print PDF</Button>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border-subtle bg-surface-canvas space-y-3 text-xs">
                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                      <span>Live A4 Preview Synced</span>
                      <span className="font-mono text-emerald-800 dark:text-emerald-300 font-bold">100% Print-Accurate</span>
                    </div>
                    <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
                      Teachers can modify question text directly, swap in alternate questions from the chapter question bank, or regenerate questions with adjusted Bloom levels.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* 6. Privacy & Local-First Section */}
        <section id="privacy" className="py-20 border-b border-border-subtle bg-surface-canvas/40 text-left">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
            
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                {t.privacy.tag}
              </span>
              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
                {t.privacy.title}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t.privacy.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <Card className="p-2">
                <CardHeader>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <CardTitle>{t.privacy.point1Title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {t.privacy.point1Desc}
                  </p>
                </CardContent>
              </Card>

              <Card className="p-2">
                <CardHeader>
                  <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 flex items-center justify-center mb-1">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <CardTitle>{t.privacy.point2Title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {t.privacy.point2Desc}
                  </p>
                </CardContent>
              </Card>

              <Card className="p-2">
                <CardHeader>
                  <div className="w-9 h-9 rounded-xl bg-accent-50 dark:bg-accent-950/60 text-accent-700 dark:text-accent-400 flex items-center justify-center mb-1">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <CardTitle>{t.privacy.point3Title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {t.privacy.point3Desc}
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* 7. For Teachers Like You (Use Cases) */}
        <section className="py-20 border-b border-border-subtle text-left">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
            
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                {t.useCases.tag}
              </span>
              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
                {t.useCases.title}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t.useCases.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {t.useCases.cases.map((uc, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border border-border-subtle bg-surface space-y-3 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono font-bold text-neutral-600 dark:text-neutral-300">{uc.target}</span>
                      <Badge variant="accent" size="xs">{uc.badge}</Badge>
                    </div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{uc.title}</h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{uc.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 8. FAQ Section (Accordion) */}
        <section id="faq" className="py-20 border-b border-border-subtle bg-surface-canvas/30 text-left">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
            
            <div className="text-center space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                {t.faq.tag}
              </span>
              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
                {t.faq.title}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t.faq.subtitle}
              </p>
            </div>

            <div className="space-y-3">
              {t.faq.items.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-border-subtle rounded-xl bg-surface overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-brand-700 dark:text-brand-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-border-subtle/50 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* 9. Final CTA Band */}
        <section className="py-20 text-center relative overflow-hidden bg-brand-700 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t.ctaBand.title}
            </h2>
            <p className="text-brand-100 text-sm max-w-xl mx-auto leading-relaxed">
              {t.ctaBand.subtitle}
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleCreatePaper}
                className="bg-white text-brand-900 border-white hover:bg-brand-50 shadow-soft-lg font-bold"
              >
                {t.ctaBand.button}
              </Button>
            </div>
            <p className="text-[11px] text-brand-200">
              {t.ctaBand.note}
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-surface text-left">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            
            <div className="space-y-3 max-w-sm">
              <Logo size="sm" showText subtitle="Local-First Examination Suite" />
              <p className="text-xs text-neutral-500 leading-relaxed">
                {t.footer.desc}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
              <div className="space-y-2.5">
                <div className="font-bold uppercase tracking-wider text-[10px] text-neutral-600 dark:text-neutral-400">
                  {t.footer.product}
                </div>
                <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
                  <li><a href="#how-it-works" className="py-1.5 inline-block hover:text-brand-700 transition-colors">How it works</a></li>
                  <li><a href="#features" className="py-1.5 inline-block hover:text-brand-700 transition-colors">Features</a></li>
                  <li><a href="#showcase" className="py-1.5 inline-block hover:text-brand-700 transition-colors">Product Tour</a></li>
                  <li><Link to="/design-system" className="py-1.5 inline-block hover:text-brand-700 transition-colors">Design System</Link></li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <div className="font-bold uppercase tracking-wider text-[10px] text-neutral-600 dark:text-neutral-400">
                  {t.footer.trust}
                </div>
                <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
                  <li><a href="#privacy" className="py-1.5 inline-block hover:text-brand-700 transition-colors">Local Storage</a></li>
                  <li><a href="#faq" className="py-1.5 inline-block hover:text-brand-700 transition-colors">Fair Use & Copyright</a></li>
                  <li><a href="#faq" className="py-1.5 inline-block hover:text-brand-700 transition-colors">Supported Boards</a></li>
                </ul>
              </div>

              <div className="space-y-2.5 col-span-2 sm:col-span-1">
                <div className="font-bold uppercase tracking-wider text-[10px] text-neutral-600 dark:text-neutral-400">
                  {t.footer.community}
                </div>
                <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
                  <li>
                    <a
                      href="https://github.com/anujtiwari1427/quiz-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 inline-flex items-center gap-1 hover:text-brand-700 transition-colors"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <Link to="/app" className="py-1.5 inline-block hover:text-brand-700 transition-colors">
                      Teacher Workspace
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400">
            <div>&copy; {new Date().getFullYear()} {t.footer.allRightsReserved}</div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t.footer.privacyNote}</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
