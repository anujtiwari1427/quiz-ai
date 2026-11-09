/**
 * EduPulse AI / QP-M - Textbook Extraction Service
 * Performs page-by-page text extraction, structure & chapter detection,
 * exercise section tagging ("Exercise", "Practice Set", "Problems", "Questions"),
 * scanned PDF detection, and non-blocking background progress reporting.
 */
import * as pdfjsLib from 'pdfjs-dist';
import { BookModel, ChapterModel, ChunkModel, DetectedExercise, sanitizeFilename } from '../types/schemas';
import { isLegibleText } from './documentParserService';

if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

export type ExtractionStage = 'uploading' | 'extracting' | 'structuring' | 'ready' | 'failed';

export interface ExtractionProgressCallback {
  (stage: ExtractionStage, percent: number, message: string): void;
}

export interface ExtractedTextbookResult {
  bookId: string;
  title: string;
  subject: string;
  author: string;
  uploaderName: string;
  originalFilename: string;
  sanitizedFilename: string;
  fileSizeBytes: number;
  fileType: 'pdf' | 'docx' | 'txt' | 'epub';
  totalPages: number;
  isScanned: boolean;
  chapters: ChapterModel[];
  chunks: ChunkModel[];
  exerciseSectionsCount: number;
  errorMessage?: string;
}

// Regex to capture exercise headings inside textbooks
export const EXERCISE_HEADER_REGEX = /(?:(?:practice\s+set|exercises?|practice\s+problems?|review\s+questions?|problems?|questions?)(?:\s+([0-9.]+))?)/i;

// Regex to identify chapter/unit headings
export const CHAPTER_HEADER_REGEX = /(?:chapter|unit|module|lesson|part)\s+([0-9ivxlcdm]+)[:.\s-]*([^\n\r]+)?/i;

