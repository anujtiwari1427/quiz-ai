import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { TeacherConsole } from './components/teacher/TeacherConsole';
import { AiPaperGenerator } from './components/papers/AiPaperGenerator';
import { SmartAttendanceDashboard } from './components/attendance/SmartAttendanceDashboard';
import { StudentScoreUploader } from './components/marks/StudentScoreUploader';
import { ExamCreator } from './components/exams/ExamCreator';
import { ExamRunner } from './components/exams/ExamRunner';
import { ExamAnalysisView } from './components/exams/ExamAnalysisView';
import { MarketingLanding } from './components/marketing/MarketingLanding';
import { DEFAULT_PW_EXAM } from './mock/pwTestData';

export const AppContent: React.FC = () => {
  const { 
    currentView, 
    setCurrentView,
    activeExamToRun,
    activeExamAnalysis,
    startExamRunner,
    showExamAnalysis,
    launchExamCreator,
    textSizeTheme
  } = useApp();

  const isMarketing = currentView === 'marketing';

  return (
    <div className={`min-h-screen bg-[#07090e] text-[#f8fafc] flex ${isMarketing ? 'flex-col' : 'flex-col lg:flex-row'} selection:bg-[#10b981] selection:text-white font-sans theme-text-${textSizeTheme}`}>
      {/* Universal Navigation - top header for marketing, side drawer/rail for dashboards */}
      {currentView !== 'take-exam' && <Navbar />}

      {/* Main Content Area & Footer */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <main className="flex-1 min-w-0">
          {/* 1. Quizgecko-Style Flagship Homepage & AI Quiz/Flashcard Generator */}
          {currentView === 'marketing' && <MarketingLanding />}

          {/* 2. Primary Teacher Hub Dashboard */}
          {currentView === 'teacher' && <TeacherConsole />}
          
          {/* 3. Primary AI Exam Paper Generator & Blueprint Studio */}
          {currentView === 'ai-paper-gen' && <AiPaperGenerator />}

          {/* Teacher Sub-Tools: Smart Attendance & Score Uploads */}
          {currentView === 'smart-attendance' && <SmartAttendanceDashboard />}
          {currentView === 'score-upload' && <StudentScoreUploader />}

          {/* Interactive AI Exam Runner & Analysis (When taking an AI-generated exam) */}
          {currentView === 'create-exam' && (
            <ExamCreator
              onStartExam={(exam) => startExamRunner(exam)}
              onBack={() => setCurrentView('marketing')}
            />
          )}

          {currentView === 'take-exam' && activeExamToRun && (
            <ExamRunner
              exam={activeExamToRun}
              onFinishExam={(exam, attempt) => showExamAnalysis(exam, attempt)}
              onExit={() => setCurrentView('marketing')}
            />
          )}

          {currentView === 'exam-analysis' && (
            <ExamAnalysisView
              exam={activeExamAnalysis?.exam}
              attempt={activeExamAnalysis?.attempt}
              onRetakeExam={() => startExamRunner(activeExamAnalysis?.exam || DEFAULT_PW_EXAM)}
              onPracticeChapter={() => launchExamCreator()}
              onBackToLibrary={() => setCurrentView('marketing')}
            />
          )}

          {/* Fallback to Quizgecko Marketing Page if unknown view */}
          {currentView !== 'marketing' &&
           currentView !== 'teacher' && 
           currentView !== 'ai-paper-gen' && 
           currentView !== 'smart-attendance' && 
           currentView !== 'score-upload' && 
           currentView !== 'create-exam' && 
           currentView !== 'take-exam' && 
           currentView !== 'exam-analysis' && (
            <MarketingLanding />
          )}
        </main>

        {/* Universal Footer - hidden during full-screen exam runner */}
        {currentView !== 'take-exam' && <Footer />}
      </div>
    </div>
  );
};

export default AppContent;
