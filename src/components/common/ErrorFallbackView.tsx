import React from 'react';
import { AlertCircle, RotateCcw, Home, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { FILE_SYSTEM_SERVICE } from '../../services/fileSystemService';

export interface ErrorFallbackViewProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  onGoHome: () => void;
}

export const ErrorFallbackView: React.FC<ErrorFallbackViewProps> = ({
  error,
  resetErrorBoundary,
  onGoHome
}) => {
  const handleBackup = async () => {
    await FILE_SYSTEM_SERVICE.exportFullBackupZip();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-soft-lg space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-danger-50 dark:bg-danger-950/40 text-danger-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Something went wrong
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
            Your data is stored safely in your local IndexedDB. You can reload the view or export a backup archive.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 text-left overflow-x-auto max-h-24">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {resetErrorBoundary && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={resetErrorBoundary}
            >
              Retry Action
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Home className="w-4 h-4" />}
            onClick={onGoHome}
          >
            Go to Dashboard
          </Button>
        </div>

        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={handleBackup}
            className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center justify-center gap-1.5 mx-auto font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Emergency Backup ZIP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
