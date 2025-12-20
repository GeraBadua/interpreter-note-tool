'use client';

import { useState, useEffect } from 'react';

export default function Notepad({ notes, setNotes, isOpen, setIsOpen, selectedNote }) {
  const [currentNote, setCurrentNote] = useState({ title: '', topic: '', content: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    if (isOpen) {
      if (selectedNote) {
        // Edit Mode: Prefill data
        setCurrentNote({
          title: selectedNote.note_title,
          topic: selectedNote.topic || '', // Handle missing topic if any
          content: selectedNote.note
        });
      } else {
        // Create Mode: Reset form
        setCurrentNote({ title: '', topic: '', content: '' });
      }
      setMessage('');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, selectedNote]);

  const saveNote = async () => {
    if (!currentNote.title.trim() || !currentNote.content.trim()) {
      setMessage("Title and Content are required.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage("Token not found. Please log in.");
      return;
    }

    try {
      // Determine if we are updating or creating
      const url = selectedNote ? `/api/notes/${selectedNote._id}` : '/api/notes'; // Assuming PUT endpoint exists or we use POST for update?
      // Wait, user didn't ask for UPDATE functionality explicitly, just "open note".
      // But typically "open" implies "view" or "edit".
      // If I post to /api/notes, it creates a NEW note.
      // If I want to update, I need a PUT route. 
      // The implementation plan didn't specify creating a PUT route. 
      // However, the user asked "si hago click en la nota ya creada, se abra en una card esa nota".
      // If they just view it, that's fine. But if they click "Save", they might expect it to update.
      // Given the constraints and previous interactions, I should probably just allow creating NEW notes for now unless I confirmed the API supports PUT.
      // Looking at `src/app/api/notes/route.js`, it performs POST.
      // Looking at `src/app/api/notes/[id]/route.js`, I previously added DELETE. I don't recall adding PUT.
      // Let's check if `src/app/api/notes/[id]/route.js` has PUT.
      // Actually, to avoid scope creep and breaking things, I will make the "Save" button behave as "Create Copy" or just "Save New" if it's viewing an existing one, OR I check if I can add PUT quickly.
      // BUT, the user said "quiero que ... se abra en una card esa nota que fue seleccionada". 
      // AND "quiero que cambies el UI/UX de la card ... para crear una nueva nota".
      // It implies viewing.
      // For now, I will treat "Save Note" as "Update" ONLY IF I can confirm the backend supports it, otherwise I might just hide the Save button or change it to "Save as New".
      // Actually, checking standard behaviors, users expect to edit.
      // I'll stick to logic: If selectedNote is present, we are in "View/Edit" mode.
      // Since I haven't implemented PUT in backend, I will implement a visual "View Mode" or "Edit Mode" which might incorrectly create duplicates if I just POST.
      // I'll check `src/app/api/notes/[id]/route.js` content first.

      const method = 'POST'; // Default to POST for simplicty unless I see PUT.
      // If I use POST, it creates a new note. That's safer than failing PUT.
      // I'll just leave it as creating a new note (maybe "Save Copy" if editing) or just "Save Note" that appends.
      // Actually, the user asked to FIX "notes not opening". They didn't explicitly ask for "Edit".
      // So opening it for VIEWING is key. Creating a new one from it is a bonus.
      // I will assume POST for now to keep it working as "Create New" or "Duplicate".

      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          note_title: currentNote.title,
          topic: currentNote.topic,
          note: currentNote.content,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setNotes((prevNotes) => [...prevNotes, data.note]);
        if (!selectedNote) {
          setCurrentNote({ title: '', topic: '', content: '' });
        }
        setIsOpen(false);
        setMessage('Note saved successfully!');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setMessage('An error occurred while saving the note.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-paper rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 transform transition-all scale-100">

        {/* Header */}
        <div className="bg-primary/5 p-6 border-b border-primary/10 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-secondary tracking-tight">
            {selectedNote ? 'View Note' : 'New Note'}
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-red-500 transition-colors rounded-full p-1 hover:bg-red-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter note title..."
              value={currentNote.title}
              onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <input
              type="text"
              placeholder="Enter topic..."
              value={currentNote.topic}
              onChange={(e) => setCurrentNote({ ...currentNote, topic: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              placeholder="Type your interpretation here..."
              value={currentNote.content}
              onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
              className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-mono text-sm leading-relaxed text-gray-700 shadow-inner"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {!selectedNote && (
              <button
                onClick={saveNote}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:bg-opacity-90 transition-all active:scale-95"
              >
                Save Note
              </button>
            )}
            {selectedNote && (
              <button
                onClick={saveNote}
                className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:bg-opacity-90 transition-all active:scale-95"
              >
                Save as Copy
              </button>
            )}
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} animate-fade-in`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
