/**
 * EduPulse AI - PDF Generator Service
 * Generates standards-compliant, publication-quality PDF-1.4 documents client-side.
 * Enables full multi-page PDF viewing, printing, and downloading for all textbooks.
 */

import { Book, BookChapter } from '../types';

export interface GeneratedPdfResult {
  blob: Blob;
  objectUrl: string;
  pageCount: number;
}

// A4 dimensions in points (72 points = 1 inch)
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 545;
const MARGIN_TOP = 780;
const MARGIN_BOTTOM = 50;
const CONTENT_WIDTH = MARGIN_RIGHT - MARGIN_LEFT; // 495 pt

/**
 * Escapes characters for PDF literal strings (parentheses and backslashes)
 */
function escapePdfText(text: string): string {
  // Strip non-printable or unsupported characters for standard Type1 WinAnsi encoding
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ');
}

/**
 * Wraps text into lines that fit within a character count threshold.
 */
function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if (currentLine.length + 1 + word.length <= maxCharsPerLine) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [''];
}

export class PdfGeneratorService {
  /**
   * Generates a complete, multi-page PDF Blob from a Book model
   */
  static generateBookPdf(book: Book): GeneratedPdfResult {
    const pagesContentStreams: string[] = [];

    // ──────────────────────────────────────────────
    // 1. COVER PAGE
    // ──────────────────────────────────────────────
    pagesContentStreams.push(this.renderCoverPage(book));

    // ──────────────────────────────────────────────
    // 2. TABLE OF CONTENTS
    // ──────────────────────────────────────────────
    pagesContentStreams.push(this.renderTocPage(book));

    // ──────────────────────────────────────────────
    // 3. CHAPTER PAGES
    // ──────────────────────────────────────────────
    let currentPageNum = 3;
    for (const chapter of book.chapters) {
      const chapterPages = this.renderChapter(book, chapter, currentPageNum);
      pagesContentStreams.push(...chapterPages);
      currentPageNum += chapterPages.length;
    }

    const totalPages = pagesContentStreams.length;

    // Assemble PDF-1.4 file
    const pdfBytes = this.assemblePdf14(pagesContentStreams, totalPages);
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    const objectUrl = URL.createObjectURL(blob);

    return {
      blob,
      objectUrl,
      pageCount: totalPages
    };
  }

  /**
   * Renders the Cover Page stream
   */
  private static renderCoverPage(book: Book): string {
    const s: string[] = [];

    // Background and double border
    s.push('0.1 0.15 0.3 rg'); // Deep indigo/navy banner
    s.push(`40 730 515 70 re f`);

    s.push('0.2 0.35 0.75 RG 2 w'); // Outer border
    s.push(`35 35 525 770 re S`);
    s.push('0.5 0.6 0.9 RG 0.75 w'); // Inner border
    s.push(`40 40 515 760 re S`);

    // Board Header text
    s.push('q 1 1 1 rg');
    s.push('BT /F2 14 Tf 55 770 Td (' + escapePdfText((book.board || 'STATE CURRICULUM').toUpperCase()) + ') Tj ET');
    s.push('BT /F1 9 Tf 55 750 Td (OFFICIAL OPEN-ACCESS EDUCATIONAL TEXTBOOK • FREE STUDENT EDITION) Tj ET');
    s.push('Q');

    // Book Title Box
    const titleLines = wrapText(book.title, 34);
    let y = 620;
    s.push('0 0 0 rg');
    for (const line of titleLines) {
      s.push(`BT /F2 24 Tf 60 ${y} Td (${escapePdfText(line)}) Tj ET`);
      y -= 30;
    }

    // Horizontal Accent Line
    s.push(`0.2 0.45 0.85 RG 2.5 w 60 ${y + 10} m 300 ${y + 10} l S`);
    y -= 25;

    // Subject & Grade
    s.push('0.2 0.25 0.35 rg');
    s.push(`BT /F2 13 Tf 60 ${y} Td (SUBJECT: ${escapePdfText(book.subject.toUpperCase())}) Tj ET`);
    y -= 20;
    if (book.grade) {
      s.push(`BT /F1 11 Tf 60 ${y} Td (Standard / Class: Grade ${book.grade} - Secondary School Certificate) Tj ET`);
      y -= 20;
    }
    s.push(`BT /F3 11 Tf 60 ${y} Td (Published by: ${escapePdfText(book.author || 'State Bureau of Textbook Production')}) Tj ET`);
    y -= 50;

    // Feature / Table of Chapters Card
    s.push('0.96 0.97 0.99 rg');
    s.push(`60 170 475 220 re f`);
    s.push('0.8 0.85 0.92 RG 1 w');
    s.push(`60 170 475 220 re S`);

    s.push('0.1 0.2 0.4 rg');
    s.push('BT /F2 11 Tf 75 365 Td (CURRICULUM CHAPTER OVERVIEW & INDEX) Tj ET');

    let chapY = 340;
    for (const ch of book.chapters.slice(0, 6)) {
      s.push('0.2 0.25 0.35 rg');
      const chTitle = `Chapter ${ch.chapterNumber}: ${ch.title}`;
      const wrapped = wrapText(chTitle, 58)[0] || chTitle;
      s.push(`BT /F1 9.5 Tf 80 ${chapY} Td (${escapePdfText(wrapped)}) Tj ET`);
      chapY -= 20;
    }

    if (book.chapters.length > 6) {
      s.push(`BT /F3 9 Tf 80 ${chapY} Td (+ ${book.chapters.length - 6} additional curriculum chapters included) Tj ET`);
    }

    // Seal of Authenticity Banner
    s.push('0.05 0.45 0.3 rg'); // Emerald green
    s.push('70 70 455 50 re f');
    s.push('q 1 1 1 rg');
    s.push('BT /F2 11 Tf 85 100 Td (100% FREE DIGITAL TEXTBOOK & STUDY EDITION) Tj ET');
    s.push('BT /F1 8.5 Tf 85 85 Td (Digitized for interactive reading, audio narration, and AI tutoring on EduPulse AI) Tj ET');
    s.push('Q');

    return s.join('\n');
  }

