import React, { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { UploadCloud, File, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { ProgressBar } from './Feedback';

export interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  disabled?: boolean;
  progressStage?: string;
  progressPercent?: number;
  className?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesSelected,
  accept = '.pdf,.docx,.txt',
  maxSizeMB = 100,
  multiple = false,
  disabled = false,
  progressStage,
  progressPercent,
  className
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const validFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File "${file.name}" exceeds the ${maxSizeMB}MB size limit.`);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  return (
    <div className={clsx('w-full space-y-2', className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={clsx(
          'w-full p-8 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center select-none flex flex-col items-center justify-center',
          isDragOver
            ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/20 scale-[1.01]'
            : 'border-neutral-300 dark:border-neutral-700/80 bg-neutral-50/50 dark:bg-neutral-900/40 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900/60',
          disabled && 'opacity-60 cursor-not-allowed pointer-events-none'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="w-12 h-12 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-soft-xs flex items-center justify-center text-neutral-500 mb-3 group-hover:scale-105 transition-transform">
          <UploadCloud className="w-6 h-6 text-brand-600 dark:text-brand-400" />
        </div>

        <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          Click to upload or drag & drop textbook
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
          Supports PDF, DOCX, TXT up to {maxSizeMB}MB. Extracted page-by-page directly in your browser.
        </p>
      </div>

      {/* Progress display if actively extracting */}
      {progressPercent !== undefined && progressStage && (
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-soft-xs">
          <ProgressBar
            value={progressPercent}
            label={progressStage}
            variant="brand"
          />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-danger-600 dark:text-danger-400 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
