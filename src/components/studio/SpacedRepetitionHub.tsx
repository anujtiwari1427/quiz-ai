import React, { useState } from 'react';
import { 
  FlashcardDeck, 
  Flashcard, 
  CardRating 
} from '../../types/strater';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  TrendingUp, 
  RotateCw,
  Zap,
  Layers
} from 'lucide-react';
import { STRATER_STORAGE_SERVICE } from '../../services/straterStorageService';
import { SM2_SERVICE } from '../../services/sm2Service';

interface SpacedRepetitionHubProps {
  decks: FlashcardDeck[];
  onStartReviewDeck: (deck: FlashcardDeck) => void;
}

export const SpacedRepetitionHub: React.FC<SpacedRepetitionHubProps> = ({
  decks,
  onStartReviewDeck
}) => {
  const today = new Date().toISOString().split('T')[0];

  // Aggregate all cards across all user decks
  const allCards = decks.flatMap(d => d.cards);
  const dueCards = allCards.filter(c => !c.nextReviewDate || c.nextReviewDate <= today);
  const learningCards = allCards.filter(c => c.masteryState === 'learning' || c.masteryState === 'new');
  const reviewingCards = allCards.filter(c => c.masteryState === 'reviewing');
  const masteredCards = allCards.filter(c => c.masteryState === 'mastered');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      
      {/* Top Banner: Today's Repetition Briefing */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/30 via-[#1c1c1e] to-emerald-900/20 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#0071e3]/20 text-[#2997ff] border border-[#0071e3]/30 flex items-center gap-1">
              <Zap className="w-3 h-3" /> SuperMemo SM-2 Engine
            </span>
            <span className="text-xs text-[#86868b]">Spaced Repetition Scheduler</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            You have <span className="gradient-text-blue">{dueCards.length} Cards</span> Due for Active Recall Today
          </h2>
          <p className="text-xs sm:text-sm text-[#86868b] max-w-xl">
            Reviewing cards at the optimal forgetting threshold strengthens neural pathways and prevents memory decay according to the Ebbinghaus curve.
          </p>
        </div>

        {decks.length > 0 && (
          <button
            onClick={() => onStartReviewDeck(decks[0])}
            className="btn-primary text-xs py-3 px-6 rounded-2xl flex items-center gap-2 font-semibold shadow-lg shadow-[#0071e3]/30 shrink-0 self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Today's Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 4 Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[#ff9f0a]">
            <span className="text-xs text-[#86868b]">Due Today</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{dueCards.length}</div>
          <div className="text-[10px] text-[#86868b]">Ready for evaluation</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[#2997ff]">
            <span className="text-xs text-[#86868b]">Learning</span>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{learningCards.length}</div>
          <div className="text-[10px] text-[#86868b]">Repetition 0-1</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[#bf5af2]">
            <span className="text-xs text-[#86868b]">Reviewing</span>
            <RotateCw className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{reviewingCards.length}</div>
          <div className="text-[10px] text-[#86868b]">Repetition 2-3</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[#30d158]">
            <span className="text-xs text-[#86868b]">Mastered</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{masteredCards.length}</div>
          <div className="text-[10px] text-[#86868b]">Repetition &gt;= 4</div>
        </div>
      </div>

      {/* Deck Queue List */}
      <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-sm font-semibold text-white">Your Flashcard Decks & Review Schedules</h3>
            <p className="text-xs text-[#86868b]">Select any deck to initiate a focused study session</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decks.map(deck => (
            <div
              key={deck.id}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#0071e3] uppercase tracking-wider bg-[#0071e3]/10 px-2 py-0.5 rounded">
                    {deck.cards.length} Cards
                  </span>
                  {deck.dueTodayCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ff9f0a]/15 text-[#ff9f0a] border border-[#ff9f0a]/30">
                      {deck.dueTodayCount} Due Today
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#30d158]/15 text-[#30d158]">
                      Up to date
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-white group-hover:text-[#2997ff] transition-colors">{deck.title}</h4>
                <p className="text-xs text-[#86868b] leading-relaxed line-clamp-2">{deck.description}</p>
              </div>

              {/* Progress Bar of Mastered vs In Progress */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="flex justify-between text-[11px] text-[#86868b]">
                  <span>Mastery: {deck.cards.length > 0 ? Math.round((deck.masteredCount / deck.cards.length) * 100) : 0}%</span>
                  <span>{deck.masteredCount} of {deck.cards.length} mastered</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0071e3] to-[#30d158] rounded-full transition-all duration-300"
                    style={{
                      width: `${deck.cards.length > 0 ? Math.round((deck.masteredCount / deck.cards.length) * 100) : 0}%`
                    }}
                  />
                </div>
              </div>

              <button
                onClick={() => onStartReviewDeck(deck)}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-[#0071e3] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-white/10 hover:border-transparent"
              >
                <span>Open Flashcard Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
