import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';

describe('Campus Companion Redesigned Dashboard', () => {
  it('renders three-column layout elements (Sidebar, Main Dashboard, Right Panel widgets)', () => {
    render(<App />);

    // Sidebar Branding & Navigation
    expect(screen.getByText('Your Student Productivity Hub')).toBeInTheDocument();
    expect(screen.getByText('Small Steps, Big Progress')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /My Tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Calendar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subjects/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Progress/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Notes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reminders/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Settings/i })).toBeInTheDocument();

    // Topbar Search and Profile
    expect(screen.getByPlaceholderText(/Search tasks, subjects, or anything/i)).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();

    // 4 Summary Cards
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
    expect(screen.getByText('Productivity Streak')).toBeInTheDocument();

    // Right Panel: Today's Focus and Motivation
    expect(screen.getByText("Today's Focus")).toBeInTheDocument();
    expect(screen.getByText('"Discipline today creates opportunities tomorrow."')).toBeInTheDocument();
  });

  it('filters task list using the global search bar in Topbar', () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText(/Search tasks, subjects, or anything/i);
    fireEvent.change(searchInput, { target: { value: 'Calculus' } });

    // Should find Calculus task
    expect(screen.getByText(/Read Calculus Chapter 5/i)).toBeInTheDocument();
  });

  it('navigates to Subjects view and displays course cards', () => {
    render(<App />);

    const subjectsNav = screen.getByRole('button', { name: /Subjects/i });
    fireEvent.click(subjectsNav);

    expect(screen.getByText('Enrolled Subjects & Courses')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
  });

  it('navigates to Progress view and displays analytics', () => {
    render(<App />);

    const progressNav = screen.getByRole('button', { name: /Progress/i });
    fireEvent.click(progressNav);

    expect(screen.getByText('Academic Productivity Analytics')).toBeInTheDocument();
    expect(screen.getByText('Overall Completion')).toBeInTheDocument();
  });

  it('navigates to Notes view and allows creating a study note', () => {
    render(<App />);

    const notesNav = screen.getByRole('button', { name: /Notes/i });
    fireEvent.click(notesNav);

    expect(screen.getByText(/Student Quick Notes/i)).toBeInTheDocument();

    const newNoteBtn = screen.getByRole('button', { name: /New Note/i });
    fireEvent.click(newNoteBtn);

    const titleInput = screen.getByPlaceholderText(/Note Title or Topic/i);
    fireEvent.change(titleInput, { target: { value: 'Exam Prep Summary' } });

    const saveBtn = screen.getByRole('button', { name: /Save Note/i });
    fireEvent.click(saveBtn);

    expect(screen.getByText('Exam Prep Summary')).toBeInTheDocument();
  });

  it('navigates to Reminders view and shows deadline radar', () => {
    render(<App />);

    const remindersNav = screen.getByRole('button', { name: /Reminders/i });
    fireEvent.click(remindersNav);

    expect(screen.getByText(/Deadlines & Urgent Reminders/i)).toBeInTheDocument();
  });

  it('navigates to Settings view and shows data management options', () => {
    render(<App />);

    const settingsNav = screen.getByRole('button', { name: /Settings/i });
    fireEvent.click(settingsNav);

    expect(screen.getByText('Preferences & Data Management')).toBeInTheDocument();
    expect(screen.getByText('Reset to Seeded Sample Tasks')).toBeInTheDocument();
    expect(screen.getByText('Export Task Backup (JSON)')).toBeInTheDocument();
  });
});

