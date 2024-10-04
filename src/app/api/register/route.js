import connect from '@/../lib/connect';
import User from '@/../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connect();

    // Leer el cuerpo de la solicitud como JSON
    const body = await req.json(); // Corregido: Aquí usamos await req.json() para obtener el cuerpo JSON
    const { username, email, password, role } = body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'Email already exists' }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password_hash: hashedPassword,
      role,
    });

    await newUser.save();

    return new Response(JSON.stringify({ message: 'User registered successfully' }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), {
      status: 500,
    });
  }
}
