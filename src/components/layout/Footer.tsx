import React from 'react';
import { Sparkles, Shield, Globe, Mail, Heart, ChevronRight, Eye, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView, setUserRole, textSizeTheme, setTextSizeTheme } = useApp();

  const handleNav = (view: any, role: 'student' | 'teacher' = 'student') => {
    setUserRole(role);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToGenerator = () => {
    setCurrentView('marketing');
    setTimeout(() => {
      const el = document.getElementById('qg-generator-box');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-[#060a12] text-slate-300 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[180px] bg-[#00b87c]/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-1.5 shadow-md flex items-center justify-center border border-white/20">
                <Sparkles className="w-4 h-4 text-[#00b87c]" />
              </div>
              <span className="font-display font-extrabold text-xl text-white">
                Paper<span className="text-[#00b87c]">Pulse</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The world's leading AI quiz and flashcard generator. Turn any textbook, PDF, notes or lecture into board-accurate assessments in seconds.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational • 99.98% Uptime</span>
            </div>

            {/* Accessibility text size */}
            <div className="pt-2 flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Text Size:</span>
              {(['normal', 'large', 'extra-large'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTextSizeTheme(t)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    textSizeTheme === t
                      ? 'bg-[#00b87c] text-white shadow'
                      : 'text-slate-400 hover:text-white bg-white/[0.06]'
                  }`}
                >
                  {t === 'normal' ? 'Normal' : t === 'large' ? 'Large' : 'XL'}
                </button>
              ))}
            </div>
          </div>

          {/* Column: Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-4">
              Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={scrollToGenerator} className="hover:text-[#34d399] transition-colors">
                  AI Quiz Maker
                </button>
              </li>
              <li>
                <button onClick={scrollToGenerator} className="hover:text-[#34d399] transition-colors">
                  Flashcard Generator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('ai-paper-gen', 'teacher')} className="hover:text-[#34d399] transition-colors">
                  Board Blueprint Studio
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('teacher', 'teacher')} className="hover:text-[#34d399] transition-colors">
                  Live Anti-Cheat HUD
                </button>
              </li>
              <li>
                <button onClick={scrollToGenerator} className="hover:text-[#34d399] transition-colors">
                  PDF &amp; LMS Export
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Use Cases */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-4">
              Use Cases
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('marketing', 'student')} className="hover:text-[#34d399] transition-colors">
                  For Students &amp; Aspirants
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('teacher', 'teacher')} className="hover:text-[#34d399] transition-colors">
                  For Teachers &amp; Tutors
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('teacher', 'teacher')} className="hover:text-[#34d399] transition-colors">
                  For Schools &amp; Institutes
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('create-exam', 'student')} className="hover:text-[#34d399] transition-colors">
                  Timed Practice Exams
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Platform & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-4">
              Compliance
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5 text-slate-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>DPDP Act 2023</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>NEP 2020 Aligned</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>ISO 27001 Audited</span>
              </li>
              <li>
                <button onClick={() => handleNav('teacher', 'teacher')} className="hover:text-[#34d399] transition-colors">
                  Teacher Console
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 PaperPulse AI. All rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
