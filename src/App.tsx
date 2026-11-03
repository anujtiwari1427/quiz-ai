import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { PaperWebsiteHome } from './components/papers/PaperWebsiteHome';
import { PaperBuilderStudio } from './components/papers/PaperBuilderStudio';
import { AiPaperGenerator } from './components/papers/AiPaperGenerator';

export const AppContent: React.FC = () => {
  const { currentView, textSizeTheme, theme } = useApp();

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#07090e] text-[#f8fafc]'
    } flex flex-col selection:bg-emerald-500 selection:text-white font-sans theme-text-${textSizeTheme}`}>
      {/* Universal Top Navigation for QP-M Professional Paper Generator */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {currentView === 'marketing' && <PaperWebsiteHome />}
        {currentView === 'paper-builder' && <PaperBuilderStudio />}
        {currentView === 'ai-paper-gen' && <AiPaperGenerator />}
        {currentView !== 'marketing' && currentView !== 'paper-builder' && currentView !== 'ai-paper-gen' && (
          <PaperWebsiteHome />
        )}
      </main>
    </div>
  );
};

export default AppContent;
