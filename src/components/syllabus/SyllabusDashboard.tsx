import React, { useState, useRef } from 'react';
import { 
  Upload, FileText, CheckCircle2, AlertCircle, ChevronDown, 
  ChevronRight, Sparkles, BookOpen, Trash2, Layers, Book, 
  Search, Check, ArrowRight, FolderPlus, HelpCircle, Award,
  ShieldCheck, Sliders, CheckSquare, Square, RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Syllabus, SyllabusSubject, SyllabusChapter } from '../../types';

export const SyllabusDashboard: React.FC = () => {
  const { 
    syllabi, 
    saveSyllabus, 
    deleteSyllabus, 
    setCurrentView,
    startQuizFromSyllabus,
    openBookForSubjectOrChapter,
    setActiveQuestionSetToPractice,
    questionSets
  } = useApp();

  const [activeSyllabusId, setActiveSyllabusId] = useState<string>(
    syllabi.length > 0 ? syllabi[0].id : ''
  );
  const [expandedSubjects, setExpandedSubjects] = useState<{ [id: string]: boolean }>({
    'syl_sub_sci': true,
    'syl_sub_math': true
  });
  const [expandedChapters, setExpandedChapters] = useState<{ [id: string]: boolean }>({
    'syl_ch_sci_1': true,
    'syl_ch_sci_2': true
  });
  const [completedTopics, setCompletedTopics] = useState<{ [topicKey: string]: boolean }>({});

  // Drag & drop upload state
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSyllabus = syllabi.find(s => s.id === activeSyllabusId) || syllabi[0];

  // Toggle helpers
  const toggleSubject = (subjId: string) => {
    setExpandedSubjects(prev => ({ ...prev, [subjId]: !prev[subjId] }));
  };

  const toggleChapter = (chId: string) => {
    setExpandedChapters(prev => ({ ...prev, [chId]: !prev[chId] }));
  };

  const toggleTopicCompletion = (topicKey: string) => {
    setCompletedTopics(prev => ({ ...prev, [topicKey]: !prev[topicKey] }));
  };

  // ── Drag & Drop Handlers ──
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);

    const validExtensions = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => lowerName.endsWith(ext));

    if (!isValid) {
      setUploadError('Unsupported file type. Please upload a PDF, DOC, DOCX, TXT, or Image file (JPG/PNG).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) { // 25 MB max
      setUploadError('File is too large. Maximum supported syllabus size is 25 MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  // ── Process Uploaded Syllabus with AI Curriculum Extractor ──
  const handleProcessSyllabus = () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const newSyllabus: Syllabus = {
        id: `syl_uploaded_${Date.now()}`,
        name: selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") + " Syllabus",
        fileName: selectedFile.name,
        fileSize: (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
        fileType: selectedFile.type || 'application/pdf',
        uploadedAt: new Date().toISOString().split('T')[0],
        board: 'CBSE & NEP 2020 Aligned',
        grade: 10,
        subjects: [
          {
            id: `sub_${Date.now()}_1`,
            name: 'Science & Technology (Physics, Chem, Bio)',
            chapters: [
              {
                id: `ch_${Date.now()}_11`,
                name: 'Chemical Reactions & Equations',
                unitName: 'Unit 1: Chemical Substances (25 Marks Weightage)',
                topics: [
                  'Balancing equations using conservation of mass',
                  'Types of chemical reactions: Combination, Decomposition, Displacement',
                  'Oxidation, reduction, rancidity and corrosion prevention'
                ],
                completionPercentage: 0,
                isCompleted: false
              },
              {
                id: `ch_${Date.now()}_12`,
                name: 'Light – Reflection and Refraction',
                unitName: 'Unit 3: Natural Phenomena (12 Marks Weightage)',
                topics: [
                  'Reflection by spherical mirrors and ray diagrams',
                  'Mirror formula and linear magnification calculation',
                  'Refractive index, Snell’s Law, and lens power (Dioptres)'
                ],
                completionPercentage: 0,
                isCompleted: false
              },
              {
                id: `ch_${Date.now()}_13`,
                name: 'Electricity & Magnetic Effects',
                unitName: 'Unit 4: Effects of Current (13 Marks Weightage)',
                topics: [
                  'Ohm’s Law, resistance, and factors affecting resistivity',
                  'Series and parallel resistor combinations',
                  'Joule’s Law of heating and electric power formulas'
                ],
                completionPercentage: 0,
                isCompleted: false
              }
            ]
          },
          {
            id: `sub_${Date.now()}_2`,
            name: 'Mathematics (Standard & Basic)',
            chapters: [
              {
                id: `ch_${Date.now()}_21`,
                name: 'Quadratic Equations & Polynomials',
                unitName: 'Unit 2: Algebra (20 Marks Weightage)',
                topics: [
                  'Standard form of quadratic equations ax² + bx + c = 0',
                  'Solution by factorisation and quadratic formula',
                  'Discriminant analysis (b² - 4ac) and nature of roots'
                ],
                completionPercentage: 0,
                isCompleted: false
              },
              {
                id: `ch_${Date.now()}_22`,
                name: 'Introduction to Trigonometry',
                unitName: 'Unit 5: Trigonometry (12 Marks Weightage)',
                topics: [
                  'Trigonometric ratios of acute angles',
                  'Values of trigonometric ratios at 0°, 30°, 45°, 60°, 90°',
                  'Proofs and applications of identity sin²θ + cos²θ = 1'
                ],
                completionPercentage: 0,
                isCompleted: false
              }
            ]
          }
        ]
      };

      saveSyllabus(newSyllabus);
      setActiveSyllabusId(newSyllabus.id);
      setIsProcessing(false);
      setUploadSuccess(true);
      setSelectedFile(null);
    }, 1200);
  };

  // Quick 1-click preset loader
  const handleLoadBoardPreset = (boardName: string) => {
    const existing = syllabi.find(s => s.name.toLowerCase().includes(boardName.toLowerCase()));
    if (existing) {
      setActiveSyllabusId(existing.id);
      return;
    }
  };

  // Launch Quiz from syllabus chapter with Marks Option
  const handleLaunchQuizWithMarks = (subject: string, chapter: string) => {
    // Check if there is an existing set for this
    const matchedSet = questionSets.find(s => 
      s.subject.toLowerCase() === subject.toLowerCase() || 
      (s.chapter && s.chapter.toLowerCase().includes(chapter.toLowerCase()))
    );

    if (matchedSet) {
      setActiveQuestionSetToPractice(matchedSet);
    } else {
      startQuizFromSyllabus(subject, chapter, undefined);
    }
    setCurrentView('questions');
  };

  // Calculate syllabus completion statistics
  const totalTopicsCount = currentSyllabus?.subjects.reduce((acc, sub) => {
    return acc + sub.chapters.reduce((chAcc, ch) => chAcc + ch.topics.length, 0);
  }, 0) || 1;

  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const overallCompletionPct = Math.round((completedCount / totalTopicsCount) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in-up">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-emerald">Curriculum Management</span>
            <span className="text-slate-500 text-xs font-mono">• AI Syllabus Decomposition</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center gap-2.5">
            📂 Upload &amp; Explore Syllabus
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload course curriculum files (PDF, Word, Images, TXT) to automatically extract chapters, units, exam marks weightage, and generate customized quizzes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCurrentView('questions')}
            className="btn-secondary text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5"
          >
            <Layers style={{ width: '13px', height: '13px' }} />
            <span>Question Sets</span>
          </button>
          <button
            onClick={() => setCurrentView('books')}
            className="btn-secondary text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 text-amber-400 hover:text-amber-300"
          >
            <BookOpen style={{ width: '13px', height: '13px' }} />
            <span>Read Textbook</span>
          </button>
        </div>
      </div>

      {/* ── Drag & Drop Upload Zone (Interactive & High-Tech) ── */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 shadow-md">
              <Upload style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload New Syllabus Document</h3>
              <p className="text-xs text-slate-400">AI automatically extracts units, chapters, topics, and board weightage</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {['PDF', 'DOCX', 'TXT', 'PNG', 'JPG'].map(fmt => (
              <span key={fmt} className="badge" style={{ background: 'rgba(255,255,255,0.06)', fontSize: '9px', fontWeight: 'bold' }}>
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* Drag target box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-brand-500 bg-brand-500/10 scale-[1.01] shadow-2xl shadow-brand-500/15'
              : selectedFile
              ? 'border-emerald-500/60 bg-emerald-500/5'
              : 'border-white/[0.12] hover:border-brand-500/50 hover:bg-white/[0.02]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-slate-900/90 border border-white/[0.08] flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
            {selectedFile ? (
              <FileText style={{ width: '30px', height: '30px', color: '#34d399' }} />
            ) : (
              <Upload style={{ width: '30px', height: '30px', color: '#10b981' }} />
            )}
          </div>

          <div>
            <p className="text-sm sm:text-base font-bold text-white">
              {selectedFile ? selectedFile.name : 'Click to select or drag & drop syllabus document'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports official CBSE, ICSE, and State Board Curriculum circulars, chapter blueprints or notes up to 25 MB
            </p>
          </div>
        </div>

        {/* Error notification */}
        {uploadError && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Success notification */}
        {uploadSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span>Syllabus successfully decomposed! Subjects, units, and learning goals are ready below.</span>
          </div>
        )}

        {/* Selected file info & process button */}
        {selectedFile && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400 shrink-0">
                <FileText style={{ width: '20px', height: '20px' }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-400 font-mono">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI Parsing
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  setUploadProgress(0);
                }}
                disabled={isProcessing}
                className="btn-secondary text-xs py-2 px-3 text-rose-400 hover:text-rose-300"
              >
                <Trash2 style={{ width: '12px', height: '12px' }} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleProcessSyllabus}
                disabled={isProcessing}
                className="btn-primary text-xs py-2 px-5 font-bold shadow-lg shadow-brand-500/25"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Extracting Curriculum ({uploadProgress}%)…</span>
                  </>
                ) : (
                  <>
                    <Sparkles style={{ width: '13px', height: '13px' }} />
                    <span>Extract Chapters &amp; Weightage</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Board Presets Quick Row */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Or load pre-configured board syllabus blueprint:</span>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'CBSE Class 10 (2026)', board: 'CBSE' },
              { label: 'Maharashtra SSC', board: 'Maharashtra' },
              { label: 'ICSE Class 10', board: 'ICSE' }
            ].map(preset => (
              <button
                key={preset.label}
                onClick={() => handleLoadBoardPreset(preset.board)}
                className="px-3 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] text-[11px] transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Active Syllabus Selector Tabs ── */}
      {syllabi.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {syllabi.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSyllabusId(s.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                s.id === activeSyllabusId
                  ? 'bg-brand-500 text-slate-950 border-brand-400 shadow-lg shadow-brand-500/20'
                  : 'bg-slate-900 text-slate-400 border-white/[0.06] hover:text-white'
              }`}
            >
              <FileText style={{ width: '13px', height: '13px' }} />
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Active Syllabus Overview & Completion Meter ── */}
      {currentSyllabus && (
        <div className="space-y-6">
          <div className="glass rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="badge badge-emerald text-[10px]">{currentSyllabus.board || 'CBSE Board'}</span>
                  <span className="badge badge-indigo text-[10px]">Class {currentSyllabus.grade || 10}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-white">{currentSyllabus.name}</h2>
                <p className="text-xs text-slate-400">
                  Uploaded on {currentSyllabus.uploadedAt} • File: {currentSyllabus.fileName}
                </p>
              </div>

              {/* Progress Ring / Bar */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/[0.06] flex items-center gap-4 shrink-0">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Curriculum Mastery</div>
                  <div className="text-xl font-bold text-white font-mono">{overallCompletionPct}% Mastered</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">{completedCount} of {totalTopicsCount} topics checked</div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-400 flex items-center justify-center font-mono text-xs font-bold text-white">
                  {overallCompletionPct}%
                </div>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/[0.06]">
              <button
                onClick={() => {
                  const firstSub = currentSyllabus.subjects[0];
                  if (firstSub) handleLaunchQuizWithMarks(firstSub.name, firstSub.chapters[0]?.name || 'Full Syllabus');
                }}
                className="btn-primary text-xs py-2 px-4 rounded-xl shadow-md gap-1.5 font-bold"
              >
                <Sparkles style={{ width: '13px', height: '13px' }} />
                <span>Generate Test with Marks Option</span>
              </button>

              <button
                onClick={() => {
                  const firstSub = currentSyllabus.subjects[0];
                  if (firstSub) openBookForSubjectOrChapter(firstSub.name, firstSub.chapters[0]?.name);
                }}
                className="btn-secondary text-xs py-2 px-4 rounded-xl text-amber-400 hover:text-amber-300 gap-1.5"
              >
                <BookOpen style={{ width: '13px', height: '13px' }} />
                <span>Read Prescribed Textbook</span>
              </button>

              <button
                onClick={() => deleteSyllabus(currentSyllabus.id)}
                className="btn-secondary text-xs py-2 px-3 rounded-xl text-rose-400 hover:text-rose-300 ml-auto"
                title="Delete this syllabus"
              >
                <Trash2 style={{ width: '13px', height: '13px' }} />
                <span>Remove Syllabus</span>
              </button>
            </div>
          </div>

          {/* ── Curriculum Hierarchy Explorer ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Curriculum Hierarchy &amp; Topic Explorer</h3>
                <p className="text-xs text-slate-400">
                  Click on any chapter to start a test with custom marks or read the textbook
                </p>
              </div>
              <span className="badge badge-indigo text-[10px]">
                {currentSyllabus.subjects.length} Disciplines
              </span>
            </div>

            <div className="space-y-4">
              {currentSyllabus.subjects.map(subject => {
                const isSubjExpanded = expandedSubjects[subject.id] ?? false;

                return (
                  <div 
                    key={subject.id}
                    className="glass rounded-3xl border border-white/[0.08] overflow-hidden transition-all shadow-md"
                  >
                    {/* Subject Row Header */}
                    <div 
                      onClick={() => toggleSubject(subject.id)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <button className="p-1.5 rounded-xl bg-slate-800 text-slate-400">
                          {isSubjExpanded ? (
                            <ChevronDown style={{ width: '16px', height: '16px' }} />
                          ) : (
                            <ChevronRight style={{ width: '16px', height: '16px' }} />
                          )}
                        </button>
                        <div>
                          <h4 className="text-base font-bold text-white">{subject.name}</h4>
                          <span className="text-xs text-slate-400">
                            {subject.chapters.length} Chapters • {subject.chapters.reduce((sum, ch) => sum + ch.topics.length, 0)} Detailed Topics
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleLaunchQuizWithMarks(subject.name, subject.chapters[0]?.name || 'All Units')}
                          className="btn-primary py-1.5 px-3.5 text-xs rounded-xl shadow-sm gap-1.5 font-bold"
                        >
                          <Sparkles style={{ width: '12px', height: '12px' }} />
                          <span>Quiz Subject</span>
                        </button>
                      </div>
                    </div>

                    {/* Chapters List (Accordion) */}
                    {isSubjExpanded && (
                      <div className="px-5 pb-5 space-y-3 pt-2 border-t border-white/[0.05]">
                        {subject.chapters.map((chapter, idx) => {
                          const isChExpanded = expandedChapters[chapter.id] ?? false;

                          return (
                            <div
                              key={chapter.id}
                              className="rounded-2xl bg-slate-950/70 border border-white/[0.05] p-4 space-y-3"
                            >
                              {/* Chapter Header */}
                              <div 
                                onClick={() => toggleChapter(chapter.id)}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="w-7 h-7 rounded-xl bg-brand-500/15 text-brand-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <div>
                                    <span className="text-sm font-bold text-white hover:text-brand-300 transition-colors">
                                      {chapter.name}
                                    </span>
                                    {chapter.unitName && (
                                      <p className="text-[11px] text-emerald-400 font-mono mt-0.5">{chapter.unitName}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                  {/* READ BOOK OPTION BUTTON */}
                                  <button
                                    onClick={() => openBookForSubjectOrChapter(subject.name, chapter.name)}
                                    title="Open this chapter in Read the Book mode"
                                    className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all text-xs flex items-center gap-1.5 font-semibold"
                                  >
                                    <BookOpen style={{ width: '13px', height: '13px' }} />
                                    <span>Read Book</span>
                                  </button>

                                  {/* MARKS OPTION QUIZ BUTTON */}
                                  <button
                                    onClick={() => handleLaunchQuizWithMarks(subject.name, chapter.name)}
                                    title="Generate quiz with customizable marks and negative score scheme"
                                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 transition-all text-xs flex items-center gap-1.5 font-bold"
                                  >
                                    <Sparkles style={{ width: '13px', height: '13px' }} />
                                    <span>Quiz + Marks</span>
                                  </button>

                                  <button 
                                    onClick={() => toggleChapter(chapter.id)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                                  >
                                    {isChExpanded ? (
                                      <ChevronDown style={{ width: '15px', height: '15px' }} />
                                    ) : (
                                      <ChevronRight style={{ width: '15px', height: '15px' }} />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Topics List with Completion Checkbox */}
                              {isChExpanded && (
                                <div className="pl-6 sm:pl-10 pt-2 space-y-2 border-t border-white/[0.03] animate-fade-in-up">
                                  {chapter.topics.map((topic, tIdx) => {
                                    const topicKey = `${chapter.id}_${tIdx}`;
                                    const isDone = Boolean(completedTopics[topicKey]);

                                    return (
                                      <div 
                                        key={tIdx}
                                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                                          isDone 
                                            ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300' 
                                            : 'bg-slate-900/60 hover:bg-slate-900 border-white/[0.03] text-slate-300'
                                        }`}
                                      >
                                        <div 
                                          onClick={() => toggleTopicCompletion(topicKey)}
                                          className="flex items-center gap-2.5 cursor-pointer select-none"
                                        >
                                          {isDone ? (
                                            <CheckSquare style={{ width: '15px', height: '15px', color: '#10b981', flexShrink: 0 }} />
                                          ) : (
                                            <Square style={{ width: '15px', height: '15px', color: '#64748b', flexShrink: 0 }} />
                                          )}
                                          <span className={`text-xs ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                            {topic}
                                          </span>
                                        </div>

                                        <button
                                          onClick={() => handleLaunchQuizWithMarks(subject.name, `${chapter.name} - ${topic}`)}
                                          className="text-[10px] font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 transition-colors"
                                        >
                                          <Sparkles style={{ width: '10px', height: '10px' }} />
                                          <span>Practice Topic</span>
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SyllabusDashboard;
