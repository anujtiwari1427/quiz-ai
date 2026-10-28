import React, { useState, useEffect } from 'react';
import { 
  X, Play, Pause, RotateCcw, Volume2, Maximize2, 
  Sparkles, CheckCircle2, BookOpen, Clock, UserCheck, MessageSquare 
} from 'lucide-react';
import { PwVideoSolutionData } from '../../../mock/pwTestData';
import { PwThemeConfig } from './pwTheme';

interface PwVideoSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoData?: PwVideoSolutionData;
  questionNumber: number;
  questionText: string;
  theme: PwThemeConfig;
  onAskDoubt?: () => void;
}

export const PwVideoSolutionModal: React.FC<PwVideoSolutionModalProps> = ({
  isOpen,
  onClose,
  videoData,
  questionNumber,
  questionText,
  theme,
  onAskDoubt
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentProgressSec, setCurrentProgressSec] = useState<number>(12);
  const [activeTimestampIndex, setActiveTimestampIndex] = useState<number>(0);

  const durationSec = 165; // ~2m 45s

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentProgressSec(prev => {
        if (prev >= durationSec) {
          setIsPlaying(false);
          return durationSec;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, playbackSpeed]);

  if (!isOpen || !videoData) return null;

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = Math.min(100, Math.round((currentProgressSec / durationSec) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border ${theme.cardBorder} ${theme.cardBg} shadow-2xl flex flex-col`}>
        
        {/* Modal Top Bar */}
        <div className={`p-4 sm:p-5 border-b ${theme.cardBorder} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5a4bda] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-600/30">
              EP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#818cf8]">
                  EduPlus Video Solution Simulator
                </span>
                <span className="text-[11px] px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 font-mono">
                  Official Faculty
                </span>
              </div>
              <h3 className={`text-sm sm:text-base font-bold ${theme.textPrimary}`}>
                Q{questionNumber}: {videoData.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border ${theme.subCardBorder} ${theme.subCardBg} ${theme.textMuted} hover:${theme.textPrimary} transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Simulator Canvas */}
        <div className="relative aspect-video w-full bg-slate-950 flex flex-col justify-between overflow-hidden group select-none">
          {/* Smart Board Simulation */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1222] via-[#090d1a] to-[#04060d] p-6 flex flex-col justify-between">
            {/* Top faculty indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  AP
                </div>
                <div>
                  <span className="text-xs font-bold text-white block leading-tight">{videoData.instructor}</span>
                  <span className="text-[10px] text-amber-300 block">EduPlus Master Faculty</span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>REC LIVE SOLUTION</span>
              </div>
            </div>

            {/* Simulated Smart Board Solution Text / Diagram */}
            <div className="max-w-2xl mx-auto my-auto space-y-4 text-center">
              <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                EduPlus SmartBoard Derivation Canvas
              </div>
              <p className="text-white text-base sm:text-lg font-mono font-semibold tracking-wide drop-shadow-md">
                "{questionText.slice(0, 110)}..."
              </p>

              {/* Active step chalk highlight */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md text-left space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block font-mono">
                  Active Whiteboard Note:
                </span>
                <p className="text-sm font-mono text-emerald-300">
                  {videoData.whiteboardNotes[activeTimestampIndex % videoData.whiteboardNotes.length] || videoData.whiteboardNotes[0]}
                </p>
              </div>
            </div>

            {/* Bottom time display */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Time: {formatSecs(currentProgressSec)} / {formatSecs(durationSec)}</span>
              <span className="text-indigo-400">EduPlus UltraHD 1080p Stream</span>
            </div>
          </div>

          {/* Scrub Bar */}
          <div className="relative z-10 w-full h-1.5 bg-white/20 hover:h-2.5 transition-all cursor-pointer">
            <div 
              className="h-full bg-[#5a4bda] rounded-r-full relative"
              style={{ width: `${progressPct}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md" />
            </div>
          </div>

          {/* Player Controls Bar */}
          <div className="relative z-10 bg-black/85 backdrop-blur-md p-3 px-4 flex items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
              </button>

              <button 
                onClick={() => setCurrentProgressSec(0)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-slate-300">
                {formatSecs(currentProgressSec)} / {formatSecs(durationSec)}
              </span>
            </div>

            {/* Speed & Audio controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5 text-xs font-mono">
                {[1.0, 1.25, 1.5, 2.0].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded-md transition-colors ${
                      playbackSpeed === speed ? 'bg-[#5a4bda] text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <button className="p-1.5 text-slate-400 hover:text-white">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chapters & Key Whiteboard Notes */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Timestamp Chapters */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${theme.textMuted} flex items-center gap-1.5`}>
              <Clock className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>Video Chapters &amp; Timestamps</span>
            </h4>

            <div className="space-y-2">
              {videoData.timestamps.map((ts, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTimestampIndex(idx);
                    const [m, s] = ts.time.split(':').map(Number);
                    setCurrentProgressSec(m * 60 + s);
                    setIsPlaying(true);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                    activeTimestampIndex === idx
                      ? `${theme.badgeBg} border-[#5a4bda]/40 font-bold`
                      : `${theme.subCardBg} ${theme.subCardBorder} ${theme.textSecondary} hover:${theme.textPrimary}`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-black/30 font-mono text-[10px] text-amber-400">
                      {ts.time}
                    </span>
                    <span>{ts.label}</span>
                  </div>
                  <Play className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Whiteboard summary notes */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${theme.textMuted} flex items-center gap-1.5`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SmartBoard Chalkboard Summary</span>
            </h4>

            <div className={`p-4 rounded-2xl border ${theme.subCardBorder} ${theme.subCardBg} space-y-2`}>
              {videoData.whiteboardNotes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className={theme.textSecondary}>{note}</span>
                </div>
              ))}
            </div>

            {onAskDoubt && (
              <button
                onClick={() => {
                  onClose();
                  onAskDoubt();
                }}
                className={`w-full py-2.5 rounded-xl ${theme.accentBtn} text-xs font-bold flex items-center justify-center gap-2 shadow-lg`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Still have doubts? Ask EduPlus AI Assistant</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
