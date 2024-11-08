"use client";
import { useState } from "react";

const AdminTeam = ({ adminPublicUUID }) => {
  const [interpreterUUID, setInterpreterUUID] = useState("");
  const [message, setMessage] = useState("");

  const handleAddMember = async () => {
    if (!interpreterUUID) {
      setMessage("Please enter a valid interpreter public UUID.");
      return;
    }

    try {
      const response = await fetch("/api/adminteam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminPublicUUID,
          interpreterPublicUUID: interpreterUUID,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Interpreter added to team successfully");
        setInterpreterUUID(""); // Clear the input field
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#e1f5fe] to-[#81d4fa]">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#00796b] mb-6">Add Interpreter to Team</h2>
        <input
          type="text"
          placeholder="Interpreter Public UUID"
          value={interpreterUUID}
          onChange={(e) => setInterpreterUUID(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:border-[#00796b] focus:outline-none transition duration-200"
        />
        <button
          onClick={handleAddMember}
          className="w-full bg-[#00796b] text-white py-2 rounded-lg font-bold hover:bg-[#004d40] transition duration-200"
        >
          Add to Team
        </button>
        {message && (
          <p
            className={`mt-4 p-3 rounded-lg text-center ${
              message.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminTeam;
