import { 
  Document, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  AlignmentType, 
  HeadingLevel, 
  BorderStyle, 
  Packer 
} from 'docx';
import { SavedPaper, PaperSection, PaperQuestion } from '../types';
import { FILE_SYSTEM_SERVICE } from './fileSystemService';

export class PaperExportService {
  /**
   * Export Question Paper as an editable Microsoft Word document (.docx)
   */
  async exportPaperDocx(paper: SavedPaper): Promise<Blob> {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 }
            }
          },
          children: [
            // Header table with Roll No box
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 70, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: paper.schoolName.toUpperCase(),
                              bold: true,
                              size: 32,
                              font: 'Calibri'
                            })
                          ]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: `${paper.examName} (${paper.board})`,
                              bold: true,
                              size: 26,
                              font: 'Calibri'
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 30, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: 'CANDIDATE ROLL NO.',
                              size: 18,
                              bold: true,
                              font: 'Calibri'
                            })
                          ]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: '[   ][   ][   ][   ][   ][   ][   ]',
                              size: 20,
                              font: 'Courier New'
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            new Paragraph({ text: '', spacing: { before: 150 } }),

            // Metadata row: Class, Subject, Time, Max Marks
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: 'CLASS: ', bold: true, size: 22 }),
                            new TextRun({ text: String(paper.grade), size: 22 })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: 'SUBJECT: ', bold: true, size: 22 }),
                            new TextRun({ text: paper.subject, size: 22 })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [
                            new TextRun({ text: 'TIME: ', bold: true, size: 22 }),
                            new TextRun({ text: `${Math.round(paper.durationMinutes / 60)} Hours`, size: 22 })
                          ]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [
                            new TextRun({ text: 'MAX MARKS: ', bold: true, size: 22 }),
                            new TextRun({ text: String(paper.totalMarks), bold: true, size: 22 })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            new Paragraph({ text: '', spacing: { before: 200 } }),

            // General Instructions
            new Paragraph({
              heading: HeadingLevel.HEADING_3,
              children: [
                new TextRun({ text: 'GENERAL INSTRUCTIONS:', bold: true, size: 22, underline: {} })
              ]
            }),
            ...paper.generalInstructions.map(
              (inst, i) =>
                new Paragraph({
                  spacing: { before: 60, after: 60 },
                  children: [
                    new TextRun({ text: `${i + 1}. `, bold: true, size: 20 }),
                    new TextRun({ text: inst, size: 20 })
                  ]
                })
            ),

            new Paragraph({ text: '', spacing: { before: 200 } }),

            // Sections & Questions
            ...this.buildDocxSections(paper.sections)
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${sanitizeFileName(paper.title)}_Question_Paper.docx`;
    await FILE_SYSTEM_SERVICE.saveExportFile(fileName, blob);
    return blob;
  }

  /**
   * Export Answer Key & Marking Scheme as Word document (.docx)
   */
  async exportAnswerKeyDocx(paper: SavedPaper): Promise<Blob> {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } }
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${paper.schoolName.toUpperCase()} — MODEL ANSWER KEY & MARKING SCHEME`,
                  bold: true,
                  size: 28,
                  font: 'Calibri'
                })
              ]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${paper.examName} | Class ${paper.grade} ${paper.subject} | Max Marks: ${paper.totalMarks}`,
                  size: 22,
                  font: 'Calibri'
                })
              ]
            }),
            new Paragraph({ text: '', spacing: { before: 200 } }),

            ...paper.sections.flatMap((sec) => [
              new Paragraph({
                spacing: { before: 200, after: 100 },
                children: [
                  new TextRun({ text: `${sec.name}: ${sec.title}`, bold: true, size: 24, underline: {} })
                ]
              }),
              ...sec.questions.flatMap((q) => [
                new Paragraph({
                  spacing: { before: 100 },
                  children: [
                    new TextRun({ text: `Q.${q.questionNumber} [${q.marks} Mark${q.marks > 1 ? 's' : ''}]: `, bold: true, size: 20 }),
                    new TextRun({ text: q.text, size: 20 })
                  ]
                }),
                new Paragraph({
                  spacing: { before: 60, after: 100 },
                  children: [
                    new TextRun({ text: 'Model Answer: ', bold: true, color: '166534', size: 20 }),
                    new TextRun({ text: q.answer || 'Refer to textbook rubric.', size: 20 }),
                    ...(q.explanation ? [
                      new TextRun({ text: `\nExplanation: ${q.explanation}`, italics: true, size: 18, color: '4B5563' })
                    ] : [])
                  ]
                })
              ])
            ])
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${sanitizeFileName(paper.title)}_Answer_Key.docx`;
    await FILE_SYSTEM_SERVICE.saveExportFile(fileName, blob);
    return blob;
  }

  private buildDocxSections(sections: PaperSection[]): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    for (const sec of sections) {
      // Section header divider
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 250, after: 100 },
          children: [
            new TextRun({
              text: `${sec.name.toUpperCase()} — ${sec.title.toUpperCase()}`,
              bold: true,
              size: 22,
              font: 'Calibri'
            }),
            new TextRun({
              text: ` (${sec.questions.length} Questions × ${sec.marksPerQuestion} Mark${sec.marksPerQuestion > 1 ? 's' : ''} = ${sec.totalMarks} Marks)`,
              italics: true,
              size: 18
            })
          ]
        })
      );

      if (sec.instructions) {
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({ text: sec.instructions, italics: true, size: 18, color: '4B5563' })
            ]
          })
        );
      }

      // Questions in this section
      for (const q of sec.questions) {
        paragraphs.push(
          new Paragraph({
            spacing: { before: 120, after: 60 },
            children: [
              new TextRun({ text: `Q.${q.questionNumber}. `, bold: true, size: 20 }),
              new TextRun({ text: q.text, size: 20 }),
              new TextRun({ text: `   [${q.marks}]`, bold: true, size: 20 })
            ]
          })
        );

        // Options for MCQs
        if (q.type === 'mcq' && q.options && q.options.length > 0) {
          const optTexts = q.options.map((opt, i) => `(${String.fromCharCode(97 + i)}) ${opt.text}`).join('       ');
          paragraphs.push(
            new Paragraph({
              indent: { left: 400 },
              spacing: { before: 40, after: 80 },
              children: [
                new TextRun({ text: optTexts, size: 20 })
              ]
            })
          );
        }
      }
    }

    return paragraphs;
  }

  /**
   * Export Question Paper as print-ready Vector HTML/PDF with Devanagari font support
   */
  async exportPaperPdf(paper: SavedPaper, isAnswerKey = false): Promise<void> {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to view and print the examination PDF.');
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${paper.title} ${isAnswerKey ? '— Model Answer Key' : ''}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 18mm 15mm 18mm 15mm;
      @bottom-right {
        content: counter(page) " of " counter(pages);
      }
    }
    body {
      font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', -apple-system, sans-serif;
      font-size: 13px;
      line-height: 1.5;
      color: #111827;
      margin: 0;
      padding: 0;
    }
    .header-box {
      border-bottom: 2px solid #111827;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .school-title {
      font-size: 20px;
      font-weight: 800;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 4px 0;
    }
    .exam-title {
      font-size: 15px;
      font-weight: 700;
      text-align: center;
      margin: 0 0 12px 0;
      color: #374151;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }
    .meta-table td {
      padding: 4px 0;
      font-size: 12px;
    }
    .roll-box {
      border: 1.5px solid #111827;
      padding: 6px 12px;
      text-align: center;
      font-weight: 700;
      display: inline-block;
      float: right;
    }
    .instructions-box {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 10px 14px;
      margin-bottom: 18px;
      font-size: 11.5px;
    }
    .instructions-box h4 {
      margin: 0 0 6px 0;
      font-size: 12px;
      text-transform: uppercase;
    }
    .instructions-box ol {
      margin: 0;
      padding-left: 18px;
    }
    .section-header {
      text-align: center;
      background: #f3f4f6;
      border-top: 1.5px solid #111827;
      border-bottom: 1.5px solid #111827;
      padding: 6px 0;
      margin: 20px 0 14px 0;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.5px;
    }
    .question-row {
      margin-bottom: 14px;
      page-break-inside: avoid;
    }
    .q-num {
      font-weight: 700;
      display: inline;
    }
    .q-text {
      display: inline;
    }
    .q-marks {
      float: right;
      font-weight: 700;
    }
    .mcq-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 20px;
      margin: 8px 0 0 24px;
      font-size: 12px;
    }
    .answer-box {
      margin: 6px 0 10px 24px;
      padding: 6px 10px;
      background: #ecfdf5;
      border-left: 3px solid #10b981;
      font-size: 12px;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="padding: 12px; background: #4338ca; color: white; text-align: center; font-weight: bold; margin-bottom: 16px;">
    <span>Click "Print / Save PDF" to generate print-ready examination paper.</span>
    <button onclick="window.print()" style="margin-left: 16px; padding: 6px 16px; font-weight: bold; cursor: pointer; border-radius: 6px; border: none; background: white; color: #4338ca;">Print / Save PDF</button>
  </div>

  <div class="header-box">
    <div class="roll-box">
      CANDIDATE ROLL NO.<br>
      <span style="font-family: monospace; font-size: 14px;">[ &nbsp; ][ &nbsp; ][ &nbsp; ][ &nbsp; ][ &nbsp; ][ &nbsp; ]</span>
    </div>
    <div class="school-title">${paper.schoolName}</div>
    <div class="exam-title">${paper.examName} (${paper.board}) ${isAnswerKey ? '— MODEL ANSWER KEY' : ''}</div>
    
    <table class="meta-table">
      <tr>
        <td><strong>CLASS:</strong> ${paper.grade}</td>
        <td><strong>SUBJECT:</strong> ${paper.subject}</td>
        <td style="text-align: right;"><strong>TIME:</strong> ${Math.round(paper.durationMinutes / 60)} Hours</td>
        <td style="text-align: right;"><strong>MAX MARKS:</strong> ${paper.totalMarks}</td>
      </tr>
    </table>
  </div>

  ${!isAnswerKey ? `
  <div class="instructions-box">
    <h4>General Instructions:</h4>
    <ol>
      ${paper.generalInstructions.map(i => `<li>${i}</li>`).join('')}
    </ol>
  </div>
  ` : ''}

  ${paper.sections.map(sec => `
    <div class="section-header">
      ${sec.name.toUpperCase()} — ${sec.title.toUpperCase()}
      <span style="font-weight: normal; font-size: 11px;">(${sec.questions.length} Questions × ${sec.marksPerQuestion}M = ${sec.totalMarks} Marks)</span>
    </div>

    ${sec.questions.map(q => `
      <div class="question-row">
        <span class="q-marks">[${q.marks}]</span>
        <span class="q-num">Q.${q.questionNumber}.</span>
        <span class="q-text">${escapeHtml(q.text)}</span>

        ${q.type === 'mcq' && q.options ? `
          <div class="mcq-options">
            ${q.options.map((opt, oIdx) => `
              <div><strong>(${String.fromCharCode(97 + oIdx)})</strong> ${escapeHtml(opt.text)}</div>
            `).join('')}
          </div>
        ` : ''}

        ${isAnswerKey ? `
          <div class="answer-box">
            <strong>Model Answer:</strong> ${escapeHtml(q.answer || 'Refer to syllabus rubric.')}
            ${q.explanation ? `<div style="color: #4b5563; margin-top: 2px;"><em>${escapeHtml(q.explanation)}</em></div>` : ''}
          </div>
        ` : ''}
      </div>
    `).join('')}
  `).join('')}

</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  /**
   * Export paper as JSON file (re-importable)
   */
  async exportPaperJson(paper: SavedPaper): Promise<Blob> {
    const jsonStr = JSON.stringify(paper, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const fileName = `${sanitizeFileName(paper.title)}.json`;
    await FILE_SYSTEM_SERVICE.saveExportFile(fileName, blob);
    return blob;
  }
}

export const PAPER_EXPORT_SERVICE = new PaperExportService();

export const exportQuestionPaperDocx = (paper: SavedPaper) => PAPER_EXPORT_SERVICE.exportPaperDocx(paper);
export const exportAnswerKeyDocx = (paper: SavedPaper) => PAPER_EXPORT_SERVICE.exportAnswerKeyDocx(paper);
export const exportPrintReadyPdf = (paper: SavedPaper, type: 'qp' | 'ak' = 'qp') => PAPER_EXPORT_SERVICE.exportPaperPdf(paper, type === 'ak');
export const exportPaperJson = (paper: SavedPaper) => PAPER_EXPORT_SERVICE.exportPaperJson(paper);

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_').slice(0, 50);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
