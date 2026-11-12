import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Layers, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  FileText,
  Edit2
} from 'lucide-react';
import { db } from '../../db';
import { TextbookRecord, ChapterRecord } from '../../types';

interface ChapterManagerViewProps {
  textbookId: string;
  onBack: () => void;
}

export const ChapterManagerView: React.FC<ChapterManagerViewProps> = ({
  textbookId,
  onBack
}) => {
  const [textbook, setTextbook] = useState<TextbookRecord | null>(null);
  const [chapters, setChapters] = useState<ChapterRecord[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, [textbookId]);

  const loadData = async () => {
    const tb = await db.textbooks.get(textbookId);
    if (tb) setTextbook(tb);

    const chaps = await db.chapters.where('textbookId').equals(textbookId).sortBy('chapterNumber');
    setChapters(chaps);
    setHasChanges(false);
  };

  const handleUpdateChapter = (idx: number, field: keyof ChapterRecord, value: any) => {
    const updated = [...chapters];
    updated[idx] = { ...updated[idx], [field]: value };
    setChapters(updated);
    setHasChanges(true);
  };

  const handleAddChapter = () => {
    const lastChapter = chapters[chapters.length - 1];
    const newStartPage = lastChapter ? Math.min((textbook?.totalPages || 100), lastChapter.endPage + 1) : 1;
    const newChapter: ChapterRecord = {
      id: `chap_${textbookId}_${Date.now()}`,
      textbookId,
      chapterNumber: chapters.length + 1,
      title: `New Chapter ${chapters.length + 1}`,
      startPage: newStartPage,
      endPage: Math.min((textbook?.totalPages || 100), newStartPage + 10),
      exerciseSections: []
    };
    setChapters([...chapters, newChapter]);
    setHasChanges(true);
  };

  const handleDeleteChapter = (idx: number) => {
    if (confirm(`Remove "${chapters[idx].title}"?`)) {
      const updated = chapters.filter((_, i) => i !== idx).map((c, i) => ({
        ...c,
        chapterNumber: i + 1
      }));
      setChapters(updated);
      setHasChanges(true);
    }
  };

  const handleSaveAll = async () => {
    // Delete existing chapters for this book and save updated
    await db.chapters.where('textbookId').equals(textbookId).delete();
    await db.chapters.bulkPut(chapters);
    setHasChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!textbook) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-xs">
        <p>Loading textbook chapters...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#202342]">
              Chapter &amp; Exercise Manager
            </h1>
            <p className="text-xs text-[#4e516a] mt-0.5">
              {textbook.title} (Class {textbook.grade} • {textbook.subject}) — {textbook.totalPages} Total Pages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddChapter}
            className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Chapter</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={!hasChanges}
            className="px-5 py-2 rounded-xl bg-[#4555fd] hover:bg-[#3343e0] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saveSuccess ? 'Saved ✓' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>All chapter definitions and page ranges saved locally to IndexedDB.</span>
        </div>
      )}

      {/* Chapters Table */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-16">#</th>
                <th className="py-3 px-4">Chapter Title</th>
                <th className="py-3 px-4 w-32">Start Page</th>
                <th className="py-3 px-4 w-32">End Page</th>
                <th className="py-3 px-4 w-44">Exercise Sections</th>
                <th className="py-3 px-4 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chapters.map((chap, idx) => (
                <tr key={chap.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-500">
                    {chap.chapterNumber}
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={chap.title}
                      onChange={(e) => handleUpdateChapter(idx, 'title', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#4555fd] font-medium"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min={1}
                      max={textbook.totalPages}
                      value={chap.startPage}
                      onChange={(e) => handleUpdateChapter(idx, 'startPage', parseInt(e.target.value, 10) || 1)}
                      className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#4555fd]"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min={chap.startPage}
                      max={textbook.totalPages}
                      value={chap.endPage}
                      onChange={(e) => handleUpdateChapter(idx, 'endPage', parseInt(e.target.value, 10) || chap.startPage)}
                      className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#4555fd]"
                    />
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {chap.exerciseSections && chap.exerciseSections.length > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-[11px]">
                        {chap.exerciseSections.length} {chap.exerciseSections.length === 1 ? 'Exercise' : 'Exercises'} Detected
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">None detected</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteChapter(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete chapter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
