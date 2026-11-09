import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Upload, 
  Search, 
  Filter, 
  FileText, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Calendar, 
  Layers, 
  Tag, 
  Hash, 
  User, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { BookModel, ChapterModel, DetectedExercise } from '../../types/schemas';
import { LIBRARY_SERVICE } from '../../services/libraryService';
import { TextbookUploadModal } from './TextbookUploadModal';
import { useApp } from '../../context/AppContext';

export const MyTextbooksView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [books, setBooks] = useState<BookModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);

  // Rename modal state
  const [renamingBook, setRenamingBook] = useState<BookModel | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // Delete modal state
  const [deletingBook, setDeletingBook] = useState<BookModel | null>(null);

  // Reprocess state
  const [reprocessingBookId, setReprocessingBookId] = useState<string | null>(null);
  const [reprocessStatus, setReprocessStatus] = useState<string>('');

  const loadBooks = () => {
    const list = LIBRARY_SERVICE.getBooks();
    setBooks(list);
    if (!expandedBookId && list.length > 0) {
      setExpandedBookId(list[0].id);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingBook || !newTitle.trim()) return;

    LIBRARY_SERVICE.renameBook(renamingBook.id, newTitle.trim());
    setRenamingBook(null);
    setNewTitle('');
    loadBooks();
  };

  const handleDelete = () => {
    if (!deletingBook) return;
    LIBRARY_SERVICE.deleteBook(deletingBook.id);
    setDeletingBook(null);
    loadBooks();
  };

  const handleReprocess = async (book: BookModel) => {
    setReprocessingBookId(book.id);
    setReprocessStatus('Re-extracting textbook pages...');
    try {
      await LIBRARY_SERVICE.reprocessBook(book.id, (stage, percent, message) => {
        setReprocessStatus(`[${stage}] ${percent}% - ${message}`);
      });
      loadBooks();
    } catch (err: any) {
      alert(`Re-processing failed: ${err.message || 'File not available'}`);
    } finally {
      setReprocessingBookId(null);
      setReprocessStatus('');
    }
  };

  // Filter books by search query and subject
  const filteredBooks = books.filter(b => {
    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.uploaderName && b.uploaderName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.chapters && b.chapters.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesSubject = selectedSubject === 'all' || b.subject.toLowerCase() === selectedSubject.toLowerCase();
    return matchesSearch && matchesSubject;
  });

  const subjects = Array.from(new Set(books.map(b => b.subject))).filter(Boolean);

  return (
    <div className="flex-1 bg-slate-50 dark:bg-[#07090e] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Textbook Ingestion Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight">
              My Textbooks & Exercise Bank
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Uploaded curriculum books with page-by-page extracted chapters and auto-detected exercise sets
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Upload New Textbook
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by textbook title, subject, chapter name, or uploader..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Subjects ({books.length})</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Books List */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No textbooks found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery ? 'No textbooks match your search query.' : 'Upload your first syllabus or curriculum PDF to get started.'}
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
            >
              <Upload className="w-4 h-4" />
              Upload Textbook Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBooks.map((book) => {
              const isExpanded = expandedBookId === book.id;
              const isReprocessing = reprocessingBookId === book.id;
              const totalExercises = (book.chapters || []).reduce((acc, c) => acc + (c.exerciseCount || 0), 0);

              return (
                <div
                  key={book.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all"
                >
                  {/* Book Card Summary Row */}
                  <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center flex-shrink-0 text-slate-700 dark:text-slate-300 font-bold">
                        <FileText className="w-6 h-6 text-emerald-600" />
                        <span className="text-[9px] uppercase tracking-wider font-mono mt-0.5">
                          {book.fileType || 'PDF'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            {book.title}
                          </h2>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {book.subject}
                          </span>

                          {/* Status Badge */}
                          {book.status === 'ready' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Ready
                            </span>
                          )}
                          {book.status === 'failed' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800">
                              <AlertCircle className="w-3 h-3" />
                              Extraction Failed
                            </span>
                          )}
                          {book.status === 'uploading' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Processing...
                            </span>
                          )}
                        </div>

                        {/* Metadata row */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          {book.uploaderName && (
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              {book.uploaderName}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                            {book.totalPages} Pages
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            {(book.chapters || []).length} Chapters
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            <Tag className="w-3.5 h-3.5" />
                            {totalExercises} Exercises Detected
                          </span>
                          {book.fileSizeBytes && (
                            <span>
                              {(book.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                            </span>
                          )}
                          {book.createdAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(book.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {book.errorMessage && (
                          <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                            {book.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                      
                      {/* Generate Test Paper Button */}
                      <button
                        onClick={() => {
                          // Sets active textbook and navigates to exercise test generator
                          localStorage.setItem('qpm_selected_book_id', book.id);
                          setCurrentView('ai-paper-gen');
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Generate Test Paper
                      </button>

                      {/* Reprocess Button */}
                      <button
                        onClick={() => handleReprocess(book)}
                        disabled={isReprocessing}
                        title="Re-extract and detect chapters/exercises again"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 ${isReprocessing ? 'animate-spin text-emerald-600' : ''}`} />
                        <span className="hidden sm:inline">Re-process</span>
                      </button>

                      {/* Rename Button */}
                      <button
                        onClick={() => {
                          setRenamingBook(book);
                          setNewTitle(book.title);
                        }}
                        title="Rename textbook title"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Rename</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeletingBook(book)}
                        title="Delete textbook from library"
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Chapter expander */}
                      <button
                        onClick={() => setExpandedBookId(isExpanded ? null : book.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
                      >
                        <span>Chapters</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Reprocess Status Bar */}
                  {isReprocessing && (
                    <div className="px-6 py-2 bg-emerald-50 dark:bg-emerald-950/30 border-t border-emerald-200 dark:border-emerald-800/50 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{reprocessStatus}</span>
                    </div>
                  )}

                  {/* Expanded Chapter Tree with Tagged Exercises */}
                  {isExpanded && (
                    <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-5 sm:p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Chapters & Tagged Exercise Sets ({book.chapters?.length || 0})
                        </h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Click any chapter or exercise to generate targeted questions
                        </span>
                      </div>

                      {(!book.chapters || book.chapters.length === 0) ? (
                        <p className="text-xs text-slate-500 italic py-2">
                          No chapters detected. Click "Re-process" to run chapter detection.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {book.chapters.map((ch, idx) => (
                            <div
                              key={ch.id || idx}
                              className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {ch.name}
                                  </p>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Pages {ch.pageStart} – {ch.pageEnd}
                                  </p>
                                </div>
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                  Ch. {ch.orderIndex || idx + 1}
                                </span>
                              </div>

                              {/* Detected Exercises Badges */}
                              {ch.detectedExercises && ch.detectedExercises.length > 0 ? (
                                <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-700/40">
                                  <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                                    Exercises Detected ({ch.detectedExercises.length}):
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {ch.detectedExercises.map((ex, exIdx) => (
                                      <span
                                        key={ex.id || exIdx}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                      >
                                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                        <span className="font-semibold">{ex.title}</span>
                                        <span className="text-emerald-600/70">(p.{ex.page})</span>
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-[10px] text-slate-400 italic">
                                  General content chapter (no standalone exercise headings detected)
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Upload Modal */}
      <TextbookUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={(newBook) => {
          loadBooks();
          setExpandedBookId(newBook.id);
        }}
      />

      {/* Rename Modal */}
      {renamingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Rename Textbook
            </h3>
            <form onSubmit={handleRename} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Textbook Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRenamingBook(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Save Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Textbook?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-900 dark:text-white">"{deletingBook.title}"</strong>? This will remove all extracted chapters, exercise references, and cached files from storage.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingBook(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Delete Textbook
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
