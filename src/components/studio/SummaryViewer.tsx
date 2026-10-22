import React, { useState } from 'react';
import { 
  StudySummary, 
  IngestedSource 
} from '../../types/strater';
import { 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Lightbulb, 
  Search, 
  Copy, 
  Check, 
  Layers, 
  Star,
  Compass
} from 'lucide-react';

interface SummaryViewerProps {
  source: IngestedSource;
  summary: StudySummary;
  onOpenQuiz?: () => void;
  onOpenFlashcards?: () => void;
}

export const SummaryViewer: React.FC<SummaryViewerProps> = ({
  source,
  summary,
  onOpenQuiz,
  onOpenFlashcards
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [audioProgress, setAudioProgress] = useState<number>(35); // simulated audio progress %
  const [understoodTakeaways, setUnderstoodTakeaways] = useState<Record<string, boolean>>({});
  const [glossaryFilter, setGlossaryFilter] = useState('');
  const [copied, setCopied] = useState(false);

  const toggleTakeaway = (id: string) => {
    setUnderstoodTakeaways(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopySummary = () => {
    const text = `${summary.tldr}\n\n${summary.executiveSummary}\n\nKey Takeaways:\n${summary.keyTakeaways.map(k => `- ${k.text}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredGlossary = summary.glossary.filter(g => 
    g.term.toLowerCase().includes(glossaryFilter.toLowerCase()) ||
    g.definition.toLowerCase().includes(glossaryFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      
      {/* Top Banner / Audio Playback Player */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 via-[#1c1c1e] to-purple-900/20 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="w-12 h-12 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#0071e3]/30 transition-all hover:scale-105"
          >
            {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">AI Audio Briefing</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-[#30d158]/20 text-[#30d158] border border-[#30d158]/30">
                Studio Quality
              </span>
            </div>
            <p className="text-xs text-[#86868b] mt-0.5">
              {isPlayingAudio ? 'Now playing synthesized overview...' : 'Listen to 3-minute executive summary voiceover'}
            </p>
          </div>
        </div>

        {/* Audio scrubber & controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:w-48 flex items-center gap-2">
            <span className="text-[10px] text-[#86868b] font-mono">01:12</span>
            <div 
              className="h-1.5 flex-1 bg-white/10 rounded-full cursor-pointer relative overflow-hidden"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setAudioProgress(Math.round(pos * 100));
              }}
            >
              <div 
                className="h-full bg-[#0071e3] rounded-full" 
                style={{ width: `${audioProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-[#86868b] font-mono">03:20</span>
          </div>

          <button
            onClick={() => {
              const speeds = [1, 1.25, 1.5, 2];
              const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
              setPlaybackSpeed(next);
            }}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono font-medium text-white transition-colors"
          >
            {playbackSpeed}x
          </button>

          <button
            onClick={handleCopySummary}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[#86868b] hover:text-white transition-colors"
            title="Copy summary text"
          >
            {copied ? <Check className="w-4 h-4 text-[#30d158]" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* TL;DR Callout Card */}
      <div className="p-5 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/25 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0071e3]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#0071e3]/20 border border-[#0071e3]/30 text-[#2997ff] shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2997ff]">TL;DR High-Yield Synthesis</span>
              <span className="text-[10px] text-[#86868b]">• {summary.estimatedStudyTimeMinutes} min active review</span>
            </div>
            <p className="text-sm text-[#f5f5f7] leading-relaxed font-medium">
              {summary.tldr}
            </p>
          </div>
        </div>
      </div>

      {/* Executive Summary Narrative */}
      <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0071e3]" />
            <span>Executive Conceptual Breakdown</span>
          </h3>
          <span className="text-xs text-[#86868b]">Difficulty: <strong className="text-white">{summary.difficultyRating}</strong></span>
        </div>
        <p className="text-xs sm:text-sm text-[#a1a1a6] leading-relaxed whitespace-pre-line">
          {summary.executiveSummary}
        </p>
      </div>

      {/* Key Takeaways Checklist */}
      <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-[#ff9f0a]" />
            <span>Core Takeaways & Principles</span>
          </h3>
          <span className="text-xs text-[#86868b]">Click items as you master them</span>
        </div>

        <div className="space-y-2.5">
          {summary.keyTakeaways.map(item => {
            const isChecked = !!understoodTakeaways[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleTakeaway(item.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? 'bg-[#30d158]/5 border-[#30d158]/30 opacity-70'
                    : 'bg-white/[0.03] border-white/5 hover:border-white/15'
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                    isChecked
                      ? 'bg-[#30d158] border-[#30d158] text-black'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <div className="flex-1">
                  <p className={`text-xs leading-relaxed ${isChecked ? 'line-through text-[#86868b]' : 'text-[#f5f5f7]'}`}>
                    {item.text}
                  </p>
                </div>
                {item.important && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-[#ff9f0a]/15 text-[#ff9f0a] border border-[#ff9f0a]/30 shrink-0">
                    High Yield
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Concept Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#bf5af2]" />
          <span>Deep-Dive Concept Deconstructions</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summary.concepts.map(concept => (
            <div 
              key={concept.id}
              className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 flex flex-col justify-between space-y-3 hover:border-white/20 transition-all hover:shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                    concept.complexity === 'Foundational'
                      ? 'bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30'
                      : concept.complexity === 'Intermediate'
                      ? 'bg-[#0071e3]/15 text-[#2997ff] border border-[#0071e3]/30'
                      : 'bg-[#bf5af2]/15 text-[#bf5af2] border border-[#bf5af2]/30'
                  }`}>
                    {concept.complexity}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white tracking-tight">{concept.name}</h4>
                <p className="text-xs text-[#86868b] leading-relaxed">{concept.oneLineSummary}</p>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 mt-2">
                  <span className="text-[10px] font-semibold text-[#a1a1a6] flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[#ff9f0a]" /> Real-World Analogy
                  </span>
                  <p className="text-xs text-[#d1d1d6] italic leading-snug">
                    "{concept.analogy}"
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                {concept.relatedTerms.map((term, i) => (
                  <span key={i} className="text-[10px] text-[#86868b] bg-white/5 px-2 py-0.5 rounded-md">
                    #{term}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Glossary */}
      <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Smart Glossary of Domain Terms</h3>
            <p className="text-xs text-[#86868b]">Essential terminology extracted directly from source text</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-2.5" />
            <input
              type="text"
              value={glossaryFilter}
              onChange={(e) => setGlossaryFilter(e.target.value)}
              placeholder="Search glossary..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#86868b] text-xs focus:outline-none focus:border-[#0071e3]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredGlossary.map((g, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{g.term}</span>
                <span className="text-[9px] text-[#86868b] uppercase tracking-wider">{g.context}</span>
              </div>
              <p className="text-xs text-[#a1a1a6] leading-relaxed">{g.definition}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launch Practice CTAs */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Ready to lock this material into long-term memory?</h4>
          <p className="text-xs text-[#86868b]">Review flashcards with SuperMemo SM-2 or test your understanding with an active quiz.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {onOpenFlashcards && (
            <button
              onClick={onOpenFlashcards}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors"
            >
              Review Flashcards
            </button>
          )}
          {onOpenQuiz && (
            <button
              onClick={onOpenQuiz}
              className="btn-primary text-xs py-2 px-4"
            >
              Take Practice Quiz
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
