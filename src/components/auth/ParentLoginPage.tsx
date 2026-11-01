import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Smartphone, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  ChevronRight, 
  Languages, 
  FileText, 
  Lock, 
  HelpCircle,
  Clock,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TextSizeControl } from './TextSizeControl';

export const ParentLoginPage: React.FC = () => {
  const { parentLogin, setCurrentView, students } = useApp();

  const [phone, setPhone] = useState<string>('9876543210');
  const [selectedChildGsid, setSelectedChildGsid] = useState<string>(students[0]?.gsid || 'GSID-IND-2026-8819');
  const [otpStep, setOtpStep] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('729401');
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [parentName, setParentName] = useState<string>('Mrs. Meera Sharma');
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'rollno' | 'email'>('whatsapp');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Demo Parent Profiles
  const demoParents = [
    {
      parentName: 'Mrs. Meera Sharma',
      phone: '9876543210',
      childGsid: 'GSID-IND-2026-8819',
      childName: 'Aarav Sharma',
      classGrade: 'Class 10 · CBSE',
      school: 'Delhi Public School, R.K. Puram',
      desc: 'Latest test: Light Reflection & Refraction (85% · Grade A)'
    },
    {
      parentName: 'Mr. Vikram Patel',
      phone: '9820011223',
      childGsid: 'GSID-IND-2026-9932',
      childName: 'Priya Patel',
      classGrade: 'Class 10 · ICSE',
      school: 'St. Xavier\'s High School, Mumbai',
      desc: 'Latest test: Chemical Reactions & Equations (92% · Grade A+)'
    },
    {
      parentName: 'Smt. Kamala Rao',
      phone: '9448055667',
      childGsid: 'GSID-IND-2026-4401',
      childName: 'Rohan Rao',
      classGrade: 'Class 12 · Karnataka PUC',
      school: 'National Public School, Bengaluru',
      desc: 'Active preparation: Physics Electricity & Magnetism'
    }
  ];

  const handleSelectDemo = (item: typeof demoParents[0]) => {
    setParentName(item.parentName);
    setPhone(item.phone);
    setSelectedChildGsid(item.childGsid);
    setOtpStep(true);
    setOtpCode('729401');
    setErrorMessage(null);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMessage(null);
    setIsSendingOtp(true);

    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpStep(true);
      setOtpCode('729401');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setErrorMessage('Please enter the 6-digit OTP received on WhatsApp.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsVerifying(false);
      parentLogin(phone, selectedChildGsid, parentName);
    }, 700);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-black text-[#f5f5f7] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Utility & Large Text Theme Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300">
                Official Parent &amp; Guardian AI Access Portal · WhatsApp Verified
              </span>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setCurrentView('admin-login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Switch to Admin Login</span>
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

          {/* Left Column (5 Cols): Why Parents Love EduPulse & Demo Presets */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1c1c1e] to-slate-950 border border-emerald-500/20 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Parents &amp; Guardians
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                    Your Child's Progress Hub
                  </h1>
                </div>
              </div>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
                No complex passwords needed. Connect via WhatsApp to see instant exam results, step-by-step mistake solutions, and 12-language AI tutoring.
              </p>

              {/* Benefits list with large legible typography */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">Instant WhatsApp Updates</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      Receive report cards, subject scores, and teacher remarks directly on your phone as soon as tests end.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Languages className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">12-Language Voice Tutor</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      Hear explanations in your home language: Hindi, Tamil, Telugu, Marathi, Bengali, Gujarati, Kannada and more.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">100% DPDP Child Safety</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      Strict guardian verification ensures only authorized parents can view student marks and test papers.
                    </p>
                  </div>
                </div>
              </div>

              {/* 1-Click Demo Profiles */}
              <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Quick 1-Click Parent Presets
                  </span>
                  <span className="text-[11px] text-slate-400">Tap to auto-fill</span>
                </div>

                <div className="space-y-2">
                  {demoParents.map((demo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectDemo(demo)}
                      className="w-full text-left p-3 rounded-2xl bg-black/40 hover:bg-emerald-500/10 border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {demo.parentName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/[0.08] text-emerald-400">
                          {demo.childName.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {demo.classGrade} · {demo.school}
                      </p>
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
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Parent Sign In
                  </span>
                  <span className="text-xs text-slate-400">
                    Passwordless WhatsApp Authentication
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  Sign In to Parent Portal
                </h2>
                <p className="text-sm sm:text-base text-slate-300">
                  Enter your registered mobile number to receive your secure login code.
                </p>
              </div>

              {/* Mode Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-black/50 border border-white/[0.08]">
                {[
                  { id: 'whatsapp', label: 'WhatsApp OTP' },
                  { id: 'rollno', label: 'Roll No + Phone' },
                  { id: 'email', label: 'Parent Email' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => { setActiveTab(tab.id as any); setOtpStep(false); }}
                    className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                      activeTab === tab.id
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
                  <Lock className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Main Auth Form */}
              {!otpStep ? (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  {/* Parent Name / Guardian */}
                  <div className="space-y-2">
                    <label className="block text-sm sm:text-base font-bold text-slate-200">
                      Parent / Guardian Name
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Mrs. Meera Sharma"
                      className="w-full px-4 py-3.5 sm:py-4 rounded-2xl bg-black/60 border border-white/[0.12] text-white text-sm sm:text-base placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all font-medium"
                    />
                  </div>

                  {/* Registered WhatsApp Mobile */}
                  <div className="space-y-2">
                    <label className="block text-sm sm:text-base font-bold text-slate-200">
                      Registered WhatsApp Mobile Number
                    </label>
                    <div className="flex items-center rounded-2xl bg-black/60 border border-white/[0.12] focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 overflow-hidden transition-all">
                      <div className="px-4 py-3.5 sm:py-4 bg-white/[0.04] border-r border-white/[0.1] text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5 shrink-0">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="w-full px-4 py-3.5 sm:py-4 bg-transparent text-white text-base sm:text-lg font-mono placeholder:text-slate-600 focus:outline-none font-bold tracking-wide"
                      />
                    </div>
                    <p className="text-xs text-slate-400">
                      We will send a 6-digit WhatsApp verification OTP to this number.
                    </p>
                  </div>

                  {/* Child Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm sm:text-base font-bold text-slate-200">
                      Select Child / Ward
                    </label>
                    <select
                      value={selectedChildGsid}
                      onChange={(e) => setSelectedChildGsid(e.target.value)}
                      className="w-full px-4 py-3.5 sm:py-4 rounded-2xl bg-black/60 border border-white/[0.12] text-white text-sm sm:text-base focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all font-medium cursor-pointer"
                    >
                      {students.map((child) => (
                        <option key={child.gsid} value={child.gsid}>
                          {child.name} · Class {child.classGrade} ({child.board}) · GSID: {child.gsid}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Large CTA Button */}
                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 hover:from-emerald-400 hover:to-emerald-300 text-black font-extrabold text-base sm:text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    {isSendingOtp ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Sending WhatsApp Login Code...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-5 h-5" />
                        <span>Send WhatsApp Login Code</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fade-in-up">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-emerald-300 font-semibold">OTP Code Sent to WhatsApp</p>
                      <p className="text-base font-mono font-bold text-white mt-0.5">+91 {phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="text-xs text-slate-400 hover:text-white underline font-semibold"
                    >
                      Edit Number
                    </button>
                  </div>

                  {/* 6-Digit Code Box */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm sm:text-base font-bold text-slate-200">
                        Enter 6-Digit WhatsApp Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpCode('729401')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 underline font-semibold"
                      >
                        Auto-fill Demo Code (729401)
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="729401"
                      className="w-full px-4 py-4 rounded-2xl bg-black/60 border border-white/[0.12] text-center text-2xl sm:text-3xl font-mono tracking-widest text-white placeholder:text-slate-600 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 font-bold"
                    />
                  </div>

                  {/* Resend countdown */}
                  <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      Code valid for 10 minutes
                    </span>
                    <button
                      type="button"
                      onClick={() => alert('New WhatsApp OTP code sent!')}
                      className="text-emerald-400 hover:text-emerald-300 font-bold"
                    >
                      Resend WhatsApp OTP
                    </button>
                  </div>

                  {/* Large CTA Button */}
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 hover:from-emerald-400 hover:to-emerald-300 text-black font-extrabold text-base sm:text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Verifying &amp; Loading Child Records...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify &amp; Enter Parent Portal</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Security & Regulatory Compliance Footer */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>DPDP 2023 Compliant · Zero Third-Party Advertising</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Secured Guardian Gateway v3.1
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
