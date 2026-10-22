import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  FileCode, 
  Presentation, 
  Globe, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Clock,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { SourceType, SourceIngestionInput, IngestedSource } from '../../types/strater';
import { AI_SYNTHESIZER_SERVICE } from '../../services/aiSynthesizerService';
import { STRATER_STORAGE_SERVICE } from '../../services/straterStorageService';

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface IngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSourceIngested: (source: IngestedSource) => void;
}

const SAMPLE_PRESETS: {
  label: string;
  sourceType: SourceType;
  title: string;
  sourceUrl?: string;
  content: string;
  author: string;
  tags: string[];
}[] = [
  {
    label: '🎥 YouTube: MIT Distributed Consensus',
    sourceType: 'youtube',
    title: 'Distributed Consensus & Raft Protocol Demystified',
    sourceUrl: 'https://www.youtube.com/watch?v=vYp4LYbnnW8',
    content: 'Lecture on Byzantine fault tolerance, log replication, split-brain resolution, and quorum calculation in distributed systems.',
    author: 'MIT Distributed Systems Lab',
    tags: ['Distributed Systems', 'Raft', 'High-Yield']
  },
  {
    label: '📄 PDF: Cardiology Hemodynamics',
    sourceType: 'pdf',
    title: 'Cardiac Cycle, Pressure-Volume Loops & Valvular Pathophysiology',
    content: 'Detailed clinical guide on ventricular compliance, end-systolic pressure-volume relationship (ESPVR), aortic stenosis, and mitral regurgitation murmur auscultation.',
    author: 'Harvard Medical Review',
    tags: ['Medicine', 'Cardiology', 'USMLE']
  },
  {
    label: '📊 PPTX: Deep Learning Architectures',
    sourceType: 'pptx',
    title: 'Transformers, Self-Attention & Multi-Head Scaling',
    content: 'Slide presentation examining scaled dot-product attention, positional encodings, cross-attention in encoder-decoder topologies, and KV cache inference optimization.',
    author: 'Prof. Yann LeCun & Research Team',
    tags: ['Machine Learning', 'AI', 'Transformers']
  },
  {
    label: '🌐 Article: Constitutional Law & Due Process',
    sourceType: 'article',
    title: 'The Evolution of Substantive Due Process in Supreme Court Jurisprudence',
    sourceUrl: 'https://lawreview.org/constitutional-due-process-analysis',
    content: 'Comprehensive treatise analyzing the Fourteenth Amendment Due Process Clause, strict scrutiny standards, fundamental rights doctrines, and landmark precedents.',
    author: 'Stanford Law Review',
    tags: ['Law', 'Constitutional Law', 'Bar Exam']
  }
];

