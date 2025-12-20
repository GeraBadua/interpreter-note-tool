'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
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
      if (res.ok) {
        setMessage('Login successful!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);

        const event = new Event('login');
        window.dispatchEvent(event);

        if (data.role === 'Admin') {
          router.push('/admin');
        } else if (data.role === 'Interpreter') {
          router.push('/home');
        } else {
          setMessage('Unknown role: ' + data.role);
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-paper rounded-2xl shadow-xl overflow-hidden flex max-w-4xl w-full border border-gray-100">

        {/* Left Side - Image */}
        <div className="w-1/2 relative hidden md:block">
          <Image
            src="/images/imageLogin.jpeg"
            alt="Login Image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            style={{ objectFit: 'cover' }}
            className="grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-secondary/80 flex flex-col justify-center p-12 text-white/90 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
            <p className="mb-6 leading-relaxed">Login to your account to access your smart interpreter notebook and collaborative tools.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-12">
          <h1 className="text-3xl font-bold text-secondary mb-2">Hello!</h1>
          <p className="text-gray-500 mb-8">Good Morning, please login to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="name@example.com"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-sm text-primary hover:text-secondary font-medium transition-colors">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary hover:bg-opacity-90 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform active:scale-[0.98] transition-all"
            >
              Login
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-gray-600">
            Don&apos;t have an account? {' '}
            <Link href="/" className="text-primary hover:text-secondary font-bold hover:underline transition-colors">
              Create Account
            </Link>
          </p>
          {message && (
            <div className={`mt-4 p-3 rounded text-sm text-center ${message.includes('successful') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
