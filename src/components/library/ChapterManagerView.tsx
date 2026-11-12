import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Layers, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  BookOpen, 
  AlertCircle 
} from 'lucide-react';
import { db } from '../../db';
import { TextbookRecord, ChapterRecord } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Breadcrumbs } from '../ui/Misc';
import { useToast } from '../ui/Toast';

export interface ChapterManagerViewProps {
  textbookId: string;
  onBack: () => void;
}

export const ChapterManagerView: React.FC<ChapterManagerViewProps> = ({
  textbookId,
  onBack
}) => {
  const { success, error } = useToast();
  const [textbook, setTextbook] = useState<TextbookRecord | null>(null);
  const [chapters, setChapters] = useState<ChapterRecord[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    const newStart = lastChapter ? lastChapter.endPage + 1 : 1;
    const newChap: ChapterRecord = {
      id: `chap_${textbookId}_${Date.now()}`,
      textbookId,
      chapterNumber: chapters.length + 1,
      title: `Chapter ${chapters.length + 1}`,
      startPage: newStart,
      endPage: newStart + 15,
      exerciseSections: []
    };
    setChapters([...chapters, newChap]);
    setHasChanges(true);
  };

  const handleRemoveChapter = (idx: number) => {
    if (chapters.length <= 1) return;
    setChapters(chapters.filter((_, i) => i !== idx));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await db.chapters.where('textbookId').equals(textbookId).delete();
      await db.chapters.bulkPut(chapters);
      setHasChanges(false);
      success('Chapter structure saved successfully.');
    } catch (err: any) {
      error(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!textbook) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Library', onClick: onBack },
            { label: textbook.title, isCurrent: true },
            { label: 'Chapter Manager', isCurrent: true }
          ]}
          className="mb-2"
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Chapter & Exercise Manager
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Adjust extracted chapter titles, fix start/end page ranges, and review detected exercise sets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSaving}
              disabled={!hasChanges}
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Chapters in "{textbook.title}"</CardTitle>
            <CardDescription>{chapters.length} chapters extracted across {textbook.totalPages} pages</CardDescription>
          </div>
          <Button variant="outline" size="xs" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={handleAddChapter}>
            Add Chapter
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 pt-5">
          {chapters.map((chap, idx) => (
            <div
              key={chap.id || idx}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <Badge variant="structure" size="sm">Ch {chap.chapterNumber}</Badge>
                  <input
                    type="text"
                    value={chap.title}
                    onChange={(e) => handleUpdateChapter(idx, 'title', e.target.value)}
                    className="w-full bg-transparent font-bold text-sm text-neutral-900 dark:text-neutral-100 border-b border-dashed border-neutral-300 focus:outline-none focus:border-brand-500"
                  />
                </div>
                {chapters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveChapter(idx)}
                    className="text-neutral-400 hover:text-danger-600 p-1"
                    title="Delete chapter"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <Input
                  label="Start Page"
                  type="number"
                  min={1}
                  value={chap.startPage}
                  onChange={(e) => handleUpdateChapter(idx, 'startPage', parseInt(e.target.value, 10) || 1)}
                />
                <Input
                  label="End Page"
                  type="number"
                  min={chap.startPage}
                  value={chap.endPage}
                  onChange={(e) => handleUpdateChapter(idx, 'endPage', parseInt(e.target.value, 10) || 1)}
                />
                <div className="sm:col-span-2 p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-neutral-400 text-[11px]">Exercise Sections:</span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    {chap.exerciseSections?.length || 0} Detected
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
