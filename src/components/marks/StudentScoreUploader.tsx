import React, { useState, useMemo } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3, 
  Trophy, 
  Search, 
  Filter, 
  Printer, 
  Plus, 
  Trash2, 
  Sparkles, 
  Award, 
  TrendingUp, 
  ChevronRight,
  Layers,
  ArrowRight,
  Check,
  FileText,
  User
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useApp } from '../../context/AppContext';
import { STUDENT_SCORE_SERVICE } from '../../services/studentScoreService';
import { StudentScoreBatchItem } from '../../types';
import { calculateGrade } from '../../utils/gradeUtils';

export const StudentScoreUploader: React.FC = () => {
  const { students } = useApp();

  // Active view tab: 'analytics' | 'upload' | 'quick_entry' | 'leaderboard'
  const [activeTab, setActiveTab] = useState<'analytics' | 'upload' | 'quick_entry' | 'leaderboard'>('analytics');

  // Filters
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedExamType, setSelectedExamType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Upload state
  const [pastedCsvText, setPastedCsvText] = useState<string>('');
  const [parsedPreview, setParsedPreview] = useState<StudentScoreBatchItem[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isCommitted, setIsCommitted] = useState(false);

  // Quick Entry Grid state
  const [quickClass, setQuickClass] = useState<number>(10);
  const [quickSection, setQuickSection] = useState<string>('A');
  const [quickSubject, setQuickSubject] = useState<string>('Mathematics');
  const [quickExamType, setQuickExamType] = useState<StudentScoreBatchItem['examType']>('Unit Test');
  const [quickMaxMarks, setQuickMaxMarks] = useState<number>(50);
  const [quickScoresMap, setQuickScoresMap] = useState<Record<string, number>>({});

  // All stored scores
  const allScores = useMemo(() => {
    void refreshTrigger;
    return STUDENT_SCORE_SERVICE.getStoredScores();
  }, [refreshTrigger]);

  // Filtered scores
  const filteredScores = useMemo(() => {
    return allScores.filter(item => {
      const matchSub = selectedSubject === 'all' || item.subject.toLowerCase() === selectedSubject.toLowerCase();
      const matchType = selectedExamType === 'all' || item.examType === selectedExamType;
      const matchSearch = searchQuery.trim() === '' || 
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());

      return matchSub && matchType && matchSearch;
    });
  }, [allScores, selectedSubject, selectedExamType, searchQuery]);

  // Batch stats
  const stats = useMemo(() => {
    return STUDENT_SCORE_SERVICE.computeBatchStats(filteredScores);
  }, [filteredScores]);

  // Grade Distribution Chart data
  const gradeDistributionData = useMemo(() => {
    const grades = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D', 'E'];
    const counts: Record<string, number> = {};
    grades.forEach(g => counts[g] = 0);

    filteredScores.forEach(s => {
      if (counts[s.grade] !== undefined) counts[s.grade]++;
      else counts['D'] = (counts['D'] || 0) + 1;
    });

    return grades.map(grade => ({
      grade,
      students: counts[grade] || 0
    }));
  }, [filteredScores]);

  // Handle CSV Parsing Preview
  const handlePreviewCsv = () => {
    if (!pastedCsvText.trim()) return;
    const { validItems, errors } = STUDENT_SCORE_SERVICE.parseScoreCsv(pastedCsvText);
    setParsedPreview(validItems);
    setParseErrors(errors);
    setIsCommitted(false);
  };

  // Commit Parsed Scores
  const handleCommitUpload = () => {
    if (parsedPreview.length === 0) return;
    STUDENT_SCORE_SERVICE.importScoreBatch(parsedPreview);
    setIsCommitted(true);
    setParsedPreview([]);
    setPastedCsvText('');
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('analytics');
  };

  // Handle File Input (.csv or .txt)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPastedCsvText(content);
        const { validItems, errors } = STUDENT_SCORE_SERVICE.parseScoreCsv(content);
        setParsedPreview(validItems);
        setParseErrors(errors);
      }
    };
    reader.readAsText(file);
  };

  // Download Sample CSV Template
  const handleDownloadSampleCsv = () => {
    const sample = `RollNo,StudentName,Class,Section,Subject,ExamType,MaxMarks,MarksObtained,Remarks
10A-04,Aarav Sharma,10,A,Mathematics,Mid-Term,100,92,Exceptional algebra grasp
10A-07,Diya Patel,10,A,Mathematics,Mid-Term,100,96,Class topper in calculus
10A-11,Ishaan Verma,10,A,Mathematics,Mid-Term,100,78,Solid conceptual foundation
10A-18,Rohan Deshmukh,10,A,Mathematics,Mid-Term,100,66,Recommended for geometry review
10A-02,Aditya Gupta,10,A,Mathematics,Mid-Term,100,42,Needs remedial support`;

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + sample);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Sample_Students_Score_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick Entry Save
  const handleSaveQuickEntry = () => {
    const classStus = students.filter(s => s.classGrade === quickClass && s.section.toUpperCase() === quickSection.toUpperCase());
    const newItems: StudentScoreBatchItem[] = [];
    const today = new Date().toISOString().split('T')[0];

    classStus.forEach(stu => {
      const obtained = quickScoresMap[stu.rollNumber] !== undefined ? quickScoresMap[stu.rollNumber] : 0;
      const percentage = Math.round((obtained / quickMaxMarks) * 100);
      const gradeRes = calculateGrade(percentage);

      newItems.push({
        id: `quick_score_${Date.now()}_${stu.rollNumber}`,
        studentGsid: stu.gsid,
        studentName: stu.name,
        rollNumber: stu.rollNumber,
        classGrade: quickClass,
        section: quickSection,
        subject: quickSubject,
        examName: `${quickSubject} ${quickExamType}`,
        examType: quickExamType,
        date: today,
        maxMarks: quickMaxMarks,
        marksObtained: obtained,
        percentage,
        grade: gradeRes.grade,
        status: percentage >= 33 ? (percentage < 50 ? 'Needs Improvement' : 'Pass') : 'Fail',
        uploadedAt: new Date().toISOString()
      });
    });

    STUDENT_SCORE_SERVICE.importScoreBatch(newItems);
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('analytics');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in-up">
      {/* ── Page Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121824] via-[#0d121c] to-black border border-white/[0.1] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                <span>Institutional Mark Ledger &amp; Score Uploader</span>
              </span>
              <span className="text-slate-400 text-xs font-mono bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/5">
                CBSE 9-Point Grading (A1 - E)
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Students Score Uploading &amp; Class Dashboard
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Import spreadsheets directly from Excel / CSV, rapid teacher score input grid, automated grade histogram analytics, and student merit rank standings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadSampleCsv}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-slate-200 border border-white/10 transition-all flex items-center gap-2 shadow-sm"
              title="Download formatted CSV spreadsheet template"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>CSV Template</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2"
              title="Print official score ledger"
            >
              <Printer className="w-4 h-4" />
              <span>Print Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Evaluated */}
        <div className="bg-[#141821]/80 border border-white/[0.09] rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-2 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Evaluated Tests</span>
            <span className="text-purple-400 font-mono text-[10px] bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-bold">RECORDS</span>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {stats.totalEvaluated}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Across registered batches</div>
        </div>

        {/* Card 2: Batch Average */}
        <div className="bg-[#141821]/80 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-2 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Batch Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {stats.averagePercentage}%
          </div>
          <div className="text-[10px] text-emerald-300/80 font-mono">Highest: {stats.highestPercentage}%</div>
        </div>

        {/* Card 3: Pass Percentage */}
        <div className="bg-[#141821]/80 border border-blue-500/20 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-2 hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-blue-400 font-semibold">
            <span>Pass Rate (&gt;= 33%)</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-blue-400 font-mono">
            {stats.passPercentage}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono">{stats.totalPassed} Passed, {stats.totalFailed} Failed</div>
        </div>

        {/* Card 4: Class Topper */}
        <div className="bg-[#141821]/80 border border-amber-500/20 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-2 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>Rank 1 Topper</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-400 truncate font-display">
            {stats.topperStudent}
          </div>
          <div className="text-[10px] text-amber-300/80 font-mono">Gold Merit Standing</div>
        </div>

        {/* Card 5: Remedial Attention */}
        <div className="bg-[#141821]/80 border border-rose-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-2 col-span-2 sm:col-span-1 hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between text-xs text-rose-400 font-semibold">
            <span>Remedial Review</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400 font-mono">
            {stats.totalFailed}
          </div>
          <div className="text-[10px] text-rose-300/80 font-mono">Score &lt; 35% threshold</div>
        </div>
      </div>

      {/* ── Mode Selection & Action Bar ── */}
      <div className="bg-[#141821]/90 border border-white/[0.09] rounded-3xl p-4 sm:p-6 backdrop-blur-2xl space-y-5 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* View Mode Tabs */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Score Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'upload'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload CSV / Excel</span>
            </button>

            <button
              onClick={() => setActiveTab('quick_entry')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'quick_entry'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Teacher Score Grid</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Merit Rank List</span>
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all font-medium"
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="Social Science">Social Science</option>
            </select>

            <select
              value={selectedExamType}
              onChange={e => setSelectedExamType(e.target.value)}
              className="bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all font-medium"
            >
              <option value="all">All Exam Formats</option>
              <option value="Unit Test">Unit Test</option>
              <option value="Mid-Term">Mid-Term</option>
              <option value="Pre-Board">Pre-Board</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── TAB 1: SCORE DASHBOARD & ANALYTICS ── */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Grade Distribution Bar Chart (7 cols) */}
            <div className="lg:col-span-7 bg-[#141821]/90 border border-white/[0.09] rounded-3xl p-6 backdrop-blur-2xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span>NEP 9-Point Grade Histogram Distribution</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">{filteredScores.length} Student Scores</span>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeDistributionData}>
                    <defs>
                      <linearGradient id="purpleBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#7e22ce" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="grade" stroke="#94a3b8" fontSize={12} fontStyle="bold" />
                    <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '14px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                      labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="students" fill="url(#purpleBarGradient)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-slate-400 text-center font-mono pt-1 border-t border-white/5">
                A1 (&gt;=91%), A2 (81-90%), B1 (71-80%), B2 (61-70%), C1 (51-60%), C2 (41-50%), D (33-40%), E (Fail)
              </div>
            </div>

            {/* Academic Interventions & Topper Spotlight (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* High Achievers */}
              <div className="bg-[#141821]/90 border border-white/[0.09] rounded-3xl p-5 backdrop-blur-2xl shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    <span>Distinction / Olympiad Candidates (&gt;= 90%)</span>
                  </h4>
                </div>
                <div className="space-y-2.5">
                  {filteredScores.filter(s => s.percentage >= 90).slice(0, 3).map(s => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-all">
                      <div>
                        <div className="text-xs font-bold text-white">{s.studentName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.rollNumber} • {s.subject}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-emerald-400 font-mono">{s.percentage}%</div>
                        <div className="text-[10px] text-emerald-300 font-mono">Grade {s.grade}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remedial Focus */}
              <div className="bg-[#141821]/90 border border-rose-500/20 rounded-3xl p-5 backdrop-blur-2xl shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Recommended for Remedial Review (&lt; 50%)</span>
                  </h4>
                </div>
                <div className="space-y-2.5">
                  {filteredScores.filter(s => s.percentage < 50).map(s => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-rose-500/20 hover:border-rose-500/30 transition-all">
                      <div>
                        <div className="text-xs font-bold text-white">{s.studentName}</div>
                        <div className="text-[10px] text-rose-300/80 font-mono">{s.rollNumber} • {s.subject} ({s.marksObtained}/{s.maxMarks})</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-rose-400 font-mono">{s.percentage}%</div>
                        <span className="text-[9px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full font-mono font-bold">Needs Attention</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Detailed Score Ledger Table */}
          <div className="bg-[#141821]/90 border border-white/[0.09] rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl">
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-black/20">
              <h3 className="text-sm font-bold text-white">Student Score Records</h3>
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter student..."
                  className="w-full bg-[#1c2230] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-black/50 text-slate-400 font-semibold border-b border-white/5 uppercase text-[10px] tracking-wider font-mono">
                  <tr>
                    <th className="py-3.5 px-5">Roll No</th>
                    <th className="py-3.5 px-5">Student Name</th>
                    <th className="py-3.5 px-5">Subject</th>
                    <th className="py-3.5 px-5">Exam Type</th>
                    <th className="py-3.5 px-5">Marks Obtained</th>
                    <th className="py-3.5 px-5">Percentage</th>
                    <th className="py-3.5 px-5">Grade</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {filteredScores.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-white text-xs">{item.rollNumber}</td>
                      <td className="py-4 px-5 font-semibold text-white">{item.studentName}</td>
                      <td className="py-4 px-5 text-slate-300">{item.subject}</td>
                      <td className="py-4 px-5 text-slate-400 font-mono text-[11px]">{item.examType}</td>
                      <td className="py-4 px-5 font-mono font-bold text-white">
                        {item.marksObtained} <span className="text-slate-500 font-normal">/ {item.maxMarks}</span>
                      </td>
                      <td className="py-4 px-5 font-mono font-bold text-emerald-400 text-xs">{item.percentage}%</td>
                      <td className="py-4 px-5">
                        <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          {item.grade}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                          item.status === 'Pass' 
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right text-[11px] text-slate-400 italic">
                        {item.remarks || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: UPLOAD CSV / SPREADSHEET ── */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Input CSV & Paste Area */}
          <div className="lg:col-span-5 bg-[#141821]/90 border border-white/[0.09] rounded-3xl p-6 backdrop-blur-2xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Upload Score Spreadsheet</span>
              </h3>
              <button
                onClick={handleDownloadSampleCsv}
                className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Sample Template</span>
              </button>
            </div>

            {/* File Drag and Drop / Selector */}
            <div className="border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-3xl p-8 text-center transition-all bg-black/40 group shadow-inner">
              <Upload className="w-10 h-10 text-slate-500 group-hover:text-purple-400 mx-auto mb-2.5 transition-colors" />
              <div className="text-xs text-white font-bold">Select CSV or Excel Spreadsheet File</div>
              <p className="text-[11px] text-slate-400 mt-1">UTF-8 Comma or Tab Delimited (.csv, .txt)</p>
              <label className="mt-4 inline-block">
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 cursor-pointer transition-all inline-block">
                  Browse Computer
                </span>
              </label>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono"><span className="bg-[#141821] px-3 text-slate-500 font-bold">Or Direct Clipboard Paste</span></div>
            </div>

            {/* Direct Paste Area */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Paste Tabular Data from Excel / Google Sheets
              </label>
              <textarea
                value={pastedCsvText}
                onChange={e => setPastedCsvText(e.target.value)}
                rows={7}
                placeholder="RollNo,StudentName,Class,Section,Subject,ExamType,MaxMarks,MarksObtained&#10;10A-04,Aarav Sharma,10,A,Mathematics,Mid-Term,100,92&#10;10A-07,Diya Patel,10,A,Mathematics,Mid-Term,100,96"
                className="w-full bg-[#1c2230] border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 font-mono resize-none transition-all"
              />
            </div>

            <button
              onClick={handlePreviewCsv}
              disabled={!pastedCsvText.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Validate &amp; Preview Score Rows</span>
            </button>
          </div>

          {/* Right: Validation & Commit Preview */}
          <div className="lg:col-span-7 bg-[#141821]/90 border border-white/[0.09] rounded-3xl p-6 backdrop-blur-2xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3.5">
              <h3 className="text-sm font-bold text-white">
                Validation &amp; Commit Preview ({parsedPreview.length} Valid Records)
              </h3>
              {parsedPreview.length > 0 && (
                <button
                  onClick={handleCommitUpload}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Commit to Database</span>
                </button>
              )}
            </div>

            {/* Error alerts if any */}
            {parseErrors.length > 0 && (
              <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-4 text-xs text-rose-300 space-y-1">
                <strong className="block text-rose-400 font-bold">Input Validation Warnings:</strong>
                {parseErrors.map((err, i) => (
                  <p key={i}>• {err}</p>
                ))}
              </div>
            )}

            {parsedPreview.length > 0 ? (
              <div className="overflow-x-auto max-h-[440px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-black/50 text-slate-400 font-mono text-[10px] uppercase border-b border-white/5">
                    <tr>
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Percent</th>
                      <th className="p-3">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {parsedPreview.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-mono font-bold text-white">{item.rollNumber}</td>
                        <td className="p-3 font-semibold text-white">{item.studentName}</td>
                        <td className="p-3">{item.subject}</td>
                        <td className="p-3 font-mono">{item.marksObtained} / {item.maxMarks}</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">{item.percentage}%</td>
                        <td className="p-3 font-mono font-bold">{item.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500 space-y-3">
                <FileSpreadsheet className="w-12 h-12 mx-auto text-slate-600" />
                <p className="text-xs">Paste score data or upload CSV spreadsheet on the left to preview before saving.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: QUICK TEACHER ENTRY GRID ── */}
      {activeTab === 'quick_entry' && (
        <div className="bg-[#141821]/90 border border-white/[0.09] rounded-3xl p-6 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Live Teacher Score Sheet Mode</h3>
              <p className="text-xs text-slate-400 mt-0.5">Rapid numerical entry with instant dynamic percentage and grade calculation.</p>
            </div>

            <button
              onClick={handleSaveQuickEntry}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Class Scores</span>
            </button>
          </div>

          {/* Configuration Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Class</label>
              <select
                value={quickClass}
                onChange={e => setQuickClass(Number(e.target.value))}
                className="w-full bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all font-medium"
              >
                <option value={7}>Class 7</option>
                <option value={8}>Class 8</option>
                <option value={9}>Class 9</option>
                <option value={10}>Class 10</option>
                <option value={11}>Class 11</option>
                <option value={12}>Class 12</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Section</label>
              <select
                value={quickSection}
                onChange={e => setQuickSection(e.target.value)}
                className="w-full bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all font-medium"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Subject</label>
              <select
                value={quickSubject}
                onChange={e => setQuickSubject(e.target.value)}
                className="w-full bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all font-medium"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Social Science">Social Science</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Exam Type</label>
              <select
                value={quickExamType}
                onChange={e => setQuickExamType(e.target.value as any)}
                className="w-full bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all font-medium"
              >
                <option value="Unit Test">Unit Test</option>
                <option value="Mid-Term">Mid-Term</option>
                <option value="Pre-Board">Pre-Board</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Max Marks</label>
              <input
                type="number"
                value={quickMaxMarks}
                onChange={e => setQuickMaxMarks(Number(e.target.value))}
                min={10}
                max={100}
                className="w-full bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Spreadsheet Entry Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-black/50 text-slate-400 font-mono text-[10px] uppercase border-b border-white/5">
                <tr>
                  <th className="p-3.5">Roll No</th>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Marks Obtained (Out of {quickMaxMarks})</th>
                  <th className="p-3.5">Calculated %</th>
                  <th className="p-3.5">Assigned Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {students.filter(s => s.classGrade === quickClass && s.section.toUpperCase() === quickSection.toUpperCase()).map((stu) => {
                  const val = quickScoresMap[stu.rollNumber] !== undefined ? quickScoresMap[stu.rollNumber] : '';
                  const numVal = typeof val === 'number' ? val : 0;
                  const pct = Math.round((numVal / (quickMaxMarks || 1)) * 100);
                  const grade = calculateGrade(pct).grade;

                  return (
                    <tr key={stu.gsid} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5 font-mono font-bold text-white text-xs">{stu.rollNumber}</td>
                      <td className="p-3.5 font-semibold text-white">{stu.name}</td>
                      <td className="p-3.5">
                        <input
                          type="number"
                          value={val}
                          onChange={e => {
                            const v = Math.min(Number(e.target.value), quickMaxMarks);
                            setQuickScoresMap({ ...quickScoresMap, [stu.rollNumber]: v });
                          }}
                          placeholder="0"
                          max={quickMaxMarks}
                          min={0}
                          className="w-36 bg-[#1c2230] border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                        />
                      </td>
                      <td className="p-3.5 font-mono font-bold text-emerald-400 text-xs">{pct}%</td>
                      <td className="p-3.5 font-mono font-bold">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-200">
                          {grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: MERIT RANK LIST ── */}
      {activeTab === 'leaderboard' && (
        <div className="bg-[#141821]/90 border border-white/[0.09] rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl space-y-4 p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Class Merit Order &amp; Rank Standings</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Rankings calculated across active examination results.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-black/50 text-slate-400 font-mono text-[10px] uppercase border-b border-white/5">
                <tr>
                  <th className="p-3.5 text-center">Rank</th>
                  <th className="p-3.5">Roll No</th>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5">Score</th>
                  <th className="p-3.5">Percentage</th>
                  <th className="p-3.5">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {[...filteredScores].sort((a, b) => b.percentage - a.percentage).map((item, index) => {
                  const rank = index + 1;
                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5 text-center font-mono font-bold">
                        {rank === 1 && (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-black font-black text-xs shadow-lg shadow-amber-500/40">
                            1
                          </span>
                        )}
                        {rank === 2 && (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-black font-black text-xs shadow-lg shadow-slate-300/30">
                            2
                          </span>
                        )}
                        {rank === 3 && (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white font-black text-xs shadow-lg shadow-amber-700/30">
                            3
                          </span>
                        )}
                        {rank > 3 && <span className="text-slate-400 font-mono font-semibold">#{rank}</span>}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-white text-xs">{item.rollNumber}</td>
                      <td className="p-3.5 font-semibold text-white">{item.studentName}</td>
                      <td className="p-3.5 text-slate-300">{item.subject}</td>
                      <td className="p-3.5 font-mono">{item.marksObtained} / {item.maxMarks}</td>
                      <td className="p-3.5 font-mono font-bold text-emerald-400 text-xs">{item.percentage}%</td>
                      <td className="p-3.5 font-mono font-bold">
                        <span className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                          {item.grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
