import jwt from 'jsonwebtoken';

// Middleware para verificar el token JWT
export function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];  // Obtén el token del encabezado Authorization

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  // Verifica el token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Almacena el ID del usuario decodificado en la solicitud
    req.userId = decoded.id;
    next();
  });
}