  /**
   * Renders the Table of Contents page
   */
  private static renderTocPage(book: Book): string {
    const s: string[] = [];
    this.addPageFrame(s, book, 'Table of Contents', 2);

    s.push('0.1 0.2 0.4 rg');
    s.push('BT /F2 20 Tf 50 720 Td (TABLE OF CONTENTS) Tj ET');
    s.push('0.2 0.45 0.85 RG 2 w 50 710 m 545 710 l S');

    s.push('0.4 0.45 0.5 rg');
    s.push('BT /F1 10 Tf 50 690 Td (Official syllabus chapters aligned with State Board examination guidelines) Tj ET');

    let y = 650;
    let pageTracker = 3;

    book.chapters.forEach((ch, idx) => {
      // Row background zebra
      if (idx % 2 === 0) {
        s.push(`0.97 0.98 1 rg 50 ${y - 8} 495 28 re f`);
      }

      s.push('0.1 0.15 0.3 rg');
      s.push(`BT /F2 11 Tf 60 ${y} Td (Chapter ${ch.chapterNumber}) Tj ET`);

      const name = wrapText(ch.title, 42)[0] || ch.title;
      s.push(`BT /F1 10.5 Tf 135 ${y} Td (${escapePdfText(name)}) Tj ET`);

      // Dotted leader
      s.push('0.7 0.75 0.8 rg');
      s.push(`BT /F1 8 Tf 400 ${y} Td (. . . . . . . . . . . . . . . . . . .) Tj ET`);

      s.push('0.1 0.4 0.8 rg');
      s.push(`BT /F2 10.5 Tf 510 ${y} Td (p. ${pageTracker}) Tj ET`);

      y -= 32;
      // Estimate pages per chapter
      const estPages = Math.max(1, Math.ceil((ch.content?.length || 1000) / 1800));
      pageTracker += estPages;
    });

    return s.join('\n');
  }

  /**
   * Renders a book chapter into one or more PDF pages
   */
  private static renderChapter(book: Book, chapter: BookChapter, startPageNum: number): string[] {
    const pages: string[] = [];
    let currentStreams: string[] = [];
    let pageNumber = startPageNum;

    // Start first page of chapter
    this.addPageFrame(currentStreams, book, chapter.title, pageNumber);

    // Chapter Header Banner
    currentStreams.push('0.92 0.95 1 rg 50 700 495 45 re f');
    currentStreams.push('0.2 0.4 0.8 RG 1 w 50 700 495 45 re S');

    currentStreams.push('0.1 0.25 0.6 rg');
    currentStreams.push(`BT /F2 11 Tf 65 726 Td (CHAPTER ${chapter.chapterNumber} • ${escapePdfText(book.subject.toUpperCase())}) Tj ET`);

    currentStreams.push('0 0 0 rg');
    const titleLines = wrapText(chapter.title, 38);
    currentStreams.push(`BT /F2 15 Tf 65 708 Td (${escapePdfText(titleLines[0] || chapter.title)}) Tj ET`);

    let y = 670;

    const rawContent = chapter.content || '';
    const paragraphs = rawContent.split(/\n+/);

    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) continue;

