import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Database,
  Filter,
  Check,
  X,
  Upload
} from 'lucide-react';
import { db } from '../../db';
import { INGESTION_SERVICE } from '../../services/ingestionService';
import { QuestionItem, QuestionType, DifficultyLevel, BloomsLevel } from '../../types';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Pagination } from '../ui/Table';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/EmptyState';
import { useToast } from '../ui/Toast';

export const QuestionBankView: React.FC = () => {
  const { success, error } = useToast();
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Duplicates modal
  const [duplicates, setDuplicates] = useState<{ original: QuestionItem; duplicate: QuestionItem; similarity: number }[]>([]);
  const [showDupeModal, setShowDupeModal] = useState(false);

  // Add question modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState<QuestionType>('mcq');
  const [newMarks, setNewMarks] = useState(1);
  const [newDiff, setNewDiff] = useState<DifficultyLevel>('medium');
  const [newBloom, setNewBloom] = useState<BloomsLevel>('Understand');
  const [newSubject, setNewSubject] = useState('Science');
  const [newGrade, setNewGrade] = useState(10);
  const [newAnswer, setNewAnswer] = useState('');
  const [newOptions, setNewOptions] = useState<string[]>(['Option A', 'Option B', 'Option C', 'Option D']);
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

  const handleDelete = async (id: string) => {
    try {
      await db.questionBank.delete(id);
      success('Question removed.');
      await loadQuestions();
    } catch (err: any) {
      error(`Delete failed: ${err.message}`);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} selected questions?`)) return;
    try {
      await db.questionBank.bulkDelete(selectedIds);
      setSelectedIds([]);
      success(`Deleted ${selectedIds.length} questions.`);
      await loadQuestions();
    } catch (err: any) {
      error(`Bulk delete failed: ${err.message}`);
    }
  };

  const handleSaveNewQuestion = async () => {
    if (!newText.trim()) {
      error('Question text is required.');
      return;
    }

    try {
      const q: QuestionItem = {
        id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        text: newText.trim(),
        type: newType,
        marks: newMarks,
        difficulty: newDiff,
        bloomLevel: newBloom,
        subject: newSubject,
        grade: newGrade,
        board: 'CBSE',
        answer: newAnswer.trim(),
        options: newType === 'mcq'
          ? newOptions.map((opt, i) => ({
              id: `opt_${i + 1}`,
              text: opt,
              isCorrect: i === correctOptIdx
            }))
          : undefined,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await db.questionBank.add(q);
      success('Question added to your local bank.');
      setShowAddModal(false);
      setNewText('');
      await loadQuestions();
    } catch (err: any) {
      error(`Save failed: ${err.message}`);
    }
  };

  const filtered = questions.filter(q => {
    const matchesQuery = q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.subject && q.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.chapter && q.chapter.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || q.type === selectedType;
    const matchesDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return matchesQuery && matchesType && matchesDiff;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedQuestions = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Question Bank
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Store, tag, and reuse previous year questions (PYQs) and exercise items across your papers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleScanDuplicates}
          >
            Scan Duplicates
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            Add Question
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-soft-xs">
        <div className="w-full md:max-w-md">
          <Input
            placeholder="Search questions by text, chapter, or topic..."
            leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Select
            value={selectedType}
            onValueChange={(val) => {
              setSelectedType(val);
              setPage(1);
            }}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'mcq', label: 'MCQs' },
              { value: 'short_answer', label: 'Short Answer' },
              { value: 'long_answer', label: 'Long Answer' },
            ]}
          />

          <Select
            value={selectedDifficulty}
            onValueChange={(val) => {
              setSelectedDifficulty(val);
              setPage(1);
            }}
            options={[
              { value: 'all', label: 'All Difficulties' },
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ]}
          />
        </div>
      </div>

      {/* Bulk Action Toolbar if rows selected */}
      {selectedIds.length > 0 && (
        <div className="p-3 rounded-xl bg-neutral-900 text-white flex items-center justify-between text-xs font-medium animate-in fade-in-0">
          <span>{selectedIds.length} questions selected</span>
          <Button
            variant="danger"
            size="xs"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={handleBulkDelete}
          >
            Delete Selected
          </Button>
        </div>
      )}

      {/* Questions Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No questions found in bank"
          description={
            searchQuery
              ? 'No questions match your current filters.'
              : 'Add questions manually or upload textbook exercise sheets to populate your local bank.'
          }
          action={
            searchQuery
              ? undefined
              : {
                  label: 'Add First Question',
                  onClick: () => setShowAddModal(true),
                  icon: <Plus className="w-4 h-4" />
                }
          }
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedQuestions.length && paginatedQuestions.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(paginatedQuestions.map(q => q.id));
                      else setSelectedIds([]);
                    }}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                </TableHead>
                <TableHead>Question Content</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Difficulty / Bloom</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedQuestions.map((q) => {
                const isSelected = selectedIds.includes(q.id);
                return (
                  <TableRow key={q.id} isSelected={isSelected}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (isSelected) setSelectedIds(selectedIds.filter(id => id !== q.id));
                          else setSelectedIds([...selectedIds, q.id]);
                        }}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100 line-clamp-2">
                        {q.text}
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5 truncate">
                        {q.subject} • Class {q.grade} {q.chapter ? `• ${q.chapter}` : ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="structure">{q.type.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-brand-600">
                      {q.marks}M
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="neutral">{q.difficulty}</Badge>
                        <Badge variant="info">{q.bloomLevel}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="xs"
                        className="text-danger-600"
                        onClick={() => handleDelete(q.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filtered.length}
            onPageChange={setPage}
          />
        </Card>
      )}

      {/* Add Question Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="lg"
        title="Add Question to Local Bank"
        description="Tag with difficulty, Bloom taxonomy level, and model answers for rubric scoring."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSaveNewQuestion}>Save to Bank</Button>
          </>
        }
      >
        <div className="space-y-4 py-2 text-left">
          <Textarea
            label="Question Prompt"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Write question here..."
            required
            rows={3}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Select
              label="Type"
              value={newType}
              onValueChange={(val: any) => setNewType(val)}
              options={[
                { value: 'mcq', label: 'MCQ' },
                { value: 'short_answer', label: 'Short Answer' },
                { value: 'long_answer', label: 'Long Answer' },
                { value: 'true_false', label: 'True / False' },
              ]}
            />
            <Input
              label="Marks"
              type="number"
              min={1}
              value={newMarks}
              onChange={(e) => setNewMarks(parseInt(e.target.value, 10) || 1)}
            />
            <Select
              label="Difficulty"
              value={newDiff}
              onValueChange={(val: any) => setNewDiff(val)}
              options={[
                { value: 'easy', label: 'Easy' },
                { value: 'medium', label: 'Medium' },
                { value: 'hard', label: 'Hard' },
              ]}
            />
            <Select
              label="Bloom Level"
              value={newBloom}
              onValueChange={(val: any) => setNewBloom(val)}
              options={[
                { value: 'Remember', label: 'Remember' },
                { value: 'Understand', label: 'Understand' },
                { value: 'Apply', label: 'Apply' },
                { value: 'Analyze', label: 'Analyze' },
              ]}
            />
          </div>

          {newType === 'mcq' && (
            <div className="space-y-2 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                MCQ Options (Check the correct answer):
              </span>
              {newOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct-opt"
                    checked={correctOptIdx === i}
                    onChange={() => setCorrectOptIdx(i)}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newOptions];
                      updated[i] = e.target.value;
                      setNewOptions(updated);
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          )}

          <Textarea
            label="Model Answer / Marking Scheme"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Provide model solution or key points for full marks..."
            rows={2}
          />
        </div>
      </Modal>

      {/* Duplicates Modal */}
      <Modal
        isOpen={showDupeModal}
        onClose={() => setShowDupeModal(false)}
        size="lg"
        title={`Duplicate Questions (${duplicates.length} Found)`}
        description="Questions with over 75% token similarity are flagged to prevent repetitive papers."
      >
        <div className="space-y-4 py-2 text-left">
          {duplicates.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              Zero duplicate questions detected in your bank!
            </div>
          ) : (
            duplicates.map((pair, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <Badge variant="danger">{pair.similarity}% Similar</Badge>
                  <Button
                    variant="danger"
                    size="xs"
                    onClick={async () => {
                      await handleDelete(pair.duplicate.id);
                      setDuplicates(duplicates.filter((_, i) => i !== idx));
                    }}
                  >
                    Delete Duplicate
                  </Button>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Original: {pair.original.text}
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400">
                    Match: {pair.duplicate.text}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

    </div>
  );
};
