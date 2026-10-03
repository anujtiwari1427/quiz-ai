import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle2, ChevronRight, ChevronLeft, Bookmark, 
  Send, AlertTriangle, ArrowLeft, Eye, Flag, HelpCircle, X,
  RotateCcw, ShieldAlert, Award, Sparkles, Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QuestionSet, QuestionSetAttempt, MarkRecord } from '../../types';
import { calculateGrade } from '../../utils/gradeUtils';
import { QuestionResultSheet } from './QuestionResultSheet';

interface QuestionPracticeRoomProps {
  questionSet: QuestionSet;
  onExit: () => void;
}

export const QuestionPracticeRoom: React.FC<QuestionPracticeRoomProps> = ({
  questionSet,
  onExit
}) => {
  const { saveQuestionSetAttempt, addMarkRecord, setCurrentView } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: { optId?: string; text: string } }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [qId: string]: boolean }>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(questionSet.timeLimit * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAttempt, setSubmittedAttempt] = useState<QuestionSetAttempt | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const currentQ = questionSet.questions[currentIndex];
  const totalQuestions = questionSet.questions.length;
  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k].optId || userAnswers[k].text.trim()).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);

  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const isLowTime = timeRemainingSeconds < 180; // less than 3 mins

  // Keyboard shortcut listener (A, B, C, D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentQ || !currentQ.options || isSubmitted || showSubmitModal) return;
      const key = e.key.toUpperCase();
      const keyIndex = ['A', 'B', 'C', 'D'].indexOf(key);
      if (keyIndex !== -1 && currentQ.options[keyIndex]) {
        const opt = currentQ.options[keyIndex];
        handleSelectOption(currentQ.id, opt.id, opt.text);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQ, isSubmitted, showSubmitModal]);

  const handleSelectOption = (qId: string, optId: string, optText: string) => {
    setUserAnswers(prev => ({ ...prev, [qId]: { optId, text: optText } }));
  };

  const handleClearOption = (qId: string) => {
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  const handleTextChange = (qId: string, text: string) => {
    setUserAnswers(prev => ({ ...prev, [qId]: { optId: prev[qId]?.optId, text } }));
  };

  const toggleMarkForReview = (qId: string) => {
    setMarkedForReview(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSkipQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // ── Submit Assessment & Calculate Marks with Negative Scheme ──
  const handleSubmitAssessment = () => {
    const negativePenaltyPerWrong = questionSet.negativeMarksPerWrong || 0;
    let grossMarks = 0;
    let totalNegativeDeducted = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    const evaluatedAnswers = questionSet.questions.map(q => {
      const ans = userAnswers[q.id];
      const hasAnswered = ans && (ans.optId || ans.text.trim());

      if (!hasAnswered) {
        skippedCount++;
        return {
          questionId: q.id,
          selectedOptionId: undefined,
          answerText: '',
          isCorrect: false,
          marksAwarded: 0,
          negativeDeducted: 0
        };
      }

      // Check correctness
      let isCorrect = false;
      if (q.options && q.options.length > 0) {
        const correctOpt = q.options.find(o => o.isCorrect);
        isCorrect = correctOpt ? correctOpt.id === ans.optId : false;
      } else {
        // Subjective auto-credit for sensible length
        isCorrect = ans.text.trim().length > 15;
      }

      let marksAwarded = 0;
      let negativeDeducted = 0;

      if (isCorrect) {
        marksAwarded = q.marks;
        grossMarks += q.marks;
        correctCount++;
      } else {
        incorrectCount++;
        if (negativePenaltyPerWrong > 0) {
          negativeDeducted = negativePenaltyPerWrong;
          totalNegativeDeducted += negativePenaltyPerWrong;
        }
      }

      return {
        questionId: q.id,
        selectedOptionId: ans.optId,
        answerText: ans.text,
        isCorrect,
        marksAwarded,
        negativeDeducted
      };
    });

    const netObtained = Math.max(0, Math.round((grossMarks - totalNegativeDeducted) * 100) / 100);
    const totalMarks = questionSet.totalMarks || questionSet.questions.reduce((sum, q) => sum + q.marks, 0);
    const percentage = totalMarks > 0 ? Math.round((netObtained / totalMarks) * 100) : 0;
    const grade = calculateGrade(percentage).grade;
    const timeTakenSeconds = (questionSet.timeLimit * 60) - timeRemainingSeconds;
    const passingMarks = questionSet.passingMarks || Math.ceil(totalMarks * 0.33);
    const isPassed = netObtained >= passingMarks;

    const attemptRecord: QuestionSetAttempt = {
      id: `qatt_${Date.now()}`,
      questionSetId: questionSet.id,
      questionSetTitle: questionSet.title,
      subject: questionSet.subject,
      chapter: questionSet.chapter,
      totalMarks,
      obtainedMarks: netObtained,
      grossMarks,
      negativeMarksDeducted: totalNegativeDeducted,
      passingMarks,
      isPassed,
      percentage,
      grade,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unansweredQuestions: skippedCount,
      timeTakenSeconds,
      submittedAt: new Date().toISOString(),
      userAnswers: evaluatedAnswers
    };

    saveQuestionSetAttempt(attemptRecord);

    // ── AUTOMATICALLY SYNC TO MARKS DASHBOARD ──
    const markRecord: MarkRecord = {
      id: `mark_qset_${Date.now()}`,
      testId: questionSet.id,
      testName: questionSet.title,
      subject: questionSet.subject,
      date: new Date().toISOString().split('T')[0],
      totalMarks,
      obtainedMarks: netObtained,
      negativeMarksDeducted: totalNegativeDeducted,
      percentage,
      grade,
      examType: 'Practice Set',
      remarks: `${correctCount}/${totalQuestions} correct. ${totalNegativeDeducted > 0 ? `-${totalNegativeDeducted}M negative penalty applied.` : 'No negative penalty.'}`,
      timeSpentSeconds: timeTakenSeconds,
      questionCount: totalQuestions,
      correctCount,
      incorrectCount,
      skippedCount
    };

    addMarkRecord(markRecord);

    setSubmittedAttempt(attemptRecord);
    setIsSubmitted(true);
    setShowSubmitModal(false);
  };

  // If already submitted, display Result Sheet
  if (isSubmitted && submittedAttempt) {
    return (
      <QuestionResultSheet
        attempt={submittedAttempt}
        questionSet={questionSet}
        onRetake={() => {
          setIsSubmitted(false);
          setSubmittedAttempt(null);
          setUserAnswers({});
          setMarkedForReview({});
          setCurrentIndex(0);
          setTimeRemainingSeconds(questionSet.timeLimit * 60);
        }}
        onExit={onExit}
        onViewMarksDashboard={() => setCurrentView('marks')}
      />
    );
  }

  const marksPerQ = currentQ.marks || 1;
  const negativePenalty = questionSet.negativeMarksPerWrong || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in-up">
      
      {/* ── Top Exam Navigation Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl glass border border-white/[0.08] shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft style={{ width: '15px', height: '15px' }} />
            <span className="hidden sm:inline">Back to Hub</span>
          </button>

          <span className="text-slate-700">|</span>

          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-[220px] sm:max-w-xs">
              {questionSet.title}
            </h3>
            <span className="text-[10px] text-slate-400">
              {questionSet.subject} {questionSet.chapter && `• ${questionSet.chapter}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Marks Scheme Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/[0.06] text-[11px] font-mono">
            <span className="text-emerald-400 font-bold">+{marksPerQ}M Correct</span>
            {negativePenalty > 0 && (
              <span className="text-rose-400 font-bold">• -{negativePenalty}M Wrong</span>
            )}
          </div>

          {/* Timer with Glow warning */}
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all ${
            isLowTime 
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-glow-pulse shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
              : 'bg-slate-900 border-white/[0.08] text-brand-400'
          }`}>
            <Clock style={{ width: '14px', height: '14px' }} />
            <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>

          {/* Submit Test Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="btn-primary py-2 px-4 text-xs rounded-xl shadow-lg shadow-brand-500/20 font-bold flex items-center gap-1.5"
          >
            <Send style={{ width: '13px', height: '13px' }} />
            <span>Submit Test</span>
          </button>
        </div>
      </div>

      {/* ── Progress Bar & Stats Row ── */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span>{answeredCount} of {totalQuestions} Answered {markedCount > 0 && `(${markedCount} Marked for Review)`}</span>
          <span className="font-bold text-white font-mono">{progressPct}% Completed</span>
        </div>
        <div className="mastery-bar" style={{ height: '6px' }}>
          <div 
            className="mastery-bar-fill high transition-all duration-300" 
            style={{ width: `${progressPct}%`, animation: 'none' }} 
          />
        </div>
      </div>

      {/* ── Question Palette Strip ── */}
      <div className="p-3.5 rounded-2xl glass border border-white/[0.06] flex items-center gap-2 overflow-x-auto shadow-inner">
        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider shrink-0 pr-1">Q-Palette:</span>
        {questionSet.questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = Boolean(userAnswers[q.id]?.optId || userAnswers[q.id]?.text);
          const isMarked = markedForReview[q.id];

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 transition-all ${
                isCurrent
                  ? 'bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/35 scale-110 font-black ring-2 ring-emerald-400'
                  : isMarked
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                  : isAnswered
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/35'
                  : 'bg-slate-950/70 text-slate-500 border border-white/[0.05] hover:text-slate-300'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* ── Active Question Card ── */}
      {currentQ && (
        <div className="glass-emerald rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-white/[0.08] relative overflow-hidden animate-fade-in-up">
          
          {/* Header with Bloom's level and Marks option indicator */}
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald text-[10px] font-bold">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">{currentQ.chapter}</span>
              {currentQ.bloomsLevel && (
                <span className="badge badge-indigo text-[9px]">{currentQ.bloomsLevel}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleMarkForReview(currentQ.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  markedForReview[currentQ.id]
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-white/[0.06] hover:text-white'
                }`}
              >
                <Flag style={{ width: '12px', height: '12px' }} />
                <span>{markedForReview[currentQ.id] ? 'Flagged for Review' : 'Flag Question'}</span>
              </button>

              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-brand-500/20 text-xs font-bold text-emerald-400 font-mono">
                +{currentQ.marks} M
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <p className="text-base sm:text-xl font-medium text-white leading-relaxed whitespace-pre-line">
              {currentQ.questionText}
            </p>
            <p className="text-[11px] text-slate-500">
              Select one option below or press keyboard keys [A, B, C, D]
            </p>
          </div>

          {/* Options: MCQ Single Choice */}
          {currentQ.options && currentQ.options.length > 0 ? (
            <div className="space-y-3">
              {currentQ.options.map((opt, i) => {
                const isSelected = userAnswers[currentQ.id]?.optId === opt.id;
                const letter = String.fromCharCode(65 + i);

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQ.id, opt.id, opt.text)}
                    className={`p-4 sm:p-5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all duration-200 group ${
                      isSelected
                        ? 'bg-brand-500/15 border-brand-500/70 text-white shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/30'
                        : 'bg-slate-950/60 border-white/[0.06] text-slate-300 hover:border-white/[0.18] hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center shrink-0 transition-transform ${
                        isSelected 
                          ? 'bg-brand-500 text-slate-950 scale-105' 
                          : 'bg-slate-900 border border-white/[0.08] text-slate-400 group-hover:text-white'
                      }`}>
                        {letter}
                      </span>
                      <span className="text-sm sm:text-base font-normal leading-snug">{opt.text}</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'bg-brand-500 border-brand-500 scale-110' : 'border-slate-700'
                    }`}>
                      {isSelected && <Check style={{ width: '12px', height: '12px', color: '#020617', strokeWidth: 3 }} />}
                    </div>
                  </div>
                );
              })}

              {/* Clear Response Button */}
              {userAnswers[currentQ.id]?.optId && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleClearOption(currentQ.id)}
                    className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 font-mono transition-colors"
                  >
                    <RotateCcw style={{ width: '11px', height: '11px' }} />
                    <span>Clear response (avoid penalty)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Subjective Text Area */
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Write your structured explanation, theorem steps or derivation:</span>
                <span className="font-mono">{(userAnswers[currentQ.id]?.text || '').split(/\s+/).filter(Boolean).length} words</span>
              </div>
              <textarea
                rows={6}
                value={userAnswers[currentQ.id]?.text || ''}
                onChange={e => handleTextChange(currentQ.id, e.target.value)}
                placeholder="Write your answer clearly according to CBSE/State Board rubric criteria..."
                className="input-field text-sm leading-relaxed resize-none p-4"
              />
            </div>
          )}

          {/* Bottom Bar: Prev / Skip / Next */}
          <div className="flex items-center justify-between pt-5 border-t border-white/[0.06]">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
              className="btn-secondary py-2 px-4 rounded-xl disabled:opacity-30 gap-1.5 text-xs"
            >
              <ChevronLeft style={{ width: '14px', height: '14px' }} />
              <span>Previous</span>
            </button>

            <button
              onClick={handleSkipQuestion}
              className="btn-secondary py-2 px-4 rounded-xl text-slate-400 hover:text-white text-xs"
            >
              <span>Skip Question</span>
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIndex(p => Math.min(totalQuestions - 1, p + 1))}
                className="btn-secondary py-2 px-5 rounded-xl gap-1.5 text-xs font-bold"
              >
                <span>Next</span>
                <ChevronRight style={{ width: '14px', height: '14px' }} />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="btn-primary py-2 px-6 rounded-xl shadow-lg shadow-brand-500/25 text-xs font-bold gap-1.5"
              >
                <Send style={{ width: '13px', height: '13px' }} />
                <span>Review &amp; Submit</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Submit Confirmation Modal with Marks Warning ── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="glass rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/[0.1] shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-500/15 flex items-center justify-center text-brand-400">
                  <CheckCircle2 style={{ width: '20px', height: '20px' }} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Submit Question Set?</h4>
                  <p className="text-[11px] text-slate-400">{answeredCount} of {totalQuestions} questions answered</p>
                </div>
              </div>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-white">
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {/* Assessment Status Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-lg font-bold text-emerald-400 font-mono">{answeredCount}</div>
                <div className="text-[10px] text-slate-400">Answered</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-lg font-bold text-amber-400 font-mono">{markedCount}</div>
                <div className="text-[10px] text-slate-400">Marked</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.06]">
                <div className="text-lg font-bold text-slate-400 font-mono">{totalQuestions - answeredCount}</div>
                <div className="text-[10px] text-slate-400">Skipped</div>
              </div>
            </div>

            {/* Negative Marking Alert */}
            {negativePenalty > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                <ShieldAlert style={{ width: '16px', height: '16px', color: '#f43f5e', flexShrink: 0, marginTop: '1px' }} />
                <span>
                  <strong>Negative Marking Active:</strong> Incorrect answers incur a penalty of <strong className="text-white">-{negativePenalty} Marks</strong> each. Unanswered questions have no penalty.
                </span>
              </div>
            )}

            <div className="text-xs text-slate-400">
              Upon submission, your exact score, negative deductions, and grade will be permanently logged to your <strong className="text-white">Marks Dashboard</strong>.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.06]">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="btn-secondary text-xs py-2 px-4 rounded-xl"
              >
                Continue Test
              </button>
              <button
                onClick={handleSubmitAssessment}
                className="btn-primary text-xs py-2.5 px-5 rounded-xl shadow-lg shadow-brand-500/25 font-bold"
              >
                Submit &amp; View Scorecard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default QuestionPracticeRoom;
