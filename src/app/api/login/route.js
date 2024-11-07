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

  // Usamos el _id generado por MongoDB en el token
  const token = jwt.sign(
    { id: user._id, role: user.role },  // Cambiamos de user.user_id a user._id
    process.env.JWT_SECRET,
    // { expiresIn: '1h' }
  );

  // Devolvemos el token junto con el rol
  return new Response(JSON.stringify({ token, role: user.role }), { status: 200 });
}
