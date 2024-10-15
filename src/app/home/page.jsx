'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importar el hook de navegación


export default function HomePage() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ title: '', content: '' });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirigir al usuario a la página de login si no hay token
    }
  }, [router]);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('translatorNotes') || '[]');
    setNotes(savedNotes);
  }, []);

  const saveNote = () => {
    if (currentNote.title.trim() === '' && currentNote.content.trim() === '') return;

    const newNotes = [...notes, { ...currentNote, id: Date.now() }];
    setNotes(newNotes);
    localStorage.setItem('translatorNotes', JSON.stringify(newNotes));
    setCurrentNote({ title: '', content: '' });
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('translatorNotes', JSON.stringify(updatedNotes));
  };

  return (
    <div className="flex min-h-screen bg-[#9c7efd] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#f5ebdf] p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-[#231373]">Saved Notes</h2>
        {notes.map((note) => (
          <div key={note.id} className="mb-2 p-2 bg-[#231373] rounded">
            <h3 className="font-bold text-[#9c7efd]">{note.title}</h3>
            <p className="text-sm text-[#e1e8ec] truncate">{note.content}</p>
            <button 
              onClick={() => deleteNote(note.id)}
              className="mt-1 text-xs text-[#76a82c] hover:text-[#f3ba00]"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#231373]">Translator's Notepad</h1>
        <input
          type="text"
          placeholder="Note Title"
          value={currentNote.title}
          onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
          className="w-full p-2 mb-4 bg-[#f5ebdf] text-black rounded"
        />
        <textarea
          placeholder="Your notes here..."
          value={currentNote.content}
          onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
          className="w-full h-64 p-2 mb-4 bg-[#f5ebdf] text-black rounded resize-none"
        />
        <button
          onClick={saveNote}
          className="px-4 py-2 bg-[#76a82c] text-[#01587a] rounded hover:bg-[#99d8dd] transition-colors duration-300"
        >
          Save Note
        </button>
      </div>
    </div>
  );
}
