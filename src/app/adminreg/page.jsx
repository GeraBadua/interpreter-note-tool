'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/adminreg', {
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
        setMessage('Admin registration successful!');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setMessage(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Left Side - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-secondary overflow-hidden">
        <Image
          src="/images/imageRegister.jpeg"
          alt="Admin Team"
          fill
          priority
          className="object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 to-primary/80" />
        <div className="absolute inset-0 flex flex-col justify-center px-16 text-white z-10">
          <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
            Lead the <br />Conversation.
          </h1>
          <p className="text-xl text-gray-200 font-light max-w-md leading-relaxed">
            Join as an Administrator to manage interpreters, oversee notes, and ensure seamless communication across teams.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-secondary tracking-tight">Create Admin Account</h2>
            <p className="mt-2 text-gray-500">Sign up to manage the platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white text-secondary placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white text-secondary placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white text-secondary placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-primary hover:bg-opacity-90 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Sign Up as Admin'
              )}
            </button>
          </form>

          <div className="pt-4 text-center border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:text-opacity-80 transition-colors">
                Log in here
              </Link>
            </p>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium text-center animate-fade-in ${message.includes('successful') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
