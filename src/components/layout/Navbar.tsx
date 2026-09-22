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
            ? 'bg-slate-950/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_40px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between gap-3">
          
          {/* Brand */}
          <button
            onClick={() => setCurrentView('marketing')}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="relative w-9 h-9 shrink-0">
              <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-sm group-hover:opacity-40 transition-opacity" />
              <div className="relative w-9 h-9 rounded-xl bg-white p-0.5 shadow-md flex items-center justify-center overflow-hidden border border-white/20 group-hover:scale-105 transition-transform duration-300">
                <img src="/logo.png" alt="EduPulse AI Logo" className="w-8 h-8 object-contain" />
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-[18px] tracking-tight text-white leading-none">
                  Edu<span className="gradient-text-emerald">Pulse</span>
                </span>
                <span className="badge badge-emerald" style={{fontSize:'8px',padding:'1px 5px'}}>AI K-12</span>
              </div>
              <p className="text-[9px] text-slate-500 font-medium mt-0.5">CBSE • ICSE • State</p>
            </div>
          </button>

          {/* Desktop Nav Tabs */}
          <nav className="hidden lg:flex tab-bar flex-1 max-w-[740px] overflow-x-auto py-1 px-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`tab-item flex items-center gap-1.5 px-2.5 py-1.5 text-xs ${currentView === item.id ? 'active' : ''}`}
              >
                {item.icon && <item.icon style={{width:'12px',height:'12px'}} />}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Reset Demo */}
            <button
              onClick={resetAllDemoData}
              title="Reset Demo Data"
              className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-rose-400 px-2 py-1.5 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
            >
              <RotateCcw style={{width:'11px',height:'11px'}} />
              Reset
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-slate-900/80 border border-white/[0.06] hover:border-white/[0.12] text-slate-400 hover:text-white transition-all duration-200 hover:bg-slate-800/80"
              >
                <Bell style={{width:'15px',height:'15px'}} />
                {unreadNotifs.length > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-[9px] font-black text-slate-950 flex items-center justify-center z-10">
                      {unreadNotifs.length}
                    </span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-400 animate-ping-ripple opacity-60" />
                  </>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-[340px] rounded-2xl glass shadow-2xl overflow-hidden animate-fade-in-down z-50">
                  <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="status-dot-live" />
                      <span className="text-xs font-bold text-white">Live Notifications</span>
                    </div>
                    <span className="badge badge-emerald" style={{fontSize:'9px'}}>{unreadNotifs.length} new</span>
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
                          {notif.type === 'proctor_alert' && <AlertTriangle style={{width:'12px',height:'12px',color:'#fbbf24',flexShrink:0,marginTop:'1px'}} />}
                          {notif.type === 'result_ready' && <CheckCircle2 style={{width:'12px',height:'12px',color:'#34d399',flexShrink:0,marginTop:'1px'}} />}
                          {notif.type === 'at_risk_alert' && <AlertTriangle style={{width:'12px',height:'12px',color:'#fb7185',flexShrink:0,marginTop:'1px'}} />}
                          <span className="font-semibold text-white leading-tight">{notif.title}</span>
                          <span className="ml-auto text-[10px] text-slate-500 shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-slate-400 leading-snug pl-4">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Practice CTA */}
            <button
              onClick={() => { setUserRole('student'); setCurrentView('questions'); }}
              className="btn-primary hidden sm:flex text-xs py-1.5 px-3"
            >
              <Zap style={{width:'12px',height:'12px'}} />
              <span>Practice</span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900/80 border border-white/[0.06] text-slate-400 hover:text-white transition-colors"
            >
              {mobileOpen ? <X style={{width:'16px',height:'16px'}} /> : <Menu style={{width:'16px',height:'16px'}} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[60px] z-40 lg:hidden animate-fade-in-down">
          <div className="glass border-b border-white/[0.06] p-3 space-y-1 mx-2 rounded-2xl mt-1 shadow-2xl">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  currentView === item.id
                    ? 'bg-brand-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
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
