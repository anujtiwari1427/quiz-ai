import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  Users, 
  FileText, 
  Upload, 
  Globe, 
  Lightbulb, 
  Video, 
  Layers, 
  RotateCw, 
  ChevronRight, 
  Check, 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Brain, 
  BookOpen, 
  Star, 
  ChevronDown, 
  Flame, 
  Clock, 
  BarChart3, 
  Cpu, 
  Lock,
  Play,
  RotateCcw,
  Zap,
  HelpCircle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { PDF_EXPORT_SERVICE } from '../../services/pdfExportService';
import { AI_PAPER_SERVICE } from '../../services/aiPaperService';
import { AiGeneratedPaper, BoardType } from '../../types';

// Preset generator topics matching Quizgecko popular subjects
interface PresetTopic {
  label: string;
  topic: string;
  subject: string;
  grade: number;
  board: BoardType;
  icon: string;
}

const PRESET_TOPICS: PresetTopic[] = [
  { label: '⚡ CBSE 10 Physics: Light & Optics', topic: 'Light - Reflection, Refraction, Lens Formula & Mirrors', subject: 'Science (Physics)', grade: 10, board: 'CBSE', icon: '⚡' },
  { label: '📐 Class 10 Math: Triangles BPT', topic: 'Triangles - Theorem 6.1 Basic Proportionality & Similarity', subject: 'Mathematics', grade: 10, board: 'CBSE', icon: '📐' },
  { label: '🧬 Biology: Life Processes & Heart', topic: 'Human Circulatory System, Blood Pressure & Double Circulation', subject: 'Science (Biology)', grade: 10, board: 'CBSE', icon: '🧬' },
  { label: '⚛️ Chemistry: Chemical Reactions', topic: 'Types of Chemical Reactions, Oxidation-Reduction & Balancing', subject: 'Science (Chemistry)', grade: 10, board: 'CBSE', icon: '⚛️' },
  { label: '📜 History: Nationalism in Europe', topic: 'French Revolution, Romanticism & Unification of Germany and Italy', subject: 'Social Science', grade: 10, board: 'CBSE', icon: '📜' },
];

// Interactive Quiz Questions Pool
const SAMPLE_QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'A concave mirror of focal length 15 cm produces a real image twice the size of the object. What is the object distance (u)?',
    options: [
      { id: 'A', text: 'u = -22.5 cm' },
      { id: 'B', text: 'u = -30.0 cm' },
      { id: 'C', text: 'u = -7.5 cm' },
      { id: 'D', text: 'u = -15.0 cm' },
    ],
    correctId: 'A',
    explanation: 'For a real and inverted image, magnification m = -v/u = -2, so v = 2u. Using the mirror formula: 1/f = 1/v + 1/u => 1/(-15) = 1/(2u) + 1/u = 3/(2u). Solving gives 2u = -45 => u = -22.5 cm.',
    bloom: 'Apply & Calculate (L3)',
    marks: 3,
    topic: 'Light — Reflection & Refraction'
  },
  {
    id: 'q2',
    question: 'In the human heart, why is the muscular wall of the left ventricle significantly thicker than that of the right ventricle?',
    options: [
      { id: 'A', text: 'Because it pumps blood through the systemic circulation against high resistance to all body organs.' },
      { id: 'B', text: 'Because it receives deoxygenated blood directly from the vena cava.' },
      { id: 'C', text: 'To prevent the backflow of blood into the left atrium during diastole.' },
      { id: 'D', text: 'Because it generates lower hydrostatic pressure compared to the pulmonary artery.' },
    ],
    correctId: 'A',
    explanation: 'The left ventricle must generate enough contractile force to pump oxygenated blood throughout the entire systemic circulation against high vascular resistance, requiring a thicker myocardium compared to the right ventricle which only supplies the nearby lungs.',
    bloom: 'Analyze & Reason (L4)',
    marks: 2,
    topic: 'Life Processes — Circulation'
  },
  {
    id: 'q3',
    question: 'Which of the following conditions is required for the Basic Proportionality Theorem (Thales Theorem) in triangle ABC?',
    options: [
      { id: 'A', text: 'A line must be drawn parallel to one side intersecting the other two sides in distinct points.' },
      { id: 'B', text: 'The triangle must be an equilateral or right-angled triangle.' },
      { id: 'C', text: 'The line must bisect the angle opposite to the base.' },
      { id: 'D', text: 'The area of the upper triangle must be equal to half the trapezoid area.' },
    ],
    correctId: 'A',
    explanation: 'Theorem 6.1 (BPT) states: If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio.',
    bloom: 'Remember & Understand (L2)',
    marks: 1,
    topic: 'Triangles — Geometric Proofs'
  }
];

// Interactive Flashcards Pool
const SAMPLE_FLASHCARDS = [
  {
    id: 'fc1',
    front: 'Mirror Formula & Magnification Relation',
    back: 'Formula: 1/f = 1/v + 1/u\nMagnification: m = -v/u = h\'/h\nKey Rule: Concave mirror has negative focal length (f < 0).',
    topic: 'Physics Optics',
    difficulty: 'Medium'
  },
  {
    id: 'fc2',
    front: 'Why does ventricular septum prevent mixing of oxygenated & deoxygenated blood?',
    back: 'It enables high metabolic efficiency required for warm-blooded homeotherms (birds and mammals) to maintain constant body temperature.',
    topic: 'Biology Circulation',
    difficulty: 'Easy'
  },
  {
    id: 'fc3',
    front: 'State Ohm\'s Law and its mathematical boundary conditions',
    back: 'V = I · R (provided physical conditions such as temperature and pressure remain constant). Graph of V vs I is linear through origin.',
    topic: 'Electricity',
    difficulty: 'Medium'
  }
];

