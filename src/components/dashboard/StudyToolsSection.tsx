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
      subtitle: 'Score Trends & Grades',
      description: 'Track overall percentage, grade distribution, subject-wise strengths, and full assessment history.',
      icon: BarChart3,
      color: 'emerald',
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      badge: `${overallPercentage}% Overall`,
      statLabel: `${totalMarksCount} Tests Recorded`,
      cta: 'View Marks Dashboard',
      onClick: () => setCurrentView('marks')
    },
    {
      id: 'syllabus',
      title: 'Upload Syllabus',
      subtitle: 'Curriculum & AI Quizzes',
      description: 'Upload PDF, DOCX, or images to extract chapters and topics. Generate targeted quizzes with one click.',
      icon: Upload,
      color: 'indigo',
      gradient: 'from-indigo-500/20 via-blue-500/10 to-transparent',
      borderColor: 'border-indigo-500/30',
      iconBg: 'bg-indigo-500/15 text-indigo-400',
      badge: 'PDF / DOC / TXT',
      statLabel: `${totalSyllabusTopics} Topics Mapped`,
      cta: 'Explore Syllabus',
      onClick: () => setCurrentView('syllabus')
    },
    {
      id: 'books',
      title: 'Read the Book',
      subtitle: 'Digital Study Reader',
      description: 'Distraction-free textbook reader with bookmarks, notes, and AI Reading Assistant in Hindi & Marathi.',
      icon: BookOpen,
      color: 'amber',
      gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      borderColor: 'border-amber-500/30',
      iconBg: 'bg-amber-500/15 text-amber-400',
      badge: activeBook ? `${activeBook.progress}% Read` : 'New Reader',
      statLabel: `${books.length} Digital Books`,
      cta: 'Open Book Reader',
      onClick: () => setCurrentView('books')
    },
    {
      id: 'questions',
      title: 'Question Sets',
      subtitle: 'Practice & Master',
      description: 'Practice curated 10Q, 20Q, 25Q, and 50Q question sets with instant explanations and auto-marks sync.',
      icon: Layers,
      color: 'rose',
      gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
      borderColor: 'border-rose-500/30',
      iconBg: 'bg-rose-500/15 text-rose-400',
      badge: 'Auto-Sync Marks',
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

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {studyTools.map((tool, idx) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onClick={tool.onClick}
              className={`glass rounded-3xl p-6 border ${tool.borderColor} bg-gradient-to-b ${tool.gradient} cursor-pointer flex flex-col justify-between relative shadow-xl group`}
            >
              <div className="space-y-4">
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tool.iconBg} shadow-inner`}>
                    <tool.icon style={{ width: '22px', height: '22px' }} />
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '9px' }}>
                    {tool.badge}
                  </span>
                </div>

                {/* Titles */}
                <div>
                  <h3 className="text-lg font-display font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {tool.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Footer Stat & CTA */}
              <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 font-semibold">
                  {tool.statLabel}
                </span>

                <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
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
