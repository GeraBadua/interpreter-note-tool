'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
    
    const data = await res.json();
    if (res.ok) {
      setMessage('Registration successful!');
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#9c7efd]">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden flex max-w-4xl w-full">
        {/* Lado izquierdo con imagen */}
        <div className="w-1/2 relative">
          <Image
            src="/images/imageRegister.jpeg"
            alt="Register Image"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-[#231373] bg-opacity-50 flex flex-col justify-center p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Join Us Today!</h2>
            <p className="mb-6">Create an account to start your journey</p>
          </div>
        </div>
        
        {/* Lado derecho con formulario */}
        <div className="w-1/2 p-12">
          <h1 className="text-3xl font-bold text-[#231373] mb-6">Create Account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                  focus:outline-none focus:border-[#76a82c] focus:ring-1 focus:ring-[#76a82c]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                  focus:outline-none focus:border-[#76a82c] focus:ring-1 focus:ring-[#76a82c]"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                  focus:outline-none focus:border-[#76a82c] focus:ring-1 focus:ring-[#76a82c]"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#76a82c] hover:bg-[#9c7efd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#76a82c]"
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-black">
            Already have an account? {' '}
            <Link href="/login" className="text-[#76a82c] hover:underline">
              Login here
            </Link>
          </p>
          {message && (
            <p className={`mt-4 text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
