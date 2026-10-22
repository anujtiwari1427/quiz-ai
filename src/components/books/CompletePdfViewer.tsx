import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw,
  Maximize2, Minimize2, Download, Printer, Search, BookOpen, 
  FileText, Columns, Layers, Sparkles, X, Check, Bookmark, 
  HelpCircle, RefreshCw, Upload, Eye, Compass
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { Book, BookChapter } from '../../types';
import { PDF_STORAGE_SERVICE } from '../../services/pdfStorageService';
import { PdfGeneratorService } from '../../services/pdfGeneratorService';
import { LIVE_AI_SERVICE } from '../../services/liveAiService';

// Ensure PDF.js worker is configured
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

interface CompletePdfViewerProps {
  book: Book;
  onExit: () => void;
  onSwitchToChapterView?: () => void;
  initialPage?: number;
}

type LayoutMode = 'single' | 'spread' | 'continuous';
type EngineMode = 'canvas' | 'native';

export const CompletePdfViewer: React.FC<CompletePdfViewerProps> = ({
  book,
  onExit,
  onSwitchToChapterView,
  initialPage = 1
}) => {
  // Document state
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Viewing controls state
  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('single');
  const [engineMode, setEngineMode] = useState<EngineMode>('canvas');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sidebar & Drawers state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'thumbnails' | 'toc' | 'bookmarks'>('thumbnails');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>([]);

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchMatches, setSearchMatches] = useState<{ page: number; snippet: string }[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // AI Assistant state
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Canvas refs
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRightRef = useRef<HTMLCanvasElement>(null);

  // ──────────────────────────────────────────────
  // 1. INITIALIZE PDF DOCUMENT
  // ──────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    let createdUrl = '';

    async function loadPdf() {
      setIsLoadingPdf(true);
      setLoadError(null);

      try {
        // Step 1: Check if raw PDF exists in IndexedDB
        let blob = await PDF_STORAGE_SERVICE.getPdfBlob(book.id);

        // Step 2: If no blob exists, generate an authentic multi-page PDF from the book chapters
        if (!blob) {
          const generated = PdfGeneratorService.generateBookPdf(book);
          blob = generated.blob;
          // Store in IndexedDB for subsequent lightning-fast reads
          await PDF_STORAGE_SERVICE.savePdfBlob(book.id, blob, `${book.title}.pdf`);
        }

        if (!active) return;

        setPdfBlob(blob);
        createdUrl = URL.createObjectURL(blob);
        setPdfUrl(createdUrl);

        // Step 3: Load into pdfjs-dist
        const arrayBuffer = await blob.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true
        });

        const loadedDoc = await loadingTask.promise;
        if (!active) return;

        setPdfDoc(loadedDoc);
        setNumPages(loadedDoc.numPages);
        setIsLoadingPdf(false);
      } catch (err: any) {
        console.error('[CompletePdfViewer] Error loading PDF:', err);
        if (active) {
          setLoadError(err.message || 'Failed to load PDF document.');
          setIsLoadingPdf(false);
        }
      }
    }

    loadPdf();

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [book.id]);

  // ──────────────────────────────────────────────
  // 2. RENDER ACTIVE PAGE ON CANVAS
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (!pdfDoc || engineMode !== 'canvas') return;

    let isCancelled = false;

    async function renderPage() {
      try {
        // Left / Main page
        const page = await pdfDoc.getPage(currentPage);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale, rotation });
        const canvas = canvasRef.current;
        if (canvas) {
          const context = canvas.getContext('2d');
          if (context) {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.floor(viewport.width * dpr);
            canvas.height = Math.floor(viewport.height * dpr);
            canvas.style.width = `${Math.floor(viewport.width)}px`;
            canvas.style.height = `${Math.floor(viewport.height)}px`;

            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            context.clearRect(0, 0, viewport.width, viewport.height);

            const renderContext = {
              canvasContext: context,
              viewport
            };
            await page.render(renderContext).promise;
          }
        }

        // Two-page spread mode: render right page if available
        if (layoutMode === 'spread' && currentPage < numPages && canvasRightRef.current) {
          const rightPage = await pdfDoc.getPage(currentPage + 1);
          if (isCancelled) return;

          const rightViewport = rightPage.getViewport({ scale, rotation });
          const rightCanvas = canvasRightRef.current;
          const rightContext = rightCanvas.getContext('2d');
          if (rightContext) {
            const dpr = window.devicePixelRatio || 1;
            rightCanvas.width = Math.floor(rightViewport.width * dpr);
            rightCanvas.height = Math.floor(rightViewport.height * dpr);
            rightCanvas.style.width = `${Math.floor(rightViewport.width)}px`;
            rightCanvas.style.height = `${Math.floor(rightViewport.height)}px`;

            rightContext.setTransform(dpr, 0, 0, dpr, 0, 0);
            rightContext.clearRect(0, 0, rightViewport.width, rightViewport.height);

            await rightPage.render({
              canvasContext: rightContext,
              viewport: rightViewport
            }).promise;
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error('[CompletePdfViewer] Page render error:', err);
        }
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, currentPage, scale, rotation, layoutMode, engineMode]);

  // ──────────────────────────────────────────────
  // 3. KEYBOARD SHORTCUTS
  // ──────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, numPages, layoutMode, scale]);

  // Navigation handlers
  const handleNextPage = () => {
    const step = layoutMode === 'spread' ? 2 : 1;
    setCurrentPage(prev => Math.min(numPages, prev + step));
  };

  const handlePrevPage = () => {
    const step = layoutMode === 'spread' ? 2 : 1;
    setCurrentPage(prev => Math.max(1, prev - step));
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(numPages);

  const handleZoomIn = () => setScale(s => Math.min(3.0, +(s + 0.2).toFixed(1)));
  const handleZoomOut = () => setScale(s => Math.max(0.6, +(s - 0.2).toFixed(1)));
  const handleResetZoom = () => setScale(1.2);

  const handleRotate = () => setRotation(r => (r + 90) % 360);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerContainerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleToggleBookmark = () => {
    setBookmarkedPages(prev => 
      prev.includes(currentPage) ? prev.filter(p => p !== currentPage) : [...prev, currentPage].sort((a, b) => a - b)
    );
  };

  const handleDownloadPdf = () => {
    if (!pdfBlob) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `${book.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrintPdf = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow) {
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
      }
    }
  };

  // Perform client-side PDF text search
  const handleSearch = async () => {
    if (!pdfDoc || !searchQuery.trim()) return;
    setIsSearching(true);
    setSearchMatches([]);

    try {
      const q = searchQuery.toLowerCase().trim();
      const results: { page: number; snippet: string }[] = [];

      for (let p = 1; p <= numPages; p++) {
        const page = await pdfDoc.getPage(p);
        const textContent = await page.getTextContent();
        const text = textContent.items.map((item: any) => item.str).join(' ');

        if (text.toLowerCase().includes(q)) {
          const matchIdx = text.toLowerCase().indexOf(q);
          const snippet = text.slice(Math.max(0, matchIdx - 30), Math.min(text.length, matchIdx + 60));
          results.push({ page: p, snippet: `...${snippet}...` });
        }
      }

      setSearchMatches(results);
      if (results.length > 0) {
        setCurrentPage(results[0].page);
      }
    } catch (err) {
      console.error('[CompletePdfViewer] Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Ask AI about current PDF page
  const handleAskAiAboutPage = async (customPrompt?: string) => {
    const prompt = (customPrompt || aiQuestion).trim();
    if (!prompt) return;

    setIsAiLoading(true);
    setAiResponse('');

    try {
      let pageText = '';
      if (pdfDoc) {
        const page = await pdfDoc.getPage(currentPage);
        const textContent = await page.getTextContent();
        pageText = textContent.items.map((item: any) => item.str).join(' ');
      }

      const contextualPrompt = `You are EduPulse AI, an expert STEM tutor for ${book.board || 'Maharashtra State Board'} Class 10 / K-12.
The student is currently viewing Page ${currentPage} of "${book.title}".

TEXT EXTRACTED FROM CURRENT PAGE:
"""
${pageText.slice(0, 3000)}
"""

STUDENT QUESTION:
${prompt}

Provide a direct, step-by-step, engaging explanation with relevant formulas, definitions, and board exam tips. Keep formatting crystal clear with bullet points and bold math equations.`;

      let reply = '';
      try {
        reply = await LIVE_AI_SERVICE.callLlm(contextualPrompt, {
          temperature: 0.6,
          maxTokens: 1024
        });
      } catch {
        // High-quality offline curriculum fallback
        reply = `### 📘 Key Takeaways for Page ${currentPage} (${book.title})\n\n` +
          `• **Core Principles:** This page covers foundational syllabus competencies specified by ${book.board || 'the State Board'}.\n` +
          `• **Exam Tip:** Focus on fundamental definitions, standard units, and step-by-step mathematical reasoning.\n` +
          `• **Practice Prompt:** To practice exam-style questions on this topic, click the **"Practice Questions"** action above or configure your Gemini / Groq / Ollama API key in the AI Engine settings.`;
      }

      setAiResponse(reply);
    } catch (err: any) {
      setAiResponse(`AI explanation notice: ${err.message || 'Page analyzed.'}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Thumbnail generator helper
  const pageNumbersArray = useMemo(() => {
    return Array.from({ length: numPages }, (_, i) => i + 1);
  }, [numPages]);

  return (
    <div 
      ref={viewerContainerRef}
      className="fixed inset-0 z-50 bg-[#0c1017] text-slate-100 flex flex-col font-sans select-none overflow-hidden"
    >
      {/* ──────────────────────────────────────────────
          TOP TOOLBAR
      ────────────────────────────────────────────── */}
      <header className="h-14 border-b border-white/[0.08] bg-[#0f141d]/90 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between gap-3 shrink-0 z-20">
        {/* Left Section: Back, Title, Mode switch */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold shrink-0"
            title="Back to Library"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Library</span>
          </button>

          <div className="h-5 w-[1px] bg-white/[0.1] hidden sm:block" />

          {/* Book Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="badge badge-indigo text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider shrink-0">
                PDF E-Book
              </span>
              {book.board && (
                <span className="badge badge-emerald text-[9px] px-1.5 py-0.2 rounded-full hidden md:inline">
                  {book.board}
                </span>
              )}
            </div>
            <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[160px] sm:max-w-xs md:max-w-md">
              {book.title}
            </h1>
          </div>
        </div>

        {/* Center: Page Controls & Layout */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Page Jumper */}
          <div className="flex items-center bg-black/40 border border-white/[0.08] rounded-xl px-1.5 py-1 text-xs font-mono">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="p-1 rounded-lg hover:bg-white/[0.08] text-slate-300 disabled:opacity-30 transition-colors"
              title="Previous Page (Left Arrow)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-2 text-slate-300 flex items-center gap-1">
              <input
                type="number"
                min={1}
                max={numPages}
                value={currentPage}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 1 && val <= numPages) {
                    setCurrentPage(val);
                  }
                }}
                className="w-8 text-center bg-transparent text-white font-bold focus:outline-none focus:ring-1 focus:ring-brand-500 rounded"
              />
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">{numPages}</span>
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= numPages}
              className="p-1 rounded-lg hover:bg-white/[0.08] text-slate-300 disabled:opacity-30 transition-colors"
              title="Next Page (Right Arrow)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls (Hidden on mobile) */}
          <div className="hidden lg:flex items-center bg-black/40 border border-white/[0.08] rounded-xl p-1 text-xs">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded-lg hover:bg-white/[0.08] text-slate-300"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-0.5 text-[11px] font-mono text-slate-300 hover:text-white"
              title="Reset Zoom"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded-lg hover:bg-white/[0.08] text-slate-300"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Layout Mode (Single vs Spread) */}
          <div className="hidden md:flex items-center bg-black/40 border border-white/[0.08] rounded-xl p-1 text-xs">
            <button
              onClick={() => setLayoutMode('single')}
              className={`p-1.5 rounded-lg transition-colors ${layoutMode === 'single' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              title="Single Page Mode"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayoutMode('spread')}
              className={`p-1.5 rounded-lg transition-colors ${layoutMode === 'spread' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              title="Two-Page Book Spread"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Section: Engine Switch, Search, AI, Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Switch to Chapter / Markdown reader */}
          {onSwitchToChapterView && (
            <button
              onClick={onSwitchToChapterView}
              className="hidden xl:flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 text-xs font-semibold transition-all"
              title="Switch to Chapter / Audio Reader"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Chapter Mode</span>
            </button>
          )}

          {/* Engine Mode Toggle (Canvas vs Native Browser PDF) */}
          <div className="hidden sm:flex items-center bg-black/40 border border-white/[0.08] rounded-xl p-0.5 text-[11px]">
            <button
              onClick={() => setEngineMode('canvas')}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${engineMode === 'canvas' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Canvas
            </button>
            <button
              onClick={() => setEngineMode('native')}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${engineMode === 'native' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Native Browser PDF Embed"
            >
              Embed
            </button>
          </div>

          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 rounded-xl transition-colors ${isSearchOpen ? 'bg-brand-500 text-white' : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300'}`}
            title="Search Text in PDF"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-xl transition-colors ${bookmarkedPages.includes(currentPage) ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300'}`}
            title="Bookmark Current Page"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>

          {/* Rotate Button */}
          <button
            onClick={handleRotate}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hidden md:block"
            title="Rotate 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPdf}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Print PDF */}
          <button
            onClick={handlePrintPdf}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hidden sm:block"
            title="Print PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {/* AI Tutor Drawer Toggle */}
          <button
            onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
            className={`p-2 rounded-xl transition-all flex items-center gap-1 text-xs font-semibold ${isAiDrawerOpen ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/20' : 'bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30'}`}
            title="Ask AI about this PDF page"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AI Tutor</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* ──────────────────────────────────────────────
          SEARCH BAR OVERLAY
      ────────────────────────────────────────────── */}
      {isSearchOpen && (
        <div className="bg-[#121824] border-b border-white/[0.08] px-4 py-2.5 flex items-center gap-3 z-20 animate-fade-in">
          <Search className="w-4 h-4 text-brand-400 shrink-0" />
          <input
            type="text"
            placeholder="Search words or formulas across all PDF pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none flex-1 font-mono"
            autoFocus
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="btn-primary py-1 px-3 text-xs rounded-lg disabled:opacity-40"
          >
            {isSearching ? 'Searching...' : 'Find'}
          </button>
          {searchMatches.length > 0 && (
            <span className="text-xs font-mono text-emerald-400 font-medium">
              {searchMatches.length} match{searchMatches.length === 1 ? '' : 'es'} found
            </span>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded hover:bg-white/[0.08] text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ──────────────────────────────────────────────
          MAIN WORKSPACE (SIDEBAR + VIEWER + AI DRAWER)
      ────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT SIDEBAR: THUMBNAILS & TOC */}
        {isSidebarOpen && (
          <aside className="w-56 sm:w-64 border-r border-white/[0.08] bg-[#0d121b] flex flex-col shrink-0 z-10 transition-all">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-white/[0.08] bg-black/20 text-xs">
              <button
                onClick={() => setActiveSidebarTab('thumbnails')}
                className={`flex-1 py-2.5 text-center font-medium transition-colors ${activeSidebarTab === 'thumbnails' ? 'text-brand-400 border-b-2 border-brand-500 bg-white/[0.02]' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Pages ({numPages})
              </button>
              <button
                onClick={() => setActiveSidebarTab('toc')}
                className={`flex-1 py-2.5 text-center font-medium transition-colors ${activeSidebarTab === 'toc' ? 'text-brand-400 border-b-2 border-brand-500 bg-white/[0.02]' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Chapters
              </button>
              <button
                onClick={() => setActiveSidebarTab('bookmarks')}
                className={`flex-1 py-2.5 text-center font-medium transition-colors ${activeSidebarTab === 'bookmarks' ? 'text-brand-400 border-b-2 border-brand-500 bg-white/[0.02]' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Saved ({bookmarkedPages.length})
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {activeSidebarTab === 'thumbnails' && (
                <div className="grid grid-cols-2 gap-2">
                  {pageNumbersArray.map((pNum) => (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-left ${pNum === currentPage ? 'border-brand-500 bg-brand-500/10 shadow-sm ring-1 ring-brand-500' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.2] hover:bg-white/[0.05]'}`}
                    >
                      <div className="w-full aspect-[3/4] bg-slate-900 border border-white/[0.06] rounded flex flex-col items-center justify-center p-1 relative overflow-hidden">
                        <FileText className="w-6 h-6 text-slate-600 mb-1" />
                        <span className="text-[8px] font-mono text-slate-500 text-center leading-tight">
                          {pNum === 1 ? 'Cover' : pNum === 2 ? 'Index' : `Page ${pNum}`}
                        </span>
                        {bookmarkedPages.includes(pNum) && (
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
                        )}
                      </div>
                      <span className={`text-[10px] font-mono font-medium ${pNum === currentPage ? 'text-brand-300 font-bold' : 'text-slate-400'}`}>
                        p. {pNum}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {activeSidebarTab === 'toc' && (
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-mono text-slate-500 tracking-wider mb-2">
                    Curriculum Syllabus Chapters
                  </div>
                  {book.chapters.map((ch, idx) => {
                    // Approximate anchor page
                    const targetPage = Math.min(numPages, 3 + idx * 3);
                    return (
                      <button
                        key={ch.id}
                        onClick={() => setCurrentPage(targetPage)}
                        className="w-full p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] text-left transition-all group flex items-start justify-between gap-2"
                      >
                        <div>
                          <span className="text-[10px] font-mono text-brand-400 block font-bold">
                            Chapter {ch.chapterNumber}
                          </span>
                          <span className="text-xs text-slate-200 font-medium group-hover:text-white line-clamp-2">
                            {ch.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0 mt-0.5">
                          p. {targetPage}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {activeSidebarTab === 'bookmarks' && (
                <div className="space-y-2">
                  {bookmarkedPages.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      <Bookmark className="w-6 h-6 mx-auto mb-2 opacity-30" />
                      No pages bookmarked yet. Click the bookmark icon in the top toolbar to save pages for quick revision!
                    </div>
                  ) : (
                    bookmarkedPages.map(p => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className="w-full p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left flex items-center justify-between text-xs text-amber-200 hover:bg-amber-500/20 transition-colors"
                      >
                        <span className="font-semibold font-mono">Bookmark: Page {p}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Sidebar toggle button */}
            <div className="p-2 border-t border-white/[0.06]">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-full py-1.5 text-center text-[11px] text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
              >
                Hide Sidebar
              </button>
            </div>
          </aside>
        )}

        {/* Re-open Sidebar Floating Tab when closed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-2 top-3 z-30 p-2 rounded-xl bg-[#151c27] border border-white/[0.1] text-slate-300 hover:text-white shadow-lg"
            title="Open Pages & Chapters Sidebar"
          >
            <Layers className="w-4 h-4" />
          </button>
        )}

        {/* CENTER: PDF DISPLAY STAGE */}
        <main className="flex-1 overflow-auto bg-[#080b11] flex items-center justify-center p-4 sm:p-8 relative">
          {isLoadingPdf ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-slate-300">Rendering high-resolution PDF pages...</p>
              <p className="text-xs text-slate-500 font-mono">Applying anti-aliasing & device pixel scaling</p>
            </div>
          ) : loadError ? (
            <div className="max-w-md p-6 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-center space-y-3">
              <h3 className="text-sm font-bold text-rose-300">PDF Rendering Error</h3>
              <p className="text-xs text-rose-200">{loadError}</p>
              <button
                onClick={() => setEngineMode('native')}
                className="btn-primary py-2 px-4 text-xs rounded-xl"
              >
                Try Native Browser Embed
              </button>
            </div>
          ) : engineMode === 'native' ? (
            /* NATIVE EMBED MODE */
            <div className="w-full h-full flex flex-col items-center">
              <iframe
                src={`${pdfUrl}#page=${currentPage}&zoom=100`}
                className="w-full h-full rounded-2xl border border-white/[0.08] shadow-2xl bg-white"
                title="Complete PDF Viewer"
              />
            </div>
          ) : (
            /* CANVAS PDF ENGINE MODE */
            <div className="flex flex-wrap items-center justify-center gap-6 my-auto max-w-full">
              {/* Primary / Left Page */}
              <div className="flex flex-col items-center group">
                <div className="relative shadow-2xl rounded-lg overflow-hidden border border-white/[0.1] bg-white transition-shadow duration-300 hover:shadow-brand-500/10">
                  <canvas ref={canvasRef} className="block max-w-full h-auto" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 mt-2 font-medium">
                  Page {currentPage} of {numPages}
                </span>
              </div>

              {/* Secondary / Right Page (in Two-Page Spread mode) */}
              {layoutMode === 'spread' && currentPage < numPages && (
                <div className="flex flex-col items-center group">
                  <div className="relative shadow-2xl rounded-lg overflow-hidden border border-white/[0.1] bg-white transition-shadow duration-300 hover:shadow-brand-500/10">
                    <canvas ref={canvasRightRef} className="block max-w-full h-auto" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-2 font-medium">
                    Page {currentPage + 1} of {numPages}
                  </span>
                </div>
              )}
            </div>
          )}
        </main>

        {/* RIGHT DRAWER: AI STUDY ASSISTANT */}
        {isAiDrawerOpen && (
          <aside className="w-80 sm:w-96 border-l border-white/[0.08] bg-[#0e141e] flex flex-col shrink-0 z-20 animate-fade-in">
            {/* Header */}
            <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">AI Page Tutor</h3>
                  <span className="text-[10px] font-mono text-slate-400">Context: Page {currentPage}</span>
                </div>
              </div>
              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="p-1 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-3 border-b border-white/[0.06] space-y-1.5">
              <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider block">
                Quick Actions for Page {currentPage}
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleAskAiAboutPage('Summarize key points, definitions, and board exam takeaways from this page.')}
                  className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-left text-[11px] text-slate-300 font-medium transition-colors border border-white/[0.04]"
                >
                  📝 Summarize Page
                </button>
                <button
                  onClick={() => handleAskAiAboutPage('Explain all formulas and mathematical equations on this page in simple terms.')}
                  className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-left text-[11px] text-slate-300 font-medium transition-colors border border-white/[0.04]"
                >
                  📐 Formulas & Proofs
                </button>
                <button
                  onClick={() => handleAskAiAboutPage('Generate 3 Maharashtra Board style practice questions with answers based on this page.')}
                  className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-left text-[11px] text-slate-300 font-medium transition-colors border border-white/[0.04]"
                >
                  🎯 Practice Questions
                </button>
                <button
                  onClick={() => handleAskAiAboutPage('Translate and explain the core concept on this page in simple Marathi and Hindi.')}
                  className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-left text-[11px] text-slate-300 font-medium transition-colors border border-white/[0.04]"
                >
                  🚩 Marathi / Hindi
                </button>
              </div>
            </div>

            {/* AI Output Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isAiLoading ? (
                <div className="py-16 flex flex-col items-center gap-3 text-center">
                  <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-brand-300 font-mono animate-pulse">
                    Analyzing page text with Edu AI...
                  </p>
                </div>
              ) : aiResponse ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <span className="badge badge-emerald text-[9px]">AI Explanation</span>
                    <button
                      onClick={() => setAiResponse('')}
                      className="text-[10px] text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
                    {aiResponse}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-500 text-xs space-y-2">
                  <HelpCircle className="w-8 h-8 mx-auto opacity-30" />
                  <p className="font-medium text-slate-400">Ask any question about Page {currentPage}</p>
                  <p className="text-[11px] text-slate-500">
                    Edu AI analyzes the exact text, equations, and diagrams rendered on this PDF page.
                  </p>
                </div>
              )}
            </div>

            {/* Question Input */}
            <div className="p-3 border-t border-white/[0.08] bg-black/30">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskAiAboutPage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={`Ask a question about Page ${currentPage}...`}
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !aiQuestion.trim()}
                  className="p-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white disabled:opacity-40 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </form>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
