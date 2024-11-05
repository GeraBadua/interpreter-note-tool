import React, { useState, useEffect, useRef } from 'react';
import { Settings, UserCircle, LogOut, ChevronDown } from 'lucide-react';

const ProfileMenu = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const menuRef = useRef(null);

  useEffect(() => {
    // Obtener el nombre de usuario del localStorage o de donde lo tengas guardado
    const storedName = localStorage.getItem('userName') || 'User';
    setUserName(storedName);

    // Cerrar el menú cuando se hace clic fuera
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuItemClick = (action) => {
    if (action === 'logout') {
      onLogout();
    } else if (action === 'profile') {
      window.location.href = '/profile';
    } else if (action === 'settings') {
      window.location.href = '/settings';
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full bg-[#76a82c] flex items-center justify-center text-white">
          <UserCircle size={32} />
        </div>
        <ChevronDown
          className={`transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          size={20}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
              <p className="font-medium">{userName}</p>
            </div>

            <button
              onClick={() => handleMenuItemClick('profile')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <UserCircle className="mr-3" size={16} />
              Profile
            </button>

            <button
              onClick={() => handleMenuItemClick('settings')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings className="mr-3" size={16} />
              Settings
            </button>

            <button
              onClick={() => handleMenuItemClick('logout')}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut className="mr-3" size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;