import React, { useState, useEffect } from 'react';
import { PlusCircle, AlertCircle, Sparkles, X } from 'lucide-react';
import { Priority, Task } from '../types/task';
import { DEFAULT_SUBJECTS } from '../utils/storage';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  editingTask: Task | null;
  onUpdateTask: (task: Task) => void;
  onCancelEdit: () => void;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onAddTask,
  editingTask,
  onUpdateTask,
  onCancelEdit,
  isOpenModal,
  onCloseModal,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(DEFAULT_SUBJECTS[0]);
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If editingTask changes, populate form
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDueDate(editingTask.dueDate);
      setPriority(editingTask.priority);
      if (DEFAULT_SUBJECTS.includes(editingTask.subject)) {
        setSubject(editingTask.subject);
        setIsCustomSubject(false);
        setCustomSubject('');
      } else {
        setIsCustomSubject(true);
        setCustomSubject(editingTask.subject);
      }
      setErrorMessage(null);
    } else {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle('');
    setSubject(DEFAULT_SUBJECTS[0]);
    setIsCustomSubject(false);
    setCustomSubject('');
    setDueDate('');
    setPriority('medium');
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMessage('Task title is required. Please give your task a clear name.');
      return;
    }

    const finalSubject = isCustomSubject ? customSubject.trim() || 'General' : subject;

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: trimmedTitle,
        subject: finalSubject,
        dueDate,
        priority,
      });
    } else {
      onAddTask({
        title: trimmedTitle,
        subject: finalSubject,
        dueDate,
        priority,
      });
    }

    resetForm();
    if (onCloseModal) onCloseModal();
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit();
    if (onCloseModal) onCloseModal();
  };

  const formContent = (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card p-5 sm:p-6 mb-6 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#EDF2F7]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#EDEBFF] text-[#4B55F5]">
            {editingTask ? <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> : <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#142B61] tracking-tight">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            <p className="text-xs text-slate-400">
              {editingTask
                ? 'Update assignment details, priority, or deadline'
                : 'Schedule a new assignment, project milestone, or study goal'}
            </p>
          </div>
        </div>

        {(editingTask || onCloseModal) && (
          <button
            type="button"
            onClick={handleCancel}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Validation Alert */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#F43F5E]" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div>
          <label htmlFor="task-title" className="block text-xs font-bold text-[#142B61] mb-1.5">
            Task Title <span className="text-[#F43F5E]">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="e.g. Complete Calculus Problem Set 3"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4B55F5]/20 focus:border-[#4B55F5] transition-all"
          />
        </div>

        {/* Grid for Subject, Due Date, Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Subject Selector */}
          <div>
            <label htmlFor="task-subject" className="block text-xs font-bold text-[#142B61] mb-1.5">
              Subject / Course
            </label>
            <div className="relative">
              <select
                id="task-subject"
                value={isCustomSubject ? 'custom' : subject}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomSubject(true);
                  } else {
                    setIsCustomSubject(false);
                    setSubject(e.target.value);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4B55F5]/20 focus:border-[#4B55F5] cursor-pointer"
              >
                {DEFAULT_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
                <option value="custom">+ Custom Subject...</option>
              </select>
            </div>

            {isCustomSubject && (
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Enter custom subject name"
                className="mt-2 w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4B55F5]/20 focus:border-[#4B55F5]"
              />
            )}
          </div>

          {/* Due Date Field */}
          <div>
            <label htmlFor="task-duedate" className="block text-xs font-bold text-[#142B61] mb-1.5">
              Due Date
            </label>
            <div className="relative">
              <input
                id="task-duedate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4B55F5]/20 focus:border-[#4B55F5] cursor-pointer"
              />
            </div>
          </div>

          {/* Priority Buttons */}
          <div>
            <label className="block text-xs font-bold text-[#142B61] mb-1.5">
              Priority Level
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  priority === 'low'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                    : 'border-[#E2E8F0] bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Low
              </button>
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  priority === 'medium'
                    ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                    : 'border-[#E2E8F0] bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  priority === 'high'
                    ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-xs'
                    : 'border-[#E2E8F0] bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                High
              </button>
            </div>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EDF2F7]">
          {(editingTask || onCloseModal) && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#4B55F5] hover:bg-[#3D46DC] rounded-xl shadow-glow-primary transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {editingTask ? <span>Save Changes</span> : <span>Add Task</span>}
          </button>
        </div>
      </form>
    </div>
  );

  // If used as modal
  if (isOpenModal) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"
      >
        <div className="w-full max-w-xl">
          {formContent}
        </div>
      </div>
    );
  }

  return formContent;
};
