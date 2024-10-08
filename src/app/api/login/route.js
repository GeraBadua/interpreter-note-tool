import connect from '@/lib/dbConnection';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  await connect();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
      status: 400,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
      status: 400,
    });
  }

  const token = jwt.sign(
    { id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return new Response(JSON.stringify({ token }), { status: 200 });
}
