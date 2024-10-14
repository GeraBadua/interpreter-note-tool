import { useState, useEffect } from 'react';

const UserNotes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('token');  // Obtener el token

      const res = await fetch('/api/notes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Incluye el token JWT en el header
        },
      });

      const data = await res.json();
      if (res.ok) {
        setNotes(data);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div>
      <h1>Your Notes</h1>
      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            <h2>{note.note_title}</h2>
            <p>{note.topic}</p>
            <p>{note.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserNotes;
