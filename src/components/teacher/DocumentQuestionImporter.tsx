import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Trash2, 
  Plus, 
  FileCheck2, 
  BookOpen, 
  Edit3, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  X,
  FileCode,
  ArrowRight,
  RefreshCw,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { Question, QuestionType, BoardType } from '../../types';
import { DOCUMENT_PARSER_SERVICE, SAMPLE_DOCUMENTS } from '../../services/documentParserService';

interface DocumentQuestionImporterProps {
  onQuestionsImported: (questions: Question[]) => void;
  onCancel?: () => void;
  targetTestTitle?: string;
  defaultBoard?: BoardType;
  defaultGrade?: number;
  defaultSubject?: string;
  defaultChapter?: string;
}

export const DocumentQuestionImporter: React.FC<DocumentQuestionImporterProps> = ({
  onQuestionsImported,
  onCancel,
  targetTestTitle,
  defaultBoard = 'CBSE',
  defaultGrade = 10,
  defaultSubject = 'Science',
  defaultChapter = 'Light – Reflection and Refraction'
}) => {
  const [activeInputTab, setActiveInputTab] = useState<'upload' | 'sample' | 'paste'>('sample');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileType, setUploadedFileType] = useState<string>('');
  const [rawPastedText, setRawPastedText] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Extracted questions & selection state
  const [extractedQuestions, setExtractedQuestions] = useState<Question[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle parsing text into questions with simulated AI telemetry
  const processDocumentText = async (text: string, filename: string, type: string) => {
    setIsProcessing(true);
    setUploadedFileName(filename);
    setUploadedFileType(type);

    setProgressStep(`Ingesting ${filename}...`);
    await new Promise(r => setTimeout(r, 450));

    setProgressStep(`Analyzing document structure & section boundaries...`);
    await new Promise(r => setTimeout(r, 450));

    setProgressStep(`Parsing question stems, options, and marking keys...`);
    await new Promise(r => setTimeout(r, 500));

    const parsed = DOCUMENT_PARSER_SERVICE.parseTextToQuestions(text, {
      board: defaultBoard,
      classGrade: defaultGrade,
      subject: defaultSubject,
      defaultChapter
    });

    setProgressStep(`Synthesizing rubrics and curriculum mapping...`);
    await new Promise(r => setTimeout(r, 400));

    setExtractedQuestions(parsed);
    setSelectedQuestionIds(parsed.map(q => q.id));
    setIsProcessing(false);
  };

  // Upload file handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgressStep(`Reading binary streams from ${file.name}...`);
      const extractedText = await DOCUMENT_PARSER_SERVICE.extractTextFromFile(file);
      await processDocumentText(extractedText, file.name, file.name.split('.').pop() || 'doc');
    } catch (err) {
      console.error(err);
      alert('Could not read the uploaded document. Please try a standard .pdf or .docx file, or use our pre-loaded samples.');
      setIsProcessing(false);
    }
  };

  // Drag and drop handlers
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgressStep(`Extracting document content from ${file.name}...`);
      const extractedText = await DOCUMENT_PARSER_SERVICE.extractTextFromFile(file);
      await processDocumentText(extractedText, file.name, file.name.split('.').pop() || 'doc');
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  // 1-Click sample document loader
  const handleSelectSample = async (sampleId: string) => {
    const sample = SAMPLE_DOCUMENTS.find(s => s.id === sampleId);
    if (!sample) return;
    await processDocumentText(sample.text, sample.fileName, sample.fileType);
  };

  // Process raw pasted text
  const handleProcessPastedText = async () => {
    if (!rawPastedText.trim()) return;
    await processDocumentText(rawPastedText, 'Pasted_Exam_Questions.txt', 'txt');
  };

  // Toggle selection
  const toggleSelectQuestion = (id: string) => {
    if (selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds(selectedQuestionIds.filter(qid => qid !== id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedQuestionIds.length === extractedQuestions.length) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(extractedQuestions.map(q => q.id));
    }
  };

  // Update question inline
  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setExtractedQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  // Remove question from parsed list
  const deleteQuestion = (id: string) => {
    setExtractedQuestions(prev => prev.filter(q => q.id !== id));
    setSelectedQuestionIds(prev => prev.filter(qid => qid !== id));
  };

  // Add custom manual question
  const handleAddManualQuestion = () => {
    const newQ: Question = {
      id: `doc_q_custom_${Date.now()}`,
      type: 'mcq',
      questionText: 'Enter your custom question text here...',
      marks: 1,
      difficulty: 'medium',
      bloomsLevel: 'Understand',
      chapter: defaultChapter,
      options: [
        { id: `opt_c_1`, text: 'Option A (Correct)', isCorrect: true },
        { id: `opt_c_2`, text: 'Option B', isCorrect: false },
        { id: `opt_c_3`, text: 'Option C', isCorrect: false },
        { id: `opt_c_4`, text: 'Option D', isCorrect: false }
      ],
      correctAnswer: 'Option A (Correct)'
    };
    setExtractedQuestions(prev => [...prev, newQ]);
    setSelectedQuestionIds(prev => [...prev, newQ.id]);
    setEditingQuestionId(newQ.id);
  };

  // Final import confirmation
  const handleConfirmImport = () => {
    const questionsToImport = extractedQuestions.filter(q => selectedQuestionIds.includes(q.id));
    if (questionsToImport.length === 0) {
      alert('Please select at least one question to import.');
      return;
    }
    onQuestionsImported(questionsToImport);
  };

  const selectedCount = selectedQuestionIds.length;
  const totalSelectedMarks = extractedQuestions
    .filter(q => selectedQuestionIds.includes(q.id))
    .reduce((acc, q) => acc + q.marks, 0);

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="glass rounded-3xl p-6 border border-brand-500/30 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-600 flex items-center justify-center text-slate-950 shadow-lg shadow-brand-500/20 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-emerald">AI Document Extractor</span>
                <span className="text-[11px] text-slate-400 font-medium">PDF · Word (.docx) · Text</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white">
                {targetTestTitle ? `Import Questions to "${targetTestTitle}"` : 'Import Assessment Questions via PDF / Word'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Upload existing school exam sheets, question banks, or textbook chapters to automatically classify questions and rubrics.
              </p>
            </div>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="self-start sm:self-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mode Selector Tabs (when not reviewing) */}
      {extractedQuestions.length === 0 && !isProcessing && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActiveInputTab('sample')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeInputTab === 'sample'
                  ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Samples</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveInputTab('upload')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeInputTab === 'upload'
                  ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveInputTab('paste')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeInputTab === 'paste'
                  ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Paste Text</span>
            </button>
          </div>

          {/* Tab 1: 1-Click Samples */}
          {activeInputTab === 'sample' && (
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto">
                <p className="text-xs text-slate-400">
                  Try our realistic board exam sample documents to instantly preview AI parsing without uploading your own file:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SAMPLE_DOCUMENTS.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectSample(doc.id)}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          doc.fileType === 'pdf'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {doc.fileType.toUpperCase()}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold">{doc.marks} Marks</span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-white group-hover:text-brand-300 transition-colors">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono line-clamp-1">{doc.fileName}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-brand-400 font-semibold">
                      <span>Click to Parse &amp; Review</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Upload File */}
          {activeInputTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-10 rounded-3xl border-2 border-dashed text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
                    : 'border-slate-800 hover:border-brand-500/40 bg-slate-900/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-slate-800 text-brand-400 flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Upload className="w-8 h-8" />
                </div>

                <h4 className="text-base font-display font-bold text-white mb-1">
                  Drag &amp; Drop Question Paper or Click to Browse
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Supports PDF documents, Microsoft Word (.docx), and plain text question sheets.
                </p>

                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 text-[10px] font-bold border border-rose-500/20">
                    PDF Document (.pdf)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 text-[10px] font-bold border border-blue-500/20">
                    Word (.docx / .doc)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/20">
                    Text File (.txt)
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Client-Side Local Ingestion (DPDP Privacy Compliant)</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Paste Text */}
          {activeInputTab === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Paste Question Paper Text or Notes:
                </label>
                <textarea
                  rows={8}
                  value={rawPastedText}
                  onChange={(e) => setRawPastedText(e.target.value)}
                  placeholder={`Example format:\n\nQ1. [1 Mark] Which lens always produces a virtual image?\n(a) Convex (b) Concave (c) Bifocal (d) Plano-convex\nAns: (b) Concave\n\nQ2. [3 Marks] State Ohm's law with formula and precautions.`}
                  className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-brand-500 transition-colors placeholder:text-slate-600"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleProcessPastedText}
                  disabled={!rawPastedText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Parse Questions</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Processing Telemetry Loader */}
      {isProcessing && (
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-brand-500/30 text-center space-y-4 animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto animate-pulse">
            <RefreshCw className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <h4 className="text-base font-display font-bold text-white">AI Document Parser Running</h4>
            <p className="text-xs text-brand-300 font-mono mt-1">{progressStep}</p>
          </div>
          <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 w-2/3 animate-pulse rounded-full" />
          </div>
        </div>
      )}

      {/* Extracted Questions Review Screen */}
      {extractedQuestions.length > 0 && !isProcessing && (
        <div className="space-y-6 animate-fade-in-up">

          {/* Document Summary Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                {uploadedFileType.toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-bold text-white block truncate max-w-xs sm:max-w-md">
                  {uploadedFileName}
                </span>
                <span className="text-[11px] text-slate-400">
                  {extractedQuestions.length} Questions Extracted · {extractedQuestions.reduce((a, b) => a + b.marks, 0)} Total Marks
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setExtractedQuestions([]);
                  setSelectedQuestionIds([]);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Upload Different File
              </button>
              <button
                type="button"
                onClick={handleAddManualQuestion}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-400 text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {/* Selection Bar */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedQuestionIds.length === extractedQuestions.length && extractedQuestions.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 accent-brand-500 cursor-pointer"
              />
              <label htmlFor="select-all" className="text-xs font-semibold text-slate-300 cursor-pointer">
                Select All ({selectedCount}/{extractedQuestions.length} Selected)
              </label>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Selected Marks: </span>
              <span className="text-xs font-bold text-brand-400">{totalSelectedMarks} Marks</span>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {extractedQuestions.map((q, idx) => {
              const isSelected = selectedQuestionIds.includes(q.id);
              const isEditing = editingQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    isSelected
                      ? 'bg-slate-900/90 border-brand-500/40'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-70'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectQuestion(q.id)}
                        className="w-4 h-4 accent-brand-500 cursor-pointer"
                      />
                      <span className="w-6 h-6 rounded-lg bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-[11px]">
                        Q{idx + 1}
                      </span>
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {q.type.replace('_', ' ')}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
                        {q.chapter}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-400 font-bold">
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={q.marks}
                          onChange={(e) => updateQuestion(q.id, { marks: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-8 bg-transparent text-right font-bold text-emerald-400 focus:outline-none"
                        />
                        <span>M</span>
                      </div>

                      <button
                        onClick={() => setEditingQuestionId(isEditing ? null : q.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Edit question text"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400"
                        title="Remove question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={q.questionText}
                        onChange={(e) => updateQuestion(q.id, { questionText: e.target.value })}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-brand-500/50 text-xs text-white focus:outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={q.chapter}
                          onChange={(e) => updateQuestion(q.id, { chapter: e.target.value })}
                          placeholder="Chapter name"
                          className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300"
                        />
                        <select
                          value={q.type}
                          onChange={(e) => updateQuestion(q.id, { type: e.target.value as QuestionType })}
                          className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300"
                        >
                          <option value="mcq">Multiple Choice (MCQ)</option>
                          <option value="assertion_reason">Assertion &amp; Reason</option>
                          <option value="short_answer">Short Answer</option>
                          <option value="long_answer">Long Answer</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-white whitespace-pre-line leading-relaxed">
                      {q.questionText}
                    </p>
                  )}

                  {/* MCQ Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={opt.id}
                          onClick={() => {
                            // Toggle correct answer
                            const updatedOptions = q.options?.map(o => ({
                              ...o,
                              isCorrect: o.id === opt.id
                            }));
                            updateQuestion(q.id, { options: updatedOptions, correctAnswer: opt.text });
                          }}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                            opt.isCorrect
                              ? 'bg-brand-500/10 border-brand-500/50 text-brand-300 font-semibold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span>{String.fromCharCode(65 + optIdx)}. {opt.text}</span>
                          {opt.isCorrect && <Check className="w-3.5 h-3.5 text-brand-400" />}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Marking Scheme / Rubric */}
                  {q.markingScheme && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                      <span className="font-bold text-amber-400 block text-[11px]">Marking Scheme &amp; Rubric:</span>
                      <p className="text-slate-300 text-[11px] font-mono leading-relaxed">{q.markingScheme}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Action Footer */}
          <div className="sticky bottom-4 z-20 flex items-center justify-between p-4 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-brand-500/40 shadow-2xl">
            <div>
              <span className="text-xs text-slate-300 block font-semibold">
                {selectedCount} Questions Selected ({totalSelectedMarks} Total Marks)
              </span>
              <span className="text-[10px] text-slate-500">Ready to incorporate into assessment</span>
            </div>

            <div className="flex items-center gap-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-semibold"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={selectedCount === 0}
                className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Import {selectedCount} Questions</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
