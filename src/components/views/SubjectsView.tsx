import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Clock, Plus } from 'lucide-react';
import { Task } from '../../types/task';
import { DEFAULT_SUBJECTS } from '../../utils/storage';

interface SubjectsViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onOpenAddTaskWithSubject?: (subject: string) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  tasks,
  onToggleComplete,
  onOpenAddTaskWithSubject,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Group tasks by subject
  const subjectMap = new Map<string, { total: number; completed: number; highPriority: number; tasks: Task[] }>();

  // Ensure default subjects are initialized
  DEFAULT_SUBJECTS.forEach((sub) => {
    subjectMap.set(sub, { total: 0, completed: 0, highPriority: 0, tasks: [] });
  });

  tasks.forEach((t) => {
    const s = t.subject || 'General';
    const existing = subjectMap.get(s) || { total: 0, completed: 0, highPriority: 0, tasks: [] };
    existing.total += 1;
    if (t.completed) existing.completed += 1;
    if (!t.completed && t.priority === 'high') existing.highPriority += 1;
    existing.tasks.push(t);
    subjectMap.set(s, existing);
  });

  // Filter out subjects with 0 tasks unless default CS / Math / Physics
  const subjectsList = Array.from(subjectMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .filter((s) => s.total > 0 || ['Computer Science', 'Mathematics', 'Physics'].includes(s.name));

  const activeSubjectData = selectedSubject ? subjectMap.get(selectedSubject) : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Cards Grid */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-card">
        <div className="pb-4 mb-5 border-b border-slate-100">
          <h2 className="text-xl font-extrabold text-[#142B61] tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#4B55F5]" />
            <span>Enrolled Subjects & Courses</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor course-by-course progress, assignment loads, and urgent deadlines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectsList.map((sub) => {
            const percent = sub.total > 0 ? Math.round((sub.completed / sub.total) * 100) : 0;
            const isSelected = selectedSubject === sub.name;

            return (
              <div
                key={sub.name}
                onClick={() => setSelectedSubject(isSelected ? null : sub.name)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#4B55F5] bg-[#EDEBFF]/30 shadow-card-hover'
                    : 'border-[#E2E8F0] bg-white hover:border-[#C7D7FE] shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#EAF1FF] text-[#4B55F5] flex items-center justify-center font-bold text-xs">
                      {sub.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#142B61] leading-tight">
                        {sub.name}
                      </h3>
                      <span className="text-[10px] text-slate-400">
                        {sub.total} assignment{sub.total === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>

                  {sub.highPriority > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {sub.highPriority} urgent
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 mt-2">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span>Progress</span>
                    <span className="font-bold text-[#142B61]">{percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#4B55F5] to-[#5145E5] rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{sub.completed} completed</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>{sub.total - sub.completed} pending</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Specific Tasks Detail Section */}
      {selectedSubject && activeSubjectData && (
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-card animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#142B61]">
                Assignments for {selectedSubject}
              </h3>
              <p className="text-xs text-slate-400">
                {activeSubjectData.tasks.length} total tasks found in this subject
              </p>
            </div>
            {onOpenAddTaskWithSubject && (
              <button
                onClick={() => onOpenAddTaskWithSubject(selectedSubject)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4B55F5] text-white text-xs font-semibold shadow-xs hover:bg-[#3D46DC]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task to {selectedSubject}</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            {activeSubjectData.tasks.map((task) => (
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
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      task.completed ? 'line-through text-slate-400' : 'text-[#142B61]'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                    {task.dueDate || 'No Due Date'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.priority === 'high'
                        ? 'bg-rose-50 text-rose-700'
                        : task.priority === 'medium'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
