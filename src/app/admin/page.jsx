'use client';

import { useState } from 'react';
import { FaAngleLeft } from 'react-icons/fa6';
import { FcBusinessman } from 'react-icons/fc';
import React, { useEffect } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [interpreterID, setInterpreterID] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [notesVisible, setNotesVisible] = useState(null);

  // Sample notes for interpreters
  const sampleNotes = [
    { content: "Note 1: Review the guidelines.", date: "2024-10-24", time: "10:00 AM" },
    { content: "Note 2: Prepare for the upcoming session.", date: "2024-10-25", time: "11:00 AM" },
  ];

  const [teams, setTeams] = useState([
    {
      id: 1,
      name: "Team Alpha",
      members: [
        { id: 1, name: "Interpreter A", joinedDate: "2024-10-20", notes: sampleNotes },
        { id: 2, name: "Interpreter B", joinedDate: "2024-10-21", notes: sampleNotes },
      ],
    },
    { id: 2, name: "Team Beta", members: [] },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || localStorage.getItem('role') !== 'Admin') {
      router.push('/home'); // Redirect if not logged in
    }
   else {
    // fetchMembers(); // BACKEND: Implement endpoint to fetch members0
}}, []);


  const [joinRequests, setJoinRequests] = useState([
    { id: 1, name: "Interpreter C", requestDate: "2024-10-22", accepted: null, detailsVisible: false, email: "c@example.com", joinedDate: "2024-10-21" },
    { id: 2, name: "Interpreter D", requestDate: "2024-10-23", accepted: null, detailsVisible: false, email: "d@example.com", joinedDate: "2024-10-20" },
  ]);

  // Handler to invite an interpreter by ID
  const handleInviteInterpreter = (e) => {
    e.preventDefault();
    if (interpreterID.trim()) {
      const foundInterpreter = { id: interpreterID, name: `Interpreter ${interpreterID}`, joinedDate: new Date().toISOString().split('T')[0], notes: [] };

      const updatedTeams = teams.map(team => {
        if (team.id === selectedTeam.id) {
          return {
            ...team,
            members: [...team.members, foundInterpreter],
          };
        }
        return team;
      });

      setTeams(updatedTeams);
      setInviteMessage('Team invite sent. Awaiting interpreter’s response.');
      setInterpreterID('');
    } else {
      setInviteMessage('Please enter a valid interpreter ID.');
    }
  };

  // Toggle request details visibility
  const toggleRequestDetails = (id) => {
    setJoinRequests(joinRequests.map(req => 
      req.id === id ? { ...req, detailsVisible: !req.detailsVisible } : req
    ));
  };

  // Accept or deny a join request
  const handleRequestResponse = (id, accept) => {
    setJoinRequests(joinRequests.map(req => {
      if (req.id === id) {
        return { ...req, accepted: accept, detailsVisible: false };
      }
      return req;
    }));
  };

  // Create a new team
  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (newTeamName.trim()) {
      const newTeam = {
        id: teams.length + 1,
        name: newTeamName,
        members: [],
      };
      setTeams([...teams, newTeam]);
      setNewTeamName('');
    }
  };

  // Toggle notes visibility
  const toggleNotesVisibility = (memberId) => {
    setNotesVisible(notesVisible === memberId ? null : memberId);
  };

  return (
    <div className="flex min-h-screen bg-[url('">
      {/* Sidebar */}
      <div className="w-64 bg-white bg-opacity-90 p-4 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-[#231373]">Admin Dashboard</h2>
        <button onClick={() => setActiveTab('inbox')} className={`w-full text-left mb-2 ${activeTab === 'inbox' ? 'text-[#76a82c]' : 'text-[#231373]'}`}>
          Inbox
        </button>
        <button onClick={() => setActiveTab('teams')} className={`w-full text-left mb-2 ${activeTab === 'teams' ? 'text-[#76a82c]' : 'text-[#231373]'}`}>
          Teams
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {activeTab === 'inbox' && (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-[#231373]">Interpreter Join Requests</h1>
            <div className="bg-white bg-opacity-90 rounded p-4 shadow-lg">
              {joinRequests.length === 0 ? (
                <p>No join requests at the moment.</p>
              ) : (
                joinRequests.map((request) => (
                  <div key={request.id} className="mb-2">
                    <div 
                      className={`p-2 bg-[#231373] rounded cursor-pointer text-white ${request.accepted === null ? '' : request.accepted ? 'bg-green-500' : 'bg-red-500'}`} 
                      onClick={() => toggleRequestDetails(request.id)}
                    >
                      <FcBusinessman className="inline-block mr-2" />
                      <h3 className="font-bold text-[#9c7efd]">{request.name}</h3>
                      <p className="text-[#e1e8ec]">Requested on: {request.requestDate}</p>
                    </div>
                    {request.detailsVisible && (
                      <div className="mt-2 p-2 bg-white bg-opacity-90 rounded shadow-md">
                      <p className="text-lg font-semibold text-black">Interpreter Information:</p>
                      <p className="text-black">Email: {request.email}</p>
                      <p className="text-black">Joined Date: {request.joinedDate}</p>
                      <button 
                        className="mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                        onClick={() => handleRequestResponse(request.id, true)}
                      >
                        Accept
                      </button>
                      <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        onClick={() => handleRequestResponse(request.id, false)}
                      >
                        Deny
                      </button>
                    </div>
                    )}
                    {request.accepted === true && (
                      <p className="mt-2 text-green-500">Request Accepted!</p>
                    )}
                    {request.accepted === false && (
                      <p className="mt-2 text-red-500">Request Denied.</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-[#231373]">Teams</h1>
            {!selectedTeam ? (
              // Display list of teams
              <div>
                {teams.map((team) => (
                  <div key={team.id} className="mb-2 p-2 bg-[#231373] rounded cursor-pointer" onClick={() => setSelectedTeam(team)}>
                    <h3 className="font-bold text-[#9c7efd]">
                      {team.name} <span className="text-sm text-white"> (ID: {team.id})</span>
                    </h3>
                    <p className="text-[#e1e8ec]">Members: {team.members.length}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <button onClick={() => setSelectedTeam(null)} className="flex items-center text-[#76a82c] hover:text-[#f3ba00] mb-4">
                  <FaAngleLeft className="mr-2" /> Back to Teams
                </button>
                <h2 className="text-2xl font-bold mb-4 text-[#231373]">{selectedTeam.name} Members</h2>
                {selectedTeam.members.length === 0 ? (
                  <p>No members in this team.</p>
                ) : (
                  selectedTeam.members.map((member) => (
                    <div key={member.id} className="mb-2 p-2 bg-[#e8e8e8] rounded">
                      <h4 className="font-bold text-[#231373]">{member.name}</h4>
                      <p className="text-gray-600">Joined on: {member.joinedDate}</p>
                      <button onClick={() => toggleNotesVisibility(member.id)} className="mt-2 text-blue-500 hover:underline">
                        {notesVisible === member.id ? 'Hide Notes' : 'Show Notes'}
                      </button>
                      {notesVisible === member.id && (
                        <div className="mt-2">
                          {member.notes.map((note, index) => (
                            <div key={index} className="border border-gray-300 p-2 rounded mb-1">
                              <p style={{ color: 'black' }}>{note.content}</p>
                              <p className="text-xs text-gray-500">{note.date} at {note.time}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
                <form onSubmit={handleInviteInterpreter} className="mt-4">
                  <input 
                    type="text" 
                    value={interpreterID} 
                    onChange={(e) => setInterpreterID(e.target.value)} 
                    placeholder="Interpreter ID" 
                    className="p-2 border border-gray-400 rounded w-full"
                  />
                  <button type="submit" className="mt-2 bg-[#76a82c] text-white font-bold py-2 px-4 rounded">Invite Interpreter</button>
                  {inviteMessage && <p className="mt-2">{inviteMessage}</p>}
                </form>
              </div>
            )}
            <form onSubmit={handleCreateTeam} className="mt-4">
              <input 
                type="text" 
                value={newTeamName} 
                onChange={(e) => setNewTeamName(e.target.value)} 
                placeholder="New Team Name" 
                className="p-2 border border-gray-400 rounded w-full"
              />
              <button type="submit" className="mt-2 bg-[#76a82c] text-white font-bold py-2 px-4 rounded">Create Team</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
