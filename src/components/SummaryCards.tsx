import React from 'react';
import { FileText, Clock, CheckCircle2, Flame } from 'lucide-react';
import { Task } from '../types/task';

interface SummaryCardsProps {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  tasks?: Task[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalTasks,
  pendingTasks,
  completedTasks,
  tasks = [],
}) => {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate streak based on task completion activity
  // If there are completed tasks, calculate consecutive days or default to an active momentum streak
  const calculateStreak = (): number => {
    if (completedTasks === 0) return 0;
    // Count days that have at least one completed task
    const completedDays = new Set(
      tasks
        .filter((t) => t.completed)
        .map((t) => t.createdAt.split('T')[0])
    );
    return Math.max(1, completedDays.size);
  };

  const streakDays = calculateStreak();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* CARD 1: Total Tasks */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all duration-200 group">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Tasks
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#EAF1FF] text-[#4B55F5] flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#142B61] tracking-tight">
            {totalTasks}
          </h3>
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#4B55F5] bg-[#EDEBFF] px-2 py-0.5 rounded-full">
            All Coursework
          </span>
        </div>
        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">
          Across all academic subjects
        </p>
      </div>

      {/* CARD 2: Pending Tasks */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all duration-200 group">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending Tasks
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F59E0B] tracking-tight">
            {pendingTasks}
          </h3>
          <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>
        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">
          Items requiring completion
        </p>
      </div>

      {/* CARD 3: Completed Tasks */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all duration-200 group">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Completed Tasks
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#10B981] tracking-tight">
            {completedTasks}
          </h3>
          <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            {completionRate}%
          </span>
        </div>
        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">
          {completionRate}% overall completion
        </p>
      </div>

      {/* CARD 4: Productivity Streak */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all duration-200 group">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Productivity Streak
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-50 text-[#F59E0B] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Flame className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#142B61] tracking-tight">
            {streakDays > 0 ? `${streakDays} Day${streakDays > 1 ? 's' : ''}` : '0 Days'}
          </h3>
          <span className="text-[10px] sm:text-[11px] font-semibold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Flame className="w-3 h-3 text-[#F59E0B]" />
            <span>Streak</span>
          </span>
        </div>
        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">
          {streakDays > 0 ? 'Consistency is paying off!' : 'Complete tasks to build streak'}
        </p>
      </div>
    </div>
  );
};
