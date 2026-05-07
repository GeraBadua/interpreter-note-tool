import bcrypt from 'bcryptjs';

const DEMO_USERS = [
  {
    _id: 'demo-admin',
    username: 'Demo Admin',
    email: 'admin@demo.com',
    password_hash: bcrypt.hashSync('Admin123!', 10),
    role: 'Admin',
  },
  {
    _id: 'demo-interpreter',
    username: 'Demo Interpreter',
    email: 'interpreter@demo.com',
    password_hash: bcrypt.hashSync('Interpreter123!', 10),
    role: 'Interpreter',
  },
];

export const DEMO_NOTES = [
  {
    _id: 'demo-note-1',
    note_title: 'Welcome Brief',
    topic: 'Orientation',
    note: 'This is a demo note. Your notes will appear here once connected to MongoDB.',
    user_id: 'demo-interpreter',
    created_at: new Date('2024-09-01T10:00:00.000Z'),
    updated_at: new Date('2024-09-01T10:00:00.000Z'),
  },
  {
    _id: 'demo-note-2',
    note_title: 'Session Highlights',
    topic: 'Medical',
    note: 'Key terms: patient history, medication dosage, follow-up instructions.',
    user_id: 'demo-interpreter',
    created_at: new Date('2024-09-02T14:30:00.000Z'),
    updated_at: new Date('2024-09-02T14:30:00.000Z'),
  },
];

export const getDemoUsers = () => DEMO_USERS;

export const findDemoUserByEmail = (email) => {
  return DEMO_USERS.find((user) => user.email === email);
};
