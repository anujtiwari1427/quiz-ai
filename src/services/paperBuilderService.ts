import { BankQuestion, PaperMeta, PaperSection, QP_MOCK_QUESTIONS, DEFAULT_PAPER_META, DEFAULT_PAPER_SECTIONS } from "../mock/qpMockQuestions";

const STORAGE_KEYS = {
  BANK: 'paperpulse_qp_bank',
  SECTIONS: 'paperpulse_qp_sections',
  META: 'paperpulse_qp_meta'
};

export interface AutoGenerateOptions {
  targetMarks: number;
  easyPct: number;
  medPct: number;
  hardPct: number;
  subjectFilter?: string;
}

export class PaperBuilderService {
  // ── 1. Bank Questions Storage ──
  getQuestions(): BankQuestion[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BANK);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error loading question bank:", e);
      }
    }
    // Initialize with mock questions
    this.saveQuestions(QP_MOCK_QUESTIONS);
    return QP_MOCK_QUESTIONS;
  }

  saveQuestions(questions: BankQuestion[]): void {
    localStorage.setItem(STORAGE_KEYS.BANK, JSON.stringify(questions));
  }

  addQuestion(q: Omit<BankQuestion, 'id'>): BankQuestion {
    const questions = this.getQuestions();
    const newQ: BankQuestion = {
      ...q,
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    questions.unshift(newQ);
    this.saveQuestions(questions);
    return newQ;
  }

  updateQuestion(updated: BankQuestion): void {
    const questions = this.getQuestions().map(q => q.id === updated.id ? updated : q);
    this.saveQuestions(questions);
  }

  deleteQuestion(id: string): void {
    const questions = this.getQuestions().filter(q => q.id !== id);
    this.saveQuestions(questions);

    // Also remove from any section
    const sections = this.getSections().map(sec => ({
      ...sec,
      questionIds: sec.questionIds.filter(qId => qId !== id)
    }));
    this.saveSections(sections);
  }

  // ── 2. Sections Storage ──
  getSections(): PaperSection[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SECTIONS);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error loading sections:", e);
      }
    }
    this.saveSections(DEFAULT_PAPER_SECTIONS);
    return DEFAULT_PAPER_SECTIONS;
  }

  saveSections(sections: PaperSection[]): void {
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
  }

  // ── 3. Paper Meta Storage ──
  getMeta(): PaperMeta {
    const raw = localStorage.getItem(STORAGE_KEYS.META);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.school) return parsed;
      } catch (e) {
        console.error("Error loading meta:", e);
      }
    }
    this.saveMeta(DEFAULT_PAPER_META);
    return DEFAULT_PAPER_META;
  }

  saveMeta(meta: PaperMeta): void {
    localStorage.setItem(STORAGE_KEYS.META, JSON.stringify(meta));
  }

  // ── 4. Auto-Generate Balanced Paper ──
  autoGenerateBalancedPaper(opts: AutoGenerateOptions): { sections: PaperSection[]; totalAllocated: number } {
    const allQuestions = this.getQuestions();
    const pool = opts.subjectFilter && opts.subjectFilter !== 'All'
      ? allQuestions.filter(q => q.subject.toLowerCase() === opts.subjectFilter?.toLowerCase())
      : allQuestions;

    if (pool.length === 0) {
      throw new Error(`No questions available in question bank for subject: ${opts.subjectFilter || 'All'}`);
    }

    const easyPool = pool.filter(q => q.difficulty === 'easy');
    const medPool = pool.filter(q => q.difficulty === 'medium');
    const hardPool = pool.filter(q => q.difficulty === 'hard');

    const targetEasyMarks = Math.round((opts.targetMarks * opts.easyPct) / 100);
    const targetMedMarks = Math.round((opts.targetMarks * opts.medPct) / 100);
    const targetHardMarks = opts.targetMarks - targetEasyMarks - targetMedMarks;

    const selectSubset = (items: BankQuestion[], target: number) => {
      const selected: BankQuestion[] = [];
      let current = 0;
      const shuffled = [...items].sort(() => 0.5 - Math.random());
      for (const q of shuffled) {
        if (current + q.marks <= target || (current < target && selected.length === 0)) {
          selected.push(q);
          current += q.marks;
        }
        if (current >= target) break;
      }
      return selected;
    };

    const chosenEasy = selectSubset(easyPool, targetEasyMarks);
    const chosenMed = selectSubset(medPool, targetMedMarks);
    const chosenHard = selectSubset(hardPool, targetHardMarks);

    const allChosen = [...chosenEasy, ...chosenMed, ...chosenHard];

    // Distribute into Sections based on question type/marks
    const secA: string[] = []; // 1-2 marks or MCQs
    const secB: string[] = []; // 2-3 marks short answers
    const secC: string[] = []; // 4+ marks long answers

    allChosen.forEach(q => {
      if (q.marks <= 2 || q.type === 'mcq' || q.type === 'fill') {
        secA.push(q.id);
      } else if (q.marks <= 3 || q.type === 'short') {
        secB.push(q.id);
      } else {
        secC.push(q.id);
      }
    });

    const newSections: PaperSection[] = [
      {
        id: `sec-${Date.now()}-1`,
        title: "Section A — Objective & Multiple Choice Questions",
        questionIds: secA
      },
      {
        id: `sec-${Date.now()}-2`,
        title: "Section B — Short Answer Questions",
        questionIds: secB
      },
      {
        id: `sec-${Date.now()}-3`,
        title: "Section C — Long Answer & Analytical Problems",
        questionIds: secC
      }
    ];

    this.saveSections(newSections);

    const totalAllocated = allChosen.reduce((sum, q) => sum + q.marks, 0);
    return { sections: newSections, totalAllocated };
  }

  // ── 5. Export as Word Document (.doc) ──
  exportToWordDoc(meta: PaperMeta, sections: PaperSection[], questions: BankQuestion[], showAnswers: boolean, showMarks: boolean = true): void {
    const qMap = new Map(questions.map(q => [q.id, q]));
    let globalIndex = 1;
    const answersList: { num: number; question: string; answer: string; marks: number }[] = [];

    let docHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>${meta.exam} - ${meta.subject}</title>
        <style>
          @page {
            size: 21cm 29.7cm;
            margin: 2cm 2cm 2cm 2cm;
            mso-page-orientation: portrait;
          }
          body {
            font-family: 'Calibri', 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000000;
          }
          .institution {
            font-size: 18pt;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 2px;
          }
          .exam-title {
            font-size: 14pt;
            font-weight: bold;
            text-align: center;
            color: #222222;
            margin-bottom: 12px;
          }
          .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
            border-bottom: 2pt solid #000000;
            padding-bottom: 6px;
          }
          .meta-table td {
            font-size: 10.5pt;
            padding: 3px 0;
          }
          .instructions-box {
            background-color: #f8f9fa;
            border: 1pt solid #cccccc;
            padding: 8px 12px;
            margin-bottom: 16px;
            font-size: 9.5pt;
          }
          .instructions-title {
            font-weight: bold;
            margin-bottom: 4px;
            text-transform: uppercase;
          }
          .section-heading {
            font-size: 12pt;
            font-weight: bold;
            text-align: center;
            background: #f1f3f5;
            padding: 5px;
            margin: 16px 0 10px 0;
            border-top: 1pt solid #000000;
            border-bottom: 1pt solid #000000;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .q-row {
            width: 100%;
            margin-bottom: 10px;
            page-break-inside: avoid;
          }
          .q-table {
            width: 100%;
            border-collapse: collapse;
          }
          .q-num {
            width: 32px;
            font-weight: bold;
            vertical-align: top;
          }
          .q-text {
            vertical-align: top;
          }
          .q-marks {
            width: 50px;
            text-align: right;
            font-weight: bold;
            vertical-align: top;
            color: #333333;
          }
          .options-grid {
            width: 100%;
            margin-top: 4px;
            margin-bottom: 4px;
          }
          .options-grid td {
            width: 50%;
            padding: 2px 4px;
            font-size: 10pt;
          }
          .answer-key-section {
            page-break-before: always;
            margin-top: 24px;
            border-top: 2pt dashed #666666;
            padding-top: 16px;
          }
          .answer-item {
            margin-bottom: 12px;
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <div class="institution">${meta.school}</div>
        <div class="exam-title">${meta.exam}</div>

        <table class="meta-table">
          <tr>
            <td><strong>Subject:</strong> ${meta.subject}</td>
            <td style="text-align: right;"><strong>Class/Grade:</strong> ${meta.grade}</td>
          </tr>
          <tr>
            <td><strong>Time Allowed:</strong> ${meta.time}</td>
            <td style="text-align: right;"><strong>Maximum Marks:</strong> ${meta.targetMarks}</td>
          </tr>
        </table>
    `;

    if (meta.instructions && meta.instructions.length > 0) {
      docHtml += `
        <div class="instructions-box">
          <div class="instructions-title">General Instructions:</div>
          <ol style="margin-top: 2px; margin-bottom: 0; padding-left: 20px;">
            ${meta.instructions.map(inst => `<li>${inst}</li>`).join('')}
          </ol>
        </div>
      `;
    }

    sections.forEach(sec => {
      if (sec.questionIds.length === 0) return;

      docHtml += `<div class="section-heading">${sec.title}</div>`;

      sec.questionIds.forEach(qId => {
        const q = qMap.get(qId);
        if (!q) return;

        answersList.push({
          num: globalIndex,
          question: q.question,
          answer: q.answer,
          marks: q.marks
        });

        docHtml += `
          <div class="q-row">
            <table class="q-table">
              <tr>
                <td class="q-num">Q${globalIndex}.</td>
                <td class="q-text">
                  <div>${q.question}</div>
        `;

        if (q.type === 'mcq' && q.options && q.options.length > 0) {
          docHtml += `<table class="options-grid"><tr>`;
          q.options.forEach((opt, idx) => {
            if (idx > 0 && idx % 2 === 0) docHtml += `</tr><tr>`;
            docHtml += `<td>(${String.fromCharCode(97 + idx)}) ${opt}</td>`;
          });
          if (q.options.length % 2 !== 0) docHtml += `<td></td>`;
          docHtml += `</tr></table>`;
        }

        docHtml += `
                </td>
                <td class="q-marks">${showMarks ? `[${q.marks}]` : ''}</td>
              </tr>
            </table>
          </div>
        `;

        globalIndex++;
      });
    });

    if (showAnswers && answersList.length > 0) {
      docHtml += `
        <div class="answer-key-section">
          <div class="institution">OFFICIAL EVALUATION SCHEME & ANSWER KEY</div>
          <div class="exam-title">${meta.exam} • ${meta.subject}</div>
          <div style="margin-top: 16px;">
      `;

      answersList.forEach(ans => {
        docHtml += `
          <div class="answer-item">
            <div style="font-weight: bold;">Q${ans.num}. ${ans.question} <span style="float: right;">[${ans.marks} Marks]</span></div>
            <div style="margin-top: 4px; padding-left: 15px; color: #1e3a8a; font-style: italic;">
              <strong>Model Solution:</strong> ${ans.answer || 'Answer not provided'}
            </div>
          </div>
        `;
      });

      docHtml += `</div></div>`;
    }

    docHtml += `</body></html>`;

    const blob = new Blob(['\ufeff' + docHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedTitle = `${meta.exam}_${meta.subject}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.download = `${sanitizedTitle}.doc`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 150);
  }

  // ── 6. Print Paper (A4 Native Clean Layout) ──
  printPaper(meta: PaperMeta, sections: PaperSection[], questions: BankQuestion[], showAnswers: boolean): void {
    const qMap = new Map(questions.map(q => [q.id, q]));
    let globalIndex = 1;
    const answersList: { num: number; question: string; answer: string; marks: number }[] = [];

    const printWin = window.open('', '_blank', 'width=900,height=800');
    if (!printWin) {
      alert("Popup blocked! Please allow popups to print the question paper.");
      return;
    }

    let printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${meta.exam} - ${meta.subject}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 1.8cm 1.5cm;
          }
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #111827;
            background: #ffffff;
            margin: 0;
            padding: 24px;
            font-size: 13px;
            line-height: 1.5;
          }
          .institution {
            text-align: center;
            font-size: 20px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
          }
          .exam-title {
            text-align: center;
            font-size: 15px;
            font-weight: 700;
            color: #374151;
            margin-bottom: 14px;
          }
          .roll-box {
            display: inline-block;
            border: 1px solid #9ca3af;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .meta-strip {
            display: flex;
            justify-content: space-between;
            border-top: 2px solid #111827;
            border-bottom: 2px solid #111827;
            padding: 6px 0;
            margin-bottom: 12px;
            font-size: 12px;
            font-weight: 600;
          }
          .instructions-card {
            border: 1px solid #d1d5db;
            background: #f9fafb;
            padding: 8px 12px;
            margin-bottom: 16px;
            border-radius: 4px;
            font-size: 11.5px;
          }
          .section-bar {
            text-align: center;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: #f3f4f6;
            padding: 6px;
            border-top: 1px solid #111827;
            border-bottom: 1px solid #111827;
            margin: 18px 0 10px 0;
            font-size: 12.5px;
          }
          .q-row {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            page-break-inside: avoid;
          }
          .q-num {
            width: 38px;
            font-weight: 700;
            flex-shrink: 0;
          }
          .q-body {
            flex: 1;
          }
          .q-marks {
            width: 45px;
            text-align: right;
            font-weight: 700;
            flex-shrink: 0;
          }
          .options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            margin-top: 6px;
            font-size: 12px;
          }
          .answer-sheet {
            page-break-before: always;
            margin-top: 30px;
            border-top: 2px dashed #9ca3af;
            padding-top: 20px;
          }
          .no-print-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #0f172a;
            color: #ffffff;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          @media print {
            .no-print-bar { display: none !important; }
            body { padding: 0 !important; }
          }
        </style>
      </head>
      <body>
        <div class="no-print-bar">
          <span style="font-weight: bold;">Paper Pulse • Print Preview</span>
          <div>
            <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer;">
              🖨️ Print Now
            </button>
          </div>
        </div>

        <div style="margin-top: 40px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-end;">
            <div class="roll-box">Roll No: __________________</div>
            <div style="font-size: 11px; color: #6b7280;">Paper Code: PP-2026-X</div>
          </div>

          <div class="institution">${meta.school}</div>
          <div class="exam-title">${meta.exam}</div>

          <div class="meta-strip">
            <div><strong>Subject:</strong> ${meta.subject} • <strong>Class:</strong> ${meta.grade}</div>
            <div><strong>Time:</strong> ${meta.time} • <strong>Max Marks:</strong> ${meta.targetMarks}</div>
          </div>
    `;

    if (meta.instructions && meta.instructions.length > 0) {
      printHtml += `
        <div class="instructions-card">
          <div style="font-weight: bold; margin-bottom: 2px;">General Instructions:</div>
          <ol style="margin: 0; padding-left: 18px;">
            ${meta.instructions.map(inst => `<li>${inst}</li>`).join('')}
          </ol>
        </div>
      `;
    }

    sections.forEach(sec => {
      if (sec.questionIds.length === 0) return;
      printHtml += `<div class="section-bar">${sec.title}</div>`;

      sec.questionIds.forEach(qId => {
        const q = qMap.get(qId);
        if (!q) return;

        answersList.push({
          num: globalIndex,
          question: q.question,
          answer: q.answer,
          marks: q.marks
        });

        printHtml += `
          <div class="q-row">
            <div class="q-num">Q${globalIndex}.</div>
            <div class="q-body">
              <div>${q.question}</div>
        `;

        if (q.type === 'mcq' && q.options && q.options.length > 0) {
          printHtml += `<div class="options-grid">`;
          q.options.forEach((opt, idx) => {
            printHtml += `<div>(${String.fromCharCode(97 + idx)}) ${opt}</div>`;
          });
          printHtml += `</div>`;
        }

        printHtml += `
            </div>
            <div class="q-marks">[${q.marks}]</div>
          </div>
        `;

        globalIndex++;
      });
    });

    if (showAnswers && answersList.length > 0) {
      printHtml += `
        <div class="answer-sheet">
          <div class="institution">MARKING SCHEME & STEP-BY-STEP SOLUTIONS</div>
          <div class="exam-title">${meta.exam} • ${meta.subject}</div>
          <div style="margin-top: 16px;">
      `;

      answersList.forEach(ans => {
        printHtml += `
          <div style="margin-bottom: 12px; page-break-inside: avoid;">
            <div style="font-weight: 700;">Q${ans.num}. ${ans.question} <span style="float: right;">[${ans.marks} Marks]</span></div>
            <div style="margin-top: 3px; padding-left: 12px; color: #047857; font-weight: 500;">
              <strong>Correct Answer / Rubric:</strong> ${ans.answer || 'Standard steps applicable'}
            </div>
          </div>
        `;
      });

      printHtml += `</div></div>`;
    }

    printHtml += `
        </div>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(printHtml);
    printWin.document.close();
  }

  // ── 7. JSON Backup & Restore ──
  exportBackup(): void {
    const backupData = {
      version: '1.0',
      appName: 'PaperPulse-QuestionPaperMaker',
      exportedAt: new Date().toISOString(),
      bank: this.getQuestions(),
      sections: this.getSections(),
      meta: this.getMeta()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paper_pulse_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  importBackup(jsonString: string): { questionsCount: number; sectionsCount: number } {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.bank)) {
        this.saveQuestions(parsed.bank);
      }
      if (Array.isArray(parsed.sections)) {
        this.saveSections(parsed.sections);
      }
      if (parsed.meta) {
        this.saveMeta(parsed.meta);
      }
      return {
        questionsCount: parsed.bank?.length || 0,
        sectionsCount: parsed.sections?.length || 0
      };
    } catch (e: any) {
      throw new Error(`Invalid JSON backup file: ${e.message}`);
    }
  }

  // ── 8. AI / OCR Text Extraction from raw text ──
  parseQuestionsFromText(rawText: string, defaultSubject: string = "General"): BankQuestion[] {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const questions: BankQuestion[] = [];
    let currentQ: Partial<BankQuestion> | null = null;
    let currentOptions: string[] = [];

    const isQuestionStart = (line: string) => /^(?:Q(?:uestion)?\.?\s*\d+[\.\:\)]|\d+[\.\)])\s+/i.test(line);
    const isOptionLine = (line: string) => /^\(?[a-dA-D]\)[\.\s]+/i.test(line);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (isQuestionStart(line)) {
        if (currentQ && currentQ.question) {
          questions.push({
            id: `extracted-${Date.now()}-${questions.length + 1}`,
            question: currentQ.question,
            options: currentOptions.length >= 2 ? currentOptions : null,
            answer: currentQ.answer || "Standard reference answer",
            subject: currentQ.subject || defaultSubject,
            topic: currentQ.topic || "Extracted Curriculum",
            difficulty: currentQ.difficulty || (currentOptions.length ? "easy" : "medium"),
            type: currentOptions.length >= 2 ? "mcq" : "short",
            marks: currentOptions.length >= 2 ? 1 : 3
          });
        }

        const cleanText = line.replace(/^(?:Q(?:uestion)?\.?\s*\d+[\.\:\)]|\d+[\.\)])\s+/i, '');
        currentQ = {
          question: cleanText,
          subject: defaultSubject,
          topic: "Extracted Chapter"
        };
        currentOptions = [];
      } else if (isOptionLine(line) && currentQ) {
        const cleanOpt = line.replace(/^\(?[a-dA-D]\)[\.\s]+/i, '').trim();
        currentOptions.push(cleanOpt);
      } else if (currentQ) {
        if (/^(?:Ans(?:wer)?|Sol(?:ution)?):?\s*/i.test(line)) {
          currentQ.answer = line.replace(/^(?:Ans(?:wer)?|Sol(?:ution)?):?\s*/i, '');
        } else {
          currentQ.question += " " + line;
        }
      }
    }

    if (currentQ && currentQ.question) {
      questions.push({
        id: `extracted-${Date.now()}-${questions.length + 1}`,
        question: currentQ.question,
        options: currentOptions.length >= 2 ? currentOptions : null,
        answer: currentQ.answer || "Standard reference answer",
        subject: currentQ.subject || defaultSubject,
        topic: currentQ.topic || "Extracted Curriculum",
        difficulty: currentOptions.length >= 2 ? "easy" : "medium",
        type: currentOptions.length >= 2 ? "mcq" : "short",
        marks: currentOptions.length >= 2 ? 1 : 3
      });
    }

    return questions;
  }
}

export const PAPER_BUILDER_SERVICE = new PaperBuilderService();
