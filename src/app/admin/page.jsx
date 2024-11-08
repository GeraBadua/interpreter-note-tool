'use client';

import { useState, useEffect, useRef } from 'react';
import { FaAngleLeft } from 'react-icons/fa';
import { FcBusinessman } from 'react-icons/fc';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [interpreterID, setInterpreterID] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [notesVisible, setNotesVisible] = useState(null);
  const [notifications, setNotifications] = useState([]);

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

  const [joinRequests, setJoinRequests] = useState([
    { id: 1, name: "Interpreter C", requestDate: "2024-10-22", accepted: null, detailsVisible: false, email: "c@example.com", joinedDate: "2024-10-21" },
    { id: 2, name: "Interpreter D", requestDate: "2024-10-23", accepted: null, detailsVisible: false, email: "d@example.com", joinedDate: "2024-10-20" },
  ]);

  useEffect(() => {
    const notificationTimeout = setTimeout(() => {
      if (teams[0].members.length > 2) {
        setNotifications((prev) => [
          ...prev,
          `New member ${teams[0].members[teams[0].members.length - 1].name} joined Team Alpha.`,
        ]);
      }
    }, 5000); 

    return () => clearTimeout(notificationTimeout);
  }, [teams]);

  const handleInviteInterpreter = (e) => {
    e.preventDefault();
    if (interpreterID.trim()) {
      const foundInterpreter = { id: interpreterID, name: `Interpreter ${interpreterID}`, joinedDate: new Date().toISOString().split('T')[0], notes: [] };
      const updatedTeams = teams.map((team) => {
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

  const toggleRequestDetails = (id) => {
    setJoinRequests(joinRequests.map((req) => (req.id === id ? { ...req, detailsVisible: !req.detailsVisible } : req)));
  };

  const handleRequestResponse = (id, accept) => {
    setJoinRequests(joinRequests.map((req) => (req.id === id ? { ...req, accepted: accept, detailsVisible: false } : req)));
  };

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (newTeamName.trim()) {
      const newTeam = { id: teams.length + 1, name: newTeamName, members: [] };
      setTeams([...teams, newTeam]);
      setNewTeamName('');
    }
  };

  const toggleNotesVisibility = (memberId) => {
    setNotesVisible(notesVisible === memberId ? null : memberId);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#cdc4fd] to-[#e1e8fc]">
      {/* Sidebar */}
      <div className="w-64 bg-white bg-opacity-90 p-4 rounded-r-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-[#231373]">Admin Dashboard</h2>
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center w-full text-left py-2 px-4 mb-2 rounded transition duration-200 ${
            activeTab === 'inbox' ? 'bg-[#231373] text-white' : 'hover:bg-[#f5f5f5] text-[#231373]'
          }`}
        >
          Inbox
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`flex items-center w-full text-left py-2 px-4 mb-2 rounded transition duration-200 ${
            activeTab === 'teams' ? 'bg-[#231373] text-white' : 'hover:bg-[#f5f5f5] text-[#231373]'
          }`}
        >
          Teams
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 space-y-8">
        {activeTab === 'inbox' && (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-[#231373]">Interpreter Join Requests</h1>
            <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-md">
              {joinRequests.length === 0 ? (
                <p className="text-gray-600">No join requests at the moment.</p>
              ) : (
                joinRequests.map((request) => (
                  <div key={request.id} className="mb-4">
                    <div
                      className={`p-4 rounded cursor-pointer transition duration-200 ${
                        request.accepted === null
                          ? 'bg-[#231373] text-white hover:bg-[#1c125c]'
                          : request.accepted
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                      onClick={() => toggleRequestDetails(request.id)}
                    >
                      <FcBusinessman className="inline-block mr-2" />
                      <span className="font-bold">{request.name}</span>
                      <p className="text-sm">Requested on: {request.requestDate}</p>
                    </div>
                    {request.detailsVisible && (
                      <div className="mt-3 p-3 bg-white rounded shadow">
                        <p className="text-lg font-semibold text-gray-800">Interpreter Information:</p>
                        <p className="text-gray-600">Email: {request.email}</p>
                        <p className="text-gray-600">Joined Date: {request.joinedDate}</p>
                        <div className="mt-2">
                          <button
                            className="mr-2 bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
                            onClick={() => handleRequestResponse(request.id, true)}
                          >
                            Accept
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                            onClick={() => handleRequestResponse(request.id, false)}
                          >
                            Deny
                          </button>
                        </div>
                      </div>
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
              <div>
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="mb-4 p-4 bg-[#231373] text-white rounded-lg cursor-pointer hover:bg-[#1c125c] transition duration-200"
                    onClick={() => setSelectedTeam(team)}
                  >
                    <h3 className="font-bold text-lg">{team.name}</h3>
                    <p className="text-sm">Members: {team.members.length}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="flex items-center text-[#76a82c] hover:text-[#4f6708] mb-4"
                >
                  <FaAngleLeft className="mr-2" /> Back to Teams
                </button>
                <h2 className="text-2xl font-bold mb-6 text-[#231373]">{selectedTeam.name}</h2>
                <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow-md space-y-4">
                  {selectedTeam.members.length === 0 ? (
                    <p className="text-gray-600">No members in this team.</p>
                  ) : (
                    selectedTeam.members.map((member) => (
                      <div key={member.id} className="mb-4">
                        <div
                          className="p-3 rounded cursor-pointer bg-[#231373] text-white hover:bg-[#1c125c] transition duration-200"
                          onClick={() => toggleNotesVisibility(member.id)}
                        >
                          <span className="font-bold">{member.name}</span>
                          <p className="text-sm">Joined Date: {member.joinedDate}</p>
                        </div>
                        {notesVisible === member.id && (
                          <div className="mt-3 p-3 bg-white rounded shadow">
                            <p className="text-lg font-semibold text-gray-800">Notes:</p>
                            {member.notes.map((note, index) => (
                              <p key={index} className="text-gray-600">
                                {note.content} - {note.date} at {note.time}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Invite Interpreter Form */}
                <form onSubmit={handleInviteInterpreter} className="mt-6 space-y-4">
                  <label className="text-[#231373] font-semibold">
                    Invite Interpreter:
                    <input
                      type="text"
                      placeholder="Enter Interpreter ID"
                      value={interpreterID}
                      onChange={(e) => setInterpreterID(e.target.value)}
                      className="ml-2 p-2 border rounded-lg text-gray-600 focus:border-[#231373] outline-none"
                    />
                  </label>
                  <button
                    type="submit"
                    className="bg-[#231373] hover:bg-[#1c125c] text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Send Invite
                  </button>
                  {inviteMessage && <p className="text-sm text-gray-600">{inviteMessage}</p>}
                </form>

                {/* New Team Form */}
                <form onSubmit={handleCreateTeam} className="mt-8 space-y-4">
                  <label className="text-[#231373] font-semibold">
                    Create New Team:
                    <input
                      type="text"
                      placeholder="Enter Team Name"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="ml-2 p-2 border rounded-lg text-gray-600 focus:border-[#231373] outline-none"
                    />
                  </label>
                  <button
                    type="submit"
                    className="bg-[#76a82c] hover:bg-[#4f6708] text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Create Team
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Notifications */}
        <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-[#231373] mb-2">Notifications</h3>
          <ul className="list-disc ml-6 space-y-1">
            {notifications.map((notification, index) => (
              <li key={index} className="text-gray-600">{notification}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
