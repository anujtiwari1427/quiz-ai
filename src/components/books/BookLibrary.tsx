import React, { useState } from 'react';
import { 
  BookOpen, Plus, Sparkles, Clock, CheckCircle2, 
  Upload, Trash2, Search, Filter, Atom, Binary, Code2, 
  BookMarked, HelpCircle, X, Volume2, Bookmark, Star,
  ArrowRight, FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Book } from '../../types';
import { BookReader } from './BookReader';

export const BookLibrary: React.FC = () => {
  const { books, saveBook, activeBookToRead, setActiveBookToRead, setCurrentView } = useApp();

  const [activeReadingBook, setActiveReadingBook] = useState<Book | null>(activeBookToRead);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  // New book upload form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newSubject, setNewSubject] = useState('Science');
  const [selectedBookFile, setSelectedBookFile] = useState<File | null>(null);
  const [addBookError, setAddBookError] = useState<string | null>(null);

  // Filtered books
  const filteredBooks = books.filter(b => {
    const matchesSubject = selectedSubject === 'all' || b.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch = searchQuery.trim() === '' || 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (b.author || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    setAddBookError(null);

    if (!newTitle.trim()) {
      setAddBookError('Please enter a valid book title.');
      return;
    }

    const newBook: Book = {
      id: `book_${Date.now()}`,
      title: newTitle,
      author: newAuthor.trim() || 'Curriculum Faculty',
      subject: newSubject,
      grade: 10,
      coverGradient: newSubject.toLowerCase().includes('math')
        ? 'from-indigo-600 via-purple-700 to-slate-900'
        : newSubject.toLowerCase().includes('science')
        ? 'from-emerald-600 via-teal-700 to-slate-900'
        : 'from-amber-600 via-orange-700 to-slate-900',
      fileName: selectedBookFile?.name || `${newTitle.replace(/\s+/g, '_')}.pdf`,
      progress: 0,
      lastOpened: new Date().toISOString().split('T')[0],
      chapters: [
        {
          id: `ch_${Date.now()}_1`,
          chapterNumber: 1,
          title: 'Introduction and Key Fundamentals',
          estimatedReadTimeMinutes: 15,
          sections: ['1.1 Core Concepts', '1.2 Solved Examples', '1.3 Summary & Formulas'],
          content: `## Chapter 1: Introduction and Key Fundamentals\n\nWelcome to your study reader for **${newTitle}**.\n\n### 1.1 Overview\nThis digital edition allows you to highlight text, bookmark important sections, attach study notes, and ask our Claude 3.5 AI assistant to summarize or translate any paragraph in Hindi and Marathi.\n\n### 1.2 Board Exam Tips\n- Focus on foundational definitions.\n- Review chapter formulas daily.\n- Practice subjective problem solving step-by-step.`
        },
        {
          id: `ch_${Date.now()}_2`,
          chapterNumber: 2,
          title: 'Advanced Applications & Theorems',
          estimatedReadTimeMinutes: 20,
          sections: ['2.1 Theorem Proofs', '2.2 Real-World Case Studies'],
          content: `## Chapter 2: Advanced Applications & Theorems\n\n### 2.1 Applied Problem Solving\nIn this chapter, apply the equations learned in Chapter 1 to complex multi-step examination problems.\n\nUse the **AI Study Assistant** in the top right corner to generate practice questions directly from this content!`
        }
      ],
      bookmarks: [],
      highlights: [],
      notes: []
    };

    saveBook(newBook);
    setIsAddBookModalOpen(false);
    setNewTitle('');
    setNewAuthor('');
    setSelectedBookFile(null);
    setActiveReadingBook(newBook);
  };

  // If reading mode is active, render full-screen reader
  if (activeReadingBook) {
    return (
      <BookReader
        book={activeReadingBook}
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-emerald flex items-center gap-1">
                <BookOpen style={{ width: '11px', height: '11px' }} />
                <span>Distraction-Free E-Reader</span>
              </span>
              <span className="text-slate-400 text-xs font-mono">• NCERT &amp; Board Textbooks</span>
              <span className="badge badge-indigo text-[10px]">Multilingual AI Audio &amp; Highlights</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
              📖 Read the Book &amp; Digital Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Read prescribed board textbooks with customizable reading themes (Dark, Sepia, Paper Light), audio TTS reader, multilingual AI explanations in Hindi &amp; Marathi, and 1-click chapter quizzes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('syllabus')}
              className="btn-secondary text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5"
            >
              <FileText style={{ width: '13px', height: '13px', color: '#10b981' }} />
              <span>Syllabus Explorer</span>
            </button>
            <button
              onClick={() => setIsAddBookModalOpen(true)}
              className="btn-primary text-xs py-2.5 px-5 rounded-xl shadow-lg shadow-brand-500/25 flex items-center gap-1.5 font-bold"
            >
              <Plus style={{ width: '14px', height: '14px' }} />
              <span>Upload Book / Notes</span>
            </button>
          </div>
        </div>

        {/* Quick Reader Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/[0.06] text-xs">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
              <Volume2 style={{ width: '15px', height: '15px' }} />
            </div>
            <div>
              <span className="font-bold text-white block">Text-to-Speech</span>
              <span className="text-[10px] text-slate-400">Audio narration</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <Sparkles style={{ width: '15px', height: '15px' }} />
            </div>
            <div>
              <span className="font-bold text-white block">AI Chapter Tutor</span>
              <span className="text-[10px] text-slate-400">Hindi &amp; Marathi translations</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400">
              <Bookmark style={{ width: '15px', height: '15px' }} />
            </div>
            <div>
              <span className="font-bold text-white block">Study Notes &amp; Pens</span>
              <span className="text-[10px] text-slate-400">4-Color Highlighters</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400">
              <Star style={{ width: '15px', height: '15px' }} />
            </div>
            <div>
              <span className="font-bold text-white block">Instant Practice</span>
              <span className="text-[10px] text-slate-400">Pop quizzes with marks</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search style={{ width: '14px', height: '14px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search textbooks, chapters, or authors..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-2 text-xs w-full bg-slate-900 border-white/[0.08]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['all', 'Science', 'Mathematics', 'English', 'Computer Science'].map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                selectedSubject === sub
                  ? 'bg-brand-500 text-slate-950 border-brand-400 font-black shadow-md shadow-brand-500/20'
                  : 'bg-slate-900 text-slate-400 border-white/[0.06] hover:text-white'
              }`}
            >
              {sub === 'all' ? 'All Subjects' : sub}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3D Realistic Books Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => {
          return (
            <div
              key={book.id}
              className="glass rounded-3xl overflow-hidden border border-white/[0.08] hover:border-brand-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all flex flex-col justify-between card-hover shadow-xl group relative"
            >
              {/* Realistic Hardcover Book Spine & Face */}
              <div className={`p-6 bg-gradient-to-br ${book.coverGradient || 'from-emerald-700 via-teal-800 to-slate-900'} relative flex flex-col justify-between min-h-[190px] overflow-hidden`}>
                <div className="flex items-center justify-between relative z-10">
                  <span className="badge" style={{ background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: '9px', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {book.subject}
                  </span>
                  <span className="text-[11px] font-mono text-white/80 font-bold">
                    Class {book.grade || 10} • Board Standard
                  </span>
                </div>

                <div className="relative z-10 space-y-1 mt-4">
                  <h3 className="text-xl font-display font-black text-white leading-tight drop-shadow-md group-hover:text-emerald-200 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-white/80 font-medium">
                    By {book.author || 'Curriculum Board'}
                  </p>
                </div>

                {/* Decorative background book illustration */}
                <div className="absolute right-[-15px] bottom-[-20px] opacity-15 pointer-events-none group-hover:scale-115 transition-transform duration-500">
                  <BookOpen style={{ width: '140px', height: '140px', color: '#fff' }} />
                </div>
              </div>

              {/* Book Details & Meta */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <BookMarked style={{ width: '14px', height: '14px', color: '#10b981' }} />
                      <strong className="text-white font-mono">{book.chapters.length}</strong> Chapters
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock style={{ width: '12px', height: '12px' }} />
                      {book.lastOpened ? `Opened ${book.lastOpened}` : 'Ready to start'}
                    </span>
                  </div>

                  {/* Reading Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Reading Completion</span>
                      <span className="font-bold text-emerald-400 font-mono">{book.progress}%</span>
                    </div>
                    <div className="mastery-bar">
                      <div
                        className="mastery-bar-fill high transition-all duration-500"
                        style={{ width: `${book.progress}%`, animation: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Highlights, Notes and Audio Pills */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/[0.04]">
                    <span>{(book.highlights || []).length} Highlights</span>
                    <span>•</span>
                    <span>{(book.notes || []).length} Notes</span>
                    <span>•</span>
                    <span className="text-amber-400 font-medium">TTS Audio Ready</span>
                  </div>
                </div>

                {/* Start / Continue Reading Button */}
                <button
                  onClick={() => setActiveReadingBook(book)}
                  className="btn-primary w-full justify-center py-2.5 text-xs rounded-xl shadow-md font-bold gap-2"
                >
                  <BookOpen style={{ width: '14px', height: '14px' }} />
                  <span>{book.progress > 0 ? 'Continue Reading' : 'Start Reading Book'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add Book Modal ── */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="glass rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/[0.1] shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <BookOpen style={{ width: '18px', height: '18px' }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Upload Textbook / Notes</h3>
                  <p className="text-xs text-slate-400">Add digital PDF or chapter notes to your library</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddBookModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Book / Textbook Title</label>
                <input
                  type="text"
                  placeholder="e.g. NCERT Class 10 Science Exemplar"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="input-field text-xs w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Author / Publisher</label>
                  <input
                    type="text"
                    placeholder="e.g. NCERT Faculty"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    className="input-field text-xs w-full"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="input-field text-xs bg-slate-950 w-full"
                  >
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Social Science">Social Science</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Upload Document File (PDF/TXT/EPUB)</label>
                <input
                  type="file"
                  accept=".pdf,.txt,.epub,.docx"
                  onChange={e => e.target.files && setSelectedBookFile(e.target.files[0])}
                  className="input-field text-xs w-full file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-500 file:text-slate-950 cursor-pointer"
                />
              </div>

              {addBookError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                  {addBookError}
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.06] text-slate-400 text-[11px] leading-relaxed">
                ✓ Once created, your book chapters will be automatically indexed with full text search, highlighting, bookmarking, and multilingual AI reading assistance.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2.5 px-5 rounded-xl shadow-lg shadow-brand-500/25 font-bold"
                >
                  Save &amp; Open Reader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookLibrary;
