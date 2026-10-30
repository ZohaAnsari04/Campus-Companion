import { Task } from '../types/task';

const STORAGE_KEY = 'campus_companion_tasks_v1';
const INITIALIZED_KEY = 'campus_companion_initialized';

export const DEFAULT_SUBJECTS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Literature',
  'History',
  'Economics',
  'Psychology',
  'General',
];

// Helper to format date relative to today
const getRelativeDateString = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const SAMPLE_TASKS: Task[] = [
  {
    id: 'sample-1',
    title: 'Complete Computer Science Lab 4 (Binary Search Trees)',
    subject: 'Computer Science',
    dueDate: getRelativeDateString(1),
    priority: 'high',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Read Calculus Chapter 5: Integration by Parts',
    subject: 'Mathematics',
    dueDate: getRelativeDateString(3),
    priority: 'medium',
    completed: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Submit Physics 101 Mechanics Problem Set',
    subject: 'Physics',
    dueDate: getRelativeDateString(-1), // overdue for demo
    priority: 'high',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'sample-4',
    title: 'Draft Literature Comparative Essay Outline',
    subject: 'Literature',
    dueDate: getRelativeDateString(5),
    priority: 'low',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-5',
    title: 'Review Linear Algebra Midterm Practice Questions',
    subject: 'Mathematics',
    dueDate: getRelativeDateString(-2),
    priority: 'medium',
    completed: true,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

export const loadTasksFromStorage = (): Task[] => {
  try {
    const isInitialized = localStorage.getItem(INITIALIZED_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!isInitialized) {
      // First visit: Seed sample tasks
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_TASKS));
      localStorage.setItem(INITIALIZED_KEY, 'true');
      return SAMPLE_TASKS;
    }

    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        // Validate items shape
        return parsed.filter(
          (t): t is Task =>
            typeof t === 'object' &&
            t !== null &&
            typeof t.id === 'string' &&
            typeof t.title === 'string' &&
            typeof t.completed === 'boolean'
        );
      }
    }
    return [];
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return [];
  }
};

export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

export const resetToSampleTasks = (): Task[] => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_TASKS));
    localStorage.setItem(INITIALIZED_KEY, 'true');
    return SAMPLE_TASKS;
  } catch (error) {
    console.error('Failed to reset sample tasks:', error);
    return SAMPLE_TASKS;
  }
};
