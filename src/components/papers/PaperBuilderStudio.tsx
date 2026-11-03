import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText, Plus, Trash2, Edit3, Search, Filter, Printer, Download,
  Shuffle, Upload, Sparkles, Check, X, ArrowUp, ArrowDown, Move,
  Settings, HelpCircle, Layers, CheckCircle2, AlertTriangle, RefreshCw,
  FolderDown, FolderUp, Eye, EyeOff, BookOpen, Clock, School, Award
} from 'lucide-react';
import { BankQuestion, PaperMeta, PaperSection } from '../../mock/qpMockQuestions';
import { PAPER_BUILDER_SERVICE, AutoGenerateOptions } from '../../services/paperBuilderService';
import { LIVE_AI_SERVICE } from '../../services/liveAiService';
import { useApp } from '../../context/AppContext';

export const PaperBuilderStudio: React.FC = () => {
  const { setCurrentView, theme } = useApp();
  const isLight = theme === 'light';

  // Core Data State
  const [bankQuestions, setBankQuestions] = useState<BankQuestion[]>([]);
  const [sections, setSections] = useState<PaperSection[]>([]);
  const [meta, setMeta] = useState<PaperMeta>(() => PAPER_BUILDER_SERVICE.getMeta());

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<BankQuestion | null>(null);
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('Light - Reflection and Refraction');
  const [aiSubject, setAiSubject] = useState('Physics');
  const [aiCount, setAiCount] = useState(4);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [aiType, setAiType] = useState<'mcq' | 'short' | 'long' | 'case_study'>('mcq');

  // Export Settings
  const [exportIncludeAnswers, setExportIncludeAnswers] = useState(true);
  const [exportIncludeMarks, setExportIncludeMarks] = useState(true);

  // Drag & Drop State
  const [draggedQId, setDraggedQId] = useState<string | null>(null);
  const [dragSource, setDragSource] = useState<'bank' | 'section' | null>(null);
  const [dragSourceSectionId, setDragSourceSectionId] = useState<string | null>(null);
  const [activeDropSectionId, setActiveDropSectionId] = useState<string | null>(null);

  // Auto-generation form
  const [autoTargetMarks, setAutoTargetMarks] = useState(80);
  const [autoEasyPct, setAutoEasyPct] = useState(40);
  const [autoMedPct, setAutoMedPct] = useState(40);
  const [autoHardPct, setAutoHardPct] = useState(20);
  const [autoSubject, setAutoSubject] = useState('All');

  // Import raw text form
  const [importText, setImportText] = useState('');
  const [importSubject, setImportSubject] = useState('Physics');
  const [parsedImportQuestions, setParsedImportQuestions] = useState<BankQuestion[]>([]);

  // Question Form State (for Add/Edit)
  const [formText, setFormText] = useState('');
  const [formSubject, setFormSubject] = useState('Physics');
  const [formTopic, setFormTopic] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [formType, setFormType] = useState<'mcq' | 'short' | 'long' | 'fill' | 'case_study'>('mcq');
  const [formMarks, setFormMarks] = useState<number>(1);
  const [formOptions, setFormOptions] = useState<string[]>(['', '', '', '']);
  const [formAnswer, setFormAnswer] = useState('');

  // Toast message
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load initial state
  useEffect(() => {
    setBankQuestions(PAPER_BUILDER_SERVICE.getQuestions());
    setSections(PAPER_BUILDER_SERVICE.getSections());
    setMeta(PAPER_BUILDER_SERVICE.getMeta());
  }, []);

  // Compute Questions in Paper Canvas
  const questionsInPaperIds = useMemo(() => {
    const ids = new Set<string>();
    sections.forEach(s => s.questionIds.forEach((id: string) => ids.add(id)));
    return ids;
  }, [sections]);

  // Available subjects from bank
  const availableSubjects = useMemo(() => {
    const subs = new Set<string>();
    bankQuestions.forEach(q => {
      if (q.subject) subs.add(q.subject);
    });
    return Array.from(subs);
  }, [bankQuestions]);

  // Filtered Question Bank
  const filteredBankQuestions = useMemo(() => {
    return bankQuestions.filter(q => {
      const inCanvas = questionsInPaperIds.has(q.id);
      if (inCanvas) return false; // Hide if already in paper canvas

      const matchesSearch = searchQuery === '' ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject = selectedSubject === 'All' || q.subject.toLowerCase() === selectedSubject.toLowerCase();
      const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      const matchesType = selectedType === 'All' || q.type === selectedType;

      return matchesSearch && matchesSubject && matchesDifficulty && matchesType;
    });
  }, [bankQuestions, questionsInPaperIds, searchQuery, selectedSubject, selectedDifficulty, selectedType]);

  // Question lookup map
  const questionMap = useMemo(() => {
    return new Map(bankQuestions.map(q => [q.id, q]));
  }, [bankQuestions]);

  // Calculate Paper Metrics
  const paperStats = useMemo(() => {
    let totalMarks = 0;
    let easyMarks = 0;
    let medMarks = 0;
    let hardMarks = 0;
    let totalQuestions = 0;

    sections.forEach(s => {
      s.questionIds.forEach((id: string) => {
        const q = questionMap.get(id);
        if (q) {
          totalMarks += q.marks;
          totalQuestions += 1;
          if (q.difficulty === 'easy') easyMarks += q.marks;
          else if (q.difficulty === 'medium') medMarks += q.marks;
          else if (q.difficulty === 'hard') hardMarks += q.marks;
        }
      });
    });

    const easyPct = totalMarks > 0 ? Math.round((easyMarks / totalMarks) * 100) : 0;
    const medPct = totalMarks > 0 ? Math.round((medMarks / totalMarks) * 100) : 0;
    const hardPct = totalMarks > 0 ? Math.round((hardMarks / totalMarks) * 100) : 0;

    return { totalMarks, easyMarks, medMarks, hardMarks, totalQuestions, easyPct, medPct, hardPct };
  }, [sections, questionMap]);

  // ── Drag & Drop Handlers ──
  const handleDragStartFromBank = (e: React.DragEvent, qId: string) => {
    e.dataTransfer.setData('text/plain', qId);
    e.dataTransfer.effectAllowed = 'copyMove';
    setDraggedQId(qId);
    setDragSource('bank');
  };

  const handleDragStartFromSection = (e: React.DragEvent, qId: string, sectionId: string) => {
    e.dataTransfer.setData('text/plain', qId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedQId(qId);
    setDragSource('section');
    setDragSourceSectionId(sectionId);
  };

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropSectionId !== sectionId) {
      setActiveDropSectionId(sectionId);
    }
  };

  const handleDragLeave = () => {
    setActiveDropSectionId(null);
  };

  const handleDropOnSection = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    setActiveDropSectionId(null);
    const qId = e.dataTransfer.getData('text/plain') || draggedQId;
    if (!qId) return;

    if (dragSource === 'bank') {
      // Add from bank to section
      const updated = sections.map(sec => {
        if (sec.id === targetSectionId) {
          if (!sec.questionIds.includes(qId)) {
            return { ...sec, questionIds: [...sec.questionIds, qId] };
          }
        }
        return sec;
      });
      setSections(updated);
      PAPER_BUILDER_SERVICE.saveSections(updated);
      showToast('Question added to section!', 'success');
    } else if (dragSource === 'section' && dragSourceSectionId) {
      // Move between sections
      if (dragSourceSectionId === targetSectionId) return; // Same section
      const updated = sections.map(sec => {
        if (sec.id === dragSourceSectionId) {
          return { ...sec, questionIds: sec.questionIds.filter((id: string) => id !== qId) };
        }
        if (sec.id === targetSectionId) {
          return { ...sec, questionIds: [...sec.questionIds, qId] };
        }
        return sec;
      });
      setSections(updated);
      PAPER_BUILDER_SERVICE.saveSections(updated);
    }

    setDraggedQId(null);
    setDragSource(null);
    setDragSourceSectionId(null);
  };

  // Add question to section via click
  const handleAddQuestionToSection = (qId: string, sectionId: string) => {
    const updated = sections.map(sec => {
      if (sec.id === sectionId && !sec.questionIds.includes(qId)) {
        return { ...sec, questionIds: [...sec.questionIds, qId] };
      }
      return sec;
    });
    setSections(updated);
    PAPER_BUILDER_SERVICE.saveSections(updated);
    showToast('Question added to paper!', 'success');
  };

  // Remove question from section (returns to bank)
  const handleRemoveQuestionFromSection = (qId: string, sectionId: string) => {
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, questionIds: sec.questionIds.filter((id: string) => id !== qId) };
      }
      return sec;
    });
    setSections(updated);
    PAPER_BUILDER_SERVICE.saveSections(updated);
    showToast('Question removed from paper', 'info');
  };

  // Move Question Up/Down inside section
  const handleMoveQuestion = (sectionId: string, qIndex: number, direction: 'up' | 'down') => {
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        const ids = [...sec.questionIds];
        const targetIdx = direction === 'up' ? qIndex - 1 : qIndex + 1;
        if (targetIdx >= 0 && targetIdx < ids.length) {
          const temp = ids[qIndex];
          ids[qIndex] = ids[targetIdx];
          ids[targetIdx] = temp;
          return { ...sec, questionIds: ids };
        }
      }
      return sec;
    });
    setSections(updated);
    PAPER_BUILDER_SERVICE.saveSections(updated);
  };

  // Add new section
  const handleAddSection = () => {
    const secLetter = String.fromCharCode(65 + sections.length);
    const newSection: PaperSection = {
      id: `sec-${Date.now()}`,
      title: `Section ${secLetter} — General Questions`,
      questionIds: []
    };
    const updated = [...sections, newSection];
    setSections(updated);
    PAPER_BUILDER_SERVICE.saveSections(updated);
    showToast(`Added Section ${secLetter}`, 'success');
  };

  // Delete section
  const handleDeleteSection = (sectionId: string) => {
    if (sections.length <= 1) {
      showToast('You must maintain at least one section', 'error');
      return;
    }
    const updated = sections.filter(sec => sec.id !== sectionId);
    setSections(updated);
    PAPER_BUILDER_SERVICE.saveSections(updated);
    showToast('Section removed', 'info');
  };

  // Rename Section
  const handleRenameSection = (sectionId: string, newTitle: string) => {
    const updated = sections.map(sec => sec.id === sectionId ? { ...sec, title: newTitle } : sec);
    setSections(updated);
    PAPER_BUILDER_SERVICE.saveSections(updated);
  };

  // Clear Paper Canvas
  const handleClearPaper = () => {
    if (window.confirm('Are you sure you want to clear all questions from the paper canvas? (Questions remain safe in the Question Bank)')) {
      const updated = sections.map(sec => ({ ...sec, questionIds: [] }));
      setSections(updated);
      PAPER_BUILDER_SERVICE.saveSections(updated);
      showToast('Paper canvas cleared', 'info');
    }
  };

  // Auto-Generate Execution
  const handleExecuteAutoGenerate = () => {
    try {
      const opts: AutoGenerateOptions = {
        targetMarks: autoTargetMarks,
        easyPct: autoEasyPct,
        medPct: autoMedPct,
        hardPct: autoHardPct,
        subjectFilter: autoSubject === 'All' ? undefined : autoSubject
      };
      const result = PAPER_BUILDER_SERVICE.autoGenerateBalancedPaper(opts);
      setSections(result.sections);
      setShowAutoModal(false);
      showToast(`Auto-generated balanced paper (${result.totalAllocated} Marks allocated)!`, 'success');
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  // Open Edit Modal for a Question
  const handleOpenEditQuestion = (q: BankQuestion) => {
    setEditingQuestion(q);
    setFormText(q.question);
    setFormSubject(q.subject);
    setFormTopic(q.topic || '');
    setFormDifficulty(q.difficulty);
    setFormType(q.type);
    setFormMarks(q.marks);
    setFormOptions(q.options && q.options.length >= 2 ? [...q.options] : ['', '', '', '']);
    setFormAnswer(q.answer || '');
    setShowAddModal(true);
  };

  // Open Add Question Modal
  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setFormText('');
    setFormSubject(selectedSubject !== 'All' ? selectedSubject : 'Physics');
    setFormTopic('');
    setFormDifficulty('medium');
    setFormType('mcq');
    setFormMarks(1);
    setFormOptions(['', '', '', '']);
    setFormAnswer('');
    setShowAddModal(true);
  };

  // Save Question (Add or Edit)
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) {
      showToast('Question text cannot be empty', 'error');
      return;
    }

    const cleanOptions = formType === 'mcq'
      ? formOptions.map(o => o.trim()).filter(Boolean)
      : null;

    if (editingQuestion) {
      const updatedQ: BankQuestion = {
        ...editingQuestion,
        question: formText.trim(),
        subject: formSubject.trim() || 'General',
        topic: formTopic.trim() || 'General',
        difficulty: formDifficulty,
        type: formType,
        marks: Number(formMarks) || 1,
        options: cleanOptions,
        answer: formAnswer.trim()
      };
      PAPER_BUILDER_SERVICE.updateQuestion(updatedQ);
      setBankQuestions(PAPER_BUILDER_SERVICE.getQuestions());
      showToast('Question updated successfully!', 'success');
    } else {
      const newQ = PAPER_BUILDER_SERVICE.addQuestion({
        question: formText.trim(),
        subject: formSubject.trim() || 'General',
        topic: formTopic.trim() || 'General',
        difficulty: formDifficulty,
        type: formType,
        marks: Number(formMarks) || 1,
        options: cleanOptions,
        answer: formAnswer.trim()
      });
      setBankQuestions(PAPER_BUILDER_SERVICE.getQuestions());
      showToast('New question added to bank!', 'success');
    }

    setShowAddModal(false);
  };

  // Delete Question from Bank
  const handleDeleteBankQuestion = (qId: string) => {
    if (window.confirm('Delete this question from your Question Bank permanently?')) {
      PAPER_BUILDER_SERVICE.deleteQuestion(qId);
      setBankQuestions(PAPER_BUILDER_SERVICE.getQuestions());
      setSections(PAPER_BUILDER_SERVICE.getSections());
      showToast('Question deleted', 'info');
    }
  };

  // Import / OCR parse text
  const handleParseImportText = () => {
    if (!importText.trim()) {
      showToast('Please paste question paper text or notes', 'error');
      return;
    }
    const parsed = PAPER_BUILDER_SERVICE.parseQuestionsFromText(importText, importSubject);
    if (parsed.length === 0) {
      showToast('No questions could be detected. Ensure questions begin with Q1, 1., etc.', 'error');
    } else {
      setParsedImportQuestions(parsed);
      showToast(`Detected ${parsed.length} questions ready to import!`, 'success');
    }
  };

  // Commit Import
  const handleCommitImport = () => {
    if (parsedImportQuestions.length === 0) return;
    const currentBank = PAPER_BUILDER_SERVICE.getQuestions();
    const updatedBank = [...parsedImportQuestions, ...currentBank];
    PAPER_BUILDER_SERVICE.saveQuestions(updatedBank);
    setBankQuestions(updatedBank);
    setShowImportModal(false);
    setImportText('');
    setParsedImportQuestions([]);
    showToast(`Successfully imported ${parsedImportQuestions.length} questions to your Question Bank!`, 'success');
  };

  // AI Question Generation Handler
  const handleGenerateAiQuestions = async () => {
    setIsAiGenerating(true);
    try {
      const aiConfig = LIVE_AI_SERVICE.getActiveConfig();
      let generated: BankQuestion[] = [];

      if (aiConfig.provider !== 'offline') {
        const prompt = `You are an expert board examination paper setter. Generate exactly ${aiCount} examination questions on Subject: "${aiSubject}", Topic: "${aiTopic}". Difficulty: "${aiDifficulty}". Question Type: "${aiType}".
Respond with ONLY valid JSON array with this structure:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"], // or null if not mcq
    "answer": "Comprehensive answer or correct option explanation",
    "marks": ${aiType === 'mcq' ? 1 : aiType === 'short' ? 2 : aiType === 'long' ? 5 : 4},
    "difficulty": "${aiDifficulty}",
    "type": "${aiType}",
    "topic": "${aiTopic}"
  }
]`;
        try {
          const raw = await LIVE_AI_SERVICE.callLlm(prompt, { jsonMode: true, temperature: 0.7 });
          const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          if (Array.isArray(parsed) && parsed.length > 0) {
            generated = parsed.map((item, idx) => ({
              id: `q-ai-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
              question: item.question || `Board question on ${aiTopic}`,
              options: Array.isArray(item.options) ? item.options : (item.type === 'mcq' ? ['Option A', 'Option B', 'Option C', 'Option D'] : null),
              answer: item.answer || 'Refer to marking scheme guidelines',
              subject: aiSubject,
              topic: aiTopic,
              difficulty: item.difficulty || aiDifficulty,
              type: item.type || aiType,
              marks: Number(item.marks) || (item.type === 'mcq' ? 1 : item.type === 'short' ? 2 : item.type === 'long' ? 5 : 4)
            }));
          }
        } catch (err) {
          console.warn('AI generation JSON parsing failed, using heuristic generation', err);
        }
      }

      if (generated.length === 0) {
        const marks = aiType === 'mcq' ? 1 : aiType === 'short' ? 2 : aiType === 'long' ? 5 : 4;
        generated = Array.from({ length: aiCount }).map((_, i) => ({
          id: `q-ai-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          question: aiType === 'mcq'
            ? `In the study of ${aiTopic}, which of the following statements is scientifically and conceptually accurate? (Item ${i + 1})`
            : `Explain the fundamental principles, governing relations, and analytical applications of ${aiTopic}. (Problem ${i + 1})`,
          options: aiType === 'mcq' ? [
            `Magnification remains invariant under standard sign convention`,
            `Rate of reaction is directly proportional to concentration gradient`,
            `Potential difference exhibits linear dependency under uniform temperature`,
            `Dynamic equilibrium is reached when forward and reverse rates balance`
          ] : null,
          answer: `Detailed model solution for ${aiTopic} based on board marking rubric guidelines.`,
          subject: aiSubject,
          topic: aiTopic,
          difficulty: aiDifficulty,
          type: aiType,
          marks
        }));
      }

      const currentBank = PAPER_BUILDER_SERVICE.getQuestions();
      const updated = [...generated, ...currentBank];
      PAPER_BUILDER_SERVICE.saveQuestions(updated);
      setBankQuestions(updated);
      setShowAiModal(false);
      showToast(`Generated ${generated.length} AI questions added to Question Bank!`, 'success');
    } catch (e: any) {
      showToast(e.message || 'AI generation failed', 'error');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Save Meta Settings
  const handleSaveMeta = (e: React.FormEvent) => {
    e.preventDefault();
    PAPER_BUILDER_SERVICE.saveMeta(meta);
    setShowMetaModal(false);
    showToast('Examination metadata updated!', 'success');
  };

  // Export to Word
  const handleExportWord = () => {
    PAPER_BUILDER_SERVICE.exportToWordDoc(meta, sections, bankQuestions, exportIncludeAnswers, exportIncludeMarks);
    setShowExportModal(false);
    showToast('Word (.doc) question paper downloaded!', 'success');
  };

  // Print Paper
  const handlePrint = () => {
    PAPER_BUILDER_SERVICE.printPaper(meta, sections, bankQuestions, exportIncludeAnswers);
    setShowExportModal(false);
  };

  // Backup & Restore
  const handleDownloadBackup = () => {
    PAPER_BUILDER_SERVICE.exportBackup();
    showToast('Question bank backup downloaded (.json)', 'success');
  };

  const handleFileUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const res = PAPER_BUILDER_SERVICE.importBackup(text);
        setBankQuestions(PAPER_BUILDER_SERVICE.getQuestions());
        setSections(PAPER_BUILDER_SERVICE.getSections());
        setMeta(PAPER_BUILDER_SERVICE.getMeta());
        setShowBackupModal(false);
        showToast(`Restored ${res.questionsCount} questions and ${res.sectionsCount} sections!`, 'success');
      } catch (err: any) {
        showToast(err.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`min-h-screen ${isLight ? 'bg-slate-100/70 text-slate-900' : 'bg-[#07090e] text-[#f8fafc]'} flex flex-col transition-colors duration-200`}>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border text-xs font-semibold backdrop-blur-md animate-slide-in ${
          toast.type === 'success'
            ? isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : toast.type === 'error'
            ? isLight ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            : isLight ? 'bg-blue-50 text-blue-800 border-blue-300' : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
        }`}>
          {toast.type === 'success' ? <Check className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── Top Header & Action Studio Bar ── */}
      <header className={`border-b ${isLight ? 'border-slate-200 bg-white/95 text-slate-900 shadow-sm' : 'border-white/10 bg-[#0c111d]/90 text-white'} backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3.5`}>
        <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00b87c] to-[#047857] p-2 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-white/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`font-display font-black text-lg ${isLight ? 'text-slate-900' : 'text-white'} tracking-tight`}>
                  Question Paper Studio
                </h1>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${
                  isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-[#00b87c]/20 text-[#34d399] border-[#00b87c]/30'
                }`}>
                  QP-M Maker
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Split-screen drag &amp; drop canvas • Target-balanced auto assembler • Word &amp; A4 Print
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Marks Pill */}
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold ${
              paperStats.totalMarks === meta.targetMarks
                ? isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : paperStats.totalMarks < meta.targetMarks
                ? isLight ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : isLight ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
            }`}>
              <span>Paper Marks:</span>
              <span className="text-sm font-extrabold">{paperStats.totalMarks} / {meta.targetMarks}</span>
              {paperStats.totalMarks === meta.targetMarks ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ) : (
                <span className="text-[10px] uppercase font-sans">
                  ({paperStats.totalMarks < meta.targetMarks ? `-${meta.targetMarks - paperStats.totalMarks}` : `+${paperStats.totalMarks - meta.targetMarks}`})
                </span>
              )}
            </div>

            {/* Questions count pill */}
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-medium ${
              isLight ? 'border-slate-200 bg-slate-100 text-slate-700' : 'border-white/10 bg-white/[0.04] text-slate-300'
            }`}>
              Questions: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{paperStats.totalQuestions}</strong>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setCurrentView('ai-paper-gen')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors border ${
                isLight 
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200' 
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}
              title="Generate a full examination paper using AI Blueprint Generator"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Blueprint Mode</span>
            </button>

            <button
              onClick={() => setShowAutoModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
              title="Automatically assemble a balanced paper"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Auto-Assemble</span>
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className={`px-3 py-1.5 rounded-xl border font-medium text-xs flex items-center gap-1.5 transition-colors ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' 
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border-white/10'
              }`}
              title="Import or OCR questions from text or documents"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-500" />
              <span>Import / OCR</span>
            </button>

            <button
              onClick={() => setShowMetaModal(true)}
              className={`px-3 py-1.5 rounded-xl border font-medium text-xs flex items-center gap-1.5 transition-colors ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' 
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border-white/10'
              }`}
              title="Set School Name, Time, Grade, and Instructions"
            >
              <Settings className="w-3.5 h-3.5 text-amber-500" />
              <span>Header &amp; Rules</span>
            </button>

            <button
              onClick={() => setShowBackupModal(true)}
              className={`px-3 py-1.5 rounded-xl border font-medium text-xs flex items-center gap-1.5 transition-colors ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' 
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border-white/10'
              }`}
              title="JSON backup & restore"
            >
              <FolderDown className="w-3.5 h-3.5 text-purple-500" />
              <span>Backup</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Paper</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Split-Screen Workspace ── */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* ═════════════════════════════════════════════════════════════════
            LEFT COLUMN (5 Cols): Interactive Question Bank
            ═════════════════════════════════════════════════════════════════ */}
        <section className={`lg:col-span-5 flex flex-col rounded-3xl border overflow-hidden h-[calc(100vh-140px)] transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50' : 'bg-[#0b0f19] border-white/10 shadow-2xl'
        }`}>
          
          {/* Bank Header & Controls */}
          <div className={`p-4 border-b space-y-3 ${
            isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-[#0d1322] border-white/10'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#00b87c]" />
                <h2 className={`font-display font-extrabold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Question Bank</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-slate-300'
                }`}>
                  {filteredBankQuestions.length} Available
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAiModal(true)}
                  className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                  title="Generate new questions using AI"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                  <span>AI Generate</span>
                </button>

                <button
                  onClick={handleOpenAddQuestion}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all ${
                    isLight 
                      ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm' 
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  }`}
                  title="Add question manually"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search topics, keywords, text..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:border-[#00b87c] ${
                  isLight 
                    ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400' 
                    : 'bg-slate-900 border-white/10 text-white placeholder-slate-500'
                }`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">
                  ✕
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              {/* Subject */}
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className={`px-2 py-1.5 rounded-lg border focus:outline-none focus:border-[#00b87c] ${
                  isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-white/10 text-slate-300'
                }`}
              >
                <option value="All">All Subjects</option>
                {availableSubjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>

              {/* Difficulty */}
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className={`px-2 py-1.5 rounded-lg border focus:outline-none focus:border-[#00b87c] ${
                  isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-white/10 text-slate-300'
                }`}
              >
                <option value="All">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              {/* Type */}
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className={`px-2 py-1.5 rounded-lg border focus:outline-none focus:border-[#00b87c] ${
                  isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-white/10 text-slate-300'
                }`}
              >
                <option value="All">All Types</option>
                <option value="mcq">MCQ</option>
                <option value="short">Short Answer</option>
                <option value="long">Long Answer</option>
                <option value="fill">Fill in Blank</option>
                <option value="case_study">Case Study</option>
              </select>
            </div>
          </div>

          {/* Bank Questions Scrollable List */}
          <div className={`flex-1 overflow-y-auto p-3 space-y-2.5 divide-y ${isLight ? 'divide-slate-100 bg-slate-50/50' : 'divide-white/[0.04]'}`}>
            {filteredBankQuestions.length === 0 ? (
              <div className="py-16 text-center text-slate-500 space-y-3">
                <HelpCircle className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-xs max-w-xs mx-auto">
                  No questions match your current search/filters, or all matching questions are already placed on the paper canvas.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedSubject('All'); setSelectedDifficulty('All'); setSelectedType('All'); }}
                  className={`px-3 py-1 rounded-lg text-xs border ${
                    isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200' : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  }`}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredBankQuestions.map(q => (
                <div
                  key={q.id}
                  draggable
                  onDragStart={e => handleDragStartFromBank(e, q.id)}
                  className={`group relative pt-2.5 p-3 rounded-2xl border transition-all cursor-grab active:cursor-grabbing shadow-sm ${
                    isLight 
                      ? 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-emerald-500/50 hover:shadow-md' 
                      : 'bg-slate-900/70 hover:bg-slate-800/80 border-white/[0.08] hover:border-[#00b87c]/40'
                  }`}
                >
                  {/* Meta strip */}
                  <div className="flex items-center justify-between gap-2 mb-1.5 text-[10px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                        isLight ? 'bg-slate-100 text-slate-700' : 'bg-white/10 text-slate-200'
                      }`}>
                        {q.marks} Mark{q.marks > 1 ? 's' : ''}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                        q.difficulty === 'easy'
                          ? 'bg-emerald-500/20 text-emerald-600'
                          : q.difficulty === 'medium'
                          ? 'bg-amber-500/20 text-amber-600'
                          : 'bg-rose-500/20 text-rose-600'
                      }`}>
                        {q.difficulty}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-500 font-medium">
                        {q.subject}
                      </span>
                      {q.topic && (
                        <span className="text-slate-400 truncate max-w-[120px]">
                          • {q.topic}
                        </span>
                      )}
                    </div>

                    {/* Drag hint icon */}
                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-600">
                      <Move className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Question Text */}
                  <p className={`text-xs leading-relaxed font-medium line-clamp-3 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    {q.question}
                  </p>

                  {/* MCQ Options preview snippet */}
                  {q.type === 'mcq' && q.options && q.options.length > 0 && (
                    <div className={`grid grid-cols-2 gap-1 mt-2 text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {q.options.slice(0, 4).map((opt: string, i: number) => (
                        <div key={i} className="truncate">
                          ({String.fromCharCode(97 + i)}) {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Card hover action bar */}
                  <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] ${
                    isLight ? 'border-slate-100' : 'border-white/[0.06]'
                  }`}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditQuestion(q)}
                        className={`p-1 rounded transition-colors ${
                          isLight ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-700' : 'hover:bg-white/10 text-slate-400 hover:text-white'
                        }`}
                        title="Edit Question"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteBankQuestion(q.id)}
                        className="p-1 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Quick Add Dropdown */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 hidden sm:inline">Add to:</span>
                      {sections.map((sec, idx) => (
                        <button
                          key={sec.id}
                          onClick={() => handleAddQuestionToSection(q.id, sec.id)}
                          className="px-2 py-0.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-600 hover:text-white font-mono font-bold text-[10px] transition-all"
                          title={`Add directly to ${sec.title}`}
                        >
                          +{String.fromCharCode(65 + idx)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════
            RIGHT COLUMN (7 Cols): Split-Screen Paper Canvas with Sections
            ═════════════════════════════════════════════════════════════════ */}
        <section className={`lg:col-span-7 flex flex-col rounded-3xl border overflow-hidden h-[calc(100vh-140px)] transition-all ${
          isLight ? 'bg-slate-100/70 border-slate-200 shadow-xl shadow-slate-200/50' : 'bg-[#0b0f19] border-white/10 shadow-2xl'
        }`}>
          
          {/* Paper Canvas Header & Metadata Strip */}
          <div className={`p-4 border-b space-y-3 ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0d1322] border-white/10 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-display font-extrabold text-base tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {meta.school}
                </h3>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {meta.exam} • {meta.subject} ({meta.grade}) • {meta.time}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearPaper}
                  className={`px-2.5 py-1 rounded-xl text-xs transition-colors ${
                    isLight ? 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600' : 'bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300'
                  }`}
                  title="Clear all questions from canvas"
                >
                  Clear Canvas
                </button>
                <button
                  onClick={handleAddSection}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200' 
                      : 'bg-white/[0.08] hover:bg-white/[0.15] text-white border-white/10'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-500" />
                  <span>New Section</span>
                </button>
              </div>
            </div>

            {/* Live Marks & Difficulty Balance HUD */}
            <div className={`p-3 rounded-2xl border space-y-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-white/[0.06]'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Difficulty Distribution:</span>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="text-emerald-500 font-bold">Easy: {paperStats.easyPct}% ({paperStats.easyMarks}m)</span>
                  <span className="text-amber-500 font-bold">Med: {paperStats.medPct}% ({paperStats.medMarks}m)</span>
                  <span className="text-rose-500 font-bold">Hard: {paperStats.hardPct}% ({paperStats.hardMarks}m)</span>
                </div>
              </div>

              {/* Segmented Progress Bar */}
              <div className={`h-2 w-full rounded-full overflow-hidden flex ${isLight ? 'bg-slate-200' : 'bg-slate-900'}`}>
                <div style={{ width: `${paperStats.easyPct}%` }} className="bg-emerald-500 transition-all duration-300" title={`Easy: ${paperStats.easyPct}%`} />
                <div style={{ width: `${paperStats.medPct}%` }} className="bg-amber-500 transition-all duration-300" title={`Medium: ${paperStats.medPct}%`} />
                <div style={{ width: `${paperStats.hardPct}%` }} className="bg-rose-500 transition-all duration-300" title={`Hard: ${paperStats.hardPct}%`} />
              </div>
            </div>
          </div>

          {/* Canvas Scrollable Sections Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {sections.map((section, secIndex) => {
              const secQuestions = section.questionIds.map((id: string) => questionMap.get(id)).filter(Boolean) as BankQuestion[];
              const secSubtotal = secQuestions.reduce((acc, q) => acc + q.marks, 0);
              const isDropTarget = activeDropSectionId === section.id;

              return (
                <div
                  key={section.id}
                  onDragOver={e => handleDragOver(e, section.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={e => handleDropOnSection(e, section.id)}
                  className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                    isDropTarget
                      ? 'border-[#00b87c] bg-[#00b87c]/5 ring-2 ring-[#00b87c]/20'
                      : isLight 
                        ? 'border-slate-200 bg-white shadow-sm' 
                        : 'border-white/10 bg-slate-900/60'
                  }`}
                >
                  {/* Section Title Bar */}
                  <div className={`p-3.5 border-b flex items-center justify-between gap-3 ${
                    isLight ? 'bg-slate-50/90 border-slate-200' : 'bg-slate-900/90 border-white/[0.08]'
                  }`}>
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + secIndex)}
                      </span>
                      <input
                        type="text"
                        value={section.title}
                        onChange={e => handleRenameSection(section.id, e.target.value)}
                        className={`bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#00b87c] text-sm font-bold focus:outline-none w-full ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isLight ? 'bg-slate-100 text-slate-700' : 'bg-white/10 text-slate-300'
                      }`}>
                        {secSubtotal} Marks ({secQuestions.length} Qs)
                      </span>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-1 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Section Questions Droppable List */}
                  <div className="p-3 space-y-2">
                    {secQuestions.length === 0 ? (
                      <div className={`py-8 text-center border-2 border-dashed rounded-2xl p-4 text-xs ${
                        isLight ? 'border-slate-200 text-slate-400' : 'border-white/10 text-slate-500'
                      }`}>
                        <Move className="w-5 h-5 mx-auto mb-1 text-slate-400 animate-bounce" />
                        <p>Drag and drop questions from the bank here</p>
                      </div>
                    ) : (
                      secQuestions.map((q, qIndex) => (
                        <div
                          key={q.id}
                          draggable
                          onDragStart={e => handleDragStartFromSection(e, q.id, section.id)}
                          className={`group relative p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                            isLight 
                              ? 'bg-slate-50/80 hover:bg-white border-slate-200 shadow-sm' 
                              : 'bg-slate-950/80 hover:bg-slate-900/90 border-white/[0.06] hover:border-white/20'
                          }`}
                        >
                          {/* Reorder Up/Down controls */}
                          <div className="flex flex-col gap-0.5 text-slate-400 shrink-0 mt-0.5">
                            <button
                              onClick={() => handleMoveQuestion(section.id, qIndex, 'up')}
                              disabled={qIndex === 0}
                              className="p-0.5 hover:text-slate-900 dark:hover:text-white disabled:opacity-20"
                              title="Move Question Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-[10px] text-center font-bold text-slate-500">
                              {qIndex + 1}
                            </span>
                            <button
                              onClick={() => handleMoveQuestion(section.id, qIndex, 'down')}
                              disabled={qIndex === secQuestions.length - 1}
                              className="p-0.5 hover:text-slate-900 dark:hover:text-white disabled:opacity-20"
                              title="Move Question Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Question Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {q.subject} • {q.topic}
                              </span>
                              <span className="font-mono font-bold text-xs text-emerald-600">
                                [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                              </span>
                            </div>

                            <p className={`text-xs leading-relaxed font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {q.question}
                            </p>

                            {/* MCQ Options grid */}
                            {q.type === 'mcq' && q.options && q.options.length > 0 && (
                              <div className={`grid grid-cols-2 gap-1.5 mt-2 text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                                {q.options.map((opt: string, i: number) => (
                                  <div key={i} className="truncate">
                                    <span className="text-slate-400 font-mono">({String.fromCharCode(97 + i)})</span> {opt}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Answer Key preview snippet if available */}
                            {q.answer && (
                              <div className={`mt-2 text-[10px] p-1.5 rounded-lg border line-clamp-1 ${
                                isLight 
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                  : 'bg-emerald-950/30 text-emerald-300/80 border-emerald-500/20'
                              }`}>
                                <strong className="text-emerald-600">Ans:</strong> {q.answer}
                              </div>
                            )}
                          </div>

                          {/* Remove from canvas button */}
                          <button
                            onClick={() => handleRemoveQuestionFromSection(q.id, section.id)}
                            className="p-1 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-500 transition-colors"
                            title="Remove from paper (returns to question bank)"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          MODAL: ADD / EDIT QUESTION
          ═════════════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto ${
          isLight ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'
        }`}>
          <div className={`max-w-xl w-full rounded-3xl border p-6 shadow-2xl space-y-4 transition-all ${
            isLight ? 'bg-white border-slate-200 text-slate-900 shadow-2xl' : 'bg-[#0d1322] border-white/10 text-white shadow-2xl'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <h3 className={`font-display font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {editingQuestion ? 'Edit Question' : 'Add Question to Bank'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className={`text-sm ${
                isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
              }`}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Question Text</label>
                <textarea
                  rows={3}
                  value={formText}
                  onChange={e => setFormText(e.target.value)}
                  placeholder="Enter clear, comprehensive question statement..."
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-[#00b87c] ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Subject</label>
                  <input
                    type="text"
                    value={formSubject}
                    onChange={e => setFormSubject(e.target.value)}
                    placeholder="e.g. Physics"
                    className={`w-full p-2 rounded-xl border focus:outline-none focus:border-[#00b87c] ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Topic/Chapter</label>
                  <input
                    type="text"
                    value={formTopic}
                    onChange={e => setFormTopic(e.target.value)}
                    placeholder="e.g. Optics"
                    className={`w-full p-2 rounded-xl border focus:outline-none focus:border-[#00b87c] ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={e => setFormDifficulty(e.target.value as any)}
                    className={`w-full p-2 rounded-xl border focus:outline-none focus:border-[#00b87c] ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                    }`}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Marks</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formMarks}
                    onChange={e => setFormMarks(Number(e.target.value))}
                    className={`w-full p-2 rounded-xl border focus:outline-none focus:border-[#00b87c] ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Question Type</label>
                <div className="flex gap-2">
                  {(['mcq', 'short', 'long', 'fill', 'case_study'] as const).map(t => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setFormType(t)}
                      className={`flex-1 py-1.5 rounded-xl font-bold uppercase text-[10px] transition-all ${
                        formType === t
                          ? 'bg-[#00b87c] text-white shadow'
                          : isLight
                            ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                            : 'bg-slate-900 text-slate-400 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options builder for MCQ */}
              {formType === 'mcq' && (
                <div className="space-y-2">
                  <label className={`block font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Multiple Choice Options (4 Choices)</label>
                  {formOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`font-mono w-5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>({String.fromCharCode(97 + i)})</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={e => {
                          const updated = [...formOptions];
                          updated[i] = e.target.value;
                          setFormOptions(updated);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        className={`flex-1 p-2 rounded-xl border text-xs focus:outline-none focus:border-[#00b87c] ${
                          isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Correct Answer / Model Solution</label>
                <textarea
                  rows={2}
                  value={formAnswer}
                  onChange={e => setFormAnswer(e.target.value)}
                  placeholder="Official answer, step-by-step proof, or rubric explanation..."
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-[#00b87c] ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                  }`}
                />
              </div>

              <div className={`flex items-center justify-end gap-2 pt-3 border-t ${
                isLight ? 'border-slate-200' : 'border-white/10'
              }`}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-xl font-semibold text-xs transition-colors ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00b87c] hover:bg-[#009b67] text-white font-bold text-xs shadow-md"
                >
                  {editingQuestion ? 'Update Question' : 'Save to Bank'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          MODAL: AUTO-ASSEMBLE BALANCED PAPER
          ═════════════════════════════════════════════════════════════════ */}
      {showAutoModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto ${
          isLight ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'
        }`}>
          <div className={`max-w-md w-full rounded-3xl border p-6 shadow-2xl space-y-5 transition-all ${
            isLight ? 'bg-white border-slate-200 text-slate-900 shadow-2xl' : 'bg-[#0d1322] border-white/10 text-white shadow-2xl'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <div className="flex items-center gap-2">
                <Shuffle className="w-5 h-5 text-emerald-500" />
                <h3 className={`font-display font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>Auto-Assemble Paper</h3>
              </div>
              <button onClick={() => setShowAutoModal(false)} className={`text-sm ${
                isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
              }`}>
                ✕
              </button>
            </div>

            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Paper Pulse will intelligently select and allocate questions from your bank into balanced sections matching your target marks and difficulty distribution.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Target Total Marks</label>
                <input
                  type="number"
                  min={10}
                  max={200}
                  value={autoTargetMarks}
                  onChange={e => setAutoTargetMarks(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border font-bold text-sm focus:outline-none focus:border-[#00b87c] ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Subject Focus</label>
                <select
                  value={autoSubject}
                  onChange={e => setAutoSubject(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-[#00b87c] ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                  }`}
                >
                  <option value="All">All Subjects (Combined Science &amp; Math)</option>
                  {availableSubjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Ratio Sliders */}
              <div className={`space-y-2 p-3 rounded-2xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/[0.06]'
              }`}>
                <span className={`block font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Difficulty Ratio Target (%):</span>
                
                <div>
                  <div className={`flex justify-between text-[11px] mb-0.5 ${isLight ? 'text-emerald-700 font-medium' : 'text-emerald-400'}`}>
                    <span>Easy Questions:</span>
                    <span>{autoEasyPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={autoEasyPct}
                    onChange={e => {
                      const v = Number(e.target.value);
                      setAutoEasyPct(v);
                      setAutoHardPct(Math.max(0, 100 - v - autoMedPct));
                    }}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className={`flex justify-between text-[11px] mb-0.5 ${isLight ? 'text-amber-700 font-medium' : 'text-amber-400'}`}>
                    <span>Medium Questions:</span>
                    <span>{autoMedPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={autoMedPct}
                    onChange={e => {
                      const v = Number(e.target.value);
                      setAutoMedPct(v);
                      setAutoHardPct(Math.max(0, 100 - autoEasyPct - v));
                    }}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className={`flex justify-between text-[11px] mb-0.5 ${isLight ? 'text-rose-700 font-medium' : 'text-rose-400'}`}>
                    <span>Hard / Rigorous Questions:</span>
                    <span>{autoHardPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={autoHardPct}
                    onChange={e => {
                      const v = Number(e.target.value);
                      setAutoHardPct(v);
                    }}
                    className="w-full accent-rose-500"
                  />
                </div>
              </div>
            </div>

            <div className={`flex items-center justify-end gap-2 pt-3 border-t ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <button
                onClick={() => setShowAutoModal(false)}
                className={`px-4 py-2 rounded-xl font-semibold text-xs transition-colors ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAutoGenerate}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg"
              >
                Assemble Balanced Paper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          MODAL: IMPORT / OCR QUESTIONS
          ═════════════════════════════════════════════════════════════════ */}
      {showImportModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto ${
          isLight ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'
        }`}>
          <div className={`max-w-2xl w-full rounded-3xl border p-6 shadow-2xl space-y-4 transition-all ${
            isLight ? 'bg-white border-slate-200 text-slate-900 shadow-2xl' : 'bg-[#0d1322] border-white/10 text-white shadow-2xl'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-500" />
                <h3 className={`font-display font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>Import Questions via Text or OCR</h3>
              </div>
              <button onClick={() => setShowImportModal(false)} className={`text-sm ${
                isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
              }`}>
                ✕
              </button>
            </div>

            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Paste raw questions from syllabus documents, scanned test papers, or notes. Questions formatted with <code>Q1. ...</code> and <code>(a) ... (b) ...</code> are parsed automatically!
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Assign Subject</label>
                  <input
                    type="text"
                    value={importSubject}
                    onChange={e => setImportSubject(e.target.value)}
                    className={`w-full p-2 rounded-xl border focus:outline-none focus:border-cyan-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                    }`}
                    placeholder="e.g. Physics"
                  />
                </div>
                <div className="self-end">
                  <button
                    onClick={handleParseImportText}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Parse Questions
                  </button>
                </div>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Paste Raw Text</label>
                <textarea
                  rows={8}
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                  placeholder={`Q1. What is the SI unit of electric potential difference?\n(a) Ampere\n(b) Volt\n(c) Ohm\n(d) Watt\nAns: Volt\n\nQ2. State Ohm's law and write its mathematical formula.\nAns: V = I * R`}
                  className={`w-full p-3 rounded-2xl border font-mono text-xs focus:outline-none focus:border-cyan-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-white/10 text-white'
                  }`}
                />
              </div>

              {/* Parsed Preview */}
              {parsedImportQuestions.length > 0 && (
                <div className={`space-y-2 p-3 rounded-2xl border ${
                  isLight ? 'bg-cyan-50/70 border-cyan-200 text-slate-800' : 'bg-slate-900 border-cyan-500/30'
                }`}>
                  <span className={`font-bold ${isLight ? 'text-cyan-800' : 'text-cyan-400'}`}>
                    {parsedImportQuestions.length} Questions Detected:
                  </span>
                  <div className={`max-h-40 overflow-y-auto space-y-2 divide-y pr-2 ${
                    isLight ? 'divide-cyan-100' : 'divide-white/5'
                  }`}>
                    {parsedImportQuestions.map((q, idx) => (
                      <div key={idx} className={`pt-2 text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <strong>Q{idx + 1}.</strong> {q.question} ({q.marks} Mark)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={`flex items-center justify-end gap-2 pt-3 border-t ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <button
                onClick={() => setShowImportModal(false)}
                className={`px-4 py-2 rounded-xl font-semibold text-xs transition-colors ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCommitImport}
                disabled={parsedImportQuestions.length === 0}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white font-bold text-xs shadow-md"
              >
                Add {parsedImportQuestions.length} Questions to Bank
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          MODAL: EXAM SETTINGS & HEADER
          ═════════════════════════════════════════════════════════════════ */}
      {showMetaModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto ${
          isLight ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'
        }`}>
          <div className={`max-w-lg w-full rounded-3xl border p-6 shadow-2xl space-y-4 transition-all ${
            isLight ? 'bg-white border-slate-200 text-slate-900 shadow-2xl' : 'bg-[#0d1322] border-white/10 text-white shadow-2xl'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-amber-500" />
                <h3 className={`font-display font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>Paper Header &amp; Instructions</h3>
              </div>
              <button onClick={() => setShowMetaModal(false)} className={`text-sm ${
                isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
              }`}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMeta} className="space-y-3.5 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>School / Institution Name</label>
                <input
                  type="text"
                  value={meta.school}
                  onChange={e => setMeta({ ...meta, school: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border font-bold focus:outline-none focus:border-amber-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Examination Title</label>
                <input
                  type="text"
                  value={meta.exam}
                  onChange={e => setMeta({ ...meta, exam: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-amber-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Subject</label>
                  <input
                    type="text"
                    value={meta.subject}
                    onChange={e => setMeta({ ...meta, subject: e.target.value })}
                    className={`w-full p-2 rounded-xl border focus:outline-none focus:border-amber-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Grade / Class</label>
                  <input
                    type="text"
                    value={meta.grade}
                    onChange={e => setMeta({ ...meta, grade: e.target.value })}
                    className={`w-full p-2 rounded-xl border focus:outline-none focus:border-amber-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Time Allowed</label>
                  <input
                    type="text"
                    value={meta.time}
                    onChange={e => setMeta({ ...meta, time: e.target.value })}
                    className={`w-full p-2 rounded-xl border focus:outline-none focus:border-amber-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Target Maximum Marks</label>
                  <input
                    type="number"
                    min={1}
                    value={meta.targetMarks}
                    onChange={e => setMeta({ ...meta, targetMarks: Number(e.target.value) })}
                    className={`w-full p-2 rounded-xl border focus:outline-none focus:border-amber-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>General Instructions to Candidates (One per line)</label>
                <textarea
                  rows={4}
                  value={meta.instructions.join('\n')}
                  onChange={e => setMeta({ ...meta, instructions: e.target.value.split('\n').filter(Boolean) })}
                  className={`w-full p-2.5 rounded-xl border font-mono text-xs focus:outline-none focus:border-amber-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                  }`}
                />
              </div>

              <div className={`flex items-center justify-end gap-2 pt-3 border-t ${
                isLight ? 'border-slate-200' : 'border-white/10'
              }`}>
                <button
                  type="button"
                  onClick={() => setShowMetaModal(false)}
                  className={`px-4 py-2 rounded-xl font-semibold text-xs transition-colors ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          MODAL: EXPORT & PRINT STUDIO
          ═════════════════════════════════════════════════════════════════ */}
      {showExportModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto ${
          isLight ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'
        }`}>
          <div className={`max-w-md w-full rounded-3xl border p-6 shadow-2xl space-y-5 transition-all ${
            isLight ? 'bg-white border-slate-200 text-slate-900 shadow-2xl' : 'bg-[#0d1322] border-white/10 text-white shadow-2xl'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-500" />
                <h3 className={`font-display font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>Export &amp; Print Paper</h3>
              </div>
              <button onClick={() => setShowExportModal(false)} className={`text-sm ${
                isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
              }`}>
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className={`p-3.5 rounded-2xl border space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Total Paper Marks:</span>
                  <span className={`font-bold font-mono ${isLight ? 'text-emerald-750 text-emerald-700' : 'text-emerald-400'}`}>{paperStats.totalMarks} Marks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Total Questions:</span>
                  <span className={`font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{paperStats.totalQuestions} Questions</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2">
                <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer ${
                  isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-slate-900/60 border-white/[0.06] hover:border-white/10'
                }`}>
                  <div>
                    <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Include Answer Key &amp; Solutions</div>
                    <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Append full marking scheme at the end of the document</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={exportIncludeAnswers}
                    onChange={e => setExportIncludeAnswers(e.target.checked)}
                    className="w-4 h-4 accent-[#00b87c] rounded"
                  />
                </label>

                <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer ${
                  isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-slate-900/60 border-white/[0.06] hover:border-white/10'
                }`}>
                  <div>
                    <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Show Marks per Question</div>
                    <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Display right-aligned [Marks] on each question</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={exportIncludeMarks}
                    onChange={e => setExportIncludeMarks(e.target.checked)}
                    className="w-4 h-4 accent-[#00b87c] rounded"
                  />
                </label>
              </div>

              {/* Action Choices */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-center font-bold space-y-1 shadow-lg transition-all"
                >
                  <Printer className="w-5 h-5 mx-auto text-emerald-200" />
                  <div>Print / A4 PDF</div>
                  <div className="text-[10px] text-emerald-200 font-normal">Native clean layout</div>
                </button>

                <button
                  onClick={handleExportWord}
                  className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-center font-bold space-y-1 shadow-lg transition-all"
                >
                  <FileText className="w-5 h-5 mx-auto text-blue-200" />
                  <div>Word (.doc)</div>
                  <div className="text-[10px] text-blue-200 font-normal">Editable Microsoft Word</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          MODAL: BACKUP & RESTORE
          ═════════════════════════════════════════════════════════════════ */}
      {showBackupModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto ${
          isLight ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'
        }`}>
          <div className={`max-w-md w-full rounded-3xl border p-6 shadow-2xl space-y-4 transition-all ${
            isLight ? 'bg-white border-slate-200 text-slate-900 shadow-2xl' : 'bg-[#0d1322] border-white/10 text-white shadow-2xl'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <div className="flex items-center gap-2">
                <FolderDown className="w-5 h-5 text-purple-500" />
                <h3 className={`font-display font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>JSON Backup &amp; Restore</h3>
              </div>
              <button onClick={() => setShowBackupModal(false)} className={`text-sm ${
                isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
              }`}>
                ✕
              </button>
            </div>

            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Export your entire Question Bank and custom paper layouts as a portable JSON file to back up or transfer between devices.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleDownloadBackup}
                className={`w-full p-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  isLight
                    ? 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-900'
                    : 'bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/40 text-purple-200'
                }`}
              >
                <FolderDown className="w-4 h-4" />
                <span>Download Question Bank JSON</span>
              </button>

              <label className={`w-full p-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-200'
              }`}>
                <FolderUp className="w-4 h-4 text-emerald-500" />
                <span>Restore from JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUploadBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          MODAL: AI QUESTION GENERATOR
          ═════════════════════════════════════════════════════════════════ */}
      {showAiModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto ${
          isLight ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'
        }`}>
          <div className={`max-w-lg w-full rounded-3xl border p-6 shadow-2xl space-y-4 transition-all ${
            isLight ? 'bg-white border-slate-200 text-slate-900 shadow-2xl' : 'bg-[#0d1322] border-white/10 text-white shadow-2xl'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-display font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>AI Question Generator</h3>
                  <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Synthesize board-standard questions into your Question Bank</p>
                </div>
              </div>
              <button onClick={() => setShowAiModal(false)} className={`text-sm ${
                isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
              }`}>
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Subject</label>
                <input
                  type="text"
                  value={aiSubject}
                  onChange={e => setAiSubject(e.target.value)}
                  placeholder="e.g. Physics, Mathematics, Biology, Chemistry, English"
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-emerald-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Chapter / Topic</label>
                <textarea
                  rows={2}
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  placeholder="e.g. Chemical Reactions, Lens Formula, Triangle Theorems"
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-emerald-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Count</label>
                  <select
                    value={aiCount}
                    onChange={e => setAiCount(Number(e.target.value))}
                    className={`w-full p-2 rounded-xl border focus:outline-none focus:border-emerald-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                    }`}
                  >
                    <option value={2}>2 Questions</option>
                    <option value={4}>4 Questions</option>
                    <option value={6}>6 Questions</option>
                    <option value={8}>8 Questions</option>
                  </select>
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Type</label>
                  <select
                    value={aiType}
                    onChange={e => setAiType(e.target.value as any)}
                    className={`w-full p-2 rounded-xl border focus:outline-none focus:border-emerald-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                    }`}
                  >
                    <option value="mcq">MCQ (1 Mark)</option>
                    <option value="short">Short (2 Marks)</option>
                    <option value="long">Long (5 Marks)</option>
                    <option value="case_study">Case Study (4 Marks)</option>
                  </select>
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Difficulty</label>
                  <select
                    value={aiDifficulty}
                    onChange={e => setAiDifficulty(e.target.value as any)}
                    className={`w-full p-2 rounded-xl border focus:outline-none focus:border-emerald-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
                    }`}
                  >
                    <option value="easy">Easy (Foundational)</option>
                    <option value="medium">Medium (Standard)</option>
                    <option value="hard">Hard (Advanced)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={`flex items-center justify-end gap-2 pt-3 border-t ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                disabled={isAiGenerating}
                className={`px-4 py-2 rounded-xl font-semibold text-xs transition-colors ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateAiQuestions}
                disabled={isAiGenerating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {isAiGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating Questions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate &amp; Add to Bank</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
