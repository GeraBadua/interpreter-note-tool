"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

    // Cerrar el dropdown cuando se hace clic fuera
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('login', checkLoginStatus);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole('');
    setIsDropdownOpen(false);
    router.push('/');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    router.push('/profileMenu');
  };

  return (
    <nav className="bg-[#231373] p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={isLoggedIn ? "/home" : "/"} className="text-2xl font-bold">
          Interpreter Note Tool
        </Link>
        <div className="flex items-center">
          {isLoggedIn && <span className="mr-4">{role}</span>}
          {isLoggedIn ? (
            <div className="relative dropdown-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="bg-[#76a82c] hover:bg-[#9c7efd] text-white px-4 py-2 rounded flex items-center gap-2"
              >
                Mi Cuenta
                <span className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <span className="mr-2">👤</span>
                    Mi Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 w-full"
                  >
                    <span className="mr-2">↪️</span>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="bg-[#76a82c] hover:bg-[#9c7efd] text-white px-4 py-2 rounded">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
