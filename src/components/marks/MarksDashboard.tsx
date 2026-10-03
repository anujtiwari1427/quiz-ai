import React, { useState, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, Award, CheckCircle2, Clock, 
  Calendar, ChevronRight, X, ArrowUpRight, ArrowDownRight,
  Sparkles, Filter, Search, BookOpen, Layers, ShieldCheck,
  Plus, Target, FileText, Printer, Calculator, Sliders, Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MarkRecord, SubjectMarksSummary } from '../../types';
import { calculateGrade } from '../../utils/gradeUtils';

const DEFAULT_SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Hindi',
  'Marathi',
  'Computer Science',
  'Social Science'
];

export const MarksDashboard: React.FC = () => {
  const { marks, addMarkRecord, setCurrentView, launchStudentTestRoom, tests } = useApp();
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<MarkRecord | null>(null);
  
  // Modals state
  const [isAddMarksModalOpen, setIsAddMarksModalOpen] = useState(false);
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);
  const [isTargetPlannerOpen, setIsTargetPlannerOpen] = useState(false);

  // New Marks Record Form State
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newTestName, setNewTestName] = useState('');
  const [newExamType, setNewExamType] = useState<MarkRecord['examType']>('Unit Test');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTotalMarks, setNewTotalMarks] = useState<number>(50);
  const [newObtainedMarks, setNewObtainedMarks] = useState<number>(44);
  const [newRemarks, setNewRemarks] = useState('');

  // Target Planner State
  const [targetPercentage, setTargetPercentage] = useState<number>(90);

  // ── Overall Aggregations ──
  const overallStats = useMemo(() => {
    if (!marks || marks.length === 0) {
      return {
        totalTests: 0,
        totalMarks: 0,
        totalObtained: 0,
        overallPercentage: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        overallGrade: calculateGrade(0)
      };
    }

    const totalTests = marks.length;
    const totalMarks = marks.reduce((sum, m) => sum + m.totalMarks, 0);
    const totalObtained = marks.reduce((sum, m) => sum + m.obtainedMarks, 0);
    const overallPercentage = totalMarks > 0 ? Math.round((totalObtained / totalMarks) * 100) : 0;
    const averageScore = Math.round(marks.reduce((sum, m) => sum + m.percentage, 0) / totalTests);
    const highestScore = Math.max(...marks.map(m => m.percentage));
    const lowestScore = Math.min(...marks.map(m => m.percentage));
    const overallGrade = calculateGrade(overallPercentage);

    return {
      totalTests,
      totalMarks,
      totalObtained,
      overallPercentage,
      averageScore,
      highestScore,
      lowestScore,
      overallGrade
    };
  }, [marks]);

  // ── Subject-Wise Aggregations ──
  const subjectSummaries = useMemo<SubjectMarksSummary[]>(() => {
    const allSubjectsSet = new Set<string>(DEFAULT_SUBJECTS);
    marks.forEach(m => { if (m.subject) allSubjectsSet.add(m.subject); });
    const allSubjects = Array.from(allSubjectsSet);

    return allSubjects.map(subject => {
      const subjectMarks = marks.filter(m => m.subject.toLowerCase() === subject.toLowerCase());
      if (subjectMarks.length === 0) {
        return {
          subject,
          testsAttempted: 0,
          totalMarks: 0,
          marksObtained: 0,
          percentage: 0,
          grade: '—',
          highestScore: 0,
          lowestScore: 0
        };
      }

      const testsAttempted = subjectMarks.length;
      const totalMarks = subjectMarks.reduce((sum, m) => sum + m.totalMarks, 0);
      const marksObtained = subjectMarks.reduce((sum, m) => sum + m.obtainedMarks, 0);
      const percentage = totalMarks > 0 ? Math.round((marksObtained / totalMarks) * 100) : 0;
      const highestScore = Math.max(...subjectMarks.map(m => m.percentage));
      const lowestScore = Math.min(...subjectMarks.map(m => m.percentage));
      const grade = calculateGrade(percentage).grade;

      return {
        subject,
        testsAttempted,
        totalMarks,
        marksObtained,
        percentage,
        grade,
        highestScore,
        lowestScore
      };
    }).sort((a, b) => {
      if (a.testsAttempted > 0 && b.testsAttempted === 0) return -1;
      if (a.testsAttempted === 0 && b.testsAttempted > 0) return 1;
      return b.percentage - a.percentage;
    });
  }, [marks]);

  // ── Filtered History ──
  const filteredMarks = useMemo(() => {
    return marks.filter(m => {
      const matchesSubject = selectedSubjectFilter === 'all' || m.subject.toLowerCase() === selectedSubjectFilter.toLowerCase();
      const matchesSearch = searchQuery.trim() === '' || 
        m.testName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSubject && matchesSearch;
    });
  }, [marks, selectedSubjectFilter, searchQuery]);

  // Handle Add Marks Submission
  const handleSaveCustomMarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim() || newTotalMarks <= 0) return;

    const percentage = Math.round((Math.min(newObtainedMarks, newTotalMarks) / newTotalMarks) * 100);
    const grade = calculateGrade(percentage).grade;

    const newRecord: MarkRecord = {
      id: `mark_manual_${Date.now()}`,
      testId: `test_manual_${Date.now()}`,
      testName: newTestName.trim(),
      subject: newSubject,
      date: newDate,
      totalMarks: Number(newTotalMarks),
      obtainedMarks: Number(Math.min(newObtainedMarks, newTotalMarks)),
      percentage,
      grade,
      examType: newExamType,
      remarks: newRemarks.trim() || undefined
    };

    addMarkRecord(newRecord);
    setIsAddMarksModalOpen(false);
    setNewTestName('');
    setNewRemarks('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in-up">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-emerald">Performance &amp; Marks Analytics</span>
            <span className="text-slate-500 text-xs font-mono">• Board Standards Aligned</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center gap-2.5">
            📊 Marks &amp; Score Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track scores across practice sets, unit tests, and offline school exams with automated NEP 2020 grade distributions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsTargetPlannerOpen(true)}
            className="btn-secondary text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5"
          >
            <Target style={{ width: '13px', height: '13px', color: '#818cf8' }} />
            <span>Target Planner</span>
          </button>

          <button
            onClick={() => setIsReportCardOpen(true)}
            className="btn-secondary text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5"
          >
            <FileText style={{ width: '13px', height: '13px', color: '#fbbf24' }} />
            <span>Official Report Card</span>
          </button>

          {/* ADD MARKS OPTION BUTTON */}
          <button
            onClick={() => setIsAddMarksModalOpen(true)}
            className="btn-primary text-xs py-2 px-4 rounded-xl shadow-lg shadow-brand-500/25 flex items-center gap-1.5 font-bold"
          >
            <Plus style={{ width: '14px', height: '14px' }} />
            <span>Add Marks Record</span>
          </button>
        </div>
      </div>

      {/* ── Top KPI Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Overall Percentage */}
        <div className="glass-emerald rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden border border-emerald-500/25 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium">
            <span>Overall Aggregate</span>
            <span className={`badge ${overallStats.overallGrade.badgeClass}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
              {overallStats.overallGrade.grade}
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-display font-black text-white">
              {overallStats.overallPercentage}%
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">{overallStats.overallGrade.label}</div>
          </div>
          <div className="mastery-bar" style={{ height: '4px' }}>
            <div 
              className="mastery-bar-fill high" 
              style={{ width: `${overallStats.overallPercentage}%`, animation: 'none' }} 
            />
          </div>
        </div>

        {/* Total Marks */}
        <div className="stat-card">
          <div className="text-[11px] text-slate-400 font-medium mb-1">Marks Obtained</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-white">
            {overallStats.totalObtained}
            <span className="text-xs text-slate-500 font-normal ml-1">/ {overallStats.totalMarks}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Cumulative Points</div>
        </div>

        {/* Tests Attempted */}
        <div className="stat-card">
          <div className="text-[11px] text-slate-400 font-medium mb-1">Tests Logged</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-white">
            {overallStats.totalTests}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-0.5">
            <CheckCircle2 style={{ width: '10px', height: '10px' }} />
            <span>Active Portfolio</span>
          </div>
        </div>

        {/* Average Score */}
        <div className="stat-card">
          <div className="text-[11px] text-slate-400 font-medium mb-1">Mean Score</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-indigo-400">
            {overallStats.averageScore}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Per Test Average</div>
        </div>

        {/* Highest Score */}
        <div className="stat-card">
          <div className="text-[11px] text-slate-400 font-medium mb-1">Highest Score</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-emerald-400">
            {overallStats.highestScore}%
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-0.5">
            <ArrowUpRight style={{ width: '10px', height: '10px' }} />
            <span>Personal Best</span>
          </div>
        </div>

        {/* Quick Launch CTA */}
        <div 
          onClick={() => setCurrentView('questions')}
          className="glass rounded-2xl p-4 flex flex-col justify-between border border-white/[0.08] hover:border-brand-500/40 cursor-pointer transition-all card-hover group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Practice More</span>
            <Layers style={{ width: '13px', height: '13px', color: '#10b981' }} />
          </div>
          <div className="my-1">
            <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              Question Sets
            </div>
            <div className="text-[10px] text-slate-400">Practice &amp; boost marks</div>
          </div>
          <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <span>Open Sets</span>
            <ChevronRight style={{ width: '10px', height: '10px' }} />
          </div>
        </div>

      </div>

      {/* ── Subject-Wise Performance Breakdown ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Subject Mastery &amp; Marks Distribution</h2>
            <p className="text-xs text-slate-400">Aggregated performance across academic disciplines</p>
          </div>
          <span className="badge badge-emerald text-[10px]">{subjectSummaries.filter(s => s.testsAttempted > 0).length} Subjects Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectSummaries.map((s) => {
            const hasAttempts = s.testsAttempted > 0;
            const masteryClass = s.percentage >= 80 ? 'high' : s.percentage >= 60 ? 'medium' : 'low';

            return (
              <div 
                key={s.subject} 
                className="glass rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.14] transition-all card-hover space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{s.subject}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {hasAttempts ? `${s.testsAttempted} tests attempted` : 'No tests recorded'}
                    </p>
                  </div>
                  <span className={`badge ${calculateGrade(s.percentage).badgeClass} font-mono text-xs font-bold`}>
                    {s.grade}
                  </span>
                </div>

                {hasAttempts ? (
                  <>
                    <div className="flex items-baseline justify-between pt-1">
                      <div className="text-2xl font-display font-black text-white">
                        {s.percentage}%
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {s.marksObtained} / {s.totalMarks} M
                      </span>
                    </div>

                    <div className="mastery-bar">
                      <div 
                        className={`mastery-bar-fill ${masteryClass}`} 
                        style={{ width: `${s.percentage}%`, animation: 'none' }} 
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/[0.04]">
                      <span>Peak: <strong className="text-white font-mono">{s.highestScore}%</strong></span>
                      <span>Lowest: <strong className="text-slate-400 font-mono">{s.lowestScore}%</strong></span>
                    </div>
                  </>
                ) : (
                  <div className="py-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedSubjectFilter(s.subject);
                        setIsAddMarksModalOpen(true);
                      }}
                      className="text-xs text-brand-400 hover:text-brand-300 font-bold underline"
                    >
                      + Add marks for {s.subject}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Test History Table ── */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Complete Assessment History</h3>
            <p className="text-xs text-slate-400">{filteredMarks.length} records found</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search style={{ width: '13px', height: '13px', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search test names..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-field pl-8 py-1.5 text-xs w-44 sm:w-56"
              />
            </div>

            {/* Subject Filter */}
            <div className="flex items-center gap-1 bg-slate-900 border border-white/[0.08] rounded-xl px-2.5 py-1">
              <Filter style={{ width: '11px', height: '11px', color: '#94a3b8' }} />
              <select
                value={selectedSubjectFilter}
                onChange={e => setSelectedSubjectFilter(e.target.value)}
                className="bg-transparent text-xs text-white outline-none cursor-pointer pr-1"
              >
                <option value="all" className="bg-slate-900 text-white">All Subjects</option>
                {subjectSummaries.map(s => (
                  <option key={s.subject} value={s.subject} className="bg-slate-900 text-white">{s.subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Test Title</th>
                <th className="py-3 px-3">Exam Type</th>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Total Marks</th>
                <th className="py-3 px-3">Marks Obtained</th>
                <th className="py-3 px-3">Percentage</th>
                <th className="py-3 px-3">Grade</th>
                <th className="py-3 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredMarks.map((record) => {
                const gradeInfo = calculateGrade(record.percentage);
                return (
                  <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-white max-w-[220px] truncate">
                      {record.testName}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-mono text-[10px]">
                      <span className="badge text-[9px] bg-slate-900 text-slate-300">
                        {record.examType || 'Practice Set'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      <span className="badge badge-emerald text-[9px]">{record.subject}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {record.date}
                    </td>
                    <td className="py-3.5 px-3 text-slate-300 font-mono">{record.totalMarks} M</td>
                    <td className="py-3.5 px-3 font-bold text-white font-mono">{record.obtainedMarks} M</td>
                    <td className="py-3.5 px-3 font-bold text-emerald-400 font-mono">{record.percentage}%</td>
                    <td className="py-3.5 px-3">
                      <span className={`badge ${gradeInfo.badgeClass} text-[10px] font-bold`}>
                        {record.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedRecordForModal(record)}
                        className="btn-secondary py-1 px-3 text-[11px] rounded-lg"
                      >
                        View Breakdown
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredMarks.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 text-xs">
                    No test records match your filter criteria. Click "Add Marks Record" to log one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL 1: ADD MARKS OPTION MODAL ── */}
      {isAddMarksModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="glass rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/[0.1] shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
                  <Award style={{ width: '18px', height: '18px' }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Add Marks Record</h3>
                  <p className="text-xs text-slate-400">Log offline exam, unit test or quiz results</p>
                </div>
              </div>
              <button onClick={() => setIsAddMarksModalOpen(false)} className="text-slate-400 hover:text-white">
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomMarks} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Assessment / Test Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pre-Board Science Exam 1"
                  value={newTestName}
                  onChange={e => setNewTestName(e.target.value)}
                  className="input-field text-xs w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="input-field text-xs bg-slate-950 w-full"
                  >
                    {DEFAULT_SUBJECTS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Exam Type</label>
                  <select
                    value={newExamType}
                    onChange={e => setNewExamType(e.target.value as any)}
                    className="input-field text-xs bg-slate-950 w-full"
                  >
                    <option value="Unit Test">Unit Test</option>
                    <option value="Mid-Term">Mid-Term Exam</option>
                    <option value="Pre-Board">Pre-Board Exam</option>
                    <option value="Board Exam">Board Final Exam</option>
                    <option value="Offline Assessment">Offline School Quiz</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Total Marks</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={newTotalMarks}
                    onChange={e => setNewTotalMarks(Number(e.target.value))}
                    className="input-field text-xs font-mono w-full"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    min={0}
                    max={newTotalMarks}
                    value={newObtainedMarks}
                    onChange={e => setNewObtainedMarks(Number(e.target.value))}
                    className="input-field text-xs font-mono w-full"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="input-field text-xs font-mono w-full"
                    required
                  />
                </div>
              </div>

              {/* Calculated percentage preview */}
              <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Calculated Result:</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">
                    {newTotalMarks > 0 ? Math.round((newObtainedMarks / newTotalMarks) * 100) : 0}%
                  </span>
                  <span className="badge badge-emerald text-[10px]">
                    Grade {calculateGrade(newTotalMarks > 0 ? Math.round((newObtainedMarks / newTotalMarks) * 100) : 0).grade}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Teacher / Self Remarks (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Scored 100% in section A, review geometry theorems for section B"
                  value={newRemarks}
                  onChange={e => setNewRemarks(e.target.value)}
                  className="input-field text-xs w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsAddMarksModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 rounded-xl shadow-lg shadow-brand-500/25 font-bold"
                >
                  Save Marks Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: TARGET PLANNER ── */}
      {isTargetPlannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="glass rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/[0.1] shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Target style={{ width: '18px', height: '18px' }} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Board Grade Target Planner</h4>
                  <p className="text-[11px] text-slate-400">Calculate required marks for your goal</p>
                </div>
              </div>
              <button onClick={() => setIsTargetPlannerOpen(false)} className="text-slate-400 hover:text-white">
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Set Target Percentage</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={50}
                    max={100}
                    step={1}
                    value={targetPercentage}
                    onChange={e => setTargetPercentage(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <span className="text-lg font-bold text-emerald-400 font-mono shrink-0 w-12 text-right">
                    {targetPercentage}%
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-white/[0.06] space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Aggregate:</span>
                  <span className="font-bold text-white font-mono">{overallStats.overallPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Grade:</span>
                  <span className="font-bold text-emerald-400 font-mono">{calculateGrade(targetPercentage).grade}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-white/[0.04]">
                  <span className="text-slate-400">Gap to Target:</span>
                  <span className={`font-bold font-mono ${targetPercentage > overallStats.overallPercentage ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {targetPercentage > overallStats.overallPercentage ? `+${targetPercentage - overallStats.overallPercentage}% needed` : 'Goal Achieved!'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] leading-relaxed">
                💡 To maintain or reach <strong>{targetPercentage}%</strong>, aim for at least <strong>{Math.round(targetPercentage * 0.8)}/80 Marks</strong> in your next board mock exam.
              </div>

              <button
                onClick={() => setIsTargetPlannerOpen(false)}
                className="btn-primary w-full justify-center text-xs py-2.5 rounded-xl font-bold"
              >
                Close Planner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: OFFICIAL REPORT CARD ── */}
      {isReportCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="glass rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-white/[0.1] shadow-2xl space-y-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileText style={{ width: '20px', height: '20px' }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Academic Performance Transcript</h3>
                  <p className="text-xs text-slate-400">Comprehensive CBSE / State Board Grade Sheet</p>
                </div>
              </div>
              <button onClick={() => setIsReportCardOpen(false)} className="text-slate-400 hover:text-white">
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {/* Transcript Sheet Preview */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-white/[0.1] space-y-5 text-xs">
              <div className="text-center space-y-1 border-b border-white/[0.08] pb-4">
                <h4 className="text-base font-bold text-white tracking-wide">EDUPULSE AI ACADEMIC SYSTEM</h4>
                <p className="text-[11px] text-slate-400 font-mono">Continuous Comprehensive Evaluation (CCE) Transcript</p>
                <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-mono pt-1">
                  <span>Class: 10th Standard</span>
                  <span>•</span>
                  <span>Date: {new Date().toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Status: Verified Official</span>
                </div>
              </div>

              <div className="space-y-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-slate-400 uppercase text-[10px]">
                      <th className="py-2">Subject</th>
                      <th className="py-2">Tests</th>
                      <th className="py-2">Total M</th>
                      <th className="py-2">Scored M</th>
                      <th className="py-2">Percentage</th>
                      <th className="py-2 text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {subjectSummaries.filter(s => s.testsAttempted > 0).map(s => (
                      <tr key={s.subject}>
                        <td className="py-2.5 font-bold text-white">{s.subject}</td>
                        <td className="py-2.5 text-slate-400 font-mono">{s.testsAttempted}</td>
                        <td className="py-2.5 text-slate-300 font-mono">{s.totalMarks}</td>
                        <td className="py-2.5 font-bold text-white font-mono">{s.marksObtained}</td>
                        <td className="py-2.5 text-emerald-400 font-mono font-bold">{s.percentage}%</td>
                        <td className="py-2.5 text-right">
                          <span className="badge badge-emerald text-[9px] font-bold">{s.grade}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-white/[0.06] flex items-center justify-between font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">CUMULATIVE AGGREGATE</span>
                  <span className="text-emerald-400 font-bold text-base">{overallStats.overallPercentage}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">FINAL AWARDED GRADE</span>
                  <span className="text-white font-bold text-base">{overallStats.overallGrade.grade} ({overallStats.overallGrade.label})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.06]">
              <button
                onClick={() => setIsReportCardOpen(false)}
                className="btn-secondary text-xs py-2 px-4 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="btn-primary text-xs py-2 px-5 rounded-xl flex items-center gap-1.5 font-bold"
              >
                <Printer style={{ width: '13px', height: '13px' }} />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: TEST DETAILS MODAL ── */}
      {selectedRecordForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="glass rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/[0.1] shadow-2xl space-y-6 animate-scale-in">
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-emerald text-[9px]">{selectedRecordForModal.subject}</span>
                  <span className="badge badge-indigo text-[9px]">{selectedRecordForModal.examType || 'Assessment'}</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">{selectedRecordForModal.testName}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                  <Calendar style={{ width: '12px', height: '12px' }} />
                  {selectedRecordForModal.date}
                  {selectedRecordForModal.timeSpentSeconds && (
                    <>
                      <span>•</span>
                      <Clock style={{ width: '12px', height: '12px' }} />
                      {Math.floor(selectedRecordForModal.timeSpentSeconds / 60)}m {selectedRecordForModal.timeSpentSeconds % 60}s spent
                    </>
                  )}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecordForModal(null)}
                className="p-1.5 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white"
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {/* Score & Grade Banner */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Total Marks Scored</div>
                <div className="text-2xl font-display font-black text-white">
                  {selectedRecordForModal.obtainedMarks} <span className="text-sm font-normal text-slate-500">/ {selectedRecordForModal.totalMarks} M</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Performance Grade</div>
                <div className="flex items-center gap-1.5 justify-end mt-0.5">
                  <span className={`badge ${calculateGrade(selectedRecordForModal.percentage).badgeClass} text-xs px-2.5 py-0.5`}>
                    {selectedRecordForModal.grade} ({selectedRecordForModal.percentage}%)
                  </span>
                </div>
              </div>
            </div>

            {selectedRecordForModal.remarks && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/[0.06] text-xs text-slate-300">
                <strong className="text-slate-400 block text-[10px] uppercase font-mono mb-0.5">Remarks / Feedback:</strong>
                {selectedRecordForModal.remarks}
              </div>
            )}

            {/* Questions breakdown if available */}
            {selectedRecordForModal.questionCount !== undefined && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-lg font-bold text-emerald-400">{selectedRecordForModal.correctCount || 0}</div>
                  <div className="text-[10px] text-slate-400">Correct</div>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <div className="text-lg font-bold text-rose-400">{selectedRecordForModal.incorrectCount || 0}</div>
                  <div className="text-[10px] text-slate-400">Incorrect</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.06]">
                  <div className="text-lg font-bold text-slate-300">{selectedRecordForModal.skippedCount || 0}</div>
                  <div className="text-[10px] text-slate-400">Skipped</div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedRecordForModal(null)}
                className="btn-secondary text-xs py-2 px-4 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedRecordForModal(null);
                  setCurrentView('questions');
                }}
                className="btn-primary text-xs py-2 px-4 rounded-xl font-bold"
              >
                Practice Similar Set
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MarksDashboard;
