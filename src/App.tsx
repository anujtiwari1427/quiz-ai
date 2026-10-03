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

export const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col selection:bg-[#0071e3] selection:text-white font-sans">
      {/* Universal Top Navigation */}
      <Navbar />

      {/* Main Content Area Based on Active View */}
      <main className="flex-1">
        {currentView === 'marketing' && <MarketingLanding />}
        {currentView === 'teacher' && <TeacherConsole />}
        {currentView === 'student' && <StudentTestRoom />}
        {currentView === 'parent' && <ParentPortal />}
        {currentView === 'admin' && <AdminConsole />}

        {/* 4 Major Student Features */}
        {currentView === 'marks' && <MarksDashboard />}
        {currentView === 'syllabus' && <SyllabusDashboard />}
        {currentView === 'books' && <BookLibrary />}
        {currentView === 'questions' && <QuestionSetsHub />}
      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
};

export default AppContent;
