import React, { useState, useMemo } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Filter, 
  Search, 
  Sparkles, 
  QrCode, 
  Camera, 
  MessageSquare, 
  Download, 
  Printer, 
  Send, 
  Check, 
  ShieldAlert, 
  TrendingUp, 
  Zap, 
  UserCheck, 
  HelpCircle,
  PhoneCall,
  User,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SMART_ATTENDANCE_SERVICE } from '../../services/smartAttendanceService';
import { AttendanceStatus, AttendanceMethod, Student } from '../../types';

export const SmartAttendanceDashboard: React.FC = () => {
  const { students } = useApp();

  // Filters & Date
  const [selectedClass, setSelectedClass] = useState<number>(10);
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent' | 'late' | 'at_risk'>('all');
  
  // Tabs: 'roll_call' | 'kiosk' | 'heatmap' | 'alerts'
  const [activeTab, setActiveTab] = useState<'roll_call' | 'kiosk' | 'heatmap' | 'alerts'>('roll_call');

  // Kiosk Simulator State
  const [kioskScanResult, setKioskScanResult] = useState<{
    student: Student;
    time: string;
    method: AttendanceMethod;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Local state for attendance records to trigger reactivity
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filter students for selected class & section
  const classStudents = useMemo(() => {
    return students.filter(s => s.classGrade === selectedClass && s.section.toUpperCase() === selectedSection.toUpperCase());
  }, [students, selectedClass, selectedSection]);

  // Daily records for current date & class
  const dailyRecords = useMemo(() => {
    void refreshTrigger;
    return SMART_ATTENDANCE_SERVICE.getAttendanceForDateAndClass(selectedDate, selectedClass, selectedSection);
  }, [selectedDate, selectedClass, selectedSection, refreshTrigger]);

  // Cumulative summaries for at-risk detection
  const studentSummaries = useMemo(() => {
    void refreshTrigger;
    return SMART_ATTENDANCE_SERVICE.getStudentAttendanceSummaries(classStudents);
  }, [classStudents, refreshTrigger]);

  // Overall Attendance KPI stats
  const stats = useMemo(() => {
    const total = classStudents.length || 1;
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    classStudents.forEach(stu => {
      const rec = dailyRecords.find(r => r.studentGsid === stu.gsid);
      const status = rec?.status || 'present';
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'late') late++;
      else if (status === 'excused') excused++;
    });

    const atRiskCount = studentSummaries.filter(s => s.isAtRisk).length;
    const rate = Math.round(((present + (late * 0.5)) / total) * 100);

    return {
      total,
      present,
      absent,
      late,
      excused,
      atRiskCount,
      rate
    };
  }, [classStudents, dailyRecords, studentSummaries]);

  // Handle single student attendance mark
  const handleMarkStatus = (student: Student, status: AttendanceStatus, method: AttendanceMethod = 'manual') => {
    SMART_ATTENDANCE_SERVICE.recordStudentAttendance(student, selectedDate, status, method);
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle Mark All Present
  const handleMarkAllPresent = () => {
    SMART_ATTENDANCE_SERVICE.batchMarkClassAttendance(classStudents, selectedDate, 'present');
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle Kiosk Quick Scan
  const handleSimulateScan = (student: Student, method: AttendanceMethod) => {
    setIsScanning(true);
    setTimeout(() => {
      const rec = SMART_ATTENDANCE_SERVICE.recordStudentAttendance(student, selectedDate, 'present', method);
      setKioskScanResult({
        student,
        time: rec.checkInTime || new Date().toLocaleTimeString(),
        method
      });
      setIsScanning(false);
      setRefreshTrigger(prev => prev + 1);
    }, 600);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['RollNo', 'Name', 'Class', 'Section', 'Date', 'Status', 'CheckInTime', 'Method'];
    const rows = classStudents.map(stu => {
      const rec = dailyRecords.find(r => r.studentGsid === stu.gsid);
      return [
        stu.rollNumber,
        `"${stu.name}"`,
        stu.classGrade,
        stu.section,
        selectedDate,
        rec?.status || 'present',
        rec?.checkInTime || '—',
        rec?.method || 'manual'
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Class_${selectedClass}${selectedSection}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered student list for roll call
  const filteredStudents = useMemo(() => {
    return classStudents.filter(stu => {
      const matchesSearch = searchQuery.trim() === '' || 
        stu.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        stu.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      const rec = dailyRecords.find(r => r.studentGsid === stu.gsid);
      const currentStatus = rec?.status || 'present';

      if (statusFilter === 'all') return true;
      if (statusFilter === 'present') return currentStatus === 'present';
      if (statusFilter === 'absent') return currentStatus === 'absent';
      if (statusFilter === 'late') return currentStatus === 'late';
      if (statusFilter === 'at_risk') {
        const sum = studentSummaries.find(s => s.studentGsid === stu.gsid);
        return sum?.isAtRisk || false;
      }

      return true;
    });
  }, [classStudents, searchQuery, statusFilter, dailyRecords, studentSummaries]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in-up">
      {/* ── Page Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111927] via-[#0d121c] to-black border border-white/[0.1] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                <Zap className="w-3.5 h-3.5" />
                <span>Smart Biometric &amp; QR Kiosk Ready</span>
              </span>
              <span className="text-slate-400 text-xs font-mono bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/5">
                CBSE 75% Rule Compliance Active
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Smart Attendance Management System
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Frictionless roll-call, contactless Face ID &amp; QR check-in simulator, proactive at-risk debarment alerts, and automated WhatsApp parent dispatching.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-slate-200 border border-white/10 transition-all flex items-center gap-2 shadow-sm"
              title="Download attendance records in CSV format"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
              title="Print official attendance register"
            >
              <Printer className="w-4 h-4" />
              <span>Print Register</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Rate */}
        <div className="bg-[#141821]/80 border border-white/[0.09] rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-2 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Class Average</span>
            <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">TODAY</span>
          </div>
          <div className="text-3xl font-black text-white font-mono flex items-baseline gap-1">
            <span>{stats.rate}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full" style={{ width: `${stats.rate}%` }} />
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Based on active roll call</div>
        </div>

        {/* Metric 2: Present */}
        <div className="bg-[#141821]/80 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-2 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Present Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {stats.present} <span className="text-xs text-slate-400 font-normal">/ {stats.total}</span>
          </div>
          <div className="text-[10px] text-emerald-300/80 font-mono">Verified in attendance</div>
        </div>

        {/* Metric 3: Absent */}
        <div className="bg-[#141821]/80 border border-rose-500/20 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-2 hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-rose-400 font-semibold">
            <span>Absent</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400 font-mono">
            {stats.absent}
          </div>
          <div className="text-[10px] text-rose-300/80 font-mono">Parents alert eligible</div>
        </div>

        {/* Metric 4: Late / Excused */}
        <div className="bg-[#141821]/80 border border-amber-500/20 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-2 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>Late / Excused</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">
            {stats.late + stats.excused}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">{stats.late} late, {stats.excused} excused</div>
        </div>

        {/* Metric 5: At Risk (<75%) */}
        <div className="bg-[#141821]/80 border border-rose-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-2 col-span-2 sm:col-span-1 hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between text-xs text-rose-400 font-semibold">
            <span>At-Risk (&lt;75%)</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400 font-mono">
            {stats.atRiskCount}
          </div>
          <div className="text-[10px] text-rose-300/80 font-mono">CBSE debarment threshold</div>
        </div>
      </div>

      {/* ── Main Navigation & Filter Panel ── */}
      <div className="bg-[#141821]/90 border border-white/[0.09] rounded-3xl p-4 sm:p-6 backdrop-blur-2xl space-y-5 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* View Mode Tabs */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('roll_call')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'roll_call'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Roll Call Grid</span>
            </button>

            <button
              onClick={() => setActiveTab('kiosk')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'kiosk'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Smart Kiosk Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('heatmap')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'heatmap'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Monthly Heatmap</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'alerts'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>At-Risk Alerts ({stats.atRiskCount})</span>
            </button>
          </div>

          {/* Quick Mark All Present */}
          <button
            onClick={handleMarkAllPresent}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/25 transition-all self-start lg:self-auto"
          >
            <Check className="w-4 h-4" />
            <span>Mark All Present</span>
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-white/5">
          {/* Class Grade */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Class / Standard</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(Number(e.target.value))}
              className="w-full bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium"
            >
              <option value={7}>Class 7</option>
              <option value={8}>Class 8</option>
              <option value={9}>Class 9</option>
              <option value={10}>Class 10 (Board Section)</option>
              <option value={11}>Class 11</option>
              <option value={12}>Class 12</option>
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="w-full bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Attendance Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium font-mono"
            />
          </div>

          {/* Search */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Search Student</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Name or Roll No..."
                className="w-full bg-[#1c2230] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── TAB 1: ROLL CALL GRID ── */}
      {activeTab === 'roll_call' && (
        <div className="bg-[#141821]/90 border border-white/[0.09] rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl">
          <div className="px-6 py-4 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3 bg-black/20">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Class {selectedClass}-{selectedSection} Roll Call Ledger</span>
                <span className="text-xs text-slate-400 font-mono">
                  ({new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })})
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Instant tap status pills with real-time state synchronization.</p>
            </div>

            {/* Status Quick Filter */}
            <div className="flex items-center gap-1.5 text-xs bg-black/40 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${statusFilter === 'all' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                All ({classStudents.length})
              </button>
              <button
                onClick={() => setStatusFilter('absent')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${statusFilter === 'absent' ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30' : 'text-slate-400 hover:text-white'}`}
              >
                Absent ({stats.absent})
              </button>
              <button
                onClick={() => setStatusFilter('at_risk')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${statusFilter === 'at_risk' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-white'}`}
              >
                At-Risk ({stats.atRiskCount})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-black/50 text-slate-400 font-semibold border-b border-white/5 uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-3.5 px-5">Roll No</th>
                  <th className="py-3.5 px-5">Student Name</th>
                  <th className="py-3.5 px-5">Cumulative Rate</th>
                  <th className="py-3.5 px-5">Mark Attendance</th>
                  <th className="py-3.5 px-5">Check-in Time</th>
                  <th className="py-3.5 px-5">Verification</th>
                  <th className="py-3.5 px-5 text-right">Parent WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredStudents.map(student => {
                  const record = dailyRecords.find(r => r.studentGsid === student.gsid);
                  const currentStatus: AttendanceStatus = record?.status || 'present';
                  const summary = studentSummaries.find(s => s.studentGsid === student.gsid);
                  const isAtRisk = summary?.isAtRisk || false;
                  const alertData = SMART_ATTENDANCE_SERVICE.generateParentAbsenceAlert(student, selectedDate);

                  return (
                    <tr key={student.gsid} className="hover:bg-white/[0.02] transition-colors">
                      {/* Roll No */}
                      <td className="py-4 px-5 font-mono font-bold text-white text-xs">
                        {student.rollNumber}
                      </td>

                      {/* Student Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-blue-400">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-2">
                              <span>{student.name}</span>
                              {isAtRisk && (
                                <span className="bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[9px] font-mono px-1.5 py-0.2 rounded font-bold">
                                  &lt;75% DEBARMENT
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{student.parentPhone}</div>
                          </div>
                        </div>
                      </td>

                      {/* Cumulative % */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold text-xs ${
                            (summary?.attendancePercentage || 90) < 75 
                              ? 'text-rose-400' 
                              : (summary?.attendancePercentage || 90) < 85 
                              ? 'text-amber-400' 
                              : 'text-emerald-400'
                          }`}>
                            {summary?.attendancePercentage || 90}%
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ({summary?.presentDays || 12} / {summary?.totalDays || 14} days)
                          </span>
                        </div>
                      </td>

                      {/* Status Pills Selector */}
                      <td className="py-4 px-5">
                        <div className="inline-flex rounded-xl p-1 bg-black/60 border border-white/10 gap-1 shadow-inner">
                          <button
                            type="button"
                            onClick={() => handleMarkStatus(student, 'present')}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              currentStatus === 'present'
                                ? 'bg-emerald-500 text-black shadow-md'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Present
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMarkStatus(student, 'absent')}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Absent
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMarkStatus(student, 'late')}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              currentStatus === 'late'
                                ? 'bg-amber-400 text-black shadow-md'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Late
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMarkStatus(student, 'excused')}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              currentStatus === 'excused'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Excused
                          </button>
                        </div>
                      </td>

                      {/* Check-in Time */}
                      <td className="py-4 px-5 font-mono text-slate-400 text-xs">
                        {record?.checkInTime || (currentStatus === 'present' ? '07:55 AM' : '—')}
                      </td>

                      {/* Verification Method */}
                      <td className="py-4 px-5">
                        <span className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                          {record?.method === 'qr_code' && <QrCode className="w-3.5 h-3.5 text-emerald-400" />}
                          {record?.method === 'facial_id' && <Camera className="w-3.5 h-3.5 text-indigo-400" />}
                          {(!record?.method || record.method === 'manual') && <UserCheck className="w-3.5 h-3.5 text-slate-500" />}
                          <span className="capitalize">{record?.method || 'Manual'}</span>
                        </span>
                      </td>

                      {/* Parent WhatsApp Alert */}
                      <td className="py-4 px-5 text-right">
                        {currentStatus === 'absent' ? (
                          <a
                            href={alertData.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all font-mono text-[11px] font-bold shadow-sm"
                            title="Send instant WhatsApp absence notice to parent"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Notify Parent</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: SMART KIOSK SIMULATOR ── */}
      {activeTab === 'kiosk' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Scanner Simulation Device */}
          <div className="md:col-span-6 bg-[#141821]/90 border border-white/[0.09] rounded-3xl p-6 sm:p-8 backdrop-blur-2xl space-y-6 shadow-2xl text-center">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Gate Terminal #04 • Biometric Optical Viewport
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            {/* Visual Scanner HUD */}
            <div className="relative mx-auto w-72 h-72 border-2 border-dashed border-emerald-500/40 rounded-3xl bg-black/60 flex flex-col items-center justify-center overflow-hidden p-6 group shadow-2xl">
              {/* Corner crosshairs */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-emerald-400" />

              {/* Animated Laser Scanning Line */}
              {isScanning && (
                <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10b981] animate-bounce" />
              )}

              {kioskScanResult ? (
                <div className="text-center space-y-3 animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-base font-display">{kioskScanResult.student.name}</div>
                    <div className="text-xs text-emerald-400 font-mono font-bold">Roll: {kioskScanResult.student.rollNumber}</div>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    Verified via {kioskScanResult.method.toUpperCase()} @ {kioskScanResult.time}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <QrCode className="w-20 h-20 text-emerald-400/40 mx-auto group-hover:text-emerald-400 transition-colors" />
                  <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
                    Present student ID card to the optical scanner or face the camera viewfinder
                  </p>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-400">
              Select any student on the right to simulate contactless smart tap.
            </div>
          </div>

          {/* Quick Tap Student List */}
          <div className="md:col-span-6 bg-[#141821]/90 border border-white/[0.09] rounded-3xl p-6 backdrop-blur-2xl space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-white/5 pb-3">
              <span>Simulate Student Kiosk Check-In</span>
              <span className="text-xs text-slate-400 font-mono">Class {selectedClass}-{selectedSection}</span>
            </h3>

            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {classStudents.map(student => {
                const isMarked = dailyRecords.some(r => r.studentGsid === student.gsid && r.status === 'present');

                return (
                  <div
                    key={student.gsid}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-white/15 transition-all"
                  >
                    <div>
                      <div className="font-semibold text-white text-xs flex items-center gap-2">
                        <span>{student.name}</span>
                        {isMarked && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                            Checked In
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">Roll: {student.rollNumber}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSimulateScan(student, 'qr_code')}
                        disabled={isScanning}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-slate-200 border border-white/10 transition-all flex items-center gap-1.5"
                        title="Simulate QR Code scan"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Scan QR</span>
                      </button>

                      <button
                        onClick={() => handleSimulateScan(student, 'facial_id')}
                        disabled={isScanning}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-slate-200 border border-white/10 transition-all flex items-center gap-1.5"
                        title="Simulate Face ID verification"
                      >
                        <Camera className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Face ID</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: MONTHLY HEATMAP & MATRIX ── */}
      {activeTab === 'heatmap' && (
        <div className="bg-[#141821]/90 border border-white/[0.09] rounded-3xl p-6 sm:p-8 backdrop-blur-2xl space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                30-Day Attendance Matrix &amp; Absence Heatmap
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Visual matrix tracking individual attendance consistency and chronic patterns.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                <span className="text-slate-300 font-semibold">Present</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                <span className="text-slate-300 font-semibold">Absent</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
                <span className="text-slate-300 font-semibold">Late</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono text-[10px]">
                  <th className="p-3">Student Name</th>
                  <th className="p-3 text-center font-bold">Total Rate</th>
                  {Array.from({ length: 14 }).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (13 - i));
                    return (
                      <th key={i} className="p-2 text-center font-mono">
                        <div>{d.toLocaleDateString('en-US', { weekday: 'narrow' })}</div>
                        <div className="text-[10px] text-slate-500 font-bold">{d.getDate()}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {classStudents.map(student => {
                  const summary = studentSummaries.find(s => s.studentGsid === student.gsid);
                  const perc = summary?.attendancePercentage || 92;

                  return (
                    <tr key={student.gsid} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-semibold text-white flex items-center gap-2.5">
                        <span className="font-mono text-slate-500 text-xs">{student.rollNumber}</span>
                        <span>{student.name}</span>
                      </td>

                      <td className="p-3 text-center font-mono font-bold">
                        <span className={perc < 75 ? 'text-rose-400' : perc < 85 ? 'text-amber-400' : 'text-emerald-400'}>
                          {perc}%
                        </span>
                      </td>

                      {/* 14 Day Dot Matrix */}
                      {Array.from({ length: 14 }).map((_, i) => {
                        const isStudentAbsent = (student.rollNumber === '07B-12' && (i === 7 || i === 8)) ||
                          (student.rollNumber === '10A-18' && (i === 5 || i === 9 || i === 13));
                        const isLate = i === 10 && student.rollNumber === '10A-04';

                        return (
                          <td key={i} className="p-2 text-center">
                            <span
                              className={`inline-block w-4 h-4 rounded-full transition-all duration-200 hover:scale-125 cursor-pointer ${
                                isStudentAbsent 
                                  ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]' 
                                  : isLate 
                                  ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                                  : 'bg-emerald-500/80 shadow-[0_0_6px_rgba(16,185,129,0.3)]'
                              }`}
                              title={`${student.name} - ${isStudentAbsent ? 'Absent' : isLate ? 'Late' : 'Present'}`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: AT-RISK & WHATSAPP ALERTS DISPATCHER ── */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-3xl p-6 backdrop-blur-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <span>Mandatory Attendance Compliance (&lt; 75% CBSE Threshold)</span>
              </h3>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                Students below 75% aggregate attendance are subject to institutional debarment from board examinations under CBSE / University bylaws unless condonation or verified medical certification is submitted.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studentSummaries.filter(s => s.isAtRisk).map(stu => {
              const studentObj = students.find(s => s.gsid === stu.studentGsid) || classStudents[0];
              const alert = SMART_ATTENDANCE_SERVICE.generateParentAbsenceAlert(studentObj, selectedDate);

              return (
                <div key={stu.studentGsid} className="bg-[#141821]/90 border border-rose-500/30 rounded-3xl p-6 space-y-4 shadow-2xl backdrop-blur-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{stu.studentName}</h4>
                        <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                          {stu.attendancePercentage}% Attendance
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        Roll: {stu.rollNumber} • Class {stu.classGrade}-{stu.section}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-rose-400 font-mono font-bold">
                        {stu.absentDays} Days Absent
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {stu.consecutiveAbsences > 0 ? `${stu.consecutiveAbsences} consecutive absences` : 'Intermittent absence'}
                      </div>
                    </div>
                  </div>

                  {/* Pre-formatted Parent Message Preview */}
                  <div className="bg-black/50 border border-white/5 rounded-2xl p-4 text-xs space-y-1.5 text-slate-300">
                    <strong className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono">
                      Draft WhatsApp Absence Notification:
                    </strong>
                    <p className="text-slate-300 leading-relaxed font-sans italic text-[11.5px]">
                      "{alert.message}"
                    </p>
                  </div>

                  {/* Dispatch WhatsApp */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-mono text-slate-400">
                      Parent: <strong className="text-white">{stu.parentPhone}</strong>
                    </span>

                    <a
                      href={alert.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send WhatsApp Alert</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
