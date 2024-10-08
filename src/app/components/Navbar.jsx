"use client";  // Indica que este es un Client Component

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';  // Importa el hook de navegación correcto

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el token está en localStorage al cargar la página
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Si existe el token, establecer isLoggedIn a true
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token del localStorage
    setIsLoggedIn(false); // Actualizar el estado a no logueado
    router.push('/login'); // Redireccionar al inicio o cualquier otra ruta deseada
  };

  return (
    <nav className="bg-[#231373] p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Interpreter Note Tool</Link>
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
    </nav>
  );
};

export default Navbar;
