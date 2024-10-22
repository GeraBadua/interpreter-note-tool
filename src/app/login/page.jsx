'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Spinner from '../components/Spinner'; // Correct relative path

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true before the API call

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();
    setLoading(false); // Reset loading state after receiving response

    if (res.ok) {
      setMessage('Login successful!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      const event = new Event('login');
      window.dispatchEvent(event);

      router.push('/home');
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#9c7efd]">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden flex max-w-4xl w-full">
        <div className="w-1/2 relative">
          <Image
            src="/images/imageLogin.jpeg"
            alt="Login Image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-[#231373] bg-opacity-50 flex flex-col justify-center p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
            <p className="mb-6">Login to your account to get full experience</p>
          </div>
        </div>

        <div className="w-1/2 p-12">
          <h1 className="text-3xl font-bold text-[#231373] mb-6">Hello!<br/>Good Morning</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-black mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
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
                className="text-black mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                  focus:outline-none focus:border-[#76a82c] focus:ring-1 focus:ring-[#76a82c]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-[#76a82c] hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#76a82c] hover:bg-[#9c7efd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#76a82c]"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-black">
            Don&apos;t have an account? {' '}
            <Link href="/register" className="text-[#76a82c] hover:underline">
              Create Account
            </Link>
          </p>
          {message && (
            <p className={`mt-4 text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
          {loading && <Spinner />} {/* Display Spinner when loading */}
        </div>
      </div>
    </div>
  );
};

export default Login;
