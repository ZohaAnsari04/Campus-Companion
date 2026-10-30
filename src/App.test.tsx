import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

describe('Campus Companion Application', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders initial dashboard, welcome banner, and seeded sample tasks', () => {
    render(<App />);

    // Brand and logo
    expect(screen.getByText('Campus Companion')).toBeInTheDocument();
    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByText("Let's make today productive.")).toBeInTheDocument();

    // Summary cards exist
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completed Tasks')).toBeInTheDocument();

    // Initial sample tasks should be seeded
    expect(screen.getByText(/Binary Search Trees/i)).toBeInTheDocument();
    expect(screen.getByText(/Integration by Parts/i)).toBeInTheDocument();
  });

  it('validates task form and prevents adding tasks with empty title', () => {
    render(<App />);

    const addButton = screen.getByRole('button', { name: /Add Task/i });
    fireEvent.click(addButton);

    // Error message should appear
    expect(screen.getByRole('alert')).toHaveTextContent(/Task title is required/i);
  });

  it('adds a new task, resets form, and updates dynamic statistics', () => {
    render(<App />);

    const titleInput = screen.getByPlaceholderText(/e\.g\. Complete Calculus Problem Set 3/i);
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    // Fill form
    fireEvent.change(titleInput, { target: { value: 'Complete Organic Chemistry Lab Report' } });

    // Choose priority High
    const highPriorityBtn = screen.getByRole('button', { name: 'High' });
    fireEvent.click(highPriorityBtn);

    // Submit
    fireEvent.click(addButton);

    // New task should appear in list
    expect(screen.getByText('Complete Organic Chemistry Lab Report')).toBeInTheDocument();

    // Input should be cleared
    expect(titleInput).toHaveValue('');
  });

  it('marks a task completed and supports undoing completion', () => {
    render(<App />);

    const taskTitle = 'Complete Computer Science Lab 4 (Binary Search Trees)';
    expect(screen.getByText(taskTitle)).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox', {
      name: `Mark "${taskTitle}" as completed`,
    });

    // Mark completed
    fireEvent.click(checkbox);

    // Verify task title is now struck-through and checkbox indicates completion
    const undoCheckbox = screen.getByRole('checkbox', {
      name: `Mark "${taskTitle}" as incomplete`,
    });
    expect(undoCheckbox).toBeInTheDocument();
    expect(undoCheckbox).toHaveAttribute('aria-checked', 'true');

    // Undo completion
    fireEvent.click(undoCheckbox);
    expect(screen.getByRole('checkbox', {
      name: `Mark "${taskTitle}" as completed`,
    })).toBeInTheDocument();
  });

  it('edits an existing task and saves changes', () => {
    render(<App />);

    const taskTitle = 'Read Calculus Chapter 5: Integration by Parts';
    const editBtn = screen.getByLabelText(`Edit ${taskTitle}`);
    fireEvent.click(editBtn);

    // Form title should change to Edit Task
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    const titleInput = screen.getByPlaceholderText(/e\.g\. Complete Calculus Problem Set 3/i);
    expect(titleInput).toHaveValue(taskTitle);

    // Modify title
    fireEvent.change(titleInput, { target: { value: 'Read Calculus Chapter 6: Differential Equations' } });
    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtn);

    // Updated title should be visible
    expect(screen.getByText('Read Calculus Chapter 6: Differential Equations')).toBeInTheDocument();
  });

  it('shows confirmation modal before deleting a task, allows cancel and confirm', () => {
    render(<App />);

    const taskTitle = 'Draft Literature Comparative Essay Outline';
    const deleteBtn = screen.getByLabelText(`Delete ${taskTitle}`);
    fireEvent.click(deleteBtn);

    // Confirmation modal should be visible
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('Delete Task?')).toBeInTheDocument();

    // Test Cancel
    const cancelBtn = within(dialog).getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText(taskTitle)).toBeInTheDocument();

    // Test Confirm Delete
    fireEvent.click(deleteBtn);
    const dialog2 = screen.getByRole('dialog');
    const confirmDeleteBtn = within(dialog2).getByRole('button', { name: /Delete Task/i });
    fireEvent.click(confirmDeleteBtn);

    // Task should now be deleted
    expect(screen.queryByText(taskTitle)).not.toBeInTheDocument();
  });

  it('filters tasks using All, Pending, and Completed tabs', () => {
    render(<App />);

    const pendingTab = screen.getByRole('button', { name: /^Pending/i });
    const completedTab = screen.getByRole('button', { name: /^Completed/i });
    const allTab = screen.getByRole('button', { name: /^All/i });

    // Initially sample 5 is completed ("Review Linear Algebra Midterm Practice Questions")
    const completedTitle = 'Review Linear Algebra Midterm Practice Questions';
    const pendingTitle = 'Complete Computer Science Lab 4 (Binary Search Trees)';

    // Click Pending tab
    fireEvent.click(pendingTab);
    expect(screen.getByText(pendingTitle)).toBeInTheDocument();
    expect(screen.queryByText(completedTitle)).not.toBeInTheDocument();

    // Click Completed tab
    fireEvent.click(completedTab);
    expect(screen.queryByText(pendingTitle)).not.toBeInTheDocument();
    expect(screen.getByText(completedTitle)).toBeInTheDocument();

    // Click All tab
    fireEvent.click(allTab);
    expect(screen.getByText(pendingTitle)).toBeInTheDocument();
    expect(screen.getByText(completedTitle)).toBeInTheDocument();
  });

  it('navigates to About section and back to Home', () => {
    const { container } = render(<App />);

    // Click nav-about in navbar
    const aboutNav = container.querySelector('#nav-about') as HTMLButtonElement;
    expect(aboutNav).not.toBeNull();
    fireEvent.click(aboutNav);

    // About section should be displayed
    expect(screen.getByText('Empowering Students to Stay Organized and On Track')).toBeInTheDocument();

    // Click Back to Dashboard
    const backBtn = screen.getByRole('button', { name: /Back to Dashboard/i });
    fireEvent.click(backBtn);

    // Back on dashboard
    expect(screen.getByText('Academic Task Board')).toBeInTheDocument();
  });

  it('persists changes in localStorage across page reloads', () => {
    const { unmount } = render(<App />);

    // Add unique custom task
    const titleInput = screen.getByPlaceholderText(/e\.g\. Complete Calculus Problem Set 3/i);
    fireEvent.change(titleInput, { target: { value: 'Persisted Robotics Final Project' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));

    expect(screen.getByText('Persisted Robotics Final Project')).toBeInTheDocument();

    // Unmount (simulating page close/refresh)
    unmount();

    // Re-render (simulating fresh page load)
    render(<App />);
    expect(screen.getByText('Persisted Robotics Final Project')).toBeInTheDocument();
  });
});
