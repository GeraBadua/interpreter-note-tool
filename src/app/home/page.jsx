'use client';

import Translator_es from '@/app/components/translate_es';
import Translator_en from '@/app/components/translate_en';
import Notepad from '@/app/components/notepad';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [notes, setNotes] = useState([]);
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);
  const router = useRouter();
/* 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]); */

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('translatorNotes') || '[]');
    setNotes(savedNotes);
  }, []);

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
        <button
          onClick={() => setIsNotepadOpen(true)}
          className='w-11/12 mx-auto px-4 py-2 bg-[#76a82c] text-[#01587a] rounded hover:bg-[#99d8dd] transition-colors duration-300'
        >
          New
        </button>
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
      
      <div className="flex-1 flex flex-col">
        <div className="p-4 flex justify-center">
          <button
            onClick={() => setShowEnglish(!showEnglish)}
            className="px-6 py-2 bg-white text-[#231373] rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 font-medium"
          >
            Switch to {showEnglish ? "Spanish to English" : "English to Spanish"}
          </button>
        </div>
        <Translator_en isVisible={!showEnglish} />
        <Translator_es isVisible={showEnglish} />
      </div>

      {/* Añadir el componente Notepad aquí */}
      <Notepad
        notes={notes}
        setNotes={setNotes}
        isOpen={isNotepadOpen}
        setIsOpen={setIsNotepadOpen}
      />
    </div>
  );
}