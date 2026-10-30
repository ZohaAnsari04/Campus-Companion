import React, { useState, useMemo } from 'react';
import { FilterStatus, SortOption, Task } from '../types/task';
import { TaskItem } from './TaskItem';
import { Plus, Search, ArrowUpDown, Filter, RotateCcw, CheckCircle2 } from 'lucide-react';
import { DEFAULT_SUBJECTS } from '../utils/storage';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDeleteRequest: (task: Task) => void;
  onResetSamples: () => void;
  onOpenAddTask?: () => void;
  selectedDateFilter?: string | null;
  onClearDateFilter?: () => void;
}

export type ExtendedSortOption = SortOption | 'titleAsc';

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDeleteRequest,
  onResetSamples,
  onOpenAddTask,
  selectedDateFilter,
  onClearDateFilter,
}) => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [sortOption, setSortOption] = useState<ExtendedSortOption>('dueDateAsc');

  // Counts for tabs
  const allCount = tasks.length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  // Extract all distinct subjects from existing tasks + defaults
  const availableSubjects = useMemo(() => {
    const set = new Set<string>(DEFAULT_SUBJECTS);
    tasks.forEach((t) => {
      if (t.subject) set.add(t.subject);
    });
    return Array.from(set);
  }, [tasks]);

  // Filter & Sort
  const processedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Tab status filter
        if (filter === 'pending' && task.completed) return false;
        if (filter === 'completed' && !task.completed) return false;

        // Subject filter
        if (selectedSubject !== 'all' && task.subject !== selectedSubject) {
          return false;
        }

        // Calendar selected date filter
        if (selectedDateFilter && task.dueDate !== selectedDateFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchSubject = task.subject.toLowerCase().includes(q);
          const matchPriority = task.priority.toLowerCase().includes(q);
          if (!matchTitle && !matchSubject && !matchPriority) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const todayStr = new Date().toISOString().split('T')[0];

        // Incomplete overdue tasks given priority
        const aOverdue = !a.completed && !!a.dueDate && a.dueDate < todayStr;
        const bOverdue = !b.completed && !!b.dueDate && b.dueDate < todayStr;
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;

        // Incomplete before completed
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        // Secondary sorting according to sortOption
        if (sortOption === 'dueDateAsc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortOption === 'dueDateDesc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return b.dueDate.localeCompare(a.dueDate);
        }
        if (sortOption === 'priorityDesc') {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        if (sortOption === 'createdDesc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortOption === 'titleAsc') {
          return a.title.localeCompare(b.title);
        }

        return 0;
      });
  }, [tasks, filter, selectedSubject, selectedDateFilter, searchQuery, sortOption]);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card p-5 sm:p-6 mb-8">
      {/* Header: Title & "+ Add Task" button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDF2F7]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#142B61] tracking-tight">
              My Tasks
            </h2>
            {/* Accessible label for existing test compatibility */}
            <span className="sr-only">Academic Task Board</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#EDEBFF] text-[#4B55F5]">
              {processedTasks.length} {processedTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize coursework, deadlines, and daily academic goals
          </p>
        </div>

        {/* Action Button: Add Task */}
        {onOpenAddTask && (
          <button
            type="button"
            id="list-add-task-btn"
            aria-label="New Task"
            onClick={onOpenAddTask}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#4B55F5] hover:bg-[#3D46DC] text-white text-xs font-semibold shadow-glow-primary transition-all duration-150 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Task</span>
          </button>
        )}
      </div>

      {/* Filter Tabs: All, Pending, Completed */}
      <div className="flex items-center gap-1.5 p-1 bg-[#F5F7FC] rounded-xl border border-[#E2E8F0] my-4 w-fit">
        <button
          type="button"
          id="filter-all"
          onClick={() => setFilter('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-white text-[#142B61] shadow-xs'
              : 'text-slate-500 hover:text-[#142B61]'
          }`}
        >
          <span>All</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              filter === 'all' ? 'bg-[#EDEBFF] text-[#4B55F5]' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {allCount}
          </span>
        </button>

        <button
          type="button"
          id="filter-pending"
          onClick={() => setFilter('pending')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'pending'
              ? 'bg-white text-amber-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Pending</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              filter === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {pendingCount}
          </span>
        </button>

        <button
          type="button"
          id="filter-completed"
          onClick={() => setFilter('completed')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'completed'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Completed</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              filter === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {completedCount}
          </span>
        </button>
      </div>

      {/* Toolbar: Search input, Subject dropdown, Sort dropdown */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            id="search-tasks"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by assignment, subject, or priority..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#E2E8F0] bg-[#F5F7FC] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4B55F5]/20 focus:border-[#4B55F5] transition-all"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters Group: Subject & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            <select
              id="filter-subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-2.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4B55F5]/20 focus:border-[#4B55F5] cursor-pointer"
            >
              <option value="all">All Subjects</option>
              {availableSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="sort-tasks"
              className="text-xs font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Sort:</span>
            </label>
            <select
              id="sort-tasks"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as ExtendedSortOption)}
              className="px-2.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4B55F5]/20 focus:border-[#4B55F5] cursor-pointer"
            >
              <option value="dueDateAsc">Due Date (Soonest first)</option>
              <option value="dueDateDesc">Due Date (Furthest first)</option>
              <option value="priorityDesc">Priority (High to Low)</option>
              <option value="createdDesc">Recently Added</option>
              <option value="titleAsc">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Date Filter Alert Pill if calendar date selected */}
      {selectedDateFilter && (
        <div className="mb-3 p-2.5 rounded-xl bg-[#EDEBFF] border border-[#C7D7FE] flex items-center justify-between text-xs text-[#5145E5]">
          <span>
            Showing tasks due on: <strong>{selectedDateFilter}</strong>
          </span>
          {onClearDateFilter && (
            <button
              onClick={onClearDateFilter}
              className="font-bold underline hover:text-[#142B61]"
            >
              Show all dates
            </button>
          )}
        </div>
      )}

      {/* Task List Rows */}
      {processedTasks.length > 0 ? (
        <div className="space-y-2">
          {processedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDeleteRequest={onDeleteRequest}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <div className="w-12 h-12 rounded-2xl bg-[#EDEBFF] text-[#4B55F5] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#142B61]">No tasks found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedSubject !== 'all' || selectedDateFilter
              ? 'No tasks match the active filters or search query.'
              : filter === 'completed'
              ? 'No completed tasks yet. Finish a task to see it here!'
              : 'You have no active tasks. Click "+ Add Task" to schedule your first assignment.'}
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            {(searchQuery || selectedSubject !== 'all' || selectedDateFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('all');
                  if (onClearDateFilter) onClearDateFilter();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Clear Filters
              </button>
            )}

            {onResetSamples && (
              <button
                type="button"
                onClick={onResetSamples}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#4B55F5] bg-[#EDEBFF] hover:bg-[#EAF1FF] rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Load Sample Tasks</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
