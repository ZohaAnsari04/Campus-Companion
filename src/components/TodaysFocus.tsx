import React from 'react';
import { Check, CheckCircle2, ArrowRight } from 'lucide-react';
import { Task } from '../types/task';

interface TodaysFocusProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onViewAllTasks: () => void;
}

export const TodaysFocus: React.FC<TodaysFocusProps> = ({
  tasks,
  onToggleComplete,
  onViewAllTasks,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Tasks due today or overdue pending tasks
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
  const pendingToday = todayTasks.filter((t) => !t.completed);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-card">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-[#142B61]">
            Today's Focus
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-400">
            {todayTasks.length === 0
              ? 'No deadlines today'
              : `${pendingToday.length} of ${todayTasks.length} pending`}
          </p>
        </div>
        {todayTasks.length > 0 && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDEBFF] text-[#4B55F5]">
            {pendingToday.length} due
          </span>
        )}
      </div>

      {/* Task List or Empty State */}
      <div className="mt-3 space-y-2">
        {pendingToday.length > 0 ? (
          pendingToday.slice(0, 4).map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-[#F5F7FC] transition-colors"
            >
              <button
                type="button"
                onClick={() => onToggleComplete(task.id)}
                className="mt-0.5 w-4 h-4 rounded-md border border-slate-300 bg-white flex items-center justify-center hover:border-[#4B55F5] transition-all flex-shrink-0"
                aria-label={`Complete ${task.title}`}
              >
                <Check className="w-3 h-3 text-transparent hover:text-[#4B55F5]" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate leading-snug">
                  {task.title}
                </p>
                <span className="text-[10px] text-slate-400 font-medium truncate block">
                  {task.subject}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 text-center">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#142B61]">
              You're all caught up!
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Enjoy your productive day.
            </p>
          </div>
        )}
      </div>

      {/* View All Tasks Button */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100">
        <button
          type="button"
          onClick={onViewAllTasks}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-[#4B55F5] hover:text-[#3D46DC] transition-colors"
        >
          <span>View All Tasks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

