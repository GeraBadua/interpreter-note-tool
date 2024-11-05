'use client';

import Translator_es from '@/app/components/translate_es';
import Translator_en from '@/app/components/translate_en';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ title: '', content: '' });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirigir al usuario a la página de login si no hay token
    } else {
      fetchNotes(token); // Llamar a la función para obtener las notas del servidor
    }
  }, [router]);

  // Nueva función para obtener las notas del servidor
  const fetchNotes = async (token) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Incluir el token en la cabecera
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotes(data); // Establecer las notas recibidas del servidor
      } else {
        console.error('Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const saveNote = () => {
    if (currentNote.title.trim() === '' && currentNote.content.trim() === '') return;

    const newNotes = [...notes, { ...currentNote, id: Date.now() }];
    setNotes(newNotes);
    setCurrentNote({ title: '', content: '' });
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
  };

  return (
    <div className="flex min-h-screen bg-[#9c7efd] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#f5ebdf] p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-[#231373]">Saved Notes</h2>
        {notes.length === 0 ? (
          <p className="text-sm text-[#231373]">You have no saved notes yet.</p>
        ) : (
          notes.map((note) => (
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
          ))
        )}
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
      <Translator_en></Translator_en>
      <Translator_es></Translator_es>
    </div>
  );
}