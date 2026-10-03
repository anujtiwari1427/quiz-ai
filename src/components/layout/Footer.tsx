import React from 'react';
import { Sparkles, Shield, Globe, Mail, MessageCircle, ExternalLink, Heart, ChevronRight } from 'lucide-react';

const LINKS = {
  Platform: ['AI Test Builder', 'Live Proctoring', 'Subjective AI Grading', 'Mastery Analytics', 'Parent AI Tutor'],
  Curriculum: ['CBSE Class 6–12', 'ICSE Class 6–12', 'Maharashtra Board', 'Karnataka PUC', 'NEP 2020 Mapping'],
  Company: ['About EduPulse', 'Research Blog', 'Careers', 'DPDP Compliance', 'Media Kit'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Refund Policy', 'DPDP Act Notice', 'Cookie Settings'],
};

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-12 border-t border-white/[0.08] overflow-hidden bg-black/60">
      {/* Background spotlight glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[220px] bg-[#0071e3]/8 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-14">

          {/* Brand column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#0071e3]/30 blur-md" />
                <div className="relative w-8 h-8 rounded-full bg-[#1c1c1e] p-1 shadow-md flex items-center justify-center overflow-hidden border border-white/20">
                  <img src="/logo.png" alt="EduPulse AI Logo" className="w-6 h-6 object-contain" />
                </div>
              </div>
              <div>
                <span className="font-display font-bold text-[17px] tracking-tight text-[#f5f5f7]">
                  Edu<span className="gradient-text-blue">Pulse</span>
                </span>
                <p className="text-[10px] text-[#86868b] font-normal">K-12 Assessment Intelligence</p>
              </div>
            </div>

            <p className="text-xs text-[#86868b] leading-relaxed max-w-[240px]">
              India's most advanced AI-powered assessment platform. Board-accurate, DPDP-compliant, and built for 
              Bharat's 260M K-12 learners.
            </p>

            {/* Compliance badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['CBSE', 'ICSE', 'NEP 2020', 'DPDP'].map((b) => (
                <span key={b} className="px-2.5 py-0.5 rounded-full text-[9px] font-medium bg-white/[0.06] border border-white/[0.08] text-[#86868b]">
                  {b}
                </span>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2 pt-1">
              {[
                { icon: MessageCircle, label: 'Twitter/X' },
                { icon: ExternalLink, label: 'LinkedIn' },
                { icon: Mail, label: 'Email' },
                { icon: Globe, label: 'Website' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  title={label}
                  className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[#86868b] hover:text-white hover:bg-white/[0.12] transition-all duration-200 hover:scale-105"
                >
                  <Icon style={{width:'13px',height:'13px'}} />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h4 className="text-[11px] font-semibold text-[#f5f5f7] tracking-wider uppercase">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <button className="group flex items-center gap-1 text-xs text-[#86868b] hover:text-[#2997ff] transition-colors duration-150">
                      <ChevronRight style={{width:'10px',height:'10px',opacity:0,transition:'all 0.15s'}} className="group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0" />
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter strip */}
        <div className="p-6 rounded-2xl bg-[#1c1c1e]/75 backdrop-blur-2xl border border-white/[0.08] mb-10 flex flex-col sm:flex-row items-center gap-4 justify-between shadow-lg">
          <div>
            <p className="text-sm font-semibold text-[#f5f5f7] mb-0.5">EduPulse Research Newsletter</p>
            <p className="text-xs text-[#86868b]">Monthly: AI in K-12 education, CBSE/ICSE updates, EdTech India trends</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="teacher@school.in"
              className="input-field text-xs py-2 sm:w-56"
            />
            <button className="btn-primary py-2 px-5 text-xs shrink-0">Subscribe</button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#86868b]">
          <div className="flex items-center gap-1">
            <span>© 2025 EduPulse AI Assessments Pvt Ltd. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="flex items-center gap-1">
              <Shield style={{width:'11px',height:'11px',color:'#30d158'}} />
              CIN: U85300MH2025PTC000001
            </span>
            <span>GSTIN: 27AABCE1234F1Z5</span>
            <span className="flex items-center gap-1">
              Made with <Heart style={{width:'10px',height:'10px',color:'#ff453a',fill:'#ff453a'}} /> in Bharat
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
