import React from 'react';
import { BellRing, AlertCircle, Clock, Calendar } from 'lucide-react';
import { Task } from '../../types/task';

interface RemindersViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEditTask: (task: Task) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  tasks,
  onToggleComplete,
  onEditTask,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const overdue = tasks.filter((t) => !t.completed && !!t.dueDate && t.dueDate < todayStr);
  const dueToday = tasks.filter((t) => !t.completed && t.dueDate === todayStr);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const dueTomorrow = tasks.filter((t) => !t.completed && t.dueDate === tomorrowStr);

  const upcomingHigh = tasks.filter(
    (t) => !t.completed && t.priority === 'high' && (!t.dueDate || (t.dueDate > tomorrowStr))
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-card">
        <div className="pb-4 mb-5 border-b border-slate-100">
          <h2 className="text-xl font-extrabold text-[#142B61] tracking-tight flex items-center gap-2">
            <BellRing className="w-5 h-5 text-[#4B55F5]" />
            <span>Deadlines & Urgent Reminders</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time deadline radar alerting you to urgent and upcoming academic deliverables
          </p>
        </div>

        {/* Overdue Section */}
        {overdue.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50/60 border border-rose-200">
            <h3 className="text-xs font-bold text-rose-800 flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <AlertCircle className="w-4 h-4 text-[#F43F5E]" />
              <span>Overdue Tasks ({overdue.length})</span>
            </h3>
            <div className="space-y-2">
              {overdue.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-rose-200 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleComplete(t.id)}
                      className="w-5 h-5 rounded-lg border border-slate-300 hover:border-[#10B981] flex items-center justify-center bg-white"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#142B61]">{t.title}</h4>
                      <span className="text-[10px] text-rose-600 font-semibold">
                        Due: {t.dueDate} • {t.subject}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onEditTask(t)}
                    className="text-xs font-semibold text-[#4B55F5] hover:underline"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Due Today Section */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-[#142B61] flex items-center gap-1.5 uppercase tracking-wider mb-2">
            <Clock className="w-4 h-4 text-[#F59E0B]" />
            <span>Due Today ({dueToday.length})</span>
          </h3>
          {dueToday.length > 0 ? (
            <div className="space-y-2">
              {dueToday.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50/40 border border-amber-200"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleComplete(t.id)}
                      className="w-5 h-5 rounded-lg border border-slate-300 hover:border-[#10B981] flex items-center justify-center bg-white"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#142B61]">{t.title}</h4>
                      <span className="text-[10px] text-amber-700 font-semibold">{t.subject}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onEditTask(t)}
                    className="text-xs font-semibold text-[#4B55F5] hover:underline"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-2">No tasks due today.</p>
          )}
        </div>

        {/* Due Tomorrow Section */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-[#142B61] flex items-center gap-1.5 uppercase tracking-wider mb-2">
            <Calendar className="w-4 h-4 text-[#4B55F5]" />
            <span>Due Tomorrow ({dueTomorrow.length})</span>
          </h3>
          {dueTomorrow.length > 0 ? (
            <div className="space-y-2">
              {dueTomorrow.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleComplete(t.id)}
                      className="w-5 h-5 rounded-lg border border-slate-300 hover:border-[#10B981] flex items-center justify-center bg-white"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#142B61]">{t.title}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">{t.subject}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onEditTask(t)}
                    className="text-xs font-semibold text-[#4B55F5] hover:underline"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-2">No tasks due tomorrow.</p>
          )}
        </div>

        {/* Upcoming High Priority */}
        {upcomingHigh.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-[#142B61] flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-[#F43F5E]" />
              <span>Upcoming High-Priority Deliverables</span>
            </h3>
            <div className="space-y-2">
              {upcomingHigh.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-xs"
                >
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#142B61]">{t.title}</h4>
                    <span className="text-[10px] text-slate-400">
                      Due: {t.dueDate || 'Unspecified'} • {t.subject}
                    </span>
                  </div>
                  <button
                    onClick={() => onEditTask(t)}
                    className="text-xs font-semibold text-[#4B55F5] hover:underline"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
