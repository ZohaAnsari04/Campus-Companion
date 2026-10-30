export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

export type FilterStatus = 'all' | 'pending' | 'completed';
export type SortOption = 'dueDateAsc' | 'dueDateDesc' | 'priorityDesc' | 'createdDesc';
