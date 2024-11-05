// components/adminteam.jsx
"use client"
import { useState } from 'react';

const AdminTeam = ({ adminPublicUUID }) => {
  const [interpreterUUID, setInterpreterUUID] = useState('');
  const [message, setMessage] = useState('');

  const handleAddMember = async () => {
    if (!interpreterUUID) {
      setMessage('Please enter a valid interpreter public UUID.');
      return;
    }

    try {
      const response = await fetch('/api/adminteam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminPublicUUID,
          interpreterPublicUUID: interpreterUUID,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Interpreter added to team successfully');
        setInterpreterUUID(''); // Clear the input field
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Add Interpreter to Team</h2>
      <input
        type="text"
        placeholder="Interpreter Public UUID"
        value={interpreterUUID}
        onChange={(e) => setInterpreterUUID(e.target.value)}
      />
      <button onClick={handleAddMember}>Add to Team</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminTeam;
