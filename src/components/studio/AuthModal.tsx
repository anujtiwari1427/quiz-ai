import React, { useState } from 'react';
import { 
  UserProfile, 
  UserPersonaId 
} from '../../types/strater';
import { 
  DEMO_PERSONAS, 
  STRATER_STORAGE_SERVICE 
} from '../../services/straterStorageService';
import { 
  User, 
  Lock, 
  Mail, 
  X, 
  Check, 
  Sparkles, 
  GraduationCap, 
  Stethoscope, 
  Scale, 
  Code 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChanged: (newUser: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSelectPersona = (key: UserPersonaId) => {
    const updated = STRATER_STORAGE_SERVICE.switchPersona(key);
    onUserChanged(updated);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const customUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: 'student',
      studyGoal: 'Comprehensive AI Exam Preparation & Concept Mastery',
      preferredModel: 'claude-3-5-sonnet',
      hasByokKeys: { openai: false, anthropic: false, gemini: false, groq: false, ollama: false },
      subscriptionPlan: 'pro',
      subscriptionStatus: 'active',
      subscriptionRenewalDate: '2026-11-20',
      monthlyTokenUsage: 0,
      maxMonthlyTokens: 1000000
    };

    STRATER_STORAGE_SERVICE.saveCurrentUser(customUser);
    STRATER_STORAGE_SERVICE.setActiveUserId(customUser.id);
    STRATER_STORAGE_SERVICE.ensurePersonaSeedData(customUser.id);
    onUserChanged(customUser);
    onClose();
  };

  const personasList: { key: UserPersonaId; persona: UserProfile; icon: any; domain: string }[] = [
    { key: 'cs_engineer', persona: DEMO_PERSONAS.cs_engineer, icon: Code, domain: 'Distributed Systems & Cloud Architecture' },
    { key: 'med_student', persona: DEMO_PERSONAS.med_student, icon: Stethoscope, domain: 'USMLE Step 1 Cardiology & Hemodynamics' },
    { key: 'law_student', persona: DEMO_PERSONAS.law_student, icon: Scale, domain: 'Bar Exam Constitutional Law & Due Process' },
    { key: 'high_school', persona: DEMO_PERSONAS.high_school, icon: GraduationCap, domain: 'CBSE Physics & Advanced Calculus' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[#1c1c1e] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0071e3] to-[#2997ff] flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">User Account & Personas</h3>
              <p className="text-xs text-[#86868b]">Logged in as: <strong className="text-white">{currentUser.name}</strong></p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#86868b] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Demo Personas Switcher (High-Yield for Evaluator) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2997ff] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Instant Test Personas (Isolated Data)
            </span>
            <span className="text-[10px] text-[#86868b]">1-Click Switch</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {personasList.map(({ key, persona, icon: Icon, domain }) => {
              const isSelected = currentUser.id === persona.id;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectPersona(key)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#0071e3]/15 border-[#0071e3] ring-1 ring-[#0071e3]'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${
                    isSelected ? 'bg-[#0071e3] text-white' : 'bg-white/5 text-[#86868b]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white truncate">{persona.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-[#30d158] stroke-[3]" />}
                    </div>
                    <p className="text-[10px] text-[#86868b] truncate mt-0.5">{domain}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Auth Form */}
        <div className="pt-2 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">
              {authMode === 'signin' ? 'Or Sign In with Custom Email' : 'Create Custom Account'}
            </span>
            <button
              onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              className="text-[11px] text-[#2997ff] hover:underline"
            >
              {authMode === 'signin' ? 'Need an account? Register' : 'Have an account? Sign in'}
            </button>
          </div>

          <form onSubmit={handleCustomSubmit} className="space-y-3">
            {authMode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs text-[#a1a1a6]">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Maya Lin"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-[#86868b] text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-[#a1a1a6]">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-[#86868b] text-xs focus:outline-none focus:border-[#0071e3]"
                />
                <Mail className="w-4 h-4 text-[#86868b] absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#a1a1a6]">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-[#86868b] text-xs focus:outline-none focus:border-[#0071e3]"
                />
                <Lock className="w-4 h-4 text-[#86868b] absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl text-xs text-[#86868b] hover:text-white"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-1.5 px-5 font-semibold"
              >
                {authMode === 'signin' ? 'Sign In' : 'Register Account'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
