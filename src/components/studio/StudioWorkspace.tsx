import React, { useState, useEffect } from 'react';
import { 
  IngestedSource, 
  StudySummary, 
  SmartNotes, 
  FlashcardDeck, 
  MindMapData, 
  StudioQuiz, 
  Course,
  UserProfile,
  UserLearningAnalytics
} from '../../types/strater';
import { 
  STRATER_STORAGE_SERVICE 
} from '../../services/straterStorageService';
import { extractYouTubeVideoId, AI_SYNTHESIZER_SERVICE } from '../../services/aiSynthesizerService';
import { IngestionModal } from './IngestionModal';
import { SummaryViewer } from './SummaryViewer';
import { SmartNotesEditor } from './SmartNotesEditor';
import { FlashcardStudio } from './FlashcardStudio';
import { SpacedRepetitionHub } from './SpacedRepetitionHub';
import { MindMapVisualizer } from './MindMapVisualizer';
import { QuizPlayer } from './QuizPlayer';
import { ContextualAiTutor } from './ContextualAiTutor';
import { CourseStudio } from './CourseStudio';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { BillingStudio } from './BillingStudio';
import { AiSettingsModal } from './AiSettingsModal';
import { AuthModal } from './AuthModal';
import { ExportModal } from './ExportModal';
import { 
  Sparkles, 
  Plus, 
  Search, 
  FileText, 
  Presentation, 
  Globe, 
  BookOpen, 
  Layers, 
  TrendingUp, 
  CreditCard, 
  Settings, 
  Download, 
  User, 
  Compass, 
  Clock, 
  Play, 
  Flame, 
  Zap, 
  Trash2,
  ExternalLink,
  ChevronRight,
  Bot
} from 'lucide-react';

export type StudioTab = 'summary' | 'notes' | 'flashcards' | 'mindmap' | 'quiz' | 'tutor';
export type StudioSubView = 'source_workspace' | 'courses' | 'spaced_repetition' | 'analytics' | 'billing';

