"use client";

import { useState } from "react";
import { MdEmail, MdLock, MdSecurity, MdDevices } from "react-icons/md";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: "Alonso Corona",
    email: "alonsocorona093@gmail.com",
    password: "********",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="bg-gray-800 shadow-lg rounded-lg w-full max-w-4xl p-6">
        {/* Header */}
        <div className="border-b border-gray-700 pb-4 mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-gray-400">Preferred name</p>
          <h2 className="text-lg">{userData.name}</h2>
        </div>

        {/* Account Security */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Account Security</h2>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-400">Email</p>
              <p>{userData.email}</p>
            </div>
            <button className="text-sm text-blue-500">Change email</button>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-400">Password</p>
              <p>{userData.password}</p>
            </div>
            <button className="text-sm text-blue-500">Set password</button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">2-step verification</p>
              <p className="text-sm text-gray-500">Add an additional layer of security.</p>
            </div>
            <button className="text-sm text-blue-500">Add verification method</button>
          </div>
        </div>

        {/* Support */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Support</h2>
          <div className="flex justify-between items-center mb-4">
            <p>Support access</p>
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-blue-500 mr-2" />
              <span className="text-sm text-gray-400">Allow</span>
            </label>
          </div>
          <div>
            <button className="text-red-500">Delete my account</button>
          </div>
        </div>

        {/* Devices */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Devices</h2>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Log out of all other devices</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
              Log out of all devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
