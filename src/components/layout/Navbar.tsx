import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  GraduationCap, 
  Users, 
  UserCheck, 
  Building2,
  RotateCcw,
  Zap,
  Menu,
  X,
  BarChart3,
  Upload,
  BookOpen,
  Layers,
  Cpu,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LIVE_AI_SERVICE } from '../../services/liveAiService';
import { AiSettingsModal } from '../studio/AiSettingsModal';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    setUserRole, 
    notifications, 
    markNotificationRead,
    resetAllDemoData,
    launchStudentTestRoom,
    tests
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAiSettings, setShowAiSettings] = useState(false);
  const [showPortalsMenu, setShowPortalsMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const portalsRef = useRef<HTMLDivElement>(null);
  const unreadNotifs = notifications.filter(n => !n.read);

  const aiConfig = LIVE_AI_SERVICE.getActiveConfig();
  const isLive = LIVE_AI_SERVICE.isLiveAiAvailable();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (portalsRef.current && !portalsRef.current.contains(e.target as Node)) {
        setShowPortalsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary learner & core navigation
  const primaryNavItems = [
    { id: 'strata-studio', label: 'AI Study Studio', icon: Sparkles, role: 'student' as const, isSpecial: true },
    { id: 'marketing', label: 'Overview', icon: null },
    { id: 'books', label: 'Library', icon: BookOpen, role: 'student' as const },
    { id: 'create-exam', label: 'Create AI Exam', icon: Sparkles, role: 'student' as const },
    { id: 'questions', label: 'Question Bank', icon: Layers, role: 'student' as const },
    { id: 'marks', label: 'Marks', icon: BarChart3, role: 'student' as const },
    { id: 'syllabus', label: 'Syllabus', icon: Upload, role: 'student' as const },
  ];

  // Role-based portals
  const portalItems = [
    { id: 'teacher', label: 'Teacher Hub', icon: GraduationCap, role: 'teacher' as const, desc: 'CBSE/ICSE Blueprints & Proctoring' },
    { id: 'student', label: 'Student Test Room', icon: UserCheck, role: 'student' as const, desc: 'Interactive timed exam experience' },
    { id: 'parent', label: 'Parent & Tutor', icon: Users, role: 'parent' as const, desc: 'WhatsApp login & 12-lang mistake tutor' },
    { id: 'admin', label: 'School Admin', icon: Building2, role: 'admin' as const, desc: 'DPDP compliance & audit trail' },
  ];

  const isPortalActive = portalItems.some(p => p.id === currentView);
  const activePortal = portalItems.find(p => p.id === currentView);

  const handleNavClick = (id: string, role?: 'student' | 'teacher' | 'parent' | 'admin') => {
    if (id === 'student') {
      if (tests.length > 0) launchStudentTestRoom(tests[0].id);
      else { setUserRole('student'); setCurrentView('student'); }
    } else {
      if (role) setUserRole(role);
      setCurrentView(id as any);
    }
    setMobileOpen(false);
    setShowPortalsMenu(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.85)]'
            : 'bg-black/50 backdrop-blur-xl border-b border-white/[0.04]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between gap-3">
          
          {/* Apple Style Brand */}
          <button
            onClick={() => setCurrentView('marketing')}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="relative w-8 h-8 shrink-0">
              <div className="absolute inset-0 rounded-full bg-[#0071e3]/30 blur-md group-hover:opacity-75 transition-opacity" />
              <div className="relative w-8 h-8 rounded-full bg-[#1c1c1e] p-1 shadow-md flex items-center justify-center overflow-hidden border border-white/20 group-hover:scale-105 transition-transform duration-300">
                <img src="/logo.png" alt="EduPulse AI Logo" className="w-6 h-6 object-contain" />
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-[17px] tracking-tight text-[#f5f5f7] leading-none">
                  Edu<span className="gradient-text-blue">Pulse</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-white/[0.08] text-[#a1a1a6] border border-white/[0.08]">
                  Pro AI
                </span>
              </div>
              <p className="text-[10px] text-[#9da3ae] font-normal tracking-wide mt-0.5">CBSE • ICSE • State</p>
            </div>
          </button>

          {/* Desktop Streamlined Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-xl shadow-inner">
            {primaryNavItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.role)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0071e3] to-[#2997ff] text-white shadow-md font-semibold'
                      : item.isSpecial
                      ? 'text-[#2997ff] bg-[#0071e3]/15 hover:bg-[#0071e3]/25 border border-[#0071e3]/35 font-semibold'
                      : 'text-[#9da3ae] hover:text-[#f5f5f7] hover:bg-white/[0.06] font-medium'
                  }`}
                >
                  {item.icon && <item.icon style={{width:'13px',height:'13px'}} />}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Portals Dropdown Trigger */}
            <div className="relative" ref={portalsRef}>
              <button
                onClick={() => setShowPortalsMenu(!showPortalsMenu)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isPortalActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-semibold'
                    : 'text-[#9da3ae] hover:text-[#f5f5f7] hover:bg-white/[0.06]'
                }`}
              >
                {isPortalActive && activePortal?.icon ? (
                  <activePortal.icon style={{width:'13px',height:'13px'}} />
                ) : (
                  <GraduationCap style={{width:'13px',height:'13px'}} />
                )}
                <span>{isPortalActive ? activePortal?.label : 'Portals'}</span>
                <ChevronDown style={{width:'12px',height:'12px'}} className={`transition-transform duration-200 ${showPortalsMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Portals Menu Dropdown */}
              {showPortalsMenu && (
                <div className="absolute left-0 mt-2.5 w-64 rounded-2xl bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/[0.12] shadow-2xl p-1.5 z-50 animate-fade-in-down">
                  <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#9da3ae] border-b border-white/[0.06] mb-1">
                    Role Portals &amp; Consoles
                  </div>
                  {portalItems.map((p) => {
                    const isSelected = currentView === p.id;
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleNavClick(p.id, p.role)}
                        className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-[#0071e3]/20 text-white border border-[#0071e3]/40'
                            : 'hover:bg-white/[0.06] text-[#9da3ae] hover:text-[#f5f5f7]'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg mt-0.5 ${isSelected ? 'bg-[#0071e3] text-white' : 'bg-white/[0.06] text-[#2997ff]'}`}>
                          <Icon style={{width:'14px',height:'14px'}} />
                        </div>
                        <div>
                          <div className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-[#f5f5f7]'}`}>
                            {p.label}
                          </div>
                          <div className="text-[10px] text-[#9da3ae] leading-tight mt-0.5">
                            {p.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Live AI Model Pill */}
            <button
              onClick={() => setShowAiSettings(true)}
              title="Configure Live AI Provider (Gemini / Groq / OpenAI / Ollama)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs text-white transition-all duration-200 shadow-sm active:scale-95"
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#30d158] shadow-[0_0_8px_rgba(48,209,88,0.8)] animate-pulse' : 'bg-[#ff9f0a]'}`} />
              <Cpu className="w-3.5 h-3.5 text-[#2997ff]" />
              <span className="hidden sm:inline text-[11px] font-semibold tracking-tight">
                {isLive ? aiConfig.model.split(' ')[0] : 'AI Keys'}
              </span>
            </button>

            {/* Reset Demo */}
            <button
              onClick={resetAllDemoData}
              title="Reset Demo Data"
              className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-[#9da3ae] hover:text-[#f5f5f7] px-2.5 py-1.5 rounded-full hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all duration-200"
            >
              <RotateCcw style={{width:'11px',height:'11px'}} />
              Reset
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.16] text-[#9da3ae] hover:text-white transition-all duration-200 hover:bg-white/[0.1]"
              >
                <Bell style={{width:'14px',height:'14px'}} />
                {unreadNotifs.length > 0 && (
                  <>
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0071e3] text-[8px] font-bold text-white flex items-center justify-center z-10 shadow-sm">
                      {unreadNotifs.length}
                    </span>
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#2997ff] animate-ping-ripple opacity-60" />
                  </>
                )}
              </button>

              {/* Notification Dropdown (Apple Frosted Glass) */}
              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-[340px] rounded-2xl bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/[0.12] shadow-2xl overflow-hidden animate-fade-in-down z-50">
                  <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="status-dot-live" />
                      <span className="text-xs font-semibold text-white">Notifications</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-[#0071e3]/20 text-[#2997ff] border border-[#0071e3]/30">
                      {unreadNotifs.length} new
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2 space-y-1.5">
                    {notifications.map((notif, i) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`notif-item ${notif.read ? 'read' : 'unread'}`}
                        style={{animationDelay: `${i * 40}ms`}}
                      >
                        <div className="flex items-start gap-2 mb-0.5">
                          {notif.type === 'proctor_alert' && <AlertTriangle style={{width:'12px',height:'12px',color:'#ff9f0a',flexShrink:0,marginTop:'1px'}} />}
                          {notif.type === 'result_ready' && <CheckCircle2 style={{width:'12px',height:'12px',color:'#30d158',flexShrink:0,marginTop:'1px'}} />}
                          {notif.type === 'at_risk_alert' && <AlertTriangle style={{width:'12px',height:'12px',color:'#ff453a',flexShrink:0,marginTop:'1px'}} />}
                          <span className="font-medium text-white leading-tight text-xs">{notif.title}</span>
                          <span className="ml-auto text-[10px] text-[#9da3ae] shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-[#9da3ae] leading-snug pl-4 text-[11px]">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Practice CTA */}
            <button
              onClick={() => { setUserRole('student'); setCurrentView('questions'); }}
              className="btn-primary hidden sm:flex text-xs py-1.5 px-3.5"
            >
              <Zap style={{width:'12px',height:'12px'}} />
              <span>Practice</span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#9da3ae] hover:text-white transition-colors"
            >
              {mobileOpen ? <X style={{width:'16px',height:'16px'}} /> : <Menu style={{width:'16px',height:'16px'}} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[60px] z-40 lg:hidden animate-fade-in-down">
          <div className="bg-[#1c1c1e]/98 backdrop-blur-2xl border border-white/[0.12] p-4 space-y-3 mx-3 rounded-2xl mt-1 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div>
              <div className="text-[10px] font-semibold text-[#9da3ae] uppercase tracking-wider mb-2 px-2">
                Study &amp; Learning Tools
              </div>
              <div className="space-y-1">
                {primaryNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.role)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      currentView === item.id
                        ? 'bg-[#0071e3] text-white font-semibold shadow-sm'
                        : 'text-[#9da3ae] hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {item.icon && <item.icon style={{width:'14px',height:'14px'}} />}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08]">
              <div className="text-[10px] font-semibold text-[#9da3ae] uppercase tracking-wider mb-2 px-2">
                Portals &amp; Roles
              </div>
              <div className="space-y-1">
                {portalItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.role)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      currentView === item.id
                        ? 'bg-[#5e5ce6] text-white font-semibold shadow-sm'
                        : 'text-[#9da3ae] hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {item.icon && <item.icon style={{width:'14px',height:'14px'}} />}
                    <div className="text-left">
                      <div>{item.label}</div>
                      <div className="text-[10px] text-[#9da3ae] font-normal">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live AI Integration & BYOK Settings Modal */}
      <AiSettingsModal
        isOpen={showAiSettings}
        onClose={() => setShowAiSettings(false)}
      />
    </>
  );
};

