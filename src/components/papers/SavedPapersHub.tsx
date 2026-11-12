import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Plus, Calendar, BookOpen, 
  Download, Trash2, Copy, ExternalLink, CheckCircle,
  Clock, AlertCircle, Sparkles, Filter
} from 'lucide-react';
import { db } from '../../db';
import { SavedPaper } from '../../types';
import { exportQuestionPaperDocx, exportAnswerKeyDocx, exportPrintReadyPdf, exportPaperJson } from '../../services/paperExportService';

interface SavedPapersHubProps {
  onOpenEditor: (paperId: string) => void;
  onCreateNew: () => void;
  onReuseBlueprint?: (blueprintId: string) => void;
}

export const SavedPapersHub: React.FC<SavedPapersHubProps> = ({
  onOpenEditor,
  onCreateNew,
  onReuseBlueprint
}) => {
  const [papers, setPapers] = useState<SavedPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      setLoading(true);
      const allPapers = await db.savedPapers.toArray();
      // sort latest first
      allPapers.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setPapers(allPapers);
    } catch (err) {
      console.error('Failed to load papers:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3500);
  };

  const handleDuplicate = async (paper: SavedPaper) => {
    try {
      const newId = `paper-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const duplicated: SavedPaper = {
        ...paper,
        id: newId,
        title: `${paper.title} (Copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      await db.savedPapers.add(duplicated);
      showToast(`Duplicated "${paper.title}" successfully.`);
      await loadPapers();
    } catch (err: any) {
      alert(`Duplicate failed: ${err.message}`);
    }
  };

  const handleDelete = async (paperId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await db.savedPapers.delete(paperId);
      showToast(`Deleted "${title}".`);
      await loadPapers();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleExport = async (paper: SavedPaper, type: 'pdf-qp' | 'pdf-ak' | 'docx-qp' | 'docx-ak' | 'json') => {
    setExportingId(paper.id);
    try {
      if (type === 'pdf-qp') {
        exportPrintReadyPdf(paper, 'qp');
        showToast('Question Paper PDF generated!');
      } else if (type === 'pdf-ak') {
        exportPrintReadyPdf(paper, 'ak');
        showToast('Answer Key PDF generated!');
      } else if (type === 'docx-qp') {
        await exportQuestionPaperDocx(paper);
        showToast('Question Paper DOCX exported!');
      } else if (type === 'docx-ak') {
        await exportAnswerKeyDocx(paper);
        showToast('Answer Key DOCX exported!');
      } else if (type === 'json') {
        exportPaperJson(paper);
        showToast('Paper JSON downloaded!');
      }
    } catch (err: any) {
      alert(`Export error: ${err.message}`);
    } finally {
      setExportingId(null);
    }
  };

  // Distinct filter options
  const subjects = Array.from(new Set(papers.map(p => p.subject))).filter(Boolean);
  const grades = Array.from(new Set(papers.map(p => p.grade))).filter(Boolean);

  const filteredPapers = papers.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.schoolName && p.schoolName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.examName && p.examName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = selectedSubject === 'all' || p.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'all' || String(p.grade) === selectedGrade;

    return matchesSearch && matchesSubject && matchesGrade;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Toast Notification */}
      {message && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-up">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Saved Exam Papers
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            All your generated and customized question papers stored securely on your local device.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Paper
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, subject, school, exam name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            >
              <option value="all">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
          >
            <option value="all">All Classes</option>
            {grades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-3" />
          <p className="text-slate-500 text-sm">Loading your saved papers from local storage...</p>
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 max-w-xl mx-auto my-12">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No exam papers found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {searchQuery || selectedSubject !== 'all' || selectedGrade !== 'all'
              ? 'No papers match your search filters.'
              : 'You haven’t created any question papers yet. Upload a textbook or pick a blueprint to get started!'}
          </p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Your First Exam Paper
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => {
            const totalQuestions = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);
            const dateStr = new Date(paper.updatedAt || paper.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={paper.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {paper.subject} • {paper.grade}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {paper.totalMarks} Marks
                    </span>
                  </div>

                  {/* Title & School */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 mb-1">
                    {paper.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-4">
                    {paper.schoolName || 'Standard Exam Paper'} • {paper.examName || 'Assessment'}
                  </p>

                  {/* Stats snippet */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl mb-4 text-xs">
                    <div>
                      <div className="text-slate-400 font-medium">Sections</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{paper.sections.length}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">Questions</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{totalQuestions}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">Duration</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{paper.durationMinutes || 180}m</div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Updated {dateStr}
                    </span>
                    {paper.sets && paper.sets.length > 1 && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {paper.sets.length} Sets (A/B/C)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenEditor(paper.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Edit Paper
                    </button>

                    <div className="relative group">
                      <button
                        disabled={exportingId === paper.id}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
                        title="Export options"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* Dropdown on hover */}
                      <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-30">
                        <button
                          onClick={() => handleExport(paper, 'pdf-qp')}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 flex items-center justify-between"
                        >
                          <span>PDF Question Paper</span>
                          <span className="text-[10px] text-slate-400">Print</span>
                        </button>
                        <button
                          onClick={() => handleExport(paper, 'pdf-ak')}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 flex items-center justify-between"
                        >
                          <span>PDF Answer Key</span>
                          <span className="text-[10px] text-slate-400">Print</span>
                        </button>
                        <button
                          onClick={() => handleExport(paper, 'docx-qp')}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 flex items-center justify-between"
                        >
                          <span>DOCX Paper</span>
                          <span className="text-[10px] text-slate-400">Word</span>
                        </button>
                        <button
                          onClick={() => handleExport(paper, 'docx-ak')}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 flex items-center justify-between"
                        >
                          <span>DOCX Answer Key</span>
                          <span className="text-[10px] text-slate-400">Word</span>
                        </button>
                        <button
                          onClick={() => handleExport(paper, 'json')}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 flex items-center justify-between"
                        >
                          <span>Backup JSON</span>
                          <span className="text-[10px] text-slate-400">JSON</span>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDuplicate(paper)}
                      className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
                      title="Duplicate this paper"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(paper.id, paper.title)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
                      title="Delete paper"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
