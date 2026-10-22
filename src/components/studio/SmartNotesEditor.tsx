import React, { useState } from 'react';
import { 
  SmartNotes, 
  IngestedSource 
} from '../../types/strater';
import { 
  Edit3, 
  Eye, 
  Save, 
  Copy, 
  Check, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Tag, 
  CheckSquare, 
  FileText,
  Sparkles
} from 'lucide-react';
import { STRATER_STORAGE_SERVICE } from '../../services/straterStorageService';

interface SmartNotesEditorProps {
  source: IngestedSource;
  notes: SmartNotes;
  onNotesUpdated?: (updated: SmartNotes) => void;
}

export const SmartNotesEditor: React.FC<SmartNotesEditorProps> = ({
  source,
  notes,
  onNotesUpdated
}) => {
  const [isEditingMarkdown, setIsEditingMarkdown] = useState(false);
  const [markdownContent, setMarkdownContent] = useState(notes.notesMarkdown);
  const [summaryText, setSummaryText] = useState(notes.summary);
  const [cues, setCues] = useState(notes.cues);
  const [actionItems, setActionItems] = useState(notes.actionItems);
  const [newActionItem, setNewActionItem] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  // Cue inputs
  const [showAddCue, setShowAddCue] = useState(false);
  const [newCueQuestion, setNewCueQuestion] = useState('');
  const [newCueTags, setNewCueTags] = useState('Recall, Key');

  const handleSaveNotes = () => {
    const updated: SmartNotes = {
      ...notes,
      notesMarkdown: markdownContent,
      summary: summaryText,
      cues,
      actionItems,
      lastEditedAt: new Date().toISOString()
    };
    STRATER_STORAGE_SERVICE.saveSmartNotes(updated);
    onNotesUpdated?.(updated);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2000);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddCue = () => {
    if (!newCueQuestion.trim()) return;
    const tags = newCueTags.split(',').map(t => t.trim()).filter(Boolean);
    const newCue = {
      id: `cue_${Date.now()}`,
      cueQuestion: newCueQuestion.trim(),
      referenceAnchor: `#cue-${Date.now()}`,
      tags
    };
    setCues(prev => [...prev, newCue]);
    setNewCueQuestion('');
    setShowAddCue(false);
  };

  const handleDeleteCue = (id: string) => {
    setCues(prev => prev.filter(c => c.id !== id));
  };

  const handleAddActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionItem.trim()) return;
    setActionItems(prev => [...prev, newActionItem.trim()]);
    setNewActionItem('');
  };

  const handleDeleteActionItem = (index: number) => {
    setActionItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#1c1c1e] border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#0071e3]/20 text-[#2997ff] border border-[#0071e3]/30">
              Cornell System
            </span>
            <span className="text-xs text-[#86868b]">Last edited: {new Date(notes.lastEditedAt).toLocaleTimeString()}</span>
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight mt-1">{notes.title}</h2>
        </div>

        <div className="flex items-center gap-2">
          {savedBanner && (
            <span className="text-xs text-[#30d158] font-medium flex items-center gap-1 animate-fade-in">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}

          <button
            onClick={() => setIsEditingMarkdown(!isEditingMarkdown)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
          >
            {isEditingMarkdown ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditingMarkdown ? 'Preview' : 'Edit Markdown'}</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#86868b] hover:text-white transition-colors"
            title="Copy Markdown"
          >
            {copied ? <Check className="w-4 h-4 text-[#30d158]" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleSaveNotes}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 font-semibold"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Notes</span>
          </button>
        </div>
      </div>

      {/* Main Cornell Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Cues & Recall Questions (35% width on desktop) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2997ff] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Cues & Recall Questions</span>
              </h3>
              <p className="text-[11px] text-[#86868b] mt-0.5">Cover right column and test yourself</p>
            </div>
            <button
              onClick={() => setShowAddCue(!showAddCue)}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#a1a1a6] hover:text-white transition-colors"
              title="Add Cue"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Cue Input Drawer */}
          {showAddCue && (
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-2.5 animate-fade-in">
              <input
                type="text"
                value={newCueQuestion}
                onChange={(e) => setNewCueQuestion(e.target.value)}
                placeholder="Study prompt or cue question..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-[#86868b] text-xs focus:outline-none focus:border-[#0071e3]"
              />
              <input
                type="text"
                value={newCueTags}
                onChange={(e) => setNewCueTags(e.target.value)}
                placeholder="Tags: Recall, Exam, Definition"
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-[#86868b] text-xs focus:outline-none focus:border-[#0071e3]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCue(false)}
                  className="px-2.5 py-1 rounded-lg text-[11px] text-[#86868b] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCue}
                  className="px-3 py-1 rounded-lg text-[11px] bg-[#0071e3] text-white font-medium"
                >
                  Add Cue
                </button>
              </div>
            </div>
          )}

          {/* Cue Items List */}
          <div className="space-y-3">
            {cues.map(cue => (
              <div 
                key={cue.id}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all group relative space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-white leading-snug">
                    {cue.cueQuestion}
                  </p>
                  <button
                    onClick={() => handleDeleteCue(cue.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#86868b] hover:text-red-400 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {cue.tags.map((tag, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/5 text-[#a1a1a6] border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Main Study & Lecture Notes (65% width on desktop) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#30d158] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Lecture & Study Notes Column</span>
            </h3>
            <span className="text-xs text-[#86868b]">Markdown Supported</span>
          </div>

          {isEditingMarkdown ? (
            <textarea
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              rows={18}
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-[#f5f5f7] font-mono text-xs focus:outline-none focus:border-[#0071e3] resize-y leading-relaxed"
            />
          ) : (
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#d1d1d6] leading-relaxed space-y-3 font-sans">
              <div className="whitespace-pre-wrap leading-relaxed p-2">
                {markdownContent}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Executive Summary & Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Bottom Left / Main: Bottom Summary Area */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#bf5af2] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cornell Bottom Summary Area</span>
          </h3>
          <textarea
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            rows={4}
            placeholder="Synthesize the whole page in 2-3 sentences from memory..."
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-[#86868b] text-xs focus:outline-none focus:border-[#0071e3] resize-none leading-relaxed"
          />
        </div>

        {/* Bottom Right: Action Items Checklist */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#ff9f0a] flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>High-Yield Action Items</span>
          </h3>

          <div className="space-y-2">
            {actionItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-[#d1d1d6]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a]" />
                  <span>{item}</span>
                </div>
                <button
                  onClick={() => handleDeleteActionItem(idx)}
                  className="text-[#86868b] hover:text-red-400 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddActionItem} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newActionItem}
              onChange={(e) => setNewActionItem(e.target.value)}
              placeholder="Add next study task..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-[#86868b] text-xs focus:outline-none focus:border-[#0071e3]"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium"
            >
              Add
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
