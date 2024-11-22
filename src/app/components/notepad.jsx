'use client';

import { useState, useEffect } from 'react';

export default function Notepad({ notes, setNotes, isOpen, setIsOpen }) {
  const [currentNote, setCurrentNote] = useState({ title: '', topic: '', content: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const saveNote = async () => {
    if (!currentNote.title.trim() || !currentNote.content.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage("Token not found.");
      return;
    }

    try {
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
        setCurrentNote({ title: '', topic: '', content: '' });
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#f5ebdf] rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-[#231373]">Translator&apos;s Notepad</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          <input
            type="text"
            placeholder="Note Title"
            value={currentNote.title}
            onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
            className="w-full p-2 mb-4 bg-white text-black rounded border border-gray-300"
          />
          <input
            type="text"
            placeholder="Topic"
            value={currentNote.topic}
            onChange={(e) => setCurrentNote({ ...currentNote, topic: e.target.value })}
            className="w-full p-2 mb-4 bg-white text-black rounded border border-gray-300"
          />
          <textarea
            placeholder="Your notes here..."
            value={currentNote.content}
            onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
            className="w-full h-64 p-2 mb-4 bg-white text-black rounded border border-gray-300 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              onClick={saveNote}
              className="px-4 py-2 bg-[#76a82c] text-[#01587a] rounded hover:bg-[#99d8dd] transition-colors duration-300"
            >
              Save Note
            </button>
          </div>
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
      </div>
    </div>
  );
}
