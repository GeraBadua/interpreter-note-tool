'use client'; // Este archivo es un componente del lado del cliente

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importar el hook de navegación

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter(); // Instanciar el router

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      localStorage.setItem('token', data.token); // Guardar token en localStorage
      router.push('/'); // Redirigir al usuario a la página principal
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input className='text-black'
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input className='text-black'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
