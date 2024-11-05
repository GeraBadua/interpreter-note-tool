/ __tests__/Login.test.js
import { render, screen, fireEvent } from '@testing-library/react';
// __tests__/simpleLogin.test.js

// Define una función de login simulada
function login(username, password) {
  const mockUsername = 'usuarioPrueba';
  const mockPassword = 'contraseñaPrueba';

  return username === mockUsername && password === mockPassword;
}

test('login exitoso con credenciales correctas', () => {
  const result = login('usuarioPrueba', 'contraseñaPrueba');
  expect(result).toBe(true);
});

test('fallo de login con credenciales incorrectas', () => {
  const result = login('usuarioIncorrecto', 'contraseñaIncorrecta');
  expect(result).toBe(false);
});
