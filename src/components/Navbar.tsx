import React from 'react';
import { GraduationCap, CheckSquare, Info, Home, Sparkles } from 'lucide-react';
import PillNav from './PillNav';

interface NavbarProps {
  currentView: 'home' | 'tasks' | 'about';
  onNavigate: (view: 'home' | 'tasks' | 'about') => void;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, pendingCount }) => {
  const handleNav = (view: 'home' | 'tasks' | 'about') => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    {
      id: 'nav-home',
      label: 'Home',
      href: '#home',
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'nav-tasks',
      label: (
        <span className="inline-flex items-center gap-1.5">
          <span>Tasks</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 leading-none">
              {pendingCount}
            </span>
          )}
        </span>
      ),
      href: '#tasks',
      icon: <CheckSquare className="w-4 h-4" />,
    },
    {
      id: 'nav-about',
      label: 'About',
      href: '#about',
      icon: <Info className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-14">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Campus Companion</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200/60">
                  Student
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Productivity Dashboard</p>
            </div>
          </div>

          {/* PillNav from React Bits */}
          <div className="flex items-center justify-end flex-1 min-w-0">
            <PillNav
              items={navItems}
              activeHref={`#${currentView}`}
              onItemClick={(item, _index, event) => {
                event?.preventDefault();
                if (item.href === '#home') handleNav('home');
                else if (item.href === '#tasks') handleNav('tasks');
                else if (item.href === '#about') handleNav('about');
              }}
              theme="light"
              itemStyle="pill"
              hoverEffect="fill"
              indicator="dot"
              highlightColor="#2563eb"
              highlightTextColor="#ffffff"
              linkComponent={({ href, children, ...props }: any) => (
                <a
                  href={href}
                  {...props}
                  onClick={(e) => {
                    e.preventDefault();
                    props.onClick?.(e);
                  }}
                >
                  {children}
                </a>
              )}
            />
          </div>

          {/* Quick Date Badge */}
          <div className="hidden xl:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
