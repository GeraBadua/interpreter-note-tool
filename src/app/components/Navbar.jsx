"use client";  // Indica que este es un Client Component

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';  // Importa el hook de navegación correcto

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(''); // Estado para el rol del usuario
  const router = useRouter();

  // Función para verificar el estado del login y rol
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    if (userRole) {
      setRole(userRole);
    }
  };

  useEffect(() => {
    // Verificar si el token está en localStorage al cargar la página
    checkLoginStatus();

    // Escuchar el evento personalizado 'login' para actualizar la navbar
    window.addEventListener('login', checkLoginStatus);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('login', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token del localStorage
    localStorage.removeItem('role');  // Eliminar el rol del localStorage
    setIsLoggedIn(false); // Actualizar el estado a no logueado
    setRole('');          // Limpiar el rol
    router.push('/');     // Redireccionar al inicio
  };

  return (
    <nav className="bg-[#231373] p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Cambiamos el href del Link dependiendo del estado de isLoggedIn */}
        <Link href={isLoggedIn ? "/home" : "/"} className="text-2xl font-bold">
          Interpreter Note Tool
        </Link>
        <div className="flex items-center">
          {isLoggedIn && <span className="mr-4">{role}</span>}  {/* Mostrar el rol */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-[#ff5c5c] hover:bg-[#e04a4a] text-white px-4 py-2 rounded"
            >
              Logout
            </button>
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
