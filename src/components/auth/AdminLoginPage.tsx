import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Users, 
  ChevronRight,
  School,
  AlertCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TextSizeControl } from './TextSizeControl';
import { AdminUser } from '../../types';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin, setCurrentView, organizations } = useApp();

  const [selectedBranch, setSelectedBranch] = useState<string>('Delhi Public School, R.K. Puram (Center #01)');
  const [email, setEmail] = useState<string>('principal.iyer@edupulse.org.in');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [twoFactorCode, setTwoFactorCode] = useState<string>('849201');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'credentials' | 'sso' | 'passkey'>('credentials');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Demo Admin Accounts
  const demoAdmins: {
    user: AdminUser;
    tag: string;
    description: string;
  }[] = [
    {
      user: {
        name: 'Principal Archana Iyer',
        email: 'principal.iyer@edupulse.org.in',
        role: 'Institution Head & Principal',
        branch: 'Delhi Public School, R.K. Puram (Center #01)',
        schoolCode: 'CBSE-DEL-1049'
      },
      tag: 'Enterprise HQ',
      description: 'Full multi-branch oversight, DPDP compliance, and AI blueprints'
    },
    {
      user: {
        name: 'Dr. Rajesh Sharma',
        email: 'r.sharma.superintendent@edupulse.org.in',
        role: 'CBSE Board Exam Superintendent',
        branch: 'St. Xavier\'s High School, Mumbai (Center #02)',
        schoolCode: 'CBSE-MUM-2081'
      },
      tag: 'Exam Controller',
      description: 'Proctoring violation logs, secure test paper vaults, and student rosters'
    },
    {
      user: {
        name: 'Mrs. Sunita Sen',
        email: 'sunita.sen@edupulse.org.in',
        role: 'Academic Director & Governance Lead',
        branch: 'National Public School, Indiranagar, Bengaluru (Center #03)',
        schoolCode: 'ICSE-BLR-4012'
      },
      tag: 'Branch Director',
      description: 'Faculty performance analytics and automated grade approvals'
    }
  ];

  const handleDemoSelect = (admin: AdminUser) => {
    setSelectedBranch(admin.branch);
    setEmail(admin.email);
    setPassword('EduPulse@2026');
    setTwoFactorCode('849201');
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both your institutional email and security key.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      // Find matching demo or create custom admin session
      const matched = demoAdmins.find(d => d.user.email.toLowerCase() === email.toLowerCase());
      const adminToLogin: AdminUser = matched ? matched.user : {
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        role: 'Institutional Administrator',
        branch: selectedBranch,
        schoolCode: 'EDU-CAMPUS-77'
      };

      adminLogin(adminToLogin);
    }, 700);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-black text-[#f5f5f7] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-black">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Utility & Large Text Theme Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300">
                Institutional Admin Access Point · DPDP Act 2023 Regulated
              </span>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setCurrentView('parent-login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Switch to Parent Login</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCurrentView('marketing')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-all"
              >
                Platform Overview
              </button>
            </div>
          </div>

          {/* Dedicated Large Text Size Theme Controller */}
          <TextSizeControl variant="bar" />
        </div>

        {/* Main Grid: Left Value Proposition & Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">

          {/* Left Column (5 Cols): Institutional Overview & Quick Profiles */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1c1c1e] to-slate-950 border border-amber-500/20 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    School &amp; Center Admin
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                    Institutional Governance
                  </h1>
                </div>
              </div>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
                Unified console for Principals, Academic Directors, and Exam Superintendents across CBSE, ICSE, and State Board schools.
              </p>

              {/* Core Features list with large legible typography */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">Multi-Branch Telemetry</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      Monitor Delhi, Mumbai, Bengaluru campuses and 5,950+ enrolled student evaluations in real time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">DPDP Act 2023 Immutable Audit</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      Cryptographically signed audit logs, proctoring violation alerts, and parent data access consent.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">AI Blueprint Control</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      Review school-wide question distributions, Blooms taxonomy weightages, and faculty grade overrides.
                    </p>
                  </div>
                </div>
              </div>

              {/* 1-Click Demo Profiles */}
              <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Quick 1-Click Demo Profiles
                  </span>
                  <span className="text-[11px] text-slate-400">Tap to populate</span>
                </div>

                <div className="space-y-2">
                  {demoAdmins.map((demo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleDemoSelect(demo.user)}
                      className="w-full text-left p-3 rounded-2xl bg-black/40 hover:bg-amber-500/10 border border-white/[0.08] hover:border-amber-500/40 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {demo.user.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/[0.08] text-amber-400">
                          {demo.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{demo.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): The Dedicated Login Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/[0.12] shadow-2xl space-y-6">

              {/* Form Header */}
              <div className="space-y-2 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Admin Sign In
                  </span>
                  <span className="text-xs text-slate-400">
                    Center Authentication Protocol v4.2
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  Sign In to Admin Console
                </h2>
                <p className="text-sm sm:text-base text-slate-300">
                  Enter your institution credentials or use institutional single sign-on.
                </p>
              </div>

              {/* Authentication Mode Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-black/50 border border-white/[0.08]">
                {[
                  { id: 'credentials', label: 'Work Email & Key' },
                  { id: 'sso', label: 'Enterprise SSO' },
                  { id: 'passkey', label: 'Smart Passkey' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                      activeTab === tab.id
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {activeTab === 'credentials' && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Branch / School Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm sm:text-base font-bold text-slate-200">
                      Affiliated School / Examination Center
                    </label>
                    <div className="relative">
                      <School className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-black/60 border border-white/[0.12] text-white text-sm sm:text-base focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all font-medium appearance-none cursor-pointer"
                      >
                        <option value="Delhi Public School, R.K. Puram (Center #01)">
                          Delhi Public School, R.K. Puram · CBSE Center #DEL-01
                        </option>
                        <option value="St. Xavier's High School, Mumbai (Center #02)">
                          St. Xavier's High School, Mumbai · CBSE Center #MUM-02
                        </option>
                        <option value="National Public School, Indiranagar, Bengaluru (Center #03)">
                          National Public School, Indiranagar, Bengaluru · ICSE Center #BLR-03
                        </option>
                        <option value="DAV Boys Senior Secondary School, Chennai (Center #04)">
                          DAV Boys Senior Secondary School, Chennai · State Board Center #CHE-04
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Work Email / Username */}
                  <div className="space-y-2">
                    <label className="block text-sm sm:text-base font-bold text-slate-200">
                      Institutional Admin Email ID
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. principal.iyer@edupulse.org.in"
                        className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-black/60 border border-white/[0.12] text-white text-sm sm:text-base placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Master Password */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm sm:text-base font-bold text-slate-200">
                        Admin Master Security Key
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Password reset link sent to your verified institutional recovery mobile number.')}
                        className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300"
                      >
                        Forgot Key?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl bg-black/60 border border-white/[0.12] text-white text-sm sm:text-base placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all font-medium font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* 2FA Token Code */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm sm:text-base font-bold text-slate-200">
                        2FA Authenticator Token
                      </label>
                      <button
                        type="button"
                        onClick={() => setTwoFactorCode('849201')}
                        className="text-xs text-slate-400 hover:text-amber-300 underline"
                      >
                        Auto-fill Demo Code (849201)
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        maxLength={6}
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value)}
                        placeholder="849201"
                        className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-black/60 border border-white/[0.12] text-white text-base sm:text-lg font-mono tracking-widest placeholder:text-slate-600 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all font-bold"
                      />
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 bg-black border-white/20 focus:ring-amber-500 focus:ring-offset-black cursor-pointer"
                    />
                    <label htmlFor="rememberMe" className="text-xs sm:text-sm text-slate-300 font-medium cursor-pointer">
                      Keep this terminal authenticated for 30 days (DPDP Audited Device)
                    </label>
                  </div>

                  {/* Large CTA Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold text-base sm:text-lg shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Institutional Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Enter Admin &amp; Governance Console</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {activeTab === 'sso' && (
                <div className="space-y-4 py-4">
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    Select your school network federated identity provider for seamless one-click single sign-on:
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleDemoSelect(demoAdmins[0].user)}
                      className="w-full p-4 rounded-2xl bg-black/60 hover:bg-white/[0.08] border border-white/[0.12] flex items-center justify-between text-left transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center font-bold text-black text-xs">
                          G
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-bold text-white">Google Workspace for Education</div>
                          <div className="text-xs text-slate-400">@dpsdelhi.org / @k12.edupulse.org.in</div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDemoSelect(demoAdmins[1].user)}
                      className="w-full p-4 rounded-2xl bg-black/60 hover:bg-white/[0.08] border border-white/[0.12] flex items-center justify-between text-left transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          M
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-bold text-white">Microsoft 365 Education</div>
                          <div className="text-xs text-slate-400">Azure Active Directory Domain Sync</div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDemoSelect(demoAdmins[2].user)}
                      className="w-full p-4 rounded-2xl bg-black/60 hover:bg-white/[0.08] border border-white/[0.12] flex items-center justify-between text-left transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                          D
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-bold text-white">DIKSHA / MeriPehchaan (Govt of India)</div>
                          <div className="text-xs text-slate-400">National Digital Education Architecture (NDEAR)</div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'passkey' && (
                <div className="p-6 rounded-2xl bg-black/40 border border-white/[0.08] text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                    <KeyRound className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Hardware Security Key / Biometrics</h3>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mt-1">
                      Insert your FIDO2 YubiKey or authenticate with Windows Hello / Touch ID.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDemoSelect(demoAdmins[0].user)}
                    className="py-3 px-6 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold text-sm border border-white/20 transition-all"
                  >
                    Trigger Windows Hello / FIDO2 Passkey
                  </button>
                </div>
              )}

              {/* Security & Regulatory Compliance Footer */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>AES-256 Bit Encryption · ISO/IEC 27001 Certified</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Center Access Terminal ID: IND-HQ-9901
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
