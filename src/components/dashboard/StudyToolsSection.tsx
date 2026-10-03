import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Upload, BookOpen, Layers, 
  ArrowRight, Sparkles, CheckCircle2, Award, Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudyToolsSection: React.FC = () => {
  const { setCurrentView, marks, syllabi, books, questionSets } = useApp();

  const totalMarksCount = marks.length;
  const overallPercentage = marks.length > 0
    ? Math.round((marks.reduce((sum, m) => sum + m.obtainedMarks, 0) / marks.reduce((sum, m) => sum + m.totalMarks, 0)) * 100)
    : 0;

  const totalSyllabusTopics = syllabi.reduce((sum, s) => {
    return sum + s.subjects.reduce((subSum, sub) => {
      return subSum + sub.chapters.reduce((chSum, ch) => chSum + ch.topics.length, 0);
    }, 0);
  }, 0);

  const activeBook = books[0];
  const totalQuestionSets = questionSets.length;

  const studyTools = [
    {
      id: 'marks',
      title: 'Marks & Analytics',
      subtitle: 'Custom Marks & Grade Reports',
      description: 'Configure marks per question, negative penalties (-0.25/-0.5M), log offline school exam marks, and track NEP grades.',
      icon: BarChart3,
      color: 'emerald',
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      badge: `${overallPercentage}% Overall`,
      statLabel: `${totalMarksCount} Tests Recorded`,
      cta: 'Add Marks & Analytics',
      onClick: () => setCurrentView('marks')
    },
    {
      id: 'syllabus',
      title: 'Upload Syllabus',
      subtitle: 'Curriculum & Marks Weightage',
      description: 'Upload PDF, DOCX, TXT, or scanned images to extract units, board weightages, and generate targeted quizzes with 1 click.',
      icon: Upload,
      color: 'indigo',
      gradient: 'from-indigo-500/20 via-blue-500/10 to-transparent',
      borderColor: 'border-indigo-500/30',
      iconBg: 'bg-indigo-500/15 text-indigo-400',
      badge: 'PDF / DOC / Images',
      statLabel: `${totalSyllabusTopics} Topics Mapped`,
      cta: 'Upload & Explore',
      onClick: () => setCurrentView('syllabus')
    },
    {
      id: 'books',
      title: 'Read the Book',
      subtitle: 'Digital Reader with Audio TTS',
      description: 'Read curriculum textbooks with theme switcher, simulated audio narration, study highlighters, and AI Hindi/Marathi tutor.',
      icon: BookOpen,
      color: 'amber',
      gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      borderColor: 'border-amber-500/30',
      iconBg: 'bg-amber-500/15 text-amber-400',
      badge: activeBook ? `${activeBook.progress}% Read` : 'Audio TTS Ready',
      statLabel: `${books.length} Digital Textbooks`,
      cta: 'Open Book Reader',
      onClick: () => setCurrentView('books')
    },
    {
      id: 'questions',
      title: 'Question Sets',
      subtitle: 'Timed Practice & Auto Marks',
      description: 'Curated 10Q, 20Q, 25Q, and 50Q practice sets with [A, B, C, D] keyboard shortcuts, preview mode, and auto-marks sync.',
      icon: Layers,
      color: 'rose',
      gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
      borderColor: 'border-rose-500/30',
      iconBg: 'bg-rose-500/15 text-rose-400',
      badge: 'Auto Marks Sync',
      statLabel: `${totalQuestionSets} Sets Ready`,
      cta: 'Start Practice Sets',
      onClick: () => setCurrentView('questions')
    }
  ];

  return (
    <section className="py-16 relative overflow-hidden" id="study-tools">
      {/* Background glow */}
      <div className="orb absolute w-[600px] h-[350px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" 
        style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)' }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="section-label glass-sm border border-emerald-500/20 text-emerald-300 mb-4 inline-flex items-center gap-2">
            <Sparkles style={{ width: '13px', height: '13px', color: '#10b981' }} />
            <span>Student Study Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
            Comprehensive <span className="gradient-text-emerald">Study Tools</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
            Four powerful, interconnected tools built to elevate every student from daily revision to board exam perfection.
          </p>
        </div>

        {/* 4 Cards Grid (Apple Dark Material) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {studyTools.map((tool, idx) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={tool.onClick}
              className="bg-[#1c1c1e]/75 backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.08] hover:border-white/[0.18] cursor-pointer flex flex-col justify-between relative shadow-xl group transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/[0.06] border border-white/[0.08] shadow-inner text-[#f5f5f7]">
                    <tool.icon style={{ width: '20px', height: '20px' }} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-medium bg-white/[0.08] border border-white/[0.1] text-[#f5f5f7]">
                    {tool.badge}
                  </span>
                </div>

                {/* Titles */}
                <div>
                  <h3 className="text-base font-display font-semibold text-[#f5f5f7] group-hover:text-[#2997ff] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-[11px] font-normal text-[#86868b] tracking-wide mt-0.5">
                    {tool.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-[#86868b] leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Footer Stat & CTA */}
              <div className="pt-4 mt-5 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#86868b]">
                  {tool.statLabel}
                </span>

                <span className="text-xs font-medium text-[#2997ff] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>{tool.cta}</span>
                  <ArrowRight style={{ width: '13px', height: '13px' }} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
