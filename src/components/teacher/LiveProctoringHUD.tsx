import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Send, 
  UserX, 
  Maximize2, 
  Smartphone, 
  Sparkles,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LiveProctoringHUD: React.FC = () => {
  const { attempts, warnStudentLive, addProctorViolationToActiveAttempt } = useApp();

  const [selectedStudentAttemptId, setSelectedStudentAttemptId] = useState<string | null>(attempts[1]?.id || null);
  const [warningMessage, setWarningMessage] = useState<string>('Please return to fullscreen mode immediately. Further tab switches will be reported to examination board.');
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [simulatedFilter, setSimulatedFilter] = useState<'all' | 'flagged' | 'active' | 'submitted'>('all');

  const filteredAttempts = attempts.filter(a => {
    if (simulatedFilter === 'all') return true;
    if (simulatedFilter === 'flagged') return a.violations.length > 0;
    return a.status === simulatedFilter;
  });

  const selectedAttempt = attempts.find(a => a.id === selectedStudentAttemptId) || attempts[0];

  const handleSendWarning = () => {
    if (selectedStudentAttemptId) {
      warnStudentLive(selectedStudentAttemptId, warningMessage);
      setShowWarningModal(false);
      alert('Proctor warning dispatched to student test screen.');
    }
  };

  const handleSimulateCheatEvent = (attemptId: string) => {
    addProctorViolationToActiveAttempt(attemptId, {
      type: 'tab_switch',
      description: 'Switched to search engine tab (Google / ChatGPT detected)',
      severity: 'high'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Telemetry Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 shadow-sm">
              <img src="/logo.png" alt="EduPulse AI Logo" className="w-5 h-5 object-contain" />
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-xl font-display font-bold text-white">
              Live Proctoring HUD — Room SCI-X-908
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time biometric & telemetry stream • Anti-cheat browser lockdown active
          </p>
        </div>

        {/* Telemetry counters */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Online</span>
            <span className="text-base font-bold text-emerald-400">
              {attempts.filter(a => a.status === 'active').length} Students
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Flagged Breaches</span>
            <span className="text-base font-bold text-amber-400">
              {attempts.filter(a => a.violations.length > 0).length} Flags
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Submissions</span>
            <span className="text-base font-bold text-brand-400">
              {attempts.filter(a => a.status === 'submitted').length} Done
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'flagged', 'active', 'submitted'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSimulatedFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              simulatedFilter === tab
                ? 'bg-brand-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab === 'all' ? 'All Takers' : tab}
          </button>
        ))}
      </div>

      {/* Main Grid: Student Tiles on Left, Telemetry Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: Student Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredAttempts.map((att) => {
            const isSelected = att.id === selectedStudentAttemptId;
            const hasViolations = att.violations.length > 0;

            return (
              <div
                key={att.id}
                onClick={() => setSelectedStudentAttemptId(att.id)}
                className={`p-5 rounded-3xl border text-xs cursor-pointer transition-all space-y-4 ${
                  isSelected
                    ? 'glass-panel-glow border-brand-500/60 bg-slate-900/90'
                    : 'glass-panel border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{att.studentName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {att.rollNumber}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                      {att.studentGsid}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    att.status === 'submitted'
                      ? 'bg-brand-500/20 text-brand-400'
                      : hasViolations
                      ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {att.status === 'submitted' ? 'Submitted' : hasViolations ? 'Flagged' : 'Active'}
                  </span>
                </div>

                {/* Progress / Time Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Test Progress</span>
                    <span>{att.status === 'submitted' ? '100%' : 'Q3 of 4'}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: att.status === 'submitted' ? '100%' : '75%' }}
                    />
                  </div>
                </div>

                {/* Violations Summary Pill */}
                <div className="pt-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Time: {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s</span>
                  </div>

                  {hasViolations ? (
                    <span className="flex items-center gap-1 text-rose-400 font-semibold text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {att.violations.length} breach{att.violations.length > 1 ? 'es' : ''}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Clean Session
                    </span>
                  )}
                </div>

                {/* Demo Action Trigger */}
                {att.status === 'active' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSimulateCheatEvent(att.id);
                    }}
                    className="w-full py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-[10px] text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 transition-colors flex items-center justify-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    Simulate Tab-Switch Breach
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Col: Detailed Telemetry Drawer for Selected Student */}
        {selectedAttempt && (
          <div className="p-6 rounded-3xl glass-panel-glow border-slate-800 bg-slate-900/90 space-y-5">
            <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  {selectedAttempt.studentName}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Roll: {selectedAttempt.rollNumber} • {selectedAttempt.schoolName}
                </p>
              </div>

              <button
                onClick={() => setShowWarningModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <BellRing className="w-3.5 h-3.5" />
                Warn Student
              </button>
            </div>

            {/* Violation Audit Stream */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Browser Violation Telemetry Log:
              </span>

              {selectedAttempt.violations.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-400 space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-brand-400 mx-auto" />
                  <p className="font-semibold text-white">No Suspicious Behavior</p>
                  <p className="text-[11px]">Browser focus maintained continuously.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedAttempt.violations.map((v) => (
                    <div
                      key={v.id}
                      className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-400 uppercase text-[10px]">
                          {v.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(v.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{v.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Answers Preview */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Recorded Answers ({selectedAttempt.answers.length} logged):
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedAttempt.answers.map((ans, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-950 text-xs border border-slate-800/80">
                    <div className="flex justify-between font-semibold text-slate-300 mb-1">
                      <span>Question #{i + 1}</span>
                      {ans.scoreAwarded !== undefined && (
                        <span className="text-brand-400 font-mono">{ans.scoreAwarded} M</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-2">{ans.answerText}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Teacher Warning Broadcast Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Broadcast Mid-Test Warning</span>
            </div>

            <p className="text-xs text-slate-300">
              This message will flash prominently over {selectedAttempt?.studentName}'s test screen and be logged in the immutable audit record.
            </p>

            <textarea
              rows={3}
              value={warningMessage}
              onChange={(e) => setWarningMessage(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowWarningModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendWarning}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Alert
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
