import React, { useState } from 'react';
import { 
  BookOpen, Plus, Sparkles, Clock, CheckCircle2, 
  Upload, Trash2, Search, Filter, Atom, Binary, Code2, 
  BookMarked, HelpCircle, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Book } from '../../types';
import { BookReader } from './BookReader';

export const BookLibrary: React.FC = () => {
  const { books, saveBook, activeBookToRead, setActiveBookToRead } = useApp();

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
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-emerald">Digital Study Library</span>
            <span className="text-slate-500 text-xs font-mono">• Distraction-Free Reader</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center gap-2.5">
            📚 Read the Book
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access curriculum textbooks, highlighted formulas, study notes, and an integrated multilingual AI reading tutor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddBookModalOpen(true)}
            className="btn-primary text-xs py-2 px-4"
          >
            <Plus style={{ width: '13px', height: '13px' }} />
            <span>Add Study Book</span>
          </button>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search style={{ width: '14px', height: '14px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search textbooks or authors..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-2 text-xs w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['all', 'Science', 'Mathematics', 'Computer Science'].map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSubject === sub
                  ? 'bg-brand-500 text-slate-950 font-black'
                  : 'bg-slate-900/80 text-slate-400 border border-white/[0.06] hover:text-white'
              }`}
            >
              {sub === 'all' ? 'All Subjects' : sub}
            </button>
          ))}
        </div>
      </div>

      {/* ── Books Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => {
          return (
            <div
              key={book.id}
              className="glass rounded-3xl overflow-hidden border border-white/[0.08] hover:border-brand-500/40 transition-all flex flex-col justify-between card-hover shadow-xl group"
            >
              {/* Stylized Book Cover */}
              <div className={`p-6 bg-gradient-to-br ${book.coverGradient || 'from-emerald-700 via-teal-800 to-slate-900'} relative flex flex-col justify-between min-h-[170px] overflow-hidden`}>
                <div className="flex items-center justify-between relative z-10">
                  <span className="badge" style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '9px', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {book.subject}
                  </span>
                  <span className="text-[11px] font-mono text-white/70">
                    Class {book.grade || 10}
                  </span>
                </div>

                <div className="relative z-10 space-y-1">
                  <h3 className="text-lg font-display font-black text-white leading-tight drop-shadow-md">
                    {book.title}
                  </h3>
                  <p className="text-xs text-white/80 font-medium">
                    By {book.author || 'Curriculum Board'}
                  </p>
                </div>

                {/* Decorative background icon */}
                <div className="absolute right-[-15px] bottom-[-20px] opacity-15 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  <BookOpen style={{ width: '130px', height: '130px', color: '#fff' }} />
                </div>
              </div>

              {/* Book Details */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <BookMarked style={{ width: '13px', height: '13px', color: '#10b981' }} />
                      {book.chapters.length} Chapters
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock style={{ width: '12px', height: '12px' }} />
                      {book.lastOpened ? `Opened ${book.lastOpened}` : 'Not started'}
                    </span>
                  </div>

                  {/* Reading Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Reading Progress</span>
                      <span className="font-bold text-white">{book.progress}%</span>
                    </div>
                    <div className="mastery-bar">
                      <div
                        className="mastery-bar-fill high"
                        style={{ width: `${book.progress}%`, animation: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Highlights & Notes counts if any */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span>{(book.highlights || []).length} Highlights</span>
                    <span>•</span>
                    <span>{(book.notes || []).length} Notes</span>
                    <span>•</span>
                    <span>{(book.bookmarks || []).length} Bookmarks</span>
                  </div>
                </div>

                {/* Continue Reading CTA */}
                <button
                  onClick={() => setActiveReadingBook(book)}
                  className="btn-primary w-full justify-center py-2.5 text-xs rounded-xl shadow-md"
                >
                  <BookOpen style={{ width: '14px', height: '14px' }} />
                  <span>{book.progress > 0 ? 'Continue Reading' : 'Start Reading'}</span>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400">
                  <Plus style={{ width: '16px', height: '16px' }} />
                </div>
                <h3 className="text-base font-bold text-white">Add Study Book</h3>
              </div>
              <button 
                onClick={() => setIsAddBookModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NCERT Exemplar Problems Class 10"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Author / Publication</label>
                <input
                  type="text"
                  placeholder="e.g. NCERT / Arihant / R.D. Sharma"
                  value={newAuthor}
                  onChange={e => setNewAuthor(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="input-field text-xs bg-slate-950"
                >
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Marathi">Marathi</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Upload Document (PDF / TXT)</label>
                <div className="border border-dashed border-white/20 rounded-xl p-4 text-center cursor-pointer hover:border-brand-500/50 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.txt,.epub"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedBookFile(e.target.files[0]);
                        if (!newTitle) setNewTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                      }
                    }}
                    className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:bg-brand-500 file:text-slate-950 file:font-bold cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500 mt-2">
                    Note: TXT and standard PDF formatted texts are parsed immediately. DRM-protected EPUB files are converted to structured chapter excerpts.
                  </p>
                </div>
              </div>

              {addBookError && (
                <p className="text-xs text-rose-400">{addBookError}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4"
                >
                  Create &amp; Open Reader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
