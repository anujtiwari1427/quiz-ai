import React, { useState, useMemo, useEffect } from 'react';
import { ExamModel, AttemptModel } from '../../types/schemas';
import { GRADING_AND_ANALYSIS_SERVICE, ComprehensiveAnalysisResult } from '../../services/gradingAndAnalysisService';
import { PwThemeMode, PW_THEMES, PwThemeConfig } from './pw/pwTheme';
import { PwHeader } from './pw/PwHeader';
import { PwOverviewTab } from './pw/PwOverviewTab';
import { PwLeaderboardTab } from './pw/PwLeaderboardTab';
import { PwSolutionsTab } from './pw/PwSolutionsTab';
import { PwMasteryTab } from './pw/PwMasteryTab';
import { PwTimeAnalyticsTab } from './pw/PwTimeAnalyticsTab';
import { PwShareScorecardModal } from './pw/PwShareScorecardModal';
import { DEFAULT_PW_EXAM, DEFAULT_PW_ATTEMPT } from '../../mock/pwTestData';

interface ExamAnalysisViewProps {
  exam?: ExamModel;
  attempt?: AttemptModel;
  onRetakeExam: () => void;
  onPracticeChapter: (chapterName: string) => void;
  onBackToLibrary: () => void;
  initialTab?: number;
}

export const ExamAnalysisView: React.FC<ExamAnalysisViewProps> = ({
  exam = DEFAULT_PW_EXAM,
  attempt = DEFAULT_PW_ATTEMPT,
  onRetakeExam,
  onPracticeChapter,
  onBackToLibrary,
  initialTab
}) => {
  // Determine initial active tab from prop, URL search param (e.g. activeTabIndex=2), or default to 2 (Solutions)
  const [activeTab, setActiveTab] = useState<number>(() => {
    if (typeof initialTab === 'number') return initialTab;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('activeTabIndex');
      if (tabParam !== null) {
        const parsed = parseInt(tabParam, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 4) return parsed;
      }
    } catch {
      // fallback
    }
    return 2; // Default to Tab 2 (Solutions & Q-Palette) as requested in PW URL
  });

  // PW Theme selection (Dark, Light, Cyber)
  const [themeMode, setThemeMode] = useState<PwThemeMode>(() => {
    try {
      const stored = localStorage.getItem('pw_active_theme') as PwThemeMode;
      if (stored && PW_THEMES[stored]) return stored;
    } catch {
      // fallback
    }
    return 'pw-dark';
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sync theme changes to localStorage
  const handleThemeChange = (mode: PwThemeMode) => {
    setThemeMode(mode);
    try {
      localStorage.setItem('pw_active_theme', mode);
    } catch {
      // ignore
    }
  };

  const currentTheme: PwThemeConfig = PW_THEMES[themeMode] || PW_THEMES['pw-dark'];

  // Run comprehensive analysis
  const analysis: ComprehensiveAnalysisResult = useMemo(() => {
    return GRADING_AND_ANALYSIS_SERVICE.generateAnalysis(exam, attempt);
  }, [exam, attempt]);

  const {
    score,
    totalMarks,
    percentage,
    timeTakenSec,
    timeAllowedSec,
    percentile,
    chapterMastery,
    chaptersToImprove,
    aiStudyPlan,
    trendHistory
  } = analysis;

  const attemptedCount = attempt.answers.filter(a => a.answer.trim().length > 0).length;
  const correctCount = attempt.answers.filter(a => a.isCorrect).length;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
  const estimatedRank = Math.max(1, Math.round((100 - percentile) * 120 + 5));

  return (
    <div className={`min-h-screen ${currentTheme.pageBg} transition-colors duration-200 pb-16 font-sans`}>
      
      {/* ── Physics Wallah Top Header with Breadcrumbs, Theme Switcher, & Actions ── */}
      <PwHeader
        testTitle={exam.title}
        testId={exam.id}
        activeTab={activeTab}
        onTabChange={(idx) => setActiveTab(idx)}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onRetakeExam={onRetakeExam}
        onBackToLibrary={onBackToLibrary}
      />

      {/* ── Main Tab Content Container ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 0 && (
          <PwOverviewTab
            exam={exam}
            attempt={attempt}
            theme={currentTheme}
            onNavigateToSolutions={() => setActiveTab(2)}
            onNavigateToLeaderboard={() => setActiveTab(1)}
          />
        )}

        {activeTab === 1 && (
          <PwLeaderboardTab
            theme={currentTheme}
            userScore={score}
            totalMarks={totalMarks}
          />
        )}

        {activeTab === 2 && (
          <PwSolutionsTab
            exam={exam}
            attempt={attempt}
            theme={currentTheme}
          />
        )}

        {activeTab === 3 && (
          <PwMasteryTab
            chapterMastery={chapterMastery}
            chaptersToImprove={chaptersToImprove}
            theme={currentTheme}
            onPracticeChapter={onPracticeChapter}
          />
        )}

        {activeTab === 4 && (
          <PwTimeAnalyticsTab
            timeTakenSec={timeTakenSec}
            timeAllowedSec={timeAllowedSec}
            aiStudyPlan={aiStudyPlan}
            trendHistory={trendHistory}
            theme={currentTheme}
          />
        )}
      </main>

      {/* ── Share Scorecard Modal ── */}
      <PwShareScorecardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        examTitle={exam.title}
        score={score}
        totalMarks={totalMarks}
        percentage={percentage}
        percentile={percentile}
        rank={estimatedRank}
        accuracy={accuracy}
        theme={currentTheme}
      />

    </div>
  );
};
