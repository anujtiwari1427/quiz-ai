import React, { useState, useEffect } from 'react';
import { 
  FlashcardDeck, 
  Flashcard, 
  CardRating 
} from '../../types/strater';
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Layers, 
  Eye, 
  Tag, 
  Flame, 
  Volume2, 
  Check, 
  List, 
  Grid
} from 'lucide-react';
import { STRATER_STORAGE_SERVICE } from '../../services/straterStorageService';

interface FlashcardStudioProps {
  deck: FlashcardDeck;
  onDeckUpdated?: (updated: FlashcardDeck) => void;
}

export const FlashcardStudio: React.FC<FlashcardStudioProps> = ({
  deck: initialDeck,
  onDeckUpdated
}) => {
  const [deck, setDeck] = useState<FlashcardDeck>(initialDeck);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [viewMode, setViewMode] = useState<'study' | 'deck_list'>('study');
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const activeCard: Flashcard | undefined = deck.cards[currentIndex];

  // Keyboard navigation & flip listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'study' || sessionCompleted) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRateCard('again');
        else if (e.key === '2') handleRateCard('hard');
        else if (e.key === '3') handleRateCard('good');
        else if (e.key === '4') handleRateCard('easy');
      } else {
        if (e.key === 'ArrowRight' && currentIndex < deck.cards.length - 1) {
          handleNextCard();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
          handlePrevCard();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, isFlipped, currentIndex, deck.cards.length, sessionCompleted]);

  const handleNextCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleRateCard = (rating: CardRating) => {
    if (!activeCard) return;

    const updated = STRATER_STORAGE_SERVICE.reviewCard(deck.id, activeCard.id, rating);
    if (updated) {
      setDeck(updated);
      onDeckUpdated?.(updated);
    }
    handleNextCard();
  };

  const resetStudySession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setSessionCompleted(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade-in">
      
      {/* Top Header & Deck Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#1c1c1e] border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#30d158]/20 text-[#30d158] border border-[#30d158]/30">
              SuperMemo SM-2 Active
            </span>
            <span className="text-xs text-[#86868b]">{deck.cards.length} Total Flashcards</span>
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight mt-1">{deck.title}</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Metrics */}
          <div className="flex items-center gap-3 text-xs bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
            <div className="flex items-center gap-1.5 text-[#ff9f0a]">
              <Clock className="w-3.5 h-3.5" />
              <span>{deck.dueTodayCount} Due Today</span>
            </div>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-1.5 text-[#30d158]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{deck.masteredCount} Mastered</span>
            </div>
          </div>

          {/* Toggle View Mode */}
          <div className="flex p-0.5 bg-black/40 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('study')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === 'study' ? 'bg-white/10 text-white' : 'text-[#86868b] hover:text-white'}`}
              title="Study Mode"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('deck_list')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === 'deck_list' ? 'bg-white/10 text-white' : 'text-[#86868b] hover:text-white'}`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'study' ? (
        sessionCompleted ? (
          /* Session Completed Congratulatory Screen */
          <div className="p-8 sm:p-12 rounded-3xl bg-[#1c1c1e] border border-white/10 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#30d158]/20 border border-[#30d158]/30 flex items-center justify-center mx-auto text-[#30d158]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white">Review Session Completed!</h3>
              <p className="text-xs sm:text-sm text-[#86868b]">
                Great work! You reviewed all {deck.cards.length} cards in this deck. The SM-2 spaced repetition scheduler has updated intervals for optimum retention.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-center">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-lg font-bold text-white font-mono">{deck.cards.length}</div>
                <div className="text-[10px] text-[#86868b]">Cards Reviewed</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-lg font-bold text-[#30d158] font-mono">{deck.masteredCount}</div>
                <div className="text-[10px] text-[#86868b]">Mastered</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-lg font-bold text-[#2997ff] font-mono">+92%</div>
                <div className="text-[10px] text-[#86868b]">Retention Index</div>
              </div>
            </div>

            <button
              onClick={resetStudySession}
              className="btn-primary text-xs py-2.5 px-6 font-semibold"
            >
              Start Another Review Cycle
            </button>
          </div>
        ) : activeCard ? (
          /* Active Flashcard 3D Interactive Flip Player */
          <div className="space-y-4">
            
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs text-[#86868b]">
              <span>Card <strong className="text-white">{currentIndex + 1}</strong> of {deck.cards.length}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono">Ease Factor: {activeCard.easeFactor.toFixed(2)}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${
                  activeCard.masteryState === 'mastered' ? 'bg-[#30d158]/15 text-[#30d158]' :
                  activeCard.masteryState === 'reviewing' ? 'bg-[#0071e3]/15 text-[#2997ff]' :
                  'bg-white/10 text-white'
                }`}>
                  {activeCard.masteryState}
                </span>
              </div>
            </div>

            {/* 3D Flip Card Container */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full h-[320px] sm:h-[360px] rounded-3xl cursor-pointer select-none transition-transform duration-300 hover:scale-[1.008]"
              style={{ perspective: '1000px' }}
            >
              <div 
                className="w-full h-full relative transition-transform duration-500 rounded-3xl"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                
                {/* CARD FRONT */}
                <div 
                  className="absolute inset-0 w-full h-full p-8 rounded-3xl bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] border border-white/15 shadow-2xl flex flex-col justify-between"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0071e3] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Front / Prompt
                    </span>
                    <span className="text-[10px] text-[#86868b] bg-white/5 px-2 py-1 rounded-md">
                      Space to flip
                    </span>
                  </div>

                  <div className="text-center my-auto px-4">
                    <h3 className="text-base sm:text-xl font-medium text-white leading-relaxed">
                      {activeCard.front}
                    </h3>

                    {showHint && activeCard.hint && (
                      <div className="mt-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs animate-fade-in">
                        💡 Hint: {activeCard.hint}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-white/10">
                    <div className="flex flex-wrap gap-1">
                      {activeCard.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] text-[#86868b] bg-white/5 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                    {activeCard.hint && !showHint && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHint(true);
                        }}
                        className="text-[11px] text-[#ff9f0a] hover:underline"
                      >
                        Show Hint
                      </button>
                    )}
                  </div>
                </div>

                {/* CARD BACK */}
                <div 
                  className="absolute inset-0 w-full h-full p-8 rounded-3xl bg-gradient-to-br from-[#1c1c1e] via-[#242426] to-[#1a2634] border border-[#0071e3]/30 shadow-2xl flex flex-col justify-between"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#30d158] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Back / Answer
                    </span>
                    {activeCard.citation && (
                      <span className="text-[10px] text-[#86868b] bg-white/5 px-2 py-1 rounded-md">
                        {activeCard.citation}
                      </span>
                    )}
                  </div>

                  <div className="text-center my-auto px-4 space-y-2">
                    <p className="text-sm sm:text-lg text-[#f5f5f7] leading-relaxed font-normal">
                      {activeCard.back}
                    </p>
                  </div>

                  <div className="flex items-center justify-center text-[11px] text-[#86868b] pt-3 border-t border-white/10">
                    Click anywhere or press Space to flip back
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Rating Controls (SM-2 Quality Grading) */}
            {isFlipped ? (
              <div className="space-y-2 animate-fade-in">
                <div className="text-center text-[11px] text-[#86868b]">
                  Rate your active recall to schedule the next review interval:
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  <button
                    onClick={() => handleRateCard('again')}
                    className="p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 flex flex-col items-center justify-center gap-1 transition-all group"
                  >
                    <span className="text-xs font-bold text-white group-hover:text-red-300">1. Again</span>
                    <span className="text-[10px] text-[#86868b]">&lt; 1 min</span>
                  </button>
                  <button
                    onClick={() => handleRateCard('hard')}
                    className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 flex flex-col items-center justify-center gap-1 transition-all group"
                  >
                    <span className="text-xs font-bold text-white group-hover:text-amber-300">2. Hard</span>
                    <span className="text-[10px] text-[#86868b]">1 day</span>
                  </button>
                  <button
                    onClick={() => handleRateCard('good')}
                    className="p-3 rounded-2xl bg-[#0071e3]/15 hover:bg-[#0071e3]/25 border border-[#0071e3]/30 text-[#2997ff] flex flex-col items-center justify-center gap-1 transition-all group"
                  >
                    <span className="text-xs font-bold text-white group-hover:text-[#2997ff]">3. Good</span>
                    <span className="text-[10px] text-[#86868b]">3 days</span>
                  </button>
                  <button
                    onClick={() => handleRateCard('easy')}
                    className="p-3 rounded-2xl bg-[#30d158]/15 hover:bg-[#30d158]/25 border border-[#30d158]/30 text-[#30d158] flex flex-col items-center justify-center gap-1 transition-all group"
                  >
                    <span className="text-xs font-bold text-white group-hover:text-[#30d158]">4. Easy</span>
                    <span className="text-[10px] text-[#86868b]">7 days</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handlePrevCard}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs text-white flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setIsFlipped(true)}
                  className="px-6 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-lg shadow-[#0071e3]/30 transition-all"
                >
                  Flip to Reveal Answer
                </button>

                <button
                  onClick={handleNextCard}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Skip</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : null
      ) : (
        /* Full Deck Table List View */
        <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Full Deck Catalog ({deck.cards.length} Cards)</h3>
            <span className="text-xs text-[#86868b]">Inspect SM-2 scheduling parameters</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#86868b]">
                  <th className="py-2.5 px-3">Front Prompt</th>
                  <th className="py-2.5 px-3">Answer Excerpt</th>
                  <th className="py-2.5 px-3">Interval</th>
                  <th className="py-2.5 px-3">Ease</th>
                  <th className="py-2.5 px-3">Next Review</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {deck.cards.map((card, i) => (
                  <tr key={card.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 text-white font-medium max-w-xs truncate">{card.front}</td>
                    <td className="py-2.5 px-3 text-[#86868b] max-w-xs truncate">{card.back}</td>
                    <td className="py-2.5 px-3 text-white font-mono">{card.intervalDays}d</td>
                    <td className="py-2.5 px-3 text-[#2997ff] font-mono">{card.easeFactor.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-[#ff9f0a] font-mono">{card.nextReviewDate || 'Today'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${
                        card.masteryState === 'mastered' ? 'bg-[#30d158]/15 text-[#30d158]' :
                        card.masteryState === 'reviewing' ? 'bg-[#0071e3]/15 text-[#2997ff]' :
                        'bg-white/10 text-white'
                      }`}>
                        {card.masteryState}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
