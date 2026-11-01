import React, { useState } from 'react';
import { 
  Sparkles, 
  Printer, 
  Download, 
  Play, 
  Copy, 
  Check, 
  BookOpen, 
  Clock, 
  Award, 
  Sliders, 
  HelpCircle, 
  FileText, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  RotateCcw,
  Layers,
  ArrowRight,
  Filter,
  Eye,
  Bookmark,
  X,
  ExternalLink,
  FileCheck,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AI_PAPER_SERVICE, GeneratePaperInput } from '../../services/aiPaperService';
import { AiGeneratedPaper, BoardType } from '../../types';
import { LIVE_AI_SERVICE } from '../../services/liveAiService';
import { PDF_EXPORT_SERVICE, PdfExportMode } from '../../services/pdfExportService';

export const AiPaperGenerator: React.FC = () => {
  const { startExamRunner, setCurrentView } = useApp();

  // Wizard state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'paper' | 'solutions' | 'blueprint'>('paper');
  const [activeSectionFilter, setActiveSectionFilter] = useState<'all' | 'A' | 'B' | 'C' | 'D'>('all');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [exportingMode, setExportingMode] = useState<PdfExportMode | null>(null);

  // Form input parameters
  const [title, setTitle] = useState('');
  const [board, setBoard] = useState<BoardType>('CBSE');
  const [classGrade, setClassGrade] = useState<number>(10);
  const [subject, setSubject] = useState<string>('Science');
  const [topics, setTopics] = useState<string>(
    'Chemical Reactions and Equations, Electricity, Light - Reflection & Refraction, Life Processes'
  );
  const [totalMarks, setTotalMarks] = useState<number>(80);
  const [durationMinutes, setDurationMinutes] = useState<number>(180);
  const [difficulty, setDifficulty] = useState<'balanced' | 'easy' | 'hard' | 'olympiad'>('balanced');
  const [includeCaseStudy, setIncludeCaseStudy] = useState(true);

  // Active generated paper
  const [currentPaper, setCurrentPaper] = useState<AiGeneratedPaper>(() => {
    const saved = AI_PAPER_SERVICE.getSavedPapers();
    return saved.length > 0 ? saved[0] : AI_PAPER_SERVICE.getDefaultSeedPapers()[0];
  });

  const aiConfig = LIVE_AI_SERVICE.getActiveConfig();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setProgressPct(10);
    setProgressMsg('Analyzing board blueprint specifications & syllabus weighting...');

    try {
      const input: GeneratePaperInput = {
        title: title.trim() || undefined,
        board,
        classGrade,
        subject,
        topics: topics.trim() || subject,
        totalMarks: Number(totalMarks),
        durationMinutes: Number(durationMinutes),
        difficulty,
        includeCaseStudy
      };

      const paper = await AI_PAPER_SERVICE.generatePaper(input, (pct, msg) => {
        setProgressPct(pct);
        setProgressMsg(msg);
      });

      setCurrentPaper(paper);
      setActiveTab('paper');
    } catch (err: any) {
      alert(`Generation failed: ${err.message || 'Please verify network or API keys.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPdf = (mode: PdfExportMode = 'student_paper') => {
    if (!currentPaper) return;
    setExportingMode(mode);
    try {
      PDF_EXPORT_SERVICE.generateAndPrintPaperPdf(currentPaper, mode);
    } catch (err: any) {
      alert(`PDF generation failed: ${err.message || 'Pop-up might be blocked.'}`);
    } finally {
      setTimeout(() => setExportingMode(null), 1200);
    }
  };

  const handleDownloadHtml = (mode: PdfExportMode = 'student_paper') => {
    if (!currentPaper) return;
    const html = PDF_EXPORT_SERVICE.buildExaminationHtmlDocument(currentPaper, mode);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPaper.title.replace(/[^a-zA-Z0-9]/g, '_')}_${mode}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTxt = () => {
    if (!currentPaper) return;
    const text = `=====================================================
${currentPaper.title}
Board: ${currentPaper.board} | Class: ${currentPaper.classGrade} | Subject: ${currentPaper.subject}
Time Allowed: ${currentPaper.durationMinutes} Minutes | Maximum Marks: ${currentPaper.totalMarks}
Academic Session: ${currentPaper.academicYear}
=====================================================

GENERAL INSTRUCTIONS:
${currentPaper.generalInstructions.map((ins, i) => `${i + 1}. ${ins}`).join('\n')}

${currentPaper.sections.map(sec => `
-----------------------------------------------------
${sec.title} (${sec.totalMarks} Marks)
${sec.description}
-----------------------------------------------------
${currentPaper.questions.filter(q => q.section === sec.sectionId).map(q => `
Q${q.questionNumber}. [${q.marks} Mark${q.marks > 1 ? 's' : ''}] (${q.topic})
${q.questionText}
${q.options ? q.options.map(opt => `   (${opt.id}) ${opt.text}`).join('\n') : ''}
`).join('\n')}
`).join('\n')}

=====================================================
MARKING SCHEME & MODEL ANSWERS:
=====================================================
${currentPaper.questions.map(q => `
Q${q.questionNumber} (Section ${q.section}) - [${q.marks} Mark${q.marks > 1 ? 's' : ''}]
Topic: ${q.topic} | Bloom Level: ${q.bloomsLevel}
Answer: ${q.correctAnswer}
Explanation: ${q.solutionExplanation}
Rubric:
${q.markingRubric.map(r => `  • ${r.step} (+${r.marks}M)`).join('\n')}
`).join('\n')}
`;
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${currentPaper.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyPaper = () => {
    if (!currentPaper) return;
    const text = `
=====================================================
${currentPaper.title}
Board: ${currentPaper.board} | Class: ${currentPaper.classGrade} | Subject: ${currentPaper.subject}
Time Allowed: ${currentPaper.durationMinutes} Minutes | Maximum Marks: ${currentPaper.totalMarks}
=====================================================

GENERAL INSTRUCTIONS:
${currentPaper.generalInstructions.map((ins, i) => `${i + 1}. ${ins}`).join('\n')}

${currentPaper.sections.map(sec => `
-----------------------------------------------------
${sec.title} (${sec.totalMarks} Marks)
${sec.description}
-----------------------------------------------------
${currentPaper.questions.filter(q => q.section === sec.sectionId).map(q => `
Q${q.questionNumber}. [${q.marks} Mark${q.marks > 1 ? 's' : ''}]
${q.questionText}
${q.options ? q.options.map(opt => `   (${opt.id}) ${opt.text}`).join('\n') : ''}
`).join('\n')}
`).join('\n')}
    `.trim();

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTakeExamOnline = () => {
    if (!currentPaper) return;
    const examModel = AI_PAPER_SERVICE.convertToExamModel(currentPaper);
    startExamRunner(examModel);
  };

  const displayedQuestions = activeSectionFilter === 'all'
    ? currentPaper.questions
    : currentPaper.questions.filter(q => q.section === activeSectionFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in-up">
      {/* ── Page Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121824] via-[#0d1117] to-black border border-white/[0.1] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google Gemini 2.0 Flash Active</span>
              </span>
              <span className="text-slate-400 text-xs font-mono bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/5">
                NEP 2020 &amp; Board Specifications
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              AI Question Paper Generator &amp; Blueprint
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Synthesize formal board examination papers with sectional weightage (Sections A, B, C, D), step-by-step marking schemes, and Bloom's cognitive classification in seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('create-exam')}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-slate-200 border border-white/10 transition-all flex items-center gap-2 shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Book Quiz Studio</span>
            </button>
            <button
              onClick={() => setCurrentView('teacher')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Teacher Hub</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Two Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Parameters (4 cols on lg) */}
        <div className="lg:col-span-4 bg-[#141821]/80 border border-white/[0.09] rounded-3xl p-5 sm:p-6 backdrop-blur-2xl space-y-5 shadow-2xl sticky top-20">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Sliders className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white">Paper Blueprint Setup</h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {aiConfig.provider === 'gemini' ? 'Gemini 2.0' : aiConfig.model}
            </span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Subject & Grade */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Subject</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
                >
                  <option value="Science">Science (General)</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                  <option value="Social Science">Social Science</option>
                  <option value="English">English Core</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Class / Standard</label>
                <select
                  value={classGrade}
                  onChange={e => setClassGrade(Number(e.target.value))}
                  className="w-full bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
                >
                  <option value={8}>Class 8</option>
                  <option value={9}>Class 9</option>
                  <option value={10}>Class 10 (Board)</option>
                  <option value={11}>Class 11</option>
                  <option value={12}>Class 12 (Senior Board)</option>
                </select>
              </div>
            </div>

            {/* Board / Pattern */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Curriculum Board</label>
              <select
                value={board}
                onChange={e => setBoard(e.target.value as BoardType)}
                className="w-full bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
              >
                <option value="CBSE">CBSE (All India Secondary)</option>
                <option value="ICSE">ICSE / ISC (Council for Indian Cert.)</option>
                <option value="State Board (Maharashtra)">Maharashtra State Board</option>
                <option value="State Board (Karnataka)">Karnataka State Board</option>
                <option value="State Board (Tamil Nadu)">Tamil Nadu State Board</option>
              </select>
            </div>

            {/* Topics / Chapters Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Syllabus Chapters / Focus Areas</label>
                <span className="text-[10px] text-slate-500">Comma separated</span>
              </div>
              <textarea
                value={topics}
                onChange={e => setTopics(e.target.value)}
                rows={3}
                placeholder="e.g. Thermodynamics, Kinetic Theory, Wave Optics, Trigonometry..."
                className="w-full bg-[#1c2230] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-none font-sans leading-relaxed"
              />
            </div>

            {/* Marks & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Total Marks</label>
                <select
                  value={totalMarks}
                  onChange={e => {
                    const m = Number(e.target.value);
                    setTotalMarks(m);
                    if (m <= 30) setDurationMinutes(45);
                    else if (m <= 50) setDurationMinutes(90);
                    else setDurationMinutes(180);
                  }}
                  className="w-full bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
                >
                  <option value={25}>25 Marks (Unit Test)</option>
                  <option value={40}>40 Marks (Term 1)</option>
                  <option value={50}>50 Marks (Mid-Term)</option>
                  <option value={70}>70 Marks (Theory Board)</option>
                  <option value={80}>80 Marks (Annual Board)</option>
                  <option value={100}>100 Marks (Comprehensive)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Time Allowed</label>
                <div className="relative">
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Number(e.target.value))}
                    min={15}
                    max={240}
                    step={15}
                    className="w-full bg-[#1c2230] border border-white/10 rounded-xl pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">min</span>
                </div>
              </div>
            </div>

            {/* Difficulty Mix Profile */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Difficulty Profile</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'balanced', label: 'Balanced (CBSE)', desc: '40% Easy, 40% Med, 20% Hard' },
                  { id: 'easy', label: 'Foundation Review', desc: '60% Easy, 30% Med, 10% Hard' },
                  { id: 'hard', label: 'Pre-Board Rigor', desc: '20% Easy, 50% Med, 30% Hard' },
                  { id: 'olympiad', label: 'JEE / Olympiad', desc: '10% Easy, 40% Med, 50% Hard' },
                ].map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDifficulty(d.id as any)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                      difficulty === d.id
                        ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-sm'
                        : 'border-white/5 bg-[#1c2230]/50 text-slate-400 hover:border-white/15 hover:text-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-white">{d.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Title */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                School / Institution Header (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Delhi Public School Annual Exam"
                className="w-full bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing with Gemini 2.0...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Question Paper</span>
                </>
              )}
            </button>
          </form>

          {/* Animated Progress Bar */}
          {isGenerating && (
            <div className="space-y-2 pt-3 border-t border-white/10 animate-fade-in">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300 font-medium truncate pr-2">{progressMsg}</span>
                <span className="font-mono text-emerald-400 font-bold">{progressPct}%</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/5">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Area: Generated Paper & Solutions Preview (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141821]/90 border border-white/[0.09] rounded-2xl p-2.5 backdrop-blur-xl shadow-xl">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setActiveTab('paper')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'paper' 
                    ? 'bg-emerald-500 text-black shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Question Paper</span>
              </button>
              <button
                onClick={() => setActiveTab('solutions')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'solutions' 
                    ? 'bg-emerald-500 text-black shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Marking Scheme &amp; Key</span>
              </button>
              <button
                onClick={() => setActiveTab('blueprint')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'blueprint' 
                    ? 'bg-emerald-500 text-black shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Blueprint Matrix</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPaper}
                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-slate-300 border border-white/10 transition-all flex items-center gap-1.5"
                title="Copy entire question paper text to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownloadTxt}
                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-slate-300 border border-white/10 transition-all flex items-center gap-1.5"
                title="Download formatted text file"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export TXT</span>
              </button>

              <button
                onClick={() => setShowPdfModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5 active:scale-95"
                title="Generate and Print Official Board-Standard PDF"
              >
                <Printer className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>Generate Proper PDF</span>
              </button>

              <button
                onClick={handleTakeExamOnline}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-all"
                title="Launch timed test room for students"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Take Online</span>
              </button>
            </div>
          </div>

          {/* Section Quick Filter Pills */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-[11px] font-semibold text-slate-400">Filter Section:</span>
            <div className="flex items-center gap-1">
              {(['all', 'A', 'B', 'C', 'D'] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setActiveSectionFilter(sec)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono transition-all ${
                    activeSectionFilter === sec
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                      : 'text-slate-400 hover:text-white bg-white/[0.03] border border-white/5'
                  }`}
                >
                  {sec === 'all' ? 'All Sections' : `Sec ${sec}`}
                </button>
              ))}
            </div>
          </div>

          {/* Paper Canvas (Refined Examination Sheet View) */}
          <div className="bg-[#121620] border border-white/[0.1] rounded-3xl p-6 sm:p-10 shadow-2xl relative text-slate-100 min-h-[640px]">
            
            {/* Examination Header */}
            <div className="border-b-2 border-white/20 pb-6 text-center space-y-2.5">
              <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                OFFICIAL CURRICULAR ASSESSMENT • CONFIDENTIAL
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase font-display">
                {currentPaper.title}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 font-medium pt-1">
                <span>Class: <strong className="text-white">{currentPaper.classGrade}th</strong></span>
                <span className="text-slate-600">•</span>
                <span>Subject: <strong className="text-white">{currentPaper.subject}</strong></span>
                <span className="text-slate-600">•</span>
                <span>Board: <strong className="text-white">{currentPaper.board}</strong></span>
                <span className="text-slate-600">•</span>
                <span>Session: <strong className="text-white">{currentPaper.academicYear}</strong></span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-3 mt-3 px-2">
                <span>Time Allowed: <strong className="text-white font-mono">{currentPaper.durationMinutes} Minutes</strong></span>
                <span>Maximum Marks: <strong className="text-emerald-400 font-bold font-mono text-sm">{currentPaper.totalMarks}</strong></span>
              </div>
            </div>

            {/* TAB 1: QUESTION PAPER VIEW */}
            {activeTab === 'paper' && (
              <div className="mt-6 space-y-8">
                {/* General Instructions Box */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-5 text-xs space-y-2 text-slate-300 shadow-inner">
                  <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>General Examination Instructions:</span>
                  </div>
                  <ul className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed pl-1 text-[11.5px]">
                    {currentPaper.generalInstructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ul>
                </div>

                {/* Question Sections */}
                {currentPaper.sections.map((section) => {
                  const sectionQuestions = displayedQuestions.filter(q => q.section === section.sectionId);
                  if (sectionQuestions.length === 0) return null;

                  return (
                    <div key={section.sectionId} className="space-y-4">
                      <div className="border-b border-white/10 pb-2.5 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                            <span>{section.title}</span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">{section.description}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-300 bg-white/[0.06] px-3 py-1 rounded-full border border-white/10">
                          {section.totalMarks} Marks
                        </span>
                      </div>

                      <div className="space-y-5">
                        {sectionQuestions.map((q) => (
                          <div 
                            key={q.id} 
                            className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all space-y-3"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed flex-1">
                                <span className="font-bold text-white mr-2 font-mono text-sm">
                                  Q{q.questionNumber}.
                                </span>
                                <span className="whitespace-pre-line">{q.questionText}</span>
                              </div>
                              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 whitespace-nowrap">
                                [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                              </span>
                            </div>

                            {/* Options if MCQ or Assertion Reason */}
                            {q.options && q.options.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-4">
                                {q.options.map((opt) => (
                                  <div
                                    key={opt.id}
                                    className="text-xs text-slate-300 p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2.5"
                                  >
                                    <span className="font-bold text-emerald-400 font-mono">({opt.id})</span>
                                    <span>{opt.text}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[10px] text-slate-500 font-mono">
                              <span>Topic: <strong className="text-slate-400">{q.topic}</strong></span>
                              <span>Bloom: <strong className="text-indigo-400">{q.bloomsLevel}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: SOLUTIONS & MARKING RUBRIC */}
            {activeTab === 'solutions' && (
              <div className="mt-6 space-y-6">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-xs text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span><strong>Teacher &amp; Evaluator Answer Key</strong>: Complete with model solutions and step-wise marking rubrics.</span>
                  </span>
                  <span className="font-mono text-[11px] text-emerald-400 bg-black/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Standard NEP Rubric
                  </span>
                </div>

                <div className="space-y-5">
                  {displayedQuestions.map((q) => (
                    <div key={q.id} className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3.5">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs sm:text-sm font-mono">
                            Question {q.questionNumber} (Section {q.section})
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            {q.topic}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                            Bloom: {q.bloomsLevel}
                          </span>
                          <span className="text-emerald-400 font-bold font-mono">
                            {q.marks} Mark{q.marks > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300">
                        <strong className="text-slate-400 block mb-1">Question Text:</strong>
                        <p className="whitespace-pre-line text-slate-200">{q.questionText}</p>
                      </div>

                      {/* Model Solution Box */}
                      <div className="bg-emerald-950/20 border-l-4 border-emerald-500 p-3.5 rounded-r-xl text-xs space-y-1.5">
                        <strong className="text-emerald-400 font-semibold block">
                          Model Solution / Correct Answer:
                        </strong>
                        <p className="text-slate-200 whitespace-pre-line leading-relaxed">{q.correctAnswer}</p>
                        {q.solutionExplanation && (
                          <p className="text-slate-400 text-[11px] pt-1.5 border-t border-emerald-500/10">
                            <strong className="text-slate-300">Examiner Note:</strong> {q.solutionExplanation}
                          </p>
                        )}
                      </div>

                      {/* Step-by-Step Marking Rubric */}
                      {q.markingRubric && q.markingRubric.length > 0 && (
                        <div className="text-xs space-y-1.5 pt-1">
                          <strong className="text-slate-400 block text-[11px] uppercase tracking-wider font-mono">
                            Step-wise Marks Allocation Rubric:
                          </strong>
                          <div className="space-y-1">
                            {q.markingRubric.map((rubric, rIdx) => (
                              <div key={rIdx} className="flex items-center justify-between text-slate-300 text-[11px] bg-white/[0.03] p-2 rounded-xl border border-white/5">
                                <span>• {rubric.step}</span>
                                <span className="font-mono text-emerald-400 font-bold">+{rubric.marks}M</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: BLUEPRINT MATRIX */}
            {activeTab === 'blueprint' && (
              <div className="mt-6 space-y-6">
                <div className="text-xs text-slate-400">
                  Comprehensive curricular blueprint showing question weightage, cognitive distribution, and section allocation.
                </div>

                {/* Section Summary Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-white/10 rounded-2xl overflow-hidden">
                    <thead className="bg-black/60 text-slate-300 font-semibold border-b border-white/10 font-mono text-[11px]">
                      <tr>
                        <th className="p-3.5">Section</th>
                        <th className="p-3.5">Question Format</th>
                        <th className="p-3.5">Question Count</th>
                        <th className="p-3.5">Marks / Q</th>
                        <th className="p-3.5 text-right">Section Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {currentPaper.sections.map((sec) => (
                        <tr key={sec.sectionId} className="hover:bg-white/[0.02]">
                          <td className="p-3.5 font-bold text-white font-mono">Section {sec.sectionId}</td>
                          <td className="p-3.5">{sec.description}</td>
                          <td className="p-3.5 font-mono">{sec.questionCount}</td>
                          <td className="p-3.5 font-mono">{sec.marksPerQuestion}</td>
                          <td className="p-3.5 text-right font-mono font-bold text-emerald-400">{sec.totalMarks} Marks</td>
                        </tr>
                      ))}
                      <tr className="bg-white/[0.06] font-bold text-white">
                        <td colSpan={2} className="p-3.5">Grand Examination Total</td>
                        <td className="p-3.5 font-mono">{currentPaper.questions.length} Questions</td>
                        <td className="p-3.5 font-mono">—</td>
                        <td className="p-3.5 text-right font-mono text-emerald-400 text-sm">{currentPaper.totalMarks} Marks</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* AI Synthesis Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Synthesizer Engine</div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>{currentPaper.modelUsed}</span>
                    </div>
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Curriculum Standard</div>
                    <div className="text-sm font-bold text-white">
                      {currentPaper.board} Grade {currentPaper.classGrade}
                    </div>
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Exam Runner Status</div>
                    <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Converted &amp; Ready for Online Test</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* End of Examination Watermark */}
            <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-slate-500 font-mono">
              *** END OF EXAMINATION QUESTION PAPER • EDUPULSE AI BLUEPRINT ENGINE ***
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* OFFICIAL PDF EXPORT MODAL                                   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {showPdfModal && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowPdfModal(false); }}
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="max-w-2xl w-full bg-[#111622] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-5 relative my-auto">
            
            {/* Top decorative gradient glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Printer className="w-3 h-3" />
                  <span>Official Board Examination PDF Exporter</span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Generate Proper Board-Standard PDF
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Export publication-grade A4 documents with candidate Roll No grids, official series codes, instructions, and crisp vector typography.
                </p>
              </div>

              <button
                onClick={() => setShowPdfModal(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Export Format Cards */}
            <div className="space-y-3">
              {/* Option 1: Student Question Paper */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/40 transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                          Student Question Paper
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          Official Exam Copy
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Pristine exam booklet with 8-digit Roll No boxes, Series/QP code, general instructions, Sections A-D, and marks aligned to the right. <strong>Zero answers or spoilers</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => handleExportPdf('student_paper')}
                      disabled={exportingMode === 'student_paper'}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{exportingMode === 'student_paper' ? 'Opening...' : 'Save as PDF'}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadHtml('student_paper')}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center justify-center gap-1 py-0.5"
                    >
                      <Download className="w-3 h-3" />
                      <span>Offline HTML</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Option 2: Teacher Marking Scheme */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-teal-500/40 transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
                          Teacher Marking Scheme &amp; Answer Key
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                          Confidential Evaluator
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Complete model answers with step-wise mark distribution rubrics (+1M, +2M), Bloom's taxonomy tags, topic classification, and examiner evaluation guidance notes.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => handleExportPdf('marking_scheme')}
                      disabled={exportingMode === 'marking_scheme'}
                      className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{exportingMode === 'marking_scheme' ? 'Opening...' : 'Save as PDF'}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadHtml('marking_scheme')}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center justify-center gap-1 py-0.5"
                    >
                      <Download className="w-3 h-3" />
                      <span>Offline HTML</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Option 3: Complete Examination Bundle */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-blue-500/40 transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          Complete Exam &amp; Evaluation Bundle
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                          Archival Master
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Full Student Question Paper followed immediately by the complete Teacher Marking Scheme, cleanly divided with an authentic page break.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => handleExportPdf('complete_bundle')}
                      disabled={exportingMode === 'complete_bundle'}
                      className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{exportingMode === 'complete_bundle' ? 'Opening...' : 'Save as PDF'}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadHtml('complete_bundle')}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center justify-center gap-1 py-0.5"
                    >
                      <Download className="w-3 h-3" />
                      <span>Offline HTML</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Printing Tips Footer */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-3 text-xs text-slate-400">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-slate-200">Pro Tip for Best Vector Quality:</strong> In the browser print dialog, choose <code className="text-emerald-400">Destination: Save as PDF</code>, select <code className="text-emerald-400">Paper size: A4</code>, and ensure <code className="text-emerald-400">Background graphics</code> is enabled.
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
