import { useState, useEffect } from 'react';
import { Task } from './types/task';
import { loadTasksFromStorage, saveTasksToStorage, resetToSampleTasks } from './utils/storage';
import { Sidebar, NavView } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { WelcomeBanner } from './components/WelcomeBanner';
import { SummaryCards } from './components/SummaryCards';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { RightPanel } from './components/RightPanel';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AboutSection } from './components/AboutSection';
import { CalendarView } from './components/views/CalendarView';
import { SubjectsView } from './components/views/SubjectsView';
import { ProgressView } from './components/views/ProgressView';
import { NotesView } from './components/views/NotesView';
import { RemindersView } from './components/views/RemindersView';
import { SettingsView } from './components/views/SettingsView';

export function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [currentView, setCurrentView] = useState<NavView>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // Persist tasks to localStorage
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Statistics
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  // Task Handlers
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setIsAddTaskModalOpen(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setEditingTask(null);
    setIsAddTaskModalOpen(false);
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleRequestDelete = (task: Task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      if (editingTask?.id === taskToDelete.id) {
        setEditingTask(null);
      }
      setTaskToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
  };

  const handleResetSamples = () => {
    const samples = resetToSampleTasks();
    setTasks(samples);
  };

  const handleNavigate = (view: NavView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAddTask = () => {
    setEditingTask(null);
    setIsAddTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsAddTaskModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-slate-800 flex">
      {/* 1. LEFT SIDEBAR */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        pendingCount={pendingTasks}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. MAIN VIEW AREA (Offset by sidebar width on desktop) */}
      <div className="flex-1 lg:pl-[190px] xl:pl-[210px] flex flex-col min-w-0 transition-all">
        {/* Top Navigation Bar */}
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          tasks={tasks}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onNavigate={handleNavigate}
        />

        {/* Content Container */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          {/* VIEW SWITCHER */}
          {currentView === 'about' ? (
            <div className="max-w-4xl mx-auto animate-fadeIn">
              <AboutSection />
              <div className="flex justify-center mb-8">
                <button
                  type="button"
                  onClick={() => handleNavigate('home')}
                  className="px-5 py-2.5 bg-[#4B55F5] hover:bg-[#3D46DC] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-glow-primary transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          ) : currentView === 'calendar' ? (
            <CalendarView
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
            />
          ) : currentView === 'subjects' ? (
            <SubjectsView
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onOpenAddTaskWithSubject={(_subject) => {
                handleOpenAddTask();
              }}
            />
          ) : currentView === 'progress' ? (
            <ProgressView tasks={tasks} />
          ) : currentView === 'notes' ? (
            <NotesView />
          ) : currentView === 'reminders' ? (
            <RemindersView
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
            />
          ) : currentView === 'settings' ? (
            <SettingsView
              tasks={tasks}
              onResetSamples={handleResetSamples}
              onNavigate={handleNavigate}
            />
          ) : currentView === 'tasks' ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Task Creation Inline Card */}
              <div id="task-form-section">
                <TaskForm
                  onAddTask={handleAddTask}
                  editingTask={editingTask}
                  onUpdateTask={handleUpdateTask}
                  onCancelEdit={() => setEditingTask(null)}
                />
              </div>

              {/* Task List */}
              <div id="task-list-section">
                <TaskList
                  tasks={tasks}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDeleteRequest={handleRequestDelete}
                  onResetSamples={handleResetSamples}
                  onOpenAddTask={handleOpenAddTask}
                  selectedDateFilter={selectedDateFilter}
                  onClearDateFilter={() => setSelectedDateFilter(null)}
                />
              </div>
            </div>
          ) : (
            /* 3. HOME VIEW: THREE-COLUMN BALANCED DASHBOARD */
            <div className="animate-fadeIn space-y-6">
              {/* Welcome Hero Section */}
              <WelcomeBanner
                onOpenAddTask={handleOpenAddTask}
                pendingCount={pendingTasks}
                completedCount={completedTasks}
              />

              {/* Productivity Statistics Cards */}
              <SummaryCards
                totalTasks={totalTasks}
                pendingTasks={pendingTasks}
                completedTasks={completedTasks}
                tasks={tasks}
              />

              {/* Layout: Main Task Board (Center) & Calendar / Focus Widgets (Right) */}
              <div className="flex flex-col lg:flex-row items-start gap-6">
                {/* Center Main Productivity Area */}
                <div className="flex-1 w-full min-w-0 space-y-6">
                  {/* Task Form (Rendered inline when editing) */}
                  <div id="task-form-section">
                    <TaskForm
                      onAddTask={handleAddTask}
                      editingTask={editingTask}
                      onUpdateTask={handleUpdateTask}
                      onCancelEdit={() => setEditingTask(null)}
                    />
                  </div>

                  {/* Main Task List Card ("My Tasks") */}
                  <div id="task-list-section">
                    <TaskList
                      tasks={tasks}
                      onToggleComplete={handleToggleComplete}
                      onEdit={(task) => {
                        setEditingTask(task);
                        const el = document.getElementById('task-form-section');
                        if (el && typeof el.scrollIntoView === 'function') {
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      onDeleteRequest={handleRequestDelete}
                      onResetSamples={handleResetSamples}
                      onOpenAddTask={handleOpenAddTask}
                      selectedDateFilter={selectedDateFilter}
                      onClearDateFilter={() => setSelectedDateFilter(null)}
                    />
                  </div>
                </div>

                {/* Right Panel: Calendar Widget, Today's Focus, and Motivational Quote */}
                <RightPanel
                  tasks={tasks}
                  selectedDate={selectedDateFilter}
                  onSelectDate={(date) => setSelectedDateFilter(date)}
                  onToggleComplete={handleToggleComplete}
                  onViewAllTasks={() => handleNavigate('tasks')}
                />
              </div>
            </div>
          )}
        </main>

        {/* Global Footer */}
        <footer className="mt-auto border-t border-[#E2E8F0] bg-white py-4 text-center text-xs text-slate-400">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} Campus Companion — Student Productivity Hub.</p>
            <p>Designed for focused, distraction-free academic momentum.</p>
          </div>
        </footer>
      </div>

      {/* Task Creation & Edit Modal (when opened via buttons) */}
      {isAddTaskModalOpen && (
        <TaskForm
          isOpenModal={true}
          onCloseModal={() => {
            setIsAddTaskModalOpen(false);
            setEditingTask(null);
          }}
          onAddTask={handleAddTask}
          editingTask={editingTask}
          onUpdateTask={handleUpdateTask}
          onCancelEdit={() => {
            setEditingTask(null);
            setIsAddTaskModalOpen(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        task={taskToDelete}
        isOpen={!!taskToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default App;
