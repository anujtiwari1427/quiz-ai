import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  BookOpen, 
  FileCheck, 
  Sparkles, 
  Plus, 
  Trash2, 
  Copy, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Layers,
  ArrowLeft,
  X
} from 'lucide-react';
import { db } from '../../db';
import { 
  PaperBlueprint, 
  SectionBlueprint, 
  TextbookRecord, 
  ChapterRecord, 
  BoardType, 
  SupportedLanguage, 
  QuestionType 
} from '../../types';
import { BLUEPRINT_SERVICE } from '../../services/blueprintService';
import { PAPER_GENERATOR_SERVICE } from '../../services/paperGeneratorService';
import { Stepper } from '../ui/NavigationControls';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/Feedback';
import { Alert } from '../ui/Alert';
import { Slider } from '../ui/FormControls';
import { useToast } from '../ui/Toast';

export interface CreatePaperWizardProps {
  initialBlueprintId?: string;
  onPaperGenerated: (paperId: string) => void;
  onCancel: () => void;
}

export const CreatePaperWizard: React.FC<CreatePaperWizardProps> = ({
  initialBlueprintId,
  onPaperGenerated,
  onCancel
}) => {
  const { error: toastError, success: toastSuccess } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [blueprints, setBlueprints] = useState<PaperBlueprint[]>([]);
  const [textbooks, setTextbooks] = useState<TextbookRecord[]>([]);
  const [selectedTextbookId, setSelectedTextbookId] = useState<string>('');
  const [chapters, setChapters] = useState<ChapterRecord[]>([]);
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  
  // Active Blueprint state
  const [blueprint, setBlueprint] = useState<PaperBlueprint | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    initWizard();
  }, []);

  const initWizard = async () => {
    const [allBlueprints, allBooks] = await Promise.all([
      db.blueprints.toArray(),
      db.textbooks.toArray()
    ]);
    setBlueprints(allBlueprints);
    setTextbooks(allBooks);

    let activeBp: PaperBlueprint;
    if (initialBlueprintId) {
      const match = allBlueprints.find(b => b.id === initialBlueprintId);
      activeBp = match || allBlueprints[0];
    } else {
      activeBp = allBlueprints[0];
    }

    if (activeBp) {
      setBlueprint({ ...activeBp });
      validate({ ...activeBp });
    }

    if (allBooks.length > 0) {
      setSelectedTextbookId(allBooks[0].id);
      loadChapters(allBooks[0].id);
    }
  };

  const loadChapters = async (tbId: string) => {
    const chList = await db.chapters.where('textbookId').equals(tbId).toArray();
    setChapters(chList);
    setSelectedChapterIds(chList.map(c => c.id));
  };

  const validate = (bp: PaperBlueprint) => {
    const res = BLUEPRINT_SERVICE.validateBlueprint(bp);
    setValidationErrors(res.errors);
    return res.isValid;
  };

  const handleUpdateField = (field: keyof PaperBlueprint, value: any) => {
    if (!blueprint) return;
    const updated = { ...blueprint, [field]: value };
    setBlueprint(updated);
    validate(updated);
  };

  const handleUpdateSection = (index: number, field: keyof SectionBlueprint, value: any) => {
    if (!blueprint) return;
    const sections = [...blueprint.sections];
    sections[index] = { ...sections[index], [field]: value };
    const updated = { ...blueprint, sections };
    setBlueprint(updated);
    validate(updated);
  };

  const handleAddSection = () => {
    if (!blueprint) return;
    const nextIdx = blueprint.sections.length + 1;
    const newSection: SectionBlueprint = {
      id: `s_${Date.now()}`,
      name: `Section ${String.fromCharCode(64 + nextIdx)}`,
      title: 'New Section',
      questionType: 'short_answer',
      questionCount: 4,
      marksPerQuestion: 3
    };
    const updated = { ...blueprint, sections: [...blueprint.sections, newSection] };
    setBlueprint(updated);
    validate(updated);
  };

  const handleRemoveSection = (index: number) => {
    if (!blueprint || blueprint.sections.length <= 1) return;
    const sections = blueprint.sections.filter((_, i) => i !== index);
    const updated = { ...blueprint, sections };
    setBlueprint(updated);
    validate(updated);
  };

  const handleSelectTemplate = (templateId: string) => {
    const tpl = blueprints.find(b => b.id === templateId);
    if (tpl) {
      const cloned = { ...tpl, id: `bp_${Date.now()}` };
      setBlueprint(cloned);
      validate(cloned);
    }
  };

  const handleGenerate = async () => {
    if (!blueprint || validationErrors.length > 0) return;
    try {
      setIsGenerating(true);
      const res = await PAPER_GENERATOR_SERVICE.generatePaper(blueprint, {
        generateSets: true,
        onProgress: (cur, total, msg) => {
          const pct = Math.round((cur / Math.max(total, 1)) * 100);
          setProgressPercent(pct);
          setProgressMsg(msg);
        }
      });
      toastSuccess('Examination paper generated successfully!');
      onPaperGenerated(res.paper.id);
    } catch (err: any) {
      toastError(`Generation failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!blueprint) return null;

  const totalCalculatedMarks = BLUEPRINT_SERVICE.calculateTotalMarks(blueprint);
  const totalCalculatedQuestions = BLUEPRINT_SERVICE.calculateTotalQuestions(blueprint);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Create Examination Paper
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          {currentStep === 2 && (
            <Button
              variant="primary"
              size="sm"
              isLoading={isGenerating}
              disabled={validationErrors.length > 0}
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={handleGenerate}
            >
              Generate Exam Paper
            </Button>
          )}
        </div>
      </div>

      {/* Stepper Header */}
      <div className="py-2">
        <Stepper
          currentStepIndex={currentStep}
          onStepClick={setCurrentStep}
          steps={[
            { id: 'source', title: '1. Source Books', description: 'Textbooks & chapters' },
            { id: 'blueprint', title: '2. Paper Blueprint', description: 'Sections & marks' },
            { id: 'review', title: '3. Review & Generate', description: 'Verify arithmetic' },
          ]}
        />
      </div>

      {/* Two Column Layout: Main Stepper Step on Left, Live Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Step content) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 0: SOURCE */}
          {currentStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Source Textbook & Chapters</CardTitle>
                <CardDescription>
                  Questions will be strictly grounded in the selected chapters via BM25 retrieval.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 pt-5">
                {textbooks.length === 0 ? (
                  <Alert variant="warning" title="No Textbooks Uploaded">
                    You have not uploaded any textbook PDFs yet. The generator will create questions from your local Question Bank or AI knowledge. You can upload books in the Library.
                  </Alert>
                ) : (
                  <>
                    <Select
                      label="Primary Textbook"
                      value={selectedTextbookId}
                      onValueChange={(id) => {
                        setSelectedTextbookId(id);
                        loadChapters(id);
                      }}
                      options={textbooks.map(tb => ({
                        value: tb.id,
                        label: `${tb.title} (Class ${tb.grade} ${tb.subject})`,
                        description: `${tb.totalPages} pages • ${tb.board}`
                      }))}
                    />

                    {chapters.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          <span>Included Chapters ({selectedChapterIds.length}/{chapters.length})</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedChapterIds.length === chapters.length) setSelectedChapterIds([]);
                              else setSelectedChapterIds(chapters.map(c => c.id));
                            }}
                            className="text-brand-600 hover:underline"
                          >
                            {selectedChapterIds.length === chapters.length ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1">
                          {chapters.map((ch) => {
                            const isChecked = selectedChapterIds.includes(ch.id);
                            return (
                              <div
                                key={ch.id}
                                onClick={() => {
                                  if (isChecked) setSelectedChapterIds(selectedChapterIds.filter(id => id !== ch.id));
                                  else setSelectedChapterIds([...selectedChapterIds, ch.id]);
                                }}
                                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                                  isChecked
                                    ? 'bg-brand-50/80 border-brand-300 dark:bg-brand-950/40 dark:border-brand-800'
                                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {}}
                                  className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
                                />
                                <div>
                                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                                    {ch.chapterNumber}. {ch.title}
                                  </div>
                                  <div className="text-[11px] text-neutral-400 mt-0.5">
                                    Pages {ch.startPage} - {ch.endPage}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="pt-4 flex justify-end">
                  <Button variant="primary" size="sm" onClick={() => setCurrentStep(1)}>
                    Next: Configure Blueprint
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 1: BLUEPRINT */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Template Quick Selector */}
              <Card>
                <CardHeader>
                  <CardTitle>Pick a Starter Pattern Template</CardTitle>
                  <CardDescription>Pre-configured according to official educational board standards.</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {blueprints.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleSelectTemplate(b.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          blueprint.name === b.name
                            ? 'border-brand-600 bg-brand-50/70 text-brand-900 dark:bg-brand-950/40 dark:text-brand-200 ring-2 ring-brand-500/30'
                            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
                        }`}
                      >
                        <Badge variant="structure" size="xs">{b.board} • {b.grade}th</Badge>
                        <div className="font-bold text-xs text-neutral-900 dark:text-neutral-100 mt-1 truncate">
                          {b.name}
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          {b.totalMarks} Marks • {b.durationMinutes}m
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Blueprint Details Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Exam Specifications</CardTitle>
                  <CardDescription>Institution header, marks total, and duration.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5">
                  <Input
                    label="School / Institution Name"
                    value={blueprint.schoolName}
                    onChange={(e) => handleUpdateField('schoolName', e.target.value)}
                    required
                  />
                  <Input
                    label="Examination Title"
                    value={blueprint.examName}
                    onChange={(e) => handleUpdateField('examName', e.target.value)}
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Subject"
                      value={blueprint.subject}
                      onChange={(e) => handleUpdateField('subject', e.target.value)}
                      required
                    />
                    <Input
                      label="Class / Grade"
                      type="number"
                      min={1}
                      max={12}
                      value={blueprint.grade}
                      onChange={(e) => handleUpdateField('grade', parseInt(e.target.value, 10) || 10)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Total Marks"
                      type="number"
                      min={1}
                      value={blueprint.totalMarks}
                      onChange={(e) => handleUpdateField('totalMarks', parseInt(e.target.value, 10) || 1)}
                      required
                    />
                    <Input
                      label="Duration (Minutes)"
                      type="number"
                      min={15}
                      step={15}
                      value={blueprint.durationMinutes}
                      onChange={(e) => handleUpdateField('durationMinutes', parseInt(e.target.value, 10) || 180)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sections List */}
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>Examination Sections</CardTitle>
                    <CardDescription>Deterministic questions and marks per section.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={handleAddSection}>
                    Add Section
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-5">
                  {blueprint.sections.map((sec, idx) => (
                    <div
                      key={sec.id || idx}
                      className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="structure">{sec.name}</Badge>
                          <input
                            type="text"
                            value={sec.title}
                            onChange={(e) => handleUpdateSection(idx, 'title', e.target.value)}
                            placeholder="Section Title..."
                            className="bg-transparent font-bold text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none border-b border-dashed border-neutral-300"
                          />
                        </div>
                        {blueprint.sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(idx)}
                            className="text-neutral-400 hover:text-danger-600 transition-colors p-1"
                            title="Remove section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <Select
                          label="Type"
                          value={sec.questionType}
                          onValueChange={(val: any) => handleUpdateSection(idx, 'questionType', val)}
                          options={[
                            { value: 'mcq', label: 'MCQ (1 Mark)' },
                            { value: 'short_answer', label: 'Short Answer' },
                            { value: 'long_answer', label: 'Long Answer' },
                            { value: 'true_false', label: 'True / False' },
                            { value: 'fill_blank', label: 'Fill in Blank' },
                          ]}
                        />
                        <Input
                          label="Questions"
                          type="number"
                          min={1}
                          value={sec.questionCount}
                          onChange={(e) => handleUpdateSection(idx, 'questionCount', parseInt(e.target.value, 10) || 1)}
                        />
                        <Input
                          label="Marks Each"
                          type="number"
                          min={1}
                          value={sec.marksPerQuestion}
                          onChange={(e) => handleUpdateSection(idx, 'marksPerQuestion', parseInt(e.target.value, 10) || 1)}
                        />
                        <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center text-center">
                          <span className="text-[10px] text-neutral-400 uppercase font-bold">Subtotal</span>
                          <span className="font-extrabold text-brand-600 text-sm">
                            {(sec.questionCount || 0) * (sec.marksPerQuestion || 0)}M
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 flex justify-end gap-3">
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(0)}>
                      Back
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setCurrentStep(2)}>
                      Next: Review & Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* STEP 2: REVIEW & GENERATE */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verification & Generation Summary</CardTitle>
                  <CardDescription>
                    Deterministic check ensures zero marks leaks or mathematical inconsistencies.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-5">
                  {validationErrors.length > 0 ? (
                    <Alert variant="danger" title="Validation Failed - Generation Blocked">
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        {validationErrors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </Alert>
                  ) : (
                    <Alert variant="success" title="Blueprint Mathematically Valid">
                      Section marks total exactly {totalCalculatedMarks} marks matching target {blueprint.totalMarks} marks.
                      Ready to assemble questions from your local question bank and textbook snippets.
                    </Alert>
                  )}

                  {/* Summary grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/60 text-xs">
                    <div>
                      <span className="text-neutral-400">Total Marks</span>
                      <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">{blueprint.totalMarks}</div>
                    </div>
                    <div>
                      <span className="text-neutral-400">Questions</span>
                      <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">{totalCalculatedQuestions}</div>
                    </div>
                    <div>
                      <span className="text-neutral-400">Sections</span>
                      <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">{blueprint.sections.length}</div>
                    </div>
                    <div>
                      <span className="text-neutral-400">Multi-Sets</span>
                      <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">Sets A, B, C</div>
                    </div>
                  </div>

                  {/* Generation Progress Bar */}
                  {isGenerating ? (
                    <div className="p-6 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full border-4 border-brand-600 border-t-transparent animate-spin mx-auto" />
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {progressMsg || 'Generating Questions...'}
                        </h4>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Matching local Question Bank slots and synthesizing textbook grounded items.
                        </p>
                      </div>
                      <ProgressBar value={progressPercent} variant="brand" />
                    </div>
                  ) : (
                    <div className="flex justify-between items-center pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                        Back to Blueprint
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        disabled={validationErrors.length > 0}
                        leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
                        onClick={handleGenerate}
                      >
                        Generate Examination Paper
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

        </div>

        {/* Right Column: Persistent Live Blueprint Summary Panel */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Live Blueprint Balance</CardTitle>
              <CardDescription>Computed in real-time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Target Marks:</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">{blueprint.totalMarks} Marks</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Calculated Sum:</span>
                <span className={`font-bold ${
                  totalCalculatedMarks === blueprint.totalMarks
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-danger-600'
                }`}>
                  {totalCalculatedMarks} Marks
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Total Questions:</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">{totalCalculatedQuestions}</span>
              </div>

              {/* Status Pill */}
              <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                validationErrors.length === 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-danger-50 border-danger-200 text-danger-800 dark:bg-danger-950/40 dark:text-danger-300'
              }`}>
                {validationErrors.length === 0 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-[11px]">100% Balanced</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-danger-600 shrink-0" />
                    <span className="font-semibold text-[11px]">{validationErrors.length} validation issues</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
