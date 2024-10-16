import connect from '@/../lib/connect';
import Note from '@/../models/Note';

export async function POST(req) {
  try {
    await connect();

    // Leer el cuerpo de la solicitud como JSON
    const body = await req.json(); // Corregido: Aquí usamos await req.json() para obtener el cuerpo JSON
    const { note_title, topic, note } = body;

    // Verificar si el usuario ya existe
    const existingTitle = await Note.findOne({ note_title });
    if (existingTitle) {
      return new Response(JSON.stringify({ message: 'This TITLE already exists' }), {
        status: 400,
      });
    }

    const newNote = new Note({
      note_title,
      topic,
      note,
    });

    await newNote.save();

    return new Response(JSON.stringify({ message: 'Note registered successfully' }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), {
      status: 500,
    });
  }
}
