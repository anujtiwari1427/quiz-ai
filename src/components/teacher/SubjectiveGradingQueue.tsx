import React, { useState } from 'react';
import { 
  FileCheck2, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Edit3, 
  Save, 
  User, 
  ChevronRight, 
  Award,
  History,
  CheckCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SubjectiveGradingQueue: React.FC = () => {
  const { attempts, tests, overrideGrade, approveAllAiGrades } = useApp();

  const [selectedAttemptId, setSelectedAttemptId] = useState<string>(attempts[0]?.id || '');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('q_test_4');
  const [editedScore, setEditedScore] = useState<number>(4.5);
  const [teacherRemarks, setTeacherRemarks] = useState<string>('Added +0.5 marks for clear diagrammatic pathway description.');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const selectedAttempt = attempts.find(a => a.id === selectedAttemptId) || attempts[0];
  const activeTest = tests.find(t => t.id === selectedAttempt?.testId) || tests[0];
  const activeQuestion = activeTest?.questions.find(q => q.id === selectedQuestionId) || activeTest?.questions[3];
  const studentAnswer = selectedAttempt?.answers.find(a => a.questionId === selectedQuestionId);

  const handleSaveGradeOverride = () => {
    if (selectedAttempt && activeQuestion) {
      overrideGrade(selectedAttempt.id, activeQuestion.id, editedScore, teacherRemarks);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleApproveAll = () => {
    if (selectedAttempt) {
      approveAllAiGrades(selectedAttempt.id);
      alert('All AI Rubric grades confirmed and finalized.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 shadow-sm">
              <img src="/logo.png" alt="EduPulse AI Logo" className="w-5 h-5 object-contain" />
            </div>
            <h2 className="text-xl font-display font-bold text-white">
              Subjective AI Grading & Teacher Override Queue
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Powered by Claude 3.5 Rubric Engine • 1-Click human verification for low-confidence marks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleApproveAll}
            className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-brand-500/20"
          >
            <CheckCheck className="w-4 h-4" />
            Approve All AI Grades
          </button>
        </div>
      </div>

      {/* Main Layout: Submissions List on Left, Split Review Canvas on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Col: Attempts List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Completed Submissions ({attempts.filter(a => a.status === 'submitted').length})
          </span>

          <div className="space-y-2">
            {attempts.map((att) => {
              const isSelected = att.id === selectedAttemptId;
              return (
                <div
                  key={att.id}
                  onClick={() => setSelectedAttemptId(att.id)}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'glass-panel-glow border-brand-500/50 bg-slate-900/90'
                      : 'glass-panel border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{att.studentName}</span>
                    <span className="text-xs font-mono font-bold text-brand-400">
                      {att.totalScore}/{att.maxScore} M ({att.percentage}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Roll: {att.rollNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      att.isReviewedByTeacher ? 'bg-brand-500/20 text-brand-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {att.isReviewedByTeacher ? 'Teacher Verified' : 'AI Graded (Pending)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Split Screen Rubric Grading View */}
        {selectedAttempt && activeQuestion && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Question Selector Tabs */}
            <div className="p-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 overflow-x-auto">
              {activeTest?.questions.map((q, idx) => {
                const ans = selectedAttempt.answers.find(a => a.questionId === q.id);
                const isSelected = q.id === selectedQuestionId;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestionId(q.id);
                      setEditedScore(ans?.scoreAwarded || q.marks);
                      setTeacherRemarks(ans?.teacherRemarks || '');
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-brand-500 text-slate-950 font-bold shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>Q{idx + 1} ({q.marks}M)</span>
                    {ans?.aiConfidence && (
                      <span className={`w-2 h-2 rounded-full ${
                        ans.aiConfidence === 'High' ? 'bg-emerald-400' : ans.aiConfidence === 'Medium' ? 'bg-amber-400' : 'bg-rose-400'
                      }`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Question Prompt */}
            <div className="p-6 rounded-3xl glass-panel border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-brand-400 uppercase font-mono">{activeQuestion.chapter}</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold">
                  Max Marks: {activeQuestion.marks}
                </span>
              </div>
              <p className="text-sm font-medium text-white whitespace-pre-line leading-relaxed">
                {activeQuestion.questionText}
              </p>
            </div>

            {/* Split Screen: Student Answer (Left) vs AI Rubric Evaluation (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Student Answer Box */}
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-400" />
                    Student Submitted Response
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    {(studentAnswer?.answerText || '').split(/\s+/).length} words
                  </span>
                </div>

                <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans min-h-[140px]">
                  {studentAnswer?.answerText || 'No answer recorded for this question.'}
                </p>
              </div>

              {/* AI Rubric & Feedback Box */}
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="font-bold text-brand-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Claude 3.5 Rubric Assessment
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    studentAnswer?.aiConfidence === 'High' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {studentAnswer?.aiConfidence || 'Medium'} Confidence
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {studentAnswer?.aiFeedback || 'Conceptual coverage verified.'}
                  </p>

                  {/* Rubric Criteria List */}
                  {activeQuestion.rubric && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-900">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Marking Rubric Breakdown:
                      </span>
                      {activeQuestion.rubric.map(r => (
                        <div key={r.id} className="p-2 rounded-xl bg-slate-900/80 text-[10px] flex justify-between items-center">
                          <span className="text-slate-300">{r.criterion}</span>
                          <span className="font-mono text-brand-400 font-bold">Max {r.maxMarks}M</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Teacher Override Console */}
            <div className="p-6 rounded-3xl glass-panel-glow border-slate-800 bg-slate-900/90 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-brand-400" />
                  <span className="font-bold text-sm text-white">Teacher Manual Score Adjustment</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Awarded Marks:</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max={activeQuestion.marks}
                    value={editedScore}
                    onChange={(e) => setEditedScore(Number(e.target.value))}
                    className="w-16 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-sm font-bold text-brand-400 text-center focus:outline-none focus:border-brand-500"
                  />
                  <span className="text-xs text-slate-400">/ {activeQuestion.marks}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Teacher Remarks & Feedback for Student/Parent
                </label>
                <input
                  type="text"
                  value={teacherRemarks}
                  onChange={(e) => setTeacherRemarks(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  placeholder="e.g. Added bonus for complete balanced chemical equation."
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Override will be committed immutably to DPDP Audit Log.
                </span>

                <button
                  onClick={handleSaveGradeOverride}
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaved ? 'Score Saved!' : 'Confirm Grade Override'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
