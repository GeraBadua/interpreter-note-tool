"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const router = useRouter();

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    if (userRole) {
      setRole(userRole);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener('login', checkLoginStatus);
    return () => {
      window.removeEventListener('login', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole('');
    router.push('/');
  };

  return (
    <nav className="bg-paper/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href={isLoggedIn ? "/home" : "/"} className="text-2xl font-bold text-primary flex items-center gap-2 tracking-tight hover:opacity-80 transition-opacity">
          Interpreter Note Tool
        </Link>
        <div className="flex items-center gap-6">
          {isLoggedIn && (
            <span className="text-secondary font-medium px-3 py-1 bg-gray-50 rounded-full text-sm border border-gray-100 shadow-sm capitalize">
              {role || 'User'}
            </span>
          )}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 px-5 py-2 rounded-xl transition-all font-medium border border-red-100 shadow-sm"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-primary hover:bg-opacity-90 text-white px-6 py-2.5 rounded-xl transition-all font-medium shadow-md hover:shadow-lg active:scale-95"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
