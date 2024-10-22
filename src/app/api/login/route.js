import connect from '@/lib/dbConnection';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  await connect();

  // Parse email and password from request body
  const { email, password } = await req.json();

  // Check if the user exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
      status: 400,
    });
  }

  // Check if the provided password matches the stored hash
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
      status: 400,
    });
  }

  // Generate a JWT token with the user's ID and role
  const token = jwt.sign(
    { id: user._id, role: user.role },  // Include the user's role in the token payload
    process.env.JWT_SECRET,
    { expiresIn: '1h' }  // Token expires in 1 hour
  );

  // Return the token and role in the response
  return new Response(JSON.stringify({ token, role: user.role }), { status: 200 });
}
