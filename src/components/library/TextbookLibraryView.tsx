import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Search, 
  Layers, 
  Clock, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { db } from '../../db';
import { INGESTION_SERVICE, IngestionProgress } from '../../services/ingestionService';
import { FILE_SYSTEM_SERVICE } from '../../services/fileSystemService';
import { TextbookRecord, BoardType, SupportedLanguage } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { FileDropzone } from '../ui/FileDropzone';
import { Checkbox } from '../ui/FormControls';
import { EmptyState } from '../ui/EmptyState';
import { ProgressBar } from '../ui/Feedback';
import { useToast } from '../ui/Toast';
import { useApp } from '../../context/AppContext';

export interface TextbookLibraryViewProps {
  onSelectChapterManager: (textbookId: string) => void;
  onOpenSettings: () => void;
}

export const TextbookLibraryView: React.FC<TextbookLibraryViewProps> = ({
  onSelectChapterManager,
  onOpenSettings
}) => {
  const { openCreatePaper } = useApp();
  const { success, error } = useToast();

  const [textbooks, setTextbooks] = useState<TextbookRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Upload Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Science');
  const [grade, setGrade] = useState<number>(10);
  const [board, setBoard] = useState<BoardType>('CBSE');
  const [language, setLanguage] = useState<SupportedLanguage>('English');
  const [copyrightConfirmed, setCopyrightConfirmed] = useState(false);

  // Ingestion progress
  const [progress, setProgress] = useState<IngestionProgress | null>(null);

  useEffect(() => {
    loadTextbooks();
  }, []);

  const loadTextbooks = async () => {
    const list = await db.textbooks.reverse().sortBy('createdAt');
    setTextbooks(list);
  };

  const handleStartIngestion = async () => {
    if (!selectedFile || !title.trim()) {
      error('Please select a file and enter a title.');
      return;
    }
    if (!copyrightConfirmed) {
      error('Please confirm educational fair use rights.');
      return;
    }

    try {
      setIsUploading(true);
      const res = await INGESTION_SERVICE.ingestTextbook(
        selectedFile,
        { title: title.trim(), grade, subject, board, language },
        (p) => setProgress(p)
      );

      // Mirror to local library folder if connected
      await FILE_SYSTEM_SERVICE.saveTextbookFile(selectedFile.name, selectedFile);

      success(`Indexed "${title.trim()}" (${res.chaptersCount} chapters, ${res.chunksCount} chunks).`);
      setShowUploadModal(false);
      resetForm();
      await loadTextbooks();
    } catch (err: any) {
      error(`Extraction failed: ${err.message}`);
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setTitle('');
    setCopyrightConfirmed(false);
    setProgress(null);
  };

  const handleDelete = async (id: string, bookTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${bookTitle}"? Extracted chapters and chunks will also be removed.`)) {
      return;
    }
    try {
      await Promise.all([
        db.textbooks.delete(id),
        db.chapters.where('textbookId').equals(id).delete(),
        db.textbookChunks.where('textbookId').equals(id).delete()
      ]);
      success(`Deleted "${bookTitle}".`);
      await loadTextbooks();
    } catch (err: any) {
      error(`Delete failed: ${err.message}`);
    }
  };

  const filtered = textbooks.filter(tb =>
    tb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tb.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tb.board.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Textbook Library
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Uploaded textbooks are indexed into chapter chunks for ground-truth examination generation.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowUploadModal(true)}
        >
          Upload New Textbook
        </Button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Search textbooks by title or subject..."
            leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          Total Textbooks: <strong className="text-neutral-900 dark:text-neutral-100">{textbooks.length}</strong>
        </div>
      </div>

      {/* Textbooks Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No textbooks match your search' : 'No textbooks uploaded yet'}
          description={
            searchQuery
              ? 'Try searching with different keywords.'
              : 'Upload standard NCERT or board textbook PDFs to extract chapters and generate grounded questions.'
          }
          action={
            searchQuery
              ? undefined
              : {
                  label: 'Upload Your First Textbook',
                  onClick: () => setShowUploadModal(true),
                  icon: <Plus className="w-4 h-4" />
                }
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tb) => {
            const dateStr = new Date(tb.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <Card key={tb.id} className="flex flex-col justify-between">
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="structure">{tb.board} Board</Badge>
                      <Badge variant="neutral">Class {tb.grade}</Badge>
                    </div>
                    <CardTitle className="text-base truncate" title={tb.title}>
                      {tb.title}
                    </CardTitle>
                    <CardDescription>
                      {tb.subject} • {tb.totalPages} Pages • {tb.language || 'English'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-3 text-xs space-y-2">
                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between">
                      <span className="text-neutral-500">File Name:</span>
                      <span className="font-mono text-neutral-800 dark:text-neutral-200 truncate max-w-[150px]">
                        {tb.originalFileName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Uploaded {dateStr}</span>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="pt-3">
                  <Button
                    variant="outline"
                    size="xs"
                    leftIcon={<Layers className="w-3.5 h-3.5 text-brand-700 dark:text-brand-400" />}
                    onClick={() => onSelectChapterManager(tb.id)}
                  >
                    Manage Chapters
                  </Button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => openCreatePaper()}
                      title="Create paper from this book"
                    >
                      Make Paper
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDelete(tb.id, tb.title)}
                      className="text-danger-600 hover:text-danger-700"
                      title="Delete textbook"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => !isUploading && setShowUploadModal(false)}
        size="lg"
        title="Upload Textbook for Ingestion"
        description="Text is extracted page-by-page directly in your browser with OCR fallback."
        footer={
          <>
            <Button variant="ghost" size="sm" disabled={isUploading} onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isUploading}
              disabled={!selectedFile || !title.trim() || !copyrightConfirmed}
              onClick={handleStartIngestion}
            >
              Start Extraction
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2 text-left">
          {!selectedFile ? (
            <FileDropzone
              onFilesSelected={(files) => {
                if (files[0]) {
                  setSelectedFile(files[0]);
                  setTitle(files[0].name.replace(/\.[^/.]+$/, '').replace(/_+/g, ' '));
                }
              }}
              accept=".pdf,.docx,.txt"
              maxSizeMB={100}
            />
          ) : (
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-5 h-5 text-brand-600 shrink-0" />
                <div className="truncate">
                  <div className="font-bold text-neutral-900 dark:text-neutral-100 truncate">{selectedFile.name}</div>
                  <div className="text-[11px] text-neutral-400">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</div>
                </div>
              </div>
              {!isUploading && (
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-neutral-400 hover:text-danger-600 text-xs font-semibold ml-3"
                >
                  Change File
                </button>
              )}
            </div>
          )}

          <Input
            label="Textbook Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. NCERT Class 10 Science"
            required
            disabled={isUploading}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isUploading}
            />
            <Input
              label="Class / Grade"
              type="number"
              min={1}
              max={12}
              value={grade}
              onChange={(e) => setGrade(parseInt(e.target.value, 10) || 10)}
              disabled={isUploading}
            />
            <Select
              label="Board"
              value={board}
              onValueChange={(val: any) => setBoard(val)}
              options={[
                { value: 'CBSE', label: 'CBSE' },
                { value: 'ICSE', label: 'ICSE' },
                { value: 'Maharashtra', label: 'Maharashtra Board' },
                { value: 'State Board', label: 'Other State Board' },
              ]}
              disabled={isUploading}
            />
          </div>

          <Checkbox
            label="I confirm this textbook is used for educational assessment purposes under fair use."
            description="Content never leaves your computer except for short snippet queries to your configured AI provider."
            checked={copyrightConfirmed}
            onCheckedChange={setCopyrightConfirmed}
            disabled={isUploading}
          />

          {isUploading && progress && (
            <div className="space-y-2 pt-2">
              <ProgressBar
                value={progress.percent}
                label={`${progress.message} (${progress.currentPage}/${progress.totalPages} pages)`}
                variant="brand"
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
