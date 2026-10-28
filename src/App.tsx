import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MarketingLanding } from './components/marketing/MarketingLanding';
import { TeacherConsole } from './components/teacher/TeacherConsole';
import { StudentTestRoom } from './components/student/StudentTestRoom';
import { ParentPortal } from './components/parent/ParentPortal';
import { AdminConsole } from './components/admin/AdminConsole';
import { MarksDashboard } from './components/marks/MarksDashboard';
import { SyllabusDashboard } from './components/syllabus/SyllabusDashboard';
import { BookLibrary } from './components/books/BookLibrary';
import { QuestionSetsHub } from './components/questions/QuestionSetsHub';
import { ExamCreator } from './components/exams/ExamCreator';
import { ExamRunner } from './components/exams/ExamRunner';
import { ExamAnalysisView } from './components/exams/ExamAnalysisView';
import { StudioWorkspace } from './components/studio/StudioWorkspace';
import { DEFAULT_PW_EXAM } from './mock/pwTestData';

export const AppContent: React.FC = () => {
  const { 
    currentView, 
    setCurrentView,
    activeExamToRun,
    activeExamAnalysis,
    startExamRunner,
    showExamAnalysis,
    launchExamCreator
  } = useApp();

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col selection:bg-[#0071e3] selection:text-white font-sans">
      {/* Universal Top Navigation - hidden during full-screen exam taking mode */}
      {currentView !== 'take-exam' && <Navbar />}

      {/* Main Content Area Based on Active View */}
      <main className="flex-1">
        {currentView === 'marketing' && <MarketingLanding />}
        {currentView === 'teacher' && <TeacherConsole />}
        {currentView === 'student' && <StudentTestRoom />}
        {currentView === 'parent' && <ParentPortal />}
        {currentView === 'admin' && <AdminConsole />}
        {/* Strater-Inspired AI Learning Workspace */}
        {(currentView === 'strata-studio' || 
          currentView === 'strata-courses' || 
          currentView === 'strata-repetition' || 
          currentView === 'strata-analytics' || 
          currentView === 'strata-billing') && (
          <StudioWorkspace />
        )}

        {/* 4 Major Student Features */}
        {currentView === 'marks' && <MarksDashboard />}
        {currentView === 'syllabus' && <SyllabusDashboard />}
        {currentView === 'books' && <BookLibrary />}
        {currentView === 'questions' && <QuestionSetsHub />}

        {/* AI Exam Paper Generator & Performance Features */}
        {currentView === 'create-exam' && (
          <ExamCreator
            onStartExam={(exam) => startExamRunner(exam)}
            onBack={() => setCurrentView('books')}
          />
        )}

        {currentView === 'take-exam' && activeExamToRun && (
          <ExamRunner
            exam={activeExamToRun}
            onFinishExam={(exam, attempt) => showExamAnalysis(exam, attempt)}
            onExit={() => setCurrentView('books')}
          />
        )}

        {currentView === 'exam-analysis' && (
          <ExamAnalysisView
            exam={activeExamAnalysis?.exam}
            attempt={activeExamAnalysis?.attempt}
            onRetakeExam={() => startExamRunner(activeExamAnalysis?.exam || DEFAULT_PW_EXAM)}
            onPracticeChapter={(chapterName) => {
              launchExamCreator();
            }}
            onBackToLibrary={() => setCurrentView('books')}
          />
        )}
      </main>

      {/* Universal Footer - hidden during full-screen exam runner */}
      {currentView !== 'take-exam' && <Footer />}
    </div>
  );
};

export default AppContent;
