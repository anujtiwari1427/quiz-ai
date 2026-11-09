// Vercel Serverless Function: /api/books/process
// Background pipeline: Uploading -> Extracting -> Structuring & Tagging Exercises -> Ready / Failed
import type { IncomingMessage, ServerResponse } from 'http';

interface VercelRequest extends IncomingMessage {
  body: any;
  query: { [key: string]: string | string[] };
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: any) => VercelResponse;
}

export interface DetectedExerciseBlock {
  id: string;
  title: string;
  page: number;
  type: 'exercise' | 'practice_problems' | 'review_questions' | 'problems' | 'questions';
  snippet?: string;
  estimatedQuestions?: number;
}

export interface ProcessedChapter {
  id: string;
  bookId: string;
  name: string;
  orderIndex: number;
  pageStart: number;
  pageEnd: number;
  contentPreview?: string;
  hasExercises: boolean;
  detectedExercises: DetectedExerciseBlock[];
  exerciseCount: number;
}

// Exercise detection regex matching standard textbook exercise titles
const EXERCISE_SECTION_REGEX = /(?:(?:practice\s+set|exercises?|practice\s+problems?|review\s+questions?|problems?|questions?)(?:\s+([0-9.]+))?)/i;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { 
      bookId, 
      fileType, 
      rawContent, 
      pageTexts = [], 
      totalPages: inputTotalPages, 
      title 
    } = req.body || {};

    if (!bookId) {
      return res.status(400).json({ error: 'Missing bookId' });
    }

    // 1. Scanned Document Detection
    // Check if entire content is blank, too short, or lacks extractable text
    const fullText = (rawContent || (pageTexts as string[]).join('\n\n')).trim();
    const totalPages = Math.max(1, inputTotalPages || (pageTexts.length > 0 ? pageTexts.length : Math.ceil(fullText.length / 1800)));

    if (fileType === 'pdf') {
      const avgCharsPerPage = totalPages > 0 ? fullText.length / totalPages : 0;
      if (fullText.length < 50 || (totalPages > 2 && avgCharsPerPage < 15)) {
        return res.status(200).json({
          bookId,
          status: 'failed',
          isScanned: true,
          errorMessage: 'The uploaded PDF appears to be a scanned document without a selectable text layer. Scanned PDFs are not currently supported; please upload a searchable PDF or run OCR before uploading.'
        });
      }
    }

    // 2. Chapter & Structure Detection
    const detectedChapters: ProcessedChapter[] = [];
    const chapterHeaderRegex = /(?:^|\n)(?:chapter|unit|module|lesson|part)\s+([0-9ivxlcdm]+)[:.\s-]*([^\n\r]+)?/gi;

    if (fullText) {
      let match;
      let order = 1;
      while ((match = chapterHeaderRegex.exec(fullText)) !== null && order <= 40) {
        const fullHeader = match[0].trim();
        const startChar = match.index;
        const estPage = Math.max(1, Math.floor(startChar / 1800) + 1);

        detectedChapters.push({
          id: `ch_${bookId}_${order}`,
          bookId,
          name: fullHeader.slice(0, 80),
          orderIndex: order,
          pageStart: estPage,
          pageEnd: estPage + 10,
          hasExercises: false,
          detectedExercises: [],
          exerciseCount: 0
        });
        order++;
      }
    }

    // Default chapters if no headers detected by regex
    if (detectedChapters.length === 0) {
      const pagesPerChapter = Math.max(5, Math.ceil(totalPages / 4));
      for (let i = 1; i <= Math.min(4, Math.ceil(totalPages / pagesPerChapter)); i++) {
        const pStart = (i - 1) * pagesPerChapter + 1;
        const pEnd = Math.min(totalPages, i * pagesPerChapter);
        detectedChapters.push({
          id: `ch_${bookId}_${i}`,
          bookId,
          name: `Chapter ${i}: Content Section ${i}`,
          orderIndex: i,
          pageStart: pStart,
          pageEnd: pEnd,
          hasExercises: false,
          detectedExercises: [],
          exerciseCount: 0
        });
      }
    }

    // Adjust chapter pageEnd boundaries
    for (let i = 0; i < detectedChapters.length; i++) {
      if (i < detectedChapters.length - 1) {
        detectedChapters[i].pageEnd = Math.max(detectedChapters[i].pageStart, detectedChapters[i + 1].pageStart - 1);
      } else {
        detectedChapters[i].pageEnd = totalPages;
      }
    }

    // 3. Exercise Section Detection & Tagging per Chapter
    // Checks for "Exercise", "Exercises", "Practice Problems", "Practice Set", "Review Questions", "Problems", "Questions"
    let totalExerciseSectionsCount = 0;

    const findExercisesInText = (text: string, basePage: number, chapterId: string): DetectedExerciseBlock[] => {
      const found: DetectedExerciseBlock[] = [];
      const lines = text.split('\n');

      lines.forEach((line, lineIdx) => {
        const trimmed = line.trim();
        if (trimmed.length > 3 && trimmed.length < 90) {
          const match = trimmed.match(EXERCISE_SECTION_REGEX);
          if (match) {
            const rawTitle = match[0].trim();
            const lower = rawTitle.toLowerCase();
            let type: DetectedExerciseBlock['type'] = 'exercise';
            if (lower.includes('practice problem') || lower.includes('practice set')) type = 'practice_problems';
            else if (lower.includes('review question')) type = 'review_questions';
            else if (lower.includes('problem')) type = 'problems';
            else if (lower.includes('question')) type = 'questions';

            const snippet = lines.slice(lineIdx, lineIdx + 4).join(' ').slice(0, 150);
            found.push({
              id: `ex_${chapterId}_${found.length + 1}`,
              title: trimmed,
              page: basePage,
              type,
              snippet,
              estimatedQuestions: 5
            });
          }
        }
      });
      return found;
    };

    // If pageTexts was provided, detect page-by-page accurately
    if (Array.isArray(pageTexts) && pageTexts.length > 0) {
      pageTexts.forEach((pageContent, idx) => {
        const pageNum = idx + 1;
        const targetChapter = detectedChapters.find(ch => pageNum >= ch.pageStart && pageNum <= ch.pageEnd) || detectedChapters[detectedChapters.length - 1];
        if (targetChapter) {
          const exercises = findExercisesInText(pageContent, pageNum, targetChapter.id);
          if (exercises.length > 0) {
            targetChapter.detectedExercises.push(...exercises);
          }
        }
      });
    } else {
      // Analyze full text per chapter
      detectedChapters.forEach(ch => {
        const chExercises = findExercisesInText(fullText.slice(0, 15000), ch.pageStart, ch.id);
        ch.detectedExercises = chExercises;
      });
    }

    // Update chapter metadata flags
    detectedChapters.forEach(ch => {
      ch.exerciseCount = ch.detectedExercises.length;
      ch.hasExercises = ch.exerciseCount > 0;
      totalExerciseSectionsCount += ch.exerciseCount;
    });

    // 4. Chunking Pipeline: 2400 chars with 400 char overlap
    const chunkSizeChars = 2400;
    const overlapChars = 400;
    const chunks: { id: string; bookId: string; chapterName: string; exerciseRef?: string; text: string; page: number }[] = [];

    let currentPos = 0;
    let chunkIndex = 0;
    while (currentPos < fullText.length && chunkIndex < 100) {
      const chunkText = fullText.substring(currentPos, currentPos + chunkSizeChars);
      const estPage = Math.min(totalPages, Math.floor(currentPos / 1800) + 1);
      const currentChapter = detectedChapters.find(ch => estPage >= ch.pageStart && estPage <= ch.pageEnd) || detectedChapters[0];
      const currentExercise = currentChapter?.detectedExercises.find(ex => Math.abs(ex.page - estPage) <= 1)?.title;

      chunks.push({
        id: `chunk_${bookId}_${chunkIndex}`,
        bookId,
        chapterName: currentChapter?.name || 'General',
        exerciseRef: currentExercise,
        text: chunkText,
        page: estPage
      });

      currentPos += (chunkSizeChars - overlapChars);
      chunkIndex++;
    }

    return res.status(200).json({
      success: true,
      bookId,
      status: 'ready',
      totalPages,
      chaptersCount: detectedChapters.length,
      chapters: detectedChapters,
      exerciseSectionsCount: totalExerciseSectionsCount,
      chunksCount: chunks.length,
      chunks,
      message: `Successfully processed textbook. Detected ${detectedChapters.length} chapters and ${totalExerciseSectionsCount} exercise sections.`
    });
  } catch (error: any) {
    console.error('Book processing error:', error);
    return res.status(500).json({ error: error.message || 'Processing failed' });
  }
}
