import jwt from 'jsonwebtoken';
import connect from '@/lib/connect';
import Note from '@/models/Note';

export async function GET(req) {
  try {
    await connect();

    // Obtener el token JWT del header de autorización
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Verificar el token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 403 });
    }

    // Buscar las notas del usuario autenticado
    const notes = await Note.find({ user_id: decoded.userId });

    return new Response(JSON.stringify(notes), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), {
      status: 500,
    });
  }
}
