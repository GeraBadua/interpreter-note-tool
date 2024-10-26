import connect from '@/lib/dbConnection';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connect();

    // Leer el cuerpo de la solicitud como JSON
    const body = await req.json(); // Corregido: Aquí usamos await req.json() para obtener el cuerpo JSON
    const { username, email, password, role } = body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validacion para el formato de la contraseña
    const validatePassword = (password) => {
      return passwordRegex.test(password);
    };

      // Validar que la contraseña cumple con los requisitos
    if (!validatePassword(password)) {
    return new Response(
      JSON.stringify({
        message:
          'Password must be at least 8 characters long, and include uppercase letters, lowercase letters, numbers, and special characters.',
      }),
      { status: 400 }
    );
  }

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
