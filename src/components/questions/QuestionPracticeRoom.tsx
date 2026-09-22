import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle2, ChevronRight, ChevronLeft, Bookmark, 
  Send, AlertTriangle, ArrowLeft, Eye, Flag, HelpCircle, X
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

  const handleSelectOption = (qId: string, optId: string, optText: string) => {
    setUserAnswers(prev => ({ ...prev, [qId]: { optId, text: optText } }));
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

  // ── Submit Assessment & Auto-Sync Marks ──
  const handleSubmitAssessment = () => {
    let obtainedMarks = 0;
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
          marksAwarded: 0
        };
      }

      // Check correctness
      let isCorrect = false;
      if (q.options && q.options.length > 0) {
        const correctOpt = q.options.find(o => o.isCorrect);
        isCorrect = correctOpt ? correctOpt.id === ans.optId : false;
      } else {
        // Subjective auto-credit
        isCorrect = ans.text.trim().length > 15;
      }

      const marksAwarded = isCorrect ? q.marks : 0;
      if (isCorrect) {
        obtainedMarks += marksAwarded;
        correctCount++;
      } else {
        incorrectCount++;
      }

      return {
        questionId: q.id,
        selectedOptionId: ans.optId,
        answerText: ans.text,
        isCorrect,
        marksAwarded
      };
    });

    const totalMarks = questionSet.totalMarks || questionSet.questions.reduce((sum, q) => sum + q.marks, 0);
    const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
    const grade = calculateGrade(percentage).grade;
    const timeTakenSeconds = (questionSet.timeLimit * 60) - timeRemainingSeconds;

    const attemptRecord: QuestionSetAttempt = {
      id: `qatt_${Date.now()}`,
      questionSetId: questionSet.id,
      questionSetTitle: questionSet.title,
      subject: questionSet.subject,
      chapter: questionSet.chapter,
      totalMarks,
      obtainedMarks,
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
      obtainedMarks,
      percentage,
      grade,
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5 animate-fade-in-up">
      
      {/* ── Top HUD ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl glass border border-white/[0.06]">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-1.5 rounded-xl hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
          >
            <ArrowLeft style={{ width: '15px', height: '15px' }} />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <span className="text-slate-700">|</span>

          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
              {questionSet.title}
            </h3>
            <span className="text-[10px] text-slate-400">
              {questionSet.subject} {questionSet.chapter && `• ${questionSet.chapter}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all ${
            isLowTime 
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 animate-glow-pulse' 
              : 'bg-slate-900 border-white/[0.06] text-brand-400'
          }`}>
            <Clock style={{ width: '13px', height: '13px' }} />
            <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="btn-primary py-1.5 px-3.5 text-xs rounded-xl"
          >
            <Send style={{ width: '12px', height: '12px' }} />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* ── Progress Indicators ── */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>{answeredCount} of {totalQuestions} answered ({markedCount} marked for review)</span>
          <span className="font-bold text-white">{progressPct}%</span>
        </div>
        <div className="mastery-bar">
          <div 
            className="mastery-bar-fill high" 
            style={{ width: `${progressPct}%`, animation: 'none' }} 
          />
        </div>
      </div>

      {/* ── Palette of Question Numbers ── */}
      <div className="p-3 rounded-2xl glass border border-white/[0.05] flex items-center gap-1.5 overflow-x-auto">
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
                  ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/30 scale-110 font-black'
                  : isMarked
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : isAnswered
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/35'
                  : 'bg-slate-950/60 text-slate-500 border border-white/[0.05] hover:text-slate-300'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* ── Active Question Card ── */}
      {currentQ && (
        <div className="glass-emerald rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in-up">
          
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald text-[10px]">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">{currentQ.chapter}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleMarkForReview(currentQ.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                  markedForReview[currentQ.id]
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/35'
                    : 'bg-slate-900/60 text-slate-400 border-white/[0.06] hover:text-white'
                }`}
              >
                <Flag style={{ width: '11px', height: '11px' }} />
                <span>{markedForReview[currentQ.id] ? 'Marked' : 'Mark for Review'}</span>
              </button>

              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-white/[0.06] text-xs font-bold text-white">
                {currentQ.marks} {currentQ.marks === 1 ? 'Mark' : 'Marks'}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <p className="text-base sm:text-lg font-medium text-white leading-relaxed whitespace-pre-line">
            {currentQ.questionText}
          </p>

          {/* Options: MCQ or True/False */}
          {currentQ.options && currentQ.options.length > 0 ? (
            <div className="space-y-3">
              {currentQ.options.map((opt, i) => {
                const isSelected = userAnswers[currentQ.id]?.optId === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQ.id, opt.id, opt.text)}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-brand-500/15 border-brand-500/60 text-white shadow-md shadow-brand-500/10'
                        : 'bg-slate-950/50 border-white/[0.06] text-slate-300 hover:border-white/[0.14] hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-brand-500 text-slate-950' : 'bg-slate-900 border border-white/[0.08] text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm leading-snug">{opt.text}</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-brand-500 border-brand-500' : 'border-slate-700'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Subjective Text Area */
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Write your explanation or step-by-step solution:</span>
                <span className="font-mono">{(userAnswers[currentQ.id]?.text || '').split(/\s+/).filter(Boolean).length} words</span>
              </div>
              <textarea
                rows={5}
                value={userAnswers[currentQ.id]?.text || ''}
                onChange={e => handleTextChange(currentQ.id, e.target.value)}
                placeholder="Write clear formulas, statements, and justification..."
                className="input-field text-sm resize-none"
              />
            </div>
          )}

          {/* Bottom Bar: Prev / Skip / Next */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
              className="btn-secondary py-2 px-4 rounded-xl disabled:opacity-30"
            >
              <ChevronLeft style={{ width: '14px', height: '14px' }} />
              <span>Previous</span>
            </button>

            <button
              onClick={handleSkipQuestion}
              className="btn-secondary py-2 px-3 rounded-xl text-slate-400 hover:text-white"
            >
              <span>Skip</span>
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIndex(p => Math.min(totalQuestions - 1, p + 1))}
                className="btn-secondary py-2 px-4 rounded-xl"
              >
                <span>Next</span>
                <ChevronRight style={{ width: '14px', height: '14px' }} />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="btn-primary py-2 px-5 rounded-xl shadow-lg"
              >
                <Send style={{ width: '13px', height: '13px' }} />
                <span>Submit Set</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Submit Confirmation Modal ── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="glass rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/[0.1] shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
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

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.06] text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>Your results will be computed immediately and your score record will be automatically saved to your <strong className="text-white">Marks Dashboard</strong>.</p>
              {markedCount > 0 && (
                <p className="text-amber-400 flex items-center gap-1 font-semibold">
                  <AlertTriangle style={{ width: '12px', height: '12px' }} />
                  You still have {markedCount} question{markedCount > 1 ? 's' : ''} flagged for review.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Continue Practice
              </button>
              <button
                onClick={handleSubmitAssessment}
                className="btn-primary text-xs py-2 px-5"
              >
                Confirm &amp; See Results
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
