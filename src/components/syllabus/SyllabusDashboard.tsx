import React, { useState, useRef } from 'react';
import { 
  Upload, FileText, CheckCircle2, AlertCircle, ChevronDown, 
  ChevronRight, Sparkles, BookOpen, Trash2, Layers, Book, 
  Search, Check, ArrowRight, FolderPlus, HelpCircle
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
    openBookForSubjectOrChapter 
  } = useApp();

  const [activeSyllabusId, setActiveSyllabusId] = useState<string>(
    syllabi.length > 0 ? syllabi[0].id : ''
  );
  const [expandedSubjects, setExpandedSubjects] = useState<{ [id: string]: boolean }>({
    'syl_sub_sci': true,
    'syl_sub_math': true
  });
  const [expandedChapters, setExpandedChapters] = useState<{ [id: string]: boolean }>({
    'syl_ch_sci_1': true
  });

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

    if (file.size > 20 * 1024 * 1024) { // 20 MB max
      setUploadError('File is too large. Maximum supported syllabus size is 20 MB.');
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

  // ── Process Uploaded Syllabus ──
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

      // Create realistic structured parsed syllabus
      const newSyllabus: Syllabus = {
        id: `syl_uploaded_${Date.now()}`,
        name: selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") + " Syllabus",
        fileName: selectedFile.name,
        fileSize: (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
        fileType: selectedFile.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString().split('T')[0],
        board: 'CBSE & State Board',
        grade: 10,
        subjects: [
          {
            id: `sub_${Date.now()}_1`,
            name: 'Science & Technology',
            chapters: [
              {
                id: `ch_${Date.now()}_11`,
                name: 'Chemical Reactions & Catalysis',
                unitName: 'Unit 1: Matter and Reactions',
                topics: [
                  'Balancing equations using conservation of mass',
                  'Exothermic and endothermic transformations',
                  'Oxidation, reduction, and electrochemical potential'
                ],
                completionPercentage: 0,
                isCompleted: false
              },
              {
                id: `ch_${Date.now()}_12`,
                name: 'Optics & Electromagnetic Waves',
                unitName: 'Unit 2: Wave Physics',
                topics: [
                  'Refraction index in varied media',
                  'Convex and concave optical configurations',
                  'Snell’s mathematical derivations'
                ],
                completionPercentage: 0,
                isCompleted: false
              }
            ]
          },
          {
            id: `sub_${Date.now()}_2`,
            name: 'Mathematics & Analytic Reasoning',
            chapters: [
              {
                id: `ch_${Date.now()}_21`,
                name: 'Algebraic Formulations & Polynomials',
                unitName: 'Unit 1: Pure Mathematics',
                topics: [
                  'Discriminant analysis of quadratic functions',
                  'Factorisation algorithms and zero derivation',
                  'Geometric curves and coordinates'
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in-up">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-emerald">Curriculum Planning</span>
            <span className="text-slate-500 text-xs font-mono">• AI-Guided Breakdown</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center gap-2.5">
            Upload &amp; Manage Syllabus
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload course curricula (PDF, Word, TXT, Images) to extract units, chapters, and generate aligned question sets with AI.
          </p>
        </div>

        {currentSyllabus && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Generate quiz from entire syllabus
                const firstSub = currentSyllabus.subjects[0];
                const firstCh = firstSub?.chapters[0];
                startQuizFromSyllabus(firstSub?.name || 'Science', firstCh?.name, undefined);
              }}
              className="btn-primary text-xs py-2 px-4"
            >
              <Sparkles style={{ width: '13px', height: '13px' }} />
              <span>Generate Full Syllabus Quiz</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Drag & Drop Upload Zone ── */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
              <Upload style={{ width: '18px', height: '18px', color: '#10b981' }} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload New Syllabus</h3>
              <p className="text-xs text-slate-400">Extracts subjects, units, chapters, and topics automatically</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            {['PDF', 'DOC', 'DOCX', 'TXT', 'JPG', 'PNG'].map(fmt => (
              <span key={fmt} className="badge" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '9px' }}>
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
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
              : selectedFile
              ? 'border-emerald-500/50 bg-emerald-500/5'
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

          <div className="w-14 h-14 rounded-2xl bg-slate-900/90 border border-white/[0.08] flex items-center justify-center shadow-lg">
            {selectedFile ? (
              <FileText style={{ width: '26px', height: '26px', color: '#34d399' }} />
            ) : (
              <Upload style={{ width: '26px', height: '26px', color: '#10b981' }} />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              {selectedFile ? selectedFile.name : 'Click to upload or drag & drop syllabus document'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Supports PDF, Word (.docx), Plain Text (.txt), or scanned images up to 20 MB
            </p>
          </div>
        </div>

        {/* Error notification */}
        {uploadError && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle style={{ width: '15px', height: '15px', flexShrink: 0 }} />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Success notification */}
        {uploadSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 style={{ width: '15px', height: '15px', flexShrink: 0 }} />
            <span>Syllabus successfully parsed! Structured subjects and chapters are ready below.</span>
          </div>
        )}

        {/* Selected file info & process button */}
        {selectedFile && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400 shrink-0">
                <FileText style={{ width: '18px', height: '18px' }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Document'}
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
                <span>Remove</span>
              </button>
              <button
                onClick={handleProcessSyllabus}
                disabled={isProcessing}
                className="btn-primary text-xs py-2 px-4"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Extracting Curriculum ({uploadProgress}%)…</span>
                  </>
                ) : (
                  <>
                    <Sparkles style={{ width: '13px', height: '13px' }} />
                    <span>Process Syllabus</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {isProcessing && (
          <div className="space-y-1.5 animate-fade-in-up">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Claude 3.5 AI parsing topics, units &amp; chapter taxonomies...</span>
              <span className="font-mono text-emerald-400">{uploadProgress}%</span>
            </div>
            <div className="mastery-bar">
              <div className="mastery-bar-fill high" style={{ width: `${uploadProgress}%`, animation: 'none' }} />
            </div>
          </div>
        )}
      </div>

      {/* ── Active Syllabus Selector & Summary ── */}
      {currentSyllabus && (
        <div className="space-y-6">
          
          {/* Syllabus Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {syllabi.map(syl => (
                <button
                  key={syl.id}
                  onClick={() => setActiveSyllabusId(syl.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeSyllabusId === syl.id
                      ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20 font-black'
                      : 'bg-slate-900/80 text-slate-400 border border-white/[0.06] hover:text-white'
                  }`}
                >
                  <BookOpen style={{ width: '13px', height: '13px' }} />
                  <span className="truncate max-w-[200px]">{syl.name}</span>
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>File: <strong className="text-slate-200">{currentSyllabus.fileName}</strong></span>
              <span>•</span>
              <span>Updated: <strong className="text-slate-200">{currentSyllabus.uploadedAt}</strong></span>
            </div>
          </div>

          {/* Subject Cards Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSyllabus.subjects.map(subject => {
              const totalChapters = subject.chapters.length;
              const totalTopics = subject.chapters.reduce((sum, ch) => sum + ch.topics.length, 0);
              const avgCompletion = totalChapters > 0
                ? Math.round(subject.chapters.reduce((sum, ch) => sum + (ch.completionPercentage || 0), 0) / totalChapters)
                : 0;

              return (
                <div 
                  key={subject.id}
                  className="glass rounded-2xl p-5 border border-white/[0.06] hover:border-brand-500/30 transition-all space-y-4 card-hover"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">{subject.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {totalChapters} {totalChapters === 1 ? 'Chapter' : 'Chapters'} • {totalTopics} Topics
                      </p>
                    </div>
                    <span className="badge badge-emerald text-[10px]">
                      {avgCompletion}% Covered
                    </span>
                  </div>

                  <div className="mastery-bar">
                    <div 
                      className="mastery-bar-fill high" 
                      style={{ width: `${avgCompletion}%`, animation: 'none' }} 
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
                    <button
                      onClick={() => openBookForSubjectOrChapter(subject.name)}
                      className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Book style={{ width: '12px', height: '12px', color: '#818cf8' }} />
                      <span>Read Book</span>
                    </button>

                    <button
                      onClick={() => startQuizFromSyllabus(subject.name, undefined, undefined)}
                      className="text-brand-400 hover:text-brand-300 text-xs font-bold flex items-center gap-1"
                    >
                      <Sparkles style={{ width: '12px', height: '12px' }} />
                      <span>Generate Quiz</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Interactive Expandable Syllabus Tree ── */}
          <div className="glass rounded-3xl p-6 sm:p-8 border border-white/[0.06] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Curriculum Hierarchy &amp; Topic Explorer</h2>
                <p className="text-xs text-slate-400">Expand Subject &rarr; Chapter &rarr; Topic to trigger precision AI quizzes</p>
              </div>
              <span className="badge badge-indigo text-[10px]">Interactive Tree</span>
            </div>

            <div className="space-y-4">
              {currentSyllabus.subjects.map(subject => {
                const isSubjExpanded = expandedSubjects[subject.id] ?? false;

                return (
                  <div 
                    key={subject.id}
                    className="rounded-2xl bg-slate-900/70 border border-white/[0.06] overflow-hidden transition-all"
                  >
                    {/* Subject Row Header */}
                    <div 
                      onClick={() => toggleSubject(subject.id)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <button className="p-1 rounded-lg bg-slate-800 text-slate-400">
                          {isSubjExpanded ? (
                            <ChevronDown style={{ width: '15px', height: '15px' }} />
                          ) : (
                            <ChevronRight style={{ width: '15px', height: '15px' }} />
                          )}
                        </button>
                        <div>
                          <h4 className="text-sm font-bold text-white">{subject.name}</h4>
                          <span className="text-[11px] text-slate-400">
                            {subject.chapters.length} Chapters • {subject.chapters.reduce((sum, ch) => sum + ch.topics.length, 0)} Detailed Topics
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => startQuizFromSyllabus(subject.name, undefined, undefined)}
                          className="btn-secondary py-1 px-3 text-[11px] rounded-lg hidden sm:flex"
                        >
                          <Sparkles style={{ width: '11px', height: '11px', color: '#10b981' }} />
                          Quiz Subject
                        </button>
                      </div>
                    </div>

                    {/* Chapters List (Accordion) */}
                    {isSubjExpanded && (
                      <div className="px-4 pb-4 space-y-3 pt-2 border-t border-white/[0.04]">
                        {subject.chapters.map((chapter, idx) => {
                          const isChExpanded = expandedChapters[chapter.id] ?? false;

                          return (
                            <div
                              key={chapter.id}
                              className="rounded-xl bg-slate-950/60 border border-white/[0.04] p-3.5 space-y-3"
                            >
                              {/* Chapter Header */}
                              <div 
                                onClick={() => toggleChapter(chapter.id)}
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="w-6 h-6 rounded-lg bg-brand-500/15 text-brand-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <div>
                                    <span className="text-xs font-bold text-white hover:text-brand-400 transition-colors">
                                      {chapter.name}
                                    </span>
                                    {chapter.unitName && (
                                      <p className="text-[10px] text-slate-500">{chapter.unitName}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                  <button
                                    onClick={() => openBookForSubjectOrChapter(subject.name, chapter.name)}
                                    title="Read chapter in digital book"
                                    className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all text-[11px] flex items-center gap-1"
                                  >
                                    <BookOpen style={{ width: '12px', height: '12px' }} />
                                    <span className="hidden md:inline">Read</span>
                                  </button>

                                  <button
                                    onClick={() => startQuizFromSyllabus(subject.name, chapter.name, undefined)}
                                    title="Generate quiz on this chapter"
                                    className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all text-[11px] flex items-center gap-1 font-bold"
                                  >
                                    <Sparkles style={{ width: '12px', height: '12px' }} />
                                    <span>AI Quiz</span>
                                  </button>

                                  <button 
                                    onClick={() => toggleChapter(chapter.id)}
                                    className="p-1 rounded-md text-slate-400"
                                  >
                                    {isChExpanded ? (
                                      <ChevronDown style={{ width: '14px', height: '14px' }} />
                                    ) : (
                                      <ChevronRight style={{ width: '14px', height: '14px' }} />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Topics List */}
                              {isChExpanded && (
                                <div className="pl-8 pt-2 space-y-2 border-t border-white/[0.03] animate-fade-in-up">
                                  {chapter.topics.map((topic, tIdx) => (
                                    <div 
                                      key={tIdx}
                                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-white/[0.03] group transition-all"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                                        <span className="text-xs text-slate-300 leading-snug">{topic}</span>
                                      </div>

                                      <button
                                        onClick={() => startQuizFromSyllabus(subject.name, chapter.name, topic)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 px-2 py-0.5 rounded bg-brand-500/10"
                                      >
                                        <Sparkles style={{ width: '10px', height: '10px' }} />
                                        <span>Practice Topic</span>
                                      </button>
                                    </div>
                                  ))}
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
