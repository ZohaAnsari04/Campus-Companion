import React from 'react';
import { Check, Calendar, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDeleteRequest: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDeleteRequest,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Helper for tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const isOverdue = !task.completed && !!task.dueDate && task.dueDate < todayStr;
  const isDueToday = !task.completed && !!task.dueDate && task.dueDate === todayStr;
  const isDueTomorrow = !task.completed && !!task.dueDate && task.dueDate === tomorrowStr;

  // Format Due Date for display
  const getDueDateLabel = (dateStr: string) => {
    if (!dateStr) return { text: 'No Date', isUrgent: false };
    if (isOverdue) return { text: 'Overdue', isUrgent: true };
    if (isDueToday) return { text: 'Today', isUrgent: true };
    if (isDueTomorrow) return { text: 'Tomorrow', isUrgent: false };

    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return { text: dateStr, isUrgent: false };
    const d = new Date(year, month - 1, day);
    const formatted = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(d);
    return { text: formatted, isUrgent: false };
  };

  const dueInfo = getDueDateLabel(task.dueDate);

  // Priority Styling with colored dot indicator
  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]" />
            <span>High</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            <span>Medium</span>
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>Low</span>
          </span>
        );
    }
  };

  // Subject Badge Color Schemes
  const getSubjectColor = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes('cs') || s.includes('computer')) return 'bg-blue-50 text-[#4B55F5] border-blue-100';
    if (s.includes('math') || s.includes('algebra')) return 'bg-[#EDEBFF] text-[#5145E5] border-indigo-100';
    if (s.includes('physics')) return 'bg-cyan-50 text-cyan-700 border-cyan-100';
    if (s.includes('chem') || s.includes('bio')) return 'bg-teal-50 text-teal-700 border-teal-100';
    if (s.includes('lit') || s.includes('english')) return 'bg-purple-50 text-purple-700 border-purple-100';
    if (s.includes('hist')) return 'bg-orange-50 text-orange-700 border-orange-100';
    if (s.includes('psych') || s.includes('econ')) return 'bg-violet-50 text-violet-700 border-violet-100';
    return 'bg-slate-50 text-slate-700 border-slate-200/70';
  };

  return (
    <div
      className={`group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200 gap-3 ${
        task.completed
          ? 'bg-slate-50/60 border-slate-200/70 opacity-75'
          : isOverdue
          ? 'bg-rose-50/20 border-rose-200 shadow-xs'
          : 'bg-white border-[#E2E8F0] hover:border-[#C7D7FE] shadow-card hover:shadow-card-hover'
      }`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Custom Accessible Checkbox with Smooth Animation */}
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          aria-label={task.completed ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as completed`}
          aria-checked={task.completed}
          role="checkbox"
          className={`mt-0.5 flex-shrink-0 w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-lg border flex items-center justify-center transition-all duration-150 ${
            task.completed
              ? 'bg-[#10B981] border-[#10B981] text-white shadow-xs'
              : 'border-slate-300 bg-white hover:border-[#4B55F5] hover:bg-[#EDEBFF]/30 text-transparent'
          }`}
        >
          <Check className={`w-3.5 h-3.5 stroke-[3] transition-transform ${task.completed ? 'scale-100' : 'scale-50'}`} />
        </button>

        {/* Task Title & Meta Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`text-xs sm:text-sm font-semibold tracking-tight transition-all truncate max-w-full ${
                task.completed ? 'line-through text-slate-400' : 'text-[#142B61]'
              }`}
            >
              {task.title}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Subject badge */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold border ${getSubjectColor(
                task.subject
              )}`}
            >
              {task.subject}
            </span>

            {/* Due date badge */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                  task.completed
                    ? 'text-slate-400'
                    : isOverdue
                    ? 'text-[#F43F5E] font-semibold'
                    : isDueToday
                    ? 'text-[#F59E0B] font-semibold'
                    : 'text-slate-500'
                }`}
              >
                {isOverdue ? (
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-[#F43F5E]" />
                ) : (
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                )}
                <span>{dueInfo.text}</span>
              </span>
            )}

            {/* Priority Badge */}
            {getPriorityBadge(task.priority)}
          </div>
        </div>
      </div>

      {/* Row Action Buttons: Edit & Delete */}
      <div className="flex items-center gap-1 self-end sm:self-center opacity-80 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.title}`}
          className="p-1.5 rounded-lg text-slate-400 hover:text-[#4B55F5] hover:bg-[#EDEBFF] transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onDeleteRequest(task)}
          aria-label={`Delete ${task.title}`}
          className="p-1.5 rounded-lg text-slate-400 hover:text-[#F43F5E] hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
