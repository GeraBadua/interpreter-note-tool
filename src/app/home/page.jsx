'use client';

import Translator_es from '../components/translate_es';
import Translator_en from '../components/translate_en';
import Notepad from '../components/notepad';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [notes, setNotes] = useState([]);
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNotesLoading, setIsNotesLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchUserNotes(token);
    }
  }, [router]);

  const fetchUserNotes = async (token) => {
    try {
      setIsNotesLoading(true);
      const res = await fetch('/api/notes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setNotes(data);
      } else {
        setMessage('Failed to fetch notes.');
      }
    } catch (error) {
      console.error('Error fetching user notes:', error);
      setMessage('Failed to load notes.');
    } finally {
      setIsNotesLoading(false);
    }
  };

  const deleteNote = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage("User is not authenticated. Please log in first.");
      return;
    }

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setNotes((prevNotes) => prevNotes.filter(note => note._id !== id));
      } else {
        setMessage('Failed to delete note.');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar */}
      <div className="w-80 bg-paper border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-secondary tracking-tight">Saved Notes</h2>
          <p className="text-sm text-gray-400 mt-1">Your interpretation history</p>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          <button
            onClick={() => {
              setSelectedNote(null);
              setIsNotepadOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-xl hover:bg-green-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-semibold"
          >
            <span>+ New Note</span>
          </button>

          <div className="mt-6 space-y-3">
            {isNotesLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <svg className="animate-spin h-8 w-8 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm">Loading notes...</p>
              </div>
            ) : (
              <>
                {notes.map((note) => (
                  <div
                    key={note._id}
                    onClick={() => {
                      setSelectedNote(note);
                      setIsNotepadOpen(true);
                    }}
                    className="group p-4 bg-gray-50 hover:bg-white border boundary-transparent hover:border-primary/20 rounded-xl transition-all hover:shadow-md cursor-pointer relative"
                  >
                    <h3 className="font-bold text-secondary mb-1 truncate pr-6">{note.note_title}</h3>
                    <p className="text-sm text-gray-500 truncate font-mono bg-white/50 p-1 rounded">{note.note}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNote(note._id); }}
                      className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
                      title="Delete Note"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                {notes.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>No notes yet.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header Bar */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 p-4 sticky top-0 z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            <a href="/context_tool" className="px-4 py-2 text-sm font-medium text-secondary bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              Context Tool
            </a>
            <a href="/dictionary_page" className="px-4 py-2 text-sm font-medium text-secondary bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              Dictionary
            </a>
          </div>

          <div className="bg-gray-100 p-1 rounded-full inline-flex relative">
            <button
              onClick={() => setShowEnglish(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!showEnglish ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Spanish → English
            </button>
            <button
              onClick={() => setShowEnglish(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${showEnglish ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              English → Spanish
            </button>
          </div>
        </div>

        {/* Translation Area */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto flex items-start justify-center bg-gray-50/50">
          <div className="w-full max-w-4xl">
            <Translator_en isVisible={!showEnglish} />
            <Translator_es isVisible={showEnglish} />
          </div>
        </div>
      </div>

      {/* Añadir el componente Notepad aquí */}
      <Notepad
        notes={notes}
        setNotes={setNotes}
        isOpen={isNotepadOpen}
        setIsOpen={setIsNotepadOpen}
        selectedNote={selectedNote}
      />
      {message && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg animate-fade-in-up" role="alert">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