export const TEXTBOOK_EXTRACTION_SERVICE = {
  /**
   * Main entry point: process a textbook File object asynchronously
   */
  async processTextbookFile(
    file: File,
    metadata: { title?: string; author?: string; subject?: string; uploaderName?: string },
    onProgress?: ExtractionProgressCallback
  ): Promise<ExtractedTextbookResult> {
    const rawExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const fileType = (['pdf', 'docx', 'txt', 'epub'].includes(rawExt) ? rawExt : 'pdf') as 'pdf' | 'docx' | 'txt' | 'epub';
    const sanitizedFilename = sanitizeFilename(file.name);
    const bookId = `book_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const title = metadata.title?.trim() || file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const author = metadata.author?.trim() || 'Curriculum Author';
    const subject = metadata.subject?.trim() || 'General';
    const uploaderName = metadata.uploaderName?.trim() || 'Educator';

    onProgress?.('uploading', 15, `Validating ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);

    // 1. Page-by-page text extraction
    let pageTexts: string[] = [];
    let totalPages = 1;

    try {
      if (fileType === 'pdf') {
        const pdfResult = await this.extractPdfPages(file, (p, total) => {
          const percent = 20 + Math.round((p / total) * 50);
          onProgress?.('extracting', percent, `Extracting page ${p} of ${total}...`);
        });
        pageTexts = pdfResult.pageTexts;
        totalPages = pdfResult.totalPages;
      } else if (fileType === 'txt') {
        onProgress?.('extracting', 40, 'Reading text document...');
        const text = await file.text();
        pageTexts = this.splitTextIntoPages(text);
        totalPages = pageTexts.length;
      } else if (fileType === 'docx') {
        onProgress?.('extracting', 40, 'Extracting Word document chapters...');
        const docxText = await this.extractDocxText(file);
        pageTexts = this.splitTextIntoPages(docxText);
        totalPages = pageTexts.length;
      } else {
        // EPUB or fallback
        onProgress?.('extracting', 40, 'Reading publication content...');
        const text = await file.text();
        pageTexts = this.splitTextIntoPages(text);
        totalPages = pageTexts.length;
      }
    } catch (extractErr: any) {
      console.error('Text extraction failed:', extractErr);
      onProgress?.('failed', 0, `Extraction failed: ${extractErr.message || 'File could not be parsed'}`);
      throw new Error(`Text extraction failed: ${extractErr.message || 'File could not be parsed'}`);
    }

    // 2. Scanned PDF Check
    const combinedText = pageTexts.join('\n\n').trim();
    const isScanned = this.checkIsScannedDocument(pageTexts, totalPages, fileType);

    if (isScanned) {
      const errorMsg = 'The uploaded PDF appears to be a scanned document without a selectable text layer. Scanned PDFs without OCR are not supported; please upload a searchable PDF or run OCR before uploading.';
      onProgress?.('failed', 100, errorMsg);
      return {
        bookId,
        title,
        subject,
        author,
        uploaderName,
        originalFilename: file.name,
        sanitizedFilename,
        fileSizeBytes: file.size,
        fileType,
        totalPages,
        isScanned: true,
        chapters: [],
        chunks: [],
        exerciseSectionsCount: 0,
        errorMessage: errorMsg
      };
    }

    // 3. Structure & Chapter Detection
    onProgress?.('structuring', 75, 'Detecting chapters and exercise sections...');
    const chapters = this.detectChaptersAndExercises(pageTexts, bookId, totalPages, title);
    const exerciseSectionsCount = chapters.reduce((sum, ch) => sum + (ch.exerciseCount || 0), 0);

    // 4. Generate Chunks for RAG / Paper Generation
    onProgress?.('structuring', 90, 'Generating semantic question chunks...');
    const chunks = this.generateChunks(pageTexts, chapters, bookId);

    onProgress?.('ready', 100, `Ready! Detected ${chapters.length} chapters and ${exerciseSectionsCount} exercise sections.`);

    return {
      bookId,
      title,
      subject,
      author,
      uploaderName,
      originalFilename: file.name,
      sanitizedFilename,
      fileSizeBytes: file.size,
      fileType,
      totalPages,
      isScanned: false,
      chapters,
      chunks,
      exerciseSectionsCount
    };
  },

  /**
   * Extract text from PDF page-by-page using pdfjsLib
   */
  async extractPdfPages(
    file: File,
    onPageProgress?: (page: number, total: number) => void
  ): Promise<{ pageTexts: string[]; totalPages: number }> {
    const arrayBuffer = await file.arrayBuffer();

    if (pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      isEvalSupported: false,
      useWorkerFetch: false
    });

    const pdfDoc = await loadingTask.promise;
    const totalPages = pdfDoc.numPages;
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const textItems = textContent.items
          .filter((item: any) => typeof item.str === 'string' && item.str.trim().length > 0)
          .map((item: any) => item.str);

        const pageStr = textItems.join(' ').trim();
        pageTexts.push(pageStr);
        onPageProgress?.(pageNum, totalPages);
      } catch (pageErr) {
        console.warn(`Error on PDF page ${pageNum}`, pageErr);
        pageTexts.push('');
      }
    }

    return { pageTexts, totalPages };
  },

  /**
   * Extract text from DOCX file using XML paragraph scanning
   */
  async extractDocxText(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const raw = decoder.decode(bytes);

    const paragraphs: string[] = [];
    const pRegex = /<w:t[^>]*>([^<]+)<\/w:t>/g;
    let match;
    let currentParagraph = '';

    while ((match = pRegex.exec(raw)) !== null) {
      currentParagraph += (match[1] || '') + ' ';
      if (currentParagraph.length > 200) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = '';
      }
    }
    if (currentParagraph.trim()) paragraphs.push(currentParagraph.trim());

    return paragraphs.length > 0 ? paragraphs.join('\n\n') : 'Extracted textbook document text.';
  },

  /**
   * Split plain text into ~1800 character virtual pages
   */
  splitTextIntoPages(fullText: string): string[] {
    if (!fullText) return [''];
    const pageSize = 1800;
    const pages: string[] = [];
    for (let i = 0; i < fullText.length; i += pageSize) {
      pages.push(fullText.substring(i, i + pageSize));
    }
    return pages.length > 0 ? pages : [fullText];
  },

  /**
   * Detect whether a document is a scanned image with no readable text
   */
  checkIsScannedDocument(pageTexts: string[], totalPages: number, fileType: string): boolean {
    if (fileType !== 'pdf') return false;
    const totalChars = pageTexts.reduce((acc, p) => acc + p.trim().length, 0);

    // If total characters across entire document is less than 50
    if (totalChars < 50) return true;

    // If multi-page PDF and average legible characters per page is below 15
    if (totalPages >= 3) {
      const avgChars = totalChars / totalPages;
      if (avgChars < 15) return true;
    }

    // Check legibility of sample
    const sample = pageTexts.slice(0, 5).join(' ');
    if (sample.length > 30 && !isLegibleText(sample)) {
      return true;
    }

    return false;
  },

  /**
   * Detect chapters and tag exercise sections per chapter
   */
  detectChaptersAndExercises(
    pageTexts: string[],
    bookId: string,
    totalPages: number,
    bookTitle: string
  ): ChapterModel[] {
    const chapters: ChapterModel[] = [];

    // Scan pages for chapter headers
    pageTexts.forEach((pageContent, idx) => {
      const pageNum = idx + 1;
      const lines = pageContent.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        const chMatch = trimmed.match(CHAPTER_HEADER_REGEX);
        if (chMatch && chMatch[0].length < 80) {
          const chTitle = chMatch[0].trim();
          // Prevent duplicates on consecutive lines/pages
          if (!chapters.some(c => c.name.toLowerCase() === chTitle.toLowerCase() || Math.abs(c.pageStart - pageNum) < 2)) {
            chapters.push({
              id: `ch_${bookId}_${chapters.length + 1}`,
              bookId,
              name: chTitle,
              orderIndex: chapters.length + 1,
              pageStart: pageNum,
              pageEnd: pageNum,
              contentPreview: pageContent.slice(0, 200),
              hasExercises: false,
              detectedExercises: [],
              exerciseCount: 0
            });
          }
          break;
        }
      }
    });

    // Fallback: If no chapter headers were identified, partition evenly
    if (chapters.length === 0) {
      const numChapters = Math.min(6, Math.max(2, Math.ceil(totalPages / 15)));
      const pagesPerCh = Math.ceil(totalPages / numChapters);

      for (let i = 1; i <= numChapters; i++) {
        const pStart = (i - 1) * pagesPerCh + 1;
        const pEnd = Math.min(totalPages, i * pagesPerCh);
        chapters.push({
          id: `ch_${bookId}_${i}`,
          bookId,
          name: `${bookTitle} — Unit ${i}`,
          orderIndex: i,
          pageStart: pStart,
          pageEnd: pEnd,
          contentPreview: pageTexts[pStart - 1]?.slice(0, 200) || '',
          hasExercises: false,
          detectedExercises: [],
          exerciseCount: 0
        });
      }
    }

    // Set pageEnd boundaries
    for (let i = 0; i < chapters.length; i++) {
      if (i < chapters.length - 1) {
        chapters[i].pageEnd = Math.max(chapters[i].pageStart, chapters[i + 1].pageStart - 1);
      } else {
        chapters[i].pageEnd = totalPages;
      }
    }

    // Now scan each page for Exercise sections:
    // Specifically: "Exercise", "Exercises", "Practice Problems", "Practice Set", "Review Questions", "Problems", "Questions"
    pageTexts.forEach((pageContent, idx) => {
      const pageNum = idx + 1;
      const associatedChapter = chapters.find(c => pageNum >= c.pageStart && pageNum <= c.pageEnd) || chapters[chapters.length - 1];

      if (!associatedChapter) return;

      const lines = pageContent.split('\n');
      lines.forEach((line, lineIdx) => {
        const trimmed = line.trim();
        if (trimmed.length > 3 && trimmed.length < 80) {
          const match = trimmed.match(EXERCISE_HEADER_REGEX);
          if (match) {
            const rawTitle = match[0].trim();
            const lower = rawTitle.toLowerCase();
            let exType: DetectedExercise['type'] = 'exercise';

            if (lower.includes('practice problem') || lower.includes('practice set')) {
              exType = 'practice_problems';
            } else if (lower.includes('review question')) {
              exType = 'review_questions';
            } else if (lower.includes('problem')) {
              exType = 'problems';
            } else if (lower.includes('question')) {
              exType = 'questions';
            }

            const snippet = lines.slice(lineIdx, lineIdx + 4).join(' ').slice(0, 150);

            // Avoid duplicate exercise entries on the same page
            const existingList = associatedChapter.detectedExercises || [];
            if (!existingList.some(e => e.page === pageNum && e.title.toLowerCase() === trimmed.toLowerCase())) {
              const newExercise: DetectedExercise = {
                id: `ex_${associatedChapter.id}_${existingList.length + 1}`,
                title: trimmed,
                page: pageNum,
                type: exType,
                snippet,
                estimatedQuestions: 6
              };
              existingList.push(newExercise);
              associatedChapter.detectedExercises = existingList;
              associatedChapter.exerciseCount = existingList.length;
              associatedChapter.hasExercises = true;
            }
          }
        }
      });
    });

    return chapters;
  },

  /**
   * Generate 2400-char chunks for AI grounding
   */
  generateChunks(pageTexts: string[], chapters: ChapterModel[], bookId: string): ChunkModel[] {
    const chunks: ChunkModel[] = [];
    const chunkSize = 2400;
    const overlap = 400;

    pageTexts.forEach((pageContent, idx) => {
      const pageNum = idx + 1;
      if (!pageContent.trim()) return;

      const associatedChapter = chapters.find(c => pageNum >= c.pageStart && pageNum <= c.pageEnd);
      const exerciseOnPage = associatedChapter?.detectedExercises?.find(e => e.page === pageNum);

      let pos = 0;
      let chunkIdx = 0;
      while (pos < pageContent.length && chunkIdx < 10) {
        const chunkText = pageContent.substring(pos, pos + chunkSize);
        chunks.push({
          id: `chunk_${bookId}_p${pageNum}_${chunkIdx}`,
          bookId,
          chapterId: associatedChapter?.id,
          chapterName: associatedChapter?.name || 'General',
          exerciseRef: exerciseOnPage?.title,
          text: chunkText,
          page: pageNum
        });
        pos += (chunkSize - overlap);
        chunkIdx++;
      }
    });

    return chunks;
  }
};
