import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle2, ChevronRight, ChevronLeft, Send,
  AlertTriangle, Wifi, WifiOff, UserCheck, Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProctorGuard } from './ProctorGuard';
import { ResultDiagnosticSheet } from './ResultDiagnosticSheet';
import { ProctorViolation, StudentAnswer, TestAttempt } from '../../types';

export const StudentTestRoom: React.FC = () => {
  const { activeTestToTake, submitStudentTest, setCurrentView } = useApp();

  const [studentName, setStudentName] = useState('Aarav Sharma');
  const [rollNumber, setRollNumber] = useState('10A-04');
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAttempt, setSubmittedAttempt] = useState<TestAttempt | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [qId: string]: { text: string; optId?: string } }>({});
  const [violations, setViolations] = useState<ProctorViolation[]>([]);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(2700);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const test = activeTestToTake;

  useEffect(() => {
    if (!isTestStarted || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) { clearInterval(timer); handleSubmitTest(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTestStarted, isSubmitted]);

  useEffect(() => {
    if (test) setTimeRemainingSeconds(test.durationMinutes * 60);
  }, [test]);

  if (!test) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-5 px-4">
        <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-white/[0.06] flex items-center justify-center mx-auto">
          <AlertTriangle style={{width:'28px',height:'28px',color:'#fbbf24'}} />
        </div>
        <h2 className="text-xl font-display font-bold text-white">No Active Test Link</h2>
        <p className="text-sm text-slate-400">Ask your teacher to share the assessment link with you.</p>
        <button onClick={() => setCurrentView('marketing')} className="btn-primary mx-auto">
          <span>Return to Home</span>
        </button>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQIndex];
  const answeredCount = Object.keys(answers).length;
  const pct = Math.round((answeredCount / test.questions.length) * 100);
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const isLowTime = timeRemainingSeconds < 300;

  const handleSelectOption = (qId: string, optId: string, optText: string) => {
    setAnswers(prev => ({ ...prev, [qId]: { text: optText, optId } }));
  };

  const handleTextChange = (qId: string, text: string) => {
    setAnswers(prev => ({ ...prev, [qId]: { text, optId: prev[qId]?.optId } }));
  };

  const handleViolationLogged = (v: Omit<ProctorViolation, 'id' | 'timestamp'>) => {
    setViolations(prev => [...prev, { ...v, id: `v_${Date.now()}`, timestamp: new Date().toISOString() }]);
  };

  const handleSubmitTest = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const timeSpent = (test.durationMinutes * 60) - timeRemainingSeconds;
      const formattedAnswers: StudentAnswer[] = test.questions.map(q => ({
        questionId: q.id,
        answerText: answers[q.id]?.text || '',
        selectedOptionId: answers[q.id]?.optId,
      }));
      const result = submitStudentTest({ studentName, rollNumber, answers: formattedAnswers, violations, timeSpentSeconds: timeSpent });
      setSubmittedAttempt(result);
      setIsSubmitted(true);
      setShowSubmitModal(false);
      setIsSubmitting(false);
    }, 800);
  };

  /* ── 1. Entry / Registration screen ── */
  if (!isTestStarted) {
    return (
      <div className="max-w-lg mx-auto py-14 px-4 animate-fade-in-up">
        <div className="glass-emerald rounded-3xl p-8 space-y-6 shadow-2xl">

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="relative w-16 h-16 rounded-2xl bg-white p-1 shadow-xl mx-auto flex items-center justify-center border border-white/30 animate-soft-bounce">
              <img src="/logo.png" alt="EduPulse AI Logo" className="w-14 h-14 object-contain" />
            </div>
            <div>
              <span className="badge badge-emerald text-[10px]">{test.board} • CLASS {test.classGrade}</span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1">EduPulse AI Assessment Room</p>
            </div>
            <h2 className="text-2xl font-display font-black text-white leading-tight">{test.title}</h2>
            <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
              <span>{test.subject}</span>
              <span className="text-slate-700">•</span>
              <span className="font-bold text-white">{test.totalMarks} Marks</span>
              <span className="text-slate-700">•</span>
              <span className="font-bold text-white">{test.durationMinutes} Min</span>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Student Full Name</label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Roll Number / Section</label>
              <input
                type="text"
                value={rollNumber}
                onChange={e => setRollNumber(e.target.value)}
                className="input-field"
                placeholder="e.g. 10A-04"
              />
            </div>
          </div>

          {/* Guidelines */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/[0.05] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-2">
              <Shield style={{width:'13px',height:'13px',color:'#f59e0b'}} />
              Assessment Guidelines
            </div>
            {[
              'Do not leave the fullscreen window during the assessment.',
              'Browser tab switches are recorded and reviewed by your teacher.',
              'Responses are auto-saved locally if your internet connection drops.',
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-slate-400">
                <span className="w-4 h-4 rounded-full bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[9px]">{i+1}</span>
                {rule}
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsTestStarted(true)}
            disabled={!studentName.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.01] hover:shadow-brand-500/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <UserCheck style={{width:'16px',height:'16px'}} />
            Begin Assessment Now
          </button>
        </div>
      </div>
    );
  }

  /* ── 2. Results ── */
  if (isSubmitted && submittedAttempt) {
    return (
      <ResultDiagnosticSheet
        attempt={submittedAttempt}
        test={test}
        onRetakeOrExit={() => { setIsTestStarted(false); setIsSubmitted(false); setCurrentView('marketing'); }}
      />
    );
  }

  /* ── 3. Active Test Canvas ── */
  return (
    <ProctorGuard
      enforceFullscreen={test.proctoringSettings.enforceFullscreen}
      detectTabSwitch={test.proctoringSettings.detectTabSwitch}
      blockCopyPaste={test.proctoringSettings.blockCopyPaste}
      onViolation={handleViolationLogged}
    >
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

        {/* Top HUD Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl glass border border-white/[0.06]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-white p-0.5 shadow-sm flex items-center justify-center">
                <img src="/logo.png" alt="EduPulse Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-display font-black text-xs text-white hidden md:inline">
                Edu<span className="gradient-text-emerald">Pulse</span>
              </span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-white truncate">{studentName}</span>
              <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">({rollNumber})</span>
            </div>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                isOfflineSimulated
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                  : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
              }`}
            >
              {isOfflineSimulated
                ? <><WifiOff style={{width:'11px',height:'11px'}} /> Offline Queue Active</>
                : <><Wifi style={{width:'11px',height:'11px'}} /> Online · 25ms</>
              }
            </button>
          </div>

          <div className="flex items-center gap-2">
            {violations.length > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle style={{width:'11px',height:'11px',color:'#fbbf24'}} />
                <span className="text-[10px] font-bold text-amber-400">{violations.length} Flag{violations.length > 1 ? 's' : ''}</span>
              </div>
            )}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all ${
              isLowTime
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 animate-glow-pulse'
                : 'bg-slate-900 border-white/[0.06] text-brand-400'
            }`}>
              <Clock style={{width:'12px',height:'12px'}} />
              {String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}
            </div>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="btn-primary py-1.5 px-3 rounded-xl"
            >
              <Send style={{width:'11px',height:'11px'}} />
              <span>Submit</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{answeredCount} of {test.questions.length} answered</span>
            <span className="font-bold text-white">{pct}%</span>
          </div>
          <div className="mastery-bar" style={{height:'4px'}}>
            <div
              className="mastery-bar-fill high"
              style={{width:`${pct}%`, animation:'none', transition:'width 0.4s ease'}}
            />
          </div>
        </div>

        {/* Question Number Palette */}
        <div className="p-3 rounded-2xl glass border border-white/[0.05] flex items-center gap-1.5 overflow-x-auto">
          {test.questions.map((q, idx) => {
            const hasAnswer = Boolean(answers[q.id]?.text);
            const isCurrent = idx === currentQIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQIndex(idx)}
                className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 transition-all duration-200 ${
                  isCurrent
                    ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/30 scale-110'
                    : hasAnswer
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/35'
                    : 'bg-slate-950/60 text-slate-500 border border-white/[0.05] hover:border-white/[0.12] hover:text-slate-300'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div key={currentQIndex} className="glass-emerald rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in-up shadow-xl">
            
            {/* Q header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="badge badge-emerald" style={{fontSize:'10px'}}>
                  Q{currentQIndex + 1} / {test.questions.length}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{currentQuestion.chapter}</span>
                {currentQuestion.bloomsLevel && (
                  <span className="badge badge-indigo" style={{fontSize:'9px'}}>{currentQuestion.bloomsLevel}</span>
                )}
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-white/[0.06] text-xs font-bold text-white">
                {currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
              </span>
            </div>

            {/* Question text */}
            <p className="text-base sm:text-lg font-medium text-white whitespace-pre-line leading-relaxed">
              {currentQuestion.questionText}
            </p>

            {/* MCQ Options */}
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              <div className="space-y-3">
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = answers[currentQuestion.id]?.optId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQuestion.id, opt.id, opt.text)}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all duration-200 ${
                        isSelected
                          ? 'bg-brand-500/15 border-brand-500/60 text-white shadow-md shadow-brand-500/10'
                          : 'bg-slate-950/50 border-white/[0.06] text-slate-300 hover:border-white/[0.14] hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'bg-brand-500 text-slate-950' : 'bg-slate-900 border border-white/[0.08] text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm leading-snug">{opt.text}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? 'bg-brand-500 border-brand-500' : 'border-slate-700'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Subjective textarea */
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Write your detailed answer below:</span>
                  <span className="font-mono">{(answers[currentQuestion.id]?.text || '').split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  rows={6}
                  value={answers[currentQuestion.id]?.text || ''}
                  onChange={e => handleTextChange(currentQuestion.id, e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-950/80 border border-white/[0.07] text-sm text-white focus:outline-none focus:border-brand-500/60 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] leading-relaxed transition-all resize-none"
                  placeholder="Write clear step-by-step reasoning, mathematical formulas, and scientific justification..."
                />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(p => Math.max(0, p - 1))}
                className="btn-secondary py-2 px-4 rounded-xl disabled:opacity-30"
              >
                <ChevronLeft style={{width:'14px',height:'14px'}} />
                Previous
              </button>

              {currentQIndex < test.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex(p => Math.min(test.questions.length - 1, p + 1))}
                  className="btn-secondary py-2 px-4 rounded-xl"
                >
                  Next
                  <ChevronRight style={{width:'14px',height:'14px'}} />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="btn-primary py-2 px-5 rounded-xl"
                >
                  <Send style={{width:'13px',height:'13px'}} />
                  <span>Submit Assessment</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Submit Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl p-4">
            <div className="w-full max-w-md glass rounded-3xl shadow-2xl p-6 space-y-5 animate-scale-in">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center">
                  <CheckCircle2 style={{width:'20px',height:'20px',color:'#34d399'}} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Ready to Submit?</h4>
                  <p className="text-[11px] text-slate-400">{answeredCount} of {test.questions.length} questions answered</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/[0.05] text-xs text-slate-300 leading-relaxed">
                Once submitted, answers are <strong className="text-white">immutable</strong> and scored with Claude 3.5 AI Rubric instantly. You cannot go back.
              </div>

              {/* Answer summary bar */}
              <div className="mastery-bar">
                <div className="mastery-bar-fill high" style={{width:`${pct}%`,animation:'none',transition:'width 0.5s ease'}} />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="btn-secondary py-2 px-4 rounded-xl"
                >
                  Continue Test
                </button>
                <button
                  onClick={handleSubmitTest}
                  disabled={isSubmitting}
                  className="btn-primary py-2 px-5 rounded-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Submitting…</span>
                    </>
                  ) : (
                    <><Send style={{width:'13px',height:'13px'}} /><span>Confirm &amp; Submit</span></>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProctorGuard>
  );
};
