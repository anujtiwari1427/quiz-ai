import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Upload, 
  Trash2, 
  Search, 
  Copy, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Edit2,
  X,
  FileText
} from 'lucide-react';
import { db } from '../../db';
import { INGESTION_SERVICE } from '../../services/ingestionService';
import { QuestionItem, QuestionType, DifficultyLevel, BloomsLevel } from '../../types';

export const QuestionBankView: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [duplicates, setDuplicates] = useState<{ original: QuestionItem; duplicate: QuestionItem; similarity: number }[]>([]);
  const [showDupeModal, setShowDupeModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New question form state
  const [newQText, setNewQText] = useState('');
  const [newQType, setNewQType] = useState<QuestionType>('mcq');
  const [newQMarks, setNewQMarks] = useState(1);
  const [newQDiff, setNewQDiff] = useState<DifficultyLevel>('medium');
  const [newQBloom, setNewQBloom] = useState<BloomsLevel>('Understand');
  const [newQSubject, setNewQSubject] = useState('Science');
  const [newQGrade, setNewQGrade] = useState(10);
  const [newQAnswer, setNewQAnswer] = useState('');
  const [newQExplanation, setNewQExplanation] = useState('');
  const [newQOptions, setNewQOptions] = useState<string[]>(['Option A', 'Option B', 'Option C', 'Option D']);
  const [correctOptIdx, setCorrectOptIdx] = useState(0);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const list = await db.questionBank.reverse().sortBy('createdAt');
    setQuestions(list);
  };

  const handleScanDuplicates = () => {
    const dupes = INGESTION_SERVICE.findDuplicates(questions, 0.75);
    setDuplicates(dupes);
    setShowDupeModal(true);
  };

  const handleDeleteQuestion = async (id: string) => {
    if (confirm('Delete this question from your local bank?')) {
      await db.questionBank.delete(id);
      await loadQuestions();
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim()) return;

    const item: QuestionItem = {
      id: `qb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      text: newQText.trim(),
      type: newQType,
      marks: newQMarks,
      difficulty: newQDiff,
      bloomLevel: newQBloom,
      subject: newQSubject,
      grade: newQGrade,
      answer: newQAnswer,
      explanation: newQExplanation,
      options: newQType === 'mcq' ? newQOptions.map((opt, i) => ({
        id: `opt_${i + 1}`,
        text: opt,
        isCorrect: i === correctOptIdx
      })) : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await db.questionBank.put(item);
    await loadQuestions();
    setShowAddModal(false);
    setNewQText('');
    setNewQAnswer('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await INGESTION_SERVICE.parseQuestionBankFile(file, {
        subject: 'General Science',
        grade: 10
      });

      if (parsed.length > 0) {
        await db.questionBank.bulkPut(parsed);
        alert(`Successfully imported ${parsed.length} questions into your local bank.`);
        await loadQuestions();
      } else {
        alert('No discrete questions could be parsed from this file. Format should start questions with Q1, 1., etc.');
      }
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    }
  };

  const filtered = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.subject && q.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || q.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202342]">
            Local Question Bank
          </h1>
          <p className="text-xs sm:text-sm text-[#4e516a] mt-0.5">
            Store, tag, deduplicate, and curate questions for examination assembly. Stored 100% on your device.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label className="px-4 py-2 rounded-full border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-[#4555fd]" />
            <span>Import Questions</span>
            <input type="file" accept=".txt,.doc,.docx" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleScanDuplicates}
            className="px-4 py-2 rounded-full border border-amber-300 bg-amber-50 text-amber-800 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Check Duplicates</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-full bg-[#4555fd] hover:bg-[#3343e0] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question text, subject, or keywords..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4555fd] bg-white"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#4555fd] bg-white"
          >
            <option value="all">All Types</option>
            <option value="mcq">MCQ</option>
            <option value="short_answer">Short Answer</option>
            <option value="long_answer">Long Answer</option>
            <option value="assertion_reason">Assertion-Reason</option>
            <option value="case_study">Case Study</option>
          </select>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {filtered.length} {filtered.length === 1 ? 'Question' : 'Questions'} Available
        </span>
      </div>

      {/* Questions Table */}
      {filtered.length === 0 ? (
        <div className="mt-12 p-12 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-white">
          <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">Question Bank is Empty</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Import questions from past board papers or add your own custom questions to assemble exam papers.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-full bg-[#4555fd] text-white font-bold text-xs"
          >
            Add Your First Question
          </button>
        </div>
      ) : (
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {filtered.map(q => (
              <div key={q.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#edf2ff] text-[#4555fd] font-bold text-[10px] uppercase">
                      {q.type.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {q.marks} Mark{q.marks > 1 ? 's' : ''}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Class {q.grade} • {q.subject}
                    </span>
                    {q.bloomLevel && (
                      <span className="text-purple-700 text-[11px] font-semibold">
                        Bloom: {q.bloomLevel}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-[#202342] leading-relaxed">
                    {q.text}
                  </p>

                  {q.type === 'mcq' && q.options && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                      {q.options.map((opt, i) => (
                        <div key={opt.id} className={`p-1.5 rounded-lg border text-[11px] ${
                          opt.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}>
                          ({String.fromCharCode(97 + i)}) {opt.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.answer && (
                    <p className="text-[11px] text-emerald-700 font-medium pt-1">
                      <strong>Answer:</strong> {q.answer}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Duplicate Questions Modal */}
      {showDupeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50/60">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Duplicate Question Scanner</span>
              </div>
              <button onClick={() => setShowDupeModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {duplicates.length === 0 ? (
                <p className="text-center text-slate-500 py-6">
                  ✓ No similar or duplicate questions detected (Threshold: 75% similarity).
                </p>
              ) : (
                duplicates.map((d, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                      <span>Match #{idx + 1}</span>
                      <span>{d.similarity}% Similarity</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-800">
                      <strong>A:</strong> {d.original.text}
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-800">
                      <strong>B:</strong> {d.duplicate.text}
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={async () => {
                          await db.questionBank.delete(d.duplicate.id);
                          setDuplicates(duplicates.filter((_, i) => i !== idx));
                          await loadQuestions();
                        }}
                        className="text-xs text-red-600 font-bold hover:underline"
                      >
                        Remove Duplicate (B)
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Add Question to Local Bank</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Question Text</label>
                <textarea
                  required
                  rows={3}
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  placeholder="Enter the full question text..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#4555fd]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={newQType}
                    onChange={(e) => setNewQType(e.target.value as QuestionType)}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="mcq">MCQ</option>
                    <option value="short_answer">Short Answer</option>
                    <option value="long_answer">Long Answer</option>
                    <option value="assertion_reason">Assertion-Reason</option>
                    <option value="case_study">Case Study</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marks</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newQMarks}
                    onChange={(e) => setNewQMarks(parseInt(e.target.value, 10) || 1)}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={newQDiff}
                    onChange={(e) => setNewQDiff(e.target.value as DifficultyLevel)}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {newQType === 'mcq' && (
                <div className="space-y-2 pt-1">
                  <label className="block font-bold text-slate-700">Options (Select correct option)</label>
                  {newQOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctOptIdx === i}
                        onChange={() => setCorrectOptIdx(i)}
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const c = [...newQOptions];
                          c[i] = e.target.value;
                          setNewQOptions(c);
                        }}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Model Answer / Marking Scheme</label>
                <input
                  type="text"
                  value={newQAnswer}
                  onChange={(e) => setNewQAnswer(e.target.value)}
                  placeholder="Enter model answer..."
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#4555fd] hover:bg-[#3343e0] text-white font-bold"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