      // Check if we need a new page
      if (y < MARGIN_BOTTOM + 60) {
        pages.push(currentStreams.join('\n'));
        pageNumber++;
        currentStreams = [];
        this.addPageFrame(currentStreams, book, chapter.title, pageNumber);
        y = 720;
      }

      // Check for Heading 2 / 3
      if (trimmed.startsWith('## ') || trimmed.startsWith('### ') || /^\d+\.\s+/.test(trimmed)) {
        y -= 10;
        if (y < MARGIN_BOTTOM + 60) {
          pages.push(currentStreams.join('\n'));
          pageNumber++;
          currentStreams = [];
          this.addPageFrame(currentStreams, book, chapter.title, pageNumber);
          y = 720;
        }

        const headingText = trimmed.replace(/^#+\s*/, '');
        currentStreams.push('0.1 0.2 0.5 rg');
        currentStreams.push(`BT /F2 12 Tf 50 ${y} Td (${escapePdfText(wrapText(headingText, 55)[0] || headingText)}) Tj ET`);
        currentStreams.push(`0.8 0.85 0.9 RG 0.5 w 50 ${y - 4} m 545 ${y - 4} l S`);
        y -= 22;
        continue;
      }

      // Check for Math Formula / Callout Box ($$ or equations)
      if (trimmed.includes('$$') || trimmed.includes('=') && (trimmed.includes('GM') || trimmed.includes('\\frac') || trimmed.includes('^2'))) {
        const cleanFormula = trimmed.replace(/\$\$/g, '').replace(/\\[a-zA-Z]+/g, ' ');
        const wrappedFormula = wrapText(cleanFormula, 50);
        const boxHeight = wrappedFormula.length * 16 + 18;

        if (y - boxHeight < MARGIN_BOTTOM + 40) {
          pages.push(currentStreams.join('\n'));
          pageNumber++;
          currentStreams = [];
          this.addPageFrame(currentStreams, book, chapter.title, pageNumber);
          y = 720;
        }

        // Highlight box
        currentStreams.push(`0.94 0.97 0.94 rg 55 ${y - boxHeight + 8} 485 ${boxHeight} re f`);
        currentStreams.push(`0.3 0.65 0.3 RG 1 w 55 ${y - boxHeight + 8} 485 ${boxHeight} re S`);
        currentStreams.push('0.1 0.45 0.1 rg');

        let formulaY = y;
        for (const fLine of wrappedFormula) {
          currentStreams.push(`BT /F2 10 Tf 70 ${formulaY} Td (${escapePdfText(fLine)}) Tj ET`);
          formulaY -= 16;
        }
        y -= boxHeight + 12;
        continue;
      }

      // Standard Paragraph
      currentStreams.push('0.15 0.18 0.22 rg');
      const lines = wrapText(trimmed, 68);
      for (const line of lines) {
        if (y < MARGIN_BOTTOM + 40) {
          pages.push(currentStreams.join('\n'));
          pageNumber++;
          currentStreams = [];
          this.addPageFrame(currentStreams, book, chapter.title, pageNumber);
          y = 720;
          currentStreams.push('0.15 0.18 0.22 rg');
        }

        const isBullet = line.startsWith('- ') || line.startsWith('* ');
        const font = isBullet ? '/F2' : '/F1';
        const indent = isBullet ? 60 : 50;

        currentStreams.push(`BT ${font} 9.5 Tf ${indent} ${y} Td (${escapePdfText(line)}) Tj ET`);
        y -= 14;
      }
      y -= 8; // Paragraph spacing
    }

    if (currentStreams.length > 0) {
      pages.push(currentStreams.join('\n'));
    }

