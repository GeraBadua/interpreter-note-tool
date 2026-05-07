import connect, { isDemoMode } from '@/lib/dbConnection';
import Note from '@/models/Note';
import jwt from 'jsonwebtoken';
import { DEMO_NOTES } from '@/lib/demoData';
import { getJwtSecret } from '@/lib/auth';

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
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
      return new Response(JSON.stringify({ message: 'Missing JWT secret' }), {
        status: 500,
      });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.id;  // Obtenemos el ID del usuario del token
    console.log('User ID from token:', userId);

    if (isDemoMode()) {
      const demoNote = {
        _id: `demo-note-${Date.now()}`,
        note_title,
        topic,
        note,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      };

      return new Response(JSON.stringify({ message: 'Note registered successfully', note: demoNote }), {
        status: 201,
      });
    }

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
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
      return new Response(JSON.stringify({ message: 'Missing JWT secret' }), {
        status: 500,
      });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.id;  // Obtenemos el ID del usuario del token
    console.log('User ID from token:', userId);

    if (isDemoMode()) {
      const demoNotes = DEMO_NOTES.filter((noteItem) => noteItem.user_id === userId);
      return new Response(JSON.stringify(demoNotes), { status: 200 });
    }

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
