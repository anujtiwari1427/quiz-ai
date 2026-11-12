import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Upload, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Search, 
  X,
  Clock,
  Download
} from 'lucide-react';
import { db } from '../../db';
import { INGESTION_SERVICE, IngestionProgress } from '../../services/ingestionService';
import { FILE_SYSTEM_SERVICE } from '../../services/fileSystemService';
import { TextbookRecord, BoardType, SupportedLanguage } from '../../types';

interface TextbookLibraryViewProps {
  onSelectChapterManager: (textbookId: string) => void;
  onOpenSettings: () => void;
}

export const TextbookLibraryView: React.FC<TextbookLibraryViewProps> = ({
  onSelectChapterManager,
  onOpenSettings
}) => {
  const [textbooks, setTextbooks] = useState<TextbookRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Science');
  const [grade, setGrade] = useState<number>(10);
  const [board, setBoard] = useState<BoardType>('CBSE');
  const [language, setLanguage] = useState<SupportedLanguage>('English');
  const [copyrightConfirmed, setCopyrightConfirmed] = useState(false);

  // Ingestion progress
  const [progress, setProgress] = useState<IngestionProgress | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadTextbooks();
  }, []);

  const loadTextbooks = async () => {
    const list = await db.textbooks.reverse().sortBy('createdAt');
    setTextbooks(list);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_+/g, ' '));
    }
  };

  const handleStartIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !copyrightConfirmed) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const res = await INGESTION_SERVICE.ingestTextbook(
        selectedFile,
        { title, grade, subject, board, language },
        (prog) => setProgress(prog)
      );

      // Auto-save copy to Library Folder if connected
      const createdTb = await db.textbooks.get(res.textbookId);
      if (createdTb) {
        await FILE_SYSTEM_SERVICE.saveTextbookToFolder(createdTb, createdTb.fileBlob);
      }

      await loadTextbooks();
      setIsUploading(false);
      setShowUploadModal(false);
      setSelectedFile(null);
      setProgress(null);
    } catch (err: any) {
      setIsUploading(false);
      setErrorMessage(err.message || 'Ingestion failed.');
    }
  };

  const handleDeleteTextbook = async (id: string, name: string) => {
    if (confirm(`Delete "${name}" from your local library? This will also remove its indexed chapters.`)) {
      await db.textbooks.delete(id);
      await db.chapters.where('textbookId').equals(id).delete();
      await db.textbookChunks.where('textbookId').equals(id).delete();
      await loadTextbooks();
    }
  };

  const handleDownloadOriginal = (tb: TextbookRecord) => {
    if (tb.fileBlob) {
      FILE_SYSTEM_SERVICE.triggerBrowserDownload(tb.fileBlob, tb.originalFileName || `${tb.title}.pdf`);
    } else {
      alert('Original file blob is not available in local store.');
    }
  };

  const filtered = textbooks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202342] tracking-tight">
            Textbook &amp; Curriculum Library
          </h1>
          <p className="text-xs sm:text-sm text-[#4e516a] mt-1">
            Upload textbooks, NCERT chapters, and syllabus guides. Stored 100% on this computer.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-2.5 rounded-full bg-[#4555fd] hover:bg-[#3343e0] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Textbook (PDF)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search local textbooks by title or subject..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4555fd] bg-white"
          />
        </div>

        <span className="text-xs font-semibold text-slate-500 self-end sm:self-auto">
          {filtered.length} {filtered.length === 1 ? 'Book' : 'Books'} Indexed Locally
        </span>
      </div>

      {/* Textbooks Grid */}
      {filtered.length === 0 ? (
        <div className="mt-12 p-12 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-white">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">No textbooks uploaded yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Upload NCERT or State Board PDFs to extract chapters, exercises, and ground AI question generation.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-2.5 rounded-full bg-[#4555fd] text-white font-bold text-xs"
          >
            Upload Your First Textbook
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map(tb => (
            <div 
              key={tb.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#c2d4ff] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#edf2ff] text-[#4555fd] border border-[#c2d4ff]">
                    Class {tb.grade} • {tb.board}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {tb.totalPages} Pages
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-[#202342] line-clamp-2 leading-snug">
                  {tb.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {tb.subject} • {tb.language || 'English'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectChapterManager(tb.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-[#edf2ff] text-[#4555fd] font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Manage Chapters</span>
                </button>

                <div className="flex items-center gap-1">
                  {tb.fileBlob && (
                    <button
                      onClick={() => handleDownloadOriginal(tb)}
                      title="Download original file"
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTextbook(tb.id, tb.title)}
                    title="Delete textbook"
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <h3 className="font-bold text-slate-800 text-sm">Upload Local Textbook (PDF)</h3>
              <button 
                onClick={() => {
                  if (isUploading) INGESTION_SERVICE.cancel();
                  setShowUploadModal(false);
                }}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartIngest} className="p-6 space-y-4 text-xs">
              
              {/* File Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Textbook File (.pdf)</label>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  disabled={isUploading}
                  onChange={handleFileChange}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#edf2ff] file:text-[#4555fd] file:font-bold file:cursor-pointer"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Textbook Title</label>
                <input
                  type="text"
                  required
                  disabled={isUploading}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. NCERT Class 10 Science"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#4555fd]"
                />
              </div>

              {/* Subject & Grade */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    disabled={isUploading}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Science, Mathematics"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#4555fd]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class / Grade</label>
                  <select
                    value={grade}
                    disabled={isUploading}
                    onChange={(e) => setGrade(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#4555fd] bg-white"
                  >
                    {[6, 7, 8, 9, 10, 11, 12].map(g => (
                      <option key={g} value={g}>Class {g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Board & Language */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Board</label>
                  <select
                    value={board}
                    disabled={isUploading}
                    onChange={(e) => setBoard(e.target.value as BoardType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#4555fd] bg-white"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board (Maharashtra)">Maharashtra State Board</option>
                    <option value="State Board (Karnataka)">Karnataka PUE Board</option>
                    <option value="General">Other / General</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Language</label>
                  <select
                    value={language}
                    disabled={isUploading}
                    onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#4555fd] bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Marathi">Marathi (मराठी)</option>
                  </select>
                </div>
              </div>

              {/* Educational Copyright Confirmation */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={copyrightConfirmed}
                    disabled={isUploading}
                    onChange={(e) => setCopyrightConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-[#4555fd]"
                  />
                  <span className="text-slate-600 leading-tight text-[11px]">
                    I confirm that I have the right to use this educational material for school examination drafting. Files are processed locally on this device.
                  </span>
                </label>
              </div>

              {/* Progress reporting during extraction */}
              {isUploading && progress && (
                <div className="p-3.5 rounded-xl bg-[#edf2ff] border border-[#c2d4ff] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#4555fd]">
                    <span>{progress.message}</span>
                    <span>{progress.percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className="h-full bg-[#4555fd] transition-all duration-200" 
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !copyrightConfirmed || !selectedFile}
                  className="px-5 py-2 rounded-xl bg-[#4555fd] hover:bg-[#3343e0] text-white font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  {isUploading ? 'Extracting Pages...' : 'Start Extraction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
