import * as pdfjsLib from 'pdfjs-dist';
import MiniSearch from 'minisearch';
import { db } from '../db';
import { 
  TextbookRecord, 
  ChapterRecord, 
  TextbookChunk, 
  QuestionItem, 
  QuestionOption,
  QuestionType,
  DifficultyLevel,
  BloomsLevel,
  SupportedLanguage
} from '../types';

if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

// Regex to capture exercise headings inside textbooks
export const EXERCISE_HEADER_REGEX = /(?:(?:practice\s+set|exercises?|practice\s+problems?|review\s+questions?|problems?|questions\s+and\s+answers?|test\s+your\s+knowledge)\s*(?:[\d\.]+|[ivxlcdm]+)?)/i;

// Regex to detect chapter / unit headers
export const CHAPTER_HEADER_REGEX = /(?:(?:chapter|unit|lesson|adhyāy|paath)\s*(\d+|[ivxlcdm]+)[\s:\-\.]*([^\n\r]+))/i;

export interface IngestionProgress {
  stage: 'reading' | 'extracting' | 'ocr' | 'chunking' | 'saving' | 'complete' | 'cancelled' | 'error';
  currentPage: number;
  totalPages: number;
  percent: number;
  message: string;
}

export class IngestionService {
  private cancelRequested = false;
  private miniSearchInstances: Map<string, MiniSearch<TextbookChunk>> = new Map();

  cancel() {
    this.cancelRequested = true;
  }

  /**
   * Extract and ingest textbook from a File (PDF, DOCX, TXT)
   */
  async ingestTextbook(
    file: File,
    meta: {
      title: string;
      grade: number;
      subject: string;
      board: any;
      language?: SupportedLanguage;
    },
    onProgress?: (progress: IngestionProgress) => void
  ): Promise<{ textbookId: string; totalPages: number; chaptersCount: number; chunksCount: number }> {
    this.cancelRequested = false;

    // Sanitize filename & validate size (50MB limit)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 50MB limit.`);
    }

