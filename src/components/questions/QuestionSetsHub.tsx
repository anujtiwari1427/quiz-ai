import React, { useState, useMemo } from 'react';
import { 
  Layers, Plus, Sparkles, Clock, CheckCircle2, Play, 
  Trash2, Filter, Search, Award, HelpCircle, X, ChevronRight, 
  BookOpen, Star, History, BookmarkCheck
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
    setActiveQuestionSetToPractice
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'presets' | 'custom' | 'history'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [activePracticingSet, setActivePracticingSet] = useState<QuestionSet | null>(activeQuestionSetToPractice);

  // Builder Form State
  const [buildTitle, setBuildTitle] = useState('');
  const [buildSubject, setBuildSubject] = useState('Science');
  const [buildChapter, setBuildChapter] = useState('');
  const [buildTopic, setBuildTopic] = useState('');
  const [buildQuestionCount, setBuildQuestionCount] = useState<number>(10);
  const [buildDifficulty, setBuildDifficulty] = useState<QuestionSetDifficulty>('medium');
  const [buildQuestionType, setBuildQuestionType] = useState<'mcq' | 'mixed' | 'short_answer'>('mcq');
  const [buildMarksPerQ, setBuildMarksPerQ] = useState<number>(1);
  const [buildTimeLimit, setBuildTimeLimit] = useState<number>(15);

  // Filtered Question Sets
  const filteredSets = useMemo(() => {
    return questionSets.filter(set => {
      const matchesSubject = selectedSubject === 'all' || set.subject.toLowerCase() === selectedSubject.toLowerCase();
      const matchesSearch = searchQuery.trim() === '' || 
        set.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        set.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (set.chapter || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === 'presets') return matchesSubject && matchesSearch && Boolean(set.presetType);
      if (activeTab === 'custom') return matchesSubject && matchesSearch && set.isCustom;
      return matchesSubject && matchesSearch;
    });
  }, [questionSets, selectedSubject, searchQuery, activeTab]);

  // Handle Preset Quick Launch or Build
  const handleCreateCustomSet = (e: React.FormEvent) => {
    e.preventDefault();

    const questions: Question[] = Array.from({ length: buildQuestionCount }).map((_, i) => ({
      id: `q_cust_${Date.now()}_${i + 1}`,
      type: buildQuestionType === 'short_answer' ? 'short_answer' : 'mcq',
      chapter: buildChapter.trim() || 'Core Chapter Fundamentals',
      topic: buildTopic.trim() || undefined,
      questionText: `Sample question ${i + 1} on ${buildSubject} (${buildChapter || 'General Concepts'}): Evaluate the application of standard board principles and formulate the deduction.`,
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
      explanation: 'Accurate deduction follows from fundamental conservation principles and syllabus definitions.'
    }));

    const newSet: QuestionSet = {
      id: `qset_${Date.now()}`,
      title: buildTitle.trim() || `${buildSubject}: ${buildChapter || 'Practice Set'} (${buildQuestionCount}Q)`,
      subject: buildSubject,
      chapter: buildChapter.trim() || undefined,
      topic: buildTopic.trim() || undefined,
      difficulty: buildDifficulty,
      questionCount: buildQuestionCount,
      totalMarks: buildQuestionCount * buildMarksPerQ,
      timeLimit: buildTimeLimit,
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
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-emerald">Interactive Test Bank</span>
            <span className="text-slate-500 text-xs font-mono">• Board Examination Aligned</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center gap-2.5">
            📝 Question Sets &amp; Practice Tests
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Generate, customize, and practice curated question sets with instant score analytics and automatic Marks Dashboard synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBuilderOpen(true)}
            className="btn-primary text-xs py-2 px-4 shadow-lg shadow-brand-500/20"
          >
            <Plus style={{ width: '13px', height: '13px' }} />
            <span>Create Custom Set</span>
          </button>
        </div>
      </div>

      {/* ── Preset Shortcut Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Quick Practice', count: '10 Q', time: '15m', icon: '⚡', type: 'quick' },
          { label: 'Chapter Test', count: '20 Q', time: '30m', icon: '📖', type: 'chapter' },
          { label: 'Revision Set', count: '25 Q', time: '40m', icon: '🔄', type: 'revision' },
          { label: 'Exam Practice', count: '50 Q', time: '60m', icon: '🎯', type: 'exam' },
          { label: 'Important Qs', count: '15 Q', time: '25m', icon: '⭐', type: 'important' },
          { label: 'Previous Style', count: '20 Q', time: '30m', icon: '📜', type: 'previous' },
        ].map(preset => (
          <div
            key={preset.label}
            onClick={() => {
              const matched = questionSets.find(s => s.presetType === preset.type) || questionSets[0];
              setActivePracticingSet(matched);
            }}
            className="glass rounded-2xl p-3.5 border border-white/[0.06] hover:border-brand-500/40 cursor-pointer transition-all card-hover flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-lg mb-1">
              <span>{preset.icon}</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">{preset.count}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">{preset.label}</p>
              <span className="text-[10px] text-slate-400 font-mono">{preset.time} limit</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs & Search Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="tab-bar w-full sm:w-auto">
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
            My Custom Sets
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`tab-item ${activeTab === 'history' ? 'active' : ''}`}
          >
            Past Attempts ({questionSetAttempts.length})
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-56">
            <Search style={{ width: '13px', height: '13px', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search question sets..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field pl-8 py-1.5 text-xs w-full"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="input-field py-1.5 text-xs w-36 bg-slate-900 border-white/[0.08]"
          >
            <option value="all">All Subjects</option>
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English">English</option>
            <option value="Computer Science">Computer Science</option>
          </select>
        </div>
      </div>

      {/* ── View 1: Question Sets Cards Grid ── */}
      {activeTab !== 'history' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSets.map(set => {
            const diffBadge = set.difficulty === 'easy' ? 'badge-emerald' : set.difficulty === 'medium' ? 'badge-indigo' : 'badge-amber';

            return (
              <div
                key={set.id}
                className="glass rounded-3xl p-6 border border-white/[0.07] hover:border-brand-500/40 transition-all flex flex-col justify-between card-hover shadow-xl space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="badge badge-emerald" style={{ fontSize: '9px' }}>
                      {set.subject}
                    </span>
                    <span className={`badge ${diffBadge}`} style={{ fontSize: '9px' }}>
                      {set.difficulty.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {set.title}
                    </h3>
                    {set.chapter && (
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        {set.chapter} {set.topic && `• ${set.topic}`}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/[0.05] text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Questions</span>
                      <strong className="text-white font-mono">{set.questionCount} Qs</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Total Marks</span>
                      <strong className="text-white font-mono">{set.totalMarks} M</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Time Limit</span>
                      <strong className="text-white font-mono">{set.timeLimit} min</strong>
                    </div>
                  </div>

                  {set.bestScore !== undefined && set.bestScore > 0 && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Award style={{ width: '12px', height: '12px', color: '#fbbf24' }} />
                        Best Score: <strong className="text-white">{set.bestScore}/{set.totalMarks}</strong>
                      </span>
                      <span>{set.attemptsCount || 0} attempts</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {set.isCustom && (
                    <button
                      onClick={() => deleteQuestionSet(set.id)}
                      title="Delete question set"
                      className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                    >
                      <Trash2 style={{ width: '13px', height: '13px' }} />
                    </button>
                  )}
                  <button
                    onClick={() => setActivePracticingSet(set)}
                    className="btn-primary w-full justify-center py-2.5 text-xs rounded-xl shadow-md"
                  >
                    <Play style={{ width: '12px', height: '12px' }} />
                    <span>Attempt Question Set</span>
                  </button>
                </div>
              </div>
            );
          })}
          {filteredSets.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500 text-xs glass rounded-3xl p-8">
              No question sets found for this filter. Try adjusting your search or create a custom set!
            </div>
          )}
        </div>
      ) : (
        /* ── View 2: Past Attempts History ── */
        <div className="glass rounded-3xl p-6 border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Past Practice Attempts</h3>
            <span className="text-xs text-slate-400">{questionSetAttempts.length} Total Submissions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-3">Set Title</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Percentage</th>
                  <th className="py-3 px-3">Grade</th>
                  <th className="py-3 px-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {questionSetAttempts.map(att => (
                  <tr key={att.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-semibold text-white">{att.questionSetTitle}</td>
                    <td className="py-3 px-3 text-slate-300">{att.subject}</td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {new Date(att.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-bold text-white font-mono">{att.obtainedMarks}/{att.totalMarks}</td>
                    <td className="py-3 px-3 font-bold text-emerald-400 font-mono">{att.percentage}%</td>
                    <td className="py-3 px-3">
                      <span className="badge badge-emerald">{att.grade}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s
                    </td>
                  </tr>
                ))}
                {questionSetAttempts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                      No past practice attempts recorded yet. Attempt a question set to see your record!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Question Set Builder Modal ── */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="glass rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/[0.1] shadow-2xl space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400">
                  <Sparkles style={{ width: '16px', height: '16px' }} />
                </div>
                <h3 className="text-base font-bold text-white">Create Custom Question Set</h3>
              </div>
              <button 
                onClick={() => setIsBuilderOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomSet} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Set Title</label>
                <input
                  type="text"
                  placeholder="e.g. Electricity Numerical Practice"
                  value={buildTitle}
                  onChange={e => setBuildTitle(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Subject</label>
                  <select
                    value={buildSubject}
                    onChange={e => setBuildSubject(e.target.value)}
                    className="input-field text-xs bg-slate-950"
                  >
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Difficulty</label>
                  <select
                    value={buildDifficulty}
                    onChange={e => setBuildDifficulty(e.target.value as any)}
                    className="input-field text-xs bg-slate-950"
                  >
                    <option value="easy">Easy (Foundational)</option>
                    <option value="medium">Medium (Standard)</option>
                    <option value="hard">Hard (Board Hotspots)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Chapter Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Light Reflection"
                    value={buildChapter}
                    onChange={e => setBuildChapter(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Topic (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Spherical Mirrors"
                    value={buildTopic}
                    onChange={e => setBuildTopic(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Questions</label>
                  <select
                    value={buildQuestionCount}
                    onChange={e => setBuildQuestionCount(Number(e.target.value))}
                    className="input-field text-xs bg-slate-950 font-mono"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={25}>25 Questions</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Marks / Q</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={buildMarksPerQ}
                    onChange={e => setBuildMarksPerQ(Number(e.target.value))}
                    className="input-field text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Time Limit (min)</label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={buildTimeLimit}
                    onChange={e => setBuildTimeLimit(Number(e.target.value))}
                    className="input-field text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.06] text-slate-400 text-[11px] leading-relaxed">
                Completing this practice set will automatically generate a score card in your <strong className="text-white">Marks Dashboard</strong>.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5"
                >
                  Create &amp; Launch Practice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
