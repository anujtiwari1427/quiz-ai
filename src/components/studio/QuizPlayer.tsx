import React, { useState, useEffect } from 'react';
import { 
  StudioQuiz, 
  StudioQuizQuestion, 
  StudioQuizAttempt,
  IngestedSource 
} from '../../types/strater';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Check, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { STRATER_STORAGE_SERVICE } from '../../services/straterStorageService';

interface QuizPlayerProps {
  source: IngestedSource;
  quiz: StudioQuiz;
  onQuizCompleted?: (attempt: StudioQuizAttempt) => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  source,
  quiz,
  onQuizCompleted
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [attemptResult, setAttemptResult] = useState<StudioQuizAttempt | null>(null);

  const activeQuestion: StudioQuizQuestion | undefined = quiz.questions[currentIndex];

  // Timer
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const handleSelectOption = (questionId: string, answerText: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerText
    }));
  };

  const handleFinishQuiz = () => {
    let score = 0;
    const answers = quiz.questions.map(q => {
      const userAnswer = (selectedAnswers[q.id] || '').trim();
      let isCorrect = false;

      if (q.type === 'fill_blank') {
        isCorrect = userAnswer.toLowerCase() === q.correctAnswer.toLowerCase();
      } else {
        isCorrect = userAnswer === q.correctAnswer;
      }

      if (isCorrect) score += 1;
      return {
        questionId: q.id,
        userAnswer,
        isCorrect
      };
    });

    const maxScore = quiz.questions.length;
    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= quiz.passingScorePercentage;

    const attempt: StudioQuizAttempt = {
      id: `att_${Date.now()}`,
      quizId: quiz.id,
      sourceId: source.id,
      userId: source.userId,
      score,
      maxScore,
      percentage,
      passed,
      timeTakenSeconds: elapsedSeconds,
      completedAt: new Date().toISOString(),
      answers
    };

    STRATER_STORAGE_SERVICE.saveQuizAttempt(attempt);
    setAttemptResult(attempt);
    setIsSubmitted(true);
    onQuizCompleted?.(attempt);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setElapsedSeconds(0);
    setAttemptResult(null);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#1c1c1e] border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#ff9f0a]/20 text-[#ff9f0a] border border-[#ff9f0a]/30">
              Active Assessment
            </span>
            <span className="text-xs text-[#86868b]">{quiz.questions.length} Questions • Pass mark: {quiz.passingScorePercentage}%</span>
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight mt-1">{quiz.title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs text-[#86868b] font-mono">
            <Clock className="w-3.5 h-3.5 text-[#2997ff]" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          {!isSubmitted && (
            <button
              onClick={handleFinishQuiz}
              disabled={Object.keys(selectedAnswers).length === 0}
              className="btn-primary text-xs py-1.5 px-4 font-semibold disabled:opacity-40"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>

      {isSubmitted && attemptResult ? (
        /* Final Scorecard & Review */
        <div className="space-y-6">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#1c1c1e] border border-white/10 text-center space-y-6 shadow-2xl">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
              attemptResult.passed ? 'bg-[#30d158]/20 border border-[#30d158]/30 text-[#30d158]' : 'bg-red-500/20 border border-red-500/30 text-red-400'
            }`}>
              {attemptResult.passed ? <Award className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-white">
                {attemptResult.passed ? 'Quiz Passed with Honors!' : 'Keep Practicing'}
              </h3>
              <p className="text-xs text-[#86868b]">
                You scored {attemptResult.score} out of {attemptResult.maxScore} marks in {formatTimer(attemptResult.timeTakenSeconds)}.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-center">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <div className={`text-xl font-bold font-mono ${attemptResult.passed ? 'text-[#30d158]' : 'text-red-400'}`}>
                  {attemptResult.percentage}%
                </div>
                <div className="text-[10px] text-[#86868b]">Score Ratio</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-xl font-bold text-[#2997ff] font-mono">
                  {attemptResult.score}/{attemptResult.maxScore}
                </div>
                <div className="text-[10px] text-[#86868b]">Correct</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-xl font-bold text-[#ff9f0a] font-mono">
                  {formatTimer(attemptResult.timeTakenSeconds)}
                </div>
                <div className="text-[10px] text-[#86868b]">Time Taken</div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-medium flex items-center gap-2 mx-auto transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>

          {/* Granular Question-by-Question Review */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Review Detailed Answers & Explanations</h3>
            
            <div className="space-y-4">
              {quiz.questions.map((q, idx) => {
                const ans = attemptResult.answers.find(a => a.questionId === q.id);
                const isCorrect = ans?.isCorrect;

                return (
                  <div 
                    key={q.id}
                    className={`p-5 rounded-2xl border space-y-3 ${
                      isCorrect ? 'bg-[#30d158]/5 border-[#30d158]/20' : 'bg-red-500/5 border-red-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">Question {idx + 1}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCorrect ? 'bg-[#30d158]/20 text-[#30d158]' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                      </span>
                    </div>

                    <p className="text-sm text-[#f5f5f7] font-medium">{q.prompt}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[10px] text-[#86868b] block mb-0.5">Your Answer:</span>
                        <span className={isCorrect ? 'text-[#30d158]' : 'text-red-400 font-medium'}>
                          {ans?.userAnswer || '(No answer provided)'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[10px] text-[#86868b] block mb-0.5">Correct Answer:</span>
                        <span className="text-[#30d158] font-medium">{q.correctAnswer}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#a1a1a6] space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#2997ff]">Explanation</div>
                      <p>{q.explanation}</p>
                      {q.citation && (
                        <div className="text-[10px] text-[#86868b] pt-1">Source: {q.citation}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : activeQuestion ? (
        /* Active Question Runner View */
        <div className="space-y-5">
          
          {/* Question Navigator Palette */}
          <div className="flex items-center gap-1.5 p-2 bg-[#1c1c1e] rounded-xl border border-white/10 overflow-x-auto">
            {quiz.questions.map((q, idx) => {
              const isAnswered = !!selectedAnswers[q.id];
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-medium shrink-0 transition-all ${
                    isCurrent
                      ? 'bg-[#0071e3] text-white shadow-md'
                      : isAnswered
                      ? 'bg-[#30d158]/20 text-[#30d158] border border-[#30d158]/30'
                      : 'bg-white/5 text-[#86868b] hover:bg-white/10'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Active Question Stem Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-6 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#86868b]">Question {currentIndex + 1} of {quiz.questions.length}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white uppercase tracking-wider">
                {activeQuestion.difficulty} • Bloom's {activeQuestion.bloomsLevel}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-medium text-white leading-relaxed">
              {activeQuestion.prompt}
            </h3>

            {/* Answer Options */}
            {activeQuestion.type === 'fill_blank' ? (
              <div className="space-y-2 pt-2">
                <input
                  type="text"
                  value={selectedAnswers[activeQuestion.id] || ''}
                  onChange={(e) => handleSelectOption(activeQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-[#86868b] text-sm focus:outline-none focus:border-[#0071e3]"
                />
              </div>
            ) : (
              <div className="space-y-2.5 pt-2">
                {activeQuestion.options?.map(opt => {
                  const isSelected = selectedAnswers[activeQuestion.id] === opt.text;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(activeQuestion.id, opt.text)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#0071e3]/15 border-[#0071e3] text-white shadow-md'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/15 text-[#d1d1d6]'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-medium">{opt.text}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        isSelected ? 'border-[#0071e3] bg-[#0071e3]' : 'border-white/20'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigator Bottom Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs text-white transition-colors"
            >
              Previous
            </button>

            {currentIndex < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="px-5 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                className="btn-primary text-xs py-2 px-6 font-semibold"
              >
                Complete & Submit
              </button>
            )}
          </div>
        </div>
      ) : null}

    </div>
  );
};
