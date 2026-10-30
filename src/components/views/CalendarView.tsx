import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { Task } from '../../types/task';

interface CalendarViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEditTask: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onToggleComplete,
  onEditTask,
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthTitle = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays: { dateStr: string; dayNum: number; isCurrent: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ dateStr, dayNum: d, isCurrent: false });
  }

  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ dateStr, dayNum: d, isCurrent: true });
  }

  const remaining = 35 - calendarDays.length > 0 ? 35 - calendarDays.length : 42 - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 1 : month + 2;
    const y = month === 11 ? year + 1 : year;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ dateStr, dayNum: d, isCurrent: false });
  }

  // Tasks for selected date
  const tasksForSelectedDate = tasks.filter((t) => t.dueDate === selectedDateStr);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-card">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-[#142B61] tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#4B55F5]" />
              <span>Academic Calendar</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Monthly overview of assignment deadlines and exam schedules
            </p>
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#142B61] min-w-32 text-center">
              {monthTitle}
            </h3>
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#142B61] hover:bg-slate-50"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#142B61] hover:bg-slate-50"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 text-center py-3 border-b border-slate-100 text-xs font-bold text-slate-400">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5 mt-2">
          {calendarDays.map((item) => {
            const dayTasks = tasks.filter((t) => t.dueDate === item.dateStr);
            const isSelected = item.dateStr === selectedDateStr;
            const isToday = item.dateStr === new Date().toISOString().split('T')[0];

            return (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDateStr(item.dateStr)}
                className={`min-h-[70px] sm:min-h-[85px] p-2 rounded-xl text-left border flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-[#4B55F5] bg-[#EDEBFF]/40 ring-1 ring-[#4B55F5]'
                    : isToday
                    ? 'border-[#C7D7FE] bg-[#EAF1FF]/30'
                    : item.isCurrent
                    ? 'border-slate-100 hover:border-slate-200 bg-white'
                    : 'border-transparent bg-slate-50/50 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isToday
                        ? 'w-5 h-5 rounded-full bg-[#4B55F5] text-white flex items-center justify-center'
                        : item.isCurrent
                        ? 'text-[#142B61]'
                        : 'text-slate-300'
                    }`}
                  >
                    {item.dayNum}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#EDEBFF] text-[#4B55F5]">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Task pills in day box */}
                <div className="space-y-1 mt-1">
                  {dayTasks.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded truncate ${
                        t.completed
                          ? 'bg-slate-100 text-slate-400 line-through'
                          : t.priority === 'high'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <span className="text-[9px] text-slate-400 font-semibold block">
                      +{dayTasks.length - 2} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#142B61]">
              Deadlines for {selectedDateStr}
            </h3>
            <p className="text-xs text-slate-400">
              {tasksForSelectedDate.length} {tasksForSelectedDate.length === 1 ? 'task' : 'tasks'} scheduled
            </p>
          </div>
        </div>

        {tasksForSelectedDate.length > 0 ? (
          <div className="space-y-2">
            {tasksForSelectedDate.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleComplete(task.id)}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                      task.completed
                        ? 'bg-[#10B981] border-[#10B981] text-white'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-semibold ${
                        task.completed ? 'line-through text-slate-400' : 'text-[#142B61]'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">{task.subject}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onEditTask(task)}
                  className="text-xs font-semibold text-[#4B55F5] hover:underline"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-400 text-xs">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
            <p>No coursework deadlines scheduled for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

