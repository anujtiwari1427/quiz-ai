import React, { useState, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, Award, CheckCircle2, Clock, 
  Calendar, ChevronRight, X, ArrowUpRight, ArrowDownRight,
  Sparkles, Filter, Search, BookOpen, Layers, ShieldCheck
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
  'Computer Science'
];

export const MarksDashboard: React.FC = () => {
  const { marks, setCurrentView, launchStudentTestRoom, tests } = useApp();
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<MarkRecord | null>(null);

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
    // Gather all subjects: known defaults + any other custom subjects found in marks
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
      // Show attempted subjects first, then by percentage descending
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

  // Chronological score trend data (oldest to newest)
  const scoreTrend = useMemo(() => {
    return [...marks].reverse().slice(-8);
  }, [marks]);

  // If no marks exist, show empty state
  if (!marks || marks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in-up">
        <div className="glass rounded-3xl p-10 sm:p-14 border border-white/[0.08] shadow-2xl max-w-xl mx-auto space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center mx-auto shadow-inner">
            <BarChart3 style={{ width: '36px', height: '36px', color: '#10b981' }} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-black text-white">No test results yet</h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
              Take your first quiz or practice test to see your performance metrics, subject breakdown, and grade analytics here.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (tests.length > 0) launchStudentTestRoom(tests[0].id);
                else setCurrentView('student');
              }}
              className="btn-primary w-full sm:w-auto py-3 px-6 text-sm"
            >
              <Award style={{ width: '16px', height: '16px' }} />
              <span>Take First Quiz</span>
            </button>
            <button
              onClick={() => setCurrentView('questions')}
              className="btn-secondary w-full sm:w-auto py-3 px-6 text-sm"
            >
              <Layers style={{ width: '16px', height: '16px' }} />
              <span>Browse Question Sets</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in-up">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-emerald">Performance Analytics</span>
            <span className="text-slate-500 text-xs font-mono">• Board Standards Aligned</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center gap-2.5">
            Marks &amp; Academic Performance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your score trajectories, subject-wise competency, and NEP 2020 grade distributions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('questions')}
            className="btn-secondary text-xs py-2 px-3.5"
          >
            <Layers style={{ width: '13px', height: '13px' }} />
            <span>Practice Sets</span>
          </button>
          <button
            onClick={() => {
              if (tests.length > 0) launchStudentTestRoom(tests[0].id);
              else setCurrentView('student');
            }}
            className="btn-primary text-xs py-2 px-4"
          >
            <Sparkles style={{ width: '13px', height: '13px' }} />
            <span>Take Test</span>
          </button>
        </div>
      </div>

      {/* ── Top KPI Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Overall Percentage */}
        <div className="glass-emerald rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden border border-emerald-500/20">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium">
            <span>Overall Score</span>
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
          <div className="text-[11px] text-slate-400 font-medium mb-1">Tests Attempted</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-white">
            {overallStats.totalTests}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-0.5">
            <CheckCircle2 style={{ width: '10px', height: '10px' }} />
            <span>Active Record</span>
          </div>
        </div>

        {/* Average Score */}
        <div className="stat-card">
          <div className="text-[11px] text-slate-400 font-medium mb-1">Average Score</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-white">
            {overallStats.averageScore}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Mean Percentage</div>
        </div>

        {/* Highest Score */}
        <div className="stat-card">
          <div className="text-[11px] text-slate-400 font-medium mb-1">Highest Score</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-emerald-400 flex items-baseline gap-1">
            {overallStats.highestScore}%
            <ArrowUpRight style={{ width: '14px', height: '14px' }} />
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Personal Best</div>
        </div>

        {/* Lowest Score */}
        <div className="stat-card">
          <div className="text-[11px] text-slate-400 font-medium mb-1">Lowest Score</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-amber-400 flex items-baseline gap-1">
            {overallStats.lowestScore}%
            <ArrowDownRight style={{ width: '14px', height: '14px' }} />
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Revision Target</div>
        </div>

      </div>

      {/* ── Visual Charts Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Subject-Wise Performance Bar Chart */}
        <div className="glass rounded-3xl p-6 border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
                <BarChart3 style={{ width: '16px', height: '16px', color: '#10b981' }} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Subject-Wise Performance</h3>
                <p className="text-[11px] text-slate-400">Current percentage mastery by subject</p>
              </div>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '9px' }}>NEP Benchmarks</span>
          </div>

          {/* Responsive SVG / CSS Bar Chart */}
          <div className="space-y-3 pt-2">
            {subjectSummaries.map(sub => {
              const gradeInfo = calculateGrade(sub.percentage);
              return (
                <div key={sub.subject} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      {sub.subject}
                      {sub.testsAttempted === 0 && (
                        <span className="text-[9px] text-slate-600 font-normal">(No tests yet)</span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">{sub.marksObtained}/{sub.totalMarks} marks</span>
                      <span className="font-bold text-white w-10 text-right">{sub.percentage}%</span>
                      <span className={`badge ${sub.testsAttempted > 0 ? gradeInfo.badgeClass : 'bg-slate-800 text-slate-500 border border-slate-700'}`} style={{ fontSize: '8px', padding: '1px 5px' }}>
                        {sub.grade}
                      </span>
                    </div>
                  </div>
                  <div className="mastery-bar bg-slate-900" style={{ height: '7px' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${sub.percentage}%`,
                        background: sub.percentage >= 80 
                          ? 'linear-gradient(90deg, #059669, #10b981)' 
                          : sub.percentage >= 60 
                          ? 'linear-gradient(90deg, #6366f1, #818cf8)' 
                          : sub.percentage > 0 
                          ? 'linear-gradient(90deg, #d97706, #f59e0b)' 
                          : 'transparent'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Score Trend Over Time */}
        <div className="glass rounded-3xl p-6 border border-white/[0.06] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                  <TrendingUp style={{ width: '16px', height: '16px', color: '#818cf8' }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Score Trend Over Time</h3>
                  <p className="text-[11px] text-slate-400">Trajectory across recent {scoreTrend.length} assessments</p>
                </div>
              </div>
              <span className="badge badge-indigo" style={{ fontSize: '9px' }}>Recent Attempts</span>
            </div>

            {/* Responsive Trend Visualizer */}
            <div className="pt-4 pb-2">
              <div className="h-44 w-full flex items-end gap-2 sm:gap-3 px-2 border-b border-white/[0.08] relative">
                
                {/* 50% & 80% Benchmark Guide Lines */}
                <div className="absolute inset-x-0 top-[20%] border-t border-dashed border-emerald-500/20 pointer-events-none flex justify-end pr-1">
                  <span className="text-[8px] text-emerald-400/60 font-mono">80% A-Grade</span>
                </div>
                <div className="absolute inset-x-0 top-[50%] border-t border-dashed border-indigo-500/20 pointer-events-none flex justify-end pr-1">
                  <span className="text-[8px] text-indigo-400/60 font-mono">50% Benchmark</span>
                </div>

                {scoreTrend.map((record) => {
                  const gradeInfo = calculateGrade(record.percentage);
                  return (
                    <div 
                      key={record.id} 
                      onClick={() => setSelectedRecordForModal(record)}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                    >
                      <div className="text-[10px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 border border-white/10 px-1.5 py-0.5 rounded shadow">
                        {record.percentage}%
                      </div>
                      <div 
                        className="w-full max-w-[36px] rounded-t-lg transition-all duration-300 group-hover:brightness-125 group-hover:scale-105"
                        style={{
                          height: `${Math.max(12, record.percentage)}%`,
                          background: record.percentage >= 85 
                            ? 'linear-gradient(180deg, #34d399 0%, #059669 100%)' 
                            : record.percentage >= 70 
                            ? 'linear-gradient(180deg, #818cf8 0%, #4f46e5 100%)' 
                            : 'linear-gradient(180deg, #fbbf24 0%, #d97706 100%)',
                          boxShadow: '0 -2px 10px rgba(0,0,0,0.3)'
                        }}
                      />
                      <span className="text-[9px] text-slate-500 font-mono truncate max-w-[42px] group-hover:text-slate-300">
                        {record.subject.slice(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chart footer legend */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-white/[0.05]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> A/A+ (&ge;80%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400" /> B/B+ (60-79%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> C/D (40-59%)
              </span>
            </div>
            <span className="text-slate-500 hidden sm:inline">Click any bar for details</span>
          </div>
        </div>

      </div>

      {/* ── Subject-Wise Performance Cards ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Subject Mastery Cards</h2>
            <p className="text-xs text-slate-400">Detailed marks, test count, and grades across all enrolled disciplines</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectSummaries.map((item) => {
            const gradeInfo = calculateGrade(item.percentage);
            return (
              <div
                key={item.subject}
                className="glass rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.14] transition-all space-y-3.5 card-hover"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.subject}</h4>
                    <p className="text-[11px] text-slate-400">
                      {item.testsAttempted} {item.testsAttempted === 1 ? 'Test Attempted' : 'Tests Attempted'}
                    </p>
                  </div>
                  <span className={`badge ${item.testsAttempted > 0 ? gradeInfo.badgeClass : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                    {item.testsAttempted > 0 ? `Grade ${item.grade}` : 'Unassessed'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Marks Scored</span>
                    <div className="text-xl font-display font-black text-white">
                      {item.marksObtained} <span className="text-xs text-slate-500 font-normal">/ {item.totalMarks}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Mastery</span>
                    <div className="text-xl font-display font-black text-brand-400">
                      {item.percentage}%
                    </div>
                  </div>
                </div>

                <div className="mastery-bar bg-slate-900">
                  <div
                    className={`mastery-bar-fill ${item.percentage >= 80 ? 'high' : item.percentage >= 60 ? 'medium' : 'low'}`}
                    style={{ width: `${item.percentage}%`, animation: 'none' }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/[0.05]">
                  <span>High: <strong className="text-slate-200">{item.highestScore}%</strong></span>
                  <span>Low: <strong className="text-slate-200">{item.lowestScore}%</strong></span>
                  <button
                    onClick={() => {
                      setSelectedSubjectFilter(item.subject);
                      const el = document.getElementById('test-history-table');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-0.5"
                  >
                    History <ChevronRight style={{ width: '11px', height: '11px' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Test History Table & Filters ── */}
      <div id="test-history-table" className="glass rounded-3xl p-6 border border-white/[0.06] space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Assessment History &amp; Grade Records</h2>
            <p className="text-xs text-slate-400">Comprehensive log of tests, quizzes, and practice submissions</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search style={{ width: '13px', height: '13px', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-field pl-8 py-1.5 text-xs w-44 sm:w-52"
              />
            </div>

            {/* Subject Filter Dropdown */}
            <div className="flex items-center gap-1 bg-slate-900 border border-white/[0.08] rounded-xl px-2 py-1">
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
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Total Marks</th>
                <th className="py-3 px-3">Marks Obtained</th>
                <th className="py-3 px-3">Percentage</th>
                <th className="py-3 px-3">Grade</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredMarks.map((record) => {
                const gradeInfo = calculateGrade(record.percentage);
                return (
                  <tr 
                    key={record.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-3 font-semibold text-white max-w-[240px] truncate">
                      {record.testName}
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      <span className="badge badge-indigo" style={{ fontSize: '9px', textTransform: 'none' }}>
                        {record.subject}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {record.date}
                    </td>
                    <td className="py-3.5 px-3 text-slate-300 font-mono">
                      {record.totalMarks}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white font-mono">
                      {record.obtainedMarks}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white font-mono">
                      {record.percentage}%
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`badge ${gradeInfo.badgeClass}`}>
                        {record.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedRecordForModal(record)}
                        className="btn-secondary py-1 px-2.5 text-[11px] rounded-lg"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredMarks.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No test records match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Test Details Modal ── */}
      {selectedRecordForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="glass rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/[0.1] shadow-2xl space-y-6 animate-scale-in">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="badge badge-emerald text-[9px] mb-1.5">{selectedRecordForModal.subject}</span>
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
                  {selectedRecordForModal.obtainedMarks} <span className="text-sm font-normal text-slate-500">/ {selectedRecordForModal.totalMarks}</span>
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
                className="btn-secondary text-xs py-2 px-4"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedRecordForModal(null);
                  setCurrentView('questions');
                }}
                className="btn-primary text-xs py-2 px-4"
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
