import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Trash2, 
  Plus, 
  RotateCcw, 
  RotateCw, 
  Sparkles, 
  ChevronUp, 
  ChevronDown,
  ArrowRightLeft,
  CheckCircle2,
  FileText,
  Clock,
  Eye,
  Sliders,
  X
} from 'lucide-react';
import { db } from '../../db';
import { SavedPaper, PaperSection, PaperQuestion, QuestionItem } from '../../types';
import { exportQuestionPaperDocx, exportAnswerKeyDocx, exportPrintReadyPdf, exportPaperJson } from '../../services/paperExportService';
import { AI_PROVIDER_SERVICE } from '../../services/aiProviderService';
import { Button, IconButton } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DropdownMenu } from '../ui/DropdownMenu';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Card, CardContent } from '../ui/Card';
import { useToast } from '../ui/Toast';

export interface PaperEditorViewProps {
  paperId: string;
  onBack: () => void;
}

export const PaperEditorView: React.FC<PaperEditorViewProps> = ({ paperId, onBack }) => {
  const { success, error } = useToast();
  const [paper, setPaper] = useState<SavedPaper | null>(null);
  const [activeSet, setActiveSet] = useState<'Original' | 'Set A' | 'Set B' | 'Set C'>('Original');
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving'>('saved');
  const [regeneratingQId, setRegeneratingQId] = useState<string | null>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<SavedPaper[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Swap modal
  const [swapTarget, setSwapTarget] = useState<{ sectionId: string; questionId: string } | null>(null);
  const [bankQuestions, setBankQuestions] = useState<QuestionItem[]>([]);

  const autosaveTimerRef = useRef<any>(null);

  useEffect(() => {
    loadPaper();
  }, [paperId]);

  const loadPaper = async () => {
    const p = await db.savedPapers.get(paperId);
    if (p) {
      setPaper(p);
      setHistory([p]);
      setHistoryIndex(0);
    }
  };

  const recordStateChange = (newPaper: SavedPaper) => {
    setPaper(newPaper);
    setAutosaveStatus('saving');

    // Debounced autosave to IndexedDB
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(async () => {
      try {
        await db.savedPapers.put({ ...newPaper, updatedAt: Date.now() });
        setAutosaveStatus('saved');
      } catch (err) {
        console.warn('Autosave error:', err);
      }
    }, 1000);

    // Update history for Undo/Redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newPaper);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const target = history[historyIndex - 1];
      setPaper(target);
      setHistoryIndex(historyIndex - 1);
      db.savedPapers.put({ ...target, updatedAt: Date.now() });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const target = history[historyIndex + 1];
      setPaper(target);
      setHistoryIndex(historyIndex + 1);
      db.savedPapers.put({ ...target, updatedAt: Date.now() });
    }
  };

  const handleUpdateQuestion = (sectionId: string, qId: string, field: keyof PaperQuestion, value: any) => {
    if (!paper) return;
    const sections = paper.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      const questions = sec.questions.map(q => {
        if (q.id !== qId) return q;
        return { ...q, [field]: value };
      });
      return { ...sec, questions };
    });

    recordStateChange({ ...paper, sections });
  };

  const handleMoveQuestion = (sectionId: string, qIdx: number, direction: 'up' | 'down') => {
    if (!paper) return;
    const secIdx = paper.sections.findIndex(s => s.id === sectionId);
    if (secIdx === -1) return;

    const questions = [...paper.sections[secIdx].questions];
    const targetIdx = direction === 'up' ? qIdx - 1 : qIdx + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;

    const temp = questions[qIdx];
    questions[qIdx] = questions[targetIdx];
    questions[targetIdx] = temp;

    // Renumber
    questions.forEach((q, i) => { q.questionNumber = i + 1; });

    const sections = [...paper.sections];
    sections[secIdx] = { ...sections[secIdx], questions };
    recordStateChange({ ...paper, sections });
  };

  const handleDeleteQuestion = (sectionId: string, qId: string) => {
    if (!paper) return;
    const sections = paper.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      const questions = sec.questions.filter(q => q.id !== qId).map((q, i) => ({
        ...q,
        questionNumber: i + 1
      }));
      return { ...sec, questions };
    });
    recordStateChange({ ...paper, sections });
    success('Question removed.');
  };

  const handleAddQuestion = (sectionId: string) => {
    if (!paper) return;
    const sec = paper.sections.find(s => s.id === sectionId);
    if (!sec) return;

    const newQ: PaperQuestion = {
      id: `q_manual_${Date.now()}`,
      sectionId,
      questionNumber: sec.questions.length + 1,
      text: 'New examination question prompt...',
      type: sec.questionType,
      marks: sec.marksPerQuestion,
      difficulty: 'medium',
      bloomLevel: 'Understand',
      subject: paper.subject,
      grade: paper.grade,
      board: paper.board,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const sections = paper.sections.map(s => {
      if (s.id !== sectionId) return s;
      return { ...s, questions: [...s.questions, newQ] };
    });
    recordStateChange({ ...paper, sections });
    success('New question added.');
  };

  const handleOpenSwapModal = async (sectionId: string, questionId: string) => {
    if (!paper) return;
    setSwapTarget({ sectionId, questionId });
    const bank = await db.questionBank.where('subject').equals(paper.subject).toArray();
    setBankQuestions(bank);
  };

  const handlePerformSwap = (replacement: QuestionItem) => {
    if (!paper || !swapTarget) return;
    const sections = paper.sections.map(sec => {
      if (sec.id !== swapTarget.sectionId) return sec;
      const questions = sec.questions.map(q => {
        if (q.id !== swapTarget.questionId) return q;
        return {
          ...replacement,
          id: replacement.id,
          sectionId: sec.id,
          questionNumber: q.questionNumber,
          marks: q.marks,
          type: q.type
        };
      });
      return { ...sec, questions };
    });

    recordStateChange({ ...paper, sections });
    setSwapTarget(null);
    success('Swapped question from bank.');
  };

  const handleRegenerateQuestion = async (sectionId: string, q: PaperQuestion) => {
    try {
      setRegeneratingQId(q.id);
      const generated = await AI_PROVIDER_SERVICE.generateQuestion({
        subject: paper!.subject,
        grade: paper!.grade,
        chapterName: q.chapter || 'Syllabus Topic',
        questionType: q.type,
        marks: q.marks,
        difficulty: q.difficulty,
        bloomLevel: q.bloomLevel,
        board: paper!.board,
        contextText: 'Standard curriculum textbook guidelines'
      });

      handleUpdateQuestion(sectionId, q.id, 'text', generated.text);
      if (generated.options) {
        handleUpdateQuestion(sectionId, q.id, 'options', generated.options);
      }
      if (generated.answer) {
        handleUpdateQuestion(sectionId, q.id, 'answer', generated.answer);
      }
      success('Question regenerated with AI.');
    } catch (err: any) {
      error(`Regenerate failed: ${err.message}`);
    } finally {
      setRegeneratingQId(null);
    }
  };

  if (!paper) return null;

  // Active display sections based on Set A/B/C
  const activeSections = activeSet === 'Original'
    ? paper.sections
    : paper.sets?.find(s => s.setName === activeSet)?.sections || paper.sections;

  const totalQuestions = activeSections.reduce((sum, s) => sum + s.questions.length, 0);

  return (
    <div className="w-full flex flex-col min-h-screen bg-neutral-100 dark:bg-neutral-950 text-left">
      
      {/* Sticky Top Toolbar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 h-16 flex items-center justify-between gap-4 shadow-soft-xs">
        
        {/* Left actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={onBack}>
            Saved Papers
          </Button>

          <div className="h-5 w-px bg-neutral-200 dark:border-neutral-800 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-[200px] sm:max-w-xs">
                {paper.title}
              </h2>
              <Badge variant="structure" size="xs">{paper.board} • {paper.grade}th</Badge>
              <Badge variant="brand" size="xs">{paper.totalMarks} Marks</Badge>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-neutral-400">
              <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                {autosaveStatus === 'saving' ? 'Saving locally...' : 'Saved locally ✓'}
              </span>
              <span>•</span>
              <span>{totalQuestions} Questions</span>
            </div>
          </div>
        </div>

        {/* Center: Set Switcher */}
        <div className="hidden lg:flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200/80 dark:border-neutral-700/60 text-xs font-semibold">
          {(['Original', 'Set A', 'Set B', 'Set C'] as const).map((setName) => (
            <button
              key={setName}
              onClick={() => setActiveSet(setName)}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeSet === setName
                  ? 'bg-white dark:bg-neutral-900 text-brand-600 dark:text-brand-400 shadow-soft-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {setName}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center gap-1">
            <IconButton
              ariaLabel="Undo change"
              icon={<RotateCcw className="w-4 h-4" />}
              variant="outline"
              size="sm"
              disabled={historyIndex <= 0}
              onClick={handleUndo}
            />
            <IconButton
              ariaLabel="Redo change"
              icon={<RotateCw className="w-4 h-4" />}
              variant="outline"
              size="sm"
              disabled={historyIndex >= history.length - 1}
              onClick={handleRedo}
            />
          </div>

          {/* Quick Print Button */}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={() => exportPrintReadyPdf(paper, 'qp')}
            className="hidden sm:inline-flex"
          >
            Print
          </Button>

          {/* Export Dropdown */}
          <DropdownMenu
            trigger={
              <Button variant="primary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                Export Paper
              </Button>
            }
            items={[
              {
                label: 'Question Paper (.PDF)',
                icon: <Printer className="w-4 h-4" />,
                onClick: () => exportPrintReadyPdf(paper, 'qp')
              },
              {
                label: 'Model Answer Key (.PDF)',
                icon: <Printer className="w-4 h-4" />,
                onClick: () => exportPrintReadyPdf(paper, 'ak')
              },
              { separator: true, label: '' },
              {
                label: 'Question Paper (.DOCX)',
                icon: <FileText className="w-4 h-4" />,
                onClick: async () => {
                  await exportQuestionPaperDocx(paper);
                  success('Question Paper Word document exported.');
                }
              },
              {
                label: 'Answer Key & Rubrics (.DOCX)',
                icon: <FileText className="w-4 h-4" />,
                onClick: async () => {
                  await exportAnswerKeyDocx(paper);
                  success('Answer Key Word document exported.');
                }
              },
              { separator: true, label: '' },
              {
                label: 'Backup JSON (.JSON)',
                icon: <Download className="w-4 h-4" />,
                onClick: async () => {
                  await exportPaperJson(paper);
                  success('Paper JSON downloaded.');
                }
              }
            ]}
          />
        </div>
      </header>

      {/* Main Split Screen */}
      <div className="flex-1 max-w-[1500px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Editable Question Stream */}
        <div className="lg:col-span-7 space-y-6">
          {activeSections.map((sec) => (
            <Card key={sec.id} className="overflow-hidden">
              <div className="px-5 py-3.5 bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="structure">{sec.name}</Badge>
                  <span className="font-bold text-xs text-neutral-800 dark:text-neutral-200">
                    {sec.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-neutral-400">
                    {sec.questions.length} Questions • {sec.marksPerQuestion}M each
                  </span>
                  <Button
                    variant="outline"
                    size="xs"
                    leftIcon={<Plus className="w-3 h-3" />}
                    onClick={() => handleAddQuestion(sec.id)}
                  >
                    Add Q
                  </Button>
                </div>
              </div>

              <CardContent className="divide-y divide-neutral-100 dark:divide-neutral-800/80 p-0">
                {sec.questions.map((q, qIdx) => (
                  <div key={q.id} className="p-4 space-y-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-xs text-neutral-900 dark:text-neutral-100">
                          Q.{q.questionNumber || qIdx + 1}.
                        </span>
                        <Badge variant="brand" size="xs">[{q.marks} Mark{q.marks > 1 ? 's' : ''}]</Badge>
                        <Badge variant="neutral" size="xs">{q.type.toUpperCase()}</Badge>
                      </div>

                      {/* Item action buttons */}
                      <div className="flex items-center gap-1">
                        <IconButton
                          ariaLabel="Move up"
                          icon={<ChevronUp className="w-3.5 h-3.5" />}
                          size="xs"
                          variant="ghost"
                          disabled={qIdx === 0}
                          onClick={() => handleMoveQuestion(sec.id, qIdx, 'up')}
                        />
                        <IconButton
                          ariaLabel="Move down"
                          icon={<ChevronDown className="w-3.5 h-3.5" />}
                          size="xs"
                          variant="ghost"
                          disabled={qIdx === sec.questions.length - 1}
                          onClick={() => handleMoveQuestion(sec.id, qIdx, 'down')}
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          leftIcon={<ArrowRightLeft className="w-3.5 h-3.5" />}
                          onClick={() => handleOpenSwapModal(sec.id, q.id)}
                          title="Swap from Question Bank"
                        >
                          Swap
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          isLoading={regeneratingQId === q.id}
                          leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                          onClick={() => handleRegenerateQuestion(sec.id, q)}
                          title="Regenerate question text with AI"
                        >
                          Regen
                        </Button>
                        <IconButton
                          ariaLabel="Delete question"
                          icon={<Trash2 className="w-3.5 h-3.5" />}
                          size="xs"
                          variant="ghost"
                          className="text-danger-600 hover:text-danger-700"
                          onClick={() => handleDeleteQuestion(sec.id, q.id)}
                        />
                      </div>
                    </div>

                    {/* Editable prompt */}
                    <textarea
                      rows={2}
                      value={q.text}
                      onChange={(e) => handleUpdateQuestion(sec.id, q.id, 'text', e.target.value)}
                      className="w-full text-xs font-medium p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-500"
                    />

                    {/* MCQ Options editor */}
                    {q.type === 'mcq' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={opt.id || oIdx}
                            className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                              opt.isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                                : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q-correct-${q.id}`}
                              checked={Boolean(opt.isCorrect)}
                              onChange={() => {
                                const newOpts = q.options!.map((o, idx) => ({
                                  ...o,
                                  isCorrect: idx === oIdx
                                }));
                                handleUpdateQuestion(sec.id, q.id, 'options', newOpts);
                              }}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="font-bold text-neutral-500">
                              ({String.fromCharCode(97 + oIdx)})
                            </span>
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) => {
                                const newOpts = [...q.options!];
                                newOpts[oIdx] = { ...newOpts[oIdx], text: e.target.value };
                                handleUpdateQuestion(sec.id, q.id, 'options', newOpts);
                              }}
                              className="w-full bg-transparent text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Model Answer preview */}
                    {q.answer && (
                      <div className="p-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/40 text-[11px] text-neutral-600 dark:text-neutral-300 space-y-0.5">
                        <span className="font-bold text-neutral-500 uppercase tracking-wider text-[9px] block">
                          Model Answer / Rubric:
                        </span>
                        <div>{q.answer}</div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Column: Live Board Print-Accurate Preview */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400 px-1">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-brand-600" />
              Print-Accurate A4 Sheet Preview
            </span>
            <button
              onClick={() => exportPrintReadyPdf(paper, 'qp')}
              className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Full Print</span>
            </button>
          </div>

          <div className="bg-white text-neutral-900 rounded-2xl border border-neutral-300 shadow-soft-md p-6 font-serif max-h-[calc(100vh-140px)] overflow-y-auto space-y-4 text-xs select-none">
            
            {/* School Header */}
            <div className="text-center border-b-2 border-neutral-800 pb-3 space-y-1">
              <div className="flex justify-end mb-1">
                <div className="border border-neutral-800 px-2 py-0.5 text-[9px] font-sans font-bold">
                  Roll No: ____________
                </div>
              </div>
              <h3 className="font-bold text-base uppercase tracking-wider">
                {paper.schoolName || 'DELHI PUBLIC SCHOOL'}
              </h3>
              <div className="font-sans font-bold text-xs text-neutral-700 uppercase">
                {paper.examName || 'ANNUAL EXAMINATION'} ({paper.board}) • {activeSet}
              </div>
              <div className="flex items-center justify-between font-sans text-[10px] font-semibold text-neutral-600 pt-1">
                <span>CLASS: {paper.grade}</span>
                <span>SUBJECT: {paper.subject.toUpperCase()}</span>
                <span>MAX MARKS: {paper.totalMarks}</span>
                <span>TIME: {paper.durationMinutes || 180} MIN</span>
              </div>
            </div>

            {/* General Instructions */}
            {paper.generalInstructions && paper.generalInstructions.length > 0 && (
              <div className="p-2.5 rounded bg-neutral-50 border border-neutral-200 text-[10px] font-sans space-y-0.5">
                <div className="font-bold uppercase tracking-wider text-[9px] text-neutral-700">General Instructions:</div>
                <ol className="list-decimal list-inside space-y-0.5 text-neutral-600">
                  {paper.generalInstructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Sections */}
            {activeSections.map((sec) => (
              <div key={sec.id} className="space-y-2 pt-2">
                <div className="text-center font-sans font-bold uppercase text-[11px] border-b border-neutral-300 pb-1">
                  {sec.name} — {sec.title} ({sec.totalMarks || (sec.questions.length * sec.marksPerQuestion)} Marks)
                </div>

                <div className="space-y-2.5 pt-1 text-[11px] leading-relaxed">
                  {sec.questions.map((q) => (
                    <div key={q.id} className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span>
                          <strong>Q.{q.questionNumber}.</strong> {q.text}
                        </span>
                        <span className="font-sans font-bold text-[10px] shrink-0">
                          [{q.marks}]
                        </span>
                      </div>

                      {q.type === 'mcq' && q.options && (
                        <div className="grid grid-cols-2 gap-1 text-[10px] pl-4 font-sans text-neutral-700">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx}>
                              ({String.fromCharCode(97 + oIdx)}) {opt.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center text-[10px] font-sans text-neutral-400 pt-6 border-t border-neutral-200">
              *** END OF QUESTION PAPER ***
            </div>
          </div>
        </div>

      </div>

      {/* Swap Modal */}
      <Modal
        isOpen={Boolean(swapTarget)}
        onClose={() => setSwapTarget(null)}
        size="lg"
        title="Swap Question from Bank"
        description="Pick an alternate question from your local bank to replace this item."
      >
        <div className="space-y-3 py-2 text-left max-h-[400px] overflow-y-auto">
          {bankQuestions.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              No questions found in question bank for {paper.subject}.
            </div>
          ) : (
            bankQuestions.map((bq) => (
              <div
                key={bq.id}
                className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-brand-500 transition-colors flex items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">{bq.text}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="structure" size="xs">{bq.type}</Badge>
                    <Badge variant="brand" size="xs">{bq.marks}M</Badge>
                    <span className="text-[11px] text-neutral-400">{bq.chapter || bq.subject}</span>
                  </div>
                </div>
                <Button variant="primary" size="xs" onClick={() => handlePerformSwap(bq)}>
                  Select
                </Button>
              </div>
            ))
          )}
        </div>
      </Modal>

    </div>
  );
};
