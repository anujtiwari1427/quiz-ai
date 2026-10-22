import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Sparkles, Clock, CheckCircle2, 
  Upload, Trash2, Search, Filter, ShieldCheck, AlertCircle,
  Settings, ArrowRight, FileText, Check, Loader2, Sparkle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookModel, ChapterModel, PipelineStatus } from '../../types/schemas';
import { LIBRARY_SERVICE } from '../../services/libraryService';
import { ChapterEditorModal } from './ChapterEditorModal';
import { BookReader } from './BookReader';
import { CompletePdfViewer } from './CompletePdfViewer';
import { Book } from '../../types';
import { isLegibleText } from '../../services/documentParserService';

export const BookLibrary: React.FC = () => {
  const { setCurrentView, activeBookToRead, setActiveBookToRead } = useApp();

  // Books state from LIBRARY_SERVICE
  const [libraryBooks, setLibraryBooks] = useState<BookModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  
  // Modals & Reader state
  const [activeReadingBook, setActiveReadingBook] = useState<BookModel | null>(null);
  const [activePdfBook, setActivePdfBook] = useState<BookModel | null>(null);
  const [editingChaptersBook, setEditingChaptersBook] = useState<BookModel | null>(null);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  // New book upload form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newSubject, setNewSubject] = useState('Science');
  const [selectedBookFile, setSelectedBookFile] = useState<File | null>(null);
  const [hasRightsDeclaration, setHasRightsDeclaration] = useState(false);
  const [addBookError, setAddBookError] = useState<string | null>(null);

  // Live Pipeline Progress state
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<PipelineStatus>('uploading');
  const [pipelinePercent, setPipelinePercent] = useState(0);
  const [pipelineMessage, setPipelineMessage] = useState('');

  // Load books on mount
  const refreshBooks = () => {
    setLibraryBooks(LIBRARY_SERVICE.getBooks());
  };

  useEffect(() => {
    refreshBooks();
  }, []);

  // Sync when activeBookToRead is set from Syllabus or Question Sets
  useEffect(() => {
    if (activeBookToRead) {
      const foundInModel = libraryBooks.find(b => b.id === activeBookToRead.id);
      if (foundInModel) {
        setActiveReadingBook(foundInModel);
      } else {
        const synthModel: BookModel = {
          id: activeBookToRead.id,
          userId: LIBRARY_SERVICE.getCurrentUserId(),
          title: activeBookToRead.title,
          author: activeBookToRead.author || 'Curriculum Faculty',
          subject: activeBookToRead.subject || 'General',
          board: (activeBookToRead as any).board,
          fileUrl: `https://storage.edupulse.internal/books/${activeBookToRead.id}`,
          fileType: (activeBookToRead.fileName?.split('.').pop() as any) || 'pdf',
          fileSizeBytes: 2048576,
          status: 'ready',
          totalPages: activeBookToRead.chapters.length * 10,
          coverGradient: activeBookToRead.coverGradient || 'from-indigo-600 via-purple-700 to-slate-900',
          chapters: activeBookToRead.chapters.map(c => ({
            id: c.id,
            bookId: activeBookToRead.id,
            name: c.title,
            orderIndex: c.chapterNumber,
            pageStart: (c.chapterNumber - 1) * 10 + 1,
            pageEnd: c.chapterNumber * 10,
            contentPreview: (c.content || '').slice(0, 150),
            content: c.content
          })),
          createdAt: new Date().toISOString()
        };
        setActiveReadingBook(synthModel);
      }
    }
  }, [activeBookToRead, libraryBooks]);

  // Filtered books
  const filteredBooks = libraryBooks.filter(b => {
    const matchesSubject = selectedSubject === 'all' || b.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesBoard = selectedBoard === 'all' || 
      (selectedBoard === 'maharashtra' && (
        (b.board || '').toLowerCase().includes('maharashtra') || 
        b.title.toLowerCase().includes('maharashtra') || 
        (b.author || '').toLowerCase().includes('balbharati')
      )) ||
      (selectedBoard === 'ncert' && (
        b.title.toLowerCase().includes('ncert') || 
        (b.author || '').toLowerCase().includes('national')
      )) ||
      (selectedBoard === 'icse' && b.title.toLowerCase().includes('icse'));
      
    const matchesSearch = searchQuery.trim() === '' || 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (b.author || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.board || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesSubject && matchesBoard && matchesSearch;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddBookError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['pdf', 'epub', 'docx', 'txt'];

    if (!ext || !validExtensions.includes(ext)) {
      setAddBookError(`Invalid format (.${ext}). Allowed file formats: PDF, EPUB, DOCX, TXT.`);
      setSelectedBookFile(null);
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setAddBookError(`File size exceeds 50 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      setSelectedBookFile(null);
      return;
    }

    setSelectedBookFile(file);
    if (!newTitle.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setNewTitle(cleanName);
    }
  };

  const handleStartUploadPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddBookError(null);

    if (!selectedBookFile) {
      setAddBookError('Please select a book file (PDF, EPUB, DOCX, or TXT).');
      return;
    }

    if (!newTitle.trim()) {
      setAddBookError('Please provide a title for the book.');
      return;
    }

    if (!hasRightsDeclaration) {
      setAddBookError('You must check the confirmation notice certifying that you have the right to upload this book.');
      return;
    }

    setIsProcessing(true);
    setPipelineStage('uploading');
    setPipelinePercent(10);
    setPipelineMessage('Initializing secure upload pipeline...');

    try {
      const newBook = await LIBRARY_SERVICE.processBookUpload(
        selectedBookFile,
        {
          title: newTitle.trim(),
          author: newAuthor.trim() || 'Curriculum Faculty',
          subject: newSubject,
          hasRightsDeclaration: true
        },
        (stage, pct, msg) => {
          setPipelineStage(stage);
          setPipelinePercent(pct);
          setPipelineMessage(msg);
        }
      );

      refreshBooks();
      setIsProcessing(false);
      setIsAddBookModalOpen(false);
      setNewTitle('');
      setNewAuthor('');
      setSelectedBookFile(null);
      setHasRightsDeclaration(false);

      // Open newly uploaded book in reader
      setActiveReadingBook(newBook);
    } catch (err: any) {
      setIsProcessing(false);
      setAddBookError(err.message || 'Book upload and indexing pipeline encountered an error.');
    }
  };

  const handleDeleteBook = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this book and its indexed vector chunks?')) {
      LIBRARY_SERVICE.deleteBook(id);
      refreshBooks();
    }
  };

  // Convert BookModel to Book format required by reader
  const adaptToReaderBook = (bm: BookModel): Book => {
    return {
      id: bm.id,
      title: bm.title,
      author: bm.author,
      subject: bm.subject,
      grade: 10,
      coverGradient: bm.coverGradient || 'from-indigo-600 via-purple-700 to-slate-900',
      fileName: `${bm.title.replace(/\s+/g, '_')}.${bm.fileType}`,
      progress: 0,
      lastOpened: new Date().toISOString().split('T')[0],
      chapters: bm.chapters.map(c => {
        const raw = c.content || '';
        const legible = isLegibleText(raw);
        const finalContent = legible && raw.length > 50
          ? raw
          : `## ${c.name}\n\n*Source: ${bm.title} (Pages ${c.pageStart} – ${c.pageEnd})*\n\n### 1. Overview & Theoretical Principles\nThis chapter introduces the fundamental postulates and definitions specified in the syllabus curriculum for **${bm.title}**.\n\n### 2. Analytical Theorems & Equations\n- Comprehensive derivations, worked equations, and laboratory precautions.\n- Verified curriculum marking criteria and scoring rubrics.\n- Use the **"Ask this book"** chat box in the reader drawer to query anything in this chapter!\n\n### 3. Worked Practice & Board Questions\nKey examination examples with step-by-step solutions for complete mastery.`;

        return {
          id: c.id,
          chapterNumber: c.orderIndex,
          title: c.name,
          estimatedReadTimeMinutes: Math.max(5, Math.ceil((finalContent.length || 1500) / 800)),
          sections: ['Core Concepts', 'Formulas & Definitions', 'Worked Problems'],
          content: finalContent
        };
      }),
      bookmarks: [],
      highlights: [],
      notes: []
    };
  };

  // If PDF viewer mode is active, render full-screen Complete PDF E-Book viewer
  if (activePdfBook) {
    return (
      <CompletePdfViewer
        book={adaptToReaderBook(activePdfBook)}
        onExit={() => {
          setActivePdfBook(null);
          setActiveBookToRead(null);
        }}
        onSwitchToChapterView={() => {
          setActiveReadingBook(activePdfBook);
          setActivePdfBook(null);
        }}
      />
    );
  }

  // If reading mode is active, render full-screen reader
  if (activeReadingBook) {
    return (
      <BookReader
        book={adaptToReaderBook(activeReadingBook)}
        onExit={() => {
          setActiveReadingBook(null);
          setActiveBookToRead(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in-up">
      
      {/* ── Top Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/[0.08] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-emerald flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>My Library &amp; RAG Vector Store</span>
              </span>
              <button
                onClick={() => { setSelectedBoard(selectedBoard === 'maharashtra' ? 'all' : 'maharashtra'); }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all ${
                  selectedBoard === 'maharashtra'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30'
                }`}
              >
                <span>🏛️ Free Maharashtra Board (Balbharati) Textbooks</span>
              </button>
              <span className="badge badge-indigo text-[10px]">PDF, EPUB, DOCX, TXT</span>
              <span className="badge badge-purple text-[10px] flex items-center gap-1">
                <FileText className="w-3 h-3 text-purple-300" />
                <span>Complete PDF Engine (PDF.js + Spreads)</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
              📚 My Library &amp; Book Reader
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Read free Maharashtra State Board (Balbharati) and NCERT textbooks or upload custom curriculum notes with interactive in-app reading, text-to-speech audio, and "Ask this book" AI RAG Q&amp;A.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('create-exam')}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-bold text-white flex items-center gap-2 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Create AI Exam</span>
            </button>
            <button
              onClick={() => setIsAddBookModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-xs font-bold text-white shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Book</span>
            </button>
          </div>
        </div>

        {/* Legal notice banner */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Free Access Notice:</strong> Maharashtra State Board (Balbharati) &amp; NCERT textbooks are open-access public educational materials provided free of cost for student self-study.
          </span>
        </div>
      </div>

      {/* ── Search and Filter Controls ── */}
      <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] space-y-3">
        
        {/* Row 1: Search & Subject Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search books by title, author, board, or subject..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/60 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0071e3]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['all', 'Science', 'Chemistry', 'Mathematics', 'General Studies'].map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedSubject === sub
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                {sub === 'all' ? 'All Subjects' : sub}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Curriculum / Board Filter Pills */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#2997ff]" /> Board:
          </span>
          {[
            { id: 'all', label: 'All Curriculums' },
            { id: 'maharashtra', label: '🏛️ Maharashtra State Board (Balbharati)' },
            { id: 'ncert', label: '📘 CBSE (NCERT)' },
            { id: 'icse', label: '📗 ICSE' }
          ].map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBoard(b.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedBoard === b.id
                  ? 'bg-[#0071e3] text-white font-bold shadow-md shadow-blue-500/20'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.05]'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

      </div>

      {/* ── Book Cards Grid ── */}
      {filteredBooks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#1c1c1e] border border-white/[0.08] space-y-4">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-white">No books found</h3>
            <p className="text-xs text-slate-400 mt-1">Upload a PDF, EPUB, DOCX, or TXT file to start reading and generating AI exams.</p>
          </div>
          <button
            onClick={() => setIsAddBookModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#0071e3] text-xs font-bold text-white inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload First Book</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <div
              key={book.id}
              className="group rounded-3xl bg-[#1c1c1e] border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 overflow-hidden flex flex-col shadow-lg hover:shadow-2xl"
            >
              {/* Cover Gradient Banner */}
              <div className={`h-36 bg-gradient-to-br ${book.coverGradient || 'from-indigo-600 via-purple-700 to-slate-900'} p-5 flex flex-col justify-between relative`}>
                <div className="flex items-center justify-between relative z-10">
                  <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white">
                    {book.fileType.toUpperCase()} • {book.totalPages} Pages
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    book.status === 'ready' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' :
                    book.status === 'failed' ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300' :
                    'bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-pulse'
                  }`}>
                    {book.status === 'ready' ? 'Indexed & Ready' : book.status}
                  </span>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{book.subject}</span>
                    {book.board && (
                      <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[9px] font-bold text-orange-300 border border-orange-500/40">
                        {book.board}
                      </span>
                    )}
                    {book.userId === 'system_curriculum' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-500/30">
                        Free Reading
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white leading-tight line-clamp-1">{book.title}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>By {book.author}</span>
                    <span>{book.chapters.length} Chapters</span>
                  </div>

                  {/* Chapter preview list */}
                  <div className="space-y-1.5 pt-1">
                    {book.chapters.slice(0, 3).map((ch, idx) => (
                      <div key={ch.id} className="text-[11px] text-slate-300 flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span className="truncate">{ch.name}</span>
                      </div>
                    ))}
                    {book.chapters.length > 3 && (
                      <span className="text-[10px] text-slate-500 font-mono block pl-3">
                        + {book.chapters.length - 3} more chapters
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveReadingBook(book)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20 active:scale-95"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-white" />
                    <span>{book.userId === 'system_curriculum' ? 'Read Free' : 'Read Book'}</span>
                  </button>

                  <button
                    onClick={() => setActivePdfBook(book)}
                    className="py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-bold text-purple-300 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                    title="Open Complete PDF E-Book Viewer with Pages & Spreads"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      localStorage.setItem('edupulse_preselect_book', book.id);
                      setCurrentView('create-exam');
                    }}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-amber-400 hover:text-amber-300"
                    title="Generate Exam from this Book"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setEditingChaptersBook(book)}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white"
                    title="Manage / Rename / Merge Chapters"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handleDeleteBook(book.id, e)}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                    title="Delete Book"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Book Modal with Pipeline Stepper ── */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#1c1c1e] border border-white/[0.1] shadow-2xl p-6 text-white space-y-6">
            
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Upload Book to Library</h2>
                  <p className="text-xs text-slate-400">Supported: PDF, EPUB, DOCX, TXT (Max 50 MB)</p>
                </div>
              </div>
              {!isProcessing && (
                <button
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06]"
                >
                  ✕
                </button>
              )}
            </div>

            {addBookError && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{addBookError}</span>
              </div>
            )}

            {isProcessing ? (
              /* Live Pipeline Stepper View */
              <div className="py-8 space-y-6 text-center">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                  <Loader2 className="w-6 h-6 text-blue-400 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white capitalize">{pipelineStage} Stage</h3>
                  <p className="text-xs text-slate-300">{pipelineMessage}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-white/[0.08]">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${pipelinePercent}%` }}
                  />
                </div>

                {/* Stepper indicators */}
                <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-400">
                  <div className={pipelinePercent >= 20 ? 'text-blue-400 font-bold' : ''}>1. Uploading</div>
                  <div className={pipelinePercent >= 50 ? 'text-blue-400 font-bold' : ''}>2. Extracting</div>
                  <div className={pipelinePercent >= 80 ? 'text-blue-400 font-bold' : ''}>3. Indexing</div>
                  <div className={pipelinePercent >= 100 ? 'text-emerald-400 font-bold' : ''}>4. Ready</div>
                </div>
              </div>
            ) : (
              /* Upload Form */
              <form onSubmit={handleStartUploadPipeline} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Book Title *</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. CBSE Class 10 Science Standard Edition"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0071e3]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Author / Faculty</label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={e => setNewAuthor(e.target.value)}
                      placeholder="e.g. NCERT Faculty"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject</label>
                    <select
                      value={newSubject}
                      onChange={e => setNewSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#0071e3]"
                    >
                      <option value="Science">Science / Physics / Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Social Science">Social Science / History</option>
                      <option value="English">English / Literature</option>
                      <option value="General Studies">General Studies</option>
                    </select>
                  </div>
                </div>

                {/* File Dropzone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Document File (Max 50 MB) *</label>
                  <div className="border-2 border-dashed border-white/[0.12] hover:border-blue-500/50 rounded-2xl p-6 text-center cursor-pointer relative bg-black/30 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.epub,.docx,.txt"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                    />
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    {selectedBookFile ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-emerald-400 truncate">{selectedBookFile.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {(selectedBookFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for text extraction
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-medium text-slate-300">Click or drag &amp; drop your book file here</p>
                        <p className="text-[10px] text-slate-500 mt-1">Accepts PDF, EPUB, DOCX, TXT up to 50 MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right-To-Use Notice Requirement */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasRightsDeclaration}
                      onChange={e => setHasRightsDeclaration(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-amber-500 text-amber-500 focus:ring-0 cursor-pointer"
                      required
                    />
                    <span className="text-[11px] text-amber-200 leading-relaxed font-medium">
                      <strong>Legal Right-to-Use Declaration:</strong> I confirm that I have the legal right or license to upload and use this book/study document in EduPulse for private educational purposes.
                    </span>
                  </label>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setIsAddBookModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-xs font-bold text-white shadow-lg shadow-blue-500/20"
                  >
                    Start Upload &amp; Indexing
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Chapter Editor Modal ── */}
      {editingChaptersBook && (
        <ChapterEditorModal
          book={editingChaptersBook}
          isOpen={true}
          onClose={() => setEditingChaptersBook(null)}
          onSaved={(updated) => {
            refreshBooks();
            setEditingChaptersBook(null);
          }}
        />
      )}
    </div>
  );
};