    const textbookId = `tb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const sanitizedName = sanitizeFilename(file.name);

    onProgress?.({
      stage: 'reading',
      currentPage: 0,
      totalPages: 0,
      percent: 5,
      message: 'Reading file buffer...'
    });

    const arrayBuffer = await file.arrayBuffer();
    if (this.cancelRequested) throw new Error('Ingestion cancelled by user.');

    // Extract pages
    let pagesText: { pageNumber: number; text: string; isScanned: boolean }[] = [];

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      pagesText = await this.extractPdfPages(arrayBuffer, onProgress);
    } else {
      // Plain text or text fallback
      const text = new TextDecoder('utf-8').decode(arrayBuffer);
      pagesText = [{ pageNumber: 1, text, isScanned: false }];
    }

    if (this.cancelRequested) throw new Error('Ingestion cancelled by user.');

    const totalPages = pagesText.length;

    // Detect chapters
    onProgress?.({
      stage: 'chunking',
      currentPage: totalPages,
      totalPages,
      percent: 85,
      message: 'Structuring chapters and semantic chunks...'
    });

    const detectedChapters = this.detectChapters(pagesText, textbookId);
    const chunks = this.createChunks(pagesText, textbookId, detectedChapters);

    // Save textbook record to IndexedDB
    onProgress?.({
      stage: 'saving',
      currentPage: totalPages,
      totalPages,
      percent: 95,
      message: 'Saving textbook into local IndexedDB...'
    });

    const textbookRecord: TextbookRecord = {
      id: textbookId,
      title: meta.title || file.name.replace(/\.[^/.]+$/, ''),
      grade: meta.grade,
      subject: meta.subject,
      board: meta.board,
      totalPages,
      originalFileName: sanitizedName,
      fileBlob: new Blob([arrayBuffer], { type: file.type || 'application/pdf' }),
      language: meta.language || 'English',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await db.textbooks.put(textbookRecord);
    if (detectedChapters.length > 0) {
      await db.chapters.bulkPut(detectedChapters);
    }
    if (chunks.length > 0) {
      await db.textbookChunks.bulkPut(chunks);
    }

    // Index chunks into in-memory MiniSearch
    this.indexChunks(textbookId, chunks);

    onProgress?.({
      stage: 'complete',
      currentPage: totalPages,
      totalPages,
      percent: 100,
      message: 'Textbook successfully indexed on your device.'
    });

    return {
      textbookId,
      totalPages,
      chaptersCount: detectedChapters.length,
      chunksCount: chunks.length
    };
  }

  /**
   * Extract text page by page from PDF using pdfjs-dist with OCR fallback
   */
  private async extractPdfPages(
    buffer: ArrayBuffer,
    onProgress?: (progress: IngestionProgress) => void
  ): Promise<{ pageNumber: number; text: string; isScanned: boolean }[]> {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: true,
      isEvalSupported: false
    });

    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;
    const pages: { pageNumber: number; text: string; isScanned: boolean }[] = [];

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      if (this.cancelRequested) {
        throw new Error('Extraction cancelled.');
      }

      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      let pageText = content.items
        .map((item: any) => item.str || '')
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      let isScanned = false;

      // Scanned PDF detection: if page has fewer than 25 characters, fall back to Tesseract OCR
      if (pageText.length < 25) {
        isScanned = true;
        onProgress?.({
          stage: 'ocr',
          currentPage: pageNum,
          totalPages,
          percent: Math.round((pageNum / totalPages) * 75),
          message: `Running client-side OCR on scanned page ${pageNum} of ${totalPages}...`
        });

        try {
          const ocrText = await this.ocrPage(page);
          if (ocrText && ocrText.length > 10) {
            pageText = ocrText;
          }
        } catch (ocrErr) {
          console.warn(`OCR fallback on page ${pageNum} skipped:`, ocrErr);
        }
      }

      pages.push({
        pageNumber: pageNum,
        text: pageText,
        isScanned
      });

      onProgress?.({
        stage: 'extracting',
        currentPage: pageNum,
        totalPages,
        percent: Math.round((pageNum / totalPages) * 80),
        message: `Extracted page ${pageNum} of ${totalPages}`
      });
    }

    return pages;
  }

  /**
   * Run Tesseract.js OCR on an individual PDF page canvas
   */
  private async ocrPage(pdfPage: any): Promise<string> {
    if (typeof window === 'undefined') return '';
    try {
      const { createWorker } = await import('tesseract.js');
      const viewport = pdfPage.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      await pdfPage.render({ canvasContext: ctx, viewport }).promise;

      const worker = await createWorker(['eng', 'hin', 'mar']);
      const res = await worker.recognize(canvas);
      await worker.terminate();

      return res.data.text.trim();
    } catch (e) {
      console.warn('OCR error:', e);
      return '';
    }
  }

  /**
   * Detect chapters and exercise sections from page text
   */
  private detectChapters(
    pages: { pageNumber: number; text: string }[],
    textbookId: string
  ): ChapterRecord[] {
    const chapters: ChapterRecord[] = [];
    let currentChapter: Partial<ChapterRecord> | null = null;
    let chapterNumCounter = 1;

    for (const page of pages) {
      const match = page.text.match(CHAPTER_HEADER_REGEX);
      const exerciseMatch = page.text.match(EXERCISE_HEADER_REGEX);

      if (match) {
        if (currentChapter && currentChapter.title) {
          currentChapter.endPage = page.pageNumber - 1;
          chapters.push(currentChapter as ChapterRecord);
        }

        const rawTitle = match[2] ? match[2].trim() : `Chapter ${chapterNumCounter}`;
        const cleanTitle = rawTitle.slice(0, 80).replace(/[^\w\s\-,]/g, '');

        currentChapter = {
          id: `chap_${textbookId}_${chapterNumCounter}`,
          textbookId,
          chapterNumber: chapterNumCounter++,
          title: cleanTitle || `Chapter ${chapterNumCounter - 1}`,
          startPage: page.pageNumber,
          endPage: page.pageNumber,
          exerciseSections: []
        };
      }

      if (exerciseMatch && currentChapter) {
        currentChapter.exerciseSections = currentChapter.exerciseSections || [];
        const exTitle = exerciseMatch[0].trim();
        if (!currentChapter.exerciseSections.some(e => e.title.toLowerCase() === exTitle.toLowerCase())) {
          currentChapter.exerciseSections.push({
            title: exTitle,
            startPage: page.pageNumber,
            endPage: page.pageNumber
          });
        }
      }
    }

    if (currentChapter && currentChapter.title) {
      currentChapter.endPage = pages[pages.length - 1].pageNumber;
      chapters.push(currentChapter as ChapterRecord);
    }

    // Fallback: If no explicit chapter headers found, create default Unit 1
    if (chapters.length === 0 && pages.length > 0) {
      chapters.push({
        id: `chap_${textbookId}_1`,
        textbookId,
        chapterNumber: 1,
        title: 'Full Textbook Content',
        startPage: 1,
        endPage: pages[pages.length - 1].pageNumber,
        exerciseSections: []
      });
    }

    return chapters;
  }

  /**
   * Create semantic chunks ~500-800 words with 100-word overlap
   */
  private createChunks(
    pages: { pageNumber: number; text: string }[],
    textbookId: string,
    chapters: ChapterRecord[]
  ): TextbookChunk[] {
    const chunks: TextbookChunk[] = [];
    const CHUNK_SIZE = 600;
    const CHUNK_OVERLAP = 100;
    let chunkCounter = 1;

    for (const page of pages) {
      const words = page.text.split(/\s+/).filter(Boolean);
      if (words.length === 0) continue;

      const associatedChapter = chapters.find(
        c => page.pageNumber >= c.startPage && page.pageNumber <= c.endPage
      );

      for (let i = 0; i < words.length; i += (CHUNK_SIZE - CHUNK_OVERLAP)) {
        const slice = words.slice(i, i + CHUNK_SIZE);
        if (slice.length < 20 && chunks.length > 0) continue; // Skip tiny trailing chunks

        const content = slice.join(' ');
        chunks.push({
          id: `chk_${textbookId}_${chunkCounter++}`,
          textbookId,
          chapterId: associatedChapter?.id,
          chapterTitle: associatedChapter?.title,
          pageNumber: page.pageNumber,
          content,
          tokenCount: slice.length
        });
      }
    }

    return chunks;
  }

  /**
   * Index chunks into in-browser MiniSearch
   */
  indexChunks(textbookId: string, chunks: TextbookChunk[]) {
    const miniSearch = new MiniSearch<TextbookChunk>({
      fields: ['content', 'chapterTitle'],
      storeFields: ['id', 'textbookId', 'chapterId', 'chapterTitle', 'pageNumber', 'content', 'tokenCount'],
      searchOptions: {
        boost: { chapterTitle: 2 },
        fuzzy: 0.2,
        prefix: true
      }
    });

    miniSearch.addAll(chunks);
    this.miniSearchInstances.set(textbookId, miniSearch);
  }

  /**
   * Search relevant chunks across textbooks or a specific textbook
   */
  async searchRelevantChunks(
    query: string,
    options?: { textbookId?: string; chapterId?: string; limit?: number }
  ): Promise<TextbookChunk[]> {
    const limit = options?.limit || 5;

    // Load from memory or rebuild from IndexedDB
    let searcher = options?.textbookId ? this.miniSearchInstances.get(options.textbookId) : null;
    if (!searcher) {
      let chunksQuery = db.textbookChunks;
      let rawChunks = options?.textbookId 
        ? await chunksQuery.where('textbookId').equals(options.textbookId).toArray()
        : await chunksQuery.toArray();

      if (rawChunks.length === 0) return [];

      searcher = new MiniSearch<TextbookChunk>({
        fields: ['content', 'chapterTitle'],
        storeFields: ['id', 'textbookId', 'chapterId', 'chapterTitle', 'pageNumber', 'content', 'tokenCount']
      });
      searcher.addAll(rawChunks);
      if (options?.textbookId) {
        this.miniSearchInstances.set(options.textbookId, searcher);
      }
    }

    const results = searcher.search(query);
    const matched = results.slice(0, limit).map((r: any) => ({
      id: r.id,
      textbookId: r.textbookId,
      chapterId: r.chapterId,
      chapterTitle: r.chapterTitle,
      pageNumber: r.pageNumber,
      content: r.content,
      tokenCount: r.tokenCount
    }));

    return matched;
  }

  /**
   * Parse Question Bank document into individual structured QuestionItems
   */
  async parseQuestionBankFile(
    file: File,
    defaults: { subject: string; grade: number; board?: any }
  ): Promise<QuestionItem[]> {
    const text = await file.text();
    const rawBlocks = text.split(/(?=\n\s*(?:Q(?:uestion)?\.?\s*\d+|^\d+[\.\)])\s*)/im).filter(b => b.trim().length > 10);
    const questions: QuestionItem[] = [];

    for (const block of rawBlocks) {
      const q = this.parseSingleQuestionBlock(block, defaults);
      if (q) questions.push(q);
    }

    return questions;
  }

  private parseSingleQuestionBlock(block: string, defaults: { subject: string; grade: number; board?: any }): QuestionItem | null {
    const lines = block.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return null;

    let questionText = lines[0].replace(/^(?:Q(?:uestion)?\.?\s*\d+|^\d+[\.\)])\s*/i, '').trim();
    let type: QuestionType = 'short_answer';
    let marks = 2;
    let difficulty: DifficultyLevel = 'medium';
    let bloomLevel: BloomsLevel = 'Understand';
    let options: QuestionOption[] | undefined;
    let answer = '';
    let explanation = '';

    // Check MCQ options e.g. (a) ... (b) ... (c) ... (d)
    const mcqRegex = /(?:\([a-d]\)|[a-d]\.|\b[A-D]\))\s*([^\n\r]+)/g;
    const optMatches = [...block.matchAll(mcqRegex)];

    if (optMatches.length >= 2) {
      type = 'mcq';
      marks = 1;
      options = optMatches.slice(0, 4).map((m, idx) => ({
        id: `opt_${idx + 1}`,
        text: m[1].trim(),
        isCorrect: false
      }));
    } else if (/\b(assertion|reason)\b/i.test(block)) {
      type = 'assertion_reason';
      marks = 1;
    } else if (/\b(case\s*study|read\s*the\s*passage)\b/i.test(block)) {
      type = 'case_study';
      marks = 4;
    }

    // Marks detection
    const marksMatch = block.match(/\[?\(?(\d+)\s*(?:marks?|m)\)?\]?/i);
    if (marksMatch) {
      marks = parseInt(marksMatch[1], 10);
      if (marks >= 5) type = 'long_answer';
    }

    // Answer detection
    const ansMatch = block.match(/(?:ans(?:wer)?|solution|key)\s*[:\-]\s*([^\n\r]+)/i);
    if (ansMatch) {
      answer = ansMatch[1].trim();
      if (type === 'mcq' && options) {
        // Tag correct option
        const letter = answer.match(/[A-D]/i)?.[0]?.toUpperCase();
        if (letter) {
          const optIdx = letter.charCodeAt(0) - 65;
          if (options[optIdx]) options[optIdx].isCorrect = true;
        }
      }
    }

    return {
      id: `qb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      text: questionText,
      type,
      marks,
      difficulty,
      bloomLevel,
      options,
      answer,
      explanation,
      subject: defaults.subject,
      grade: defaults.grade,
      board: defaults.board,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  /**
   * Deduplicate similar questions using token-based Jaccard similarity
   */
  findDuplicates(questions: QuestionItem[], threshold = 0.75): { original: QuestionItem; duplicate: QuestionItem; similarity: number }[] {
    const duplicates: { original: QuestionItem; duplicate: QuestionItem; similarity: number }[] = [];

    for (let i = 0; i < questions.length; i++) {
      for (let j = i + 1; j < questions.length; j++) {
        const sim = calculateJaccardSimilarity(questions[i].text, questions[j].text);
        if (sim >= threshold) {
          duplicates.push({
            original: questions[i],
            duplicate: questions[j],
            similarity: Math.round(sim * 100)
          });
        }
      }
    }

    return duplicates;
  }
}

export const INGESTION_SERVICE = new IngestionService();

export function calculateJaccardSimilarity(textA: string, textB: string): number {
  const wordsA = new Set(textA.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean));
  const wordsB = new Set(textB.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean));
  if (wordsA.size === 0 && wordsB.size === 0) return 1;
  const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);
  return intersection.size / union.size;
}

export function sanitizeFilename(name: string): string {
  return name.replace(/\.\./g, '_').replace(/[^a-zA-Z0-9_\-\.]/g, '_').replace(/_+/g, '_');
}
