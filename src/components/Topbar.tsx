import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Bell,
  ChevronDown,
  Menu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Task } from '../types/task';
import { NavView } from './Sidebar';

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tasks: Task[];
  onOpenMobileMenu: () => void;
  onNavigate: (view: NavView) => void;
  onSelectTask?: (task: Task) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  onSearchChange,
  tasks,
  onOpenMobileMenu,
  onNavigate,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Compute real notifications based on actual tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter((t) => !t.completed && !!t.dueDate && t.dueDate < todayStr);
  const dueTodayTasks = tasks.filter((t) => !t.completed && !!t.dueDate && t.dueDate === todayStr);
  const upcomingHighPriority = tasks.filter((t) => !t.completed && t.priority === 'high' && (!t.dueDate || t.dueDate > todayStr));

  const totalAlerts = overdueTasks.length + dueTodayTasks.length;

  return (
    <header className="sticky top-0 z-30 bg-[#F5F7FC]/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 transition-all border-b border-[#E2E8F0]/70">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Mobile menu button & Search Input */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-600 hover:text-[#142B61] rounded-xl hover:bg-white border border-slate-200 shadow-xs"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search bar */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="global-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks, subjects, or anything..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4B55F5]/20 focus:border-[#4B55F5] shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 text-xs"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-white border border-[#E2E8F0] text-slate-600 hover:text-[#142B61] hover:bg-slate-50 transition-all shadow-xs"
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {totalAlerts > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F43F5E] text-[10px] font-bold text-white shadow-xs">
                  {totalAlerts}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-[#E2E8F0] shadow-card-hover p-4 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#4B55F5]" />
                    <h3 className="text-xs font-bold text-[#142B61]">Notifications</h3>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {totalAlerts === 0 ? 'All caught up' : `${totalAlerts} items require attention`}
                  </span>
                </div>

                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                  {overdueTasks.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200/60">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{overdueTasks.length} Overdue Task{overdueTasks.length > 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-[11px] text-rose-600 mt-0.5 truncate">
                        {overdueTasks[0].title}
                      </p>
                    </div>
                  )}

                  {dueTodayTasks.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{dueTodayTasks.length} Due Today</span>
                      </div>
                      <p className="text-[11px] text-amber-600 mt-0.5 truncate">
                        {dueTodayTasks[0].title}
                      </p>
                    </div>
                  )}

                  {upcomingHighPriority.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-[#EDEBFF] border border-[#C7D7FE]/50">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#5145E5]">
                        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>High Priority Upcoming</span>
                      </div>
                      <p className="text-[11px] text-indigo-700 mt-0.5 truncate">
                        {upcomingHighPriority[0].title} ({upcomingHighPriority[0].subject})
                      </p>
                    </div>
                  )}

                  {totalAlerts === 0 && (
                    <div className="py-4 text-center text-slate-400">
                      <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                      <p className="text-xs font-medium text-slate-600">You're all caught up!</p>
                      <p className="text-[10px] text-slate-400">No overdue tasks or urgent deadlines.</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      onNavigate('tasks');
                      setShowNotifications(false);
                    }}
                    className="text-[11px] font-semibold text-[#4B55F5] hover:underline"
                  >
                    View All Tasks →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl bg-white border border-[#E2E8F0] hover:bg-slate-50 transition-all shadow-xs"
              aria-label="User Profile Menu"
              aria-expanded={showUserMenu}
            >
              {/* User Avatar Initial */}
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#4B55F5] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                S
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-[#142B61]">Student</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-[#E2E8F0] shadow-card-hover p-2 z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-[#142B61]">Student Account</p>
                  <p className="text-[10px] text-slate-400 truncate">student@campuscompanion.edu</p>
                </div>

                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-600 hover:text-[#142B61] hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preferences</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('about');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-600 hover:text-[#142B61] hover:bg-slate-50 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>About Campus Companion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
