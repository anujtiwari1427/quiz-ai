import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { 
  Upload, 
  X, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  BookOpen, 
  ShieldCheck,
  FileType,
  Layers,
  Sparkles
} from 'lucide-react';
import { BookModel, PipelineStatus, MAX_FILE_SIZE_BYTES, ALLOWED_FILE_EXTENSIONS } from '../../types/schemas';
import { LIBRARY_SERVICE } from '../../services/libraryService';

interface TextbookUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (book: BookModel) => void;
}

export const TextbookUploadModal: React.FC<TextbookUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [author, setAuthor] = useState('');
  const [uploaderName, setUploaderName] = useState('Curriculum Teacher');
  const [hasRightsDeclaration, setHasRightsDeclaration] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Validation and processing state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState<PipelineStatus>('uploading');
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateAndSelectFile = (file: File) => {
    setErrorMessage(null);
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    // 1. Extension check
    if (!ext || !ALLOWED_FILE_EXTENSIONS.includes(ext as any)) {
      setErrorMessage(`Unsupported format: .${ext}. Only PDF, DOCX, TXT, and EPUB files are supported.`);
      setSelectedFile(null);
      return;
    }

    // 2. 50 MB size limit check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 50 MB.`
      );
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please choose a textbook file (PDF, DOCX, TXT, or EPUB).');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Please enter a textbook title.');
      return;
    }
    if (!hasRightsDeclaration) {
      setErrorMessage('You must confirm the legal rights declaration before uploading.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setProgressPercent(10);
    setStage('uploading');
    setStatusMessage('Preparing upload pipeline...');

    try {
      const uploadedBook = await LIBRARY_SERVICE.processBookUpload(
        selectedFile,
        {
          title: title.trim(),
          subject: subject.trim(),
          author: author.trim() || 'Curriculum Author',
          uploaderName: uploaderName.trim() || 'Educator',
          hasRightsDeclaration: true
        },
        (currentStage, percent, message) => {
          setStage(currentStage);
          setProgressPercent(percent);
          setStatusMessage(message);
        }
      );

      setIsProcessing(false);
      onSuccess(uploadedBook);
      onClose();
    } catch (err: any) {
      console.error('Upload error:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to extract and process textbook.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0b101b] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-700 flex items-center justify-center text-white shadow-xs">
              <Upload className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Upload Textbook
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Extract chapters and detect exercises for automatic test paper generation
              </p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">Upload Alert</p>
                <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Textbook File (PDF, DOCX, TXT, EPUB — Max 50 MB)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20'
                  : selectedFile
                  ? 'border-purple-500 bg-purple-50/40 dark:bg-purple-950/10'
                  : 'border-slate-300 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-600 bg-slate-50/50 dark:bg-slate-900/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.epub,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/epub+zip"
                onChange={handleFileInputChange}
                disabled={isProcessing}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-left truncate">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.name.split('.').pop()?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  {!isProcessing && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-red-600 dark:hover:text-red-400 px-2.5 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Change
                    </button>
                  )}
                </div>
              ) : (
                <div className="py-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Drag and drop your textbook here, or <span className="text-orange-600 dark:text-orange-400 underline">browse files</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Accepts PDF (required), DOCX, TXT, EPUB up to 50 MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Textbook Title *
              </label>
              <input
                type="text"
                required
                disabled={isProcessing}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Standard 9 Mathematics Part 1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject *
              </label>
              <select
                disabled={isProcessing}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Mathematics">Mathematics / Algebra / Geometry</option>
                <option value="Science">Science & Technology</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Social Science">Social Science / History / Civics</option>
                <option value="Geography">Geography</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
                <option value="General">Other / General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Author / Board
              </label>
              <input
                type="text"
                disabled={isProcessing}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Maharashtra State Bureau / NCERT"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Uploader / Teacher Name
              </label>
              <input
                type="text"
                disabled={isProcessing}
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                placeholder="e.g. Prof. R. Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Legal Rights Declaration */}
          <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                disabled={isProcessing}
                checked={hasRightsDeclaration}
                onChange={(e) => setHasRightsDeclaration(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">Copyright & Right to Use Declaration:</strong> I confirm that I have the legitimate academic right to upload and process this textbook material to create test papers for students.
              </span>
            </label>
          </div>

          {/* Non-Blocking Async Progress Indicator */}
          {isProcessing && (
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-orange-600 animate-spin" />
                  <span className="font-semibold capitalize">{stage}:</span> {statusMessage}
                </span>
                <span className="font-mono font-bold text-orange-600">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div 
                  className="h-full bg-orange-600 transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <span className={stage === 'uploading' ? 'text-orange-600 font-bold' : ''}>1. Validating</span>
                <span className={stage === 'extracting' ? 'text-orange-600 font-bold' : ''}>2. Page Extraction</span>
                <span className={stage === 'indexing' ? 'text-orange-600 font-bold' : ''}>3. Exercise Tagging</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              disabled={isProcessing}
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || !selectedFile || !hasRightsDeclaration}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Textbook...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload & Extract Chapters
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
