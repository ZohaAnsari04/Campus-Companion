import React from 'react';
import { GraduationCap, Calendar, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card p-6 sm:p-8 mb-8 animate-fadeIn">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDEBFF] border border-[#C7D7FE]/60 text-[#4B55F5] text-xs font-semibold mb-4">
          <GraduationCap className="w-4 h-4 text-[#4B55F5]" />
          <span>About Campus Companion</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B61] tracking-tight mb-3">
          Empowering Students to Stay Organized and On Track
        </h2>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
          <strong>Campus Companion</strong> is a lightweight, intuitive productivity dashboard built specifically for students. It simplifies daily academic workflow by helping you systematically organize coursework, manage upcoming deadlines, prioritize high-stakes exams, and monitor completion progress in one clean workspace.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#142B61] mb-1">Manage Deadlines</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Never miss a due date with automated timeline sorting and clear overdue warnings.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#142B61] mb-1">Subject & Priority</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Color-coded categories and priority levels let you tackle what matters most first.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#142B61] mb-1">Track Progress</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Live statistics calculate your pending and completed workload in real time.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200/60">
          <ShieldCheck className="w-4 h-4 text-[#4B55F5] flex-shrink-0" />
          <span>All data is securely saved in your browser's local storage and persists across sessions without any server or account required.</span>
        </div>
      </div>
    </div>
  );
};
