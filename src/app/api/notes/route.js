import connect from '@/lib/dbConnection';
import Note from '@/models/Note';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await connect();
    console.log('Database connected successfully');

    // Leer el cuerpo de la solicitud como JSON
    const body = await req.json();
    const { note_title, topic, note } = body;

    // Obtener el token del header Authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'JWT must be provided' }), {
        status: 400,
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar y decodificar el token para obtener el userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;  // Obtenemos el ID del usuario del token
    console.log('User ID from token:', userId);

    // Verificar si el título de la nota ya existe para este usuario
    const existingTitle = await Note.findOne({ note_title, user_id: userId });
    if (existingTitle) {
      return new Response(JSON.stringify({ message: 'This TITLE already exists' }), {
        status: 400,
      });
    }

    // Crear una nueva nota con el userId incluido
    const newNote = new Note({
      note_title,
      topic,
      note,
      user_id: userId,  // Incluimos el ID del usuario que está creando la nota
    });

    try {
      await newNote.save();
      console.log('Note saved successfully');
      return new Response(JSON.stringify({ message: 'Note registered successfully', note: newNote }), {
        status: 201,
      });
    } catch (saveError) {
      console.error('Error saving note:', saveError);
      return new Response(JSON.stringify({ message: 'Error saving note' }), {
        status: 500,
      });
    }

  } catch (error) {
    console.error('General error:', error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    await connect();
    console.log('Database connected successfully');

    const authHeader = req.headers.get('Authorization'); // Usar `get` para obtener el header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'JWT must be provided' }), {
        status: 400,
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;  // Obtenemos el ID del usuario del token
    console.log('User ID from token:', userId);

    // Obtener las notas que pertenecen al usuario autenticado
    const userNotes = await Note.find({ user_id: userId });

    return new Response(JSON.stringify(userNotes), { status: 200 });
  } catch (error) {
    console.error('General error:', error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), {
      status: 500,
    });
  }
}