export const StudioWorkspace: React.FC = () => {
  // State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => STRATER_STORAGE_SERVICE.getCurrentUser());
  const [sources, setSources] = useState<IngestedSource[]>(() => STRATER_STORAGE_SERVICE.getSources());
  const [selectedSourceId, setSelectedSourceId] = useState<string>(() => {
    const list = STRATER_STORAGE_SERVICE.getSources();
    return list[0]?.id || '';
  });
  
  // Navigation
  const [activeSubView, setActiveSubView] = useState<StudioSubView>('source_workspace');
  const [activeTab, setActiveTab] = useState<StudioTab>('summary');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Modals
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [showAiSettingsModal, setShowAiSettingsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Active source artifacts
  const activeSource = sources.find(s => s.id === selectedSourceId) || sources[0];

  const [summary, setSummary] = useState<StudySummary | null>(null);
  const [notes, setNotes] = useState<SmartNotes | null>(null);
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [mindMap, setMindMap] = useState<MindMapData | null>(null);
  const [quiz, setQuiz] = useState<StudioQuiz | null>(null);

  // Video playback timestamp control
  const [videoPlayerTimestamp, setVideoPlayerTimestamp] = useState<number | null>(null);

  // Load artifacts whenever selected source changes (auto-synthesizes if missing)
  useEffect(() => {
    if (activeSource) {
      let s = STRATER_STORAGE_SERVICE.getSummaryForSource(activeSource.id);
      let n = STRATER_STORAGE_SERVICE.getSmartNotesForSource(activeSource.id);
      let d = STRATER_STORAGE_SERVICE.getDeckForSource(activeSource.id);
      let m = STRATER_STORAGE_SERVICE.getMindMapForSource(activeSource.id);
      let q = STRATER_STORAGE_SERVICE.getQuizForSource(activeSource.id);

      if (!s) {
        s = AI_SYNTHESIZER_SERVICE.generateSummary(activeSource);
        STRATER_STORAGE_SERVICE.saveSummary(s);
      }
      if (!n) {
        n = AI_SYNTHESIZER_SERVICE.generateCornellNotes(activeSource);
        STRATER_STORAGE_SERVICE.saveSmartNotes(n);
      }
      if (!d) {
        d = AI_SYNTHESIZER_SERVICE.generateFlashcards(activeSource);
        STRATER_STORAGE_SERVICE.saveDeck(d);
      }
      if (!m) {
        m = AI_SYNTHESIZER_SERVICE.generateMindMap(activeSource);
        STRATER_STORAGE_SERVICE.saveMindMap(m);
      }
      if (!q) {
        q = AI_SYNTHESIZER_SERVICE.generateQuiz(activeSource);
        STRATER_STORAGE_SERVICE.saveQuiz(q);
      }

      setSummary(s);
      setNotes(n);
      setDeck(d);
      setMindMap(m);
      setQuiz(q);
    }
  }, [selectedSourceId, activeSource?.id]);

  // Refresh lists
  const refreshWorkspace = () => {
    const s = STRATER_STORAGE_SERVICE.getSources();
    setSources(s);
    if (!selectedSourceId && s[0]) setSelectedSourceId(s[0].id);
    setCurrentUser(STRATER_STORAGE_SERVICE.getCurrentUser());
  };

  const handleSourceIngested = (newSource: IngestedSource) => {
    refreshWorkspace();
    setSelectedSourceId(newSource.id);
    setActiveSubView('source_workspace');
    setActiveTab('summary');
  };

  const handleDeleteSource = (sourceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this study material from your workspace?')) {
      STRATER_STORAGE_SERVICE.deleteSource(sourceId);
      const remaining = STRATER_STORAGE_SERVICE.getSources();
      setSources(remaining);
      if (selectedSourceId === sourceId) {
        setSelectedSourceId(remaining[0]?.id || '');
      }
    }
  };

  const filteredSources = sources.filter(s => {
    const matchQ = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchType = typeFilter === 'all' || s.sourceType === typeFilter;
    return matchQ && matchType;
  });

  const YoutubeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube': return <YoutubeIcon className="w-4 h-4 text-red-500" />;
      case 'pdf': return <FileText className="w-4 h-4 text-red-400" />;
      case 'pptx': return <Presentation className="w-4 h-4 text-orange-400" />;
      case 'docx': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'article': return <Globe className="w-4 h-4 text-emerald-400" />;
      default: return <BookOpen className="w-4 h-4 text-purple-400" />;
    }
  };

  const allDecks = STRATER_STORAGE_SERVICE.getDecks();
  const allCourses = STRATER_STORAGE_SERVICE.getCourses();
  const analyticsData = STRATER_STORAGE_SERVICE.getAnalytics();

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col font-sans">
      
      {/* Top Universal Studio App Header */}
      <header className="sticky top-0 z-40 bg-[#121214]/90 backdrop-blur-2xl border-b border-white/[0.08] px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0071e3] to-[#bf5af2] flex items-center justify-center shadow-lg shadow-[#0071e3]/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base text-white tracking-tight">Edu AI</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#0071e3]/20 text-[#2997ff] border border-[#0071e3]/30">
                  Study OS
                </span>
              </div>
              <p className="text-[10px] text-[#86868b] hidden sm:block">Synthesizer • Flashcards • Mind Maps • Tutor</p>
            </div>
          </div>

          {/* Center Navigation Switcher */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-white/[0.05] rounded-full border border-white/[0.08]">
            <button
              onClick={() => setActiveSubView('source_workspace')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeSubView === 'source_workspace'
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-[#86868b] hover:text-white'
              }`}
            >
              Workspace
            </button>
            <button
              onClick={() => setActiveSubView('courses')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeSubView === 'courses'
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-[#86868b] hover:text-white'
              }`}
            >
              Courses ({allCourses.length})
            </button>
            <button
              onClick={() => setActiveSubView('spaced_repetition')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                activeSubView === 'spaced_repetition'
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-[#86868b] hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3 text-[#ff9f0a]" />
              <span>Spaced Repetition</span>
            </button>
            <button
              onClick={() => setActiveSubView('analytics')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeSubView === 'analytics'
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-[#86868b] hover:text-white'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveSubView('billing')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeSubView === 'billing'
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-[#86868b] hover:text-white'
              }`}
            >
              Pricing & Plans
            </button>
          </div>

          {/* Right Actions: Persona, BYOK, Ingest */}
          <div className="flex items-center gap-2">
            
            {/* BYOK Settings Icon */}
            <button
              onClick={() => setShowAiSettingsModal(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#86868b] hover:text-white transition-colors"
              title="BYOK & AI Provider Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Persona Switcher */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-white/20"
              />
              <span className="text-xs font-medium text-white hidden sm:block truncate max-w-[100px]">
                {currentUser.name}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#30d158]/20 text-[#30d158] uppercase">
                {currentUser.subscriptionPlan}
              </span>
            </button>

            {/* Ingest CTA */}
            <button
              onClick={() => setShowIngestModal(true)}
              className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-semibold shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest Material</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      {activeSubView === 'courses' ? (
        <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <CourseStudio
            courses={allCourses}
            sources={sources}
            onSelectSource={(src) => {
              setSelectedSourceId(src.id);
              setActiveSubView('source_workspace');
            }}
            onCoursesUpdated={refreshWorkspace}
          />
        </div>
      ) : activeSubView === 'spaced_repetition' ? (
        <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <SpacedRepetitionHub
            decks={allDecks}
            onStartReviewDeck={(targetDeck) => {
              if (targetDeck.sourceId) {
                setSelectedSourceId(targetDeck.sourceId);
              }
              setActiveSubView('source_workspace');
              setActiveTab('flashcards');
            }}
          />
        </div>
      ) : activeSubView === 'analytics' ? (
        <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <AnalyticsDashboard analytics={analyticsData} />
        </div>
      ) : activeSubView === 'billing' ? (
        <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <BillingStudio
            currentUser={currentUser}
            onPlanUpgraded={(newPlan) => {
              setCurrentUser(STRATER_STORAGE_SERVICE.getCurrentUser());
            }}
          />
        </div>
      ) : (
        /* Standard Source Workspace (Split: Sidebar + Study Studio) */
        <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full border-x border-white/[0.04]">
          
          {/* Left Sidebar: Ingested Materials Shelf */}
          <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/[0.08] bg-[#121214] p-4 flex flex-col justify-between shrink-0">
            <div className="space-y-3.5">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1a6]">
                  Ingested Library ({sources.length})
                </span>
                <button
                  onClick={() => setShowIngestModal(true)}
                  className="p-1 rounded-lg text-[#0071e3] hover:text-[#2997ff] hover:bg-white/5 transition-colors"
                  title="Ingest New Material"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter sources & tags..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#86868b] text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              {/* Source Type Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                {['all', 'youtube', 'pdf', 'docx', 'pptx', 'article'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-2 py-0.5 rounded-lg uppercase tracking-wider font-semibold transition-colors shrink-0 ${
                      typeFilter === t
                        ? 'bg-white/15 text-white'
                        : 'text-[#86868b] hover:text-[#d1d1d6]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Sources List */}
              <div className="space-y-1.5 max-h-[60vh] md:max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {filteredSources.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#86868b]">
                    No materials found. Ingest a video or document to get started.
                  </div>
                ) : (
                  filteredSources.map(src => {
                    const isSelected = selectedSourceId === src.id;
                    return (
                      <div
                        key={src.id}
                        onClick={() => setSelectedSourceId(src.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group relative ${
                          isSelected
                            ? 'bg-[#0071e3]/15 border-[#0071e3] shadow-md'
                            : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="p-2 rounded-xl bg-white/5 shrink-0 mt-0.5">
                          {getSourceTypeIcon(src.sourceType)}
                        </div>

                        <div className="flex-1 min-w-0 pr-5">
                          <h4 className="text-xs font-semibold text-white truncate leading-tight">
                            {src.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-[#86868b]">
                            <span className="capitalize">{src.sourceType}</span>
                            <span>•</span>
                            <span>{src.readingTimeMinutes}m read</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleDeleteSource(src.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#86868b] hover:text-red-400 absolute right-2 top-3 transition-opacity"
                          title="Delete material"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Bottom Quick Hub Buttons */}
            <div className="pt-3 border-t border-white/10 hidden md:flex flex-col gap-1.5">
              <button
                onClick={() => setActiveSubView('spaced_repetition')}
                className="w-full px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-[#ff9f0a]" />
                  <span>Due Today Reviews</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#ff9f0a]/20 text-[#ff9f0a]">
                  {allDecks.reduce((acc, d) => acc + d.dueTodayCount, 0)}
                </span>
              </button>

              <button
                onClick={() => setShowExportModal(true)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-[#86868b] hover:text-white flex items-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Active Materials</span>
              </button>
            </div>
          </aside>

          {/* Right Main Study Studio */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {activeSource ? (
              <div className="space-y-6">
                
                {/* Source Top Header & YouTube Video Synchronizer (if YouTube) */}
                <div className="p-5 sm:p-6 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-[#86868b]">
                        <span className="flex items-center gap-1 font-semibold text-white uppercase tracking-wider text-[10px]">
                          {getSourceTypeIcon(activeSource.sourceType)}
                          <span className="ml-1">{activeSource.sourceType}</span>
                        </span>
                        <span>•</span>
                        <span>{activeSource.author}</span>
                        <span>•</span>
                        <span>{activeSource.wordCount} words (~{activeSource.tokenCount} tokens)</span>
                      </div>
                      <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">{activeSource.title}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowExportModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-[#2997ff]" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>

                  {/* YouTube Player & Clickable Timestamps (If YouTube source) */}
                  {activeSource.sourceType === 'youtube' && activeSource.sourceUrl && (
                    <div className="pt-2 border-t border-white/10 space-y-3">
                      {extractYouTubeVideoId(activeSource.sourceUrl) && (
                        <div className="relative w-full aspect-video max-h-[360px] rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeVideoId(activeSource.sourceUrl)}${
                              videoPlayerTimestamp !== null ? `?start=${videoPlayerTimestamp}&autoplay=1` : ''
                            }`}
                            title={activeSource.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      )}

                      {/* Clickable Synchronized Timestamps Carousel */}
                      {activeSource.timestamps && activeSource.timestamps.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#a1a1a6] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#2997ff]" /> Synchronized Video Chapter Anchors
                          </span>
                          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                            {activeSource.timestamps.map((ts, idx) => (
                              <button
                                key={idx}
                                onClick={() => setVideoPlayerTimestamp(ts.seconds)}
                                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#0071e3] text-[#d1d1d6] hover:text-white border border-white/10 text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                              >
                                <span className="font-mono text-[#2997ff] font-semibold">{ts.timestamp}</span>
                                <span className="truncate max-w-[140px]">{ts.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Studio Navigation Tabs (Segmented Control) */}
                  <div className="flex items-center gap-1 p-1 bg-black/40 rounded-2xl border border-white/10 overflow-x-auto">
                    {[
                      { id: 'summary', label: 'Summary', icon: Sparkles },
                      { id: 'notes', label: 'Cornell Notes', icon: FileText },
                      { id: 'flashcards', label: `Flashcards (${deck?.cards.length || 0})`, icon: Layers },
                      { id: 'mindmap', label: 'Mind Map', icon: Compass },
                      { id: 'quiz', label: 'Practice Quiz', icon: Zap },
                      { id: 'tutor', label: 'AI Tutor Copilot', icon: Bot }
                    ].map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as StudioTab)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-[#0071e3] to-[#2997ff] text-white shadow-md'
                              : 'text-[#86868b] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tab Views */}
                {activeTab === 'summary' && summary && (
                  <SummaryViewer
                    source={activeSource}
                    summary={summary}
                    onOpenQuiz={() => setActiveTab('quiz')}
                    onOpenFlashcards={() => setActiveTab('flashcards')}
                  />
                )}

                {activeTab === 'notes' && notes && (
                  <SmartNotesEditor
                    source={activeSource}
                    notes={notes}
                    onNotesUpdated={(updated) => setNotes(updated)}
                  />
                )}

                {activeTab === 'flashcards' && deck && (
                  <FlashcardStudio
                    deck={deck}
                    onDeckUpdated={(updated) => setDeck(updated)}
                  />
                )}

                {activeTab === 'mindmap' && mindMap && (
                  <MindMapVisualizer
                    source={activeSource}
                    mindMap={mindMap}
                  />
                )}

                {activeTab === 'quiz' && quiz && (
                  <QuizPlayer
                    source={activeSource}
                    quiz={quiz}
                  />
                )}

                {activeTab === 'tutor' && (
                  <ContextualAiTutor
                    source={activeSource}
                    onJumpToTimestamp={(sec) => setVideoPlayerTimestamp(sec)}
                  />
                )}

              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-4">
                <Sparkles className="w-10 h-10 text-[#0071e3] mx-auto animate-pulse" />
                <h3 className="text-lg font-bold text-white">No Material Selected</h3>
                <p className="text-xs text-[#86868b] max-w-sm mx-auto">
                  Ingest a YouTube video, PDF textbook, PowerPoint slide deck, or web article to generate your study workspace.
                </p>
                <button
                  onClick={() => setShowIngestModal(true)}
                  className="btn-primary text-xs py-2 px-5 font-semibold"
                >
                  Ingest Study Material
                </button>
              </div>
            )}
          </main>

        </div>
      )}

      {/* Global Studio Modals */}
      <IngestionModal
        isOpen={showIngestModal}
        onClose={() => setShowIngestModal(false)}
        onSourceIngested={handleSourceIngested}
      />

      <AiSettingsModal
        isOpen={showAiSettingsModal}
        onClose={() => setShowAiSettingsModal(false)}
        onKeysSaved={() => setCurrentUser(STRATER_STORAGE_SERVICE.getCurrentUser())}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onUserChanged={(u) => {
          setCurrentUser(u);
          refreshWorkspace();
        }}
      />

      {activeSource && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          source={activeSource}
          summary={summary}
          notes={notes}
          deck={deck}
          quiz={quiz}
        />
      )}

    </div>
  );
};
