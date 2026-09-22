import React, { useState } from 'react';
import { 
  Plus, Sparkles, Share2, Eye, FileCheck2, BarChart3,
  Clock, ExternalLink, Copy, CheckCircle2, TrendingUp,
  AlertTriangle, Users, Zap, ChevronRight, FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TestBuilderWizard } from './TestBuilderWizard';
import { LiveProctoringHUD } from './LiveProctoringHUD';
import { SubjectiveGradingQueue } from './SubjectiveGradingQueue';
import { MasteryHeatmap } from './MasteryHeatmap';
import { DocumentQuestionImporter } from './DocumentQuestionImporter';
import { BoardType, Question, Test } from '../../types';

export const TeacherConsole: React.FC = () => {
  const { 
    teacherTab, 
    setTeacherTab, 
    tests, 
    attempts, 
    students, 
    launchStudentTestRoom,
    addQuestionsToExistingTest,
    createAndPublishTest
  } = useApp();
  const [selectedTestForShare, setSelectedTestForShare] = useState<Test | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [docImportModal, setDocImportModal] = useState<{
    isOpen: boolean;
    targetTestId?: string;
    targetTestTitle?: string;
    testBoard?: BoardType;
    testGrade?: number;
    testSubject?: string;
  }>({ isOpen: false });

  const handleDocQuestionsImported = (imported: Question[]) => {
    if (docImportModal.targetTestId) {
      addQuestionsToExistingTest(docImportModal.targetTestId, imported);
      setDocImportModal({ isOpen: false });
    } else {
      const totalMarks = imported.reduce((acc, q) => acc + q.marks, 0);
      const accessCode = `DOC-${Math.floor(100 + Math.random() * 900)}`;
      const chapters = Array.from(new Set(imported.map(q => q.chapter).filter(Boolean)));
      const newTest: Test = {
        id: `test_doc_${Date.now()}`,
        title: imported[0]?.chapter ? `${imported[0].chapter} Assessment` : 'Document Ingested Assessment',
        board: docImportModal.testBoard || 'CBSE',
        classGrade: docImportModal.testGrade || 10,
        subject: docImportModal.testSubject || 'Science',
        chapters: chapters.length > 0 ? chapters : ['General Curriculum'],
        totalMarks,
        durationMinutes: 45,
        createdAt: new Date().toISOString(),
        scheduledEnd: new Date(Date.now() + 3600000 * 72).toISOString(),
        status: 'published',
        accessCode,
        shareableLink: window ? `${window.location.origin}/test/token-${accessCode.toLowerCase()}` : `http://localhost:3000/test/token-${accessCode.toLowerCase()}`,
        questions: imported,
        blueprint: {
          chapterWeightages: chapters.map(ch => ({ chapter: ch, marks: Math.round(totalMarks / (chapters.length || 1)) })),
          difficultyMix: { easy: 40, medium: 40, hard: 20 }
        },
        proctoringSettings: {
          enforceFullscreen: true,
          detectTabSwitch: true,
          blockCopyPaste: true,
          maxTabSwitchesAllowed: 3
        }
      };

      createAndPublishTest(newTest);
      setDocImportModal({ isOpen: false });
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const tabs = [
    { id: 'tests', label: `Tests (${tests.length})`, icon: null },
    { id: 'builder', label: 'AI Builder', icon: Sparkles },
    { id: 'proctor', label: 'Live Proctor', icon: Eye },
    { id: 'grading', label: 'Grading', icon: FileCheck2 },
    { id: 'mastery', label: 'Mastery', icon: BarChart3 },
  ] as const;

  const activeStudents = attempts.filter(a => a.status === 'active').length;
  const submissions = attempts.filter(a => a.status === 'submitted').length;
  const violations = attempts.reduce((acc, a) => acc + a.violations.length, 0);
  const atRisk = students.filter(s => s.isAtRisk).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="relative w-11 h-11 rounded-2xl bg-white p-1 shadow-lg flex items-center justify-center border border-white/20 shrink-0 mt-0.5">
            <img src="/logo.png" alt="EduPulse AI Logo" className="w-9 h-9 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="badge badge-emerald">Delhi Public School, R.K. Puram</span>
              <span className="text-xs text-slate-500">• Dr. Ramesh Kulkarni (HOD Science)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Teacher Assessment Hub
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">AI-powered test creation, live proctoring &amp; intelligent analytics</p>
          </div>
        </div>

        {/* Live status strip */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-brand-500/20">
            <div className="status-dot-live" />
            <span className="text-xs font-bold text-brand-400">{activeStudents} Live</span>
          </div>
          {violations > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-amber-500/20 animate-glow-pulse" style={{animationDuration:'2s'}}>
              <AlertTriangle style={{width:'12px',height:'12px',color:'#fbbf24'}} />
              <span className="text-xs font-bold text-amber-400">{violations} Flags</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Sub-Tab Bar ── */}
      <div className="tab-bar overflow-x-auto flex-nowrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setTeacherTab(tab.id)}
            className={`tab-item flex items-center gap-1.5 ${teacherTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon && <tab.icon style={{width:'12px',height:'12px'}} />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Tests Dashboard ── */}
      {teacherTab === 'tests' && (
        <div className="space-y-6 animate-fade-in-up">

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Active Assessments', value: tests.length, sub: 'CBSE / ICSE', color: 'brand' },
              { label: 'Total Submissions', value: submissions, sub: '92% completion', color: 'emerald' },
              { label: 'AI Graded', value: '100%', sub: 'Claude 3.5 Sonnet', color: 'indigo' },
              { label: 'Cheat Flags', value: violations, sub: 'Intercepted', color: 'amber' },
            ].map((stat, i) => (
              <div key={i} className="stat-card" style={{animationDelay:`${i*60}ms`}}>
                <p className="text-[11px] text-slate-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-display font-black text-white">{stat.value}</p>
                <p className={`text-[11px] mt-0.5 font-semibold ${
                  stat.color === 'brand' ? 'text-brand-400' :
                  stat.color === 'emerald' ? 'text-emerald-400' :
                  stat.color === 'indigo' ? 'text-accent-400' : 'text-amber-400'
                }`}>{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Action row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Created Assessments</h3>
              <p className="text-xs text-slate-400">Manage exams, import questions via PDF/Word, or launch proctored sessions</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDocImportModal({ isOpen: true })}
                className="btn-secondary py-2 px-3 text-xs font-bold border-brand-500/30 text-brand-400 hover:bg-brand-500/10"
              >
                <FileText style={{width:'14px',height:'14px'}} />
                <span>Import PDF / Word</span>
              </button>
              <button
                onClick={() => setTeacherTab('builder')}
                className="btn-primary py-2 px-3 text-xs font-bold"
              >
                <Plus style={{width:'14px',height:'14px'}} />
                <span>New AI Test</span>
              </button>
            </div>
          </div>

          {/* Tests grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tests.map((test, i) => {
              const testAttempts = attempts.filter(a => a.testId === test.id);
              const liveCount = testAttempts.filter(a => a.status === 'active').length;
              const testLink = `${window?.location?.origin ?? 'https://edupulse.ai'}/test/token-${test.accessCode.toLowerCase()}`;

              return (
                <div
                  key={test.id}
                  className="glass rounded-3xl p-6 space-y-5 card-glow-hover animate-fade-in-up"
                  style={{animationDelay:`${i*80}ms`}}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="badge badge-emerald" style={{fontSize:'9px'}}>{test.board} · Class {test.classGrade}</span>
                        <span className="badge" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'#64748b',fontSize:'9px'}}>Code: {test.accessCode}</span>
                      </div>
                      <h4 className="font-display font-bold text-base text-white leading-tight">{test.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{test.subject} — {test.chapters.slice(0,2).join(', ')}{test.chapters.length > 2 ? '…' : ''}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {liveCount > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20">
                          <div className="status-dot-live" style={{width:'6px',height:'6px'}} />
                          <span className="text-[10px] font-bold text-brand-400">{liveCount}</span>
                        </div>
                      )}
                      <span className="badge badge-emerald" style={{fontSize:'9px'}}>{test.status}</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/[0.05] text-center text-xs">
                    {[
                      { label: 'Marks', value: `${test.totalMarks}M` },
                      { label: 'Duration', value: `${test.durationMinutes}m` },
                      { label: 'Questions', value: test.questions.length },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <span className="text-[10px] text-slate-500 block">{label}</span>
                        <span className="font-bold text-white">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Submission mini bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Submissions</span>
                      <span className="font-bold text-white">{testAttempts.filter(a=>a.status==='submitted').length} / {testAttempts.length}</span>
                    </div>
                    <div className="mastery-bar">
                      <div
                        className="mastery-bar-fill high"
                        style={{
                          width: testAttempts.length ? `${(testAttempts.filter(a=>a.status==='submitted').length/testAttempts.length)*100}%` : '0%',
                          animationDuration: '0.8s'
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setDocImportModal({
                        isOpen: true,
                        targetTestId: test.id,
                        targetTestTitle: test.title,
                        testBoard: test.board,
                        testGrade: test.classGrade,
                        testSubject: test.subject
                      })}
                      className="btn-secondary text-[11px] py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5 hover:border-brand-500/40 text-slate-300 hover:text-brand-300"
                    >
                      <FileText style={{width:'11px',height:'11px',color:'#34d399'}} />
                      <span>+ Add (PDF/Word)</span>
                    </button>
                    <button
                      onClick={() => setSelectedTestForShare(test)}
                      className="btn-secondary text-[11px] py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5"
                    >
                      <Share2 style={{width:'11px',height:'11px',color:'#10b981'}} />
                      <span>Share Link</span>
                    </button>
                    <button
                      onClick={() => setTeacherTab('proctor')}
                      className="btn-secondary text-[11px] py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5"
                    >
                      <Eye style={{width:'11px',height:'11px',color:'#fbbf24'}} />
                      <span>Live HUD</span>
                    </button>
                    <button
                      onClick={() => launchStudentTestRoom(test.id)}
                      className="btn-primary text-[11px] py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5"
                    >
                      <span>Student View</span>
                      <ExternalLink style={{width:'10px',height:'10px'}} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {teacherTab === 'builder' && <div className="animate-fade-in-up"><TestBuilderWizard onComplete={() => setTeacherTab('tests')} /></div>}
      {teacherTab === 'proctor' && <div className="animate-fade-in-up"><LiveProctoringHUD /></div>}
      {teacherTab === 'grading' && <div className="animate-fade-in-up"><SubjectiveGradingQueue /></div>}
      {teacherTab === 'mastery' && <div className="animate-fade-in-up"><MasteryHeatmap /></div>}

      {/* Share Modal */}
      {selectedTestForShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl p-4">
          <div className="w-full max-w-md glass rounded-3xl shadow-2xl p-6 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Share2 style={{width:'15px',height:'15px',color:'#10b981'}} />
                <h4 className="text-sm font-bold text-white">Share Assessment</h4>
              </div>
              <button onClick={() => setSelectedTestForShare(null)} className="text-slate-500 hover:text-white text-lg transition-colors">×</button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">Secure, single-use test link — no app install or account needed for students.</p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/[0.05] font-mono text-xs text-brand-400 break-all leading-relaxed">
              {`${window?.location?.origin ?? 'https://edupulse.ai'}/test/token-${selectedTestForShare.accessCode.toLowerCase()}`}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCopyLink(`${window?.location?.origin ?? 'https://edupulse.ai'}/test/token-${selectedTestForShare.accessCode.toLowerCase()}`)}
                className="btn-secondary py-2.5 rounded-xl justify-center text-xs"
              >
                <Copy style={{width:'12px',height:'12px'}} />
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Take your assessment: ${window?.location?.origin}/test/token-${selectedTestForShare.accessCode.toLowerCase()}`)}`, '_blank')}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Document Ingestion Modal */}
      {docImportModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass rounded-3xl shadow-2xl p-6 space-y-4 animate-scale-in border border-slate-800">
            <DocumentQuestionImporter
              defaultBoard={docImportModal.testBoard || 'CBSE'}
              defaultGrade={docImportModal.testGrade || 10}
              defaultSubject={docImportModal.testSubject || 'Science'}
              targetTestTitle={docImportModal.targetTestTitle}
              onCancel={() => setDocImportModal({ isOpen: false })}
              onQuestionsImported={handleDocQuestionsImported}
            />
          </div>
        </div>
      )}

    </div>
  );
};
