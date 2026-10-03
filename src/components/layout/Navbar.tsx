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
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadNotifs = notifications.filter(n => !n.read);

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'marketing', label: 'Overview', icon: null },
    { id: 'marks', label: 'Marks', icon: BarChart3, role: 'student' as const },
    { id: 'syllabus', label: 'Syllabus', icon: Upload, role: 'student' as const },
    { id: 'books', label: 'Read Book', icon: BookOpen, role: 'student' as const },
    { id: 'questions', label: 'Question Sets', icon: Layers, role: 'student' as const },
    { id: 'student', label: 'Test Room', icon: UserCheck, role: 'student' as const },
    { id: 'teacher', label: 'Teacher Hub', icon: GraduationCap, role: 'teacher' as const },
    { id: 'parent', label: 'Parent & Tutor', icon: Users, role: 'parent' as const },
    { id: 'admin', label: 'Admin', icon: Building2, role: 'admin' as const },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.id === 'student') {
      if (tests.length > 0) launchStudentTestRoom(tests[0].id);
      else { setUserRole('student'); setCurrentView('student'); }
    } else {
      if (item.role) setUserRole(item.role);
      setCurrentView(item.id as any);
    }
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
            : 'bg-black/40 backdrop-blur-xl border-b border-white/[0.04]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-[58px] flex items-center justify-between gap-3">
          
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
              <p className="text-[10px] text-[#86868b] font-normal tracking-wide mt-0.5">CBSE • ICSE • State</p>
            </div>
          </button>

          {/* Desktop Apple Segmented Nav Control */}
          <nav className="hidden lg:flex items-center gap-1 px-1.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-xl max-w-[740px] overflow-x-auto shadow-inner">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-white/[0.14] text-white shadow-sm border border-white/[0.1] font-semibold'
                      : 'text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/[0.04]'
                  }`}
                >
                  {item.icon && <item.icon style={{width:'12px',height:'12px'}} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Reset Demo */}
            <button
              onClick={resetAllDemoData}
              title="Reset Demo Data"
              className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-[#86868b] hover:text-[#f5f5f7] px-2.5 py-1.5 rounded-full hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all duration-200"
            >
              <RotateCcw style={{width:'11px',height:'11px'}} />
              Reset
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.16] text-[#86868b] hover:text-white transition-all duration-200 hover:bg-white/[0.1]"
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
                          <span className="ml-auto text-[10px] text-[#86868b] shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-[#86868b] leading-snug pl-4 text-[11px]">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Practice CTA - Apple Pill */}
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
              className="lg:hidden p-2 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#86868b] hover:text-white transition-colors"
            >
              {mobileOpen ? <X style={{width:'16px',height:'16px'}} /> : <Menu style={{width:'16px',height:'16px'}} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[60px] z-40 lg:hidden animate-fade-in-down">
          <div className="bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/[0.1] p-3 space-y-1 mx-3 rounded-2xl mt-1 shadow-2xl">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  currentView === item.id
                    ? 'bg-[#0071e3] text-white font-semibold shadow-sm'
                    : 'text-[#86868b] hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                {item.icon && <item.icon style={{width:'14px',height:'14px'}} />}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
