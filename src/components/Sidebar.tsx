import React from 'react';
import {
  GraduationCap,
  Home,
  CheckSquare,
  Calendar,
  BookOpen,
  TrendingUp,
  FileText,
  BellRing,
  Settings,
  Info,
  X
} from 'lucide-react';

export type NavView =
  | 'home'
  | 'tasks'
  | 'calendar'
  | 'subjects'
  | 'progress'
  | 'notes'
  | 'reminders'
  | 'settings'
  | 'about';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  pendingCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  pendingCount = 0,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems: { id: string; label: string; view: NavView; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'nav-home', label: 'Home', view: 'home', icon: Home },
    { id: 'nav-tasks', label: 'My Tasks', view: 'tasks', icon: CheckSquare, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'nav-calendar', label: 'Calendar', view: 'calendar', icon: Calendar },
    { id: 'nav-subjects', label: 'Subjects', view: 'subjects', icon: BookOpen },
    { id: 'nav-progress', label: 'Progress', view: 'progress', icon: TrendingUp },
    { id: 'nav-notes', label: 'Notes', view: 'notes', icon: FileText },
    { id: 'nav-reminders', label: 'Reminders', view: 'reminders', icon: BellRing },
    { id: 'nav-settings', label: 'Settings', view: 'settings', icon: Settings },
  ];

  const handleItemClick = (view: NavView) => {
    onNavigate(view);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[200px] sm:w-[215px] lg:w-[190px] xl:w-[210px] bg-white border-r border-[#E2E8F0] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="flex-1 overflow-y-auto px-3.5 py-5">
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between mb-6 px-1.5">
            <div
              onClick={() => handleItemClick('home')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4B55F5] to-[#5145E5] flex items-center justify-center text-white shadow-sm shadow-[#4B55F5]/30 group-hover:scale-105 transition-transform flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-sm tracking-tight text-[#142B61] leading-tight truncate">
                  Campus Companion
                </h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-tight truncate">
                  Your Student Productivity Hub
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1" aria-label="Sidebar Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;

              return (
                <button
                  key={item.id}
                  id={item.id}
                  onClick={() => handleItemClick(item.view)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#EDEBFF] text-[#4B55F5] shadow-xs'
                      : 'text-slate-600 hover:text-[#142B61] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-[#4B55F5]' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-[#4B55F5] text-white'
                          : 'bg-[#EDEBFF] text-[#4B55F5]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Hidden / accessible About Button for tests and legacy links */}
            <button
              id="nav-about"
              onClick={() => handleItemClick('about')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                currentView === 'about'
                  ? 'bg-[#EDEBFF] text-[#4B55F5]'
                  : 'text-slate-500 hover:text-[#142B61] hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Info
                  className={`w-4 h-4 flex-shrink-0 ${
                    currentView === 'about' ? 'text-[#4B55F5]' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">About</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Bottom Motivational Quote Card with Botanical Illustration */}
        <div className="p-3 border-t border-[#EDF2F7] bg-white">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#EDEBFF] to-[#EAF1FF] border border-[#C7D7FE]/40 relative overflow-hidden">
            {/* Minimal Botanical Plant SVG Illustration */}
            <div className="absolute right-1 -bottom-1 opacity-25 pointer-events-none">
              <svg
                width="42"
                height="48"
                viewBox="0 0 42 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 48V28M21 28C21 16 32 10 32 10C32 10 34 22 21 28ZM21 28C21 18 10 12 10 12C10 12 8 24 21 28Z"
                  stroke="#5145E5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 18C21 10 27 4 27 4C27 4 29 12 21 18Z"
                  fill="#4B55F5"
                  fillOpacity="0.4"
                />
                <circle cx="21" cy="46" r="3" fill="#5145E5" />
              </svg>
            </div>

            <div className="relative z-10 pr-4">
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/70 text-[9px] font-bold text-[#5145E5] mb-1.5 uppercase tracking-wider">
                🌱 Daily Spark
              </div>
              <h4 className="text-[11px] font-bold text-[#142B61] leading-tight">
                Small Steps, Big Progress
              </h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                Stay consistent and celebrate each milestone.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

