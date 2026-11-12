import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  BookOpen, 
  Database, 
  Sliders, 
  Download, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Folder, 
  ArrowRight,
  HardDrive,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { db, getStorageEstimate } from '../../db';
import { SavedPaper, TextbookRecord } from '../../types';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar, Skeleton } from '../ui/Feedback';
import { EmptyState } from '../ui/EmptyState';
import { FILE_SYSTEM_SERVICE } from '../../services/fileSystemService';
import { useToast } from '../ui/Toast';

export const TeacherDashboard: React.FC = () => {
  const { openCreatePaper, openLibrary, openQuestionBank, openSavedPapers, openEditor } = useApp();
  const { success, error: toastError } = useToast();

  const [recentPapers, setRecentPapers] = useState<SavedPaper[]>([]);
  const [counts, setCounts] = useState({ textbooks: 0, questions: 0, blueprints: 0, papers: 0 });
  const [storageInfo, setStorageInfo] = useState<{ usedMB: number; quotaMB: number; percent: number } | null>(null);
  const [connectedFolder, setConnectedFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [allPapers, textbookCount, questionCount, blueprintCount, estimate] = await Promise.all([
        db.savedPapers.toArray(),
        db.textbooks.count(),
        db.questionBank.count(),
        db.blueprints.count(),
        getStorageEstimate()
      ]);

      allPapers.sort((a, b) => b.updatedAt - a.updatedAt);
      setRecentPapers(allPapers.slice(0, 5));
      setCounts({
        papers: allPapers.length,
        textbooks: textbookCount,
        questions: questionCount,
        blueprints: blueprintCount,
      });

      if (estimate) {
        setStorageInfo({
          usedMB: Math.round(estimate.usage / (1024 * 1024)),
          quotaMB: Math.round(estimate.quota / (1024 * 1024)),
          percent: estimate.usagePercent,
        });
      }

      setConnectedFolder(FILE_SYSTEM_SERVICE.getConnectedFolderName());
    } catch (err) {
      console.warn('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackupNow = async () => {
    try {
      const res = await FILE_SYSTEM_SERVICE.exportFullBackupZip();
      if (res.success) {
        success('Full backup ZIP generated and downloaded successfully!');
      } else if (res.error) {
        toastError(`Backup failed: ${res.error}`);
      }
    } catch (err: any) {
      toastError(`Backup error: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-left">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Teacher Assessment Hub
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Author board-aligned question papers grounded directly in your uploaded textbooks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<BookOpen className="w-4 h-4" />}
            onClick={openLibrary}
          >
            Upload Textbook
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => openCreatePaper()}
          >
            Create New Paper
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton width={80} height={12} />
                  <Skeleton width={50} height={28} />
                  <Skeleton width={90} height={10} />
                </div>
                <Skeleton variant="circular" width={40} height={40} />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card interactive onClick={openSavedPapers}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Exam Papers
                  </span>
                  <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-1">
                    {counts.papers}
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-0.5 block">Stored locally</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card interactive onClick={openLibrary}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Textbooks
                  </span>
                  <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-1">
                    {counts.textbooks}
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-0.5 block">Indexed for retrieval</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card interactive onClick={openQuestionBank}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Question Bank
                  </span>
                  <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-1">
                    {counts.questions}
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-0.5 block">Tagged & deduplicated</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Storage Used
                  </span>
                  <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-1">
                    {storageInfo ? `${storageInfo.usedMB} MB` : '0 MB'}
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> IndexedDB Safe
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center justify-center">
                  <HardDrive className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Grid: Recent Papers & Local-First Backup Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Continue Where You Left Off */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              Continue Where You Left Off
            </h3>
            {recentPapers.length > 0 && (
              <button
                onClick={openSavedPapers}
                className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>View all ({counts.papers})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {recentPapers.length === 0 ? (
            <EmptyState
              title="No exam papers generated yet"
              description="Upload your textbook PDF and configure a blueprint to create your first CBSE, ICSE, or State Board paper."
              action={{
                label: 'Create Your First Paper',
                onClick: () => openCreatePaper(),
                icon: <Plus className="w-4 h-4" />
              }}
              secondaryAction={{
                label: 'Browse Textbooks',
                onClick: openLibrary
              }}
            />
          ) : (
            <div className="space-y-3">
              {recentPapers.map((paper) => {
                const totalQ = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);
                const updatedStr = new Date(paper.updatedAt || paper.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <Card
                    key={paper.id}
                    interactive
                    onClick={() => openEditor(paper.id)}
                    className="p-4 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="structure">{paper.subject} • Class {paper.grade}</Badge>
                        <Badge variant="neutral">{paper.totalMarks} Marks</Badge>
                        <span className="text-[11px] text-neutral-400">
                          {paper.examName || 'Assessment'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                        {paper.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                        <span>{totalQ} questions across {paper.sections.length} sections</span>
                        <span>•</span>
                        <span>Updated {updatedStr}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditor(paper.id);
                        }}
                      >
                        Edit Paper
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Local Storage & Backup Status */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Device Storage & Backup
          </h3>

          <Card>
            <CardHeader>
              <CardTitle>Local Redundancy Status</CardTitle>
              <CardDescription>Zero cloud transmission. 100% device ownership.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Connected Disk Folder:</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {connectedFolder || 'Browser Only (IndexedDB)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Browser Storage Quota:</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {storageInfo ? `${storageInfo.quotaMB} MB available` : 'N/A'}
                  </span>
                </div>
              </div>

              {storageInfo && (
                <ProgressBar
                  value={storageInfo.percent}
                  label="IndexedDB Storage Used"
                  variant="brand"
                />
              )}

              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Remember to create a local ZIP archive periodically so you never lose your question papers even if your browser cache is wiped.
              </p>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleBackupNow}
              >
                Download Full Backup (.ZIP)
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
