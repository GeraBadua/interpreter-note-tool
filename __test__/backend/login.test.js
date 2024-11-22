// __tests__/api/login/route.test.js

import { POST } from '../../src/app/api/login/route';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../src/models/User';
import { createMocks } from 'node-mocks-http';
import fetchMock from 'jest-fetch-mock'; // Importa fetchMock aquí

jest.mock('../../src/lib/dbConnection', () => jest.fn());
jest.mock('../../src/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Login API', () => {
  const validUser = {
    _id: 'valid_user_id',
    email: 'test@example.com',
    password_hash: 'hashed_password',
    role: 'user',
  };

  beforeEach(() => {
    User.findOne.mockClear();
    bcrypt.compare.mockClear();
    jwt.sign.mockClear();
    fetchMock.resetMocks(); // Restablece los mocks después de cada prueba
  });

  it('should return a token and role for valid credentials', async () => {
    User.findOne.mockResolvedValue(validUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake_token');

    const { req } = createMocks({
      method: 'POST',
    });

    req.json = jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'password123' });

    // Simulamos la respuesta usando fetchMock
    fetchMock.mockResponseOnce(JSON.stringify({ token: 'fake_token', role: 'user' }), { status: 200 });

    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('token', 'fake_token');
    expect(data).toHaveProperty('role', 'user');
  });

  it('should return a 400 error for invalid email', async () => {
    User.findOne.mockResolvedValue(null);

    const { req } = createMocks({
      method: 'POST',
    });

    req.json = jest.fn().mockResolvedValue({ email: 'wrong@example.com', password: 'password123' });

    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Invalid email or password' }), { status: 400 });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toBe('Invalid email or password');
  });

  it('should return a 400 error for incorrect password', async () => {
    User.findOne.mockResolvedValue(validUser);
    bcrypt.compare.mockResolvedValue(false);

    const { req } = createMocks({
      method: 'POST',
    });

    req.json = jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'wrongpassword' });

    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Invalid email or password' }), { status: 400 });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toBe('Invalid email or password');
  });
});
