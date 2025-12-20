
import { POST } from '../../src/app/api/intreg/route';
import User from '../../src/models/User';
import bcrypt from 'bcryptjs';
import { createMocks } from 'node-mocks-http';
import mongoose from 'mongoose';

// Mock dependencies
jest.mock('../../src/lib/dbConnection', () => jest.fn());
jest.mock('../../src/models/User');
jest.mock('bcryptjs');

describe('Interpreter Registration API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register a new interpreter successfully', async () => {
        // Mock user finding (none exists)
        User.findOne.mockResolvedValue(null);
        // Mock password hashing
        bcrypt.hash.mockResolvedValue('hashed_password');
        // Mock user save
        User.prototype.save = jest.fn().mockResolvedValue({});

        const { req } = createMocks({
            method: 'POST',
        });

        req.json = jest.fn().mockResolvedValue({
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
        });

        const res = await POST(req);

        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data.message).toBe('Interpreter registered successfully');
        expect(User.prototype.save).toHaveBeenCalled();
    });

    it('should return 400 if password is weak', async () => {
        const { req } = createMocks({
            method: 'POST',
        });

        req.json = jest.fn().mockResolvedValue({
            username: 'testuser',
            email: 'test@example.com',
            password: 'weak',
        });

        const res = await POST(req);

        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.message).toContain('Password must be at least');
    });

    it('should return 400 if email already exists', async () => {
        User.findOne.mockResolvedValue({ email: 'test@example.com' });

        const { req } = createMocks({
            method: 'POST',
        });

        req.json = jest.fn().mockResolvedValue({
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
        });

        const res = await POST(req);

        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.message).toBe('Email already exists');
    });
});
