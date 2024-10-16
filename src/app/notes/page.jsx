'use client'; // Este archivo es un componente del lado del cliente

import { useState } from 'react';

const Register = () => {
  const [note_title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        note_title,
        topic,
        note,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Note added successful!');
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div>
      <h1>Add Notes</h1>
      <form onSubmit={handleSubmit}>
        <input className='text-black'
          type="text"
          placeholder="Note title"
          value={note_title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <input className='text-black'
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
        <br />
        <input className='text-black'
          type="text"
          placeholder="Add your note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
        />
        <br />
        <button type="submit">Add Note</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
