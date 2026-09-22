import React, { useState } from 'react';
import { Smartphone, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface WhatsAppAuthModalProps {
  onSuccess: (phone: string) => void;
  onClose: () => void;
}

export const WhatsAppAuthModal: React.FC<WhatsAppAuthModalProps> = ({ onSuccess, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('9876543210');
  const [otpStep, setOtpStep] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('729401');
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSendOtp = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setOtpStep(true);
    }, 600);
  };

  const handleVerifyOtp = () => {
    onSuccess(`+91 ${phoneNumber}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-6 animate-fadeIn">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white p-0.5 shadow-sm flex items-center justify-center shrink-0 border border-white/20">
              <img src="/logo.png" alt="EduPulse AI Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">EduPulse AI Parent Access</h4>
              <p className="text-[10px] text-slate-400">Secure WhatsApp Passwordless OTP</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">
            ✕
          </button>
        </div>

        {!otpStep ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your WhatsApp mobile number to securely view your children's test scores, mistake diagnoses, and AI tutor logs.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Mobile Number</label>
              <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 overflow-hidden focus-within:border-brand-500">
                <span className="px-3 text-xs font-bold text-slate-400 border-r border-slate-800">
                  +91 (India)
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2.5 bg-transparent text-sm text-white focus:outline-none"
                  placeholder="98765 43210"
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Complies with India DPDP Act 2023 parental consent rules.</span>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={isSending}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending WhatsApp OTP...</span>
                </>
              ) : (
                <>
                  <span>Send OTP via WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs text-slate-300">
              Enter the 6-digit code dispatched to WhatsApp number <strong className="text-emerald-400">+91 {phoneNumber}</strong>:
            </p>

            <div>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center tracking-[0.5em] text-xl font-mono font-bold py-3 rounded-xl bg-slate-950 border border-brand-500 text-brand-400 focus:outline-none"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
            >
              <Check className="w-4 h-4" />
              <span>Verify & Access Portal</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
