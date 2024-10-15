import jwt from 'jsonwebtoken';

export async function validateSession(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const token = authHeader.split(' ')[1]; // Obtener el token del encabezado

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adjuntamos el usuario a la solicitud
    return true;
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Invalid or expired token' }), { status: 401 });
  }
}
