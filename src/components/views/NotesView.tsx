import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Tag, Sparkles } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

const NOTES_STORAGE_KEY = 'campus_companion_notes_v1';

const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'CS 201 Binary Trees Quick Formula',
    content: 'Max nodes at level L = 2^L. Max nodes for height H = 2^(H+1) - 1. Time complexity for balanced BST search is O(log n).',
    category: 'Computer Science',
    createdAt: new Date().toLocaleDateString(),
  },
  {
    id: 'note-2',
    title: 'Calculus Integration by Parts',
    content: 'Integral(u dv) = uv - Integral(v du). Choose u using LIATE: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential.',
    category: 'Mathematics',
    createdAt: new Date().toLocaleDateString(),
  },
];

export const NotesView: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const stored = localStorage.getItem(NOTES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTES;
  });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error(e);
    }
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category: category.trim() || 'General',
      createdAt: new Date().toLocaleDateString(),
    };

    setNotes([newNote, ...notes]);
    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-[#142B61] tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#4B55F5]" />
              <span>Student Quick Notes & Scratchpad</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Jot down lecture notes, study formulas, and quick exam reminders
            </p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#4B55F5] hover:bg-[#3D46DC] text-white text-xs font-semibold shadow-glow-primary transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Cancel' : 'New Note'}</span>
          </button>
        </div>

        {/* Note Creation Card */}
        {isAdding && (
          <form onSubmit={handleAddNote} className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 animate-fadeIn space-y-3">
            <h3 className="text-xs font-bold text-[#142B61] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#4B55F5]" />
              <span>Add Quick Study Note</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Note Title or Topic..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4B55F5]/20 focus:border-[#4B55F5]"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Category / Subject..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4B55F5]/20 focus:border-[#4B55F5]"
                />
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="Write formulas, key definitions, or lecture insights..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4B55F5]/20 focus:border-[#4B55F5]"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-200/60"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#4B55F5] hover:bg-[#3D46DC]"
              >
                Save Note
              </button>
            </div>
          </form>
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#C7D7FE] shadow-xs flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EDEBFF] text-[#5145E5]">
                    <Tag className="w-2.5 h-2.5" />
                    <span>{note.category}</span>
                  </span>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded transition-opacity"
                    aria-label="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#142B61] leading-tight mb-1.5">
                  {note.title}
                </h3>
                <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>{note.createdAt}</span>
                <span>Auto-saved</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
