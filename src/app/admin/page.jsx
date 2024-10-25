'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import navigation hook

export default function AdminPage() {
  const [members, setMembers] = useState([]); // Store team members
  const [teamRequests, setTeamRequests] = useState([]); // Store team requests
  const [activeSection, setActiveSection] = useState('members'); // Track which section is active
  const [selectedMember, setSelectedMember] = useState(null); // Track selected member

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect if not logged in
    }
    // Fetch members and requests when the component mounts
    fetchMembers(); // BACKEND: Implement endpoint to fetch members
    fetchTeamRequests(); // BACKEND: Implement endpoint to fetch team requests
  }, [router]);

  const fetchMembers = async () => {
    // BACKEND: Call API to get the list of team members
    const response = await fetch('/api/members');
    const data = await response.json();
    setMembers(data); // Set members from backend
  };

  const fetchTeamRequests = async () => {
    // BACKEND: Call API to get the list of team requests
    const response = await fetch('/api/team-requests');
    const data = await response.json();
    setTeamRequests(data); // Set requests from backend
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member); // Display selected member's details
  };

  const acceptRequest = async (requestId) => {
    // BACKEND: Implement API to accept a team request
    await fetch(`/api/team-requests/${requestId}`, { method: 'POST' });
    fetchTeamRequests(); // Refresh requests
    fetchMembers(); // Refresh members
  };

  const rejectRequest = async (requestId) => {
    // BACKEND: Implement API to reject a team request
    await fetch(`/api/team-requests/${requestId}`, { method: 'DELETE' });
    fetchTeamRequests(); // Refresh requests
  };

  const changeRole = async (memberId, newRole) => {
    // BACKEND: Implement API to change member role
    await fetch(`/api/members/${memberId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role: newRole }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchMembers(); // Refresh members
  };

  const removeMember = async (memberId) => {
    // BACKEND: Implement API to remove member
    await fetch(`/api/members/${memberId}`, { method: 'DELETE' });
    fetchMembers(); // Refresh members
  };

  return (
    <div className="flex min-h-screen bg-[#9c7efd] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#f5ebdf] p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-[#231373]">Admin ID: {/** BACKEND: Display admin ID from backend */}</h2>
        
        <div className="mb-4">
          <button onClick={() => setActiveSection('members')} className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">View Members</button>
        </div>
        
        <div className="mb-4">
          <button onClick={() => setActiveSection('requests')} className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Team Requests</button>
        </div>
        
        <div className="mb-4">
          <button onClick={() => setActiveSection('settings')} className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Settings</button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {activeSection === 'members' && (
          <>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Team Members</h2>
            {members.map((member) => (
              <div key={member.id} className="p-4 bg-white rounded shadow mb-2" onClick={() => handleMemberClick(member)}>
                <h3 className="font-bold text-blue-800">{member.name} ({member.status})</h3>
                {selectedMember && selectedMember.id === member.id && (
                  <div className="mt-2">
                    <div className="mb-2 bg-gray-200 p-2 rounded">
                      <h4 className="font-semibold">Profile</h4>
                      <p>ID: {selectedMember.id}</p>
                      <p>Role: {selectedMember.role}</p>
                      <button onClick={() => changeRole(member.id, selectedMember.role === 'admin' ? 'interpreter' : 'admin')} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                        Change to {selectedMember.role === 'admin' ? 'Interpreter' : 'Admin'}
                      </button>
                      <button onClick={() => removeMember(member.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2">
                        Remove
                      </button>
                    </div>
                    <div className="mb-2">
                      <h4 className="font-semibold">Notes</h4>
                      {selectedMember.notes.map((note) => (
                        <div key={note.id} className="mb-1">
                          <strong>{note.title}</strong> - <span>{note.date}</span>
                          <p className="bg-gray-100 p-2 rounded">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* Team Requests Section */}
        {activeSection === 'requests' && (
          <>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Team Requests</h2>
            {teamRequests.length > 0 ? (
              teamRequests.map((request) => (
                <div key={request.id} className="p-4 bg-white rounded shadow mb-2">
                  <h3 className="font-bold text-blue-800">{request.name}</h3>
                  <p className="text-blue-800">Requested on: {request.date}</p>
                  <div className="mt-2">
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                      onClick={() => acceptRequest(request.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => rejectRequest(request.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-blue-800">No pending requests</p>
            )}
          </>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Settings</h2>
            <p className="text-blue-800">Settings options will be here.</p>
            {/* BACKEND: Implement settings options as needed */}
          </div>
        )}
      </div>
    </div>
  );
}