    return pages;
  }

  /**
   * Adds standard running header, running footer, and borders to a page
   */
  private static addPageFrame(s: string[], book: Book, chapterTitle: string, pageNumber: number): void {
    // Header
    s.push('0.4 0.45 0.55 rg');
    s.push(`BT /F3 8 Tf ${MARGIN_LEFT} 805 Td (${escapePdfText(book.title.slice(0, 48))}) Tj ET`);
    s.push(`BT /F3 8 Tf 380 805 Td (${escapePdfText(chapterTitle.slice(0, 30))}) Tj ET`);
    s.push(`0.85 0.88 0.92 RG 0.5 w ${MARGIN_LEFT} 795 m ${MARGIN_RIGHT} 795 l S`);

    // Footer
    s.push(`0.85 0.88 0.92 RG 0.5 w ${MARGIN_LEFT} 50 m ${MARGIN_RIGHT} 50 l S`);
    s.push('0.4 0.45 0.55 rg');
    s.push(`BT /F1 8 Tf ${MARGIN_LEFT} 38 Td (EduPulse AI Free E-Book Reader • ${escapePdfText(book.board || 'State Board')}) Tj ET`);
    s.push(`BT /F2 8.5 Tf 505 38 Td (Page ${pageNumber}) Tj ET`);
  }

  /**
   * Compiles the PDF-1.4 file with exact xref table and object byte offsets
   */
  private static assemblePdf14(pagesContentStreams: string[], totalPages: number): Uint8Array {
    const chunks: string[] = [];
    const offsets: number[] = [];

    // Header
    const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    chunks.push(header);

    // Object 1: Catalog
    // Object 2: Pages
    // Object 3: Helvetica
    // Object 4: Helvetica-Bold
    // Object 5: Helvetica-Oblique
    // For each page:
    // Page Obj: 6 + 2 * i
    // Content Stream Obj: 7 + 2 * i

    const catalogObjNum = 1;
    const pagesObjNum = 2;
    const fontRegNum = 3;
    const fontBoldNum = 4;
    const fontItalicNum = 5;

    let currentBytePos = header.length;

    function addChunk(content: string) {
      chunks.push(content);
      currentBytePos += content.length;
    }

    function addObj(objNum: number, body: string) {
      offsets[objNum] = currentBytePos;
      addChunk(`${objNum} 0 obj\n${body}\nendobj\n`);
    }

    // 1. Catalog
    addObj(catalogObjNum, `<< /Type /Catalog /Pages ${pagesObjNum} 0 R >>`);

    // Kids references for pages
    const kidsRefs = Array.from({ length: totalPages }, (_, i) => `${6 + i * 2} 0 R`).join(' ');

    // 2. Pages Parent
    addObj(pagesObjNum, `<< /Type /Pages /Kids [ ${kidsRefs} ] /Count ${totalPages} >>`);

    // 3. Regular Font
    addObj(fontRegNum, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`);

    // 4. Bold Font
    addObj(fontBoldNum, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`);

    // 5. Italic Font
    addObj(fontItalicNum, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>`);

    // Pages & Streams
    for (let i = 0; i < totalPages; i++) {
      const pageObjNum = 6 + i * 2;
      const streamObjNum = 7 + i * 2;
      const streamContent = pagesContentStreams[i];

      // Page Object
      addObj(pageObjNum, `<< /Type /Page /Parent ${pagesObjNum} 0 R /MediaBox [ 0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT} ] /Contents ${streamObjNum} 0 R /Resources << /Font << /F1 ${fontRegNum} 0 R /F2 ${fontBoldNum} 0 R /F3 ${fontItalicNum} 0 R >> >> >>`);

      // Content Stream
      const streamBody = `<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`;
      addObj(streamObjNum, streamBody);
    }

    // XREF Table
    const startXrefPos = currentBytePos;
    const totalObjects = 5 + totalPages * 2;

    let xref = `xref\n0 ${totalObjects + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= totalObjects; i++) {
      const off = (offsets[i] || 0).toString().padStart(10, '0');
      xref += `${off} 00000 n \n`;
    }

    xref += `trailer\n<< /Size ${totalObjects + 1} /Root ${catalogObjNum} 0 R >>\nstartxref\n${startXrefPos}\n%%EOF\n`;
    chunks.push(xref);

    // Convert string chunks to Uint8Array (binary encoding)
    const totalString = chunks.join('');
    const bytes = new Uint8Array(totalString.length);
    for (let i = 0; i < totalString.length; i++) {
      bytes[i] = totalString.charCodeAt(i) & 0xff;
    }

    return bytes;
  }
}
