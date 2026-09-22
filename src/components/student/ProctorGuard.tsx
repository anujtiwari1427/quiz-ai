import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, Maximize2, AlertCircle } from 'lucide-react';
import { ProctorViolation } from '../../types';

interface ProctorGuardProps {
  enforceFullscreen: boolean;
  detectTabSwitch: boolean;
  blockCopyPaste: boolean;
  onViolation: (violation: Omit<ProctorViolation, 'id' | 'timestamp'>) => void;
  children: React.ReactNode;
}

export const ProctorGuard: React.FC<ProctorGuardProps> = ({
  enforceFullscreen,
  detectTabSwitch,
  blockCopyPaste,
  onViolation,
  children
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [recentWarning, setRecentWarning] = useState<string | null>(null);

  // Tab switch & visibility change listener
  useEffect(() => {
    if (!detectTabSwitch) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        onViolation({
          type: 'tab_switch',
          description: 'Left test browser tab / window switched',
          severity: 'high'
        });
        setRecentWarning('Warning: Tab-switch detected! This event has been sent to your teacher.');
        setTimeout(() => setRecentWarning(null), 5000);
      }
    };

    const handleWindowBlur = () => {
      onViolation({
        type: 'tab_switch',
        description: 'Browser window lost focus',
        severity: 'medium'
      });
      setRecentWarning('Warning: Window focus lost. Please stay focused on the assessment.');
      setTimeout(() => setRecentWarning(null), 4000);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [detectTabSwitch, onViolation]);

  // Copy paste block
  useEffect(() => {
    if (!blockCopyPaste) return;

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      onViolation({
        type: 'paste_attempt',
        description: 'Attempted to copy exam question content',
        severity: 'medium'
      });
      setRecentWarning('Copying question text is disabled by examination policy.');
      setTimeout(() => setRecentWarning(null), 3000);
    };

    const handlePaste = (e: ClipboardEvent) => {
      onViolation({
        type: 'paste_attempt',
        description: 'Attempted to paste external clipboard content into answer field',
        severity: 'high'
      });
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, [blockCopyPaste, onViolation]);

  const requestFullscreen = () => {
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (e) {
      console.log('Fullscreen error', e);
      setIsFullscreen(true);
    }
  };

  return (
    <div className="relative min-h-screen select-none">
      {/* Violation Alert Banner */}
      {recentWarning && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4 animate-bounce">
          <div className="p-3.5 rounded-2xl bg-rose-600 text-white shadow-2xl flex items-center gap-3 text-xs font-bold border border-rose-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{recentWarning}</span>
          </div>
        </div>
      )}

      {/* Fullscreen Prompt if required */}
      {enforceFullscreen && !isFullscreen && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={requestFullscreen}
            className="p-3 rounded-2xl glass-panel-glow bg-brand-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-2xl hover:scale-105 transition-all"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Enter Fullscreen Exam Mode</span>
          </button>
        </div>
      )}

      {children}
    </div>
  );
};
