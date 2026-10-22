import React, { useState } from 'react';
import { X, Check, Trash2, GitMerge, Plus, BookOpen, Edit3 } from 'lucide-react';
import { ChapterModel, BookModel } from '../../types/schemas';
import { LIBRARY_SERVICE } from '../../services/libraryService';

interface ChapterEditorModalProps {
  book: BookModel;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updatedChapters: ChapterModel[]) => void;
}

export const ChapterEditorModal: React.FC<ChapterEditorModalProps> = ({
  book,
  isOpen,
  onClose,
  onSaved
}) => {
  const [chapters, setChapters] = useState<ChapterModel[]>(book.chapters || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [mergeSelected, setMergeSelected] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStartRename = (ch: ChapterModel) => {
    setEditingId(ch.id);
    setEditingName(ch.name);
  };

  const handleSaveRename = (chId: string) => {
    if (!editingName.trim()) return;
    const updated = chapters.map(c => (c.id === chId ? { ...c, name: editingName.trim() } : c));
    setChapters(updated);
    setEditingId(null);
    showToast('Chapter renamed successfully');
  };

  const handleDeleteChapter = (chId: string) => {
    if (chapters.length <= 1) {
      showToast('A book must contain at least one chapter.');
      return;
    }
    const updated = chapters.filter(c => c.id !== chId);
    setChapters(updated);
    showToast('Chapter removed');
  };

  const handleToggleMergeSelect = (chId: string) => {
    if (mergeSelected.includes(chId)) {
      setMergeSelected(mergeSelected.filter(id => id !== chId));
    } else {
      if (mergeSelected.length >= 2) {
        showToast('You can select 2 chapters to merge at a time.');
        return;
      }
      setMergeSelected([...mergeSelected, chId]);
    }
  };

  const handleMergeChapters = () => {
    if (mergeSelected.length !== 2) return;
    const ch1 = chapters.find(c => c.id === mergeSelected[0]);
    const ch2 = chapters.find(c => c.id === mergeSelected[1]);
    if (!ch1 || !ch2) return;

    const mergedName = `${ch1.name} & ${ch2.name}`;
    const mergedChapter: ChapterModel = {
      id: ch1.id,
      bookId: book.id,
      name: mergedName,
      orderIndex: Math.min(ch1.orderIndex, ch2.orderIndex),
      pageStart: Math.min(ch1.pageStart, ch2.pageStart),
      pageEnd: Math.max(ch1.pageEnd, ch2.pageEnd),
      contentPreview: `${ch1.contentPreview || ''} | ${ch2.contentPreview || ''}`
    };

    const remaining = chapters.filter(c => c.id !== ch1.id && c.id !== ch2.id);
    const updated = [...remaining, mergedChapter].sort((a, b) => a.orderIndex - b.orderIndex);
    setChapters(updated);
    setMergeSelected([]);
    showToast(`Successfully merged into "${mergedName.slice(0, 40)}..."`);
  };

  const handleAddNewChapter = () => {
    const newIdx = chapters.length + 1;
    const newChapter: ChapterModel = {
      id: `ch_${Date.now()}`,
      bookId: book.id,
      name: `Chapter ${newIdx}: Custom Topic Section`,
      orderIndex: newIdx,
      pageStart: newIdx * 10 - 9,
      pageEnd: newIdx * 10,
      contentPreview: 'Custom added chapter'
    };
    setChapters([...chapters, newChapter]);
    showToast('New chapter added');
  };

  const handleSaveAll = () => {
    LIBRARY_SERVICE.updateBookChapters(book.id, chapters);
    onSaved(chapters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#1c1c1e] border border-white/[0.1] shadow-2xl p-6 text-white space-y-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Chapter Manager &amp; Editor</h2>
              <p className="text-xs text-slate-400">Organize, rename, or merge chapters for "{book.title}"</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-200 text-xs text-center animate-fade-in">
            {toastMessage}
          </div>
        )}

        {/* Merge action toolbar if 2 selected */}
        {mergeSelected.length === 2 && (
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between text-xs">
            <span className="text-indigo-300 font-medium">2 chapters selected for merge</span>
            <button
              onClick={handleMergeChapters}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-colors"
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Merge Selected</span>
            </button>
          </div>
        )}

        {/* Chapter List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {chapters.map((ch, idx) => {
            const isSelectedForMerge = mergeSelected.includes(ch.id);
            const isEditing = editingId === ch.id;

            return (
              <div
                key={ch.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isSelectedForMerge
                    ? 'bg-indigo-500/15 border-indigo-500/50'
                    : 'bg-[#2c2c2e]/60 border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelectedForMerge}
                    onChange={() => handleToggleMergeSelect(ch.id)}
                    className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                    title="Select to merge with another chapter"
                  />

                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={e => setEditingName(e.target.value)}
                          className="flex-1 px-3 py-1 rounded-lg bg-black border border-indigo-500 text-xs text-white focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(ch.id)}
                          className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-white truncate">{ch.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Pages {ch.pageStart} – {ch.pageEnd}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!isEditing && (
                    <button
                      onClick={() => handleStartRename(ch)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
                      title="Rename Chapter"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteChapter(ch.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                    title="Delete Chapter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer controls */}
        <div className="border-t border-white/[0.08] pt-4 flex items-center justify-between">
          <button
            onClick={handleAddNewChapter}
            className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold flex items-center gap-1.5 text-slate-300"
          >
            <Plus className="w-4 h-4" />
            <span>Add Chapter</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-xs font-bold text-white shadow-lg shadow-blue-500/20"
            >
              Save Chapter Structure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
