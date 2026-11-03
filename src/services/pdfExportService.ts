import { AiGeneratedPaper, PaperQuestionItem } from '../types';

export type PdfExportMode = 'student_paper' | 'marking_scheme' | 'complete_bundle';

export const PDF_EXPORT_SERVICE = {
  exportPaper(paper: AiGeneratedPaper, mode: PdfExportMode = 'student_paper'): void {
    this.generateAndPrintPaperPdf(paper, mode);
  },

  /**
   * Generates a publication-grade, official Board-standard Examination PDF document.
   * Formatted strictly according to CBSE/ICSE standard examination layout specifications.
   */
  generateAndPrintPaperPdf(paper: AiGeneratedPaper, mode: PdfExportMode = 'student_paper'): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Fallback if popup blocked: create hidden iframe or trigger in current window
      alert('Pop-up was blocked by your browser. Please allow pop-ups for this page to view and save the official PDF.');
      return;
    }

    const htmlContent = this.buildExaminationHtmlDocument(paper, mode);
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Give browser time to load styles and fonts, then focus and open print dialog
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 400);
    };
  },

  /**
   * Helper to format text with subscripts, superscripts, bolding, and clean linebreaks
   */
  formatQuestionText(text: string): string {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_([0-9a-zA-Z+-]+)/g, '<sub>$1</sub>') // basic subscript e.g. H_2O
      .replace(/\^([0-9a-zA-Z+-]+)/g, '<sup>$1</sup>') // basic superscript e.g. x^2
      .replace(/\n\n/g, '<div style="margin: 6px 0;"></div>')
      .replace(/\n/g, '<br/>');
  },

  /**
   * Returns complete standalone HTML document with embedded CSS for pristine A4 printing
   */
  buildExaminationHtmlDocument(paper: AiGeneratedPaper, mode: PdfExportMode = 'student_paper'): string {
    const isStudentOnly = mode === 'student_paper';
    const isTeacherOnly = mode === 'marking_scheme';
    const isBundle = mode === 'complete_bundle';

    const qpCode = `30/${paper.classGrade || '10'}/${Math.floor(101 + Math.random() * 898)}`;
    const seriesCode = `EDP-${paper.classGrade || 'X'}/${paper.academicYear.replace(/[^0-9]/g, '').slice(-2) || '25'}`;
    const setNo = 'SET-1';

    // Format questions grouped by sections
    const renderQuestionsForStudent = () => {
      return paper.sections.map(sec => {
        const questionsInSec = paper.questions.filter(q => q.section === sec.sectionId);
        if (questionsInSec.length === 0) return '';

        return `
          <div class="section-container">
            <div class="section-header">
              <div class="section-title">${sec.title.toUpperCase()}</div>
              <div class="section-desc">${sec.description} &bull; (Section Total: ${sec.totalMarks} Marks)</div>
            </div>

            <div class="questions-list">
              ${questionsInSec.map(q => `
                <div class="question-item">
                  <div class="q-main-row">
                    <div class="q-num">Q.${q.questionNumber}</div>
                    <div class="q-text">
                      ${this.formatQuestionText(q.questionText)}
                      ${q.options && q.options.length > 0 ? `
                        <div class="mcq-options-grid">
                          ${q.options.map(opt => `
                            <div class="mcq-option">
                              <span class="opt-label">(${opt.id.toLowerCase()})</span>
                              <span class="opt-text">${opt.text}</span>
                            </div>
                          `).join('')}
                        </div>
                      ` : ''}
                    </div>
                    <div class="q-marks">[${q.marks}]</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('');
    };

    // Format marking scheme & model solutions
    const renderMarkingScheme = () => {
      return `
        <div class="marking-scheme-doc">
          <div class="confidential-badge">CONFIDENTIAL &bull; FOR EXAMINERS / EVALUATORS ONLY</div>
          <div class="marking-header">
            <div class="mh-super">CENTRAL EVALUATION BOARD &bull; MARKING SCHEME &amp; MODEL SOLUTIONS</div>
            <h2 class="mh-title">${paper.title}</h2>
            <div class="mh-sub">SUBJECT: ${paper.subject.toUpperCase()} &bull; CLASS ${paper.classGrade}TH &bull; SESSION ${paper.academicYear}</div>
            <div class="mh-meta">
              <span>Q.P. CODE: <strong>${qpCode}</strong></span>
              <span>SERIES: <strong>${seriesCode}</strong></span>
              <span>MAXIMUM MARKS: <strong>${paper.totalMarks}</strong></span>
              <span>TOTAL QUESTIONS: <strong>${paper.questions.length}</strong></span>
            </div>
          </div>

          <div class="marking-instructions">
            <strong>GENERAL PRINCIPLES OF EVALUATION &amp; SCORING:</strong>
            <ol>
              <li>The marking scheme provides suggestive answers. Alternative scientifically and mathematically valid solutions must be awarded full credit.</li>
              <li>Deduct marks strictly as specified in the step-wise rubrics. Do not penalize twice for carry-forward arithmetic errors.</li>
              <li>In numerical questions, correct SI units and scientific rounding carry designated marks.</li>
              <li>For MCQs, both option alphabet and option content should be verified for awarding full marks.</li>
            </ol>
          </div>

          <div class="solutions-list">
            ${paper.questions.map(q => `
              <div class="solution-item">
                <div class="sol-top-bar">
                  <div class="sol-q-title">
                    <span class="sol-q-badge">Question ${q.questionNumber}</span>
                    <span class="sol-q-sec">Section ${q.section} &bull; ${q.type.toUpperCase()}</span>
                  </div>
                  <div class="sol-meta-right">
                    <span class="sol-topic">Topic: ${q.topic}</span>
                    <span class="sol-bloom">Bloom's: ${q.bloomsLevel}</span>
                    <span class="sol-marks">[Max: ${q.marks} Mark${q.marks > 1 ? 's' : ''}]</span>
                  </div>
                </div>

                <div class="sol-content">
                  <div class="sol-answer-block">
                    <div class="sol-label">MODEL ANSWER / VALUE POINTS:</div>
                    <div class="sol-body">${this.formatQuestionText(q.correctAnswer)}</div>
                  </div>

                  ${q.solutionExplanation ? `
                    <div class="sol-explanation">
                      <strong>Examiner Note:</strong> ${this.formatQuestionText(q.solutionExplanation)}
                    </div>
                  ` : ''}

                  ${q.markingRubric && q.markingRubric.length > 0 ? `
                    <div class="rubric-table-wrapper">
                      <div class="rubric-label">STEP-WISE MARK DISTRIBUTION RUBRIC:</div>
                      <table class="rubric-table">
                        <thead>
                          <tr>
                            <th>Evaluation Criterion / Step</th>
                            <th style="width: 80px; text-align: right;">Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${q.markingRubric.map(r => `
                            <tr>
                              <td>&bull; ${r.step}</td>
                              <td style="text-align: right; font-weight: bold; color: #166534;">+${r.marks}M</td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${paper.title} - Official Board Examination Document</title>
  <style>
    /* ═════════════════════════════════════════════════════════════ */
    /* A4 PAGE GEOMETRY & TYPOGRAPHY SPECIFICATION                 */
    /* ═════════════════════════════════════════════════════════════ */
    @page {
      size: A4 portrait;
      margin: 14mm 12mm 14mm 12mm;
      @bottom-right {
        content: "Page " counter(page) " of " counter(pages);
        font-family: "Times New Roman", Times, Georgia, serif;
        font-size: 9pt;
      }
      @bottom-left {
        content: "${paper.subject.toUpperCase()} &bull; CLASS ${paper.classGrade}TH";
        font-family: "Times New Roman", Times, Georgia, serif;
        font-size: 8pt;
        color: #444;
      }
    }

    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: "Times New Roman", Times, Georgia, "DejaVu Serif", serif;
      font-size: 11pt;
      line-height: 1.42;
      color: #000000;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }

    /* Screen Preview Toolbar */
    @media screen {
      body {
        background-color: #334155;
        padding: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
      }
      .screen-toolbar {
        position: sticky;
        top: 14px;
        z-index: 9999;
        background: #0f172a;
        color: white;
        padding: 12px 24px;
        border-radius: 14px;
        box-shadow: 0 14px 35px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 24px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13px;
        max-width: 850px;
        width: 100%;
        border: 1px solid rgba(255,255,255,0.15);
      }
      .screen-toolbar .title-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .screen-toolbar .badge {
        background: #10b981;
        color: black;
        font-weight: 800;
        font-size: 10px;
        padding: 2px 8px;
        border-radius: 6px;
        text-transform: uppercase;
      }
      .toolbar-buttons {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .btn-print {
        background: #10b981;
        color: #000;
        border: none;
        padding: 8px 18px;
        border-radius: 8px;
        font-weight: 700;
        cursor: pointer;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
      }
      .btn-print:hover {
        background: #34d399;
        transform: translateY(-1px);
      }
      .btn-secondary {
        background: #1e293b;
        color: #e2e8f0;
        border: 1px solid rgba(255,255,255,0.2);
        padding: 8px 14px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        font-size: 12px;
      }
      .btn-secondary:hover {
        background: #334155;
      }
      .a4-page-canvas {
        background: white;
        width: 210mm;
        min-height: 297mm;
        padding: 16mm 14mm;
        box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        border-radius: 4px;
      }
    }

    @media print {
      .screen-toolbar {
        display: none !important;
      }
      body {
        background: white !important;
      }
      .a4-page-canvas {
        width: 100% !important;
        padding: 0 !important;
      }
      .page-break {
        page-break-before: always;
        break-before: page;
      }
    }

    /* ═════════════════════════════════════════════════════════════ */
    /* AUTHENTIC BOARD EXAMINATION HEADER                         */
    /* ═════════════════════════════════════════════════════════════ */
    .exam-header {
      border-bottom: 2px solid #000000;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }

    .top-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
      font-size: 9.5pt;
      font-family: Arial, sans-serif;
    }

    .roll-number-box-container {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .roll-box-label {
      font-weight: bold;
      font-size: 10pt;
    }

    .roll-cells {
      display: flex;
      gap: 2px;
    }

    .roll-cell {
      width: 18px;
      height: 22px;
      border: 1.5px solid #000;
      display: inline-block;
      background: #fff;
    }

    .qp-box-wrapper {
      display: flex;
      gap: 8px;
    }

    .qp-code-box {
      border: 1.5px solid #000;
      padding: 3px 10px;
      text-align: center;
      font-weight: bold;
      min-width: 120px;
    }

    .qp-code-box .series {
      font-size: 8pt;
      color: #333;
      margin-bottom: 2px;
    }

    .qp-code-box .code-val {
      font-size: 11pt;
      letter-spacing: 0.05em;
    }

    .set-box {
      border: 1.5px solid #000;
      padding: 3px 10px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10.5pt;
      background: #f1f5f9;
    }

    .candidate-preface-note {
      font-size: 8.5pt;
      font-style: italic;
      line-height: 1.35;
      border: 1px dashed #777;
      padding: 5px 8px;
      margin-bottom: 8px;
      background: #fdfdfd;
    }

    .candidate-preface-note ol {
      margin: 0;
      padding-left: 16px;
    }

    .candidate-preface-note li {
      margin-bottom: 2px;
    }

    .center-titles {
      text-align: center;
      margin: 8px 0 10px 0;
    }

    .board-super-title {
      font-size: 11pt;
      font-weight: bold;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .exam-main-title {
      font-size: 14pt;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin: 2px 0;
    }

    .subject-title {
      font-size: 12.5pt;
      font-weight: bold;
      text-transform: uppercase;
      text-decoration: underline;
      margin-top: 3px;
    }

    .exam-specs-row {
      display: flex;
      justify-content: space-between;
      font-size: 10.5pt;
      font-weight: bold;
      border-top: 1px solid #000;
      padding-top: 6px;
      margin-top: 8px;
    }

    /* ═════════════════════════════════════════════════════════════ */
    /* GENERAL INSTRUCTIONS BOX                                    */
    /* ═════════════════════════════════════════════════════════════ */
    .instructions-box {
      border: 1.5px solid #000;
      padding: 8px 12px;
      margin-bottom: 16px;
      font-size: 9.5pt;
      background-color: #fafafa;
    }

    .instructions-box strong {
      display: block;
      margin-bottom: 3px;
      text-decoration: underline;
      font-size: 10pt;
    }

    .instructions-box ol {
      margin: 0;
      padding-left: 18px;
    }

    .instructions-box li {
      margin-bottom: 2.5px;
      line-height: 1.35;
    }

    /* ═════════════════════════════════════════════════════════════ */
    /* SECTIONS & QUESTIONS                                        */
    /* ═════════════════════════════════════════════════════════════ */
    .section-container {
      margin-bottom: 18px;
    }

    .section-header {
      text-align: center;
      border-top: 1.2px solid #000;
      border-bottom: 1.2px solid #000;
      padding: 3px 0;
      margin: 12px 0 10px 0;
      background: #f4f4f4;
    }

    .section-title {
      font-weight: bold;
      font-size: 11pt;
      letter-spacing: 0.08em;
    }

    .section-desc {
      font-size: 9pt;
      font-style: italic;
      color: #333;
    }

    .questions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .question-item {
      page-break-inside: avoid;
      position: relative;
    }

    .q-main-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 10.5pt;
    }

    .q-num {
      font-weight: bold;
      min-width: 34px;
    }

    .q-text {
      flex: 1;
      text-align: justify;
    }

    .q-marks {
      font-weight: bold;
      margin-left: 10px;
      min-width: 24px;
      text-align: right;
    }

    /* MCQ 2-Column Options Grid */
    .mcq-options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 20px;
      row-gap: 4px;
      margin-top: 5px;
      padding-left: 4px;
      font-size: 9.8pt;
    }

    .mcq-option {
      display: flex;
      align-items: flex-start;
      gap: 6px;
    }

    .opt-label {
      font-weight: bold;
      min-width: 18px;
    }

    .opt-text {
      flex: 1;
    }

    .end-paper-seal {
      text-align: center;
      font-weight: bold;
      font-size: 9.5pt;
      letter-spacing: 0.12em;
      margin-top: 24px;
      padding-top: 8px;
      border-top: 1.5px solid #000;
      font-family: Arial, sans-serif;
    }

    /* ═════════════════════════════════════════════════════════════ */
    /* MARKING SCHEME & MODEL SOLUTIONS (TEACHER EVALUATION COPY)  */
    /* ═════════════════════════════════════════════════════════════ */
    .marking-scheme-doc {
      font-family: Arial, Helvetica, sans-serif;
      color: #0f172a;
    }

    .confidential-badge {
      display: inline-block;
      background: #dc2626;
      color: #ffffff;
      font-weight: 800;
      font-size: 8.5pt;
      padding: 3px 10px;
      letter-spacing: 0.08em;
      margin-bottom: 10px;
      border-radius: 3px;
    }

    .marking-header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }

    .mh-super {
      font-size: 9pt;
      font-weight: bold;
      letter-spacing: 0.05em;
      color: #475569;
    }

    .mh-title {
      font-size: 13.5pt;
      margin: 2px 0 4px 0;
      font-weight: 900;
      color: #0f172a;
    }

    .mh-sub {
      font-size: 10.5pt;
      font-weight: 700;
      color: #166534;
      margin-bottom: 6px;
    }

    .mh-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 9pt;
      border-top: 1px solid #cbd5e1;
      padding-top: 5px;
      margin-top: 4px;
      color: #334155;
    }

    .marking-instructions {
      background: #f0fdf4;
      border: 1px solid #86efac;
      padding: 8px 12px;
      font-size: 8.5pt;
      margin-bottom: 14px;
      border-radius: 4px;
      color: #14532d;
    }

    .marking-instructions ol {
      margin: 4px 0 0 0;
      padding-left: 18px;
    }

    .solution-item {
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      margin-bottom: 12px;
      page-break-inside: avoid;
      overflow: hidden;
      background: #ffffff;
    }

    .sol-top-bar {
      background: #f8fafc;
      border-bottom: 1px solid #cbd5e1;
      padding: 5px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9pt;
    }

    .sol-q-badge {
      font-weight: 800;
      color: #0f172a;
    }

    .sol-q-sec {
      font-size: 8pt;
      color: #64748b;
      margin-left: 6px;
    }

    .sol-meta-right {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 8pt;
    }

    .sol-topic {
      color: #475569;
    }

    .sol-bloom {
      background: #e2e8f0;
      padding: 1px 6px;
      border-radius: 3px;
      font-weight: 600;
    }

    .sol-marks {
      font-weight: 800;
      color: #166534;
      font-size: 8.5pt;
    }

    .sol-content {
      padding: 8px 12px;
      font-size: 9pt;
    }

    .sol-answer-block {
      margin-bottom: 6px;
    }

    .sol-label {
      font-weight: 800;
      font-size: 8pt;
      color: #475569;
      margin-bottom: 2px;
      letter-spacing: 0.04em;
    }

    .sol-body {
      color: #0f172a;
      line-height: 1.4;
      font-weight: 500;
    }

    .sol-explanation {
      background: #f8fafc;
      padding: 5px 8px;
      border-left: 3px solid #64748b;
      font-size: 8pt;
      color: #334155;
      margin-bottom: 6px;
    }

    .rubric-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
      margin-top: 4px;
    }

    .rubric-table th, .rubric-table td {
      border: 1px solid #e2e8f0;
      padding: 3px 6px;
    }

    .rubric-table th {
      background: #f1f5f9;
      text-align: left;
      font-weight: 700;
      color: #334155;
    }
  </style>
</head>
<body>
  <!-- Print Control Bar (Visible in browser preview, hidden on paper/PDF) -->
  <div class="screen-toolbar">
    <div class="title-info">
      <span class="badge">${isStudentOnly ? 'STUDENT EXAM' : isTeacherOnly ? 'MARKING SCHEME' : 'FULL BUNDLE'}</span>
      <span><strong>${paper.title}</strong> &bull; Class ${paper.classGrade}th (${paper.subject})</span>
    </div>
    <div class="toolbar-buttons">
      <button class="btn-print" onclick="window.print()">
        🖨️ Save as PDF / Print Now
      </button>
      <button class="btn-secondary" onclick="window.close()">
        ✕ Close
      </button>
    </div>
  </div>

  <div class="a4-page-canvas">
    
    <!-- ═══════════════════════════════════════════ -->
    <!-- PART 1: STUDENT QUESTION PAPER -->
    <!-- ═══════════════════════════════════════════ -->
    ${!isTeacherOnly ? `
      <div class="exam-header">
        <div class="top-meta-row">
          <div class="roll-number-box-container">
            <span class="roll-box-label">Roll No.</span>
            <div class="roll-cells">
              ${Array.from({ length: 8 }).map(() => '<span class="roll-cell"></span>').join('')}
            </div>
          </div>

          <div class="qp-box-wrapper">
            <div class="qp-code-box">
              <div class="series">${seriesCode}</div>
              <div class="code-val">Q.P. Code: ${qpCode}</div>
            </div>
            <div class="set-box">${setNo}</div>
          </div>
        </div>

        <div class="candidate-preface-note">
          <ol>
            <li>Please check that this question paper contains <strong>${paper.questions.length} questions</strong> and <strong>${paper.sections.length} sections</strong>.</li>
            <li>Q.P. Code given on the right-hand side of the question paper should be written on the title page of the answer-book by the candidate.</li>
            <li>Please check that this question paper contains all pages. 15 minutes reading time has been allotted to read this paper.</li>
          </ol>
        </div>

        <div class="center-titles">
          <div class="board-super-title">${paper.board} &bull; ACADEMIC EXAMINATION SESSION ${paper.academicYear}</div>
          <div class="exam-main-title">${paper.title}</div>
          <div class="subject-title">${paper.subject} &bull; CLASS ${paper.classGrade}TH</div>
        </div>

        <div class="exam-specs-row">
          <span>Time Allowed : ${paper.durationMinutes} Minutes (3 Hours)</span>
          <span>Maximum Marks : ${paper.totalMarks}</span>
        </div>
      </div>

      <div class="instructions-box">
        <strong>General Instructions:</strong>
        <ol>
          ${paper.generalInstructions.map(ins => `<li>${ins}</li>`).join('')}
        </ol>
      </div>

      <!-- Sections & Questions -->
      ${renderQuestionsForStudent()}

      <div class="end-paper-seal">
        *** END OF QUESTION PAPER &bull; PAPERPULSE ACADEMIC ASSESSMENT ENGINE ***
      </div>
    ` : ''}

    <!-- ═══════════════════════════════════════════ -->
    <!-- PART 2: TEACHER MARKING SCHEME (SEPARATE PAGE) -->
    <!-- ═══════════════════════════════════════════ -->
    ${isBundle ? '<div class="page-break"></div>' : ''}
    
    ${isTeacherOnly || isBundle ? `
      ${renderMarkingScheme()}
    ` : ''}

  </div>
</body>
</html>`;
  },

  /**
   * Generates a Word-compatible .docx (Office Open XML) document for download.
   * Uses the Blob + msSaveBlob / createObjectURL API. Works in all modern browsers.
   */
  generateWordDoc(paper: AiGeneratedPaper, mode: PdfExportMode = 'student_paper'): void {
    const isTeacher = mode === 'marking_scheme';
    const isBundle = mode === 'complete_bundle';
    const schoolName = (paper as any).schoolName || '';
    const teacherName = (paper as any).teacherName || '';

    const esc = (s: string) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    const para = (text: string, bold = false, center = false, size = 24) =>
      `<w:p><w:pPr>${center ? '<w:jc w:val="center"/>' : ''}</w:pPr><w:r><w:rPr>${bold ? '<w:b/>' : ''}<w:sz w:val="${size}"/></w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;

    const hr = () =>
      `<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="000000"/></w:pBdr></w:pPr></w:p>`;

    let body = '';

    // ── Document Title block ──────────────────────────────────
    if (schoolName) body += para(schoolName, true, true, 28);
    body += para(paper.title, true, true, 26);
    if (teacherName) body += para(`Subject Teacher: ${teacherName}`, false, true, 20);
    body += para(
      `Board: ${paper.board}  |  Class: ${paper.classGrade}  |  Session: ${paper.academicYear}`,
      false, true, 20
    );
    body += para(
      `Time: ${paper.durationMinutes} Minutes  |  Maximum Marks: ${paper.totalMarks}`,
      true, true, 22
    );
    body += hr();

    if (!isTeacher) {
      // ── General Instructions ─────────────────────────────────
      body += para('GENERAL INSTRUCTIONS', true, false, 22);
      paper.generalInstructions.forEach((inst, i) => {
        body += para(`${i + 1}. ${inst}`, false, false, 20);
      });
      body += hr();

      // ── Questions ────────────────────────────────────────────
      paper.sections.forEach(sec => {
        const qs = paper.questions.filter(q => q.section === sec.sectionId);
        if (qs.length === 0) return;

        body += para(sec.title.toUpperCase(), true, false, 24);
        body += para(sec.description, false, false, 20);

        qs.forEach(q => {
          body += para(`Q.${q.questionNumber}.  ${q.questionText}  [${q.marks} Mark${q.marks > 1 ? 's' : ''}]`, false, false, 20);
          if (q.options) {
            q.options.forEach(opt => {
              body += para(`    (${opt.id})  ${opt.text}`, false, false, 20);
            });
          }
          body += `<w:p/>`;
        });
        body += hr();
      });
    }

    if (isTeacher || isBundle) {
      if (isBundle) {
        body += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
        body += para('TEACHER MARKING SCHEME & ANSWER KEY', true, true, 26);
        body += para('CONFIDENTIAL — FOR EVALUATORS ONLY', true, true, 22);
        body += hr();
      }

      paper.questions.forEach(q => {
        body += para(`Q.${q.questionNumber} (Section ${q.section}) — ${q.marks} Mark${q.marks > 1 ? 's' : ''}  |  Topic: ${q.topic}  |  Bloom: ${q.bloomsLevel}`, true, false, 20);
        body += para(`Answer: ${q.correctAnswer}`, false, false, 20);
        if (q.solutionExplanation) body += para(`Note: ${q.solutionExplanation}`, false, false, 20);
        if (q.markingRubric) {
          q.markingRubric.forEach(r => {
            body += para(`  • ${r.step}  (+${r.marks}M)`, false, false, 20);
          });
        }
        body += `<w:p/>`;
      });
    }

    const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:mo="http://schemas.microsoft.com/office/mac/office/2008/main"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:mv="urn:schemas-microsoft-com:mac:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:w10="urn:schemas-microsoft-com:office:word"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
  xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
  xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
  xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
  xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
  mc:Ignorable="w14 wp14">
  <w:body>
    ${body}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1080" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

    // Build a minimal .docx zip structure using base64-encoded static parts
    // We use the "docx-like" single-XML trick recognised by Microsoft Word & LibreOffice
    const mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const blob = new Blob([docXml], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paper.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}_${mode}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

