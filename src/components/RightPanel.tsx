import React from 'react';
import { CalendarWidget } from './CalendarWidget';
import { TodaysFocus } from './TodaysFocus';
import { MotivationalCard } from './MotivationalCard';
import { Task } from '../types/task';

interface RightPanelProps {
  tasks: Task[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  onToggleComplete: (id: string) => void;
  onViewAllTasks: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  tasks,
  selectedDate,
  onSelectDate,
  onToggleComplete,
  onViewAllTasks,
}) => {
  return (
    <aside className="w-full lg:w-[260px] xl:w-[280px] flex-shrink-0 space-y-4">
      {/* Interactive Calendar Widget */}
      <CalendarWidget
        tasks={tasks}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />

      {/* Today's Focus Card */}
      <TodaysFocus
        tasks={tasks}
        onToggleComplete={onToggleComplete}
        onViewAllTasks={onViewAllTasks}
      />

      {/* Motivational Quote Card with Botanical Illustration */}
      <MotivationalCard />
    </aside>
  );
};

