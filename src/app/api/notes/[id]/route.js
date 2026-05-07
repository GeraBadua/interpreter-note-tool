import connect, { isDemoMode } from '@/lib/dbConnection';
import Note from '@/models/Note';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '@/lib/auth';

export async function DELETE(req, { params }) {
    try {
        await connect();
        const { id } = params;

        const authHeader = req.headers.get('Authorization');
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
        const userId = decoded.id;

        if (!userId) {
            return new Response(JSON.stringify({ message: 'Invalid token' }), {
                status: 401,
            });
        }

        if (isDemoMode()) {
            return new Response(JSON.stringify({ message: 'Note deleted successfully' }), {
                status: 200,
            });
        }

        const note = await Note.findById(id);

        if (!note) {
            return new Response(JSON.stringify({ message: 'Note not found' }), {
                status: 404,
            });
        }

        // Ensure the user owns the note
        if (note.user_id.toString() !== userId) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), {
                status: 403,
            });
        }

        await Note.findByIdAndDelete(id);

        return new Response(JSON.stringify({ message: 'Note deleted successfully' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error deleting note:', error);
        return new Response(JSON.stringify({ message: 'Server error' }), {
            status: 500,
        });
    }
}
