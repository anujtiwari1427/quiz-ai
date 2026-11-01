import { StudentScoreBatchItem } from '../types';
import { calculateGrade } from '../utils/gradeUtils';
import { INITIAL_STUDENTS } from '../mock/initialData';

const STUDENT_SCORES_STORAGE_KEY = 'edupulse_batch_student_scores';

export interface BatchScoreStats {
  totalEvaluated: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
  passPercentage: number;
  topperStudent: string;
  totalPassed: number;
  totalFailed: number;
}

export const STUDENT_SCORE_SERVICE = {
  getStoredScores(): StudentScoreBatchItem[] {
    try {
      const data = localStorage.getItem(STUDENT_SCORES_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      const seeded = this.seedInitialScores();
      localStorage.setItem(STUDENT_SCORES_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    } catch {
      return this.seedInitialScores();
    }
  },

  saveScores(scores: StudentScoreBatchItem[]): void {
    try {
      localStorage.setItem(STUDENT_SCORES_STORAGE_KEY, JSON.stringify(scores));
    } catch (e) {
      console.error('Failed to save student scores', e);
    }
  },

  /**
   * Parse CSV or Tab-separated text from spreadsheet
   * Expected columns: RollNo, StudentName, Class, Section, Subject, ExamType, MaxMarks, MarksObtained, Remarks
   */
  parseScoreCsv(csvText: string): { 
    validItems: StudentScoreBatchItem[]; 
    errors: string[]; 
  } {
    const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    const validItems: StudentScoreBatchItem[] = [];
    const errors: string[] = [];

    if (lines.length === 0) {
      return { validItems: [], errors: ['Provided text/file is empty.'] };
    }

    // Check if line 0 is header
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes('roll') || firstLine.includes('name') || firstLine.includes('mark') || firstLine.includes('subject');
    const dataLines = hasHeader ? lines.slice(1) : lines;

    const todayStr = new Date().toISOString().split('T')[0];

    dataLines.forEach((line, idx) => {
      // Split by comma or tab
      const cols = line.includes('\t') ? line.split('\t') : line.split(',');
      const cleanCols = cols.map(c => c.trim().replace(/^["']|["']$/g, ''));

      if (cleanCols.length < 5) {
        errors.push(`Row ${idx + 1}: Expected at least 5 columns (RollNo, Name, Subject, MaxMarks, MarksObtained).`);
        return;
      }

      const rollNumber = cleanCols[0] || `ROLL-${idx + 1}`;
      const studentName = cleanCols[1] || 'Unknown Student';
      let classGrade = 10;
      let section = 'A';
      let subject = 'Mathematics';
      let examType: StudentScoreBatchItem['examType'] = 'Unit Test';
      let maxMarks = 100;
      let marksObtained = 0;
      let remarks = '';

      if (cleanCols.length >= 8) {
        classGrade = parseInt(cleanCols[2], 10) || 10;
        section = cleanCols[3] || 'A';
        subject = cleanCols[4] || 'Mathematics';
        examType = (cleanCols[5] as any) || 'Unit Test';
        maxMarks = parseFloat(cleanCols[6]) || 100;
        marksObtained = parseFloat(cleanCols[7]) || 0;
        remarks = cleanCols[8] || '';
      } else {
        // Simplified format: RollNo, Name, Subject, MaxMarks, MarksObtained, [Remarks]
        subject = cleanCols[2] || 'Mathematics';
        maxMarks = parseFloat(cleanCols[3]) || 100;
        marksObtained = parseFloat(cleanCols[4]) || 0;
        remarks = cleanCols[5] || '';
      }

      if (marksObtained > maxMarks) {
        errors.push(`Row ${idx + 1} (${studentName}): Marks obtained (${marksObtained}) cannot exceed Maximum Marks (${maxMarks}).`);
        return;
      }

      const percentage = Math.round((marksObtained / (maxMarks || 1)) * 100);
      const gradeResult = calculateGrade(percentage);
      const status: StudentScoreBatchItem['status'] = percentage >= 33 ? (percentage < 50 ? 'Needs Improvement' : 'Pass') : 'Fail';

      validItems.push({
        id: `batch_score_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        studentGsid: `GSID-${rollNumber.replace(/[^A-Za-z0-9]/g, '')}`,
        studentName,
        rollNumber,
        classGrade,
        section,
        subject,
        examName: `${subject} ${examType}`,
        examType,
        date: todayStr,
        maxMarks,
        marksObtained,
        percentage,
        grade: gradeResult.grade,
        status,
        remarks: remarks || undefined,
        uploadedAt: new Date().toISOString()
      });
    });

    // Assign rank sorted by marksObtained descending
    validItems.sort((a, b) => b.percentage - a.percentage);
    validItems.forEach((item, index) => {
      item.rank = index + 1;
    });

    return { validItems, errors };
  },

  /**
   * Add a batch of scores to the store
   */
  importScoreBatch(newItems: StudentScoreBatchItem[]): void {
    const existing = this.getStoredScores();
    const updated = [...newItems, ...existing];
    this.saveScores(updated);
  },

  /**
   * Delete score by ID
   */
  deleteScore(id: string): void {
    const existing = this.getStoredScores();
    this.saveScores(existing.filter(s => s.id !== id));
  },

  /**
   * Compute overall metrics for a given subset of scores
   */
  computeBatchStats(scores: StudentScoreBatchItem[]): BatchScoreStats {
    if (scores.length === 0) {
      return {
        totalEvaluated: 0,
        averagePercentage: 0,
        highestPercentage: 0,
        lowestPercentage: 0,
        passPercentage: 0,
        topperStudent: 'N/A',
        totalPassed: 0,
        totalFailed: 0
      };
    }

    const totalEvaluated = scores.length;
    const totalPercentage = scores.reduce((acc, s) => acc + s.percentage, 0);
    const averagePercentage = Math.round(totalPercentage / totalEvaluated);
    const highestPercentage = Math.max(...scores.map(s => s.percentage));
    const lowestPercentage = Math.min(...scores.map(s => s.percentage));

    const totalPassed = scores.filter(s => s.percentage >= 33).length;
    const totalFailed = totalEvaluated - totalPassed;
    const passPercentage = Math.round((totalPassed / totalEvaluated) * 100);

    const topper = [...scores].sort((a, b) => b.percentage - a.percentage)[0];
    const topperStudent = topper ? `${topper.studentName} (${topper.percentage}%)` : 'N/A';

    return {
      totalEvaluated,
      averagePercentage,
      highestPercentage,
      lowestPercentage,
      passPercentage,
      topperStudent,
      totalPassed,
      totalFailed
    };
  },

  /**
   * Pre-seed initial realistic batch scores
   */
  seedInitialScores(): StudentScoreBatchItem[] {
    const students = INITIAL_STUDENTS;
    const subjects = ['Mathematics', 'Science', 'English', 'Social Science'];
    const examTypes: StudentScoreBatchItem['examType'][] = ['Mid-Term', 'Unit Test'];
    const items: StudentScoreBatchItem[] = [];

    const mockDataset = [
      { name: 'Aarav Sharma', roll: '10A-04', grade: 10, sec: 'A', math: 92, sci: 88, eng: 86, sst: 90 },
      { name: 'Ananya Sharma', roll: '07B-12', grade: 7, sec: 'B', math: 64, sci: 72, eng: 82, sst: 78 },
      { name: 'Rohan Deshmukh', roll: '10A-18', grade: 10, sec: 'A', math: 66, sci: 62, eng: 74, sst: 70 },
      { name: 'Diya Patel', roll: '10A-07', grade: 10, sec: 'A', math: 96, sci: 94, eng: 91, sst: 95 },
      { name: 'Ishaan Verma', roll: '10A-11', grade: 10, sec: 'A', math: 78, sci: 82, eng: 80, sst: 84 },
      { name: 'Kavya Nair', roll: '10A-14', grade: 10, sec: 'A', math: 88, sci: 90, eng: 94, sst: 89 },
      { name: 'Aditya Gupta', roll: '10A-02', grade: 10, sec: 'A', math: 42, sci: 48, eng: 60, sst: 52 },
      { name: 'Meera Iyer', roll: '10A-16', grade: 10, sec: 'A', math: 85, sci: 89, eng: 92, sst: 87 }
    ];

    mockDataset.forEach((stu, sIdx) => {
      // Mathematics Mid-Term
      const mPerc = stu.math;
      items.push({
        id: `seed_score_math_${sIdx}`,
        studentGsid: `GSID-${stu.roll}`,
        studentName: stu.name,
        rollNumber: stu.roll,
        classGrade: stu.grade,
        section: stu.sec,
        subject: 'Mathematics',
        examName: 'Class 10 CBSE Mid-Term 2026',
        examType: 'Mid-Term',
        date: '2026-02-15',
        maxMarks: 100,
        marksObtained: mPerc,
        percentage: mPerc,
        grade: calculateGrade(mPerc).grade,
        status: mPerc >= 33 ? (mPerc < 50 ? 'Needs Improvement' : 'Pass') : 'Fail',
        remarks: mPerc >= 90 ? 'Outstanding analytical precision' : mPerc < 50 ? 'Recommended for remedial focus' : 'Good conceptual grasp',
        uploadedAt: '2026-02-16T10:00:00.000Z'
      });

      // Science Unit Test
      const sPerc = stu.sci;
      items.push({
        id: `seed_score_sci_${sIdx}`,
        studentGsid: `GSID-${stu.roll}`,
        studentName: stu.name,
        rollNumber: stu.roll,
        classGrade: stu.grade,
        section: stu.sec,
        subject: 'Science',
        examName: 'Periodic Assessment 2',
        examType: 'Unit Test',
        date: '2026-02-28',
        maxMarks: 50,
        marksObtained: Math.round((sPerc / 100) * 50),
        percentage: sPerc,
        grade: calculateGrade(sPerc).grade,
        status: sPerc >= 33 ? (sPerc < 50 ? 'Needs Improvement' : 'Pass') : 'Fail',
        remarks: sPerc >= 90 ? 'Exemplary scientific deductions' : undefined,
        uploadedAt: '2026-03-01T11:30:00.000Z'
      });
    });

    // Rank sorting for Mathematics
    const mathScores = items.filter(i => i.subject === 'Mathematics');
    mathScores.sort((a, b) => b.percentage - a.percentage);
    mathScores.forEach((s, idx) => { s.rank = idx + 1; });

    return items;
  }
};
