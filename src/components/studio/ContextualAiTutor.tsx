import React, { useState, useRef, useEffect } from 'react';
import { 
  IngestedSource, 
  TutorMessage, 
  TutorCitation 
} from '../../types/strater';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Clock, 
  BookOpen, 
  HelpCircle, 
  Lightbulb, 
  AlertTriangle,
  RotateCcw,
  Zap
} from 'lucide-react';
import { AI_SYNTHESIZER_SERVICE } from '../../services/aiSynthesizerService';
import { STRATER_STORAGE_SERVICE } from '../../services/straterStorageService';

interface ContextualAiTutorProps {
  source: IngestedSource;
  onJumpToTimestamp?: (seconds: number) => void;
}

export const ContextualAiTutor: React.FC<ContextualAiTutorProps> = ({
  source,
  onJumpToTimestamp
}) => {
  const isVideo = source.sourceType === 'youtube';

  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'init_msg',
      sender: 'tutor',
      text: `Hello! I am your AI Study Copilot, grounded strictly in "${source.title}". Ask me to clarify derivations, explain trade-offs with real-world analogies, or quiz you on high-yield exam points.`,
      timestamp: 'Just now',
      suggestedFollowups: [
        'Explain the core mechanism with a real-world analogy',
        'What are the most frequent exam pitfalls on this topic?',
        'Quiz me on the hardest concept in this material'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('claude-3-5-sonnet');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: TutorMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const byokKeys = STRATER_STORAGE_SERVICE.getByokKeys();
      const response = await AI_SYNTHESIZER_SERVICE.queryContextualTutor(
        source,
        text,
        messages.map(m => ({ sender: m.sender, text: m.text })),
        byokKeys
      );

      const tutorMsg: TutorMessage = {
        id: `tutor_${Date.now()}`,
        sender: 'tutor',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations,
        suggestedFollowups: response.suggestedFollowups,
        modelUsed: response.modelUsed
      };

      setMessages(prev => [...prev, tutorMsg]);
    } catch (err: any) {
      const errorMsg: TutorMessage = {
        id: `err_${Date.now()}`,
        sender: 'tutor',
        text: 'I encountered an issue retrieving that section from the knowledge graph. Please rephrase or try another concept.',
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const parseTimestampSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  };

  return (
    <div className="flex flex-col h-[650px] max-w-4xl mx-auto rounded-3xl bg-[#1c1c1e] border border-white/10 shadow-2xl overflow-hidden animate-fade-in">
      
      {/* Top Header & Model Selector */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0071e3] to-[#bf5af2] flex items-center justify-center shadow-lg shadow-[#0071e3]/20">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-semibold text-white tracking-tight">Contextual AI Tutor</h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#30d158]/20 text-[#30d158] border border-[#30d158]/30">
                Grounded
              </span>
            </div>
            <p className="text-[11px] text-[#86868b] truncate max-w-sm">Source: {source.title}</p>
          </div>
        </div>

        {/* Model Selector */}
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[#d1d1d6] text-xs focus:outline-none focus:border-[#0071e3]"
        >
          <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
          <option value="gpt-4o">GPT-4o (OpenAI)</option>
          <option value="gemini-1-5-pro">Gemini 1.5 Pro</option>
          <option value="groq-llama-3-70b">Llama 3 70B (Groq)</option>
        </select>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
        {messages.map(msg => (
          <div 
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
              msg.sender === 'user'
                ? 'bg-[#0071e3] text-white shadow-md'
                : 'bg-white/10 text-[#2997ff] border border-white/10'
            }`}>
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`max-w-[82%] space-y-2 ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed text-left ${
                msg.sender === 'user'
                  ? 'bg-[#0071e3] text-white rounded-tr-sm shadow-md'
                  : 'bg-white/[0.04] text-[#f5f5f7] border border-white/10 rounded-tl-sm'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                {/* Source Citations Badges */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2997ff] flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Grounded Source Citations
                    </span>
                    {msg.citations.map((cite, i) => (
                      <div 
                        key={i}
                        onClick={() => {
                          if (isVideo && onJumpToTimestamp) {
                            const sec = parseTimestampSeconds(cite.anchor);
                            onJumpToTimestamp(sec);
                          }
                        }}
                        className={`text-[11px] p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-[#86868b] ${
                          isVideo && onJumpToTimestamp ? 'cursor-pointer hover:border-[#0071e3] hover:text-white transition-colors' : ''
                        }`}
                      >
                        <span className="truncate pr-2 italic">{cite.quote}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#0071e3]/20 text-[#2997ff] shrink-0">
                          {cite.anchor}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Suggested Followups */}
              {msg.suggestedFollowups && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestedFollowups.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-[#a1a1a6] hover:text-white transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-white/10 text-[#2997ff] flex items-center justify-center shrink-0 border border-white/10">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#0071e3] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#2997ff] animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-[#30d158] animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-5 py-2 border-t border-white/5 bg-black/20 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[10px] text-[#86868b] font-medium shrink-0">💡 Quick:</span>
        <button
          onClick={() => handleSendMessage('Explain the main concept in simple terms like I am 15')}
          className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-[10px] text-[#a1a1a6] hover:text-white shrink-0 border border-white/5 transition-colors"
        >
          Explain Simply
        </button>
        <button
          onClick={() => handleSendMessage('Give me a clear real-world analogy for this')}
          className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-[10px] text-[#a1a1a6] hover:text-white shrink-0 border border-white/5 transition-colors"
        >
          Give Analogy
        </button>
        <button
          onClick={() => handleSendMessage('What are the most common exam misconceptions?')}
          className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-[10px] text-[#a1a1a6] hover:text-white shrink-0 border border-white/5 transition-colors"
        >
          Common Pitfalls
        </button>
      </div>

      {/* Chat Input Bar */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask anything grounded in "${source.title}"...`}
          className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-[#86868b] text-xs sm:text-sm focus:outline-none focus:border-[#0071e3]"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="p-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-40 text-white shadow-lg shadow-[#0071e3]/30 transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
