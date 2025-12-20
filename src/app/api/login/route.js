import connect from '../../../lib/dbConnection';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await connect();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email and password are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
      // { expiresIn: '1h' }
    );

    return new Response(
      JSON.stringify({ token, role: user.role }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Login error:', error);

    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