export const IngestionModal: React.FC<IngestionModalProps> = ({
  isOpen,
  onClose,
  onSourceIngested
}) => {
  const [activeTab, setActiveTab] = useState<SourceType>('youtube');
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tagsInput, setTagsInput] = useState('High-Yield, Core Study');

  // Pipeline progress state
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [pipelineStatus, setPipelineStatus] = useState<IngestedSource['status']>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const loadPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setActiveTab(preset.sourceType);
    setTitle(preset.title);
    setSourceUrl(preset.sourceUrl || '');
    setContent(preset.content);
    setAuthor(preset.author);
    setTagsInput(preset.tags.join(', '));
    setErrorMessage(null);
  };

  const handleStartIngestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please provide a title for this source.');
      return;
    }

    if (!content.trim() && activeTab !== 'youtube' && !sourceUrl.trim()) {
      setErrorMessage('Please provide text content or a valid URL.');
      return;
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const userId = STRATER_STORAGE_SERVICE.getActiveUserId();

    const input: SourceIngestionInput = {
      title: title.trim(),
      sourceType: activeTab,
      sourceUrl: sourceUrl.trim() || undefined,
      content: content.trim() || `Study notes and transcripts on ${title}`,
      author: author.trim() || undefined,
      tags
    };

    setIsProcessing(true);
    setPipelineProgress(10);
    setPipelineStatus('validating');
    setStatusMessage('Validating input and initializing neural synthesizer...');

    try {
      const result = await AI_SYNTHESIZER_SERVICE.ingestSource(
        input,
        userId,
        (progress, status, msg) => {
          setPipelineProgress(progress);
          setPipelineStatus(status);
          setStatusMessage(msg);
        }
      );

      // Persist to storage
      STRATER_STORAGE_SERVICE.saveSource(result.source);
      STRATER_STORAGE_SERVICE.saveSummary(result.summary);
      STRATER_STORAGE_SERVICE.saveSmartNotes(result.notes);
      STRATER_STORAGE_SERVICE.saveDeck(result.deck);
      STRATER_STORAGE_SERVICE.saveMindMap(result.mindMap);
      STRATER_STORAGE_SERVICE.saveQuiz(result.quiz);

      setTimeout(() => {
        setIsProcessing(false);
        onSourceIngested(result.source);
        onClose();
      }, 500);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'An error occurred during ingestion. Please check the source format.');
    }
  };

  const tabs: { type: SourceType; label: string; icon: any }[] = [
    { type: 'youtube', label: 'YouTube Video', icon: YoutubeIcon },
    { type: 'pdf', label: 'PDF Document', icon: FileText },
    { type: 'docx', label: 'Word DOCX', icon: FileCode },
    { type: 'pptx', label: 'PPTX Slides', icon: Presentation },
    { type: 'article', label: 'Web Article', icon: Globe },
    { type: 'text', label: 'Raw Notes / Text', icon: BookOpen }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#1c1c1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0071e3] to-[#2997ff] flex items-center justify-center shadow-lg shadow-[#0071e3]/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">Ingest Study Material</h2>
              <p className="text-xs text-[#86868b]">Convert videos, slide decks, PDFs & notes into synthesized AI study artifacts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-[#86868b] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Carousel */}
        {!isProcessing && (
          <div className="px-6 py-2.5 bg-black/30 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[#86868b] text-[11px] font-medium shrink-0 flex items-center gap-1">
              ⚡ Quick Demos:
            </span>
            {SAMPLE_PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => loadPreset(p)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[#d1d1d6] hover:text-white border border-white/10 text-[11px] shrink-0 transition-all hover:scale-[1.02]"
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Processing State View */}
        {isProcessing ? (
          <div className="p-8 flex flex-col items-center justify-center text-center my-auto space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-white/10 border-t-[#0071e3] animate-spin" />
              <Sparkles className="w-8 h-8 text-[#2997ff] absolute inset-0 m-auto animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-lg font-semibold text-white">Synthesizing Learning Studio</h3>
              <p className="text-xs text-[#86868b] min-h-[36px]">{statusMessage}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-sm space-y-1.5">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0071e3] to-[#30d158] transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${pipelineProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#86868b]">
                <span>Status: {pipelineStatus.toUpperCase()}</span>
                <span className="font-mono text-white font-semibold">{pipelineProgress}%</span>
              </div>
            </div>

            {/* Stage Indicators */}
            <div className="grid grid-cols-4 gap-2 w-full max-w-md text-left text-[11px]">
              <div className={`p-2 rounded-lg border ${pipelineProgress >= 20 ? 'bg-[#0071e3]/10 border-[#0071e3]/30 text-white' : 'bg-white/5 border-white/5 text-[#86868b]'}`}>
                1. Ingestion
              </div>
              <div className={`p-2 rounded-lg border ${pipelineProgress >= 45 ? 'bg-[#0071e3]/10 border-[#0071e3]/30 text-white' : 'bg-white/5 border-white/5 text-[#86868b]'}`}>
                2. Semantic Parse
              </div>
              <div className={`p-2 rounded-lg border ${pipelineProgress >= 75 ? 'bg-[#0071e3]/10 border-[#0071e3]/30 text-white' : 'bg-white/5 border-white/5 text-[#86868b]'}`}>
                3. Cornell Notes
              </div>
              <div className={`p-2 rounded-lg border ${pipelineProgress >= 95 ? 'bg-[#30d158]/10 border-[#30d158]/30 text-[#30d158]' : 'bg-white/5 border-white/5 text-[#86868b]'}`}>
                4. SM-2 Decks
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleStartIngestion} className="flex-1 overflow-y-auto p-6 space-y-5">
            
            {/* Source Type Selector Tabs */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.type;
                return (
                  <button
                    key={tab.type}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.type);
                      setErrorMessage(null);
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-white/10 text-white shadow-sm border border-white/15'
                        : 'text-[#86868b] hover:text-[#d1d1d6] hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#2997ff]' : ''}`} />
                    <span className="text-[11px] truncate w-full text-center">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Title & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-[#a1a1a6]">Source Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus & Raft Protocol"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#86868b] text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#a1a1a6]">Author / Instructor</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. MIT 6.824 Lab"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#86868b] text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>
            </div>

            {/* URL Input (For YouTube or Web Article) */}
            {(activeTab === 'youtube' || activeTab === 'article') && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#a1a1a6] flex items-center justify-between">
                  <span>{activeTab === 'youtube' ? 'YouTube Video URL *' : 'Web Article or Paper URL *'}</span>
                  <span className="text-[10px] text-[#86868b]">Auto-extracts timestamps & transcript</span>
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder={activeTab === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://arxiv.org/html/...'}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#86868b] text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>
            )}

            {/* Content Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#a1a1a6] flex items-center justify-between">
                <span>
                  {activeTab === 'youtube' ? 'Transcript Excerpt or Notes (Optional)' :
                   activeTab === 'pdf' ? 'Extracted Text or PDF Content Outline' :
                   activeTab === 'pptx' ? 'Slide Deck Content & Speaker Notes' :
                   'Text Content / Lecture Transcript'}
                </span>
                <span className="text-[10px] text-[#86868b]">
                  {content.length > 0 ? `${content.split(/\s+/).filter(Boolean).length} words` : 'Paste text here'}
                </span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder={
                  activeTab === 'youtube'
                    ? 'Paste transcript if available, or click a Quick Demo above for auto-populated content.'
                    : 'Paste the document body, lecture slides, or reading assignment text here...'
                }
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#86868b] text-xs focus:outline-none focus:border-[#0071e3] resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#a1a1a6]">Tags (Comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="High-Yield, Exam Prep, Foundations"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#86868b] text-xs focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#86868b] hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-medium bg-[#0071e3] hover:bg-[#0077ed] text-white flex items-center gap-2 shadow-lg shadow-[#0071e3]/25 hover:shadow-[#0071e3]/40 transition-all font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Synthesize Knowledge Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