export const MarketingLanding: React.FC = () => {
  const { setCurrentView, setUserRole, startExamRunner } = useApp();

  // Generator Box state
  const [activeInputTab, setActiveInputTab] = useState<'text' | 'file' | 'url' | 'topic' | 'youtube'>('topic');
  const [topicInput, setTopicInput] = useState('Light - Reflection, Refraction, Lens Formula & Mirrors');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  
  // Generator Configuration parameters
  const [questionType, setQuestionType] = useState<'all' | 'mcq' | 'short' | 'case'>('all');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'adaptive'>('medium');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [targetBoard, setTargetBoard] = useState<BoardType>('CBSE');

  // Generator Loading animation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  // Showcase Tabs (Underneath the generator)
  const [showcaseTab, setShowcaseTab] = useState<'quiz' | 'flashcards' | 'blueprint' | 'proctor'>('quiz');

  // Interactive Quiz State
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizScore, setQuizScore] = useState(0);
  const [hasAnswered, setHasAnswered] = useState<Record<number, boolean>>({});

  // Interactive Flashcards State
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [flashcardRatings, setFlashcardRatings] = useState<Record<number, string>>({});

  // Pricing Toggle
  const [pricingCycle, setPricingCycle] = useState<'monthly' | 'annual'>('annual');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activeQuestion = SAMPLE_QUIZ_QUESTIONS[activeQuestionIdx];
  const activeCard = SAMPLE_FLASHCARDS[flashcardIdx];

  const handleSelectPreset = (preset: PresetTopic) => {
    setTopicInput(preset.topic);
    setTargetBoard(preset.board);
    setActiveInputTab('topic');
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleAnswerSelect = (optionId: string) => {
    if (hasAnswered[activeQuestionIdx]) return;

    const isCorrect = optionId === activeQuestion.correctId;
    setSelectedAnswers(prev => ({ ...prev, [activeQuestionIdx]: optionId }));
    setHasAnswered(prev => ({ ...prev, [activeQuestionIdx]: true }));

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      triggerConfetti();
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIdx < SAMPLE_QUIZ_QUESTIONS.length - 1) {
      setActiveQuestionIdx(prev => prev + 1);
    } else {
      setActiveQuestionIdx(0);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(15);
    setGenerationStep('Analyzing syllabus blueprint & learning objectives...');

    setTimeout(() => {
      setGenerationProgress(45);
      setGenerationStep('Synthesizing high-yield questions & Bloom\'s Taxonomy rubrics...');
    }, 400);

    setTimeout(() => {
      setGenerationProgress(80);
      setGenerationStep('Constructing interactive spaced-repetition SM-2 flashcard deck...');
    }, 850);

    setTimeout(() => {
      setGenerationProgress(100);
      setGenerationStep('Complete! Instant assessment ready.');
      setIsGenerating(false);
      triggerConfetti();
      // Scroll to showcase
      const el = document.getElementById('qg-preview-showcase');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 1300);
  };

  // Keyboard shortcut listener (Cmd + Enter or Ctrl + Enter to generate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f8fafc] overflow-hidden aurora-bg">
      
      {/* Background Aurora Mesh & Fine Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-emerald-500/15 via-indigo-600/10 to-transparent blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 blur-[170px] pointer-events-none rounded-full" />
      <div className="absolute top-[65%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[170px] pointer-events-none rounded-full" />

      {/* ──────────────────────────────────────────────────────────
          HERO SECTION (Quizgecko Signature Master Headline & Generator)
          ────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        
        {/* Floating Social Proof Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] mb-6 backdrop-blur-2xl">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <span className="text-xs font-semibold text-slate-200">
            Next-Gen AI Quiz &amp; Exam Studio • <strong className="text-emerald-300 font-bold">3,000,000+</strong> Generated
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-500" />
          <div className="flex items-center text-amber-400 text-xs gap-0.5">
            {'★'.repeat(5)}
            <span className="ml-1 text-[11px] font-bold text-slate-200">4.9/5</span>
          </div>
        </div>

        {/* Hero Headline */}
        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white max-w-5xl mx-auto leading-[1.08] mb-6">
          Turn Any Content into <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Board-Accurate Quizzes
          </span> &amp; Flashcards
        </h1>

        {/* Sub-headline */}
        <p className="text-base sm:text-xl text-slate-300/90 max-w-3xl mx-auto leading-relaxed mb-8 font-normal">
          The ultimate AI assessment studio. Ingest textbook PDFs, notes, YouTube lectures, or any syllabus topic. Synthesize curriculum-aligned exams, active recall flashcards, and official marking rubrics with zero manual effort.
        </p>

        {/* Hero Trust Micro-Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-400 mb-10">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">100% CBSE &amp; ICSE Aligned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 font-medium">&lt; 15s AI Generation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Printer className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-medium">1-Click Print &amp; PDF Export</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300 font-medium">DPDP Act 2023 Compliant</span>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────
            QUIZGECKO MULTI-INPUT GENERATOR STUDIO (Hero Centerpiece)
            ────────────────────────────────────────────────────────── */}
        <div id="qg-generator-box" className="rounded-3xl p-5 sm:p-8 max-w-3xl mx-auto text-left shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative mb-14 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-[#070b14] border border-white/[0.12] backdrop-blur-2xl">
          
          {/* Input Mode Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 border border-white/10 mb-6">
            <button
              onClick={() => setActiveInputTab('topic')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeInputTab === 'topic'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Topic</span>
            </button>

            <button
              onClick={() => setActiveInputTab('file')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeInputTab === 'file'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${activeInputTab === 'file' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/15 text-slate-300'}`}>PDF</span>
            </button>

            <button
              onClick={() => setActiveInputTab('text')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeInputTab === 'text'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Text / Notes</span>
            </button>

            <button
              onClick={() => setActiveInputTab('url')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeInputTab === 'url'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>URL Link</span>
            </button>

            <button
              onClick={() => setActiveInputTab('youtube')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeInputTab === 'youtube'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>YouTube</span>
            </button>
          </div>

          {/* Dynamic Input Zone */}
          <div className="mb-6">
            {activeInputTab === 'topic' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-200">
                    Enter Subject, Chapter or Syllabus Topic
                  </label>
                  <span className="text-[11px] text-emerald-400 font-medium">Auto-mapped to Curriculum</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="e.g. Human Heart Circulation, Class 10 Light & Optics, Triangles BPT Theorem..."
                    className="w-full px-4 py-4 rounded-2xl bg-[#090d18] border border-white/15 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/25 text-white placeholder-slate-500 text-sm outline-none transition-all shadow-inner"
                  />
                  {topicInput && (
                    <button
                      onClick={() => setTopicInput('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded bg-white/10"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Instant Quick Topic Chips */}
                <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-semibold mr-1">Popular Blueprints:</span>
                  {PRESET_TOPICS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(preset)}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/30 border border-white/[0.08] text-[11px] font-medium text-slate-300 transition-all active:scale-95"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeInputTab === 'file' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-200">
                    Upload Notes, Slides or Textbook Chapter (PDF, DOCX)
                  </label>
                  <button
                    onClick={() => setUploadedFileName('NCERT_Class_10_Science_Optics_Ch10.pdf')}
                    className="text-[11px] text-emerald-400 hover:underline font-semibold"
                  >
                    Load Sample CBSE PDF
                  </button>
                </div>
                <div 
                  onClick={() => setUploadedFileName('NCERT_Class_10_Science_Optics_Ch10.pdf')}
                  className="border-2 border-dashed border-emerald-500/30 hover:border-emerald-400/70 rounded-2xl p-7 text-center bg-emerald-950/10 hover:bg-emerald-950/20 cursor-pointer transition-all group"
                >
                  <Upload className="w-9 h-9 mx-auto text-emerald-400 group-hover:scale-110 mb-2 transition-transform" />
                  <p className="text-sm font-bold text-white mb-1">
                    {uploadedFileName ? (
                      <span className="text-emerald-300 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        Ready: {uploadedFileName} (4.2 MB)
                      </span>
                    ) : (
                      'Drag & Drop lecture PDF or notes here, or click to upload'
                    )}
                  </p>
                  <p className="text-xs text-slate-400">Supports NCERT textbooks, question banks, lecture slides up to 50MB</p>
                </div>
              </div>
            )}

            {activeInputTab === 'text' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-200">
                    Paste Lecture Notes, Chapter Excerpt or Transcript
                  </label>
                  <button
                    onClick={() => setTextInput("Light reflection and refraction: Concave mirror focal length f is negative. Mirror formula: 1/f = 1/v + 1/u. Magnification m = -v/u. Snell's law of refraction: sin(i)/sin(r) = constant = n21. Power of lens P = 1/f(in meters), unit is Diopter (D).")}
                    className="text-[11px] text-emerald-400 hover:underline font-semibold"
                  >
                    Paste Sample Study Notes
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste your study notes, textbook paragraphs, or syllabus bullet points here..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#090d18] border border-white/15 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/25 text-white placeholder-slate-500 text-xs sm:text-sm outline-none transition-all resize-none shadow-inner"
                />
              </div>
            )}

            {activeInputTab === 'url' && (
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  Enter Web Article, Wikipedia or Online Study Material URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://en.wikipedia.org/wiki/Photosynthesis"
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-[#090d18] border border-white/15 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/25 text-white placeholder-slate-500 text-sm outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
            )}

            {activeInputTab === 'youtube' && (
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  Paste Educational YouTube Lecture URL
                </label>
                <div className="relative">
                  <Video className="w-4 h-4 text-rose-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-[#090d18] border border-white/15 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/25 text-white placeholder-slate-500 text-sm outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Configuration Options Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-white/10 mb-6">
            {/* Question Type */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider font-mono">Format</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0b101e] border border-white/15 text-xs text-white outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-medium cursor-pointer"
              >
                <option value="all">MCQ + Short Answer</option>
                <option value="mcq">MCQ Only</option>
                <option value="short">Short &amp; Long Answer</option>
                <option value="case">Case Study &amp; Assertion</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider font-mono">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0b101e] border border-white/15 text-xs text-white outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-medium cursor-pointer"
              >
                <option value="adaptive">Adaptive AI (Smart)</option>
                <option value="medium">Medium (Board Standard)</option>
                <option value="easy">Easy (Foundational)</option>
                <option value="hard">Hard (Exemplar / JEE)</option>
              </select>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider font-mono">Count</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0b101e] border border-white/15 text-xs text-white outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-medium cursor-pointer"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>

            {/* Curriculum / Board */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider font-mono">Curriculum</label>
              <select
                value={targetBoard}
                onChange={(e) => setTargetBoard(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0b101e] border border-white/15 text-xs text-white outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-medium cursor-pointer"
              >
                <option value="CBSE">CBSE Class 10/12</option>
                <option value="ICSE">ICSE / ISC Board</option>
                <option value="State Board (Maharashtra)">Maharashtra State</option>
                <option value="State Board (Karnataka)">Karnataka State</option>
                <option value="State Board (Tamil Nadu)">Tamil Nadu State</option>
              </select>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px]">⌘ / Ctrl</span>
              <span>+</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px]">Enter</span>
              <span>to generate anytime</span>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto relative group overflow-hidden px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_40px_rgba(16,185,129,0.55)] transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 text-slate-950 animate-spin" />
                  <span>Synthesizing Board Assessment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Generate Quiz &amp; Flashcards</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Loading Progress Bar */}
          {isGenerating && (
            <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  {generationStep}
                </span>
                <span className="font-mono text-[#34d399] font-bold">{generationProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00b87c] to-[#06b6d4] transition-all duration-300 ease-out" 
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ──────────────────────────────────────────────────────────
            QUIZGECKO INTERACTIVE PLAYGROUND SHOWCASE (Live Demo)
            ────────────────────────────────────────────────────────── */}
        <div id="qg-preview-showcase" className="max-w-4xl mx-auto text-left pt-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-bold text-[#00b87c] uppercase tracking-wider font-mono">
                Live Interactive Experience
              </span>
              <h2 className="font-display font-bold text-2xl text-white mt-1">
                Study &amp; Test Engine Preview
              </h2>
            </div>

            {/* Showcase Mode Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900 border border-white/10 shrink-0">
              <button
                onClick={() => setShowcaseTab('quiz')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  showcaseTab === 'quiz' ? 'bg-[#00b87c] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Quiz Player</span>
              </button>

              <button
                onClick={() => setShowcaseTab('flashcards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  showcaseTab === 'flashcards' ? 'bg-[#00b87c] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Flashcards (SM-2)</span>
              </button>

              <button
                onClick={() => setShowcaseTab('blueprint')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  showcaseTab === 'blueprint' ? 'bg-[#00b87c] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Board Paper</span>
              </button>

              <button
                onClick={() => setShowcaseTab('proctor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  showcaseTab === 'proctor' ? 'bg-[#00b87c] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Anti-Cheat HUD</span>
              </button>
            </div>
          </div>

          {/* 1. QUIZ PLAYER MODE */}
          {showcaseTab === 'quiz' && (
            <div className="gradient-qg-card rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-white/10">
              
              {/* Question Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-[#34d399] font-mono text-xs font-bold">
                    Question {activeQuestionIdx + 1} of {SAMPLE_QUIZ_QUESTIONS.length}
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    {activeQuestion.topic}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    {activeQuestion.bloom}
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    Score: <strong className="text-[#34d399]">{quizScore}</strong> / {SAMPLE_QUIZ_QUESTIONS.length}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed mb-6">
                {activeQuestion.question}
              </h3>

              {/* Options Grid */}
              <div className="space-y-3 mb-6">
                {activeQuestion.options.map((opt) => {
                  const isSelected = selectedAnswers[activeQuestionIdx] === opt.id;
                  const answered = hasAnswered[activeQuestionIdx];
                  const isCorrect = opt.id === activeQuestion.correctId;

                  let optClass = 'qg-quiz-option';
                  if (answered) {
                    if (isCorrect) optClass += ' correct';
                    else if (isSelected && !isCorrect) optClass += ' incorrect';
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleAnswerSelect(opt.id)}
                      className={optClass}
                    >
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        answered && isCorrect 
                          ? 'bg-emerald-500 text-white' 
                          : answered && isSelected && !isCorrect
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/10 text-slate-300'
                      }`}>
                        {opt.id}
                      </div>
                      <span className="text-sm font-medium text-slate-200 grow">
                        {opt.text}
                      </span>
                      {answered && isCorrect && (
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {answered && isSelected && !isCorrect && (
                        <X className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Reveal Box */}
              {hasAnswered[activeQuestionIdx] && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs sm:text-sm text-slate-200 mb-6 animate-fade-in">
                  <div className="font-bold text-[#34d399] flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Step-by-Step Rationale:</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    {activeQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Quiz Footer Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setHasAnswered({});
                    setQuizScore(0);
                    setActiveQuestionIdx(0);
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleNextQuestion}
                    className="btn-qg-cta px-4 py-2 text-xs font-bold"
                  >
                    <span>{activeQuestionIdx < SAMPLE_QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Restart Quiz'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setUserRole('student');
                      setCurrentView('create-exam');
                    }}
                    className="btn-qg-secondary px-4 py-2 text-xs font-bold"
                  >
                    <span>Take Full Exam</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. FLASHCARD STUDIO MODE (SM-2 Spaced Repetition) */}
          {showcaseTab === 'flashcards' && (
            <div className="gradient-qg-card rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-white/10">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                    Card {flashcardIdx + 1} of {SAMPLE_FLASHCARDS.length}
                  </span>
                  <span className="text-xs text-slate-400">
                    {activeCard.topic}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="font-bold">SM-2 Spaced Recall</span>
                </div>
              </div>

              {/* 3D Flip Card Container */}
              <div 
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="perspective-1000 min-h-[220px] sm:min-h-[260px] cursor-pointer mb-6"
              >
                <div className={`relative w-full h-full min-h-[220px] sm:min-h-[260px] rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-transform duration-500 transform-style-3d border ${
                  isCardFlipped 
                    ? 'bg-gradient-to-br from-indigo-950/60 to-slate-900 border-indigo-500/40 rotate-y-180' 
                    : 'bg-gradient-to-br from-slate-900 to-slate-800/90 border-white/15'
                }`}>
                  {!isCardFlipped ? (
                    <>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="uppercase tracking-wider font-mono text-[10px]">Prompt / Term</span>
                        <span className="text-[11px] text-indigo-400 font-semibold">Click to Flip (Space)</span>
                      </div>
                      <div className="my-auto">
                        <h4 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                          {activeCard.front}
                        </h4>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Difficulty: {activeCard.difficulty}
                      </div>
                    </>
                  ) : (
                    <div className="rotate-y-180 flex flex-col justify-between h-full">
                      <div className="flex items-center justify-between text-xs text-indigo-300">
                        <span className="uppercase tracking-wider font-mono text-[10px]">Active Recall Answer</span>
                        <span className="text-[11px] text-indigo-400 font-semibold">Click to flip back</span>
                      </div>
                      <div className="my-auto">
                        <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed whitespace-pre-line">
                          {activeCard.back}
                        </p>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono">
                        Memory interval updated with SM-2
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SM-2 Spaced Repetition Rating Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <button
                  onClick={() => {
                    setFlashcardRatings(prev => ({ ...prev, [flashcardIdx]: 'again' }));
                    if (flashcardIdx < SAMPLE_FLASHCARDS.length - 1) setFlashcardIdx(prev => prev + 1);
                    setIsCardFlipped(false);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all"
                >
                  🔴 Again (&lt;1 min)
                </button>

                <button
                  onClick={() => {
                    setFlashcardRatings(prev => ({ ...prev, [flashcardIdx]: 'hard' }));
                    if (flashcardIdx < SAMPLE_FLASHCARDS.length - 1) setFlashcardIdx(prev => prev + 1);
                    setIsCardFlipped(false);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
                >
                  🟠 Hard (1 day)
                </button>

                <button
                  onClick={() => {
                    setFlashcardRatings(prev => ({ ...prev, [flashcardIdx]: 'good' }));
                    if (flashcardIdx < SAMPLE_FLASHCARDS.length - 1) setFlashcardIdx(prev => prev + 1);
                    setIsCardFlipped(false);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all"
                >
                  🟢 Good (3 days)
                </button>

                <button
                  onClick={() => {
                    setFlashcardRatings(prev => ({ ...prev, [flashcardIdx]: 'easy' }));
                    if (flashcardIdx < SAMPLE_FLASHCARDS.length - 1) setFlashcardIdx(prev => prev + 1);
                    setIsCardFlipped(false);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all"
                >
                  🔵 Easy (7 days)
                </button>
              </div>
            </div>
          )}

          {/* 3. BOARD PAPER & BLUEPRINT MODE */}
          {showcaseTab === 'blueprint' && (
            <div className="gradient-qg-card rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-white/10">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3 mb-6">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[11px] font-bold">
                    Official CBSE 2026 Format
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                    Class 10 Science — Board Blueprint &amp; Marking Scheme
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const paper = AI_PAPER_SERVICE.getDefaultSeedPapers()[0];
                      PDF_EXPORT_SERVICE.generateAndPrintPaperPdf(paper, 'student_paper');
                    }}
                    className="btn-qg-secondary px-3.5 py-1.5 text-xs font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserRole('teacher');
                      setCurrentView('ai-paper-gen');
                    }}
                    className="btn-qg-cta px-3.5 py-1.5 text-xs font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Blueprint Studio</span>
                  </button>
                </div>
              </div>

              {/* Sections Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span>Section A (Objective &amp; Assertion)</span>
                    <span className="font-mono text-emerald-400">20 Marks</span>
                  </div>
                  <p className="text-[11px] text-slate-400">20 questions of 1 mark each (16 MCQs + 4 Assertion-Reasoning).</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span>Section B (Short Answer I)</span>
                    <span className="font-mono text-emerald-400">12 Marks</span>
                  </div>
                  <p className="text-[11px] text-slate-400">6 questions of 2 marks each. Requires precise scientific steps.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span>Section C (Short Answer II)</span>
                    <span className="font-mono text-emerald-400">21 Marks</span>
                  </div>
                  <p className="text-[11px] text-slate-400">7 questions of 3 marks each. Diagram synthesis and calculations.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span>Section D (Case-Based Competency)</span>
                    <span className="font-mono text-emerald-400">12 Marks</span>
                  </div>
                  <p className="text-[11px] text-slate-400">3 integrated case assessments with sub-parts based on real phenomena.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 flex items-center justify-between">
                <span>Total Marks: <strong>80 Marks</strong> • Duration: <strong>180 Minutes</strong></span>
                <span className="text-[#34d399] font-bold">100% NEP 2020 &amp; CBSE Aligned</span>
              </div>
            </div>
          )}

          {/* 4. LIVE PROCTORING & ANTI-CHEAT HUD MODE */}
          {showcaseTab === 'proctor' && (
            <div className="gradient-qg-card rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-white/10">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-bold">
                    Real-Time Telemetry HUD
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                    AI Integrity &amp; Gaze Telemetry Simulator
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Integrity: 99.4% (Secure)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="p-4 rounded-xl bg-slate-900 border border-white/10">
                  <span className="text-slate-400 text-xs">Eye Tracking</span>
                  <div className="text-lg font-bold text-white mt-1">Focused On-Screen</div>
                  <span className="text-[10px] text-emerald-400">0 Gaze Deviations</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-white/10">
                  <span className="text-slate-400 text-xs">Browser Sandbox</span>
                  <div className="text-lg font-bold text-white mt-1">Active Lock</div>
                  <span className="text-[10px] text-emerald-400">0 Tab-Switches</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-white/10">
                  <span className="text-slate-400 text-xs">Acoustic Sensor</span>
                  <div className="text-lg font-bold text-white mt-1">18 dB (Quiet)</div>
                  <span className="text-[10px] text-emerald-400">No Human Speech Detected</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setUserRole('teacher');
                    setCurrentView('teacher');
                  }}
                  className="btn-qg-cta px-4 py-2 text-xs font-bold"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Open Teacher Proctoring Console</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          STATS & TRUST MARQUEE
          ────────────────────────────────────────────────────────── */}
      <section className="py-14 border-y border-white/10 bg-[#060a14]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                3,000,000+
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Quizzes &amp; Tests Created</p>
            </div>
            <div>
              <div className="font-display font-extrabold text-3xl sm:text-4xl text-emerald-400">
                4.9 / 5.0
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Rating from 5,000+ Reviews</p>
            </div>
            <div>
              <div className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                99.8%
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Board &amp; Syllabus Accuracy</p>
            </div>
            <div>
              <div className="font-display font-extrabold text-3xl sm:text-4xl text-teal-300">
                80%
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Exam Prep Time Saved</p>
            </div>
          </div>

          {/* Institutional Trust Marquee */}
          <div className="mt-10 pt-8 border-t border-white/[0.08] text-center">
            <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-6">
              Adopted by educators from India's premier schools &amp; coaching institutes
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
              <div className="flex items-center gap-2 font-display font-bold text-slate-300 text-sm sm:text-base">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">D</span>
                <span>DPS R.K. Puram</span>
              </div>
              <div className="flex items-center gap-2 font-display font-bold text-slate-300 text-sm sm:text-base">
                <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-black">K</span>
                <span>Kendriya Vidyalaya</span>
              </div>
              <div className="flex items-center gap-2 font-display font-bold text-slate-300 text-sm sm:text-base">
                <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-black">A</span>
                <span>Allen Career Institute</span>
              </div>
              <div className="flex items-center gap-2 font-display font-bold text-slate-300 text-sm sm:text-base">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-black">F</span>
                <span>FIITJEE Network</span>
              </div>
              <div className="flex items-center gap-2 font-display font-bold text-slate-300 text-sm sm:text-base">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-black">D</span>
                <span>DAV Public Schools</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          BENTO GRID FEATURE SHOWCASE
          ────────────────────────────────────────────────────────── */}
      <section id="qg-features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
            State-of-the-Art Assessment Engineering
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white mt-2">
            Engineered for Academic Excellence
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Every feature is fine-tuned to curriculum blueprints, cognitive recall psychology, and exam integrity standards.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Large 2-column Card (Dual-Engine Board Blueprints) */}
          <div className="md:col-span-2 rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-white/10 hover:border-emerald-500/40 transition-all shadow-xl group relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Brain className="w-5 h-5" />
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-mono font-bold">
                  Curriculum Engine
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white mb-2">
                100% CBSE, ICSE &amp; State Board Syllabus Mapping
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl mb-6">
                Unlike generic LLMs, QuizPulse synthesizes question papers strictly cross-referenced against official NCERT chapter weightages, Bloom’s cognitive taxonomy levels, and step-by-step marking rubrics.
              </p>

              {/* Visual Bloom's Taxonomy Distribution Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="text-xs text-slate-400">Remember (L1)</div>
                  <div className="text-lg font-bold text-white mt-0.5">20%</div>
                  <div className="text-[10px] text-emerald-400">Knowledge recall</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="text-xs text-slate-400">Understand (L2)</div>
                  <div className="text-lg font-bold text-white mt-0.5">30%</div>
                  <div className="text-[10px] text-cyan-400">Conceptual grasp</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="text-xs text-slate-400">Apply &amp; Calc (L3)</div>
                  <div className="text-lg font-bold text-white mt-0.5">35%</div>
                  <div className="text-[10px] text-indigo-400">Numerical &amp; Proof</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="text-xs text-slate-400">Analyze (L4/L5)</div>
                  <div className="text-lg font-bold text-white mt-0.5">15%</div>
                  <div className="text-[10px] text-purple-400">HOTS &amp; Case Study</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: SM-2 Spaced Repetition Flashcards */}
          <div className="rounded-3xl p-7 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/30 border border-white/10 hover:border-indigo-500/40 transition-all shadow-xl group flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Layers className="w-5 h-5" />
                </span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-mono font-bold">
                  Active Recall
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                SM-2 Spaced Repetition Decks
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Automated memory scheduling prevents forgetting curves. Review intervals adapt mathematically to your mastery speed.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">Average Retention:</span>
              <span className="font-mono text-emerald-400 font-bold">92.4% at Day 30</span>
            </div>
          </div>

          {/* Card 3: 1-Click Print & PDF Export */}
          <div className="rounded-3xl p-7 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-cyan-950/30 border border-white/10 hover:border-cyan-500/40 transition-all shadow-xl group flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Printer className="w-5 h-5" />
                </span>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono font-bold">
                  Print-Ready
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Instant PDF &amp; Answer Keys
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Export dual-column exam papers formatted with school watermarks, student bubble answer sheets, and complete teacher rubrics.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">Export formats:</span>
              <span className="font-mono text-cyan-400 font-bold">PDF • DOCX • QR</span>
            </div>
          </div>

          {/* Card 4: Anti-Cheat & Live Proctor HUD */}
          <div className="rounded-3xl p-7 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-rose-950/30 border border-white/10 hover:border-rose-500/40 transition-all shadow-xl group flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-mono font-bold">
                  Anti-Cheat Telemetry
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Live Proctoring HUD
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Client-side eye gaze orientation, full-screen browser lockdown, and tab-switch telemetry ensuring complete exam integrity.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">Privacy Status:</span>
              <span className="font-mono text-emerald-400 font-bold">100% DPDP 2023 Compliant</span>
            </div>
          </div>

          {/* Card 5: Diagnostic Cognitive Mastery Radar */}
          <div className="rounded-3xl p-7 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-purple-950/30 border border-white/10 hover:border-purple-500/40 transition-all shadow-xl group flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <BarChart3 className="w-5 h-5" />
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-mono font-bold">
                  Cognitive Analytics
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Weakness Radar &amp; Insights
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Pinpoints conceptual learning gaps by sub-topic. Automatically generates targeted remedial revision sets for weak areas.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">Diagnostic precision:</span>
              <span className="font-mono text-purple-400 font-bold">Sub-concept Level</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SUBJECT EXPLORER CARDS (Quizgecko Signature Subject Grid)
          ────────────────────────────────────────────────────────── */}
      <section id="qg-disciplines" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#00b87c] uppercase tracking-wider font-mono">
            Any Subject, Any Exam
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-1">
            Tailored AI for Every Discipline
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
            Click any subject to instantly load high-yield question synthesis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Science & Physics',
              desc: 'Optics, Thermodynamics, Kinematics, Circuits & Electromagnetism',
              icon: '⚡',
              tag: 'CBSE & ICSE',
              topic: 'Physics - Optics and Electricity'
            },
            {
              title: 'Mathematics & Calculus',
              desc: 'Triangles BPT, Trigonometry, Derivatives, Integrals & Coordinate Geometry',
              icon: '📐',
              tag: 'Class 10 & 12',
              topic: 'Mathematics - Triangles and Calculus'
            },
            {
              title: 'Medicine & Biology',
              desc: 'Human Anatomy, Cardiology, Genetics, Life Processes & Cellular Biology',
              icon: '🧬',
              tag: 'NEET & K-12',
              topic: 'Biology - Human Heart and Genetics'
            },
            {
              title: 'Social Science & History',
              desc: 'Nationalism in Europe, Constitutional Law, Geography & Economics',
              icon: '📜',
              tag: 'Board Blueprints',
              topic: 'History - The Rise of Nationalism in Europe'
            },
            {
              title: 'Engineering & Code',
              desc: 'Data Structures, Python, Computer Networks & Digital Electronics',
              icon: '💻',
              tag: 'STEM & College',
              topic: 'Computer Science - Data Structures'
            },
            {
              title: 'Languages & Literature',
              desc: 'English Grammar, Reading Comprehension, Poetic Devices & Hindi Sahitya',
              icon: '📚',
              tag: 'Multi-lingual',
              topic: 'English Literature - Comprehension and Grammar'
            }
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => {
                setTopicInput(item.topic);
                const el = document.getElementById('qg-generator-box');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-[#00b87c]/50 hover:bg-slate-900 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300 font-mono">
                  {item.tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#34d399] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          HOW IT WORKS (3 Simple Steps)
          ────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-[#00b87c] uppercase tracking-wider font-mono">
            Effortless Workflow
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-1">
            How QuizPulse Works in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="relative p-6 rounded-3xl bg-slate-900/50 border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-[#00b87c]/20 text-[#00b87c] flex items-center justify-center font-bold font-mono text-lg mx-auto mb-4 border border-[#00b87c]/30">
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Input Any Content</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Upload textbook PDFs, lecture notes, paste an article URL, or simply type your topic name.
            </p>
          </div>

          <div className="relative p-6 rounded-3xl bg-slate-900/50 border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-mono text-lg mx-auto mb-4 border border-indigo-500/30">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Synthesizes Test</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Our advanced model maps the syllabus, aligns Bloom's levels, and generates rubrics in 15 seconds.
            </p>
          </div>

          <div className="relative p-6 rounded-3xl bg-slate-900/50 border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-[#34d399]/20 text-[#34d399] flex items-center justify-center font-bold font-mono text-lg mx-auto mb-4 border border-[#34d399]/30">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Study, Test or Export</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Practice interactively with SM-2 flashcards, take timed tests with anti-cheat, or 1-click export to PDF.
            </p>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TESTIMONIALS
          ────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#00b87c] uppercase tracking-wider font-mono">
            Wall of Love
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-1">
            Loved by 3M+ Students &amp; Educators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 flex flex-col justify-between">
            <div className="text-amber-400 mb-3 text-sm">★★★★★</div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              "QuizPulse cut our examination paper creation time by over 80%. The CBSE marking rubrics and step-by-step scoring schemes are more accurate than manual faculty drafts."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-[#34d399] flex items-center justify-center font-bold text-xs">
                DK
              </div>
              <div>
                <div className="text-xs font-bold text-white">Dr. Meera Krishnan</div>
                <div className="text-[11px] text-slate-400">Head of Science, DPS R.K. Puram</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 flex flex-col justify-between">
            <div className="text-amber-400 mb-3 text-sm">★★★★★</div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              "The Spaced Repetition flashcards and instant quiz feedback transformed my NEET preparation. I memorized the entire human anatomy chapter in three days!"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                AS
              </div>
              <div>
                <div className="text-xs font-bold text-white">Ananya Sharma</div>
                <div className="text-[11px] text-slate-400">NEET Aspirant, Delhi</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 flex flex-col justify-between">
            <div className="text-amber-400 mb-3 text-sm">★★★★★</div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              "The live proctoring HUD and camera telemetry gives us complete exam integrity during remote assessments. It's the gold standard for coaching institutes."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                VR
              </div>
              <div>
                <div className="text-xs font-bold text-white">Prof. Vikram Rao</div>
                <div className="text-[11px] text-slate-400">Academic Director, Apex Academy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          PRICING PLANS (Quizgecko-style Pricing Table)
          ────────────────────────────────────────────────────────── */}
      <section id="qg-pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#00b87c] uppercase tracking-wider font-mono">
            Transparent Pricing
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-1">
            Simple, Predictable Plans
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">
            Start free, upgrade anytime as your assessment needs grow.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-white/10 mt-6">
            <button
              onClick={() => setPricingCycle('monthly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pricingCycle === 'monthly' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPricingCycle('annual')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pricingCycle === 'annual' ? 'bg-[#00b87c] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Yearly</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/30 text-white font-mono font-bold">SAVE 25%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Starter Plan */}
          <div className="p-7 rounded-3xl bg-slate-900/60 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Starter Free</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">₹0</span>
                <span className="text-xs text-slate-400">/ forever</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 mb-6">Perfect for individual students practicing daily questions.</p>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 10 AI Quizzes / month</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Spaced Repetition Flashcards</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> PDF &amp; Text ingestion</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Instant Step-by-Step AI Explanations</div>
              </div>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('qg-generator-box');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-8 btn-qg-secondary w-full py-2.5 text-xs font-bold"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Student Plan (Featured) */}
          <div className="p-7 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/40 border-2 border-[#00b87c] shadow-2xl relative flex flex-col justify-between">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#00b87c] text-white font-bold text-[10px] tracking-wider uppercase font-mono shadow-md">
              Most Popular
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#34d399] font-mono">Student Pro</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {pricingCycle === 'annual' ? '₹499' : '₹699'}
                </span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 mb-6">Unlimited quizzes, board test series, and advanced analytics.</p>

              <div className="space-y-2.5 text-xs text-slate-200">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Unlimited</strong> AI Quizzes &amp; Tests</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Complete CBSE / ICSE Blueprint Papers</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> YouTube &amp; URL to Test Generator</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Download &amp; Print Clean PDFs</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Negative Marking &amp; Time Analysis</div>
              </div>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('qg-generator-box');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-8 btn-qg-cta w-full py-2.5 text-xs font-bold"
            >
              Start 7-Day Free Trial
            </button>
          </div>

          {/* Teacher & Institution Plan */}
          <div className="p-7 rounded-3xl bg-slate-900/60 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">Teacher &amp; School</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {pricingCycle === 'annual' ? '₹1,999' : '₹2,499'}
                </span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 mb-6">For educators, tutoring academies &amp; school departments.</p>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Live AI Anti-Cheat Proctoring HUD</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Smart Facial &amp; Camera Attendance</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Multi-student Roster &amp; Gradebook</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Official Board Marking Rubrics</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> LMS &amp; Google Classroom Export</div>
              </div>
            </div>

            <button
              onClick={() => {
                setUserRole('teacher');
                setCurrentView('teacher');
              }}
              className="mt-8 btn-qg-secondary w-full py-2.5 text-xs font-bold"
            >
              Open Teacher Hub
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          FAQ ACCORDION
          ────────────────────────────────────────────────────────── */}
      <section id="qg-faq" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/10">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#00b87c] uppercase tracking-wider font-mono">
            Got Questions?
          </span>
          <h2 className="font-display font-extrabold text-3xl text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does QuizPulse generate quizzes and flashcards from text or PDFs?',
              a: 'Our AI engine analyzes your uploaded document, extracts key concepts, definitions, and equations, and cross-references them with official educational curriculum blueprints (such as CBSE, ICSE, and state boards) to construct balanced multiple-choice, short-answer, and case-study questions with detailed solutions.'
            },
            {
              q: 'Can I print or download the generated question papers as PDF?',
              a: 'Yes! Every generated test paper can be exported with 1 click to a clean, print-ready PDF formatted with official board general instructions, section dividers, and step-by-step marking rubrics.'
            },
            {
              q: 'How does the Live Anti-Cheat Proctoring work?',
              a: 'The teacher proctoring console utilizes client-side computer vision to track user eye gaze, tab switching, and acoustic room noise during the examination without violating student privacy or recording unauthorized data.'
            },
            {
              q: 'What is the SM-2 Spaced Repetition Flashcard algorithm?',
              a: 'The SM-2 algorithm calculates the optimal time interval to review each card based on your response ratings (Again, Hard, Good, Easy), ensuring long-term active recall memory consolidation before forgetfulness occurs.'
            },
            {
              q: 'Is QuizPulse compliant with Indian DPDP Act and student privacy regulations?',
              a: 'Yes. All student rosters, marks, and examination telemetries are isolated in strict compliance with the Digital Personal Data Protection (DPDP) Act 2023 with localized storage and zero model training on student private data.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/70 border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-[#34d399] transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-3 ${
                  openFaq === idx ? 'rotate-180 text-[#00b87c]' : ''
                }`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3 animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          FINAL CTA BANNER
          ────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center mb-12">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-4">
              Ready to create your next exam in seconds?
            </h2>
            <p className="text-sm text-slate-300 mb-8 leading-relaxed">
              Join over 3,000,000+ educators, students, and institutions transforming study and testing workflows.
            </p>
            <button
              onClick={() => {
                const el = document.getElementById('qg-generator-box');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-qg-cta px-8 py-3.5 text-base font-bold shadow-2xl"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span>Create Free AI Quiz Now</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
export default MarketingLanding;
