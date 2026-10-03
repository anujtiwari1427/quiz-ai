import React, { useState, useMemo, useEffect } from 'react';
import { 
  Layers, Plus, Sparkles, Clock, CheckCircle2, Play, 
  Trash2, Filter, Search, Award, HelpCircle, X, ChevronRight, 
  BookOpen, Star, History, BookmarkCheck, Eye, ShieldAlert,
  ArrowRight, Check, AlertCircle, Percent, Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QuestionSet, QuestionSetDifficulty, QuestionSetPreset, Question } from '../../types';
import { QuestionPracticeRoom } from './QuestionPracticeRoom';

export const QuestionSetsHub: React.FC = () => {
  const { 
    questionSets, 
    saveQuestionSet, 
    deleteQuestionSet, 
    questionSetAttempts,
    activeQuestionSetToPractice,
    setActiveQuestionSetToPractice,
    setCurrentView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'presets' | 'custom' | 'history'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [activePracticingSet, setActivePracticingSet] = useState<QuestionSet | null>(activeQuestionSetToPractice);
  const [previewingSet, setPreviewingSet] = useState<QuestionSet | null>(null);

  // Sync external practice triggers
  useEffect(() => {
    if (activeQuestionSetToPractice) {
      setActivePracticingSet(activeQuestionSetToPractice);
    }
  }, [activeQuestionSetToPractice]);

  // Builder Form State with comprehensive Marks Options
  const [buildTitle, setBuildTitle] = useState('');
  const [buildSubject, setBuildSubject] = useState('Science');
  const [buildChapter, setBuildChapter] = useState('');
  const [buildTopic, setBuildTopic] = useState('');
  const [buildQuestionCount, setBuildQuestionCount] = useState<number>(10);
  const [buildDifficulty, setBuildDifficulty] = useState<QuestionSetDifficulty>('medium');
  const [buildQuestionType, setBuildQuestionType] = useState<'mcq' | 'mixed' | 'short_answer'>('mcq');
  
  // Marks Options
  const [buildMarksPerQ, setBuildMarksPerQ] = useState<number>(2);
  const [buildNegativeMark, setBuildNegativeMark] = useState<number>(0.5);
  const [buildPassingPct, setBuildPassingPct] = useState<number>(40);
  const [buildTimeLimit, setBuildTimeLimit] = useState<number>(15);

  const calculatedTotalMarks = buildQuestionCount * buildMarksPerQ;
  const calculatedPassingMarks = Math.ceil(calculatedTotalMarks * (buildPassingPct / 100));

  // Quick stats
  const totalSetsCount = questionSets.length;
  const totalQuestionsInBank = questionSets.reduce((sum, s) => sum + s.questionCount, 0);
  const totalAttemptsCount = questionSetAttempts.length;
  const avgAttemptScore = questionSetAttempts.length > 0
    ? Math.round(questionSetAttempts.reduce((sum, a) => sum + a.percentage, 0) / questionSetAttempts.length)
    : 82;

  // Filtered Question Sets
  const filteredSets = useMemo(() => {
    return questionSets.filter(set => {
      const matchesSubject = selectedSubject === 'all' || set.subject.toLowerCase() === selectedSubject.toLowerCase();
      const matchesDifficulty = selectedDifficulty === 'all' || set.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchesSearch = searchQuery.trim() === '' || 
        set.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        set.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (set.chapter || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (set.topic || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === 'presets') return matchesSubject && matchesDifficulty && matchesSearch && Boolean(set.presetType);
      if (activeTab === 'custom') return matchesSubject && matchesDifficulty && matchesSearch && set.isCustom;
      return matchesSubject && matchesDifficulty && matchesSearch;
    });
  }, [questionSets, selectedSubject, selectedDifficulty, searchQuery, activeTab]);

  // Create custom set with custom marks options
  const handleCreateCustomSet = (e: React.FormEvent) => {
    e.preventDefault();

    const questions: Question[] = Array.from({ length: buildQuestionCount }).map((_, i) => ({
      id: `q_cust_${Date.now()}_${i + 1}`,
      type: buildQuestionType === 'short_answer' ? 'short_answer' : 'mcq',
      chapter: buildChapter.trim() || 'Core Chapter Fundamentals',
      topic: buildTopic.trim() || undefined,
      questionText: `Question ${i + 1} on ${buildSubject} (${buildChapter || 'General Concepts'}): Evaluate the application of standard board principles and formulate the deduction.`,
      marks: buildMarksPerQ,
      difficulty: buildDifficulty,
      bloomsLevel: buildDifficulty === 'easy' ? 'Remember' : buildDifficulty === 'medium' ? 'Apply' : 'Analyze',
      options: buildQuestionType === 'short_answer' ? undefined : [
        { id: 'opt_1', text: 'Option A: Primary theoretical condition satisfies equation', isCorrect: true },
        { id: 'opt_2', text: 'Option B: Secondary boundary condition diverges from result', isCorrect: false },
        { id: 'opt_3', text: 'Option C: Magnitude is independent of temperature parameter', isCorrect: false },
        { id: 'opt_4', text: 'Option D: Insufficient data according to standard rubric', isCorrect: false }
      ],
      correctAnswer: 'Option A: Primary theoretical condition satisfies equation',
      explanation: 'Accurate deduction follows directly from fundamental conservation principles and syllabus definitions.'
    }));

    const newSet: QuestionSet = {
      id: `qset_${Date.now()}`,
      title: buildTitle.trim() || `${buildSubject}: ${buildChapter || 'Practice Set'} (${buildQuestionCount}Q)`,
      subject: buildSubject,
      chapter: buildChapter.trim() || undefined,
      topic: buildTopic.trim() || undefined,
      difficulty: buildDifficulty,
      questionCount: buildQuestionCount,
      totalMarks: calculatedTotalMarks,
      timeLimit: buildTimeLimit,
      marksPerQuestion: buildMarksPerQ,
      negativeMarksPerWrong: buildNegativeMark,
      passingMarks: calculatedPassingMarks,
      markingSchemeTitle: `${buildMarksPerQ}M per question ${buildNegativeMark > 0 ? `(-${buildNegativeMark}M negative penalty)` : '(No negative)'}`,
      questions,
      createdAt: new Date().toISOString().split('T')[0],
      isCustom: true,
      attemptsCount: 0
    };

    saveQuestionSet(newSet);
    setIsBuilderOpen(false);
    setActivePracticingSet(newSet);
  };

  // If in practice mode, render QuestionPracticeRoom
  if (activePracticingSet) {
    return (
      <QuestionPracticeRoom
        questionSet={activePracticingSet}
        onExit={() => {
          setActivePracticingSet(null);
          setActiveQuestionSetToPractice(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in-up">
      
      {/* ── Top Hero Banner with Futuristic Glow ── */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/[0.08] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-emerald flex items-center gap-1">
                <Sparkles style={{ width: '11px', height: '11px' }} />
                <span>Smart Assessment Bank</span>
              </span>
              <span className="text-slate-400 text-xs font-mono">• Board Exam &amp; NEP 2020 Aligned</span>
              <span className="badge badge-indigo text-[10px]">Configurable Marks &amp; Negative Scoring</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
              Curated Question Sets &amp; Practice Tests
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Master every topic with timed practice sets, configurable marks schemes, negative marking penalties, and real-time synchronization to your <strong className="text-white">Marks Dashboard</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('marks')}
              className="btn-secondary text-xs py-2.5 px-4 rounded-xl flex items-center gap-2"
            >
              <Award style={{ width: '14px', height: '14px', color: '#10b981' }} />
              <span>Marks Dashboard</span>
            </button>
            <button
              onClick={() => setIsBuilderOpen(true)}
              className="btn-primary text-xs py-2.5 px-5 rounded-xl shadow-lg shadow-brand-500/25 flex items-center gap-2 hover:scale-[1.02] transition-transform"
            >
              <Plus style={{ width: '14px', height: '14px' }} />
              <span>Create Custom Set</span>
            </button>
          </div>
        </div>

        {/* Live Counters Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/[0.06]">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
            <div className="text-[11px] text-slate-400 font-medium">Available Question Sets</div>
            <div className="text-xl sm:text-2xl font-display font-black text-white mt-0.5">{totalSetsCount} Sets</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
            <div className="text-[11px] text-slate-400 font-medium">Questions in Library</div>
            <div className="text-xl sm:text-2xl font-display font-black text-emerald-400 font-mono mt-0.5">{totalQuestionsInBank}+ Qs</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
            <div className="text-[11px] text-slate-400 font-medium">Completed Attempts</div>
            <div className="text-xl sm:text-2xl font-display font-black text-indigo-400 font-mono mt-0.5">{totalAttemptsCount} Tests</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
            <div className="text-[11px] text-slate-400 font-medium">Average Performance</div>
            <div className="text-xl sm:text-2xl font-display font-black text-amber-400 font-mono mt-0.5">{avgAttemptScore}% Avg</div>
          </div>
        </div>
      </div>

      {/* ── Preset Speed Cards Strip ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[11px] text-slate-400 flex items-center gap-2">
            <span>⚡ Instant Launch Presets</span>
            <span className="text-[10px] text-slate-500 font-normal">• Click to start immediately</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Quick Sprint', count: '10 Q', marks: '20 M', time: '15m', icon: '⚡', type: 'quick', desc: '+2M Standard' },
            { label: 'Chapter Test', count: '20 Q', marks: '40 M', time: '30m', icon: '📖', type: 'chapter', desc: 'Subject Drill' },
            { label: 'Revision Sprint', count: '25 Q', marks: '50 M', time: '40m', icon: '🔄', type: 'revision', desc: 'Mixed Units' },
            { label: 'Board Blueprint', count: '50 Q', marks: '80 M', time: '60m', icon: '🎯', type: 'exam', desc: 'Full Pattern' },
            { label: 'Negative Test', count: '20 Q', marks: '40 M', time: '25m', icon: '⚖️', type: 'previous', desc: '-0.5M Penalty' },
            { label: 'High-Yield Hot', count: '15 Q', marks: '30 M', time: '20m', icon: '⭐', type: 'important', desc: 'Top Repeated' },
          ].map(preset => (
            <div
              key={preset.label}
              onClick={() => {
                const matched = questionSets.find(s => s.presetType === preset.type) || questionSets[0];
                setActivePracticingSet(matched);
              }}
              className="group glass rounded-2xl p-4 border border-white/[0.06] hover:border-brand-500/50 hover:bg-slate-900/90 cursor-pointer transition-all duration-300 card-hover flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl group-hover:scale-110 transition-transform">{preset.icon}</span>
                <span className="badge badge-emerald text-[9px] font-mono font-bold">{preset.count}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">{preset.label}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>{preset.marks}</span>
                  <span>{preset.time}</span>
                </div>
                <div className="text-[9px] text-slate-500 mt-1 truncate">{preset.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs & Search Filter Controls ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
        {/* Navigation Tabs */}
        <div className="tab-bar w-full lg:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
          >
            All Question Sets ({questionSets.length})
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`tab-item ${activeTab === 'presets' ? 'active' : ''}`}
          >
            Standard Presets
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`tab-item ${activeTab === 'custom' ? 'active' : ''}`}
          >
            Custom Sets ({questionSets.filter(q => q.isCustom).length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`tab-item ${activeTab === 'history' ? 'active' : ''}`}
          >
            Past Attempts ({questionSetAttempts.length})
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-60">
            <Search style={{ width: '13px', height: '13px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search chapters, topics, marks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field pl-8 py-2 text-xs w-full bg-slate-900/80 border-white/[0.08]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X style={{ width: '12px', height: '12px' }} />
              </button>
            )}
          </div>

          {/* Subject Dropdown */}
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="input-field py-2 text-xs w-36 bg-slate-900 border-white/[0.08]"
          >
            <option value="all">All Subjects</option>
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English">English</option>
            <option value="Computer Science">Computer Science</option>
          </select>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="input-field py-2 text-xs w-32 bg-slate-900 border-white/[0.08]"
          >
            <option value="all">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* ── View 1: Question Sets Cards Grid ── */}
      {activeTab !== 'history' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSets.map(set => {
            const diffColor = set.difficulty === 'easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
              : set.difficulty === 'medium' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' 
              : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

            const marksPerQuestion = set.marksPerQuestion || (set.totalMarks ? Math.round(set.totalMarks / set.questionCount) : 1);
            const negativePenalty = set.negativeMarksPerWrong || 0;

            return (
              <div
                key={set.id}
                className="glass rounded-3xl p-6 border border-white/[0.08] hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)] transition-all flex flex-col justify-between card-hover shadow-xl space-y-4 group relative"
              >
                <div className="space-y-3.5">
                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="badge badge-emerald text-[9px] uppercase font-bold tracking-wider">
                      {set.subject}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${diffColor}`}>
                        {set.difficulty.toUpperCase()}
                      </span>
                      {set.isCustom && (
                        <span className="badge badge-indigo text-[9px]">Custom</span>
                      )}
                    </div>
                  </div>

                  {/* Title & Chapter */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {set.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {set.chapter || 'Curriculum Standards'} {set.topic && `• ${set.topic}`}
                    </p>
                  </div>

                  {/* Detailed Marks & Exam Attributes Box */}
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/[0.06] grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">Questions</span>
                      <strong className="text-white text-xs font-mono font-bold">{set.questionCount} Qs</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">Total Marks</span>
                      <strong className="text-emerald-400 text-xs font-mono font-bold">{set.totalMarks} M</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">Time Limit</span>
                      <strong className="text-indigo-400 text-xs font-mono font-bold">{set.timeLimit} min</strong>
                    </div>
                  </div>

                  {/* Marks Option Pill (Per Question & Negative Scheme) */}
                  <div className="flex items-center justify-between text-[11px] px-1 text-slate-300">
                    <span className="flex items-center gap-1">
                      <Award style={{ width: '12px', height: '12px', color: '#10b981' }} />
                      <span>+{marksPerQuestion}M per correct</span>
                    </span>
                    <span className={`flex items-center gap-1 font-mono text-[10px] ${negativePenalty > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                      {negativePenalty > 0 ? (
                        <>
                          <ShieldAlert style={{ width: '11px', height: '11px' }} />
                          <span>-{negativePenalty}M Negative</span>
                        </>
                      ) : (
                        <span>No Negative</span>
                      )}
                    </span>
                  </div>

                  {/* Previous Performance indicator if attempted */}
                  {set.bestScore !== undefined && set.bestScore > 0 && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/[0.05] pt-2">
                      <span className="flex items-center gap-1">
                        <Star style={{ width: '12px', height: '12px', color: '#fbbf24' }} />
                        Best: <strong className="text-white font-mono">{set.bestScore}/{set.totalMarks}</strong>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{set.attemptsCount || 1} attempts</span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                  {/* Preview questions button */}
                  <button
                    onClick={() => setPreviewingSet(set)}
                    title="Preview questions before starting"
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] transition-colors"
                  >
                    <Eye style={{ width: '14px', height: '14px' }} />
                  </button>

                  {/* Delete button if custom */}
                  {set.isCustom && (
                    <button
                      onClick={() => deleteQuestionSet(set.id)}
                      title="Delete question set"
                      className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                  )}

                  {/* Start practice test CTA */}
                  <button
                    onClick={() => setActivePracticingSet(set)}
                    className="btn-primary w-full justify-center py-2.5 text-xs rounded-xl shadow-md gap-1.5 font-bold"
                  >
                    <Play style={{ width: '13px', height: '13px' }} />
                    <span>Start Practice Test</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredSets.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400 text-xs glass rounded-3xl p-8 space-y-3">
              <Search style={{ width: '32px', height: '32px', color: '#64748b', margin: '0 auto' }} />
              <p className="font-semibold text-white">No question sets match your current filters</p>
              <p className="text-slate-500 max-w-sm mx-auto">Try clearing search terms, selecting another subject, or build your own custom set.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('all');
                  setSelectedDifficulty('all');
                }}
                className="btn-secondary text-xs py-2 px-4 mt-2"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ── View 2: Past Attempts History ── */
        <div className="glass rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">Practice Assessment History</h3>
              <p className="text-xs text-slate-400">All practice tests completed with detailed marks breakdowns</p>
            </div>
            <span className="badge badge-emerald text-xs">{questionSetAttempts.length} Records Saved</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Test Title</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Marks Scored</th>
                  <th className="py-3 px-3">Percentage</th>
                  <th className="py-3 px-3">Grade</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {questionSetAttempts.map(att => (
                  <tr key={att.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-white">{att.questionSetTitle}</td>
                    <td className="py-3.5 px-3 text-slate-300">
                      <span className="badge badge-emerald text-[9px]">{att.subject}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px]">
                      {new Date(att.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white font-mono">
                      {att.obtainedMarks} <span className="text-slate-500 font-normal">/ {att.totalMarks} M</span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-emerald-400 font-mono">{att.percentage}%</td>
                    <td className="py-3.5 px-3">
                      <span className="badge badge-emerald text-[10px] font-bold">{att.grade}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px]">
                      {Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => {
                          const matched = questionSets.find(s => s.id === att.questionSetId);
                          if (matched) setActivePracticingSet(matched);
                        }}
                        className="text-brand-400 hover:text-brand-300 text-xs font-bold underline"
                      >
                        Re-attempt
                      </button>
                    </td>
                  </tr>
                ))}
                {questionSetAttempts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                      No past practice attempts recorded yet. Attempt any question set above to see your history!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Preview Questions Modal ── */}
      {previewingSet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="glass rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-white/[0.1] shadow-2xl space-y-5 animate-scale-in max-h-[88vh] flex flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-emerald text-[9px]">{previewingSet.subject}</span>
                  <span className="badge badge-indigo text-[9px]">{previewingSet.difficulty.toUpperCase()}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{previewingSet.title}</h3>
                <p className="text-xs text-slate-400">
                  {previewingSet.questionCount} Questions • Total {previewingSet.totalMarks} Marks • {previewingSet.timeLimit} Mins Limit
                </p>
              </div>
              <button 
                onClick={() => setPreviewingSet(null)}
                className="p-1.5 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white"
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {previewingSet.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-950/60 border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400 font-mono">Q{idx + 1}</span>
                    <span className="badge text-[9px] bg-slate-800 text-slate-300">+{q.marks} Marks</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white font-medium">{q.questionText}</p>
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {q.options.map(opt => (
                        <div key={opt.id} className="p-2 rounded-xl bg-slate-900/60 border border-white/[0.04] text-[11px] text-slate-300">
                          {opt.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
              <span className="text-xs text-slate-400 font-mono">
                {previewingSet.negativeMarksPerWrong ? `⚠️ -${previewingSet.negativeMarksPerWrong}M penalty on wrong answers` : '✓ No negative marking'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewingSet(null)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const toPractice = previewingSet;
                    setPreviewingSet(null);
                    setActivePracticingSet(toPractice);
                  }}
                  className="btn-primary text-xs py-2 px-5 gap-1.5"
                >
                  <Play style={{ width: '13px', height: '13px' }} />
                  <span>Start This Test</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Question Set Builder Modal with Advanced Marks Option ── */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="glass rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-white/[0.1] shadow-2xl space-y-6 animate-scale-in max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
                  <Sliders style={{ width: '18px', height: '18px' }} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Create Custom Question Set</h3>
                  <p className="text-xs text-slate-400">Configure questions, custom marks option &amp; penalty scheme</p>
                </div>
              </div>
              <button 
                onClick={() => setIsBuilderOpen(false)}
                className="p-1.5 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white"
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomSet} className="space-y-5 text-xs">
              
              {/* Title */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1.5">Question Set Title</label>
                <input
                  type="text"
                  placeholder="e.g. Light Reflection & Refraction High-Yield Drill"
                  value={buildTitle}
                  onChange={e => setBuildTitle(e.target.value)}
                  className="input-field text-xs w-full"
                  required
                />
              </div>

              {/* Subject & Difficulty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1.5">Subject</label>
                  <select
                    value={buildSubject}
                    onChange={e => setBuildSubject(e.target.value)}
                    className="input-field text-xs bg-slate-950 w-full"
                  >
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1.5">Difficulty Level</label>
                  <select
                    value={buildDifficulty}
                    onChange={e => setBuildDifficulty(e.target.value as any)}
                    className="input-field text-xs bg-slate-950 w-full"
                  >
                    <option value="easy">Easy (Concept Basics)</option>
                    <option value="medium">Medium (Standard Board Pattern)</option>
                    <option value="hard">Hard (Advanced Board Exemplar)</option>
                  </select>
                </div>
              </div>

              {/* Chapter & Topic */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1.5">Chapter / Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. Chemical Reactions"
                    value={buildChapter}
                    onChange={e => setBuildChapter(e.target.value)}
                    className="input-field text-xs w-full"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1.5">Specific Topic (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Balancing Equations"
                    value={buildTopic}
                    onChange={e => setBuildTopic(e.target.value)}
                    className="input-field text-xs w-full"
                  />
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  MARKS OPTION PANEL (Comprehensive Scoring Rules)
              ───────────────────────────────────────────────────────────── */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-brand-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award style={{ width: '16px', height: '16px', color: '#10b981' }} />
                    <span className="font-bold text-white text-xs">🎯 Marks Option &amp; Scoring Rubric</span>
                  </div>
                  <span className="badge badge-emerald text-[9px]">Customizable</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Marks Per Question */}
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Marks / Question</label>
                    <select
                      value={buildMarksPerQ}
                      onChange={e => setBuildMarksPerQ(Number(e.target.value))}
                      className="input-field text-xs bg-slate-950 w-full font-mono font-bold"
                    >
                      <option value={1}>1 Mark (Standard MCQ)</option>
                      <option value={2}>2 Marks (Short Answer)</option>
                      <option value={3}>3 Marks (Numerical / Reasoning)</option>
                      <option value={4}>4 Marks (Case Study)</option>
                      <option value={5}>5 Marks (Long Subjective)</option>
                    </select>
                  </div>

                  {/* Negative Marking Option */}
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Negative Marking Option</label>
                    <select
                      value={buildNegativeMark}
                      onChange={e => setBuildNegativeMark(Number(e.target.value))}
                      className="input-field text-xs bg-slate-950 w-full font-mono"
                    >
                      <option value={0}>No Penalty (0 Marks)</option>
                      <option value={0.25}>-0.25 Mark (1/4th)</option>
                      <option value={0.33}>-0.33 Mark (1/3rd)</option>
                      <option value={0.5}>-0.50 Mark (Half Mark)</option>
                      <option value={1}>-1.00 Mark (Full Penalty)</option>
                    </select>
                  </div>

                  {/* Passing Threshold */}
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Passing Marks Criteria</label>
                    <select
                      value={buildPassingPct}
                      onChange={e => setBuildPassingPct(Number(e.target.value))}
                      className="input-field text-xs bg-slate-950 w-full font-mono"
                    >
                      <option value={33}>33% (CBSE Passing)</option>
                      <option value={40}>40% (Standard Benchmark)</option>
                      <option value={50}>50% (First Class)</option>
                      <option value={75}>75% (Distinction Honors)</option>
                    </select>
                  </div>
                </div>

                {/* Number of Questions & Time Limit */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Total Question Count</label>
                    <select
                      value={buildQuestionCount}
                      onChange={e => setBuildQuestionCount(Number(e.target.value))}
                      className="input-field text-xs bg-slate-950 w-full font-mono font-bold"
                    >
                      <option value={5}>5 Questions (Quick Check)</option>
                      <option value={10}>10 Questions (Standard Sprint)</option>
                      <option value={15}>15 Questions (Revision Set)</option>
                      <option value={20}>20 Questions (Chapter Mastery)</option>
                      <option value={25}>25 Questions (Board Mock)</option>
                      <option value={50}>50 Questions (Full Mock)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Exam Time Limit (Minutes)</label>
                    <input
                      type="number"
                      min={5}
                      max={180}
                      value={buildTimeLimit}
                      onChange={e => setBuildTimeLimit(Number(e.target.value))}
                      className="input-field text-xs font-mono w-full"
                    />
                  </div>
                </div>

                {/* Real-Time Marks Calculation Breakdown */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">TOTAL MARKS</span>
                    <span className="text-emerald-400 font-bold text-sm">{calculatedTotalMarks} Marks</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PASSING MARKS</span>
                    <span className="text-indigo-400 font-bold text-sm">{calculatedPassingMarks} Marks ({buildPassingPct}%)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PENALTY / WRONG</span>
                    <span className={`font-bold text-sm ${buildNegativeMark > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                      {buildNegativeMark > 0 ? `-${buildNegativeMark} M` : 'None'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informational Note */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] text-slate-400 text-[11px] flex items-start gap-2">
                <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <span>
                  All marks obtained and negative penalties in this set will automatically sync to your <strong className="text-white">Marks Dashboard</strong> upon submission.
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(false)}
                  className="btn-secondary text-xs py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2.5 px-6 rounded-xl shadow-lg shadow-brand-500/25 font-bold"
                >
                  Generate &amp; Start Test
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default QuestionSetsHub;
