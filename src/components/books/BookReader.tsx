import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Bookmark, Highlighter, 
  StickyNote, Sparkles, Search, Sun, Moon, ZoomIn, ZoomOut, 
  Type, CheckCircle2, BookOpen, Layers, X, HelpCircle, Copy, 
  MessageSquare, Lightbulb, Compass, Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Book, BookChapter, BookHighlight, BookNote } from '../../types';

interface BookReaderProps {
  book: Book;
  onExit: () => void;
}

export const BookReader: React.FC<BookReaderProps> = ({ book, onExit }) => {
  const { 
    updateReadingProgress, 
    addBookHighlight, 
    addBookNote, 
    toggleBookBookmark,
    startQuizFromSyllabus 
  } = useApp();

  // Active chapter state
  const [currentChapterId, setCurrentChapterId] = useState<string>(
    book.currentChapterId || book.chapters[0]?.id || ''
  );

  // Reader Controls state
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [readingTheme, setReadingTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [isTocOpen, setIsTocOpen] = useState(true);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Highlighting & Notes state
  const [selectedText, setSelectedText] = useState<string>('');
  const [showTextMenu, setShowTextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [activeTabDrawer, setActiveTabDrawer] = useState<'toc' | 'notes' | 'highlights'>('toc');

  // AI Assistant state
  const [aiActionOutput, setAiActionOutput] = useState<{
    title: string;
    content: string;
    language?: string;
    flashcards?: { front: string; back: string }[];
  } | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);

  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Current chapter
  const currentChapter = useMemo(() => {
    return book.chapters.find(ch => ch.id === currentChapterId) || book.chapters[0];
  }, [book, currentChapterId]);

  const currentChapterIndex = book.chapters.findIndex(ch => ch.id === currentChapter.id);
  const isBookmarked = (book.bookmarks || []).includes(currentChapter.id);

  // Update progress in storage on chapter change
  useEffect(() => {
    if (!book || !currentChapter) return;
    const progressPct = Math.round(((currentChapterIndex + 1) / book.chapters.length) * 100);
    updateReadingProgress(book.id, progressPct, currentChapter.id);
  }, [currentChapterId, book.id]);

  // Handle text selection in the reader
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 3) {
      const text = selection.toString().trim();
      setSelectedText(text);

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setMenuPosition({
        x: rect.left + rect.width / 2,
        y: Math.max(10, rect.top - 48)
      });
      setShowTextMenu(true);
    } else {
      setShowTextMenu(false);
    }
  };

  const handleApplyHighlight = (color: 'yellow' | 'emerald' | 'indigo' | 'rose') => {
    if (!selectedText) return;
    const hl: BookHighlight = {
      id: `hl_${Date.now()}`,
      chapterId: currentChapter.id,
      text: selectedText,
      color,
      createdAt: new Date().toISOString().split('T')[0]
    };
    addBookHighlight(book.id, hl);
    setShowTextMenu(false);
    setSelectedText('');
  };

  const handleSaveNote = () => {
    if (!newNoteContent.trim()) return;
    const note: BookNote = {
      id: `note_${Date.now()}`,
      chapterId: currentChapter.id,
      selectedText: selectedText || undefined,
      noteText: newNoteContent,
      createdAt: new Date().toISOString().split('T')[0]
    };
    addBookNote(book.id, note);
    setNewNoteContent('');
    setIsNoteModalOpen(false);
    setShowTextMenu(false);
    setSelectedText('');
  };

  // Chapter navigation
  const handleNextChapter = () => {
    if (currentChapterIndex < book.chapters.length - 1) {
      const nextCh = book.chapters[currentChapterIndex + 1];
      setCurrentChapterId(nextCh.id);
      contentContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      const prevCh = book.chapters[currentChapterIndex - 1];
      setCurrentChapterId(prevCh.id);
      contentContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ── AI Reading Assistant actions ──
  const triggerAiAction = (actionType: string) => {
    setIsAiThinking(true);
    setIsAiAssistantOpen(true);
    setAiActionOutput(null);
    setIsFlashcardFlipped(false);
    setActiveFlashcardIndex(0);

    setTimeout(() => {
      setIsAiThinking(false);

      if (actionType === 'summarize') {
        setAiActionOutput({
          title: `Summary of ${currentChapter.title}`,
          content: `### Key Takeaways:\n1. **Fundamental Principle**: This chapter articulates the core equations and physical conservation principles governing ${book.subject}.\n2. **Critical Formulas**: Memorize standard sign conventions, the basic proportionality theorem, and harmonic series relations.\n3. **Frequent Board Questions**: Exam questions frequently test derivations, diagrammatic labeling, and unit conversions (e.g. cm to meters).`
        });
      } else if (actionType === 'explain_simple') {
        setAiActionOutput({
          title: `Simple Explanation: ${currentChapter.title}`,
          content: `Imagine you are explaining this to a 7th grader! 🌟\n\nInstead of complicated technical jargon, think of this chapter like a set of everyday rules:\n- Light behaves like water ripples or bouncy tennis balls reflecting off smooth surfaces.\n- Electricity is like water flowing through pipes; resistors are like narrow pipes that resist the flow.\n\nKeep this visual mental model in mind when solving complex numerical questions!`
        });
      } else if (actionType === 'explain_hindi') {
        setAiActionOutput({
          title: `हिंदी में स्पष्टीकरण (Hindi Explanation)`,
          content: `### अध्याय: ${currentChapter.title}\n\n**मुख्य बिंदु (हिंदी में):**\n1. **मूल सिद्धांत**: इस पाठ में सबसे महत्वपूर्ण बात यह है कि सभी वैज्ञानिक नियम (जैसे परावर्तन और अपवर्तन) निश्चित गणितीय सूत्रों पर आधारित हैं।\n2. **सावधानी**: परीक्षा में हमेशा चिन्ह परिपाटी (Sign Convention) का ध्यान रखें। उत्तल (Convex) और अवतल (Concave) के सूत्रों में भ्रमित न हों।\n3. **बोर्ड टिप**: परिभाषा लिखते समय मानक इकाइयों (SI Units) को लिखना कभी न भूलें!`
        });
      } else if (actionType === 'explain_marathi') {
        setAiActionOutput({
          title: `मराठीत स्पष्टीकरण (Marathi Explanation)`,
          content: `### धडा: ${currentChapter.title}\n\n**महत्त्वाचे मुद्दे (मराठीत):**\n1. **मुख्य संकल्पना**: या पाठात दिलेले नियम आणि सूत्रे बोर्ड परीक्षेसाठी अत्यंत आवश्यक आहेत.\n2. **आकृत्या व सराव**: प्रकाशाच्या किरणांचे आलेख (Ray Diagrams) आणि विद्युत परिपथ (Electric Circuits) काढण्याचा सराव करा.\n3. **परीक्षेसाठी टीप**: प्रत्येक गणितात शेवटी SI एकक (SI Unit) अचूक लिहिणे आवश्यक आहे!`
        });
      } else if (actionType === 'key_points') {
        setAiActionOutput({
          title: `High-Yield Important Points`,
          content: `⭐ **CBSE & State Board Hotspots**:\n- **Definition**: Exact NCERT verbatim definition earns full 1-mark credit.\n- **Derivation**: Be prepared for 3-mark step-by-step proofs.\n- **Sign Conventions**: $u$ is always negative for mirrors; $f$ is negative for concave, positive for convex.\n- **Exceptions**: Look out for virtual vs real image conditions.`
        });
      } else if (actionType === 'flashcards') {
        setAiActionOutput({
          title: `Interactive Flashcards (${currentChapter.title})`,
          content: `Review these high-yield conceptual flashcards before tests:`,
          flashcards: [
            {
              front: 'What is the Mirror Formula?',
              back: '1/f = 1/v + 1/u, where f is focal length, v is image distance, and u is object distance.'
            },
            {
              front: 'What is Snell’s Law of Refraction?',
              back: 'sin(i) / sin(r) = n₂₁ (Constant), representing the refractive index of medium 2 with respect to medium 1.'
            },
            {
              front: "State Ohm's Law and its condition.",
              back: 'V = IR. The electric current is directly proportional to potential difference across conductor ends, provided TEMPERATURE REMAINS CONSTANT.'
            },
            {
              front: 'What is the nature of an image when object is between P and F of a concave mirror?',
              back: 'Virtual, erect, and enlarged behind the mirror (used as shaving and dentist mirrors).'
            }
          ]
        });
      }
    }, 600);
  };

  // Filtered content for search highlight
  const highlightedContent = useMemo(() => {
    if (!searchQuery.trim()) return currentChapter.content;
    return currentChapter.content;
  }, [currentChapter.content, searchQuery]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      readingTheme === 'dark'
        ? 'bg-slate-950 text-slate-100'
        : readingTheme === 'sepia'
        ? 'bg-[#f4ecd8] text-[#3c2a1a]'
        : 'bg-white text-slate-900'
    }`}>

      {/* ── Top Reader Navigation Bar ── */}
      <header className={`sticky top-0 z-40 border-b px-4 py-2.5 flex items-center justify-between gap-3 backdrop-blur-xl ${
        readingTheme === 'dark' 
          ? 'bg-slate-950/90 border-white/[0.08]' 
          : readingTheme === 'sepia' 
          ? 'bg-[#eae0c8]/90 border-[#d3c2a3]' 
          : 'bg-white/90 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl hover:bg-white/[0.08] transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span className="hidden sm:inline">Back to Library</span>
          </button>

          <span className="text-slate-500">|</span>

          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold truncate max-w-[220px] sm:max-w-[340px]">
              {book.title}
            </h2>
            <p className="text-[10px] text-slate-400 truncate">
              Ch {currentChapter.chapterNumber}: {currentChapter.title}
            </p>
          </div>
        </div>

        {/* Reader Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Search Toggle */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Find in chapter..."
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-white/15 text-white outline-none w-32 sm:w-44"
                  autoFocus
                />
                <button 
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                title="Search in chapter"
                className="p-2 rounded-xl hover:bg-white/[0.08] transition-colors"
              >
                <Search style={{ width: '15px', height: '15px' }} />
              </button>
            )}
          </div>

          {/* Font Size Adjuster */}
          <div className="flex items-center rounded-xl bg-white/[0.05] p-0.5 border border-white/[0.06]">
            <button
              onClick={() => setFontSize(prev => prev === 'xl' ? 'lg' : prev === 'lg' ? 'base' : 'sm')}
              title="Decrease font size"
              className="p-1.5 rounded-lg hover:bg-white/[0.1] text-xs font-bold"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize(prev => prev === 'sm' ? 'base' : prev === 'base' ? 'lg' : 'xl')}
              title="Increase font size"
              className="p-1.5 rounded-lg hover:bg-white/[0.1] text-xs font-bold"
            >
              A+
            </button>
          </div>

          {/* Theme switcher */}
          <button
            onClick={() => setReadingTheme(prev => prev === 'dark' ? 'sepia' : prev === 'sepia' ? 'light' : 'dark')}
            title="Toggle theme (Dark / Sepia / Light)"
            className="p-2 rounded-xl hover:bg-white/[0.08] transition-colors"
          >
            {readingTheme === 'dark' && <Moon style={{ width: '15px', height: '15px', color: '#818cf8' }} />}
            {readingTheme === 'sepia' && <Sun style={{ width: '15px', height: '15px', color: '#d97706' }} />}
            {readingTheme === 'light' && <Sun style={{ width: '15px', height: '15px', color: '#10b981' }} />}
          </button>

          {/* Bookmark toggle */}
          <button
            onClick={() => toggleBookBookmark(book.id, currentChapter.id)}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this chapter'}
            className={`p-2 rounded-xl transition-colors ${
              isBookmarked 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'hover:bg-white/[0.08] text-slate-400'
            }`}
          >
            <Bookmark style={{ width: '15px', height: '15px', fill: isBookmarked ? '#fbbf24' : 'none' }} />
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isAiAssistantOpen
                ? 'bg-brand-500 text-slate-950 font-black shadow-lg shadow-brand-500/25'
                : 'bg-brand-500/15 text-brand-400 border border-brand-500/30 hover:bg-brand-500/25'
            }`}
          >
            <Sparkles style={{ width: '13px', height: '13px' }} />
            <span className="hidden sm:inline">AI Study Assistant</span>
          </button>

          {/* Sidebar Toggle */}
          <button
            onClick={() => setIsTocOpen(!isTocOpen)}
            title="Toggle Table of Contents"
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300"
          >
            <BookOpen style={{ width: '15px', height: '15px' }} />
          </button>
        </div>
      </header>

      {/* ── Reading Progress Bar ── */}
      <div className="w-full h-1 bg-white/[0.06]">
        <div 
          className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${Math.round(((currentChapterIndex + 1) / book.chapters.length) * 100)}%` }}
        />
      </div>

      {/* ── Main Reader Body ── */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar: TOC, Bookmarks & Notes */}
        {isTocOpen && (
          <aside className={`w-72 sm:w-80 shrink-0 border-r flex flex-col transition-all z-20 ${
            readingTheme === 'dark' 
              ? 'bg-slate-900/90 border-white/[0.06]' 
              : readingTheme === 'sepia' 
              ? 'bg-[#eae0c8] border-[#d3c2a3]' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            {/* Sidebar Tabs */}
            <div className="flex items-center border-b border-white/[0.06] p-2 gap-1 text-xs">
              <button
                onClick={() => setActiveTabDrawer('toc')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  activeTabDrawer === 'toc' ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Chapters ({book.chapters.length})
              </button>
              <button
                onClick={() => setActiveTabDrawer('notes')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  activeTabDrawer === 'notes' ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Notes ({(book.notes || []).length})
              </button>
              <button
                onClick={() => setActiveTabDrawer('highlights')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  activeTabDrawer === 'highlights' ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Highlights ({(book.highlights || []).length})
              </button>
            </div>

            {/* Tab 1: TOC */}
            {activeTabDrawer === 'toc' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {book.chapters.map((ch, idx) => {
                  const isActive = ch.id === currentChapter.id;
                  const isChBookmarked = (book.bookmarks || []).includes(ch.id);

                  return (
                    <div
                      key={ch.id}
                      onClick={() => {
                        setCurrentChapterId(ch.id);
                        contentContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`p-3 rounded-xl cursor-pointer transition-all border ${
                        isActive
                          ? 'bg-brand-500/15 border-brand-500/40 text-white shadow-sm'
                          : 'bg-slate-950/40 border-transparent hover:bg-white/[0.04] text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-brand-400 font-bold">
                          Chapter {idx + 1}
                        </span>
                        {isChBookmarked && (
                          <Bookmark style={{ width: '11px', height: '11px', color: '#fbbf24', fill: '#fbbf24' }} />
                        )}
                      </div>
                      <p className="text-xs font-semibold leading-snug mt-0.5">{ch.title}</p>
                      {ch.sections && (
                        <p className="text-[10px] text-slate-500 mt-1 truncate">
                          {ch.sections.length} topics • {ch.estimatedReadTimeMinutes || 15} min read
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Notes */}
            {activeTabDrawer === 'notes' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {(book.notes || []).length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No notes yet. Select text in the book to attach a study note!
                  </div>
                ) : (
                  (book.notes || []).map(note => (
                    <div key={note.id} className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.05] space-y-1 text-xs">
                      {note.selectedText && (
                        <p className="text-[10px] text-slate-400 italic border-l-2 border-brand-500 pl-2">
                          "{note.selectedText}"
                        </p>
                      )}
                      <p className="text-slate-200 font-medium">{note.noteText}</p>
                      <span className="text-[9px] text-slate-500 block pt-1">{note.createdAt}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Highlights */}
            {activeTabDrawer === 'highlights' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {(book.highlights || []).length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No highlights yet. Select text to highlight important exam formulas!
                  </div>
                ) : (
                  (book.highlights || []).map(hl => (
                    <div 
                      key={hl.id} 
                      className={`p-3 rounded-xl border text-xs leading-relaxed ${
                        hl.color === 'yellow' ? 'bg-amber-500/10 border-amber-500/25 text-amber-200' :
                        hl.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200' :
                        'bg-indigo-500/10 border-indigo-500/25 text-indigo-200'
                      }`}
                    >
                      <p>"{hl.text}"</p>
                      <span className="text-[9px] opacity-60 block mt-1">{hl.createdAt}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sidebar bottom info */}
            <div className="p-3 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between">
              <span>Progress: {Math.round(((currentChapterIndex + 1) / book.chapters.length) * 100)}%</span>
              <span className="badge badge-emerald" style={{ fontSize: '9px' }}>Auto-Saved</span>
            </div>
          </aside>
        )}

        {/* Center: Reading Canvas */}
        <main 
          ref={contentContainerRef}
          onMouseUp={handleMouseUp}
          className="flex-1 overflow-y-auto px-4 sm:px-12 lg:px-20 py-10 max-w-4xl mx-auto space-y-8"
        >
          {/* Chapter Title Badge */}
          <div className="space-y-2 border-b border-white/[0.08] pb-6">
            <div className="flex items-center gap-2">
              <span className="badge badge-indigo text-[10px]">
                Chapter {currentChapter.chapterNumber} of {book.chapters.length}
              </span>
              <span className="text-slate-500 text-xs font-mono">• {book.subject}</span>
              {currentChapter.estimatedReadTimeMinutes && (
                <span className="text-slate-500 text-xs font-mono">• {currentChapter.estimatedReadTimeMinutes} min read</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight">
              {currentChapter.title}
            </h1>
          </div>

          {/* Chapter Content Typography */}
          <div className={`prose prose-invert max-w-none leading-relaxed space-y-6 ${
            fontSize === 'sm' ? 'text-sm' :
            fontSize === 'base' ? 'text-base' :
            fontSize === 'lg' ? 'text-lg' : 'text-xl'
          }`}>
            {highlightedContent.split('\n\n').map((paragraph, pIdx) => {
              // Markdown header handling
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={pIdx} className="text-xl sm:text-2xl font-display font-bold text-white pt-4 border-b border-white/[0.06] pb-2">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={pIdx} className="text-base sm:text-lg font-bold text-emerald-400 pt-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('#### ')) {
                return (
                  <h4 key={pIdx} className="text-sm sm:text-base font-bold text-indigo-300">
                    {paragraph.replace('#### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('```')) {
                return (
                  <pre key={pIdx} className="p-4 rounded-2xl bg-slate-900/90 border border-white/[0.08] overflow-x-auto text-xs font-mono text-emerald-300">
                    {paragraph.replace(/```[a-z]*/g, '')}
                  </pre>
                );
              }
              if (paragraph.startsWith('$$')) {
                return (
                  <div key={pIdx} className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/25 text-center font-mono text-emerald-300 my-4 shadow-sm text-sm sm:text-base">
                    {paragraph.replace(/\$\$/g, '')}
                  </div>
                );
              }
              return (
                <p key={pIdx} className="text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Chapter Bottom Navigation & Quiz CTA */}
          <div className="pt-10 pb-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePrevChapter}
              disabled={currentChapterIndex === 0}
              className="btn-secondary py-2.5 px-4 rounded-xl disabled:opacity-30 w-full sm:w-auto justify-center"
            >
              <ChevronLeft style={{ width: '15px', height: '15px' }} />
              <span>Previous Chapter</span>
            </button>

            <button
              onClick={() => startQuizFromSyllabus(book.subject, currentChapter.title, undefined)}
              className="btn-primary py-2.5 px-5 rounded-xl w-full sm:w-auto justify-center shadow-lg"
            >
              <Sparkles style={{ width: '14px', height: '14px' }} />
              <span>Generate Quiz for this Chapter</span>
            </button>

            <button
              onClick={handleNextChapter}
              disabled={currentChapterIndex === book.chapters.length - 1}
              className="btn-secondary py-2.5 px-4 rounded-xl disabled:opacity-30 w-full sm:w-auto justify-center"
            >
              <span>Next Chapter</span>
              <ChevronRight style={{ width: '15px', height: '15px' }} />
            </button>
          </div>
        </main>

        {/* ── Selection Context Menu (Highlights & Notes) ── */}
        {showTextMenu && (
          <div
            className="fixed z-50 rounded-2xl glass p-1.5 shadow-2xl border border-white/20 flex items-center gap-1 animate-scale-in"
            style={{ left: `${menuPosition.x}px`, top: `${menuPosition.y}px`, transform: 'translateX(-50%)' }}
          >
            <button
              onClick={() => handleApplyHighlight('yellow')}
              title="Yellow highlight"
              className="w-6 h-6 rounded-full bg-amber-400 hover:scale-110 transition-transform"
            />
            <button
              onClick={() => handleApplyHighlight('emerald')}
              title="Green highlight"
              className="w-6 h-6 rounded-full bg-emerald-400 hover:scale-110 transition-transform"
            />
            <button
              onClick={() => handleApplyHighlight('indigo')}
              title="Indigo highlight"
              className="w-6 h-6 rounded-full bg-indigo-400 hover:scale-110 transition-transform"
            />
            <span className="w-px h-4 bg-white/20 mx-0.5" />
            <button
              onClick={() => setIsNoteModalOpen(true)}
              className="px-2 py-1 rounded-lg hover:bg-white/[0.1] text-[11px] font-bold text-white flex items-center gap-1"
            >
              <StickyNote style={{ width: '12px', height: '12px' }} />
              <span>Note</span>
            </button>
            <button
              onClick={() => triggerAiAction('summarize')}
              className="px-2 py-1 rounded-lg bg-brand-500/20 text-brand-400 hover:bg-brand-500/30 text-[11px] font-bold flex items-center gap-1"
            >
              <Sparkles style={{ width: '12px', height: '12px' }} />
              <span>AI</span>
            </button>
          </div>
        )}

        {/* ── Right Panel: AI Reading Assistant ── */}
        {isAiAssistantOpen && (
          <aside className="w-80 sm:w-96 shrink-0 border-l border-white/[0.08] bg-slate-900/95 backdrop-blur-2xl flex flex-col z-20 shadow-2xl animate-fade-in-left">
            <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400">
                  <Sparkles style={{ width: '16px', height: '16px' }} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">AI Reading Assistant</h3>
                  <p className="text-[10px] text-slate-400">Contextual Tutor for Ch {currentChapter.chapterNumber}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAiAssistantOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X style={{ width: '15px', height: '15px' }} />
              </button>
            </div>

            {/* AI Action Buttons Grid */}
            <div className="p-3 border-b border-white/[0.05] grid grid-cols-2 gap-1.5">
              <button
                onClick={() => triggerAiAction('summarize')}
                className="btn-secondary py-1.5 px-2 text-[10px] rounded-lg justify-start"
              >
                <span>📝 Summarize</span>
              </button>
              <button
                onClick={() => triggerAiAction('key_points')}
                className="btn-secondary py-1.5 px-2 text-[10px] rounded-lg justify-start"
              >
                <span>⭐ Key Points</span>
              </button>
              <button
                onClick={() => triggerAiAction('explain_simple')}
                className="btn-secondary py-1.5 px-2 text-[10px] rounded-lg justify-start"
              >
                <span>🐣 Simple Lang</span>
              </button>
              <button
                onClick={() => triggerAiAction('flashcards')}
                className="btn-secondary py-1.5 px-2 text-[10px] rounded-lg justify-start"
              >
                <span>🗂️ Flashcards</span>
              </button>
              <button
                onClick={() => triggerAiAction('explain_hindi')}
                className="btn-secondary py-1.5 px-2 text-[10px] rounded-lg justify-start"
              >
                <span>🇮🇳 Hindi Expl.</span>
              </button>
              <button
                onClick={() => triggerAiAction('explain_marathi')}
                className="btn-secondary py-1.5 px-2 text-[10px] rounded-lg justify-start"
              >
                <span>🚩 Marathi Expl.</span>
              </button>
            </div>

            {/* AI Output Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isAiThinking ? (
                <div className="py-16 flex flex-col items-center gap-3 text-center">
                  <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-mono text-brand-400 animate-pulse">
                    Claude 3.5 analyzing chapter context...
                  </p>
                </div>
              ) : aiActionOutput ? (
                <div className="space-y-4 animate-fade-in-up">
                  <div className="border-b border-white/[0.06] pb-2">
                    <span className="badge badge-emerald text-[9px]">AI Analysis</span>
                    <h4 className="text-sm font-bold text-white mt-1">{aiActionOutput.title}</h4>
                  </div>

                  {/* Standard Text Content */}
                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
                    {aiActionOutput.content}
                  </div>

                  {/* Flashcard Component */}
                  {aiActionOutput.flashcards && aiActionOutput.flashcards.length > 0 && (
                    <div className="pt-2 space-y-3">
                      <div 
                        onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                        className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-brand-500/30 cursor-pointer shadow-lg min-h-[140px] flex flex-col justify-between text-center transition-all hover:scale-[1.02]"
                      >
                        <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">
                          Card {activeFlashcardIndex + 1} of {aiActionOutput.flashcards.length} • {isFlashcardFlipped ? 'Answer' : 'Question (Tap to flip)'}
                        </span>
                        <p className="text-sm font-medium text-white my-3">
                          {isFlashcardFlipped 
                            ? aiActionOutput.flashcards[activeFlashcardIndex].back 
                            : aiActionOutput.flashcards[activeFlashcardIndex].front
                          }
                        </p>
                        <span className="text-[10px] text-slate-500">Tap anywhere to flip card</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {
                            setActiveFlashcardIndex(prev => Math.max(0, prev - 1));
                            setIsFlashcardFlipped(false);
                          }}
                          disabled={activeFlashcardIndex === 0}
                          className="btn-secondary py-1 px-3 text-xs disabled:opacity-30"
                        >
                          Prev
                        </button>
                        <button
                          onClick={() => {
                            setActiveFlashcardIndex(prev => Math.min((aiActionOutput.flashcards?.length || 1) - 1, prev + 1));
                            setIsFlashcardFlipped(false);
                          }}
                          disabled={activeFlashcardIndex === (aiActionOutput.flashcards.length - 1)}
                          className="btn-secondary py-1 px-3 text-xs disabled:opacity-30"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quiz CTA from Assistant */}
                  <div className="pt-4 border-t border-white/[0.05]">
                    <button
                      onClick={() => startQuizFromSyllabus(book.subject, currentChapter.title, undefined)}
                      className="btn-primary w-full justify-center text-xs py-2.5"
                    >
                      <Sparkles style={{ width: '13px', height: '13px' }} />
                      <span>Practice {currentChapter.title} Questions</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                  <Lightbulb style={{ width: '28px', height: '28px', color: '#64748b', margin: '0 auto' }} />
                  <p>Choose an action above to summarize, translate, or generate flashcards for this chapter.</p>
                </div>
              )}
            </div>
          </aside>
        )}

      </div>

      {/* ── Add Note Modal ── */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="glass rounded-3xl p-6 max-w-md w-full border border-white/[0.1] shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <StickyNote style={{ width: '14px', height: '14px', color: '#10b981' }} />
                Add Study Note
              </h4>
              <button 
                onClick={() => setIsNoteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X style={{ width: '14px', height: '14px' }} />
              </button>
            </div>

            {selectedText && (
              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/[0.06] text-xs text-slate-400 italic">
                "{selectedText}"
              </div>
            )}

            <textarea
              rows={4}
              value={newNoteContent}
              onChange={e => setNewNoteContent(e.target.value)}
              placeholder="Write key memory hooks, formula derivations, or teacher exam tips..."
              className="input-field text-xs resize-none"
              autoFocus
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={!newNoteContent.trim()}
                className="btn-primary text-xs py-1.5 px-4"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
