import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../types/task';

interface CalendarWidgetProps {
  tasks: Task[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  tasks,
  selectedDate,
  onSelectDate,
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentMonthDate);

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // First day of month and total days
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Create set of dates with tasks
  const taskDatesMap = new Map<string, { count: number; hasPending: boolean }>();
  tasks.forEach((t) => {
    if (t.dueDate) {
      const existing = taskDatesMap.get(t.dueDate) || { count: 0, hasPending: false };
      existing.count += 1;
      if (!t.completed) existing.hasPending = true;
      taskDatesMap.set(t.dueDate, existing);
    }
  });

  // Calendar cells
  const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthIdx = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    days.push({ dateStr, dayNum, isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({ dateStr, dayNum: d, isCurrentMonth: true });
  }

  // Next month leading days to complete grid (up to 35 or 42)
  const totalCells = days.length <= 35 ? 35 : 42;
  const remaining = totalCells - days.length;
  for (let d = 1; d <= remaining; d++) {
    const nextMonthIdx = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({ dateStr, dayNum: d, isCurrentMonth: false });
  }

  const weekDayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-card">
      {/* Month & Nav Controls */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-xs sm:text-sm font-bold text-[#142B61]">
          {monthName}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg text-slate-400 hover:text-[#142B61] hover:bg-slate-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg text-slate-400 hover:text-[#142B61] hover:bg-slate-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center mb-1.5">
        {weekDayLabels.map((day, idx) => (
          <span
            key={`${day}-${idx}`}
            className="text-[10px] font-bold text-slate-400 py-1"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((item) => {
          const isToday = item.dateStr === todayFormatted;
          const isSelected = item.dateStr === selectedDate;
          const taskInfo = taskDatesMap.get(item.dateStr);

          return (
            <button
              key={item.dateStr}
              type="button"
              onClick={() => {
                if (isSelected) {
                  onSelectDate(null); // toggle off
                } else {
                  onSelectDate(item.dateStr);
                }
              }}
              className={`relative h-7 sm:h-8 flex flex-col items-center justify-center rounded-xl text-xs font-semibold transition-all duration-150 ${
                isSelected
                  ? 'bg-[#4B55F5] text-white shadow-xs'
                  : isToday
                  ? 'bg-[#EDEBFF] text-[#4B55F5] font-bold'
                  : item.isCurrentMonth
                  ? 'text-slate-700 hover:bg-slate-100/80'
                  : 'text-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{item.dayNum}</span>

              {/* Task Indicator Dot */}
              {taskInfo && (
                <span
                  className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                    isSelected
                      ? 'bg-white'
                      : taskInfo.hasPending
                      ? 'bg-[#F59E0B]'
                      : 'bg-[#10B981]'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">
            Filtering date: <span className="text-[#4B55F5] font-semibold">{selectedDate}</span>
          </span>
          <button
            onClick={() => onSelectDate(null)}
            className="text-[#4B55F5] hover:underline font-semibold"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
};

