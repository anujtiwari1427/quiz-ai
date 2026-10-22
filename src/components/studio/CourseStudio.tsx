import React, { useState } from 'react';
import { 
  Course, 
  CourseModule, 
  IngestedSource 
} from '../../types/strater';
import { 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Trash2, 
  ChevronRight,
  FileText,
  FolderPlus
} from 'lucide-react';
import { STRATER_STORAGE_SERVICE } from '../../services/straterStorageService';

interface CourseStudioProps {
  courses: Course[];
  sources: IngestedSource[];
  onSelectSource: (source: IngestedSource) => void;
  onCoursesUpdated?: () => void;
}

export const CourseStudio: React.FC<CourseStudioProps> = ({
  courses,
  sources,
  onSelectSource,
  onCoursesUpdated
}) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(courses[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Computer Science');
  const [newDescription, setNewDescription] = useState('');

  const sourceMap = new Map<string, IngestedSource>();
  sources.forEach(s => sourceMap.set(s.id, s));

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCourse: Course = {
      id: `course_${Date.now()}`,
      userId: STRATER_STORAGE_SERVICE.getActiveUserId(),
      title: newTitle.trim(),
      description: newDescription.trim() || 'Structured study curriculum for master subject proficiency.',
      category: newCategory,
      iconName: 'BookOpen',
      colorGradient: 'from-blue-600 via-indigo-600 to-purple-800',
      modules: [
        {
          id: `mod_${Date.now()}_1`,
          title: 'Module 1: Foundations & Core Principles',
          description: 'Introduction and fundamental concepts.',
          orderIndex: 1,
          sourceIds: sources.slice(0, 1).map(s => s.id),
          isCompleted: false
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    STRATER_STORAGE_SERVICE.saveCourse(newCourse);
    setSelectedCourse(newCourse);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    onCoursesUpdated?.();
  };

  const handleToggleModuleComplete = (courseId: string, moduleId: string) => {
    if (!selectedCourse) return;
    const updatedModules = selectedCourse.modules.map(m => {
      if (m.id === moduleId) return { ...m, isCompleted: !m.isCompleted };
      return m;
    });
    const updatedCourse = {
      ...selectedCourse,
      modules: updatedModules,
      updatedAt: new Date().toISOString()
    };
    STRATER_STORAGE_SERVICE.saveCourse(updatedCourse);
    setSelectedCourse(updatedCourse);
    onCoursesUpdated?.();
  };

  const calculateCourseProgress = (course: Course): number => {
    if (!course.modules || course.modules.length === 0) return 0;
    const completed = course.modules.filter(m => m.isCompleted).length;
    return Math.round((completed / course.modules.length) * 100);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#1c1c1e] border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#0071e3]/20 text-[#2997ff] border border-[#0071e3]/30">
              Curriculum Hub
            </span>
            <span className="text-xs text-[#86868b]">{courses.length} Active Courses</span>
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight mt-1">Courses & Study Pathways</h2>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Course</span>
        </button>
      </div>

      {/* Courses Grid / Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {courses.map(course => {
          const progress = calculateCourseProgress(course);
          const isSelected = selectedCourse?.id === course.id;

          return (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-900/20 to-[#1c1c1e] border-[#0071e3] shadow-lg shadow-[#0071e3]/10 ring-1 ring-[#0071e3]'
                  : 'bg-[#1c1c1e] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider">{course.category}</span>
                  <span className="text-[10px] font-mono text-[#30d158] font-bold">{progress}% Done</span>
                </div>
                <h3 className="text-sm font-semibold text-white">{course.title}</h3>
                <p className="text-xs text-[#86868b] line-clamp-2">{course.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0071e3] to-[#30d158] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-[10px] text-[#86868b] flex justify-between">
                  <span>{course.modules.length} Modules</span>
                  <span>{course.modules.filter(m => m.isCompleted).length} Completed</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Course Module Details View */}
      {selectedCourse && (
        <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-semibold text-[#0071e3] uppercase tracking-wider">{selectedCourse.category}</span>
              <h3 className="text-lg font-bold text-white">{selectedCourse.title}</h3>
              <p className="text-xs text-[#86868b] mt-0.5">{selectedCourse.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-semibold text-white">{calculateCourseProgress(selectedCourse)}% Completed</div>
                <div className="text-[10px] text-[#86868b]">Syllabus Progress</div>
              </div>
            </div>
          </div>

          {/* Modules List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#a1a1a6]">Course Curriculum Modules</h4>

            <div className="space-y-3">
              {selectedCourse.modules.map((mod, idx) => (
                <div 
                  key={mod.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-white/15 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleModuleComplete(selectedCourse.id, mod.id)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          mod.isCompleted
                            ? 'bg-[#30d158] border-[#30d158] text-black'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        {mod.isCompleted && <CheckCircle2 className="w-4 h-4 fill-current stroke-black" />}
                      </button>

                      <div>
                        <h5 className={`text-xs sm:text-sm font-semibold ${mod.isCompleted ? 'line-through text-[#86868b]' : 'text-white'}`}>
                          {mod.title}
                        </h5>
                        <p className="text-xs text-[#86868b] mt-0.5">{mod.description}</p>
                      </div>
                    </div>

                    <span className="text-[10px] text-[#86868b] font-mono">Module {idx + 1}</span>
                  </div>

                  {/* Linked Ingested Sources */}
                  {mod.sourceIds && mod.sourceIds.length > 0 && (
                    <div className="pl-8 pt-2 border-t border-white/5 space-y-1.5">
                      <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider">Assigned Materials:</span>
                      <div className="flex flex-wrap gap-2">
                        {mod.sourceIds.map(srcId => {
                          const src = sourceMap.get(srcId);
                          if (!src) return null;
                          return (
                            <button
                              key={srcId}
                              onClick={() => onSelectSource(src)}
                              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#0071e3] text-white text-xs flex items-center gap-1.5 border border-white/10 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#2997ff]" />
                              <span className="truncate max-w-xs">{src.title}</span>
                              <ChevronRight className="w-3 h-3 text-[#86868b]" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#1c1c1e] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-semibold text-white">Create New Course / Study Path</h3>

            <form onSubmit={handleCreateCourse} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#a1a1a6]">Course Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus & Cloud Architecture"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#a1a1a6]">Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Computer Science, Medicine, Law..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#a1a1a6]">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Goals and syllabus outline for this study path..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#86868b] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 font-semibold"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
