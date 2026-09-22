import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Globe, 
  HelpCircle, 
  BookOpen, 
  CheckCircle2, 
  Flame,
  MessageSquare,
  Volume2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TutorChatMessage } from '../../types';
import { AI_SERVICE } from '../../services/aiService';

export const AITutorDrawer: React.FC = () => {
  const { students, activeChildGsid, tests, attempts } = useApp();

  const activeChild = students.find(s => s.gsid === activeChildGsid) || students[0];
  const activeChildAttempt = attempts.find(a => a.studentGsid === activeChild.gsid) || attempts[0];
  const activeTest = tests.find(t => t.id === activeChildAttempt?.testId) || tests[0];

  const [language, setLanguage] = useState<string>('English');
  const [messages, setMessages] = useState<TutorChatMessage[]>([
    {
      id: 'm1',
      sender: 'tutor',
      text: `Hello! I am your AI Mistake Diagnostic Tutor. I'm linked to ${activeChild?.name}'s recent assessments in CBSE Class ${activeChild?.classGrade}.\n\nIn the recent Mid-Term Science Assessment, ${activeChild?.name} encountered a conceptual gap in **Electricity (Resistors in Parallel)**. Would you like me to walk through why the answer is $25$ and how to prevent this mistake in the board exam?`,
      timestamp: 'Just now',
      suggestedPrompts: [
        'Explain step-by-step in simple terms',
        'हिंदी में समझाइए (Explain in Hindi)',
        'Give a 1-minute practice question'
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: TutorChatMessage = {
      id: `m_user_${Date.now()}`,
      sender: 'student',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const response = await AI_SERVICE.askTutor(textToSend, {
        studentName: activeChild.name,
        classGrade: activeChild.classGrade,
        wrongQuestion: activeTest?.questions[1],
        language
      });

      const tutorMsg: TutorChatMessage = {
        id: `m_tutor_${Date.now()}`,
        sender: 'tutor',
        text: response.responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: response.suggestedFollowUps
      };

      setMessages(prev => [...prev, tutorMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="rounded-3xl glass-panel border-slate-800 flex flex-col h-[650px] overflow-hidden">
      
      {/* Tutor Top Bar */}
      <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white p-0.5 shadow-md flex items-center justify-center shrink-0 border border-white/20">
            <img src="/logo.png" alt="EduPulse AI Mistake Tutor" className="w-9 h-9 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm text-white">EduPulse AI Mistake Tutor</h3>
              <span className="px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-400 text-[10px] font-mono font-bold">
                RAG Diagnostic Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Anchored to {activeChild?.name}'s actual wrong answers & CBSE board blueprints
            </p>
          </div>
        </div>

        {/* Multi-lingual Language Selector */}
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-accent-500"
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी (Hindi)</option>
            <option value="Hinglish">Hinglish (Colloquial)</option>
            <option value="Marathi">मराठी (Marathi)</option>
            <option value="Tamil">தமிழ் (Tamil)</option>
          </select>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-950/40">
        {messages.map((m) => {
          const isTutor = m.sender === 'tutor';

          return (
            <div
              key={m.id}
              className={`flex gap-3 text-xs ${isTutor ? 'justify-start' : 'justify-end'}`}
            >
              {isTutor && (
                <div className="w-7 h-7 rounded-xl bg-accent-500/20 text-accent-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`space-y-2 max-w-xl ${isTutor ? 'text-left' : 'text-right'}`}>
                <div
                  className={`p-4 rounded-2xl whitespace-pre-line leading-relaxed ${
                    isTutor
                      ? 'bg-slate-900 border border-slate-800 text-slate-200'
                      : 'bg-brand-500 text-slate-950 font-medium'
                  }`}
                >
                  {m.text}
                </div>

                {/* Suggested prompt chips */}
                {isTutor && m.suggestedPrompts && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.suggestedPrompts.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(p)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-accent-500/50 text-[11px] text-accent-300 hover:text-white transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-10">
            <div className="w-2 h-2 rounded-full bg-accent-400 animate-ping" />
            <span>EduPulse Tutor is formulating diagnostic explanation...</span>
          </div>
        )}
      </div>

      {/* Query Input Box */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask a question or request revision for ${activeChild?.name}...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-accent-500"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-white disabled:opacity-40 shadow-md shadow-accent-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
