'use client';

import { useState, useEffect } from 'react';

const NoteApp = () => {
  const [noteTitle, setNoteTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [createdNote, setCreatedNote] = useState(null); // Para almacenar y mostrar la nota creada
  const [message, setMessage] = useState('');
  const [userNotes, setUserNotes] = useState([]); // Estado para las notas del usuario

  useEffect(() => {
    fetchUserNotes(); // Llamar a la función para obtener las notas del usuario cuando se cargue la página
  }, []);

  const fetchUserNotes = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage("User is not authenticated. Please log in first.");
      return;
    }

    try {
      const res = await fetch('/api/notes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Incluir el token en la cabecera
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUserNotes(data); // Guardar las notas del usuario en el estado
      } else {
        setMessage('Failed to fetch notes.');
      }
    } catch (error) {
      console.error('Error fetching user notes:', error);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Obtener el token desde localStorage

    if (!token) {
      setMessage("User is not authenticated. Please log in first.");
      return;
    }

    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Incluir el token en la cabecera
      },
      body: JSON.stringify({
        note_title: noteTitle,
        topic: topic,
        note: noteContent,
        token: token,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Note created successfully!');
      setCreatedNote(data.note); // Guardar la nota creada para mostrarla
      fetchUserNotes(); // Actualizar la lista de notas del usuario
      // Limpiar el formulario
      setNoteTitle('');
      setTopic('');
      setNoteContent('');
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Create a New Note</h1>
        <form onSubmit={handleCreateNote}>
          <input
            type="text"
            placeholder="Note Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="w-full p-2 mb-4 border rounded text-gray-800"
            required
          />
          <input
            type="text"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 mb-4 border rounded text-gray-800"
            required
          />
          <textarea
            placeholder="Write your note here..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="w-full p-2 mb-4 border rounded text-gray-800 h-32 resize-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Create Note
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </div>

      {/* Mostrar las notas del usuario */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800">Your Notes:</h2>
        {userNotes.length === 0 ? (
          <p className="text-gray-600">You have no saved notes yet.</p>
        ) : (
          userNotes.map((note) => (
            <div key={note._id} className="mt-4 p-2 border-b">
              <h3 className="font-semibold text-blue-600">{note.note_title}</h3>
              <p className="text-gray-600"><strong>Topic:</strong> {note.topic}</p>
              <p className="text-gray-800">{note.note}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoteApp;
