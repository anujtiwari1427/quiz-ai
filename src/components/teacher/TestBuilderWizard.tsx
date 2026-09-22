import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Sliders, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Layers, 
  CheckCircle2,
  ListFilter,
  BarChart,
  Lock,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CURRICULUM_DATA } from '../../mock/curriculumData';
import { BoardType, Question, QuestionType, Test } from '../../types';
import { AI_SERVICE } from '../../services/aiService';
import { DocumentQuestionImporter } from './DocumentQuestionImporter';

export const TestBuilderWizard: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { createAndPublishTest, setTeacherTab } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [creationMode, setCreationMode] = useState<'ai_curriculum' | 'doc_import'>('ai_curriculum');
  const [showDocImportModal, setShowDocImportModal] = useState(false);

  // Form State
  const [testTitle, setTestTitle] = useState<string>('Unit Assessment — Term II');
  const [board, setBoard] = useState<BoardType>('CBSE');
  const [classGrade, setClassGrade] = useState<number>(10);
  const [subject, setSubject] = useState<string>('Science');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([
    'Light – Reflection and Refraction',
    'Electricity'
  ]);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);

  // Blueprint & Difficulty
  const [difficultyMix, setDifficultyMix] = useState<{ easy: number; medium: number; hard: number }>({
    easy: 30,
    medium: 50,
    hard: 20
  });

  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([
    'mcq',
    'short_answer',
    'assertion_reason',
    'long_answer'
  ]);

  // Proctoring Settings
  const [enforceFullscreen, setEnforceFullscreen] = useState(true);
  const [detectTabSwitch, setDetectTabSwitch] = useState(true);
  const [blockCopyPaste, setBlockCopyPaste] = useState(true);

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamLog, setStreamLog] = useState<string>('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  const handleQuestionsImportedFromDoc = (imported: Question[]) => {
    setGeneratedQuestions(imported);
    const chaptersInImported = Array.from(new Set(imported.map(q => q.chapter).filter(Boolean)));
    if (chaptersInImported.length > 0) {
      setSelectedChapters(chaptersInImported);
    }
    setStep(3);
  };

  const handleAppendQuestionsFromDoc = (additional: Question[]) => {
    setGeneratedQuestions(prev => [...prev, ...additional]);
    const chaptersInImported = Array.from(new Set(additional.map(q => q.chapter).filter(Boolean)));
    if (chaptersInImported.length > 0) {
      setSelectedChapters(prev => Array.from(new Set([...prev, ...chaptersInImported])));
    }
    setShowDocImportModal(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setGeneratedQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  // Get available chapters for the selected board/class/subject
  const availableChapters = (CURRICULUM_DATA[board]?.[classGrade]?.[subject] || []).map(ch => ch.name);

  const toggleChapter = (chapter: string) => {
    if (selectedChapters.includes(chapter)) {
      if (selectedChapters.length > 1) {
        setSelectedChapters(selectedChapters.filter(c => c !== chapter));
      }
    } else {
      setSelectedChapters([...selectedChapters, chapter]);
    }
  };

  const toggleQuestionType = (type: QuestionType) => {
    if (questionTypes.includes(type)) {
      if (questionTypes.length > 1) {
        setQuestionTypes(questionTypes.filter(t => t !== type));
      }
    } else {
      setQuestionTypes([...questionTypes, type]);
    }
  };

  const handleRunAiGeneration = async () => {
    setIsGenerating(true);
    setStreamLog('Initializing Claude 3.5 Sonnet Assessment Agent...');

    try {
      const questions = await AI_SERVICE.generateQuestions({
        board,
        classGrade,
        subject,
        chapters: selectedChapters,
        totalMarks: 20,
        difficultyMix,
        questionTypes,
        onStreamChunk: (chunk) => setStreamLog(chunk)
      });

      setGeneratedQuestions(questions);
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishTest = () => {
    const totalMarks = generatedQuestions.reduce((acc, q) => acc + q.marks, 0);
    const accessCode = `${subject.substring(0, 3).toUpperCase()}-${classGrade}-${Math.floor(100 + Math.random() * 900)}`;

    const newTest: Test = {
      id: `test_${Date.now()}`,
      title: testTitle,
      board,
      classGrade,
      subject,
      chapters: selectedChapters,
      totalMarks,
      durationMinutes,
      createdAt: new Date().toISOString(),
      scheduledEnd: new Date(Date.now() + 3600000 * 72).toISOString(),
      status: 'published',
      accessCode,
      shareableLink: window ? `${window.location.origin}/test/token-${accessCode.toLowerCase()}` : `http://localhost:3000/test/token-${accessCode.toLowerCase()}`,
      questions: generatedQuestions,
      blueprint: {
        chapterWeightages: selectedChapters.map(ch => ({ chapter: ch, marks: Math.round(totalMarks / selectedChapters.length) })),
        difficultyMix
      },
      proctoringSettings: {
        enforceFullscreen,
        detectTabSwitch,
        blockCopyPaste,
        maxTabSwitchesAllowed: 3
      }
    };

    createAndPublishTest(newTest);
    setStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      
      {/* Stepper Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-800 -z-0" />
          
          {[
            { num: 1, label: 'Curriculum & Board' },
            { num: 2, label: 'Blueprint & Proctoring' },
            { num: 3, label: 'AI Question Review' },
            { num: 4, label: 'Shareable Link' }
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center bg-slate-950 px-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s.num
                    ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/30'
                    : 'bg-slate-900 border border-slate-700 text-slate-400'
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-[11px] font-medium mt-2 hidden sm:block ${
                step >= s.num ? 'text-white' : 'text-slate-500'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Curriculum & Board */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-slate-800 space-y-6">
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-1">
                Step 1: Board & Curriculum Selection
              </h3>
              <p className="text-xs text-slate-400">
                Configure your target academic board, grade level, and syllabus chapters.
              </p>
            </div>

            {/* Test Title */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Test Name</label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                placeholder="e.g. Mid-Term Science Assessment"
              />
            </div>

            {/* Board Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Academic Board</label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value as BoardType)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="CBSE">CBSE (Central Board)</option>
                  <option value="ICSE">ICSE (CISCE)</option>
                  <option value="State Board (Maharashtra)">State Board (Maharashtra)</option>
                  <option value="State Board (Karnataka)">State Board (Karnataka)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Class / Grade</label>
                <select
                  value={classGrade}
                  onChange={(e) => setClassGrade(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  <option value={9}>Class 9</option>
                  <option value={10}>Class 10 (Board Exam Batch)</option>
                  <option value={12}>Class 12 (Senior Secondary)</option>
                </select>
              </div>
            </div>

            {/* Subject Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Subject</label>
              <div className="grid grid-cols-3 gap-3">
                {['Science', 'Mathematics', 'Social Science'].map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      setSubject(sub);
                      const chs = (CURRICULUM_DATA[board]?.[classGrade]?.[sub] || []).map(c => c.name);
                      setSelectedChapters(chs.slice(0, 2));
                    }}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                      subject === sub
                        ? 'bg-brand-500/10 border-brand-500 text-brand-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Assessment Creation Method Selector */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-300 block mb-2">Question Sourcing Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setCreationMode('ai_curriculum')}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer space-y-1.5 transition-all ${
                    creationMode === 'ai_curriculum'
                      ? 'bg-brand-500/10 border-brand-500/50 text-white ring-1 ring-brand-500/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-400" />
                      <span className="font-bold text-white">AI Blueprint Generator</span>
                    </div>
                    {creationMode === 'ai_curriculum' && <Check className="w-4 h-4 text-brand-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Auto-synthesize questions matching CBSE/ICSE curriculum guidelines, Bloom's cognitive taxonomy, and mark weightages.
                  </p>
                </div>

                <div
                  onClick={() => setCreationMode('doc_import')}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer space-y-1.5 transition-all ${
                    creationMode === 'doc_import'
                      ? 'bg-brand-500/10 border-brand-500/50 text-white ring-1 ring-brand-500/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white">Upload Question Paper (PDF / Word)</span>
                    </div>
                    {creationMode === 'doc_import' && <Check className="w-4 h-4 text-brand-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Import exam papers, question banks, or assignment sheets directly from PDF or Word (.docx) files or 1-click samples.
                  </p>
                </div>
              </div>
            </div>

            {/* If Doc Import mode is selected */}
            {creationMode === 'doc_import' ? (
              <div className="pt-2">
                <DocumentQuestionImporter
                  defaultBoard={board}
                  defaultGrade={classGrade}
                  defaultSubject={subject}
                  defaultChapter={selectedChapters[0] || 'Curriculum Core'}
                  targetTestTitle={testTitle}
                  onQuestionsImported={handleQuestionsImportedFromDoc}
                />
              </div>
            ) : (
              <>
                {/* Chapter Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">Select Syllabus Chapters</label>
                    <span className="text-[11px] text-brand-400">{selectedChapters.length} chapters selected</span>
                  </div>

                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {availableChapters.length > 0 ? (
                      availableChapters.map((ch) => {
                        const isSelected = selectedChapters.includes(ch);
                        return (
                          <div
                            key={ch}
                            onClick={() => toggleChapter(ch)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-brand-500/10 border-brand-500/40 text-white'
                                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span className="font-medium">{ch}</span>
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isSelected ? 'bg-brand-500 border-brand-500 text-slate-950' : 'border-slate-700'
                            }`}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 text-xs text-slate-400">
                        Defaulting to core syllabus modules for {subject}.
                      </div>
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Test Duration</span>
                  <div className="flex items-center gap-2">
                    {[30, 45, 60, 90].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDurationMinutes(mins)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          durationMinutes === mins
                            ? 'bg-brand-500 text-slate-950'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {mins} mins
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all"
                  >
                    <span>Next: Blueprint & Difficulty</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* Step 2: Blueprint & Difficulty & Proctoring */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-slate-800 space-y-6">
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-1">
                Step 2: Assessment Blueprint & Anti-Cheat Rules
              </h3>
              <p className="text-xs text-slate-400">
                Define question types, Bloom's cognitive taxonomy, and browser lockdown parameters.
              </p>
            </div>

            {/* Question Types */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Question Typologies</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'mcq', label: 'Multiple Choice (MCQ)', desc: '1 Mark • Objective' },
                  { id: 'assertion_reason', label: 'Assertion & Reason', desc: '1 Mark • NEP 2020' },
                  { id: 'short_answer', label: 'Short Answer (SA)', desc: '3 Marks • Conceptual' },
                  { id: 'long_answer', label: 'Long Answer (LA)', desc: '5 Marks • Evaluative' }
                ].map((qt) => {
                  const isChecked = questionTypes.includes(qt.id as QuestionType);
                  return (
                    <div
                      key={qt.id}
                      onClick={() => toggleQuestionType(qt.id as QuestionType)}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer space-y-1 transition-all ${
                        isChecked
                          ? 'bg-brand-500/10 border-brand-500/40 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{qt.label}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-brand-400" />}
                      </div>
                      <p className="text-[10px] text-slate-400">{qt.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Mix Slider */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">Difficulty Distribution</span>
                <span className="text-xs font-mono text-brand-400">
                  {difficultyMix.easy}% Easy / {difficultyMix.medium}% Medium / {difficultyMix.hard}% Hard
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30">
                  <span className="text-emerald-400 font-bold block">{difficultyMix.easy}% Easy</span>
                  <span className="text-[10px] text-slate-400">Recall / Knowledge</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30">
                  <span className="text-amber-400 font-bold block">{difficultyMix.medium}% Medium</span>
                  <span className="text-[10px] text-slate-400">Application / Analysis</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-rose-500/30">
                  <span className="text-rose-400 font-bold block">{difficultyMix.hard}% Hard</span>
                  <span className="text-[10px] text-slate-400">Evaluation / Creation</span>
                </div>
              </div>
            </div>

            {/* Proctoring Settings */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Live Proctoring Safeguards</label>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs cursor-pointer">
                  <div>
                    <span className="font-semibold text-white block">Enforce Fullscreen Mode</span>
                    <span className="text-[11px] text-slate-400">Student cannot view other windows without triggering a teacher flag</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enforceFullscreen}
                    onChange={(e) => setEnforceFullscreen(e.target.checked)}
                    className="w-4 h-4 accent-brand-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs cursor-pointer">
                  <div>
                    <span className="font-semibold text-white block">Real-time Tab-Switch Tracking</span>
                    <span className="text-[11px] text-slate-400">Logs active timestamps when student leaves the exam window</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={detectTabSwitch}
                    onChange={(e) => setDetectTabSwitch(e.target.checked)}
                    className="w-4 h-4 accent-brand-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs cursor-pointer">
                  <div>
                    <span className="font-semibold text-white block">Block Copy / Paste & Right Click</span>
                    <span className="text-[11px] text-slate-400">Prevents pasting external search text or LLM answers</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={blockCopyPaste}
                    onChange={(e) => setBlockCopyPaste(e.target.checked)}
                    className="w-4 h-4 accent-brand-500"
                  />
                </label>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleRunAiGeneration}
              disabled={isGenerating}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xl shadow-brand-500/25 hover:scale-[1.02] transition-all"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Blueprint Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Test with Claude 3.5 AI</span>
                </>
              )}
            </button>
          </div>

          {isGenerating && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-brand-500/30 text-xs font-mono text-brand-300 space-y-1 animate-pulse">
              <div className="flex items-center gap-2 font-bold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI Generation Telemetry:</span>
              </div>
              <p className="text-slate-300 pl-5">{streamLog}</p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: AI Question Review */}
      {step === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-white mb-1">
                  Step 3: Review & Fine-tune Generated Questions
                </h3>
                <p className="text-xs text-slate-400">
                  {generatedQuestions.length} questions generated matching {board} standards. You can edit marking schemes or regenerate individual questions.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowDocImportModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>+ Add from PDF / Word</span>
                </button>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Marks</span>
                  <span className="text-lg font-bold text-brand-400">
                    {generatedQuestions.reduce((acc, q) => acc + q.marks, 0)} M
                  </span>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {generatedQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center">
                        Q{idx + 1}
                      </span>
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {q.type.replace('_', ' ')}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{q.chapter}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                        {q.marks} Marks
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase">{q.difficulty}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-white whitespace-pre-line leading-relaxed">
                    {q.questionText}
                  </p>

                  {/* Options for MCQ */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, i) => (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                            opt.isCorrect
                              ? 'bg-brand-500/10 border-brand-500/40 text-brand-300 font-semibold'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span>{String.fromCharCode(65 + i)}. {opt.text}</span>
                          {opt.isCorrect && <Check className="w-3.5 h-3.5 text-brand-400" />}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Marking Scheme or Rubric */}
                  {q.markingScheme && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                      <span className="font-bold text-amber-400 block">Marking Scheme:</span>
                      <p className="text-slate-300 text-[11px] font-mono leading-relaxed">{q.markingScheme}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handlePublishTest}
              className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xl shadow-brand-500/25 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Assessment & Create Link</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Published & Shareable Link */}
      {step === 4 && (
        <div className="space-y-6 animate-fadeIn text-center">
          <div className="p-8 sm:p-12 rounded-3xl glass-panel-glow border-brand-500/40 space-y-6">
            <div className="relative w-16 h-16 rounded-2xl bg-white p-1.5 shadow-xl flex items-center justify-center mx-auto border border-white/30">
              <img src="/logo.png" alt="EduPulse AI Logo" className="w-13 h-13 object-contain" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                Assessment is Live!
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Students can now join directly via this secure, time-bound single-use test link.
              </p>
            </div>

            {/* Test Link Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-lg mx-auto space-y-3">
              <span className="text-xs font-semibold text-slate-400 block">Student Shareable Magic Link</span>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-brand-400 break-all">
                <span>{window ? `${window.location.origin}/test/token-sci-x-908` : 'https://edupulse.ai/test/token-sci-x-908'}</span>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window ? `${window.location.origin}/test/token-sci-x-908` : 'https://edupulse.ai/test/token-sci-x-908');
                    alert('Copied test link to clipboard!');
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Copy Link
                </button>
                <button
                  onClick={() => {
                    window.open(`https://wa.me/?text=${encodeURIComponent(`Please take your CBSE Science Assessment: ${window ? window.location.origin : ''}/test/token-sci-x-908`)}`, '_blank');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  Share on WhatsApp
                </button>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-4">
              <button
                onClick={() => setTeacherTab('proctor')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5"
              >
                <span>Open Live Proctoring Monitor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onComplete}
                className="text-xs text-slate-400 hover:text-white font-medium"
              >
                Back to Tests Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding questions via PDF/Word in Step 3 */}
      {showDocImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass rounded-3xl shadow-2xl p-6 space-y-4 animate-scale-in border border-slate-800">
            <DocumentQuestionImporter
              defaultBoard={board}
              defaultGrade={classGrade}
              defaultSubject={subject}
              defaultChapter={selectedChapters[0] || 'General Science'}
              targetTestTitle={testTitle}
              onCancel={() => setShowDocImportModal(false)}
              onQuestionsImported={handleAppendQuestionsFromDoc}
            />
          </div>
        </div>
      )}

    </div>
  );
};
